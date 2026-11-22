'use client';

import React from 'react';
import { useReactFlow } from '@xyflow/react';
import { Map, Maximize2, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/domain-meta';

interface CanvasControlsProps {
  showMinimap: boolean;
  onToggleMinimap: () => void;
  nodeCount: number;
}

export function CanvasControls({
  showMinimap,
  onToggleMinimap,
  nodeCount,
}: CanvasControlsProps) {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <div className="pointer-events-auto flex items-center gap-1 rounded-lg border border-[#27272d] bg-[#111114]/90 p-1 shadow-dock backdrop-blur-md">
      <button
        type="button"
        onClick={() => zoomIn({ duration: 220 })}
        title="Zoom in"
        className="flex h-7 w-7 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => zoomOut({ duration: 220 })}
        title="Zoom out"
        className="flex h-7 w-7 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <div className="mx-0.5 h-4 w-px bg-[#27272d]" />
      <button
        type="button"
        onClick={() => fitView({ padding: 0.28, duration: 350 })}
        title="Fit scenario tree to view"
        className="flex h-7 w-7 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
      >
        <Maximize2 className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={onToggleMinimap}
        title={showMinimap ? 'Hide minimap' : 'Show minimap'}
        className={cn(
          'flex h-7 w-7 items-center justify-center rounded transition-colors',
          showMinimap
            ? 'bg-sky-500/15 text-sky-300 hover:bg-sky-500/25'
            : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
        )}
      >
        <Map className="h-3.5 w-3.5" />
      </button>
      <div className="mx-0.5 h-4 w-px bg-[#27272d]" />
      <span className="px-2 font-mono text-[10px] tracking-wider text-zinc-500">
        {nodeCount} {nodeCount === 1 ? 'NODE' : 'NODES'}
      </span>
    </div>
  );
}
