'use client';

import React, { useMemo, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  AlertCircle,
  Check,
  Copy,
  Download,
  FileJson,
  Upload,
  X,
} from 'lucide-react';
import { useScenarioStore } from '@/store/useScenarioStore';
import { cn } from '@/lib/domain-meta';

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportModal({ open, onOpenChange }: ExportModalProps) {
  const exportScenarioJSON = useScenarioStore((s) => s.exportScenarioJSON);
  const importScenarioJSON = useScenarioStore((s) => s.importScenarioJSON);
  const nodes = useScenarioStore((s) => s.nodes);
  const rootId = useScenarioStore((s) => s.rootId);
  const activeNodeId = useScenarioStore((s) => s.activeNodeId);

  const [tab, setTab] = useState<'export' | 'import'>('export');
  const [importText, setImportText] = useState('');
  const [copied, setCopied] = useState(false);
  const [importFeedback, setImportFeedback] = useState<{
    type: 'error' | 'success';
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const serializedJSON = useMemo(
    () => exportScenarioJSON(),
    // Recompute whenever tree changes while modal is open
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [open, nodes, rootId, activeNodeId]
  );

  const nodeCount = Object.keys(nodes).length;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(serializedJSON);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore clipboard restrictions
    }
  };

  const handleDownload = () => {
    const blob = new Blob([serializedJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `possibility-engine-scenario-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    setImportFeedback(null);
    const ok = importScenarioJSON(importText);
    if (ok) {
      setImportFeedback({
        type: 'success',
        message: 'Scenario tree imported and validated successfully.',
      });
      setTimeout(() => {
        onOpenChange(false);
        setImportText('');
        setImportFeedback(null);
      }, 650);
    } else {
      const storeErr = useScenarioStore.getState().error;
      setImportFeedback({
        type: 'error',
        message: storeErr || 'Invalid ScenarioTree JSON format.',
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImportText(reader.result);
        setImportFeedback(null);
      }
    };
    reader.readAsText(file);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[#2f2f38] bg-[#111114] p-5 shadow-dock focus:outline-none">
          <div className="mb-4 flex items-start justify-between gap-2">
            <div>
              <div className="mb-1 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-sky-400">
                <FileJson className="h-3 w-3" />
                Scenario State Serialization
              </div>
              <Dialog.Title className="text-base font-semibold text-zinc-100">
                Export or Import Scenario Tree JSON
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close JSON modal"
                className="rounded-md p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Mode Tabs */}
          <div className="mb-4 flex gap-1 rounded-lg border border-[#27272d] bg-[#0b0b0e] p-1">
            <button
              type="button"
              onClick={() => setTab('export')}
              className={cn(
                'flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 font-mono text-xs transition-colors',
                tab === 'export'
                  ? 'bg-[#1a1a21] text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-300'
              )}
            >
              <Download className="h-3.5 w-3.5" />
              Export ({nodeCount} {nodeCount === 1 ? 'node' : 'nodes'})
            </button>
            <button
              type="button"
              onClick={() => setTab('import')}
              className={cn(
                'flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 font-mono text-xs transition-colors',
                tab === 'import'
                  ? 'bg-[#1a1a21] text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-300'
              )}
            >
              <Upload className="h-3.5 w-3.5" />
              Import JSON
            </button>
          </div>

          {tab === 'export' ? (
            <div className="space-y-3">
              <pre className="max-h-72 overflow-auto rounded-lg border border-[#27272d] bg-[#09090b] p-3.5 font-mono text-[11px] leading-relaxed text-zinc-300">
                {serializedJSON}
              </pre>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#27272d] bg-[#16161b] px-3.5 py-2 text-xs font-medium text-zinc-200 transition-colors hover:border-[#3a3a44] hover:bg-[#1e1e26]"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      Copied JSON
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy JSON
                    </>
                  )}
                </button>
                <button
                  type="button"
                  disabled={nodeCount === 0}
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500 px-3.5 py-2 text-xs font-semibold text-zinc-950 transition-colors hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download .json
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">
                  Paste an exported ScenarioTree JSON payload or load from disk:
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[#27272d] bg-[#16161b] px-2.5 py-1 font-mono text-[11px] text-zinc-300 hover:border-sky-500/40 hover:text-sky-200"
                >
                  <Upload className="h-3 w-3" />
                  Choose .json File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/json,.json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <textarea
                rows={10}
                value={importText}
                onChange={(e) => {
                  setImportText(e.target.value);
                  setImportFeedback(null);
                }}
                placeholder='{"rootId": "...", "activeNodeId": "...", "nodes": { ... }}'
                className="w-full resize-none rounded-lg border border-[#27272d] bg-[#09090b] p-3 font-mono text-[11px] text-zinc-200 placeholder:text-zinc-600 focus:border-sky-500/60 focus:outline-none"
              />

              {importFeedback && (
                <div
                  className={cn(
                    'flex items-center gap-2 rounded-lg border px-3 py-2 text-xs',
                    importFeedback.type === 'error'
                      ? 'border-rose-500/40 bg-rose-500/10 text-rose-200'
                      : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                  )}
                >
                  {importFeedback.type === 'error' ? (
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 text-rose-400" />
                  ) : (
                    <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  )}
                  <span>{importFeedback.message}</span>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="rounded-lg border border-[#27272d] px-3.5 py-2 text-xs font-medium text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                  >
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  type="button"
                  disabled={importText.trim().length === 0}
                  onClick={handleImportSubmit}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500 px-4 py-2 text-xs font-semibold text-zinc-950 transition-colors hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Validate &amp; Restore Tree
                </button>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
