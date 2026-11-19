#!/usr/bin/env node
/**
 * Script: scripts/add50NodesAndDedupe.mjs
 *
 * 1. Checks TECH_CARDS and deduplicates any existing non-unique IDs.
 * 2. Adds around 50 additional nodes across domain sections until the total count is ~1,050.
 * 3. Guarantees 100% unique IDs, valid required fields, equations, jargon, and tagSoup.
 * 4. Synchronizes SECTIONS[].totalCards with the exact counts.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATASET_PATH = path.resolve(__dirname, '../lib/dataset.ts');

const DOMAIN_BLUEPRINTS = [
  {
    prefix: 'Distributed Zero-Knowledge Verification Core',
    sub: 'Cryptographic Rollup Enclaves',
    concept: 'recursive STARK polynomial proof compression over multi-threaded WASM workers',
    nick: 'Ghost zkRollup',
    eqName: 'Recursive STARK Proof Verification Bound',
    eqFormula: '\\tau_{verify} = \\mathcal{O}(\\log^2 d) + \\lambda \\cdot |\\pi_{FRI}|, \\quad \\epsilon_{sound} < 2^{-128}',
    jargonTerm: 'FRI Low-Degree Testing',
    jargonDef: 'Fast Reed-Solomon Interactive Oracle Proof used in STARKs to verify polynomial degrees in logarithmic steps.',
    tags: ['zk-stark', 'fri-protocol', 'recursive-proof', 'verifiable-computation', 'zero-knowledge']
  },
  {
    prefix: 'Deterministic Lock-Free Memory Arbiter',
    sub: 'Real-Time Hardware Fabrics',
    concept: 'hardware-enforced atomic compare-and-swap ring buffers avoiding thread preemption jitter',
    nick: 'Chronos Bus',
    eqName: 'Lock-Free Wait-Free Bounded Progress Theorem',
    eqFormula: 'T_{step} \\le N_{threads} \\cdot \\tau_{CAS} + \\delta_{bus}, \\quad \\lim_{N \\to \\infty} P(\\text{starvation}) = 0',
    jargonTerm: 'Wait-Free Linearizability',
    jargonDef: 'Strongest concurrency guarantee where every thread completes operations in a bounded number of execution steps.',
    tags: ['lock-free', 'atomic-cas', 'ring-buffer', 'deterministic-latency', 'kernel-bypass']
  },
  {
    prefix: 'Adaptive Metasurface RF Null-Steering Array',
    sub: 'Electromagnetic Electronic Protection',
    concept: 'varactor-loaded programmable metasurface forming real-time 45dB spatial nulls against high-power jammers',
    nick: 'Aegis Null',
    eqName: 'Adaptive Array Output SINR Optimization',
    eqFormula: '\\text{SINR}_{out} = \\frac{\\mathbf{w}^H \\mathbf{R}_{ss} \\mathbf{w}}{\\mathbf{w}^H (\\mathbf{R}_{nn} + \\mathbf{R}_{jj}) \\mathbf{w}} \\ge \\gamma_{thresh}',
    jargonTerm: 'Deep Null Steering',
    jargonDef: 'Adjusting array weights to position antenna pattern zeros directly in the spatial arrival angle of interference.',
    tags: ['rf-null-steering', 'electronic-protection', 'adaptive-beamforming', 'sinr-optimization', 'metasurface']
  },
  {
    prefix: 'Asymmetric FPV Drone Swarm Interceptor Mesh',
    sub: 'Counter-UAS Kinetic Defense',
    concept: 'decentralized visual-inertial relative localization and terminal proportional guidance interceptors',
    nick: 'Falcon Net',
    eqName: 'Augmented Proportional Navigation (APN) Acceleration',
    eqFormula: '\\mathbf{a}_{cmd} = N^{\\prime} V_c \\dot{\\vec{\\lambda}} + \\frac{N^{\\prime}}{2} \\mathbf{a}_{target\\perp}',
    jargonTerm: 'Visual-Inertial Odometry (VIO)',
    jargonDef: 'Estimating 3D position and orientation by fusing high-framerate camera optical flow with IMU accelerometers.',
    tags: ['c-uas', 'fpv-swarm', 'proportional-navigation', 'visual-odometry', 'kinetic-interceptor']
  },
  {
    prefix: 'Quantum Superconducting Resonator Readout Multiplexer',
    sub: 'Cryogenic Quantum Computing',
    concept: 'frequency-multiplexed kinetic inductance traveling-wave parametric amplifiers operating at 15 mK',
    nick: 'Cryo Resonator',
    eqName: 'TWPA Parametric Quantum-Limited Gain',
    eqFormula: 'G(f) = 1 + \\tanh^2(g \\cdot L), \\quad T_{noise} = \\frac{\\hbar \\omega}{2 k_B}',
    jargonTerm: 'Traveling-Wave Parametric Amplifier (TWPA)',
    jargonDef: 'Near-quantum-limited amplifier operating at microwave frequencies with multi-gigahertz instantaneous bandwidth.',
    tags: ['quantum-readout', 'twpa', 'superconducting-qubits', 'cryogenic-multiplexing', 'quantum-limit']
  },
  {
    prefix: 'High-Throughput eBPF Sovereign Flow Gate',
    sub: 'Cloud-Native Enclave Isolation',
    concept: 'programmable kernel TC-BFP classifier enforcing zero-trust microsegmentation at line rates',
    nick: 'Sentinel Gate',
    eqName: 'Kernel Zero-Copy Flow Filtering Throughput',
    eqFormula: '\\Phi_{pps} = \\frac{1}{t_{parse} + t_{bpf\\_map\\_lookup} + t_{action}} \\ge 1.488 \\times 10^7 \\text{ pps}',
    jargonTerm: 'eBPF Map Pinning',
    jargonDef: 'Persisting eBPF kernel state tables in the bpffs virtual filesystem so userspace daemons can read counters without restarts.',
    tags: ['ebpf', 'xdp', 'packet-filtering', 'zero-trust-isolation', 'line-rate']
  },
  {
    prefix: 'Bayesian Active Learning Pipeline for Rare Failure Modes',
    sub: 'High-Assurance Safety Verification',
    concept: 'expected information gain acquisition functions identifying edge-case failure boundaries in autonomous controllers',
    nick: 'Edge Scout',
    eqName: 'Mutual Information Acquisition Bound',
    eqFormula: '\\mathcal{I}(\\theta; y \\mid x, \\mathcal{D}) = \\mathcal{H}(y \\mid x, \\mathcal{D}) - \\mathbb{E}_{p(\\theta \\mid \\mathcal{D})}[\\mathcal{H}(y \\mid x, \\theta)]',
    jargonTerm: 'BALD Acquisition Function',
    jargonDef: 'Bayesian Active Learning by Disagreement; selects inputs that maximize mutual information between model predictions and parameters.',
    tags: ['active-learning', 'bayesian-optimization', 'uncertainty-sampling', 'rare-events', 'safety-assurance']
  },
  {
    prefix: 'Multi-Modal Test-Time Compute Tree Search',
    sub: 'Frontier Reasoning Systems',
    concept: 'Monte Carlo rollouts with step-level process reward models for cross-modal proof construction',
    nick: 'Argus Search',
    eqName: 'Step-Level PRM Search Value Propagation',
    eqFormula: 'V(s_t) = \\gamma \\cdot V(s_{t+1}) + r_{PRM}(s_t, a_t), \\quad \\pi^*(a_t \\mid s_t) = \\arg\\max_{a} Q(s_t, a)',
    jargonTerm: 'Process Supervision',
    jargonDef: 'Scoring individual intermediate reasoning steps rather than evaluating only the final answer.',
    tags: ['test-time-compute', 'process-reward-model', 'mcts', 'reasoning-models', 'multi-modal']
  },
  {
    prefix: 'Continuous-Variable Quantum Key Distribution (CV-QKD)',
    sub: 'Post-Quantum Cryptographic Security',
    concept: 'coherent optical state modulation with homodyne detection over commercial standard single-mode telecom fiber',
    nick: 'Quantum Cipher',
    eqName: 'Asymptotic Secret Key Rate Bound',
    eqFormula: 'R_{secret} \\ge \\beta \\cdot I(A; B) - \\chi(B; E)',
    jargonTerm: 'Holevo Bound \\chi(B; E)',
    jargonDef: 'Maximum quantum information that an eavesdropper can extract from entangled quantum states.',
    tags: ['cv-qkd', 'quantum-cryptography', 'homodyne-detection', 'holevo-bound', 'telecom-fiber']
  },
  {
    prefix: 'Neuromorphic Event-Camera Optical Flow Tracker',
    sub: 'High-Speed Dynamic Vision',
    concept: 'asynchronous microsecond temporal contrast sensors estimating velocity manifolds during extreme angular rotation',
    nick: 'Viper Vision',
    eqName: 'Continuous-Time Event Optical Flow Constraint',
    eqFormula: '\\nabla L(x, y, t) \\cdot \\vec{v} + \\frac{\\partial L}{\\partial t} = 0, \\quad \\Delta t_{event} < 10^{-6} \\text{ s}',
    jargonTerm: 'Dynamic Vision Sensor (DVS)',
    jargonDef: 'Bio-inspired camera whose pixels output discrete asynchronous spikes only upon detecting local log-intensity changes.',
    tags: ['event-camera', 'dvs', 'optical-flow', 'neuromorphic-vision', 'microsecond-latency']
  }
];

const LEVELS = ['Fundamental', 'Intermediate', 'Advanced', 'Frontier', 'Expert'];

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
}

function buildSynthesizedCard(section, blueprint, globalIndex) {
  const variantNum = Math.floor(globalIndex / DOMAIN_BLUEPRINTS.length) + 1;
  const cardId = `${section.id}-synth-${globalIndex}-${variantNum}`;
  const level = LEVELS[globalIndex % LEVELS.length];
  const isMilitary = section.domainClassification === 'military';

  const title = `${section.shortTitle}: ${blueprint.prefix} [Mk-${variantNum}]`;
  const subcategory = `${blueprint.sub} · Mk-${variantNum}`;
  const description = `Operational high-assurance ${section.title} architecture utilizing ${blueprint.concept} for robust, verified execution in ${section.shortTitle} operational enclaves (Node #${globalIndex}).`;
  const extendedNotes = `Designed for mission-critical ${section.title} environments, this Mk-${variantNum} specification pairs ${blueprint.concept} with strict invariant enforcement and sub-millisecond telemetry monitoring.`;

  const equations = [
    {
      name: `${blueprint.eqName} (${section.shortTitle} Mk-${variantNum})`,
      formula: blueprint.eqFormula,
      variables: [
        { symbol: '\\tau', explanation: `Latency bound parameter for ${section.shortTitle}` },
        { symbol: '\\lambda', explanation: 'Operational stability multiplier' },
        { symbol: '\\epsilon_{sound}', explanation: 'Maximum permissible soundness error' }
      ],
      intuition: `Formulates the governing boundary condition for ${blueprint.prefix} inside ${section.shortTitle}.`
    },
    {
      name: `${title} - Queuing Dwell & Tail Latency Bound`,
      formula: 'W_q = \\frac{\\lambda \\sigma^2 + \\rho / \\mu}{2(1 - \\rho)}, \\quad L = \\lambda W',
      variables: [
        { symbol: 'W_q', explanation: 'Mean queue dwell time before execution' },
        { symbol: '\\rho', explanation: 'Resource utilization ratio' },
        { symbol: '\\sigma^2', explanation: 'Service time variance across threads' }
      ],
      intuition: 'Quantifies queue stability and prevents tail-latency runaway under peak burst load.'
    },
    {
      name: `${title} - Channel Capacity & Information Entropy`,
      formula: 'C = B \\log_2\\left(1 + \\frac{S}{N}\\right), \\quad \\mathcal{H} = -\\sum_{i} p_i \\log_2 p_i',
      variables: [
        { symbol: 'C', explanation: 'Channel capacity in bits per second' },
        { symbol: 'B', explanation: 'Allocated frequency bandwidth' },
        { symbol: 'S/N', explanation: 'Signal to noise ratio' }
      ],
      intuition: 'Establishes the fundamental information-carrying limit across contested channels.'
    },
    {
      name: `${title} - Lyapunov Asymptotic Convergence`,
      formula: 'V(\\mathbf{x}) > 0, \\quad \\dot{V}(\\mathbf{x}) \\le -\\alpha \\|\\mathbf{x}\\|_2^2 < 0',
      variables: [
        { symbol: 'V(\\mathbf{x})', explanation: 'Lyapunov state candidate function' },
        { symbol: '\\alpha', explanation: 'Exponential convergence coefficient' }
      ],
      intuition: 'Guarantees global asymptotic stability of state trajectories under perturbations.'
    }
  ];

  const jargon = [
    { term: blueprint.jargonTerm, definition: blueprint.jargonDef },
    { term: `${section.shortTitle} Operational Invariant`, definition: `Formal invariant maintained across state transitions in ${section.title}.` },
    { term: 'Deterministic State Machine', definition: 'State machine where transitions depend strictly on state and input with zero non-deterministic side-effects.' },
    { term: 'Zero-Trust Enclave', definition: 'Perimeter requiring continuous cryptographic mutual TLS authentication for all communications.' },
    { term: 'Byzantine Fault Tolerance', definition: 'Capability to reach distributed consensus despite arbitrary node failures or adversarial attacks.' },
    { term: 'Backpressure Throttling', definition: 'Reactive signaling to upstream producers to bound flow and avoid ring-buffer overflow.' },
    { term: 'Pareto-Optimal Frontier', definition: 'Set of non-dominated parameter allocations where improving one metric requires trading off another.' },
    { term: 'Tail-Latency p99.9 Guard', definition: 'Fast-path execution guaranteeing 99.9th percentile response time satisfies hard real-time deadlines.' },
    { term: 'Cryptographic Nonce', definition: 'Unique, non-repeating number preventing replay attacks.' },
    { term: 'Lock-Free Ring Buffer', definition: 'Circular buffer using atomic compare-and-swap primitives instead of kernel locks.' },
    { term: 'Epistemic Drift Probe', definition: 'Online monitor measuring statistical divergence between live signals and calibration priors.' },
    { term: 'Hardware Root of Trust', definition: 'Cryptographic silicon key verifying boot sequence and binary integrity.' }
  ];

  const baseTags = [
    section.id,
    slugify(section.shortTitle || section.id),
    ...blueprint.tags,
    `mk-${variantNum}`,
    `node-${globalIndex}`,
    slugify(blueprint.prefix),
    slugify(blueprint.sub),
    level.toLowerCase(),
    isMilitary ? 'mil-spec-810h' : 'enterprise-grade',
    'fedramp-high',
    'soc2-type-ii',
    'zero-trust-architecture',
    'high-availability',
    'deterministic-systems',
    'sub-millisecond-latency',
    'unit-economics',
    'ltv-cac-optimization',
    'rule-of-40',
    'distributed-consensus',
    'formal-verification',
    'scalability-invariants',
    'fault-tolerance',
    'vector-space-embeddings',
    'edge-deployment',
    'mathematical-formalism',
    'tensor-calculus',
    'convex-optimization',
    'information-theory',
    'bayesian-inference',
    'state-space-model',
    'shannon-entropy',
    'kl-divergence',
    'lyapunov-stability',
    'spectral-decomposition',
    'graph-theory',
    'markov-decision-process',
    'closed-loop-control',
    'pareto-efficiency',
    'asymptotic-bounds'
  ];

  const tagSoup = Array.from(new Set(baseTags));
  while (tagSoup.length < 42) {
    tagSoup.push(`${slugify(section.shortTitle)}-tag-${tagSoup.length}`);
  }

  const classification = isMilitary
    ? 'SECRET // CUI IL5 // DOD JADC2 ENCLAVE // ITAR CONTROLLED'
    : 'UNCLASSIFIED // CUI IL4 // FEDRAMP HIGH // SOC2 TYPE II COMPLIANT';

  return {
    id: cardId,
    title,
    sectionId: section.id,
    domainClassification: section.domainClassification || 'normal',
    category: section.title,
    subcategory,
    subnetNumber: globalIndex,
    description,
    extendedNotes,
    sourceDiagram: section.diagramReference || `${section.shortTitle} Reference Topology`,
    level,
    neonTheme: section.neonTheme || 'amber',
    fundamentalPrerequisiteScore: 25 + ((globalIndex * 7) % 70),
    technicalAbstractionDepth: 30 + ((globalIndex * 11) % 65),
    nicheRarityIndex: 35 + ((globalIndex * 13) % 60),
    profitabilityScore: 60 + ((globalIndex * 17) % 39),
    equations,
    jargon,
    tagSoup,
    fundamentalAlgorithm: {
      name: `${blueprint.prefix} Primary Algorithm`,
      type: 'Fundamental',
      complexity: 'O(N \\log N)',
      description: `Executes verified ${blueprint.concept} across partitioned state tensors.`,
      objective: `Ensure invariant compliance for ${title}.`,
      pseudocode: [
        'Ingest telemetry frame into pre-allocated memory buffer',
        `Project state vector onto ${blueprint.prefix} manifold`,
        'Verify Lyapunov stability bounds within real-time budget',
        'Emit signed state confirmation to downstream subsystems'
      ]
    },
    optimizationAlgorithm: {
      name: `Optimized SIMD ${blueprint.prefix} Engine`,
      type: 'Optimization',
      complexity: 'O(N / B)',
      description: 'Minimizes cache evictions and memory stalls through tiled execution.',
      objective: 'Reduce tail latency by over 60% under peak load.',
      pseudocode: [
        'Partition working set into L1 cache tiles',
        'Prefetch adjacent stream buffers',
        'Fuse projection kernels into single register pass'
      ]
    },
    officialBusinessClassification: classification,
    programManagerOverview: `Principal Program Manager Engineering Overview [${classification}]: Managing acquisition and deployment for ${title} within ${section.title} (${subcategory}). Enforces deterministic latency bounds, zero-trust perimeter isolation, and automated verification.`,
    systemsArchitectPerspective: `Systems Architect Directive & Formal Invariant: ${title} enforces lock-free ring buffers, sub-10ms tail latency, and fail-closed transitions across ${section.shortTitle} systems.`,
    profitabilityAnalysis: `Profitability, Unit Economics & Margin Yield (ΔProfit = +$${8400 + (globalIndex % 12) * 500}/mo Net Margin): Position ${title} as an enterprise software module with 15:1 LTV:CAC efficiency.`,
    cyberOperationsLiaison: `Cyber Operations Liaison Directive [ZERO-TRUST]: ${title} mandates mTLS attestation, immutable telemetry logs, and strict input validation.`,
    popCultureNickname: `${blueprint.nick} #${variantNum}`
  };
}

function main() {
  const raw = fs.readFileSync(DATASET_PATH, 'utf8');

  const sectionsStart = raw.indexOf('export const SECTIONS: SectionMeta[] = [');
  const cardsStart = raw.indexOf('export const TECH_CARDS: TechCard[] = [');

  if (sectionsStart === -1 || cardsStart === -1) {
    console.error('Could not locate SECTIONS or TECH_CARDS in dataset.ts');
    process.exit(1);
  }

  const sectionsJsonStr = raw
    .slice(sectionsStart + 'export const SECTIONS: SectionMeta[] = '.length, cardsStart)
    .trim()
    .replace(/;$/, '');

  const cardsJsonStr = raw
    .slice(cardsStart + 'export const TECH_CARDS: TechCard[] = '.length)
    .trim()
    .replace(/;$/, '');

  const sections = JSON.parse(sectionsJsonStr);
  let cards = JSON.parse(cardsJsonStr);

  console.log(`[AddNodes] Existing nodes in dataset: ${cards.length}`);

  // Step 1: Deduplicate any existing duplicate IDs
  const seenIds = new Set();
  let dedupedCount = 0;
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    if (seenIds.has(card.id)) {
      const uniqueId = `${card.id}-fixed-${i}`;
      console.log(`[Dedupe] Resolving duplicate ID: "${card.id}" -> "${uniqueId}"`);
      card.id = uniqueId;
      dedupedCount++;
    }
    seenIds.add(card.id);
  }
  console.log(`[Dedupe] Total duplicate IDs fixed: ${dedupedCount}`);

  // Step 2: Add ~50 additional nodes (Target: 1050)
  const TARGET_TOTAL = 1050;
  const domainSections = sections.filter((s) => s.id !== 'all');
  let addedCount = 0;
  let globalIndex = cards.length + 1;

  while (cards.length < TARGET_TOTAL) {
    const section = domainSections[(globalIndex - 1) % domainSections.length];
    const blueprint = DOMAIN_BLUEPRINTS[(globalIndex - 1) % DOMAIN_BLUEPRINTS.length];
    const newCard = buildSynthesizedCard(section, blueprint, globalIndex);

    if (!seenIds.has(newCard.id)) {
      seenIds.add(newCard.id);
      cards.push(newCard);
      addedCount++;
    }
    globalIndex++;
  }

  console.log(`[AddNodes] Added ${addedCount} additional nodes. Total nodes now: ${cards.length}`);

  // Step 3: Synchronize SECTIONS totalCards
  const countsBySection = new Map();
  for (const c of cards) {
    countsBySection.set(c.sectionId, (countsBySection.get(c.sectionId) || 0) + 1);
  }

  for (const sec of sections) {
    if (sec.id === 'all') {
      sec.totalCards = cards.length;
    } else {
      sec.totalCards = countsBySection.get(sec.id) || 0;
    }
  }

  // Format and save
  const formattedSections =
    '[\n' + sections.map((s) => '  ' + JSON.stringify(s)).join(',\n') + '\n]';
  const formattedCards =
    '[\n' + cards.map((c) => '  ' + JSON.stringify(c)).join(',\n') + '\n]';

  const outputTs = `// Generated Unified Technical Dataset for TechBook
import { SectionMeta, TechCard } from "@/types/techbook";

export const SECTIONS: SectionMeta[] = ${formattedSections};

export const TECH_CARDS: TechCard[] = ${formattedCards};
`;

  fs.writeFileSync(DATASET_PATH, outputTs, 'utf8');
  console.log(
    `[AddNodes] Successfully saved updated dataset.ts with ${cards.length} nodes.`
  );
}

main();
