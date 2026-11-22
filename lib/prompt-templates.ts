import type { CausalRipples, EmergentTension } from '@/types/scenario';

/**
 * First-principles system prompt defined in Section 5 of the PRD.
 */
export const SYSTEM_PROMPT = `You are the reasoning core of The Possibility Engine, a playable thinking tool designed to explore post-singularity and radical technological futures through first-principles systems thinking.

Your task is to analyze a hypothetical premise and propagate its consequences across interconnected human, physical, and organizational systems.

Operating Guidelines:
1. Rigorous First-Principles Derivation: Do not default to clichéd science fiction tropes. Ask: If this premise is fundamentally true, what baseline resource, energetic, or behavioral constraints collapse, and what new constraints immediately emerge?
2. Multi-Domain Propagation: Trace changes across all systemic domains: Economy, Society, Governance, Identity, Culture, and Technology. Show how a shift in one domain triggers downstream shifts in another (e.g., how an economic shift triggers a cultural revolution that alters governance).
3. Multi-Order Causality:
   - First-Order: Direct, immediate consequence of the premise.
   - Second-Order: Behavioral, market, or institutional reaction to the first-order consequence.
   - Third-Order: Structural reorganization of society or civilization in response to second-order pressures.
4. Emergent Tensions and Paradoxes: Identify 2 to 3 unresolved friction points where competing values or structural forces clash.

Output Format:
You must respond strictly with valid JSON conforming to the requested schema. No conversational filler or introductory remarks.`;

/**
 * Gemini API structured output schema conforming strictly to Section 5.
 */
export const GEMINI_RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    summary: {
      type: 'STRING',
      description:
        'A concise, impactful summary of the macro-state resulting from the premise.',
    },
    domainImpacts: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          domain: {
            type: 'STRING',
            enum: [
              'economy',
              'society',
              'governance',
              'identity',
              'culture',
              'technology',
            ],
          },
          structuralChange: {
            type: 'STRING',
            description:
              'The fundamental systemic transformation within this domain.',
          },
          underlyingMechanism: {
            type: 'STRING',
            description:
              'The first-principles cause explaining why this change occurs.',
          },
        },
        required: ['domain', 'structuralChange', 'underlyingMechanism'],
      },
    },
    ripples: {
      type: 'OBJECT',
      properties: {
        firstOrder: { type: 'STRING' },
        secondOrder: { type: 'STRING' },
        thirdOrder: { type: 'STRING' },
      },
      required: ['firstOrder', 'secondOrder', 'thirdOrder'],
    },
    tensions: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          title: { type: 'STRING' },
          description: { type: 'STRING' },
          competingForces: {
            type: 'ARRAY',
            items: { type: 'STRING' },
            minItems: 2,
            maxItems: 2,
          },
        },
        required: ['title', 'description', 'competingForces'],
      },
    },
  },
  required: ['summary', 'domainImpacts', 'ripples', 'tensions'],
} as const;

export interface BuildUserPromptInput {
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
}

export function buildUserPrompt(input: BuildUserPromptInput): string {
  if (!input.parentNode) {
    return `Analyze the following foundational seed premise from first principles:

SEED PREMISE: "${input.premise}"

Requirements:
- Cover all 6 systemic domains (economy, society, governance, identity, culture, technology) with concrete mechanisms rather than generic tropes.
- Trace clear 1st-order, 2nd-order, and 3rd-order causal ripples where each order emerges logically from the previous one.
- Surface 2 to 3 sharp, non-obvious emergent tensions or paradoxes with exactly 2 competing forces each.
- Aim for the intellectual sensation: "I didn't expect that, but it makes complete sense upon examination."`;
  }

  const lineageText =
    input.lineage && input.lineage.length > 0
      ? input.lineage
          .map(
            (step, idx) =>
              `  ${idx + 1}. Premise: "${step.premise}"${
                step.divergenceTrigger ? ` (Divergence from: ${step.divergenceTrigger})` : ''
              }\n     Macro-State: ${step.summary}`
          )
          .join('\n')
      : `  1. Premise: "${input.parentNode.premise}"\n     Macro-State: ${input.parentNode.summary}`;

  const parentTensions = input.parentNode.tensions
    .map(
      (t) =>
        `  - ${t.title} (${t.competingForces[0]} vs. ${t.competingForces[1]}): ${t.description}`
    )
    .join('\n');

  return `We are branching from an existing systemic equilibrium in The Possibility Engine.

CIVILIZATIONAL LINEAGE SO FAR:
${lineageText}

PARENT EQUILIBRIUM DETAILS:
- Parent First-Order Ripple: ${input.parentNode.ripples.firstOrder}
- Parent Second-Order Ripple: ${input.parentNode.ripples.secondOrder}
- Parent Third-Order Ripple: ${input.parentNode.ripples.thirdOrder}
- Active Parent Tensions:
${parentTensions}
${
  input.divergenceTrigger
    ? `\nTARGETED TENSION / ASSUMPTION BEING CHALLENGED:\n"${input.divergenceTrigger}"\n`
    : ''
}
NEW INTERVENTION / MODIFYING CONSTRAINT:
"${input.premise}"

Task:
Derive the new downstream systemic equilibrium caused by injecting this intervention into the parent state. Show how the intervention resolves, mutates, or intensifies parent constraints and gives rise to a genuinely unexpected yet logically airtight civilization branch.
Cover all 6 systemic domains (economy, society, governance, identity, culture, technology), multi-order causal ripples, and 2 to 3 new emergent tensions with exactly 2 competing forces each.`;
}

export const EXAMPLE_SEED_PREMISES: string[] = [
  'Energy is free',
  'AGI replaces all management',
  'Humans live 200 years',
  'Direct neural translation erases every language barrier',
  'Molecular recycling makes virgin mining obsolete',
];
