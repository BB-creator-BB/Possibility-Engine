import { z } from 'zod';

export const SYSTEMIC_DOMAINS = [
  'economy',
  'society',
  'governance',
  'identity',
  'culture',
  'technology',
] as const;

export type SystemicDomain = (typeof SYSTEMIC_DOMAINS)[number];

export interface DomainImpact {
  domain: SystemicDomain;
  structuralChange: string;
  underlyingMechanism: string;
}

export interface CausalRipples {
  firstOrder: string;
  secondOrder: string;
  thirdOrder: string;
}

export interface EmergentTension {
  title: string;
  description: string;
  competingForces: [string, string];
}

export interface ScenarioNodeData {
  id: string;
  parentId: string | null;
  depth: number;
  premise: string;
  summary: string;
  domainImpacts: DomainImpact[];
  ripples: CausalRipples;
  tensions: EmergentTension[];
  divergenceTrigger?: string;
  createdAt: number;
}

export interface ScenarioTree {
  rootId: string | null;
  activeNodeId: string | null;
  nodes: Record<string, ScenarioNodeData>;
}

export type ReasoningPayload = Omit<
  ScenarioNodeData,
  'id' | 'parentId' | 'depth' | 'premise' | 'divergenceTrigger' | 'createdAt'
>;

export type EngineMode = 'auto' | 'gemini' | 'demo';

export interface ScenarioStoreState extends ScenarioTree {
  isGenerating: boolean;
  error: string | null;
  engineMode: EngineMode;
  lastModeUsed: 'gemini' | 'demo' | null;
  lastFallbackReason: string | null;
  apiKey: string;

  // Core PRD Store Actions
  initializeScenario: (
    rootPremise: string,
    data: Omit<ScenarioNodeData, 'id' | 'parentId' | 'depth' | 'createdAt'>
  ) => string;

  createBranch: (
    parentNodeId: string,
    intervention: string,
    data: Omit<ScenarioNodeData, 'id' | 'parentId' | 'depth' | 'createdAt'>
  ) => string | null;

  setActiveNode: (nodeId: string) => void;
  resetEngine: () => void;
  exportScenarioJSON: () => string;
  importScenarioJSON: (serializedJSON: string) => boolean;

  // Auxiliary UI & Engine Controls
  setGenerating: (generating: boolean) => void;
  setError: (error: string | null) => void;
  setEngineMode: (mode: EngineMode) => void;
  setLastRunMeta: (mode: 'gemini' | 'demo', fallbackReason?: string | null) => void;
  setApiKey: (key: string) => void;
}

// ---------------------------------------------------------------------------
// Zod Runtime Validation Schemas (Section 5 & Section 8 QA Gate 1)
// ---------------------------------------------------------------------------

export const SystemicDomainSchema = z.enum(SYSTEMIC_DOMAINS);

export const DomainImpactSchema = z.object({
  domain: SystemicDomainSchema,
  structuralChange: z.string().trim().min(1, 'structuralChange must be non-empty'),
  underlyingMechanism: z.string().trim().min(1, 'underlyingMechanism must be non-empty'),
});

export const CausalRipplesSchema = z.object({
  firstOrder: z.string().trim().min(1, 'firstOrder ripple must be non-empty'),
  secondOrder: z.string().trim().min(1, 'secondOrder ripple must be non-empty'),
  thirdOrder: z.string().trim().min(1, 'thirdOrder ripple must be non-empty'),
});

export const EmergentTensionSchema = z.object({
  title: z.string().trim().min(1, 'tension title must be non-empty'),
  description: z.string().trim().min(1, 'tension description must be non-empty'),
  competingForces: z.tuple([
    z.string().trim().min(1, 'first competing force must be non-empty'),
    z.string().trim().min(1, 'second competing force must be non-empty'),
  ]),
});

export const ReasoningPayloadSchema = z.object({
  summary: z.string().trim().min(1, 'summary must be non-empty'),
  domainImpacts: z
    .array(DomainImpactSchema)
    .min(1, 'domainImpacts must include at least one domain'),
  ripples: CausalRipplesSchema,
  tensions: z
    .array(EmergentTensionSchema)
    .min(1, 'tensions must include at least one emergent tension'),
});

export const ScenarioNodeDataSchema = z.object({
  id: z.string().trim().min(1),
  parentId: z.string().trim().min(1).nullable(),
  depth: z.number().int().min(0),
  premise: z.string().trim().min(1),
  summary: z.string().trim().min(1),
  domainImpacts: z.array(DomainImpactSchema).min(1),
  ripples: CausalRipplesSchema,
  tensions: z.array(EmergentTensionSchema).min(1),
  divergenceTrigger: z.string().trim().min(1).optional(),
  createdAt: z.number().finite(),
});

export const ScenarioTreeSchema = z
  .object({
    rootId: z.string().trim().min(1).nullable(),
    activeNodeId: z.string().trim().min(1).nullable(),
    nodes: z.record(z.string(), ScenarioNodeDataSchema),
  })
  .superRefine((tree, ctx) => {
    const ids = Object.keys(tree.nodes);

    if (ids.length === 0) {
      if (tree.rootId !== null || tree.activeNodeId !== null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Empty tree must have null rootId and activeNodeId.',
        });
      }
      return;
    }

    if (!tree.rootId || !tree.nodes[tree.rootId]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'rootId must reference an existing node in nodes.',
      });
    } else if (tree.nodes[tree.rootId].parentId !== null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Root node must have parentId === null.',
      });
    }

    if (tree.activeNodeId !== null && !tree.nodes[tree.activeNodeId]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'activeNodeId must reference an existing node in nodes.',
      });
    }

    // Verify key consistency, parent references, and acyclicity
    for (const [key, node] of Object.entries(tree.nodes)) {
      if (node.id !== key) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Node key "${key}" does not match node.id "${node.id}".`,
        });
      }
      if (node.parentId !== null && !tree.nodes[node.parentId]) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Node "${node.id}" references missing parentId "${node.parentId}".`,
        });
      }
      // Acyclic check by walking ancestors
      const visited = new Set<string>([node.id]);
      let cursor = node.parentId;
      while (cursor) {
        if (visited.has(cursor)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Cycle detected involving node "${node.id}".`,
          });
          break;
        }
        visited.add(cursor);
        cursor = tree.nodes[cursor]?.parentId ?? null;
      }
    }
  });

export interface ReasonRequestBody {
  premise: string;
  parentNode?: {
    premise: string;
    summary: string;
    ripples: CausalRipples;
    tensions: EmergentTension[];
  };
  lineage?: Array<{
    premise: string;
    summary: string;
    divergenceTrigger?: string;
  }>;
  divergenceTrigger?: string;
  mode?: EngineMode;
  apiKey?: string;
}

export interface ReasonResponseBody {
  data: ReasoningPayload;
  meta: {
    engine: 'gemini' | 'demo';
    model: string;
    fallbackReason?: string;
  };
}
