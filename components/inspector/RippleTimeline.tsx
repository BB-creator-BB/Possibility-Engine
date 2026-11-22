'use client';

import React from 'react';
import type { CausalRipples } from '@/types/scenario';

interface RippleTimelineProps {
  ripples: CausalRipples;
}

const ORDERS = [
  {
    key: 'firstOrder' as const,
    index: '01',
    label: 'First-Order',
    subtitle: 'Direct immediate consequence',
    dotClass: 'bg-sky-400 ring-sky-400/20',
    labelClass: 'text-sky-300',
  },
  {
    key: 'secondOrder' as const,
    index: '02',
    label: 'Second-Order',
    subtitle: 'Behavioral, market, or institutional reaction',
    dotClass: 'bg-amber-400 ring-amber-400/20',
    labelClass: 'text-amber-300',
  },
  {
    key: 'thirdOrder' as const,
    index: '03',
    label: 'Third-Order',
    subtitle: 'Civilizational structural reorganization',
    dotClass: 'bg-violet-400 ring-violet-400/20',
    labelClass: 'text-violet-300',
  },
];

export function RippleTimeline({ ripples }: RippleTimelineProps) {
  return (
    <div className="relative pl-5">
      {/* Vertical causal spine */}
      <div
        aria-hidden="true"
        className="absolute bottom-3 left-[7px] top-3 w-px bg-gradient-to-b from-sky-500/50 via-amber-500/40 to-violet-500/50"
      />

      <div className="space-y-3.5">
        {ORDERS.map((order) => (
          <div key={order.key} className="relative">
            {/* Timeline node marker */}
            <span
              aria-hidden="true"
              className={`absolute -left-5 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-[#0e0e11] ring-4 ${order.dotClass}`}
            />

            <div className="rounded-lg border border-[#27272d] bg-[#141418] p-3">
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-zinc-500">
                    {order.index}
                  </span>
                  <span
                    className={`font-mono text-[11px] font-semibold uppercase tracking-wider ${order.labelClass}`}
                  >
                    {order.label}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500">
                  {order.subtitle}
                </span>
              </div>
              <p className="text-[12.5px] leading-relaxed text-zinc-200">
                {ripples[order.key]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
