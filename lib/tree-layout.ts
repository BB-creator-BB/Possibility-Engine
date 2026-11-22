import dagre from '@dagrejs/dagre';
import type { Edge, Node } from '@xyflow/react';
import type { ScenarioNodeData } from '@/types/scenario';

export const NODE_WIDTH = 304;
export const NODE_HEIGHT = 178;

export interface ScenarioFlowNodeData extends Record<string, unknown> {
  scenario: ScenarioNodeData;
  isActive: boolean;
  isOnActivePath: boolean;
  childCount: number;
  onSelect: (nodeId: string) => void;
  onRequestFork: (nodeId: string) => void;
}

export type ScenarioFlowNode = Node<ScenarioFlowNodeData, 'scenarioNode'>;

/**
 * Returns the ordered lineage of node IDs from root down to the given nodeId.
 */
export function getLineageIds(
  nodes: Record<string, ScenarioNodeData>,
  targetId: string | null
): string[] {
  if (!targetId || !nodes[targetId]) return [];
  const path: string[] = [];
  const visited = new Set<string>();
  let cursor: string | null = targetId;

  while (cursor && nodes[cursor] && !visited.has(cursor)) {
    visited.add(cursor);
    path.unshift(cursor);
    cursor = nodes[cursor].parentId;
  }

  return path;
}

/**
 * Computes deterministic non-overlapping 2D coordinates for the scenario tree
 * using Dagre top-to-bottom hierarchy layout.
 */
export function computeScenarioLayout(
  nodesRecord: Record<string, ScenarioNodeData>,
  activeNodeId: string | null,
  callbacks: {
    onSelect: (nodeId: string) => void;
    onRequestFork: (nodeId: string) => void;
  }
): { nodes: ScenarioFlowNode[]; edges: Edge[] } {
  const entries = Object.values(nodesRecord);
  if (entries.length === 0) {
    return { nodes: [], edges: [] };
  }

  // Sort deterministically by depth then creation time so layout is stable
  const sorted = [...entries].sort((a, b) => {
    if (a.depth !== b.depth) return a.depth - b.depth;
    if (a.createdAt !== b.createdAt) return a.createdAt - b.createdAt;
    return a.id.localeCompare(b.id);
  });

  const childCounts: Record<string, number> = {};
  for (const node of sorted) {
    if (node.parentId) {
      childCounts[node.parentId] = (childCounts[node.parentId] ?? 0) + 1;
    }
  }

  const activeLineageSet = new Set(getLineageIds(nodesRecord, activeNodeId));

  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: 'TB',
    nodesep: 56,
    ranksep: 92,
    marginx: 48,
    marginy: 48,
  });

  for (const node of sorted) {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  }

  for (const node of sorted) {
    if (node.parentId && nodesRecord[node.parentId]) {
      g.setEdge(node.parentId, node.id);
    }
  }

  dagre.layout(g);

  const flowNodes: ScenarioFlowNode[] = sorted.map((scenario) => {
    const pos = g.node(scenario.id);
    const x = pos ? pos.x - NODE_WIDTH / 2 : 0;
    const y = pos ? pos.y - NODE_HEIGHT / 2 : 0;

    return {
      id: scenario.id,
      type: 'scenarioNode',
      position: { x, y },
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      data: {
        scenario,
        isActive: scenario.id === activeNodeId,
        isOnActivePath: activeLineageSet.has(scenario.id),
        childCount: childCounts[scenario.id] ?? 0,
        onSelect: callbacks.onSelect,
        onRequestFork: callbacks.onRequestFork,
      },
    };
  });

  const flowEdges: Edge[] = sorted
    .filter((node) => node.parentId !== null && Boolean(nodesRecord[node.parentId]))
    .map((node) => {
      const parentId = node.parentId as string;
      const isHighlighted =
        activeLineageSet.has(parentId) && activeLineageSet.has(node.id);

      return {
        id: `edge_${parentId}_${node.id}`,
        source: parentId,
        target: node.id,
        type: 'default',
        animated: isHighlighted,
        label: node.divergenceTrigger
          ? truncateLabel(node.divergenceTrigger, 34)
          : undefined,
        labelStyle: {
          fill: isHighlighted ? '#bae6fd' : '#a1a1aa',
          fontSize: 10,
          fontFamily: 'var(--font-jetbrains-mono), monospace',
          fontWeight: 500,
        },
        labelBgStyle: {
          fill: '#111114',
          fillOpacity: 0.92,
          stroke: isHighlighted ? '#0284c7' : '#27272d',
          strokeWidth: 1,
        },
        labelBgPadding: [6, 3] as [number, number],
        labelBgBorderRadius: 4,
        style: {
          stroke: isHighlighted ? '#38bdf8' : '#3f3f46',
          strokeWidth: isHighlighted ? 2.2 : 1.5,
        },
      };
    });

  return { nodes: flowNodes, edges: flowEdges };
}

function truncateLabel(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen - 1).trimEnd()}…`;
}
