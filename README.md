# The Possibility Engine (MVP)

A browser-based interactive thinking system for exploring speculative futures, radical technological shifts, and post-singularity scenarios through first-principles systems reasoning.

## Architecture & Stack

- **Framework**: Next.js (App Router) + TypeScript (`strict: true`)
- **State Management**: Zustand (`store/useScenarioStore.ts`) with `localStorage` session persistence, JSON import/export, and `#scenario=` URL hash sharing
- **Graph Visualization**: `@xyflow/react` + `@dagrejs/dagre` automatic non-overlapping hierarchical tree layout
- **Styling & UI**: Tailwind CSS + Radix UI Dialog primitives in an austere dark-mode research-terminal aesthetic
- **Reasoning Core**: Edge API route (`app/api/reason/route.ts`) backed by the **Google Gemini API** with strict Zod validation (`ReasoningPayloadSchema`) and a built-in **local first-principles fallback engine** when no API key is configured.

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```
2. *(Optional)* Configure a Gemini API key in `.env.local` (see `.env.example`):
   ```bash
   GEMINI_API_KEY=your_gemini_api_key
   GEMINI_MODEL=gemini-2.5-flash
   ```
   > If no key is provided, the app runs seamlessly using its built-in local first-principles engine (including the canonical *"Energy is free"* walkthrough). You can also enter a session-only Gemini key in the header's Engine Configuration modal.
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000).

## Verification & Quality Gates

```bash
npm run typecheck   # TypeScript strict check
npm test            # Vitest suite covering Zod validation, tree integrity, Dagre overlap-free layout, and 10-node JSON/URL round-trip
npm run build       # Production Next.js build
```
