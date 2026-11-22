'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Header } from '@/components/navigation/Header';
import { ExportModal } from '@/components/navigation/ExportModal';
import { ScenarioCanvas } from '@/components/canvas/ScenarioCanvas';
import { NodeInspector } from '@/components/inspector/NodeInspector';
import { PremiseBar } from '@/components/input/PremiseBar';
import { ForkDialog } from '@/components/input/ForkDialog';
import { useScenarioStore } from '@/store/useScenarioStore';
import { getLineageIds } from '@/lib/tree-layout';
import { decodeScenarioFromHash } from '@/lib/url-share';
import {
  ReasoningPayloadSchema,
  type EmergentTension,
  type ReasonRequestBody,
  type ReasonResponseBody,
} from '@/types/scenario';

export default function PossibilityEnginePage() {
  const nodes = useScenarioStore((s) => s.nodes);
  const activeNodeId = useScenarioStore((s) => s.activeNodeId);
  const isGenerating = useScenarioStore((s) => s.isGenerating);
  const engineMode = useScenarioStore((s) => s.engineMode);
  const apiKey = useScenarioStore((s) => s.apiKey);

  const initializeScenario = useScenarioStore((s) => s.initializeScenario);
  const createBranch = useScenarioStore((s) => s.createBranch);
  const setGenerating = useScenarioStore((s) => s.setGenerating);
  const setError = useScenarioStore((s) => s.setError);
  const setLastRunMeta = useScenarioStore((s) => s.setLastRunMeta);
  const importScenarioJSON = useScenarioStore((s) => s.importScenarioJSON);

  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [forkState, setForkState] = useState<{
    open: boolean;
    parentNodeId: string | null;
    tension: EmergentTension | null;
  }>({
    open: false,
    parentNodeId: null,
    tension: null,
  });

  // Hydrate scenario tree from URL hash if present (`#scenario=...`)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.location.hash) return;
    const decoded = decodeScenarioFromHash(window.location.hash);
    if (decoded) {
      importScenarioJSON(JSON.stringify(decoded));
    }
  }, [importScenarioJSON]);

  const callReasoningApi = useCallback(
    async (requestBody: ReasonRequestBody) => {
      const response = await fetch('/api/reason', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const json = (await response.json()) as
        | ReasonResponseBody
        | { error?: string };

      if (!response.ok || !('data' in json)) {
        const errMessage =
          'error' in json && json.error
            ? json.error
            : `Reasoning request failed with HTTP ${response.status}.`;
        throw new Error(errMessage);
      }

      // Client-side Zod validation gate before rendering (Section 8 QA Gate 1)
      const validated = ReasoningPayloadSchema.safeParse(json.data);
      if (!validated.success) {
        throw new Error(
          'Received malformed reasoning payload that failed schema validation.'
        );
      }

      return {
        data: validated.data,
        meta: json.meta,
      };
    },
    []
  );

  const handleSeedSubmit = useCallback(
    async (premise: string) => {
      const trimmed = premise.trim();
      if (!trimmed || isGenerating) return;

      setGenerating(true);
      setError(null);

      try {
        const result = await callReasoningApi({
          premise: trimmed,
          mode: engineMode,
          apiKey: apiKey || undefined,
        });

        initializeScenario(trimmed, {
          premise: trimmed,
          summary: result.data.summary,
          domainImpacts: result.data.domainImpacts,
          ripples: result.data.ripples,
          tensions: result.data.tensions,
        });
        setLastRunMeta(result.meta.engine, result.meta.fallbackReason ?? null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to evaluate seed premise.'
        );
      } finally {
        setGenerating(false);
      }
    },
    [
      apiKey,
      callReasoningApi,
      engineMode,
      initializeScenario,
      isGenerating,
      setError,
      setGenerating,
      setLastRunMeta,
    ]
  );

  const handleRequestFork = useCallback(
    (nodeId: string, tension?: EmergentTension) => {
      setForkState({
        open: true,
        parentNodeId: nodeId,
        tension: tension ?? null,
      });
    },
    []
  );

  const handleOpenForkForActive = useCallback(() => {
    if (!activeNodeId) return;
    handleRequestFork(activeNodeId);
  }, [activeNodeId, handleRequestFork]);

  const handleSubmitFork = useCallback(
    async (params: {
      parentNodeId: string;
      intervention: string;
      divergenceTrigger?: string;
    }) => {
      const parent = nodes[params.parentNodeId];
      if (!parent || isGenerating) return;

      setGenerating(true);
      setError(null);

      const lineageIds = getLineageIds(nodes, parent.id);
      const lineage = lineageIds
        .map((id) => nodes[id])
        .filter(Boolean)
        .map((n) => ({
          premise: n.premise,
          summary: n.summary,
          divergenceTrigger: n.divergenceTrigger,
        }));

      try {
        const result = await callReasoningApi({
          premise: params.intervention,
          parentNode: {
            premise: parent.premise,
            summary: parent.summary,
            ripples: parent.ripples,
            tensions: parent.tensions,
          },
          lineage,
          divergenceTrigger: params.divergenceTrigger,
          mode: engineMode,
          apiKey: apiKey || undefined,
        });

        createBranch(parent.id, params.intervention, {
          premise: params.intervention,
          summary: result.data.summary,
          domainImpacts: result.data.domainImpacts,
          ripples: result.data.ripples,
          tensions: result.data.tensions,
          divergenceTrigger: params.divergenceTrigger,
        });
        setLastRunMeta(result.meta.engine, result.meta.fallbackReason ?? null);
        setForkState({ open: false, parentNodeId: null, tension: null });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to generate scenario branch.'
        );
      } finally {
        setGenerating(false);
      }
    },
    [
      apiKey,
      callReasoningApi,
      createBranch,
      engineMode,
      isGenerating,
      nodes,
      setError,
      setGenerating,
      setLastRunMeta,
    ]
  );

  const forkParentNode = forkState.parentNodeId
    ? nodes[forkState.parentNodeId] ?? null
    : null;

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#09090b]">
      {/* Fixed 56px Header Bar */}
      <Header onOpenExportModal={() => setExportModalOpen(true)} />

      {/* Main Split-View Workspace (62% Canvas / 38% Inspector on desktop) */}
      <main className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Interactive Canvas Area (60–65% Viewport Width) */}
        <section
          aria-label="Scenario tree canvas"
          className="relative h-[55%] w-full lg:h-full lg:w-[62%]"
        >
          <ScenarioCanvas
            onSeedSubmit={handleSeedSubmit}
            onRequestFork={(nodeId) => handleRequestFork(nodeId)}
          />
          <PremiseBar
            onSeedSubmit={handleSeedSubmit}
            onOpenFork={handleOpenForkForActive}
          />
        </section>

        {/* Persistent Scrollable Inspector Panel (35–40% Viewport Width) */}
        <section
          aria-label="Node intelligence inspector"
          className="h-[45%] w-full lg:h-full lg:w-[38%]"
        >
          <NodeInspector onRequestFork={handleRequestFork} />
        </section>
      </main>

      {/* Modals */}
      <ForkDialog
        open={forkState.open}
        onOpenChange={(open) =>
          setForkState((prev) => ({
            ...prev,
            open,
            ...(open ? {} : { parentNodeId: null, tension: null }),
          }))
        }
        parentNode={forkParentNode}
        selectedTension={forkState.tension}
        isGenerating={isGenerating}
        onSubmitFork={handleSubmitFork}
      />

      <ExportModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
      />
    </div>
  );
}
