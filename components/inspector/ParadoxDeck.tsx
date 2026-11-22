'use client';

import React from 'react';
import { ArrowLeftRight, GitBranch, Zap } from 'lucide-react';
import type { EmergentTension } from '@/types/scenario';

interface ParadoxDeckProps {
  tensions: EmergentTension[];
  onForkFromTension: (tension: EmergentTension) => void;
  disabled?: boolean;
}

export function ParadoxDeck({
  tensions,
  onForkFromTension,
  disabled = false,
}: ParadoxDeckProps) {
  return (
    <div className="space-y-3">
      {tensions.map((tension, idx) => (
        <article
          key={`${tension.title}-${idx}`}
          className="group rounded-lg border border-amber-500/20 bg-gradient-to-b from-[#171512] to-[#131317] p-3.5 transition-colors hover:border-amber-400/45"
        >
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-amber-500/30 bg-amber-500/10 text-amber-400">
                <Zap className="h-3 w-3" />
              </span>
              <h4 className="text-[13px] font-semibold leading-snug text-amber-100">
                {tension.title}
              </h4>
            </div>
            <span className="font-mono text-[10px] text-amber-500/70">
              P{idx + 1}
            </span>
          </div>

          <p className="mb-3 text-xs leading-relaxed text-zinc-300">
            {tension.description}
          </p>

          {/* Competing forces visual bar */}
          <div className="mb-3 flex flex-wrap items-center gap-1.5 rounded-md border border-zinc-800/90 bg-[#0d0d10] px-2.5 py-2">
            <span className="rounded bg-zinc-800/90 px-2 py-0.5 font-mono text-[10.5px] text-zinc-200">
              {tension.competingForces[0]}
            </span>
            <ArrowLeftRight className="h-3 w-3 shrink-0 text-amber-400/80" />
            <span className="rounded bg-zinc-800/90 px-2 py-0.5 font-mono text-[10.5px] text-zinc-200">
              {tension.competingForces[1]}
            </span>
          </div>

          <button
            type="button"
            disabled={disabled}
            onClick={() => onForkFromTension(tension)}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 font-mono text-[11px] font-medium text-amber-200 transition-colors hover:border-amber-400/60 hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <GitBranch className="h-3.5 w-3.5" />
            Fork Branch from Tension
          </button>
        </article>
      ))}
    </div>
  );
}
