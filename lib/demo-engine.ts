import type { ReasoningPayload, ReasonRequestBody } from '@/types/scenario';
import { ReasoningPayloadSchema } from '@/types/scenario';

/**
 * Canonical root scenario from Section 7 of the PRD: "Energy is free"
 */
const ENERGY_FREE_ROOT: ReasoningPayload = {
  summary:
    'The marginal cost of energy generation collapses to zero across industrial, municipal, and personal sectors, decoupling material processing from fossil constraints and transforming thermal dissipation into the primary global bottleneck.',
  domainImpacts: [
    {
      domain: 'economy',
      structuralChange:
        'Manufacturing, desalination, and atmospheric extraction costs drop by over 80%; economic scarcity pivots entirely from energy availability to raw physical matter, mineral deposits, and computational hardware.',
      underlyingMechanism:
        'When joules approach zero marginal cost, every energy-gated transformation (electrolysis, synthetic hydrocarbons, high-temperature refining) becomes economically trivial, exposing atomic element concentration and physical throughput as the new floor.',
    },
    {
      domain: 'governance',
      structuralChange:
        'Traditional petrochemical geopolitical leverage evaporates; sovereign power re-anchors around high-bandwidth transport corridors and planetary heat-sink territory.',
      underlyingMechanism:
        'States can no longer extract geopolitical rent from fossil chokepoints, shifting strategic advantage toward polar coastlines, deep-ocean cold sinks, and orbital radiation infrastructure.',
    },
    {
      domain: 'society',
      structuralChange:
        'Massive urbanization in previously inhospitable climates (deserts, arctic regions) becomes viable through unmetered climate control and localized vertical farming.',
      underlyingMechanism:
        'Habitability stops being determined by ambient climate or arable watershed proximity once enclosed ecosystems and atmospheric water harvesting carry zero ongoing power expense.',
    },
    {
      domain: 'technology',
      structuralChange:
        'Nuclear and renewable investments cease capital deployment for grid power, pivoting R&D entirely toward ultra-high-density thermal management and radiative cooling.',
      underlyingMechanism:
        'Every watt consumed eventually degrades into low-grade waste heat; unconstrained energy use turns entropy rejection into the single hardest physical engineering limit.',
    },
    {
      domain: 'identity',
      structuralChange:
        'Personal status detaches from material consumption and reattaches to ecological restraint, provenance of rare physical atoms, and low-thermal-footprint craftsmanship.',
      underlyingMechanism:
        'When anyone can synthesize abundance effortlessly, conspicuous energy expenditure loses signaling value and shifts toward scarcity of untouched landscapes and silent, cool environments.',
    },
    {
      domain: 'culture',
      structuralChange:
        'Architecture and civic ritual reorganize around heat-dissipation aesthetics: subterranean cooled cities, reflective mirror-scapes, and nocturnal urban rhythms.',
      underlyingMechanism:
        'Living inside a high-throughput energetic civilization makes ambient thermal comfort a shared commons, embedding thermodynamic literacy into everyday language and design.',
    },
  ],
  ripples: {
    firstOrder:
      'Massive, immediate surge in power-intensive industrial processing, widespread ocean water desalination, and continuous artificial climate control.',
    secondOrder:
      'Runaway localized planetary heating and microclimate disruption caused by planetary-scale thermodynamic waste heat rejection.',
    thirdOrder:
      'Establishment of global thermal regulatory authorities that ration atmospheric heat release rather than energy consumption.',
  },
  tensions: [
    {
      title: 'The Abundance Heat Trap',
      description:
        'Infinite production capacity collides head-on with planetary thermodynamic dissipation limits: generating power is free, but dumping the resulting waste heat destabilizes local and global weather systems.',
      competingForces: [
        'Unbounded Material Abundance',
        'Planetary Thermodynamic Dissipation Limits',
      ],
    },
    {
      title: 'Resource Decentralization vs. Grid Dominance',
      description:
        'Localized zero-cost generation renders legacy utility monopolies obsolete, yet uncoordinated micro-industrial energy surges overwhelm shared cooling watersheds and regional infrastructure stability.',
      competingForces: [
        'Hyper-Local Sovereign Generation',
        'Centralized Thermal & Grid Stability',
      ],
    },
    {
      title: 'Post-Scarcity Synthesis vs. Elemental Monopolies',
      description:
        'Cheap transmutation and extraction lower prices for bulk goods, while bottlenecks concentrate fiercely around rare-earth catalysts, ultra-pure silicon, and precision fabrication patents.',
      competingForces: [
        'Universal Bulk Abundance',
        'Concentrated Elemental Bottlenecks',
      ],
    },
  ],
};

/**
 * Canonical child branch from Section 7 of the PRD: Thermal emission quotas.
 */
const THERMAL_QUOTA_BRANCH: ReasoningPayload = {
  summary:
    'A thermodynamic credit economy supersedes fiat currency, where civilization values are measured in negative entropy and radiative access to orbital heat sinks.',
  domainImpacts: [
    {
      domain: 'economy',
      structuralChange:
        'Global markets re-denominate around Watts-Rejected-to-Space (WRS) quotas; industrial firms compete less on labor efficiency and more on exergy conservation and reversible computing.',
      underlyingMechanism:
        'When atmospheric heat release is legally capped while energy input is free, every profitable operation must minimize net entropy dumped inside the biosphere.',
    },
    {
      domain: 'governance',
      structuralChange:
        'A supranational Thermal Clearinghouse monitors infrared satellite signatures in real time, wielding enforcement power stronger than 20th-century central banks.',
      underlyingMechanism:
        'Unlike hidden financial transfers, planetary waste heat obeys blackbody radiation laws and is physically impossible to conceal from orbital thermal telemetry.',
    },
    {
      domain: 'society',
      structuralChange:
        'Population and heavy compute clusters migrate to high-altitude arid plateaus and polar zones with superior radiative sky windows, creating "Cold-Belt" megacities.',
      underlyingMechanism:
        'Dry, thin upper-atmosphere corridors radiate infrared directly to space more efficiently, granting residents higher per-capita thermal allowances.',
    },
    {
      domain: 'technology',
      structuralChange:
        'Reversible adiabatic computing, cryogenic superconductors, and orbital heat-beaming lasers become the premier trillion-dollar engineering sectors.',
      underlyingMechanism:
        'Computing or manufacturing closer to the Landauer limit lets enterprises execute orders of magnitude more work per unit of thermal credit spent.',
    },
    {
      domain: 'identity',
      structuralChange:
        'Citizens adopt personal "entropy budgets" as a moral identity marker; extreme minimalism and biological quietude evolve into high-prestige subcultures.',
      underlyingMechanism:
        'Because individual lifestyle choices translate transparently into measurable thermal emissions, ethical selfhood anchors around negentropy stewardship.',
    },
    {
      domain: 'culture',
      structuralChange:
        'Black-market "heat laundering" — disguising unauthorized computation inside volcanic vents or deep geothermal aquifers — becomes the defining mythos of countercultural rebellion.',
      underlyingMechanism:
        'Any absolute planetary metering regime spawns underground engineering subcultures seeking physical loopholes in orbital surveillance.',
    },
  ],
  ripples: {
    firstOrder:
      'Immediate rationing of high-heat industrial plants and AI data centers on Earth, spiking the price of atmospheric thermal permits overnight.',
    secondOrder:
      'Accelerated off-world industrial exodus as capital floods into lunar and orbital manufacturing platforms that can radiate waste heat unimpeded into deep space.',
    thirdOrder:
      'Bifurcation of human civilization into a tightly metered, biosphere-preserving Earth and an unconstrained, high-entropy orbital industrial commons.',
  },
  tensions: [
    {
      title: 'Biosphere Preservation vs. Orbital Secession',
      description:
        'Off-world industrial habitats escape planetary thermal quotas entirely, creating a structural wealth and power divergence between metered Earth citizens and unconstrained space-based entities.',
      competingForces: [
        'Terrestrial Ecological Governance',
        'Unconstrained Orbital Sovereignty',
      ],
    },
    {
      title: 'Total Infrared Transparency vs. Civic Privacy',
      description:
        'Enforcing thermal budgets requires continuous sub-meter orbital infrared auditing, making concealed gathering, private experimentation, or political dissent physically legible from space.',
      competingForces: [
        'Verifiable Thermodynamic Compliance',
        'Human Right to Unobserved Activity',
      ],
    },
  ],
};

/**
 * Bespoke model for "AGI replaces all management"
 */
const AGI_MANAGEMENT_ROOT: ReasoningPayload = {
  summary:
    'Algorithmic coordination collapses institutional hierarchy costs to near zero, dissolving middle management and shifting human economic agency from supervisory status toward extreme taste, physical presence, and accountability underwriting.',
  domainImpacts: [
    {
      domain: 'economy',
      structuralChange:
        'Traditional multi-layered corporations fracture into hyper-fluid, single-mission micro-collectives dynamically assembled and dissolved by autonomous allocation engines.',
      underlyingMechanism:
        'Coasean firm boundaries exist primarily because internal human coordination is cheaper than market transactions; when AGI drops coordination friction to zero, large permanent bureaucracies lose their structural justification.',
    },
    {
      domain: 'governance',
      structuralChange:
        'Regulatory frameworks struggle to assign legal liability when strategic decisions emerge from continuously optimizing coordination graphs rather than named executives.',
      underlyingMechanism:
        'Modern corporate and administrative law presupposes an identifiable human decision-maker with mens rea; distributed algorithmic orchestration breaks that attribution chain.',
    },
    {
      domain: 'society',
      structuralChange:
        'The professional-managerial class loses its primary career ladder, forcing a massive socio-economic realignment around crafts, care work, embodied leadership, and public civic roles.',
      underlyingMechanism:
        'For a century, upward mobility meant transitioning from doing work to coordinating others; automating coordination eliminates the main escalator of middle-class status.',
    },
    {
      domain: 'identity',
      structuralChange:
        'Self-worth detaches from org-chart rank and job titles, migrating toward verifiable personal conviction, artistic direction, and willingness to bear moral responsibility.',
      underlyingMechanism:
        'When optimization is abundant and cheap, deciding *what ought to be pursued* and staking personal reputation on the outcome becomes the scarcest human signal.',
    },
    {
      domain: 'culture',
      structuralChange:
        'A counter-movement celebrates deliberately inefficient, human-run guilds and consensus cooperatives as luxury cultural experiences and sites of social belonging.',
      underlyingMechanism:
        'Frictionless algorithmic routing removes the messy interpersonal negotiations through which humans historically forged trust, friendships, and community solidarity.',
    },
    {
      domain: 'technology',
      structuralChange:
        'Enterprise software shifts from dashboards and ticketing systems to objective-function design languages, value-alignment verifiers, and real-time incentive markets.',
      underlyingMechanism:
        'Dashboards existed to compress complexity for bounded human managers; autonomous coordinators ingest raw telemetry directly and require formal constraint specifications instead.',
    },
  ],
  ripples: {
    firstOrder:
      'Rapid flattening of Fortune 500 org charts as scheduling, budgeting, procurement, and KPI routing shift to continuous multi-agent orchestration.',
    secondOrder:
      'Emergence of "liability underwriters" — licensed human principals paid specifically to audit, authorize, and accept legal responsibility for autonomous operational plans.',
    thirdOrder:
      'Reconstitution of the economy around protocol-native cooperatives where humans own objective functions and constitutional constraints rather than employment contracts.',
  },
  tensions: [
    {
      title: 'Hyper-Efficiency vs. Legible Accountability',
      description:
        'Organizations run by opaque optimization graphs outperform human-managed rivals dramatically, yet become nearly impossible for citizens or courts to interrogate when systemic harm occurs.',
      competingForces: [
        'Autonomous Operational Throughput',
        'Democratic & Legal Legibility',
      ],
    },
    {
      title: 'Zero-Friction Routing vs. Social Cohesion',
      description:
        'Eliminating workplace politics and coordination meetings boosts output while quietly eroding the shared informal rituals where adults build durable social capital.',
      competingForces: [
        'Frictionless Task Allocation',
        'Organic Workplace Community',
      ],
    },
  ],
};

/**
 * Bespoke model for "Humans live 200 years"
 */
const HUMANS_200_YEARS_ROOT: ReasoningPayload = {
  summary:
    'Doubling healthy human lifespans breaks the generational turnover engine of capital, institutions, and culture, transforming society from a sprint of sequential generations into a deeply layered, multi-century memory civilization.',
  domainImpacts: [
    {
      domain: 'economy',
      structuralChange:
        'Compound wealth accumulation over 150 working years concentrates asset ownership across centenarian cohorts, triggering structural reform of inheritance, land tenure, and time-limited equity.',
      underlyingMechanism:
        'Exponential compounding over a two-century horizon turns minor early-life advantages into insurmountable capital monopolies unless ownership rights decay over time.',
    },
    {
      domain: 'governance',
      structuralChange:
        'Constitutional systems introduce mandatory term limits, rotational sortition, and "generational sunset clauses" to prevent permanent geriatric capture of public institutions.',
      underlyingMechanism:
        'Political renewal previously relied on biological mortality to cycle entrenched coalitions out of office; removing that biological clock freezes institutional norms unless redesigned.',
    },
    {
      domain: 'society',
      structuralChange:
        'The linear life template (education → career → retirement) collapses into cyclical 30-year "chapters" featuring multiple unrelated careers, renewable marriage contracts, and sabbatical decades.',
      underlyingMechanism:
        'No single profession, social role, or domestic arrangement remains psychologically sustainable or economically relevant across two centuries of technological drift.',
    },
    {
      domain: 'identity',
      structuralChange:
        'Personal identity shifts from a continuous static autobiography to curated serial selves, with intentional memory pruning and episodic reinvention becoming socially normalized.',
      underlyingMechanism:
        'Human episodic memory and narrative coherence strain under 150+ years of accumulated experience, making deliberate self-editing essential for psychological vitality.',
    },
    {
      domain: 'culture',
      structuralChange:
        'Long-horizon aesthetics surge — cathedral-scale architecture, century-spanning ecological restorations, and slow art — alongside acute cultural nostalgia wars between five coexisting adult eras.',
      underlyingMechanism:
        'When creators expect to personally inhabit the consequences of their choices a century later, discount rates plummet and long-term stewardship becomes self-interested.',
    },
    {
      domain: 'technology',
      structuralChange:
        'Neuroplasticity therapeutics, continuous cognitive retraining interfaces, and ultra-durable archival storage become foundational infrastructure.',
      underlyingMechanism:
        'Extending bodily health without maintaining mental adaptability creates a civilization locked into century-old conceptual frameworks.',
    },
  ],
  ripples: {
    firstOrder:
      'Immediate insolvency of pension formulas, life-insurance actuarial tables, and tenure-based academic and judicial appointments.',
    secondOrder:
      'Acute intergenerational friction as young cohorts face blocked promotion paths and housing scarcity, catalyzing political movements for time-capped capital and leadership rotation.',
    thirdOrder:
      'Emergence of a "Long-Now" institutional order characterized by fixed-duration contracts, decaying asset rights, and century-scale ecological planning.',
  },
  tensions: [
    {
      title: 'Accumulated Wisdom vs. Institutional Ossification',
      description:
        'Multi-century personal memory prevents societies from repeating historical catastrophes, yet entrenched cognitive paradigms slow radical scientific and cultural paradigm shifts.',
      competingForces: [
        'Deep Civilizational Memory',
        'Generational Paradigm Renewal',
      ],
    },
    {
      title: 'Compound Continuity vs. Youth Agency',
      description:
        'Protecting long-term personal stakes rewards stewardship, while locking younger generations out of land, capital, and leadership until age 70 undermines civic legitimacy.',
      competingForces: [
        'Long-Horizon Stewardship Incentives',
        'Intergenerational Mobility',
      ],
    },
  ],
};

/**
 * Dynamic first-principles fallback generator for arbitrary premises and deep branches.
 * Designed to avoid generic fluff and weave both the premise and parent lineage directly
 * into a structured multi-domain, multi-order causal analysis.
 */
function synthesizeDynamicScenario(input: ReasonRequestBody): ReasoningPayload {
  const premise = input.premise.trim();
  const isBranch = Boolean(input.parentNode);
  const parentPremise = input.parentNode?.premise ?? '';
  const trigger = input.divergenceTrigger;

  const shortPremise =
    premise.length > 96 ? `${premise.slice(0, 93).trimEnd()}...` : premise;

  if (isBranch) {
    return {
      summary: `Introducing the constraint "${shortPremise}" destabilizes the prior equilibrium ("${truncate(
        parentPremise,
        64
      )}"), forcing institutions to reorganize around the newly exposed bottleneck rather than the original abundance.`,
      domainImpacts: [
        {
          domain: 'economy',
          structuralChange: `Pricing and capital allocation pivot immediately around scarcity created by "${shortPremise}", invalidating business models built solely on the parent state.`,
          underlyingMechanism: `When a secondary constraint is imposed on a radical baseline shift, economic rent migrates to whichever intermediary can meter, arbitrage, or bypass the newly binding limit.`,
        },
        {
          domain: 'governance',
          structuralChange: `Regulatory bodies shift from managing legacy outputs to auditing compliance with "${shortPremise}", creating new jurisdictional fault lines between strict enforcers and permissive havens.`,
          underlyingMechanism: `Enforcement of a newly binding constraint requires measurement infrastructure; whoever controls the verification protocol inherits de facto sovereign leverage.`,
        },
        {
          domain: 'society',
          structuralChange: `New social stratification emerges between communities structurally adapted to "${shortPremise}" and legacy populations still optimized for the prior regime.`,
          underlyingMechanism: `Institutional transitions distribute adaptation costs asymmetrically, rewarding early architectural re-design while stranding populations tied to older norms.`,
        },
        {
          domain: 'technology',
          structuralChange: `R&D capital floods into workarounds, efficiency multipliers, and measurement tooling specifically targeting the bottleneck introduced by "${shortPremise}".`,
          underlyingMechanism: `Binding constraints act as evolutionary selectors for engineering talent, redirecting innovation away from already-commoditized capabilities.`,
        },
        {
          domain: 'identity',
          structuralChange: `Status and moral prestige re-anchor around fluency and restraint under "${shortPremise}", replacing older markers inherited from "${truncate(
            parentPremise,
            48
          )}".`,
          underlyingMechanism: `Visible mastery of the civilization's hardest constraint always becomes the primary medium of social distinction and personal credibility.`,
        },
        {
          domain: 'culture',
          structuralChange: `Art, civic rituals, and countercultures crystallize around the friction between the promise of "${truncate(
            parentPremise,
            48
          )}" and the boundary set by "${shortPremise}".`,
          underlyingMechanism: `Cultural meaning thrives precisely where idealized abundance meets stubborn physical or institutional limits${
            trigger ? `, especially along the fault line of "${trigger}"` : ''
          }.`,
        },
      ],
      ripples: {
        firstOrder: `Immediate repricing and operational disruption across systems that assumed "${truncate(
          parentPremise,
          56
        )}" could scale without encountering "${shortPremise}".`,
        secondOrder: `Emergence of specialized compliance networks, workaround technologies, and geographic arbitrage zones seeking to optimize inside the new boundary.`,
        thirdOrder: `Permanent institutional bifurcation: civilization codifies "${shortPremise}" into constitutional baselines, shifting human ambition toward domains untouched by this constraint.`,
      },
      tensions: [
        {
          title: 'Constraint Compliance vs. Structural Evasion',
          description: `Strict enforcement of "${shortPremise}" preserves systemic stability, yet creates overwhelming incentives for gray-market workarounds and off-jurisdiction exits.`,
          competingForces: [
            'Systemic Boundary Enforcement',
            'Adaptive Arbitrage & Exit',
          ],
        },
        {
          title: 'Inherited Expectations vs. New Equilibrium',
          description: `Populations socialized under "${truncate(
            parentPremise,
            48
          )}" resist the behavioral discipline demanded by "${shortPremise}", generating recurring legitimacy crises.`,
          competingForces: [
            'Legacy Baseline Expectations',
            'Constraint-Driven Reorganization',
          ],
        },
        {
          title: 'Metered Coordination vs. Local Autonomy',
          description: `Managing the interaction between parent dynamics and "${shortPremise}" favors centralized telemetry, directly colliding with decentralized community self-determination.`,
          competingForces: [
            'High-Resolution Central Auditing',
            'Decentralized Local Sovereignty',
          ],
        },
      ],
    };
  }

  return {
    summary: `If "${shortPremise}" becomes structurally true, legacy scarcity bottlenecks collapse rapidly, triggering a civilizational re-anchoring around whichever physical, cognitive, or attentional constraints remain non-substitutable.`,
    domainImpacts: [
      {
        domain: 'economy',
        structuralChange: `Value capture collapses in sectors predicated on pre-shift scarcity and migrates rapidly to complementary bottlenecks amplified by "${shortPremise}".`,
        underlyingMechanism: `Whenever a foundational input or capability undergoes a step-change, Jevons-style demand expansion pushes adjacent physical, coordination, and trust limits to the forefront of pricing.`,
      },
      {
        domain: 'governance',
        structuralChange: `Sovereign institutions lose traditional fiscal or regulatory choke points and scramble to establish legitimacy over the new systemic externalities of "${shortPremise}".`,
        underlyingMechanism: `State capacity is built to tax and regulate slow, legible legacy flows; rapid phase transitions outpace statutory definitions and force new treaties and enforcement architectures.`,
      },
      {
        domain: 'society',
        structuralChange: `Daily rhythms, geographic settlement patterns, and household economics reorganize around the new affordances unlocked by "${shortPremise}".`,
        underlyingMechanism: `Human social geometry adapts to minimize the highest remaining friction; removing a historic constraint immediately redistributes where and how communities assemble.`,
      },
      {
        domain: 'technology',
        structuralChange: `Engineering priorities pivot away from optimizing the now-solved layer and toward safety, verification, interface design, and second-order side-effect mitigation.`,
        underlyingMechanism: `Once a breakthrough commoditizes its primary function, technical differentiation shifts to reliability, integration, and managing unintended systemic coupling.`,
      },
      {
        domain: 'identity',
        structuralChange: `Individuals reconstruct personal agency and dignity around domains that "${shortPremise}" cannot trivially automate, replicate, or equalize.`,
        underlyingMechanism: `Human status-seeking is invariant even when material conditions transform; prestige migrates relentlessly toward the scarcest remaining human qualities.`,
      },
      {
        domain: 'culture',
        structuralChange: `Competing aesthetic movements emerge—one embracing maximalist exploration of "${shortPremise}" and another fetishizing pre-shift friction and provenance.`,
        underlyingMechanism: `Every major structural discontinuity produces simultaneous futurist acceleration and neo-traditionalist conservation as society digests what was gained and lost.`,
      },
    ],
    ripples: {
      firstOrder: `Rapid adoption and shock repricing across incumbent institutions directly exposed to "${shortPremise}", collapsing older cost structures within a single planning cycle.`,
      secondOrder: `Institutional counter-reactions, emergency regulatory frameworks, and unexpected bottleneck congestion in adjacent domains that were previously unconstrained.`,
      thirdOrder: `Deep civilizational reorganization in which legal norms, urban design, and human life trajectories assume "${shortPremise}" as invisible baseline infrastructure.`,
    },
    tensions: [
      {
        title: 'Abundance Shock vs. Institutional Adaptation Speed',
        description: `The capabilities unlocked by "${shortPremise}" propagate orders of magnitude faster than courts, norms, and governance architectures can update their legitimacy rules.`,
        competingForces: [
          'Exponential Capability Diffusion',
          'Deliberative Institutional Legitimacy',
        ],
      },
      {
        title: 'Frictionless Optimization vs. Human Meaning',
        description: `Removing historic constraints liberates human potential while simultaneously dissolving the shared struggles and roles around which communities built cohesion.`,
        competingForces: [
          'Structural Constraint Removal',
          'Purposeful Human Agency',
        ],
      },
      {
        title: 'Open Access vs. Emerging Bottleneck Capture',
        description: `Even as "${shortPremise}" democratizes one layer of reality, newly binding adjacent dependencies risk concentrating power in fewer hands than before.`,
        competingForces: [
          'Broad Structural Democratization',
          'Adjacent Chokepoint Consolidation',
        ],
      },
    ],
  };
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen - 1).trimEnd()}…`;
}

/**
 * Generates a guaranteed Zod-validated ReasoningPayload locally without external network calls.
 */
export function generateDemoReasoning(input: ReasonRequestBody): ReasoningPayload {
  const normalizedPremise = input.premise.trim().toLowerCase();
  const normalizedParent = input.parentNode?.premise.trim().toLowerCase() ?? '';
  const normalizedTrigger = input.divergenceTrigger?.trim().toLowerCase() ?? '';

  // Canonical Section 7 child walkthrough detection
  if (
    input.parentNode &&
    (normalizedPremise.includes('heat') ||
      normalizedPremise.includes('thermal') ||
      normalizedPremise.includes('dissipation') ||
      normalizedPremise.includes('quota')) &&
    (normalizedParent.includes('energy') ||
      normalizedTrigger.includes('heat'))
  ) {
    return ReasoningPayloadSchema.parse(THERMAL_QUOTA_BRANCH);
  }

  // Canonical Section 7 root walkthrough detection
  if (
    !input.parentNode &&
    (normalizedPremise === 'energy is free' ||
      (normalizedPremise.includes('energy') &&
        (normalizedPremise.includes('free') ||
          normalizedPremise.includes('zero cost') ||
          normalizedPremise.includes('zero-cost'))))
  ) {
    return ReasoningPayloadSchema.parse(ENERGY_FREE_ROOT);
  }

  // Example prompt 2: AGI replaces all management
  if (
    !input.parentNode &&
    normalizedPremise.includes('agi') &&
    normalizedPremise.includes('management')
  ) {
    return ReasoningPayloadSchema.parse(AGI_MANAGEMENT_ROOT);
  }

  // Example prompt 3: Humans live 200 years
  if (
    !input.parentNode &&
    (normalizedPremise.includes('200 years') ||
      (normalizedPremise.includes('live') && normalizedPremise.includes('200')))
  ) {
    return ReasoningPayloadSchema.parse(HUMANS_200_YEARS_ROOT);
  }

  return ReasoningPayloadSchema.parse(synthesizeDynamicScenario(input));
}
