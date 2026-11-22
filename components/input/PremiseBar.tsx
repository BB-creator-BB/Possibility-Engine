'use client';

import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  GitBranch,
  Loader2,
  Sparkles,
  X,
} from 'lucide-react';
import { EXAMPLE_SEED_PREMISES } from '@/lib/prompt-templates';
import { useScenarioStore } from '@/store/useScenarioStore';

interface PremiseBarProps {
  onSeedSubmit: (premise: string) => void;
  onOpenFork: () => void;
}

export function PremiseBar({ onSeedSubmit, onOpenFork }: PremiseBarProps) {
  const activeNodeId = useScenarioStore((s) => s.activeNodeId);
  const isGenerating = useScenarioStore((s) => s.isGenerating);
  const error = useScenarioStore((s) => s.error);
  const setError = useScenarioStore((s) => s.setError);

  const [inputValue, setInputValue] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % EXAMPLE_SEED_PREMISES.length);
    }, 4200);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || isGenerating) return;
    onSeedSubmit(trimmed);
    setInputValue('');
  };

  const hasActiveNode = Boolean(activeNodeId);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-5 z-20 flex flex-col items-center px-4">
      {/* Error Toast if present */}
      {error && (
        <div className="pointer-events-auto mb-2.5 flex w-full max-w-2xl items-center justify-between gap-2 rounded-lg border border-rose-500/40 bg-[#1a1014]/95 px-3.5 py-2 text-xs text-rose-200 shadow-dock backdrop-blur-md">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-3.5 w-3.5 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="rounded p-0.5 text-rose-300/70 hover:bg-rose-500/20 hover:text-rose-100"
            aria-label="Dismiss error"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Elevated Floating Input Dock */}
      <div className="pointer-events-auto w-full max-w-2xl rounded-xl border border-[#2f2f38] bg-[#111114]/95 p-2 shadow-dock backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2.5 rounded-lg bg-[#0b0b0e] px-3 py-2 ring-1 ring-[#27272d] focus-within:ring-sky-500/60">
            <Sparkles className="h-4 w-4 shrink-0 text-sky-400/80" />
            <input
              type="text"
              value={inputValue}
              disabled={isGenerating}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Seed a new premise… e.g. "${EXAMPLE_SEED_PREMISES[placeholderIndex]}"`}
              aria-label="Seed premise input"
              className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={isGenerating || inputValue.trim().length < 2}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-sky-500 px-3.5 text-xs font-semibold text-zinc-950 transition-colors hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Reasoning
              </>
            ) : (
              <>
                Explore
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>

          {hasActiveNode && (
            <button
              type="button"
              disabled={isGenerating}
              onClick={onOpenFork}
              title="Inject a modifying constraint or challenge an assumption on the selected node"
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/15 px-3 font-mono text-[11px] font-medium text-amber-200 transition-colors hover:border-amber-400/70 hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <GitBranch className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Branch / Challenge</span>
              <span className="sm:hidden">Branch</span>
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
