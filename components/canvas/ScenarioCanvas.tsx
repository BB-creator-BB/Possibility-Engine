'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Background,
  BackgroundVariant,
  MiniMap,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type NodeTypes,
} from '@xyflow/react';
import { ArrowUpRight, Compass, Loader2, Sparkles } from 'lucide-react';
import { useScenarioStore } from '@/store/useScenarioStore';
import {
  computeScenarioLayout,
  NODE_HEIGHT,
  NODE_WIDTH,
} from '@/lib/tree-layout';
import { ScenarioNode } from '@/components/canvas/ScenarioNode';
import { CanvasControls } from '@/components/canvas/CanvasControls';

const STARTER_SEEDS = [
  {
    premise: 'Energy is free',
    tag: 'CANONICAL',
    hint: 'Marginal energy cost collapses to zero; trace thermodynamic & sovereign shifts.',
  },
  {
    premise: 'AGI replaces all management',
    tag: 'COORDINATION',
    hint: 'Zero-cost algorithmic orchestration dissolves corporate hierarchies.',
  },
  {
    premise: 'Humans live 200 years',
    tag: 'LONGEVITY',
    hint: 'Multi-century lifespans break generational turnover of capital and power.',
  },
];

interface ScenarioCanvasProps {
  onSeedSubmit: (premise: string) => void;
  onRequestFork: (nodeId: string) => void;
}

const nodeTypes: NodeTypes = {
  scenarioNode: ScenarioNode,
};

function ScenarioCanvasInner({
  onSeedSubmit,
  onRequestFork,
}: ScenarioCanvasProps) {
  const nodesRecord = useScenarioStore((s) => s.nodes);
  const activeNodeId = useScenarioStore((s) => s.activeNodeId);
  const isGenerating = useScenarioStore((s) => s.isGenerating);
  const setActiveNode = useScenarioStore((s) => s.setActiveNode);

  const [showMinimap, setShowMinimap] = useState(true);
  const { setCenter, fitView } = useReactFlow();
  const prevCountRef = useRef<number>(0);

  const { nodes, edges } = useMemo(
    () =>
      computeScenarioLayout(nodesRecord, activeNodeId, {
        onSelect: setActiveNode,
        onRequestFork,
      }),
    [nodesRecord, activeNodeId, setActiveNode, onRequestFork]
  );

  // Smoothly focus newly added nodes or fit the initial root node
  useEffect(() => {
    const count = nodes.length;
    if (count === 0) {
      prevCountRef.current = 0;
      return;
    }

    if (count !== prevCountRef.current) {
      const target = nodes.find((n) => n.id === activeNodeId) ?? nodes[count - 1];
      if (count === 1) {
        const timer = setTimeout(() => {
          fitView({ padding: 0.45, duration: 400, maxZoom: 1.05 });
        }, 60);
        prevCountRef.current = count;
        return () => clearTimeout(timer);
      } else if (target) {
        const timer = setTimeout(() => {
          setCenter(
            target.position.x + NODE_WIDTH / 2,
            target.position.y + NODE_HEIGHT / 2,
            { zoom: 0.92, duration: 450 }
          );
        }, 80);
        prevCountRef.current = count;
        return () => clearTimeout(timer);
      }
      prevCountRef.current = count;
    }
  }, [nodes, activeNodeId, fitView, setCenter]);

  const isEmpty = nodes.length === 0;

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#09090b]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.35, maxZoom: 1.05 }}
        minZoom={0.25}
        maxZoom={1.75}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
        proOptions={{ hideAttribution: true }}
        className="possibility-flow"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.2}
          color="#23232a"
        />

        {!isEmpty && (
          <Panel position="top-left" className="!m-3">
            <CanvasControls
              showMinimap={showMinimap}
              onToggleMinimap={() => setShowMinimap((v) => !v)}
              nodeCount={nodes.length}
            />
          </Panel>
        )}

        {!isEmpty && showMinimap && (
          <MiniMap
            position="top-right"
            pannable
            zoomable
            nodeStrokeWidth={2}
            maskColor="rgba(9, 9, 11, 0.72)"
            className="!m-3 !rounded-lg !border !border-[#27272d] !bg-[#111114]/90"
            nodeColor={(n) =>
              n.id === activeNodeId ? '#38bdf8' : '#3f3f46'
            }
          />
        )}
      </ReactFlow>

      {/* Empty Contemplative Start Overlay */}
      {isEmpty && !isGenerating && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 pb-28">
          <div className="pointer-events-auto w-full max-w-xl rounded-xl border border-[#27272d] bg-[#111114]/90 p-6 shadow-dock backdrop-blur-md">
            <div className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-sky-400">
              <Compass className="h-3.5 w-3.5" />
              First-Principles Possibility Space
            </div>
            <h1 className="mb-2 text-xl font-semibold tracking-tight text-zinc-100">
              Interrogate a foundational shift in reality.
            </h1>
            <p className="mb-5 text-sm leading-relaxed text-zinc-400">
              Enter any radical technological, physical, or social premise below.
              The engine decomposes collapsing constraints, traces multi-order
              causal ripples, and surfaces emergent paradoxes you can fork into
              diverging futures.
            </p>

            <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              Canonical Entry Points
            </div>
            <div className="grid gap-2">
              {STARTER_SEEDS.map((seed) => (
                <button
                  key={seed.premise}
                  type="button"
                  onClick={() => onSeedSubmit(seed.premise)}
                  className="group flex items-start justify-between gap-3 rounded-lg border border-[#27272d] bg-[#16161b]/80 px-3.5 py-2.5 text-left transition-all hover:border-sky-500/50 hover:bg-[#1a1d24]"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-zinc-100 group-hover:text-sky-200">
                        &ldquo;{seed.premise}&rdquo;
                      </span>
                      <span className="rounded border border-zinc-700/80 bg-zinc-800/80 px-1.5 py-0.5 font-mono text-[9px] tracking-wider text-zinc-400">
                        {seed.tag}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-zinc-500">{seed.hint}</p>
                  </div>
                  <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-sky-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subtle Reasoning Overlay while Generating */}
      {isGenerating && (
        <div className="pointer-events-none absolute inset-x-0 top-4 z-20 flex justify-center">
          <div className="flex items-center gap-2.5 rounded-full border border-sky-500/40 bg-[#111114]/95 px-4 py-2 shadow-dock backdrop-blur-md">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-sky-400" />
            <span className="font-mono text-xs tracking-wide text-sky-200">
              Propagating first-principles consequences…
            </span>
            <Sparkles className="h-3.5 w-3.5 text-sky-400/70" />
          </div>
        </div>
      )}
    </div>
  );
}

export function ScenarioCanvas(props: ScenarioCanvasProps) {
  return (
    <ReactFlowProvider>
      <ScenarioCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
