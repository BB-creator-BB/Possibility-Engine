import { beforeEach, describe, expect, it } from 'vitest';
import { POST as reasonPost } from '@/app/api/reason/route';
import {
  ReasoningPayloadSchema,
  ScenarioTreeSchema,
  type ReasonResponseBody,
  type ScenarioNodeData,
} from '@/types/scenario';
import { generateDemoReasoning } from '@/lib/demo-engine';
import {
  computeScenarioLayout,
  getLineageIds,
  NODE_HEIGHT,
  NODE_WIDTH,
} from '@/lib/tree-layout';
import {
  decodeScenarioFromHash,
  encodeScenarioToHash,
} from '@/lib/url-share';
import { useScenarioStore } from '@/store/useScenarioStore';

function buildTenNodeBranchedTree() {
  const store = useScenarioStore.getState();
  store.resetEngine();

  const rootPayload = generateDemoReasoning({ premise: 'Energy is free' });
  const rootId = useScenarioStore.getState().initializeScenario('Energy is free', {
    premise: 'Energy is free',
    ...rootPayload,
  });

  // Create 3 direct children of root
  const c1Data = generateDemoReasoning({
    premise:
      'Strict global quotas are imposed on atmospheric heat rejection, making thermal emissions the new currency',
    parentNode: {
      premise: 'Energy is free',
      summary: rootPayload.summary,
      ripples: rootPayload.ripples,
      tensions: rootPayload.tensions,
    },
    divergenceTrigger: 'The Abundance Heat Trap',
  });
  const c1 = useScenarioStore
    .getState()
    .createBranch(
      rootId,
      'Strict global quotas are imposed on atmospheric heat rejection, making thermal emissions the new currency',
      {
        premise:
          'Strict global quotas are imposed on atmospheric heat rejection, making thermal emissions the new currency',
        divergenceTrigger: 'The Abundance Heat Trap',
        ...c1Data,
      }
    ) as string;

  const c2Data = generateDemoReasoning({
    premise: 'Localized generation dissolves national electric grids',
    parentNode: {
      premise: 'Energy is free',
      summary: rootPayload.summary,
      ripples: rootPayload.ripples,
      tensions: rootPayload.tensions,
    },
    divergenceTrigger: 'Resource Decentralization vs. Grid Dominance',
  });
  const c2 = useScenarioStore
    .getState()
    .createBranch(
      rootId,
      'Localized generation dissolves national electric grids',
      {
        premise: 'Localized generation dissolves national electric grids',
        divergenceTrigger: 'Resource Decentralization vs. Grid Dominance',
        ...c2Data,
      }
    ) as string;

  const c3Data = generateDemoReasoning({
    premise: 'Rare earth cartels become the new OPEC',
    parentNode: {
      premise: 'Energy is free',
      summary: rootPayload.summary,
      ripples: rootPayload.ripples,
      tensions: rootPayload.tensions,
    },
  });
  const c3 = useScenarioStore
    .getState()
    .createBranch(rootId, 'Rare earth cartels become the new OPEC', {
      premise: 'Rare earth cartels become the new OPEC',
      ...c3Data,
    }) as string;

  // Depth-2 branches across different parents
  const depth2Specs: Array<[string, string]> = [
    [c1, 'Orbital data centers declare thermodynamic independence'],
    [c1, 'Underground geothermal heat laundering networks emerge'],
    [c2, 'Micro-city energy guilds replace municipal governments'],
    [c2, 'Atmospheric water extraction triggers regional rainfall treaties'],
    [c3, 'Asteroid mining consortia break terrestrial mineral monopolies'],
  ];

  const depth2Ids: string[] = [];
  for (const [parentId, intervention] of depth2Specs) {
    const parent = useScenarioStore.getState().nodes[parentId];
    const payload = generateDemoReasoning({
      premise: intervention,
      parentNode: {
        premise: parent.premise,
        summary: parent.summary,
        ripples: parent.ripples,
        tensions: parent.tensions,
      },
    });
    const childId = useScenarioStore.getState().createBranch(parentId, intervention, {
      premise: intervention,
      ...payload,
    }) as string;
    depth2Ids.push(childId);
  }

  // Depth-3 branch (10th node total: 1 root + 3 depth-1 + 5 depth-2 + 1 depth-3 = 10)
  const d3Parent = useScenarioStore.getState().nodes[depth2Ids[0]];
  const d3Payload = generateDemoReasoning({
    premise: 'Earth imposes infrared tariffs on orbital imports',
    parentNode: {
      premise: d3Parent.premise,
      summary: d3Parent.summary,
      ripples: d3Parent.ripples,
      tensions: d3Parent.tensions,
    },
  });
  const d3Id = useScenarioStore
    .getState()
    .createBranch(
      d3Parent.id,
      'Earth imposes infrared tariffs on orbital imports',
      {
        premise: 'Earth imposes infrared tariffs on orbital imports',
        ...d3Payload,
      }
    ) as string;

  return { rootId, c1, c2, c3, depth2Ids, d3Id };
}

describe('The Possibility Engine — Section 8 QA Verification Gates', () => {
  beforeEach(() => {
    useScenarioStore.getState().resetEngine();
  });

  it('Gate 1: Strict JSON Output Parsing via Zod accepts valid payloads and rejects malformed ones', () => {
    const valid = generateDemoReasoning({ premise: 'Energy is free' });
    expect(ReasoningPayloadSchema.safeParse(valid).success).toBe(true);

    // Reject missing required fields
    const missingRipples = {
      summary: valid.summary,
      domainImpacts: valid.domainImpacts,
      tensions: valid.tensions,
    };
    expect(ReasoningPayloadSchema.safeParse(missingRipples).success).toBe(false);

    // Reject unknown systemic domain enum
    const invalidDomain = {
      ...valid,
      domainImpacts: [
        {
          domain: 'astrology',
          structuralChange: 'Invalid domain',
          underlyingMechanism: 'Should fail validation',
        },
      ],
    };
    expect(ReasoningPayloadSchema.safeParse(invalidDomain).success).toBe(false);

    // Reject competingForces with wrong tuple length
    const invalidTension = {
      ...valid,
      tensions: [
        {
          title: 'Broken Tension',
          description: 'Only one force',
          competingForces: ['Only One'],
        },
      ],
    };
    expect(ReasoningPayloadSchema.safeParse(invalidTension).success).toBe(false);
  });

  it('Gate 2: Tree Mutability & Integrity preserves acyclic hierarchy and sibling branches', () => {
    const { rootId, c1, c2, c3, depth2Ids, d3Id } = buildTenNodeBranchedTree();
    const { nodes } = useScenarioStore.getState();

    expect(Object.keys(nodes)).toHaveLength(10);
    expect(nodes[rootId].parentId).toBeNull();
    expect(nodes[rootId].depth).toBe(0);

    // Sibling branches under root all intact
    expect(nodes[c1].parentId).toBe(rootId);
    expect(nodes[c2].parentId).toBe(rootId);
    expect(nodes[c3].parentId).toBe(rootId);
    expect(nodes[c1].depth).toBe(1);
    expect(nodes[c2].depth).toBe(1);
    expect(nodes[c3].depth).toBe(1);

    // Depth-3 lineage traces cleanly back to root without cycles
    const lineage = getLineageIds(nodes, d3Id);
    expect(lineage).toEqual([rootId, c1, depth2Ids[0], d3Id]);
    expect(nodes[d3Id].depth).toBe(3);

    // Reject cyclic tree imports via ScenarioTreeSchema
    const cyclicNodes: Record<string, ScenarioNodeData> = {
      a: { ...nodes[rootId], id: 'a', parentId: 'b', depth: 1 },
      b: { ...nodes[c1], id: 'b', parentId: 'a', depth: 1 },
    };
    expect(
      ScenarioTreeSchema.safeParse({
        rootId: 'a',
        activeNodeId: 'a',
        nodes: cyclicNodes,
      }).success
    ).toBe(false);
  });

  it('Gate 3: Visual Layout Stability yields zero bounding-box overlap on a 10-node branched tree', () => {
    buildTenNodeBranchedTree();
    const { nodes: nodesRecord, activeNodeId } = useScenarioStore.getState();

    const { nodes: flowNodes, edges } = computeScenarioLayout(
      nodesRecord,
      activeNodeId,
      {
        onSelect: () => {},
        onRequestFork: () => {},
      }
    );

    expect(flowNodes).toHaveLength(10);
    expect(edges).toHaveLength(9);

    // Ensure every node has finite coordinates and no two bounding boxes overlap
    for (let i = 0; i < flowNodes.length; i += 1) {
      const a = flowNodes[i];
      expect(Number.isFinite(a.position.x)).toBe(true);
      expect(Number.isFinite(a.position.y)).toBe(true);

      for (let j = i + 1; j < flowNodes.length; j += 1) {
        const b = flowNodes[j];
        const overlapsX =
          a.position.x < b.position.x + NODE_WIDTH &&
          a.position.x + NODE_WIDTH > b.position.x;
        const overlapsY =
          a.position.y < b.position.y + NODE_HEIGHT &&
          a.position.y + NODE_HEIGHT > b.position.y;

        expect(overlapsX && overlapsY).toBe(false);
      }
    }
  });

  it('Gate 4: Serialization Round-Trip (JSON & URL Hash) restores identical 10-node topology and active node', () => {
    const { c2 } = buildTenNodeBranchedTree();
    useScenarioStore.getState().setActiveNode(c2);

    const beforeState = useScenarioStore.getState();
    const exportedJSON = beforeState.exportScenarioJSON();
    const originalSnapshot = {
      rootId: beforeState.rootId,
      activeNodeId: beforeState.activeNodeId,
      nodes: beforeState.nodes,
    };

    // Reset and re-import JSON
    useScenarioStore.getState().resetEngine();
    expect(Object.keys(useScenarioStore.getState().nodes)).toHaveLength(0);

    const importOk = useScenarioStore.getState().importScenarioJSON(exportedJSON);
    expect(importOk).toBe(true);

    const afterState = useScenarioStore.getState();
    expect(afterState.rootId).toBe(originalSnapshot.rootId);
    expect(afterState.activeNodeId).toBe(c2);
    expect(afterState.nodes).toEqual(originalSnapshot.nodes);

    // Also verify URL hash round-trip
    const hash = encodeScenarioToHash(originalSnapshot);
    const decoded = decodeScenarioFromHash(hash);
    expect(decoded).toEqual(originalSnapshot);
  });

  it('Canonical Section 7 Walkthrough ("Energy is free" -> Thermal Quotas) matches expected depth', () => {
    const root = generateDemoReasoning({ premise: 'Energy is free' });
    expect(root.summary.toLowerCase()).toContain('thermal dissipation');
    expect(
      root.tensions.some((t) => t.title === 'The Abundance Heat Trap')
    ).toBe(true);

    const child = generateDemoReasoning({
      premise:
        'Strict global quotas are imposed on atmospheric heat rejection, making thermal emissions the new currency',
      parentNode: {
        premise: 'Energy is free',
        summary: root.summary,
        ripples: root.ripples,
        tensions: root.tensions,
      },
      divergenceTrigger: 'The Abundance Heat Trap',
    });
    expect(child.summary.toLowerCase()).toContain('thermodynamic credit');
  });

  it('Edge API Route (/api/reason) validates inputs and returns strict Zod-valid JSON for root & child branches', async () => {
    const rootReq = new Request('http://localhost:3000/api/reason', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ premise: 'Energy is free', mode: 'demo' }),
    });
    const rootRes = await reasonPost(rootReq);
    expect(rootRes.status).toBe(200);
    const rootJson = (await rootRes.json()) as ReasonResponseBody;
    expect(rootJson.meta.engine).toBe('demo');
    expect(ReasoningPayloadSchema.safeParse(rootJson.data).success).toBe(true);

    const branchReq = new Request('http://localhost:3000/api/reason', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        premise:
          'Strict global quotas are imposed on atmospheric heat rejection, making thermal emissions the new currency',
        divergenceTrigger: 'The Abundance Heat Trap',
        mode: 'demo',
        parentNode: {
          premise: 'Energy is free',
          summary: rootJson.data.summary,
          ripples: rootJson.data.ripples,
          tensions: rootJson.data.tensions,
        },
      }),
    });
    const branchRes = await reasonPost(branchReq);
    expect(branchRes.status).toBe(200);
    const branchJson = (await branchRes.json()) as ReasonResponseBody;
    expect(ReasoningPayloadSchema.safeParse(branchJson.data).success).toBe(true);
    expect(branchJson.data.summary.toLowerCase()).toContain(
      'thermodynamic credit'
    );

    // Malformed premise rejected with HTTP 400
    const badReq = new Request('http://localhost:3000/api/reason', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ premise: '' }),
    });
    const badRes = await reasonPost(badReq);
    expect(badRes.status).toBe(400);
  });
});
