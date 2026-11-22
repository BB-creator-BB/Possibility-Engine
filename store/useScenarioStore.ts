import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import {
  ScenarioTreeSchema,
  type EngineMode,
  type ScenarioNodeData,
  type ScenarioStoreState,
  type ScenarioTree,
} from '@/types/scenario';

function createNodeId(prefix: 'root' | 'branch', count: number): string {
  const padded = String(count + 1).padStart(3, '0');
  const randomPart =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().slice(0, 6)
      : Math.random().toString(36).slice(2, 8);
  return `node_${prefix}_${padded}_${randomPart}`;
}

const memoryStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

const safeStorage = createJSONStorage(() =>
  typeof window !== 'undefined' && window.localStorage
    ? window.localStorage
    : memoryStorage
);

const initialTree: ScenarioTree = {
  rootId: null,
  activeNodeId: null,
  nodes: {},
};

export const useScenarioStore = create<ScenarioStoreState>()(
  persist(
    (set, get) => ({
      ...initialTree,
      isGenerating: false,
      error: null,
      engineMode: 'auto',
      lastModeUsed: null,
      lastFallbackReason: null,
      apiKey: '',

      initializeScenario: (rootPremise, data) => {
        const id = createNodeId('root', 0);
        const trimmedPremise = rootPremise.trim() || data.premise.trim();
        const rootNode: ScenarioNodeData = {
          id,
          parentId: null,
          depth: 0,
          premise: trimmedPremise,
          summary: data.summary,
          domainImpacts: data.domainImpacts,
          ripples: data.ripples,
          tensions: data.tensions,
          divergenceTrigger: data.divergenceTrigger,
          createdAt: Date.now(),
        };

        set({
          rootId: id,
          activeNodeId: id,
          nodes: { [id]: rootNode },
          error: null,
        });

        return id;
      },

      createBranch: (parentNodeId, intervention, data) => {
        const state = get();
        const parent = state.nodes[parentNodeId];
        if (!parent) {
          set({
            error: `Cannot create branch: parent node "${parentNodeId}" does not exist.`,
          });
          return null;
        }

        const existingCount = Object.keys(state.nodes).length;
        const id = createNodeId('branch', existingCount);
        const trimmedIntervention = intervention.trim() || data.premise.trim();

        const childNode: ScenarioNodeData = {
          id,
          parentId: parent.id,
          depth: parent.depth + 1,
          premise: trimmedIntervention,
          summary: data.summary,
          domainImpacts: data.domainImpacts,
          ripples: data.ripples,
          tensions: data.tensions,
          divergenceTrigger: data.divergenceTrigger,
          createdAt: Date.now(),
        };

        set({
          nodes: {
            ...state.nodes,
            [id]: childNode,
          },
          activeNodeId: id,
          error: null,
        });

        return id;
      },

      setActiveNode: (nodeId) => {
        const state = get();
        if (!state.nodes[nodeId]) return;
        set({ activeNodeId: nodeId });
      },

      resetEngine: () => {
        set({
          ...initialTree,
          isGenerating: false,
          error: null,
          lastModeUsed: null,
          lastFallbackReason: null,
        });
      },

      exportScenarioJSON: () => {
        const { rootId, activeNodeId, nodes } = get();
        const tree: ScenarioTree = { rootId, activeNodeId, nodes };
        return JSON.stringify(tree, null, 2);
      },

      importScenarioJSON: (serializedJSON) => {
        try {
          const parsed: unknown = JSON.parse(serializedJSON);
          const validated = ScenarioTreeSchema.safeParse(parsed);
          if (!validated.success) {
            const firstIssue = validated.error.issues[0];
            set({
              error: `Invalid scenario JSON: ${
                firstIssue
                  ? `${firstIssue.path.join('.')} ${firstIssue.message}`.trim()
                  : 'Schema validation failed.'
              }`,
            });
            return false;
          }

          const { rootId, activeNodeId, nodes } = validated.data;
          set({
            rootId,
            activeNodeId: activeNodeId ?? rootId,
            nodes,
            isGenerating: false,
            error: null,
          });
          return true;
        } catch {
          set({
            error: 'Failed to parse scenario JSON. Please provide valid JSON.',
          });
          return false;
        }
      },

      setGenerating: (isGenerating) => set({ isGenerating }),
      setError: (error) => set({ error }),
      setEngineMode: (engineMode: EngineMode) => set({ engineMode }),
      setLastRunMeta: (mode, fallbackReason = null) =>
        set({ lastModeUsed: mode, lastFallbackReason: fallbackReason }),
      setApiKey: (apiKey) => set({ apiKey }),
    }),
    {
      name: 'possibility-engine-session-v1',
      storage: safeStorage,
      partialize: (state) => ({
        rootId: state.rootId,
        activeNodeId: state.activeNodeId,
        nodes: state.nodes,
        engineMode: state.engineMode,
      }),
    }
  )
);
