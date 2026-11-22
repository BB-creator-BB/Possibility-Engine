'use client';

import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { GitBranch, Sparkles, Zap } from 'lucide-react';
import type { ScenarioFlowNode } from '@/lib/tree-layout';
import { cn, DOMAIN_META } from '@/lib/domain-meta';

function ScenarioNodeComponent({ data }: NodeProps<ScenarioFlowNode>) {
  const { scenario, isActive, isOnActivePath, childCount, onSelect, onRequestFork } =
    data;
  const isRoot = scenario.parentId === null;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(scenario.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(scenario.id);
        }
      }}
      className={cn(
        'group relative w-[304px] rounded-lg border bg-[#111114]/95 p-3.5 text-left transition-all duration-200 select-none backdrop-blur-sm',
        isActive
          ? 'border-sky-400/80 shadow-node-active bg-[#14161b]'
          : isOnActivePath
          ? 'border-sky-500/40 shadow-node-idle hover:border-sky-400/70'
          : 'border-[#27272d] shadow-node-idle hover:border-[#3f3f4a] hover:bg-[#15151a]'
      )}
    >
      {/* Top incoming handle for non-root nodes */}
      <Handle
        type="target"
        position={Position.Top}
        className={cn(
          '!h-2 !w-2 !border-2 !border-[#09090b] transition-colors',
          isRoot ? '!opacity-0 !pointer-events-none' : '',
          isActive || isOnActivePath ? '!bg-sky-400' : '!bg-zinc-500'
        )}
      />

      {/* Node header metadata */}
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider border',
              isRoot
                ? 'border-sky-500/30 bg-sky-500/10 text-sky-300'
                : 'border-zinc-700/80 bg-zinc-800/70 text-zinc-300'
            )}
          >
            {isRoot ? (
              <>
                <Sparkles className="h-2.5 w-2.5" />
                SEED
              </>
            ) : (
              <>DEPTH {scenario.depth}</>
            )}
          </span>
          {childCount > 0 && (
            <span className="inline-flex items-center gap-0.5 font-mono text-[10px] text-zinc-500">
              <GitBranch className="h-2.5 w-2.5" />
              {childCount}
            </span>
          )}
        </div>

        <button
          type="button"
          title="Branch / Challenge this state"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(scenario.id);
            onRequestFork(scenario.id);
          }}
          className={cn(
            'inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] transition-all',
            isActive
              ? 'border-sky-500/40 bg-sky-500/15 text-sky-300 hover:bg-sky-500/25'
              : 'border-transparent bg-zinc-800/0 text-zinc-500 opacity-0 group-hover:opacity-100 group-hover:border-zinc-700 group-hover:bg-zinc-800/80 group-hover:text-zinc-200'
          )}
        >
          <GitBranch className="h-2.5 w-2.5" />
          FORK
        </button>
      </div>

      {/* Premise Title */}
      <h3 className="mb-1.5 line-clamp-2 text-[13px] font-semibold leading-snug text-zinc-100">
        {scenario.premise}
      </h3>

      {/* Macro Summary Excerpt */}
      <p className="mb-3 line-clamp-2 text-[11.5px] leading-relaxed text-zinc-400">
        {scenario.summary}
      </p>

      {/* Footer: Domains + Tensions */}
      <div className="flex items-center justify-between gap-2 border-t border-zinc-800/80 pt-2">
        <div className="flex flex-wrap items-center gap-1">
          {scenario.domainImpacts.slice(0, 4).map((impact) => {
            const meta = DOMAIN_META[impact.domain];
            return (
              <span
                key={impact.domain}
                className={cn(
                  'inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[9px] tracking-tight',
                  meta.badgeClass
                )}
              >
                <span className={cn('h-1 w-1 rounded-full', meta.dotClass)} />
                {meta.shortCode}
              </span>
            );
          })}
          {scenario.domainImpacts.length > 4 && (
            <span className="font-mono text-[9px] text-zinc-500">
              +{scenario.domainImpacts.length - 4}
            </span>
          )}
        </div>

        <span
          className="inline-flex shrink-0 items-center gap-1 font-mono text-[10px] text-amber-400/90"
          title={`${scenario.tensions.length} emergent tensions`}
        >
          <Zap className="h-2.5 w-2.5" />
          {scenario.tensions.length}
        </span>
      </div>

      {/* Bottom outgoing handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className={cn(
          '!h-2 !w-2 !border-2 !border-[#09090b] transition-colors',
          isActive || isOnActivePath ? '!bg-sky-400' : '!bg-zinc-600'
        )}
      />
    </div>
  );
}

export const ScenarioNode = memo(ScenarioNodeComponent);
