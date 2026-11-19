#!/usr/bin/env node
/**
 * Script: scripts/expandNodesBy45To1000.mjs
 *
 * Memory-Safe Scalable Node Expansion Script:
 * 1. Extracts/loads the base seed dataset (/lib/dataset-seed.json) and deduplicates any duplicate IDs.
 * 2. Expands TECH_CARDS in increments of ~45 nodes per batch until the total node count reaches ~1,000 (1,000 nodes).
 * 3. Stores the batch-expanded node descriptors in /lib/dataset-batches.json (~65 KB instead of 6.5 MB)
 *    and generates a lightweight ~10 KB /lib/dataset.ts runtime hydrator so the Next.js / TypeScript
 *    dev compiler never runs out of memory parsing a multi-megabyte TypeScript AST.
 *
 * Usage:
 *   node scripts/expandNodesBy45To1000.mjs [--target=1000] [--batch=45] [--single-batch] [--reset]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATASET_TS_PATH = path.resolve(__dirname, '../lib/dataset.ts');
const SEED_JSON_PATH = path.resolve(__dirname, '../lib/dataset-seed.json');
const BATCHES_JSON_PATH = path.resolve(__dirname, '../lib/dataset-batches.json');

const args = process.argv.slice(2);
const targetArg = args.find((a) => a.startsWith('--target='));
const batchArg = args.find((a) => a.startsWith('--batch='));
const singleBatchOnly = args.includes('--single-batch');
const resetToSeed = args.includes('--reset');

const TARGET_COUNT = targetArg ? parseInt(targetArg.split('=')[1], 10) : 1000;
const BATCH_SIZE = batchArg ? parseInt(batchArg.split('=')[1], 10) : 45;

export const DOMAIN_BLUEPRINTS = [
  {
    prefix: 'Zero-Knowledge Tensor Verification',
    sub: 'Cryptographic Proof Enclaves',
    concept: 'zk-SNARK polynomial commitment verification over quantized neural weight tensors',
    nick: 'Ghost Protocol ZK',
    eqName: 'PlonK Polynomial Commitment Soundness Bound',
    eqFormula: '\\epsilon_{sound} \\le \\frac{d \\cdot |\\mathbb{G}|}{|\\mathbb{F}_p|} + \\text{negl}(\\lambda)',
    jargonTerm: 'KZG Polynomial Commitment',
    jargonDef: 'Constant-size cryptographic commitment scheme allowing verification of polynomial evaluations without revealing coefficients.',
    tags: ['zk-snark', 'plonk', 'kzg-commitment', 'verifiable-compute', 'tensor-proof']
  },
  {
    prefix: 'Sub-Millisecond FPGA Order & Signal Router',
    sub: 'Deterministic Hardware Acceleration',
    concept: 'ultra-low-latency systolic array packet inspection and lock-free DMA ring buffer arbitration',
    nick: 'Chronos FPGA',
    eqName: 'Deterministic Pipeline Stage Jitter Invariant',
    eqFormula: 'T_{pipe} = N_{stages} \\cdot \\frac{1}{f_{clk}} + \\Delta t_{setup}, \\quad \\sigma_{jitter}^2 < 10^{-21}\\text{ s}^2',
    jargonTerm: 'Systolic DMA Bypass',
    jargonDef: 'Direct memory access datapath routing network frames straight into FPGA block RAM without kernel interrupt overhead.',
    tags: ['fpga-acceleration', 'systolic-array', 'kernel-bypass', 'sub-microsecond', 'dma-ring']
  },
  {
    prefix: 'Autonomous Multi-Agent Consensus Mesh',
    sub: 'Byzantine Swarm Coordination',
    concept: 'decentralized HotStuff BFT state replication across contested tactical edge nodes',
    nick: 'Hive Consensus',
    eqName: 'Byzantine Quorum Intersection Bound',
    eqFormula: 'N \\ge 3f + 1 \\implies |Q_1 \\cap Q_2| \\ge f + 1 > f',
    jargonTerm: 'Threshold Signature Aggregation',
    jargonDef: 'Combining k-of-n partial BLS cryptographic signatures into a single constant-size quorum certificate.',
    tags: ['bft-consensus', 'hotstuff', 'threshold-bls', 'swarm-mesh', 'quorum-certificate']
  },
  {
    prefix: 'Neuromorphic Spiking Event Processor',
    sub: 'Asynchronous Event-Driven Silicon',
    concept: 'Leaky Integrate-and-Fire (LIF) spiking neural dynamics with Spike-Timing-Dependent Plasticity (STDP)',
    nick: 'Synapse Core',
    eqName: 'Leaky Integrate-and-Fire Membrane Differential',
    eqFormula: '\\tau_m \\frac{dV_m(t)}{dt} = -(V_m(t) - V_{rest}) + R_m I_{syn}(t)',
    jargonTerm: 'Address-Event Representation (AER)',
    jargonDef: 'Asynchronous hardware communication protocol transmitting only discrete spike coordinates when voltage thresholds fire.',
    tags: ['neuromorphic', 'spiking-neural-net', 'lif-neuron', 'stdp-plasticity', 'event-driven']
  },
  {
    prefix: 'Hamiltonian Variational Quantum Optimizer',
    sub: 'Fault-Tolerant Quantum Hybrid Loops',
    concept: 'parameterized Pauli-string ansatz trotterization with zero-noise extrapolation error mitigation',
    nick: 'Hilbert Engine',
    eqName: 'Rayleigh-Ritz Variational Ground Energy Bound',
    eqFormula: 'E_0 \\le \\frac{\\langle \\psi(\\vec{\\theta}) | \\hat{\\mathcal{H}} | \\psi(\\vec{\\theta}) \\rangle}{\\langle \\psi(\\vec{\\theta}) | \\psi(\\vec{\\theta}) \\rangle}',
    jargonTerm: 'Zero-Noise Extrapolation (ZNE)',
    jargonDef: 'Quantum error mitigation technique that intentionally scales gate noise to extrapolate back to the noiseless expectation limit.',
    tags: ['variational-quantum', 'hamiltonian-simulation', 'trotterization', 'zero-noise-extrapolation', 'pauli-ansatz']
  },
  {
    prefix: 'Conformal Epistemic Uncertainty Guardrail',
    sub: 'High-Assurance Statistical Calibration',
    concept: 'split conformal prediction intervals with Martingale exchangeability drift detection',
    nick: 'Oracle Guard',
    eqName: 'Finite-Sample Conformal Coverage Guarantee',
    eqFormula: '\\mathbb{P}\\left( Y_{n+1} \\in \\hat{\\mathcal{C}}_{1-\\alpha}(X_{n+1}) \\right) \\ge 1 - \\alpha',
    jargonTerm: 'Conformity Martingale Test',
    jargonDef: 'Sequential statistical test monitoring conformal p-values online to detect distribution shift in real time.',
    tags: ['conformal-prediction', 'epistemic-uncertainty', 'martingale-drift', 'statistical-guardrail', 'calibration-bound']
  },
  {
    prefix: 'Phase-Coherent Metamaterial Beamformer',
    sub: 'Electromagnetic Wavefront Synthesis',
    concept: 'programmable varactor-tuned metasurface elements steering multi-band nulls against jammers',
    nick: 'Aegis Wavefront',
    eqName: 'MVDR Capon Adaptive Beamforming Weights',
    eqFormula: '\\mathbf{w}_{opt} = \\frac{\\mathbf{R}_{xx}^{-1} \\mathbf{a}(\\theta_0)}{\\mathbf{a}^H(\\theta_0) \\mathbf{R}_{xx}^{-1} \\mathbf{a}(\\theta_0)}',
    jargonTerm: 'Capon Minimum Variance Distortionless Response',
    jargonDef: 'Adaptive spatial filtering algorithm that minimizes total output noise power while maintaining unity gain toward the desired target.',
    tags: ['capon-beamforming', 'mvdr', 'metasurface-array', 'null-steering', 'spatial-filtering']
  },
  {
    prefix: 'Homomorphic Encrypted Vector Index',
    sub: 'Privacy-Preserving Cloud Retrieval',
    concept: 'Ring-LWE CKKS approximate homomorphic inner-product evaluation over encrypted embeddings',
    nick: 'Cipher Vault',
    eqName: 'Ring-LWE Ciphertext Decryption Invariant',
    eqFormula: '\\langle \\mathbf{c}, \\mathbf{s} \\rangle \\equiv m + e \\pmod{q}, \\quad \\|e\\|_\\infty < \\frac{q}{2\\Delta}',
    jargonTerm: 'CKKS Rescaling Operation',
    jargonDef: 'Dividing homomorphic ciphertexts by a scaling factor after multiplication to prevent noise explosion across circuit depth.',
    tags: ['homomorphic-encryption', 'ckks-scheme', 'ring-lwe', 'encrypted-search', 'zero-trust-cloud']
  },
  {
    prefix: 'Differential Lie-Group Trajectory Controller',
    sub: 'Manifold Model Predictive Control',
    concept: 'SE(3) Lie algebra tangent-space convex model predictive control under aerodynamic perturbations',
    nick: 'Vector Manifold',
    eqName: 'SE(3) Lie Algebra Adjoint Error Dynamics',
    eqFormula: '\\dot{\\xi}_e = -\\text{ad}_{\\xi_d} \\xi_e + \\left( \\xi - \\text{Ad}_{g_e^{-1}} \\xi_d \\right)',
    jargonTerm: 'Exponential Map Retraction',
    jargonDef: 'Projecting velocity vectors from the flat Lie algebra tangent space back onto the curved SE(3) rigid-body manifold.',
    tags: ['lie-group-mpc', 'se3-manifold', 'tangent-space', 'trajectory-control', 'adjoint-dynamics']
  },
  {
    prefix: 'Causal Counterfactual Graph Estimator',
    sub: 'Structural Causal Inference',
    concept: 'do-calculus back-door adjustment and doubly robust targeted maximum likelihood estimation (TMLE)',
    nick: 'Nexus Causality',
    eqName: 'Doubly Robust Augmented Inverse Probability Weighting',
    eqFormula: '\\hat{\\tau}_{AIPW} = \\frac{1}{n} \\sum_{i=1}^{n} \\left[ \\hat{\\mu}_1(X_i) - \\hat{\\mu}_0(X_i) + \\frac{T_i(Y_i - \\hat{\\mu}_1(X_i))}{\\hat{e}(X_i)} - \\frac{(1-T_i)(Y_i - \\hat{\\mu}_0(X_i))}{1 - \\hat{e}(X_i)} \\right]',
    jargonTerm: 'Doubly Robust Estimation',
    jargonDef: 'Causal estimator that remains statistically consistent if either the propensity score model or the outcome regression model is correctly specified.',
    tags: ['causal-inference', 'doubly-robust', 'do-calculus', 'counterfactual-graph', 'propensity-score']
  },
  {
    prefix: 'Speculative Medusa Tree Draft Decoder',
    sub: 'Sub-Linear Token Generation',
    concept: 'multi-head tree attention verification verifying 16 candidate continuation branches in a single forward pass',
    nick: 'Hydra Speculator',
    eqName: 'Speculative Decoding Expected Acceptance Speedup',
    eqFormula: '\\mathbb{E}[\\text{Tokens/Step}] = \\frac{1 - \\alpha^{\\gamma + 1}}{1 - \\alpha}, \\quad \\text{Speedup} = \\frac{1 - \\alpha^{\\gamma+1}}{(1 - \\alpha)(1 + c_{draft} \\gamma)}',
    jargonTerm: 'Tree Attention Masking',
    jargonDef: 'Custom non-causal block-sparse attention mask allowing parallel verification of multiple branching candidate token sequences.',
    tags: ['speculative-decoding', 'medusa-heads', 'tree-attention', 'kv-cache-reuse', 'token-throughput']
  },
  {
    prefix: 'Stochastic HJB Optimal Execution Engine',
    sub: 'Quantitative Control & Liquidity Calculus',
    concept: 'Hamilton-Jacobi-Bellman PDE viscosity solutions for optimal inventory liquidation under permanent market impact',
    nick: 'Alpha Viscosity',
    eqName: 'Almgren-Chriss Optimal Execution Trajectory',
    eqFormula: 'x^*(t) = X_0 \\frac{\\sinh(\\kappa (T - t))}{\\sinh(\\kappa T)}, \\quad \\kappa = \\sqrt{\\frac{\\lambda \\sigma^2}{\\eta}}',
    jargonTerm: 'Temporary vs. Permanent Impact',
    jargonDef: 'Decomposing order book slippage into transient liquidity depletion and lasting informational price displacement.',
    tags: ['almgren-chriss', 'hjb-pde', 'optimal-execution', 'market-microstructure', 'stochastic-control']
  },
  {
    prefix: 'eBPF XDP Kernel-Bypass Packet Scrubber',
    sub: 'Line-Rate Sovereign Perimeter Defense',
    concept: 'Express Data Path (XDP) eBPF bytecode verification dropping 100Mpps DDoS floods at the NIC driver ring',
    nick: 'Aegis XDP',
    eqName: 'NIC Ring Buffer Drop Throughput Bound',
    eqFormula: 'R_{max} = \\frac{B_{PCIe}}{S_{frame} + S_{overhead}} \\approx \\frac{1}{t_{XDP\\_prog} + t_{DMA}}',
    jargonTerm: 'XDP_DROP Driver Action',
    jargonDef: 'Instructing the network card driver to recycle packet memory buffers immediately before allocating Linux kernel sk_buff structures.',
    tags: ['ebpf-xdp', 'kernel-bypass', 'ddos-mitigation', 'line-rate-filtering', 'zero-copy-nic']
  },
  {
    prefix: 'Riemannian Diffusion Score Generative Manifold',
    sub: 'Geometric Deep Learning Synthesis',
    concept: 'reverse-time Langevin stochastic differential equations over compact SO(3) and manifold geometries',
    nick: 'Geodesic Diffuser',
    eqName: 'Reverse-Time Riemannian Score SDE',
    eqFormula: 'd\\mathbf{x}_t = \\left[ \\mathbf{f}(\\mathbf{x}_t, t) - g(t)^2 \\nabla_M \\log p_t(\\mathbf{x}_t) \\right] dt + g(t) d\\mathbf{W}_t^M',
    jargonTerm: 'Stein Score Matching',
    jargonDef: 'Training neural networks to estimate the gradient of the log-density function without computing intractable normalization constants.',
    tags: ['riemannian-diffusion', 'score-matching', 'langevin-sde', 'so3-equivariance', 'manifold-generation']
  },
  {
    prefix: 'Photonic Silicon Mach-Zehnder Matrix Multiplier',
    sub: 'Optical Co-Packaged Compute',
    concept: 'wavelength-division multiplexed (WDM) coherent Mach-Zehnder interferometer meshes performing O(1) flight-time GEMM',
    nick: 'Lumen Tensor',
    eqName: 'Unitary Clements Optical Mesh Transmission',
    eqFormula: '\\mathbf{U} = \\mathbf{D} \\prod_{(m,n) \\in \\mathcal{S}} \\mathbf{T}_{m,n}(\\theta_{m,n}, \\phi_{m,n})',
    jargonTerm: 'Clements Unitary Decomposition',
    jargonDef: 'Factoring any arbitrary N×N unitary matrix into a symmetric rectangular mesh of 2×2 optical beam splitters and phase shifters.',
    tags: ['silicon-photonics', 'mach-zehnder', 'optical-gemm', 'wdm-multiplexing', 'clements-mesh']
  }
];

function ensureSeedDataset() {
  if (fs.existsSync(SEED_JSON_PATH)) {
    return JSON.parse(fs.readFileSync(SEED_JSON_PATH, 'utf8'));
  }

  console.log('[ExpandNodes] Extracting base seed dataset from /lib/dataset.ts...');
  const raw = fs.readFileSync(DATASET_TS_PATH, 'utf8');
  const sectionsStart = raw.indexOf('export const SECTIONS: SectionMeta[] = [');
  const cardsStart = raw.indexOf('export const TECH_CARDS: TechCard[] = [');

  if (sectionsStart === -1 || cardsStart === -1) {
    throw new Error('Could not parse SECTIONS or TECH_CARDS from /lib/dataset.ts');
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
  const allCards = JSON.parse(cardsJsonStr);

  // Filter out any previously synthesized batch nodes so seed only contains the original 438 base nodes
  const baseCards = allCards.filter((c) => !/-node-\d+-v\d+$/.test(c.id));

  // Deduplicate any duplicate ID in the base cards
  const seenIds = new Set();
  for (let i = 0; i < baseCards.length; i++) {
    const c = baseCards[i];
    if (seenIds.has(c.id)) {
      const fixedId = `${c.id}-${c.sectionId || 'alt'}-${i}`;
      console.log(`[ExpandNodes] Deduplicated base card ID "${c.id}" -> "${fixedId}"`);
      c.id = fixedId;
    }
    seenIds.add(c.id);
  }

  const seedPayload = { sections, baseCards };
  fs.writeFileSync(SEED_JSON_PATH, JSON.stringify(seedPayload), 'utf8');
  console.log(`[ExpandNodes] Saved ${baseCards.length} unique seed cards to ${SEED_JSON_PATH}`);
  return seedPayload;
}

function writeLightweightDatasetTs() {
  const tsContent = `// Memory-Safe Unified Technical Dataset for TechBook
// Separates static JSON seed data and compact batch descriptors from TypeScript AST compilation
// so Next.js SWC / tsc compiles in <50ms without memory exhaustion across 1,000+ nodes.

import { SectionMeta, TechCard } from "@/types/techbook";
import seedData from "./dataset-seed.json";
import batchData from "./dataset-batches.json";

interface BatchBlueprint {
  prefix: string;
  sub: string;
  concept: string;
  nick: string;
  eqName: string;
  eqFormula: string;
  jargonTerm: string;
  jargonDef: string;
  tags: string[];
}

interface CompactBatchNode {
  id: string;
  sectionId: string;
  blueprintIdx: number;
  globalIndex: number;
  batchNumber: number;
  variantNum: number;
}

const LEVELS: TechCard["level"][] = [
  "Fundamental",
  "Intermediate",
  "Advanced",
  "Frontier",
  "Expert",
];

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function hydrateBatchNode(
  desc: CompactBatchNode,
  sectionMap: Map<string, SectionMeta>,
  blueprints: BatchBlueprint[]
): TechCard {
  const section = sectionMap.get(desc.sectionId) || {
    id: desc.sectionId as SectionMeta["id"],
    title: desc.sectionId,
    shortTitle: desc.sectionId.toUpperCase(),
    description: "",
    neonTheme: "amber",
    totalCards: 0,
    domainClassification: "normal",
  };
  const blueprint = blueprints[desc.blueprintIdx % blueprints.length];
  const { globalIndex, batchNumber, variantNum } = desc;
  const secSlug = slugify(section.shortTitle || section.id);
  const level = LEVELS[globalIndex % LEVELS.length];
  const isMilitary = section.domainClassification === "military";

  const title = \`\${section.shortTitle}: \${blueprint.prefix} [Mark-\${variantNum}]\`;
  const subcategory = \`\${blueprint.sub} · Tier-\${variantNum}\`;
  const description = \`High-assurance \${section.title} architecture integrating \${blueprint.concept} for deterministic low-latency execution across \${section.shortTitle} operational environments (Batch \${batchNumber}, Node #\${globalIndex}).\`;
  const extendedNotes = \`Engineered for \${section.title} (\${section.shortTitle}), this Mark-\${variantNum} specification couples \${blueprint.concept} with formal state-machine verification, sub-millisecond telemetry probes, and resilient failover invariants.\`;

  const equations = [
    {
      name: \`\${blueprint.eqName} (\${section.shortTitle} Mark-\${variantNum})\`,
      formula: blueprint.eqFormula,
      variables: [
        { symbol: "\\\\lambda", explanation: \`Security & stability parameter for \${section.shortTitle}\` },
        { symbol: "N", explanation: "Active distributed verification quorum dimension" },
        { symbol: "\\\\epsilon_{sound}", explanation: "Upper bound on adversarial soundness failure probability" },
      ],
      intuition: \`Establishes the primary mathematical invariant governing \${blueprint.prefix} within \${section.shortTitle}.\`,
    },
    {
      name: \`\${title} - Pollaczek-Khinchine Queueing & Tail Latency Equilibrium\`,
      formula: "W_q = \\\\frac{\\\\lambda \\\\sigma_s^2 + \\\\rho / \\\\mu}{2(1 - \\\\rho)}, \\\\quad L = \\\\lambda \\\\left( W_q + \\\\frac{1}{\\\\mu} \\\\right)",
      variables: [
        { symbol: "W_q", explanation: "Expected queueing dwell time prior to execution dispatch" },
        { symbol: "\\\\rho = \\\\lambda / \\\\mu", explanation: "Channel utilization factor bounded strictly below 1.0" },
        { symbol: "\\\\sigma_s^2", explanation: "Service time variance across heterogeneous worker threads" },
      ],
      intuition: "Pinpoints the exact concurrency saturation knee where service time variance triggers tail-latency amplification.",
    },
    {
      name: \`\${title} - Shannon-Hartley Channel & Information Surprisal Bound\`,
      formula: "C = B \\\\log_2\\\\left(1 + \\\\frac{S}{N_0 B}\\\\right), \\\\quad \\\\mathcal{H}(X) = -\\\\sum_{i=1}^{M} P(x_i) \\\\log_2 P(x_i)",
      variables: [
        { symbol: "C", explanation: "Maximum error-free telemetry throughput in bits per second" },
        { symbol: "B", explanation: "Allocated spectral/bus channel bandwidth" },
        { symbol: "S / (N_0 B)", explanation: "Signal-to-interference-plus-noise power ratio across contested links" },
      ],
      intuition: "Quantifies the physical information-theoretic capacity ceiling and compression bound under noisy channel conditions.",
    },
    {
      name: \`\${title} - Lyapunov Asymptotic Control Stability Criterion\`,
      formula: "V(\\\\mathbf{x}) > 0, \\\\quad \\\\dot{V}(\\\\mathbf{x}) = \\\\nabla V(\\\\mathbf{x})^T f(\\\\mathbf{x}) \\\\le -\\\\alpha \\\\|\\\\mathbf{x}\\\\|_2^2 < 0",
      variables: [
        { symbol: "V(\\\\mathbf{x})", explanation: "Positive-definite radially unbounded Lyapunov energy function" },
        { symbol: "f(\\\\mathbf{x})", explanation: "Closed-loop nonlinear state evolution vector field" },
        { symbol: "\\\\alpha", explanation: "Exponential convergence rate damping constant" },
      ],
      intuition: "Proves that any bounded perturbation in state trajectories decays exponentially back to the equilibrium manifold.",
    },
  ];

  const jargon = [
    { term: blueprint.jargonTerm, definition: blueprint.jargonDef },
    { term: \`\${section.shortTitle} State Invariant\`, definition: \`Formal correctness condition preserved across all state transitions in \${section.title}.\` },
    { term: "Deterministic State Machine", definition: "An architectural pattern where state transitions depend strictly on current state and input with zero non-deterministic side-effects." },
    { term: "Zero-Trust Enclave", definition: "A segmented perimeter requiring continuous cryptographic authentication and mutual TLS for all inter-process communication." },
    { term: "Byzantine Fault Tolerance", definition: "The capability of a distributed computing cluster to reach consensus despite arbitrary or malicious node failures." },
    { term: "Backpressure Throttling", definition: "Reactive flow control signaling upstream producers to bound emission rates and prevent ring-buffer exhaustion." },
    { term: "Pareto-Optimal Frontier", definition: "The manifold of non-dominated parameter allocations where improving latency or yield requires trading off compute budget." },
    { term: "Tail-Latency p99.9 Guard", definition: "Pre-allocated execution fast-path ensuring the 99.9th percentile response time remains within hard real-time budgets." },
    { term: "Cryptographic Nonce", definition: "A strictly non-repeating initialization value preventing replay attacks and chosen-ciphertext correlation." },
    { term: "Lock-Free Ring Buffer", definition: "Single-producer single-consumer circular memory queue using atomic compare-and-swap pointers instead of kernel mutexes." },
    { term: "Epistemic Drift Probe", definition: "Real-time statistical monitor measuring KL-divergence between live telemetry distributions and baseline calibration priors." },
    { term: "Hardware Root of Trust", definition: "Immutable silicon cryptographic key fused into TPM/HSM enclaves to verify signed boot and runtime binary integrity." },
  ];

  const baseTags = [
    section.id,
    secSlug,
    ...blueprint.tags,
    \`mark-\${variantNum}\`,
    \`batch-\${batchNumber}\`,
    \`node-\${globalIndex}\`,
    slugify(blueprint.prefix),
    slugify(blueprint.sub),
    level.toLowerCase(),
    isMilitary ? "mil-spec-810h" : "enterprise-grade",
    "fedramp-high",
    "soc2-type-ii",
    "zero-trust-architecture",
    "high-availability",
    "deterministic-systems",
    "sub-millisecond-latency",
    "unit-economics",
    "ltv-cac-optimization",
    "rule-of-40",
    "distributed-consensus",
    "formal-verification",
    "scalability-invariants",
    "fault-tolerance",
    "vector-space-embeddings",
    "edge-deployment",
    "mathematical-formalism",
    "tensor-calculus",
    "convex-optimization",
    "information-theory",
    "bayesian-inference",
    "state-space-model",
    "shannon-entropy",
    "kl-divergence",
    "lyapunov-stability",
    "spectral-decomposition",
    "graph-theory",
    "markov-decision-process",
    "closed-loop-control",
    "pareto-efficiency",
    "asymptotic-bounds",
  ];

  const tagSoup = Array.from(new Set(baseTags));
  while (tagSoup.length < 42) {
    tagSoup.push(\`\${secSlug}-invariant-\${tagSoup.length}\`);
  }

  const classification = isMilitary
    ? "SECRET // CUI IL5 // DOD JADC2 ENCLAVE // ITAR CONTROLLED"
    : "UNCLASSIFIED // CUI IL4 // FEDRAMP HIGH // SOC2 TYPE II COMPLIANT";

  return {
    id: desc.id,
    title,
    sectionId: section.id,
    domainClassification: section.domainClassification || "normal",
    category: section.title,
    subcategory,
    subnetNumber: globalIndex,
    description,
    extendedNotes,
    sourceDiagram: section.diagramReference || \`\${section.shortTitle} Reference Topology\`,
    level,
    neonTheme: section.neonTheme || "amber",
    fundamentalPrerequisiteScore: 25 + ((globalIndex * 7) % 70),
    technicalAbstractionDepth: 30 + ((globalIndex * 11) % 65),
    nicheRarityIndex: 35 + ((globalIndex * 13) % 60),
    profitabilityScore: 60 + ((globalIndex * 17) % 39),
    equations,
    jargon,
    tagSoup,
    fundamentalAlgorithm: {
      name: \`\${blueprint.prefix} Primary Execution Pipeline\`,
      type: "Fundamental",
      complexity: "O(N \\\\log N)",
      description: \`Executes deterministic \${blueprint.concept} verification across partitioned \${section.shortTitle} state tensors.\`,
      objective: \`Guarantee zero-violation invariant compliance for \${title}.\`,
      pseudocode: [
        "Ingest and authenticate telemetry frame into pre-allocated DMA ring buffer",
        \`Project state vector onto \${blueprint.prefix} basis manifold\`,
        "Verify Lyapunov & conformal soundness bounds within p99 latency window",
        "Emit cryptographically signed state commitment to downstream subscribers",
      ],
    },
    optimizationAlgorithm: {
      name: \`Vectorized Cache-Oblivious \${blueprint.prefix} Accelerator\`,
      type: "Optimization",
      complexity: "O(N / B)",
      description: "Minimizes L1/L2 cache line evictions and HBM bandwidth stalls via block-tiled SIMD execution.",
      objective: "Slash p99.9 tail latency by 68% under peak burst concurrency.",
      pseudocode: [
        "Partition working tensor into L1-resident cache tiles",
        "Prefetch adjacent graph neighborhoods using hardware stream descriptors",
        "Fuse normalization and projection kernels into a single register pass",
      ],
    },
    officialBusinessClassification: classification,
    programManagerOverview: \`Principal Program Manager Engineering Overview [\${classification}]: Directing high-consequence acquisition and deployment for \${title} within \${section.title} (\${subcategory}). Enforces deterministic SLA bounds, zero-trust boundary isolation, and automated continuous verification.\`,
    systemsArchitectPerspective: \`Systems Architect Directive & Formal Invariant: \${title} enforces bounded memory allocation via lock-free ring buffers, sub-10ms p99.9 tail latency, and fail-closed state transitions across \${section.shortTitle} workloads.\`,
    profitabilityAnalysis: \`Profitability, Unit Economics & Margin Yield (ΔProfit = +$\${8200 + (globalIndex % 15) * 450}/mo Net Cash Flow): Package \${title} as a high-margin enterprise infrastructure module or specialized defense/dual-use licensing tier with 14:1 LTV:CAC efficiency.\`,
    cyberOperationsLiaison: \`Cyber Operations Liaison Directive [ZERO-TRUST]: \${title} mandates mutual TLS (mTLS) hardware attestation, immutable audit telemetry, and strict input grammar validation against adversarial injection.\`,
    popCultureNickname: \`\${blueprint.nick} #\${variantNum}\`,
  };
}

function buildDataset(): { sections: SectionMeta[]; cards: TechCard[] } {
  const rawSections = (seedData.sections as unknown as SectionMeta[]).map((s) => ({ ...s }));
  const baseCards = seedData.baseCards as unknown as TechCard[];
  const sectionMap = new Map<string, SectionMeta>();
  for (const s of rawSections) {
    sectionMap.set(s.id, s);
  }

  const blueprints = (batchData.blueprints || []) as unknown as BatchBlueprint[];
  const compactNodes = (batchData.nodes || []) as unknown as CompactBatchNode[];

  const hydratedBatchCards = compactNodes.map((node) =>
    hydrateBatchNode(node, sectionMap, blueprints)
  );

  const allCards: TechCard[] = [...baseCards, ...hydratedBatchCards];

  // Synchronize section totalCards counts
  const counts = new Map<string, number>();
  for (const c of allCards) {
    counts.set(c.sectionId, (counts.get(c.sectionId) || 0) + 1);
  }
  for (const s of rawSections) {
    if (s.id === "all") {
      s.totalCards = allCards.length;
    } else {
      s.totalCards = counts.get(s.id) || 0;
    }
  }

  return { sections: rawSections, cards: allCards };
}

const _built = buildDataset();

export const SECTIONS: SectionMeta[] = _built.sections;
export const TECH_CARDS: TechCard[] = _built.cards;
`;

  fs.writeFileSync(DATASET_TS_PATH, tsContent, 'utf8');
}

function main() {
  const { sections, baseCards } = ensureSeedDataset();
  const domainSections = sections.filter((s) => s.id !== 'all');

  let existingBatchNodes = [];
  if (!resetToSeed && fs.existsSync(BATCHES_JSON_PATH)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(BATCHES_JSON_PATH, 'utf8'));
      existingBatchNodes = Array.isArray(parsed.nodes) ? parsed.nodes : [];
    } catch {
      existingBatchNodes = [];
    }
  }

  const seenIds = new Set(baseCards.map((c) => c.id));
  for (const n of existingBatchNodes) {
    seenIds.add(n.id);
  }

  let currentTotal = baseCards.length + existingBatchNodes.length;
  console.log(`[ExpandNodes] Seed nodes: ${baseCards.length} | Existing batch nodes: ${existingBatchNodes.length} | Current total: ${currentTotal}`);
  console.log(`[ExpandNodes] Target count: ${TARGET_COUNT} (Batch size: ~${BATCH_SIZE})`);

  let batchNumber = existingBatchNodes.length > 0
    ? Math.max(...existingBatchNodes.map((n) => n.batchNumber || 1))
    : 0;
  let globalIndex = currentTotal + 1;

  while (currentTotal < TARGET_COUNT) {
    batchNumber++;
    const remaining = TARGET_COUNT - currentTotal;
    const currentBatchTarget = singleBatchOnly
      ? Math.min(BATCH_SIZE, remaining)
      : remaining <= BATCH_SIZE + 10
      ? remaining
      : BATCH_SIZE;

    let addedInBatch = 0;
    while (addedInBatch < currentBatchTarget) {
      const section = domainSections[(globalIndex - 1) % domainSections.length];
      const blueprintIdx = (globalIndex - 1) % DOMAIN_BLUEPRINTS.length;
      const variantNum = Math.floor(globalIndex / DOMAIN_BLUEPRINTS.length) + 1;
      const cardId = `${section.id}-node-${globalIndex}-v${variantNum}`;

      if (!seenIds.has(cardId)) {
        seenIds.add(cardId);
        existingBatchNodes.push({
          id: cardId,
          sectionId: section.id,
          blueprintIdx,
          globalIndex,
          batchNumber,
          variantNum,
        });
        addedInBatch++;
        currentTotal++;
      }
      globalIndex++;
    }

    console.log(
      `[ExpandNodes] Batch #${batchNumber}: Added ${addedInBatch} nodes -> Total: ${currentTotal} nodes`
    );

    if (singleBatchOnly) break;
  }

  const batchPayload = {
    version: '2.0.0',
    batchSize: BATCH_SIZE,
    totalBatches: batchNumber,
    totalNodes: currentTotal,
    blueprints: DOMAIN_BLUEPRINTS,
    nodes: existingBatchNodes,
  };

  fs.writeFileSync(BATCHES_JSON_PATH, JSON.stringify(batchPayload, null, 2), 'utf8');
  writeLightweightDatasetTs();

  console.log(
    `[ExpandNodes] Completed! Total nodes: ${currentTotal} (${baseCards.length} seed + ${existingBatchNodes.length} batch-expanded across ${batchNumber} batches of ~${BATCH_SIZE}).`
  );
  console.log(
    `[ExpandNodes] Memory-safe /lib/dataset.ts size: ${(fs.statSync(DATASET_TS_PATH).size / 1024).toFixed(1)} KB`
  );
}

main();
