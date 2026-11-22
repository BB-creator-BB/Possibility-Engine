'use client';

import React, { useMemo, useState } from 'react';
import {
  ChevronRight,
  GitBranch,
  Layers,
  Network,
  Sparkles,
  Waypoints,
  Zap,
} from 'lucide-react';
import { useScenarioStore } from '@/store/useScenarioStore';
import { getLineageIds } from '@/lib/tree-layout';
import { cn, DOMAIN_META } from '@/lib/domain-meta';
import type { EmergentTension, SystemicDomain } from '@/types/scenario';
import { DomainImpactCard } from '@/components/inspector/DomainImpactCard';
import { RippleTimeline } from '@/components/inspector/RippleTimeline';
import { ParadoxDeck } from '@/components/inspector/ParadoxDeck';

interface NodeInspectorProps {
  onRequestFork: (nodeId: string, tension?: EmergentTension) => void;
}

export function NodeInspector({ onRequestFork }: NodeInspectorProps) {
  const nodes = useScenarioStore((s) => s.nodes);
  const activeNodeId = useScenarioStore((s) => s.activeNodeId);
  const isGenerating = useScenarioStore((s) => s.isGenerating);
  const setActiveNode = useScenarioStore((s) => s.setActiveNode);

  const [domainFilter, setDomainFilter] = useState<SystemicDomain | 'all'>('all');

  const activeNode = activeNodeId ? nodes[activeNodeId] ?? null : null;

  const lineage = useMemo(() => {
    const ids = getLineageIds(nodes, activeNodeId);
    return ids.map((id) => nodes[id]).filter(Boolean);
  }, [nodes, activeNodeId]);

  const siblings = useMemo(() => {
    if (!activeNode || !activeNode.parentId) return [];
    return Object.values(nodes)
      .filter(
        (n) => n.parentId === activeNode.parentId && n.id !== activeNode.id
      )
      .sort((a, b) => a.createdAt - b.createdAt);
  }, [nodes, activeNode]);

  const children = useMemo(() => {
    if (!activeNode) return [];
    return Object.values(nodes)
      .filter((n) => n.parentId === activeNode.id)
      .sort((a, b) => a.createdAt - b.createdAt);
  }, [nodes, activeNode]);

  const filteredImpacts = useMemo(() => {
    if (!activeNode) return [];
    if (domainFilter === 'all') return activeNode.domainImpacts;
    return activeNode.domainImpacts.filter((d) => d.domain === domainFilter);
  }, [activeNode, domainFilter]);

  if (!activeNode) {
    return (
      <aside className="flex h-full flex-col border-l border-[#27272d] bg-[#0e0e11]">
        <div className="border-b border-[#27272d] px-5 py-3.5">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            Intelligence Inspector
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-[#27272d] bg-[#141418] text-zinc-500">
            <Network className="h-5 w-5" />
          </div>
          <h2 className="mb-1.5 text-sm font-medium text-zinc-200">
            Awaiting Premise
          </h2>
          <p className="max-w-xs text-xs leading-relaxed text-zinc-500">
            Select a starter seed or enter your own speculative premise in the
            input dock to inspect multi-domain structural shifts, causal ripples,
            and emergent paradoxes.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex h-full flex-col border-l border-[#27272d] bg-[#0e0e11]">
      {/* Sticky Top Bar: Breadcrumb + Fork CTA */}
      <div className="shrink-0 border-b border-[#27272d] bg-[#101014] px-5 py-3">
        {/* Lineage Breadcrumb */}
        <nav
          aria-label="Scenario lineage"
          className="mb-2 flex flex-wrap items-center gap-1 font-mono text-[10px] text-zinc-500"
        >
          {lineage.map((step, idx) => {
            const isCurrent = step.id === activeNode.id;
            return (
              <React.Fragment key={step.id}>
                {idx > 0 && (
                  <ChevronRight className="h-3 w-3 shrink-0 text-zinc-700" />
                )}
                <button
                  type="button"
                  onClick={() => setActiveNode(step.id)}
                  className={cn(
                    'max-w-[140px] truncate rounded px-1.5 py-0.5 transition-colors',
                    isCurrent
                      ? 'bg-sky-500/15 text-sky-300'
                      : 'hover:bg-zinc-800 hover:text-zinc-200'
                  )}
                  title={step.premise}
                >
                  {idx === 0 ? 'SEED' : `D${step.depth}`}: {step.premise}
                </button>
              </React.Fragment>
            );
          })}
        </nav>

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {activeNode.divergenceTrigger && (
              <div className="mb-1 inline-flex items-center gap-1 rounded border border-amber-500/25 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[9.5px] text-amber-300">
                <Zap className="h-2.5 w-2.5" />
                Forked from: {activeNode.divergenceTrigger}
              </div>
            )}
            <h2 className="text-[15px] font-semibold leading-snug text-zinc-50">
              {activeNode.premise}
            </h2>
          </div>

          <button
            type="button"
            disabled={isGenerating}
            onClick={() => onRequestFork(activeNode.id)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-sky-500/40 bg-sky-500/15 px-2.5 py-1.5 font-mono text-[11px] font-medium text-sky-200 transition-colors hover:bg-sky-500/25 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <GitBranch className="h-3.5 w-3.5" />
            Branch
          </button>
        </div>
      </div>

      {/* Scrollable Intelligence Body */}
      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
        {/* Macro-State Summary */}
        <section>
          <div className="mb-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            <Sparkles className="h-3 w-3 text-sky-400" />
            Macro-State Equilibrium
          </div>
          <p className="rounded-lg border border-sky-500/20 bg-sky-950/15 p-3.5 text-[13px] leading-relaxed text-zinc-100">
            {activeNode.summary}
          </p>
        </section>

        {/* Comparative Sibling / Child Trajectory Quick Links */}
        {(siblings.length > 0 || children.length > 0) && (
          <section className="space-y-2 rounded-lg border border-[#27272d] bg-[#131317] p-3">
            {siblings.length > 0 && (
              <div>
                <div className="mb-1.5 font-mono text-[9.5px] uppercase tracking-wider text-zinc-500">
                  Compare Sibling Branches ({siblings.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {siblings.map((sib) => (
                    <button
                      key={sib.id}
                      type="button"
                      onClick={() => setActiveNode(sib.id)}
                      className="max-w-full truncate rounded border border-zinc-700/80 bg-zinc-800/60 px-2 py-1 text-left text-[11px] text-zinc-300 transition-colors hover:border-sky-500/50 hover:text-sky-200"
                    >
                      ⇄ {sib.premise}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {children.length > 0 && (
              <div>
                <div className="mb-1.5 font-mono text-[9.5px] uppercase tracking-wider text-zinc-500">
                  Downstream Forks ({children.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {children.map((child) => (
                    <button
                      key={child.id}
                      type="button"
                      onClick={() => setActiveNode(child.id)}
                      className="max-w-full truncate rounded border border-sky-500/25 bg-sky-500/10 px-2 py-1 text-left text-[11px] text-sky-200 transition-colors hover:border-sky-400/60 hover:bg-sky-500/20"
                    >
                      ↳ {child.premise}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Section 1: Domain Shifts */}
        <section>
          <div className="mb-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
              <Layers className="h-3 w-3 text-emerald-400" />
              Domain Shifts ({activeNode.domainImpacts.length})
            </div>
          </div>

          {/* Domain Filter Pills */}
          <div className="mb-3 flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => setDomainFilter('all')}
              className={cn(
                'rounded border px-2 py-0.5 font-mono text-[10px] transition-colors',
                domainFilter === 'all'
                  ? 'border-zinc-500 bg-zinc-800 text-zinc-100'
                  : 'border-[#27272d] bg-transparent text-zinc-500 hover:text-zinc-300'
              )}
            >
              ALL
            </button>
            {activeNode.domainImpacts.map((imp) => {
              const meta = DOMAIN_META[imp.domain];
              const selected = domainFilter === imp.domain;
              return (
                <button
                  key={imp.domain}
                  type="button"
                  onClick={() =>
                    setDomainFilter(selected ? 'all' : imp.domain)
                  }
                  className={cn(
                    'rounded border px-2 py-0.5 font-mono text-[10px] transition-colors',
                    selected
                      ? meta.badgeClass
                      : 'border-[#27272d] bg-transparent text-zinc-500 hover:text-zinc-300'
                  )}
                >
                  {meta.shortCode}
                </button>
              );
            })}
          </div>

          <div className="space-y-2.5">
            {filteredImpacts.map((impact) => (
              <DomainImpactCard key={impact.domain} impact={impact} />
            ))}
          </div>
        </section>

        {/* Section 2: Causal Ripples */}
        <section>
          <div className="mb-3 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
            <Waypoints className="h-3 w-3 text-sky-400" />
            Causal Ripples
          </div>
          <RippleTimeline ripples={activeNode.ripples} />
        </section>

        {/* Section 3: Emerging Paradoxes */}
        <section className="pb-6">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
              <Zap className="h-3 w-3 text-amber-400" />
              Emerging Paradoxes ({activeNode.tensions.length})
            </div>
            <span className="font-mono text-[9.5px] text-zinc-500">
              Click any paradox to fork
            </span>
          </div>
          <ParadoxDeck
            tensions={activeNode.tensions}
            onForkFromTension={(tension) =>
              onRequestFork(activeNode.id, tension)
            }
            disabled={isGenerating}
          />
        </section>
      </div>
    </aside>
  );
}
