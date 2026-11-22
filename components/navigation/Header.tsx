'use client';

import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  Check,
  Cpu,
  Download,
  KeyRound,
  RotateCcw,
  Share2,
  X,
} from 'lucide-react';
import { useScenarioStore } from '@/store/useScenarioStore';
import { encodeScenarioToHash } from '@/lib/url-share';
import { cn } from '@/lib/domain-meta';
import type { EngineMode } from '@/types/scenario';

interface HeaderProps {
  onOpenExportModal: () => void;
}

export function Header({ onOpenExportModal }: HeaderProps) {
  const rootId = useScenarioStore((s) => s.rootId);
  const activeNodeId = useScenarioStore((s) => s.activeNodeId);
  const nodes = useScenarioStore((s) => s.nodes);
  const engineMode = useScenarioStore((s) => s.engineMode);
  const lastModeUsed = useScenarioStore((s) => s.lastModeUsed);
  const lastFallbackReason = useScenarioStore((s) => s.lastFallbackReason);
  const apiKey = useScenarioStore((s) => s.apiKey);
  const setEngineMode = useScenarioStore((s) => s.setEngineMode);
  const setApiKey = useScenarioStore((s) => s.setApiKey);
  const resetEngine = useScenarioStore((s) => s.resetEngine);

  const [copiedShare, setCopiedShare] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const rootNode = rootId ? nodes[rootId] : null;
  const hasNodes = Object.keys(nodes).length > 0;

  const handleShareLink = async () => {
    if (!hasNodes || typeof window === 'undefined') return;
    const hash = encodeScenarioToHash({ rootId, activeNodeId, nodes });
    const url = `${window.location.origin}${window.location.pathname}${hash}`;
    window.history.replaceState(null, '', hash);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    } catch {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const handleReset = () => {
    resetEngine();
    if (typeof window !== 'undefined' && window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  const engineBadgeLabel =
    lastModeUsed === 'gemini'
      ? 'GEMINI LIVE'
      : lastModeUsed === 'demo'
      ? 'LOCAL ENGINE'
      : engineMode === 'demo'
      ? 'LOCAL ENGINE'
      : engineMode === 'gemini'
      ? 'GEMINI API'
      : 'AUTO (GEMINI / LOCAL)';

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-[#27272d] bg-[#0d0d10] px-4">
      {/* Left: Brand Logotype + Active Scenario Title */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-sky-500/40 bg-sky-500/10 text-sky-400">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <circle cx="12" cy="5" r="2.2" />
              <circle cx="6" cy="18" r="2.2" />
              <circle cx="18" cy="18" r="2.2" />
              <path d="M12 7.2v3.8M12 11l-5 5M12 11l5 5" />
            </svg>
          </div>
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-zinc-100">
            The Possibility Engine
          </span>
        </div>

        <div className="hidden h-4 w-px bg-[#27272d] sm:block" />

        <div className="hidden min-w-0 items-center gap-2 sm:flex">
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            Scenario:
          </span>
          <span
            className="max-w-[260px] truncate text-xs font-medium text-zinc-200 lg:max-w-[380px]"
            title={rootNode?.premise ?? 'Untitled Exploration'}
          >
            {rootNode ? rootNode.premise : 'Untitled Exploration'}
          </span>
        </div>
      </div>

      {/* Right: Engine Mode, Share, Export/Import, New Scenario */}
      <div className="flex shrink-0 items-center gap-1.5">
        {/* Engine Status / Settings Trigger */}
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          title={
            lastFallbackReason ||
            'Configure Gemini API key or Local First-Principles mode'
          }
          className={cn(
            'inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 font-mono text-[10px] uppercase tracking-wider transition-colors',
            lastModeUsed === 'gemini' || apiKey
              ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
              : 'border-[#27272d] bg-[#141418] text-zinc-400 hover:border-[#3a3a44] hover:text-zinc-200'
          )}
        >
          <Cpu className="h-3 w-3" />
          <span className="hidden md:inline">{engineBadgeLabel}</span>
        </button>

        {/* URL Hash Share */}
        <button
          type="button"
          disabled={!hasNodes}
          onClick={handleShareLink}
          title="Copy shareable URL hash link"
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#27272d] bg-[#141418] px-2.5 text-xs font-medium text-zinc-300 transition-colors hover:border-[#3a3a44] hover:bg-[#1a1a20] hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {copiedShare ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden sm:inline text-emerald-300">Copied</span>
            </>
          ) : (
            <>
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Share</span>
            </>
          )}
        </button>

        {/* Export / Import JSON */}
        <button
          type="button"
          onClick={onOpenExportModal}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#27272d] bg-[#141418] px-2.5 text-xs font-medium text-zinc-300 transition-colors hover:border-[#3a3a44] hover:bg-[#1a1a20] hover:text-zinc-100"
        >
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">JSON</span>
        </button>

        {/* New Scenario Reset */}
        <button
          type="button"
          disabled={!hasNodes}
          onClick={handleReset}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#27272d] bg-[#141418] px-2.5 text-xs font-medium text-zinc-300 transition-colors hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">New Scenario</span>
        </button>
      </div>

      {/* Engine Configuration Dialog */}
      <Dialog.Root open={settingsOpen} onOpenChange={setSettingsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[#2f2f38] bg-[#111114] p-5 shadow-dock focus:outline-none">
            <div className="mb-4 flex items-start justify-between gap-2">
              <div>
                <div className="mb-1 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-sky-400">
                  <Cpu className="h-3 w-3" />
                  Reasoning Core Configuration
                </div>
                <Dialog.Title className="text-sm font-semibold text-zinc-100">
                  Gemini API &amp; Local Engine
                </Dialog.Title>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Close engine settings"
                  className="rounded-md p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>

            <div className="space-y-4">
              <div>
                <div className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                  Execution Mode
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {(
                    [
                      { id: 'auto', label: 'Auto' },
                      { id: 'gemini', label: 'Gemini Only' },
                      { id: 'demo', label: 'Local Demo' },
                    ] as Array<{ id: EngineMode; label: string }>
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setEngineMode(opt.id)}
                      className={cn(
                        'rounded-lg border px-2.5 py-2 font-mono text-[11px] transition-colors',
                        engineMode === opt.id
                          ? 'border-sky-500/60 bg-sky-500/15 text-sky-200'
                          : 'border-[#27272d] bg-[#16161b] text-zinc-400 hover:text-zinc-200'
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <p className="mt-1.5 text-[11px] text-zinc-500">
                  In <span className="text-zinc-300">Auto</span> mode, the Edge
                  API uses <code className="font-mono">GEMINI_API_KEY</code> (or
                  your session key below) and gracefully falls back to the
                  built-in local first-principles engine if unavailable.
                </p>
              </div>

              <div>
                <label
                  htmlFor="gemini-session-key"
                  className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-400"
                >
                  <KeyRound className="h-3 w-3" />
                  Optional Session Gemini API Key
                </label>
                <input
                  id="gemini-session-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIza… (kept in browser memory only)"
                  className="w-full rounded-lg border border-[#27272d] bg-[#0b0b0e] px-3 py-2 font-mono text-xs text-zinc-100 placeholder:text-zinc-600 focus:border-sky-500/60 focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-zinc-500">
                  Never saved to localStorage. You can also configure{' '}
                  <code className="font-mono text-zinc-300">
                    GEMINI_API_KEY
                  </code>{' '}
                  in <code className="font-mono text-zinc-300">.env.local</code>.
                </p>
              </div>

              {lastFallbackReason && (
                <div className="rounded-lg border border-amber-500/25 bg-amber-500/10 p-2.5 text-[11px] text-amber-200">
                  Last run note: {lastFallbackReason}
                </div>
              )}

              <div className="flex justify-end border-t border-[#27272d] pt-3">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="rounded-lg bg-sky-500 px-4 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-sky-400"
                  >
                    Done
                  </button>
                </Dialog.Close>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </header>
  );
}
