'use client';

import React, { useEffect, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  ArrowLeftRight,
  GitBranch,
  Loader2,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import type { EmergentTension, ScenarioNodeData } from '@/types/scenario';

interface ForkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentNode: ScenarioNodeData | null;
  selectedTension: EmergentTension | null;
  isGenerating: boolean;
  onSubmitFork: (params: {
    parentNodeId: string;
    intervention: string;
    divergenceTrigger?: string;
  }) => void;
}

function buildSuggestions(
  parentNode: ScenarioNodeData | null,
  tension: EmergentTension | null
): string[] {
  if (!parentNode) return [];

  const lowerPremise = parentNode.premise.toLowerCase();
  const lowerTension = tension?.title.toLowerCase() ?? '';

  // Canonical Section 7 walkthrough prompt right at the top
  if (
    lowerPremise.includes('energy') ||
    lowerTension.includes('heat') ||
    lowerTension.includes('thermal')
  ) {
    return [
      'Strict global quotas are imposed on atmospheric heat rejection, making thermal emissions the new currency',
      'Assume waste-heat dissipation forces all heavy industry off-planet within 15 years',
      'Sovereign states nationalize mineral deposits to retain geopolitical leverage',
    ];
  }

  if (tension) {
    return [
      `Institutions formally prioritize "${tension.competingForces[1]}" over "${tension.competingForces[0]}" through binding global treaties`,
      `A decentralized technological breakthrough bypasses the conflict between "${tension.competingForces[0]}" and "${tension.competingForces[1]}"`,
      `Public backlash triggers strict local moratoria against "${tension.competingForces[0]}"`,
    ];
  }

  return [
    'Introduce a hard physical or thermodynamic bottleneck that cannot be engineered away',
    'Assume adoption is strictly rationed to sovereign states rather than open to individuals',
    'Assume a countercultural movement legally establishes shielded opt-out zones',
  ];
}

export function ForkDialog({
  open,
  onOpenChange,
  parentNode,
  selectedTension,
  isGenerating,
  onSubmitFork,
}: ForkDialogProps) {
  const [intervention, setIntervention] = useState('');

  useEffect(() => {
    if (open) {
      setIntervention('');
    }
  }, [open, parentNode?.id, selectedTension?.title]);

  const suggestions = useMemo(
    () => buildSuggestions(parentNode, selectedTension),
    [parentNode, selectedTension]
  );

  if (!parentNode) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = intervention.trim();
    if (!trimmed || isGenerating) return;
    onSubmitFork({
      parentNodeId: parentNode.id,
      intervention: trimmed,
      divergenceTrigger: selectedTension?.title,
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[#2f2f38] bg-[#111114] p-5 shadow-dock focus:outline-none">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <div className="mb-1 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-amber-400">
                <GitBranch className="h-3 w-3" />
                Fork Scenario Branch
              </div>
              <Dialog.Title className="text-base font-semibold text-zinc-100">
                Challenge an Assumption or Inject a Constraint
              </Dialog.Title>
              <Dialog.Description className="mt-0.5 text-xs text-zinc-400">
                Derive a diverging equilibrium downstream from{' '}
                <span className="font-medium text-zinc-200">
                  &ldquo;{parentNode.premise}&rdquo;
                </span>
                .
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close fork dialog"
                className="rounded-md p-1 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Targeted Tension Context Card */}
          {selectedTension && (
            <div className="mb-4 rounded-lg border border-amber-500/25 bg-amber-500/5 p-3">
              <div className="mb-1 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-amber-300">
                <Zap className="h-3 w-3" />
                Targeted Tension: {selectedTension.title}
              </div>
              <p className="mb-2 text-xs leading-relaxed text-zinc-300">
                {selectedTension.description}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] text-zinc-300">
                <span className="rounded bg-zinc-800/90 px-1.5 py-0.5">
                  {selectedTension.competingForces[0]}
                </span>
                <ArrowLeftRight className="h-3 w-3 text-amber-400" />
                <span className="rounded bg-zinc-800/90 px-1.5 py-0.5">
                  {selectedTension.competingForces[1]}
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="fork-intervention-input"
                className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-zinc-400"
              >
                Modifying Constraint / Intervention
              </label>
              <textarea
                id="fork-intervention-input"
                rows={3}
                value={intervention}
                disabled={isGenerating}
                onChange={(e) => setIntervention(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                    handleSubmit(e);
                  }
                }}
                placeholder="e.g., Strict global quotas are imposed on atmospheric heat rejection, making thermal emissions the new currency"
                className="w-full resize-none rounded-lg border border-[#27272d] bg-[#0b0b0e] p-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-sky-500/60 focus:outline-none"
                autoFocus
              />
            </div>

            {/* Suggested Interventions */}
            {suggestions.length > 0 && (
              <div>
                <div className="mb-1.5 flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                  <Sparkles className="h-3 w-3 text-sky-400/80" />
                  Suggested Interventions
                </div>
                <div className="space-y-1.5">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setIntervention(suggestion)}
                      className="block w-full rounded-md border border-[#27272d] bg-[#16161b] px-3 py-2 text-left text-xs text-zinc-300 transition-colors hover:border-sky-500/45 hover:bg-[#1a1d24] hover:text-zinc-100"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 border-t border-[#27272d] pt-3">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="rounded-lg border border-[#27272d] px-3.5 py-2 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={isGenerating || intervention.trim().length < 2}
                className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500 px-4 py-2 text-xs font-semibold text-zinc-950 transition-colors hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Generating Branch…
                  </>
                ) : (
                  <>
                    <GitBranch className="h-3.5 w-3.5" />
                    Fork Branch
                  </>
                )}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
