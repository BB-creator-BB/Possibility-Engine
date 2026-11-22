'use client';

import React from 'react';
import type { DomainImpact } from '@/types/scenario';
import { cn, DOMAIN_META } from '@/lib/domain-meta';

interface DomainImpactCardProps {
  impact: DomainImpact;
}

export function DomainImpactCard({ impact }: DomainImpactCardProps) {
  const meta = DOMAIN_META[impact.domain];

  return (
    <article
      className={cn(
        'rounded-lg border border-[#27272d] border-l-2 bg-[#141418] p-3.5 transition-colors hover:border-[#34343e]',
        meta.borderAccentClass
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider',
            meta.badgeClass
          )}
        >
          <span className={cn('h-1.5 w-1.5 rounded-full', meta.dotClass)} />
          {meta.label}
        </span>
        <span className="font-mono text-[10px] tracking-widest text-zinc-600">
          {meta.shortCode}
        </span>
      </div>

      <p className="text-[13px] leading-relaxed text-zinc-100">
        {impact.structuralChange}
      </p>

      <div className="mt-2.5 border-t border-zinc-800/80 pt-2">
        <div className="mb-0.5 font-mono text-[9.5px] uppercase tracking-wider text-zinc-500">
          Underlying Mechanism
        </div>
        <p className="text-xs leading-relaxed text-zinc-400">
          {impact.underlyingMechanism}
        </p>
      </div>
    </article>
  );
}
