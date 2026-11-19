#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LIB_DIR = path.resolve(__dirname, '../lib');
const DATASET_PATH = path.resolve(LIB_DIR, 'dataset.ts');

if (!fs.existsSync(LIB_DIR)) {
  fs.mkdirSync(LIB_DIR, { recursive: true });
}

export const SECTIONS = [
  {"id":"all","domainClassification":"normal","title":"All","shortTitle":"All","description":"Cross-disciplinary network traversing AI systems, foundation models, practical deep learning, algorithmic core, formal linguistics, quantum computing, distributed cloud performance, and sovereign defense.","entrepreneurialPowerIntro":"Mastering this interconnected architectural graph gives you the unfair competitive advantage to architect, launch, and monetize enterprise-grade AI software that commands high pricing power and dominates market competitors.","diagramReference":"Unified Synthesis of all Reference Architectures","neonTheme":"crimson","icon":"Layers","totalCards":1050},
  {"id":"ai-roadmap","domainClassification":"normal","title":"Artificial Intelligence Roadmap & Cheat Sheet","shortTitle":"AI Roadmap & Systems","description":"Structural breakdown of AI subfields: ML, Neural Networks, Deep Learning, Generative AI, MLOps, Autonomous Agents, Edge Computing, and Continual Learning.","entrepreneurialPowerIntro":"Harnessing full-stack AI system architectures allows you to build autonomous digital workforces.","diagramReference":"Top Artificial Intelligence Cheat Sheet & Deep Learning Mind Map","neonTheme":"mint","icon":"Cpu","totalCards":27},
  {"id":"llm-dimensions","domainClassification":"normal","title":"Dimensions & Architecture of Large Language Models","shortTitle":"Dimensions of LLMs","description":"Pre-training pipelines, multimodal projectors, alignment (RLHF, DPO), parameter-efficient fine-tuning (LoRA), quantization, and test-time compute.","entrepreneurialPowerIntro":"Mastering foundation model internals unlocks enterprise solutions.","diagramReference":"Dimensions of LLMs Architecture Taxonomy","neonTheme":"purple","icon":"BrainCircuit","totalCards":27},
  {"id":"deep-learning-apps","domainClassification":"normal","title":"Applications of Deep Learning Across Industries","shortTitle":"Deep Learning Applications","description":"Real-world deep learning deployments: speech and audio, NLP, vision, environmental ecology, and industrial physics.","entrepreneurialPowerIntro":"Deploying industry-specific vision and speech intelligence positions you to build high-barrier B2B workflows.","diagramReference":"Applications of Deep Learning Domain Graph","neonTheme":"pink","icon":"Sparkles","totalCards":27},
  {"id":"ml-algorithms","domainClassification":"normal","title":"Categories, Base Algorithms & Techniques","shortTitle":"ML Algorithms & Base Math","description":"Mathematical foundation of supervised classification, unsupervised clustering, time series forecasting, and explainable AI.","entrepreneurialPowerIntro":"Understanding statistical learning provides the quantitative firepower to extract high-value alpha.","diagramReference":"Machine Learning Mind Map & Categories/Base Algorithms","neonTheme":"amber","icon":"Binary","totalCards":27},
  {"id":"linguistics-taxonomy","domainClassification":"normal","title":"Linguistic Foundations & Computational Language","shortTitle":"Linguistics & NLP Core","description":"Micro-linguistics and macro-linguistics, syntax, semantics, pragmatics, and vector space parsing.","entrepreneurialPowerIntro":"Controlling semantic vector spaces empowers you to engineer proprietary information retrieval engines.","diagramReference":"Linguistics Structural Hierarchy","neonTheme":"cyan","icon":"Languages","totalCards":26},
  {"id":"quantum-computing","domainClassification":"normal","title":"Quantum Computing & Information Systems","shortTitle":"Quantum Computing","description":"Quantum superposition, entanglement, Bloch sphere gates, Shor & Grover speedups, and Surface Code error correction.","entrepreneurialPowerIntro":"Commanding quantum information principles arms you with frontier technological literacy.","diagramReference":"Quantum Computing Mind Map","neonTheme":"mint","icon":"Atom","totalCards":27},
  {"id":"system-performance-cloud","domainClassification":"normal","title":"System Performance Strategies & Cloud Architecture","shortTitle":"Performance & Cloud","description":"High-performance distributed systems: CAP/PACELC theorems, consistent hashing, database sharding, and caching strategies.","entrepreneurialPowerIntro":"Architecting bulletproof distributed cloud backends guarantees your software can scale seamlessly.","diagramReference":"System Performance Strategies & Cloud Map","neonTheme":"amber","icon":"Server","totalCards":27},
  {"id":"engineering-principles","domainClassification":"normal","title":"Engineering Principles, System Soundness & AI Ethics","shortTitle":"Engineering Principles & Ethics","description":"Foundational axioms of high-assurance engineering: algorithmic fairness, safety integrity levels (SIL), and deterministic verification.","entrepreneurialPowerIntro":"Institutionalizing formal algorithmic fairness qualifies your AI startups to sell directly to regulated buyers.","diagramReference":"Engineering Principles & High-Assurance Systems Blueprint","neonTheme":"mint","icon":"ShieldCheck","totalCards":26},
  {"id":"gametech-systems","domainClassification":"normal","title":"GameTech Architecture, LiveOps & High-ROAS Monetization","shortTitle":"GameTech & High-ROAS","description":"High-throughput game engine architecture, deterministic rollback netcode, and programmatic header bidding mediation.","entrepreneurialPowerIntro":"Orchestrating real-time engine netcode hands you the keys to building compounding revenue.","diagramReference":"GameTech Systems Architecture & Real-Time Topology","neonTheme":"pink","icon":"Gamepad2","totalCards":27},
  {"id":"production-ai-evals","domainClassification":"normal","title":"Production AI Systems, Automated Prompt Compilers & High-Intent Evals","shortTitle":"Production AI & Evals","description":"High-conversion production AI engineering: automated MIPRO/DSPy prompt compilers, deterministic StateGraphs, and semantic entropy probes.","entrepreneurialPowerIntro":"Accelerates autonomous coding and decision agents in days instead of months.","diagramReference":"Production AI Agentic Topology & DSPy Compilation","neonTheme":"purple","icon":"Zap","totalCards":27},
  {"id":"gamification-monetization","domainClassification":"normal","title":"Behavioral Gamification, SaaS KPIs & High-Profitability Monetization Economics","shortTitle":"Gamification & Monetization","description":"Enterprise SaaS unit economics, Marczewski user type targeting, Skinner variable ratio loops, and Hooked retention flywheels.","entrepreneurialPowerIntro":"Deploying variable-reward flywheels doubles trial conversions and crushes churn.","diagramReference":"Gamification Economics & Behavioral Invariant Model","neonTheme":"mint","icon":"Coins","totalCards":27},
  {"id":"ai-agent-crafting","domainClassification":"normal","title":"AntiGravity & Autonomous AI App Building Engines","shortTitle":"AntiGravity AI Engines","description":"Next-generation vibe coding architectures, prompt-to-app compilers, and agentic live preview loops.","entrepreneurialPowerIntro":"Generate, compile, and monetize full-stack web applets in seconds.","diagramReference":"AntiGravity Vibe Coding Pipeline","neonTheme":"cyan","icon":"Sparkles","totalCards":26},
  {"id":"solo-founder-ai-stack","domainClassification":"normal","title":"Solo Founder Code & Earn Stack (AntiGravity Applets)","shortTitle":"Solo Founder Stack","description":"End-to-end solo founder automation: prompt-to-SaaS compilation and rapid conversion funnels.","entrepreneurialPowerIntro":"Transform ideas into recurring revenue micro-SaaS products automatically.","diagramReference":"Solo Founder Code-and-Earn Blueprint","neonTheme":"amber","icon":"Cpu","totalCards":26},
  {"id":"psychological-warfare-cognitive","domainClassification":"military","title":"Psychological Warfare, Cognitive Superiority & Neurological Ops","shortTitle":"PsychOps & Bio-Neuro","description":"Neuro-electromagnetic weapons (Frey effect, microwave hearing, V2S), sub-perceptual ultrasound, and cognitive disruption.","entrepreneurialPowerIntro":"Mastering neuro-electromagnetic signal processing provides deep technical insight into human-machine interfaces.","diagramReference":"Neuro-Electromagnetic Weapon Effects Diagram","neonTheme":"crimson","icon":"BrainCircuit","totalCards":27},
  {"id":"military-cyber-sovereign-cloud","domainClassification":"military","title":"Military Cyber Operations, Sovereign Cloud & Defense Infrastructure","shortTitle":"Military Cyber & GovCloud","description":"FedRAMP High / CUI IL4/IL5 isolated enclaves, CMMC Level 2/3 zero-trust guardrails, and post-quantum defense cryptography.","entrepreneurialPowerIntro":"Architecting zero-trust CUI defense enclaves qualifies your software teams for defense contracts.","diagramReference":"AWS GovCloud & Azure Government FedRAMP High Enclave Topology","neonTheme":"navy","icon":"ShieldCheck","totalCards":27},
  {"id":"nanotech-cellular-swarms","domainClassification":"military","title":"Nanotechnology, Cellular Warfare & Autonomous Micro-Swarms","shortTitle":"Nanotech & Micro-Swarms","description":"Bio-molecular nanosensors, flagellar locomotion, cellular nanomanipulators, and micro-UAV kinetic fleets.","entrepreneurialPowerIntro":"Unlocks frontier bio-mechatronic and sub-surface autonomous swarm capabilities.","diagramReference":"Biomolecular Nanobots & Flagellar Micro-Manipulator Architecture","neonTheme":"camo-olive","icon":"Atom","totalCards":27},
  {"id":"superpower-command-logistics","domainClassification":"military","title":"Global Superpower Command Structures, Theatre Logistics & A2/AD","shortTitle":"Superpowers & Theatre Command","description":"PLA Theatre Commands, US DoD JADC2, NATO IAMDS, A2/AD hypersonic missile chains, and subsea cable interdiction.","entrepreneurialPowerIntro":"Strategic oversight for enterprise-scale situational awareness software.","diagramReference":"Superpower Joint Command & Theatre Logistics Map","neonTheme":"bronze","icon":"Compass","totalCards":27},
  {"id":"paramilitary-insurgent-asymmetric","domainClassification":"military","title":"Paramilitary, Insurgent Networks & Asymmetric Hybrid Warfare","shortTitle":"Paramilitary & Asymmetric","description":"Asymmetric FPV drone swarms, cyber proxy militias, subterranean urban warfare, and darknet weapon financing.","entrepreneurialPowerIntro":"Prepares defense engineers to build resilient counter-unmanned and urban defense systems.","diagramReference":"Asymmetric Paramilitary Cell Structure & FPV Drone Diagram","neonTheme":"camo-tan","icon":"Zap","totalCards":26},
  {"id":"unconventional-directed-energy","domainClassification":"military","title":"Unconventional Directed Energy, Kinetic Bombardment & Stealth","shortTitle":"Directed Energy & Stealth","description":"High-Power Microwave (HPM) electronics frying, Active Denial Systems (ADS), orbital kinetic bombardment, and stealth metamaterials.","entrepreneurialPowerIntro":"Commanding high-power microwave physics and radar cross-section reduction enables frontier aerospace innovation.","diagramReference":"Directed Energy Systems & Orbital Kinetic Strike Blueprint","neonTheme":"crimson","icon":"Zap","totalCards":27},
  {"id":"medtech","domainClassification":"normal","title":"MedTech: Medical Technologies & Clinical Systems","shortTitle":"MedTech","description":"Robotic tele-surgery, closed-loop insulin delivery, and micro-aneurysm vascular diagnostics.","entrepreneurialPowerIntro":"Build high-margin digital health software and defensible IP.","diagramReference":"MedTech Systems Architecture","neonTheme":"crimson","icon":"Activity","totalCards":26},
  {"id":"biotech","domainClassification":"normal","title":"BioTech: Biotechnology & Molecular Engineering","shortTitle":"BioTech","description":"CRISPR orthogonal gene editors, cell-free protein synthesis, and cryo-EM density reconstruction.","entrepreneurialPowerIntro":"Mastering biotechnology architectures provides high-barrier IP moats.","diagramReference":"BioTech Systems Blueprint","neonTheme":"mint","icon":"Dna","totalCards":26},
  {"id":"edtech","domainClassification":"normal","title":"EdTech: Educational Technology & Learning Science","shortTitle":"EdTech","description":"Bayesian knowledge tracing, adaptive item response testing, and spaced repetition decay models.","entrepreneurialPowerIntro":"Scale personalized learning software with high retention.","diagramReference":"EdTech Learning Architecture","neonTheme":"cyan","icon":"GraduationCap","totalCards":26},
  {"id":"miltech","domainClassification":"military","title":"MilTech: Military Technology & Tactical Defense","shortTitle":"MilTech","description":"Hypersonic glide aero-thermodynamics, AESA radar arrays, and sensor-to-shooter JADC2 kill-chains.","entrepreneurialPowerIntro":"Qualify for high-ticket sovereign aerospace contracts.","diagramReference":"MilTech Systems Architecture","neonTheme":"crimson","icon":"Shield","totalCards":26},
  {"id":"cybertech","domainClassification":"normal","title":"CyberTech: Cybersecurity & Sovereign Cyber Defense","shortTitle":"CyberTech","description":"eBPF kernel telemetry, post-quantum HSM enclaves, and coverage-guided symbolic fuzzing.","entrepreneurialPowerIntro":"Secure enterprise software infrastructure against advanced persistent threats.","diagramReference":"CyberTech Systems Blueprint","neonTheme":"cyan","icon":"Lock","totalCards":26},
  {"id":"mindcontroltech","domainClassification":"military","title":"MindControlTech: Cognitive & Neural Influence Systems","shortTitle":"MindControlTech","description":"Transcranial ultrasound neuromodulation, magnetoelectric neural dust, and subliminal acoustic entrainment.","entrepreneurialPowerIntro":"Understand frontier neural-signal modulation and cognitive security.","diagramReference":"MindControlTech Blueprint","neonTheme":"purple","icon":"Eye","totalCards":26},
  {"id":"fintech","domainClassification":"normal","title":"FinTech: Financial Technology & Algorithmic Markets","shortTitle":"FinTech","description":"FPGA order book matching, zero-knowledge rollup settlements, and cointegrated statistical arbitrage.","entrepreneurialPowerIntro":"Build high-ticket algorithmic trading and financial microservices.","diagramReference":"FinTech Systems Architecture","neonTheme":"amber","icon":"DollarSign","totalCards":26},
  {"id":"stealthtech","domainClassification":"military","title":"StealthTech: Low-Observable & Signature Countermeasures","shortTitle":"StealthTech","description":"Metamaterial radar absorbent structures and physical optics radar cross section reduction.","entrepreneurialPowerIntro":"Advance frontier radar signature suppression and stealth materials.","diagramReference":"StealthTech Blueprint","neonTheme":"navy","icon":"Ghost","totalCards":26},
  {"id":"psytech","domainClassification":"normal","title":"PsyTech: Psychological Systems & Behavioral Tech","shortTitle":"PsyTech","description":"Wearable autonomic affective bio-sensors, VR biofeedback immersion rigs, and prosodic emotion profiling.","entrepreneurialPowerIntro":"Design high-engagement affective behavioral computing interfaces.","diagramReference":"PsyTech Blueprint","neonTheme":"pink","icon":"Brain","totalCards":26},
  {"id":"qtech","domainClassification":"normal","title":"QTech: Quantum Information & Hardware Systems","shortTitle":"QTech","description":"Superconducting transmon cryostats, entangled photon QKD sources, and surface code syndrome measurement.","entrepreneurialPowerIntro":"Position consulting and algorithmic IP at the forefront of the quantum era.","diagramReference":"QTech Hardware Blueprint","neonTheme":"mint","icon":"Atom","totalCards":26},
  {"id":"legtech","domainClassification":"normal","title":"LegTech: Legal Technology & Computational Jurisprudence","shortTitle":"LegTech","description":"Smart contract formal verification, jurisdictional legal ontologies, and case citation authority graphs.","entrepreneurialPowerIntro":"Automate legal analysis and regulatory compliance at scale.","diagramReference":"LegTech Blueprint","neonTheme":"amber","icon":"Scale","totalCards":26},
  {"id":"nanotech","domainClassification":"normal","title":"NanoTech: Nanotechnology & Molecular Synthesis","shortTitle":"NanoTech","description":"3D DNA origami scaffolds, sub-1nm CNTFET logic gates, and microfluidic liposome encapsulation.","entrepreneurialPowerIntro":"Pioneer precision molecular manufacturing architectures.","diagramReference":"NanoTech Blueprint","neonTheme":"camo-olive","icon":"Atom","totalCards":26},
  {"id":"microtech","domainClassification":"normal","title":"MicroTech: Micro-Electromechanical Systems & Micro-Scale Tech","shortTitle":"MicroTech","description":"MEMS differential capacitive sensors, MOEMS optical crossbar switches, and piezoelectric thin films.","entrepreneurialPowerIntro":"Engineer high-precision physical micro-sensors for autonomous vehicles.","diagramReference":"MicroTech Blueprint","neonTheme":"purple","icon":"Cpu","totalCards":26},
  {"id":"macrotech","domainClassification":"normal","title":"MacroTech: Macro-Engineering & Planetary Infrastructure","shortTitle":"MacroTech","description":"UHVDC ±1100kV intercontinental grids, stratospheric aerosol injection, and seismic tuned mass dampers.","entrepreneurialPowerIntro":"Architect multi-gigawatt sovereign power grids and planetary civil works.","diagramReference":"MacroTech Infrastructure Blueprint","neonTheme":"bronze","icon":"Globe","totalCards":26},
  {"id":"robotech","domainClassification":"normal","title":"RoboTech: Robotics & Dynamic Autonomous Mechatronics","shortTitle":"RoboTech","description":"Quasi-direct drive dynamic locomotion, magnetic flux tactile skin, and whole-body model predictive control.","entrepreneurialPowerIntro":"Build intelligent autonomous mobile robots and quadruped platforms.","diagramReference":"RoboTech Mechatronics Blueprint","neonTheme":"amber","icon":"Bot","totalCards":26},
  {"id":"humtech","domainClassification":"normal","title":"HumTech: Human Augmentation & Assistive Biomechatronics","shortTitle":"HumTech","description":"Powered torque-assist robotic exoskeletons, intracochlear electrode arrays, and SSVEP BCI interfaces.","entrepreneurialPowerIntro":"Advance cybernetic rehabilitation and human-augmenting devices.","diagramReference":"HumTech Blueprint","neonTheme":"cyan","icon":"Users","totalCards":26},
  {"id":"poltech","domainClassification":"normal","title":"PolTech: Political Technology & Civic Computational Systems","shortTitle":"PolTech","description":"Decentralized quadratic voting, computational redistricting MCMC compactness, and sentiment stance clustering.","entrepreneurialPowerIntro":"Deploy verifiable democratic coordination mechanisms.","diagramReference":"PolTech Civic Blueprint","neonTheme":"mint","icon":"Vote","totalCards":26},
  {"id":"govtech","domainClassification":"normal","title":"GovTech: Government Technology & Sovereign Digital Backbone","shortTitle":"GovTech","description":"eIDAS 2.0 zero-knowledge digital identity wallets, municipal IoT digital twins, and Benford procurement audits.","entrepreneurialPowerIntro":"Modernize municipal digital infrastructure and identity standards.","diagramReference":"GovTech Digital Backbone Blueprint","neonTheme":"amber","icon":"Landmark","totalCards":26},
  {"id":"gametech","domainClassification":"normal","title":"GameTech: Interactive Simulation & Real-Time Engine Tech","shortTitle":"GameTech Engine","description":"Hardware BVH real-time ray-tracers, sub-tick deterministic rollback netcode, and virtualized geometry clusters.","entrepreneurialPowerIntro":"Scale real-time interactive simulation engines with zero latency.","diagramReference":"GameTech Simulation Architecture","neonTheme":"pink","icon":"Gamepad2","totalCards":26},
  {"id":"cliptech","domainClassification":"normal","title":"ClipTech: Neural Media Compression & Video Processing","shortTitle":"ClipTech","description":"Latent autoencoder video compression, multimodal highlight boundary detection, and bidirectional optical flow.","entrepreneurialPowerIntro":"Slash video delivery bandwidth while maintaining broadcast visual quality.","diagramReference":"ClipTech Video Blueprint","neonTheme":"purple","icon":"Film","totalCards":26},
  {"id":"usa-national-air-shield","domainClassification":"military","title":"USA National Air Shield: Strategic Integrated Air & Missile Defense","shortTitle":"USA National Air Shield","description":"High-altitude long-range interceptor networks, Directed Energy Maneuver-Short Range Air Defense, and multi-domain sensors.","entrepreneurialPowerIntro":"Architect high-consequence national air defense systems.","diagramReference":"USA National Air Shield IAMDS Architecture","neonTheme":"navy","icon":"ShieldAlert","totalCards":27}
];

const DOMAIN_TOPICS = [
  { prefix: 'Zero-Knowledge Tensor Verification', sub: 'Cryptographic Enclave', concept: 'zk-SNARK polynomial commitments over quantized neural weight tensors', nick: 'Ghost ZK', formula: '\\epsilon_{sound} \\le \\frac{d \\cdot |\\mathbb{G}|}{|\\mathbb{F}_p|} + \\text{negl}(\\lambda)', term: 'KZG Commitment', def: 'Constant-size polynomial commitment allowing evaluation verification without revealing weights.' },
  { prefix: 'Sub-Millisecond FPGA Router', sub: 'Hardware Acceleration', concept: 'ultra-low-latency systolic array packet filtering and lock-free DMA ring buffers', nick: 'Chronos Gate', formula: 'T_{pipe} = N_{stages} \\cdot \\frac{1}{f_{clk}} + \\Delta t_{setup}', term: 'Kernel-Bypass DMA', def: 'Direct memory access routing network frames into FPGA RAM without kernel interrupt overhead.' },
  { prefix: 'Autonomous Multi-Agent Consensus', sub: 'Byzantine Coordination', concept: 'decentralized HotStuff BFT state replication across contested tactical edge nodes', nick: 'Hive Mesh', formula: 'N \\ge 3f + 1 \\implies |Q_1 \\cap Q_2| \\ge f + 1 > f', term: 'Threshold Signature', def: 'Combining k-of-n partial BLS cryptographic signatures into a single constant-size certificate.' },
  { prefix: 'Neuromorphic Spiking Processor', sub: 'Event-Driven Silicon', concept: 'Leaky Integrate-and-Fire spiking neural dynamics with STDP plasticity', nick: 'Synapse Core', formula: '\\tau_m \\frac{dV_m(t)}{dt} = -(V_m(t) - V_{rest}) + R_m I_{syn}(t)', term: 'Address-Event Representation', def: 'Asynchronous protocol transmitting discrete spike coordinates when voltage thresholds trigger.' },
  { prefix: 'Hamiltonian Quantum Optimizer', sub: 'Quantum Hybrid Loops', concept: 'parameterized Pauli-string ansatz trotterization with zero-noise extrapolation error mitigation', nick: 'Hilbert Engine', formula: 'E_0 \\le \\frac{\\langle \\psi(\\vec{\\theta}) | \\hat{\\mathcal{H}} | \\psi(\\vec{\\theta}) \\rangle}{\\langle \\psi(\\vec{\\theta}) | \\psi(\\vec{\\theta}) \\rangle}', term: 'Zero-Noise Extrapolation', def: 'Quantum error mitigation scaling gate noise to extrapolate back to the noiseless expectation limit.' },
  { prefix: 'Conformal Epistemic Guardrail', sub: 'Statistical Calibration', concept: 'split conformal prediction intervals with Martingale exchangeability drift detection', nick: 'Oracle Guard', formula: '\\mathbb{P}\\left( Y_{n+1} \\in \\hat{\\mathcal{C}}_{1-\\alpha}(X_{n+1}) \\right) \\ge 1 - \\alpha', term: 'Conformity Martingale', def: 'Sequential test monitoring conformal p-values online to detect distribution shift in real time.' },
  { prefix: 'Phase-Coherent Metamaterial Beamformer', sub: 'Wavefront Synthesis', concept: 'programmable varactor-tuned metasurface forming adaptive 45dB spatial nulls against jammers', nick: 'Aegis Wavefront', formula: '\\mathbf{w}_{opt} = \\frac{\\mathbf{R}_{xx}^{-1} \\mathbf{a}(\\theta_0)}{\\mathbf{a}^H(\\theta_0) \\mathbf{R}_{xx}^{-1} \\mathbf{a}(\\theta_0)}', term: 'Capon MVDR Filtering', def: 'Adaptive spatial filtering algorithm minimizing noise power while maintaining unity target gain.' },
  { prefix: 'Homomorphic Encrypted Vector Index', sub: 'Privacy-Preserving Search', concept: 'Ring-LWE CKKS approximate homomorphic inner-product evaluation over encrypted embeddings', nick: 'Cipher Vault', formula: '\\langle \\mathbf{c}, \\mathbf{s} \\rangle \\equiv m + e \\pmod{q}, \\quad \\|e\\|_\\infty < \\frac{q}{2\\Delta}', term: 'CKKS Rescaling', def: 'Dividing homomorphic ciphertexts by a scaling factor to prevent noise explosion across circuit depth.' },
  { prefix: 'Differential Lie-Group Trajectory Controller', sub: 'Manifold Control', concept: 'SE(3) Lie algebra tangent-space convex model predictive control under aerodynamic gusts', nick: 'Vector Manifold', formula: '\\dot{\\xi}_e = -\\text{ad}_{\\xi_d} \\xi_e + \\left( \\xi - \\text{Ad}_{g_e^{-1}} \\xi_d \\right)', term: 'Exponential Map Retraction', def: 'Projecting velocity vectors from Lie algebra tangent space back onto curved SE(3) manifold.' },
  { prefix: 'Causal Counterfactual Graph Estimator', sub: 'Causal Inference', concept: 'do-calculus back-door adjustment and doubly robust targeted maximum likelihood estimation', nick: 'Nexus Causality', formula: '\\hat{\\tau}_{AIPW} = \\frac{1}{n} \\sum_{i=1}^{n} \\left[ \\hat{\\mu}_1(X_i) - \\hat{\\mu}_0(X_i) + \\frac{T_i(Y_i - \\hat{\\mu}_1(X_i))}{\\hat{e}(X_i)} \\right]', term: 'Doubly Robust Estimator', def: 'Causal estimator remaining consistent if either the propensity model or outcome model is correct.' },
  { prefix: 'Speculative Medusa Tree Draft Decoder', sub: 'Sub-Linear Inference', concept: 'multi-head tree attention verification checking 16 candidate continuation branches per forward pass', nick: 'Hydra Speculator', formula: '\\mathbb{E}[\\text{Tokens/Step}] = \\frac{1 - \\alpha^{\\gamma + 1}}{1 - \\alpha}', term: 'Tree Attention Masking', def: 'Custom non-causal attention mask allowing parallel verification of branching candidate sequences.' },
  { prefix: 'Stochastic HJB Optimal Execution Engine', sub: 'Quantitative Control', concept: 'Hamilton-Jacobi-Bellman viscosity solutions for optimal inventory liquidation under market impact', nick: 'Alpha Viscosity', formula: 'x^*(t) = X_0 \\frac{\\sinh(\\kappa (T - t))}{\\sinh(\\kappa T)}, \\quad \\kappa = \\sqrt{\\frac{\\lambda \\sigma^2}{\\eta}}', term: 'Permanent vs Transient Impact', def: 'Decomposing order book slippage into transient liquidity depletion and lasting price displacement.' },
  { prefix: 'eBPF XDP Kernel-Bypass Packet Gate', sub: 'Line-Rate Defense', concept: 'Express Data Path eBPF bytecode verification dropping 100Mpps DDoS floods at NIC driver ring', nick: 'Sentinel XDP', formula: 'R_{max} = \\frac{B_{PCIe}}{S_{frame} + S_{overhead}}', term: 'XDP_DROP Driver Action', def: 'Instructing network card driver to recycle packet buffers immediately before allocating kernel sk_buff.' },
  { prefix: 'Riemannian Diffusion Score Manifold', sub: 'Geometric Generative AI', concept: 'reverse-time Langevin stochastic differential equations over compact SO(3) manifolds', nick: 'Geodesic Diffuser', formula: 'd\\mathbf{x}_t = \\left[ \\mathbf{f}(\\mathbf{x}_t, t) - g(t)^2 \\nabla_M \\log p_t(\\mathbf{x}_t) \\right] dt + g(t) d\\mathbf{W}_t^M', term: 'Stein Score Matching', def: 'Estimating gradient of log-density function without computing intractable normalization constants.' },
  { prefix: 'Photonic Silicon Mach-Zehnder Multiplier', sub: 'Optical Co-Packaged Compute', concept: 'wavelength-division multiplexed coherent Mach-Zehnder meshes performing O(1) flight-time GEMM', nick: 'Lumen Tensor', formula: '\\mathbf{U} = \\mathbf{D} \\prod_{(m,n) \\in \\mathcal{S}} \\mathbf{T}_{m,n}(\\theta_{m,n}, \\phi_{m,n})', term: 'Clements Unitary Decomposition', def: 'Factoring any arbitrary N×N unitary matrix into a symmetric mesh of 2×2 beam splitters and phase shifters.' }
];

const LEVELS = ['Fundamental', 'Intermediate', 'Advanced', 'Frontier', 'Expert'];

function generateCards() {
  const domainSections = SECTIONS.filter(s => s.id !== 'all');
  const cards = [];
  const TOTAL_TARGET = 1050;

  for (let i = 0; i < TOTAL_TARGET; i++) {
    const sec = domainSections[i % domainSections.length];
    const topic = DOMAIN_TOPICS[i % DOMAIN_TOPICS.length];
    const variant = Math.floor(i / domainSections.length) + 1;
    const level = LEVELS[i % LEVELS.length];
    const isMilitary = sec.domainClassification === 'military';

    const cardId = `${sec.id}-spec-${i + 1}-v${variant}`;
    const title = `${sec.shortTitle}: ${topic.prefix} [Mk-${variant}]`;
    const subcategory = `${topic.sub} · Mk-${variant}`;
    const description = `Operational high-assurance ${sec.title} architecture integrating ${topic.concept} for deterministic sub-millisecond execution (Specification Node #${i + 1}).`;

    const equations = [
      {
        name: `${topic.prefix} Primary Invariant`,
        formula: topic.formula,
        variables: [
          { symbol: '\\lambda', explanation: `Operating threshold constant for ${sec.shortTitle}` },
          { symbol: 'd', explanation: 'Dimensionality of underlying state manifold' },
          { symbol: '\\epsilon_{sound}', explanation: 'Maximum permissible soundness error' }
        ],
        intuition: `Formulates the governing boundary condition for ${topic.prefix} within ${sec.shortTitle}.`
      },
      {
        name: `${title} - Queuing Dwell & Concurrency Equilibrium`,
        formula: 'W_q = \\frac{\\lambda \\sigma^2 + \\rho / \\mu}{2(1 - \\rho)}, \\quad L = \\lambda W',
        variables: [
          { symbol: 'W_q', explanation: 'Mean queue dwell time before execution' },
          { symbol: '\\rho', explanation: 'Channel utilization factor' },
          { symbol: '\\sigma^2', explanation: 'Service time variance across threads' }
        ],
        intuition: 'Quantifies queue stability and prevents tail-latency runaway under peak burst concurrency.'
      },
      {
        name: `${title} - Shannon Channel Capacity & Entropy`,
        formula: 'C = B \\log_2\\left(1 + \\frac{S}{N}\\right), \\quad \\mathcal{H}(X) = -\\sum_{i} P(x_i) \\log_2 P(x_i)',
        variables: [
          { symbol: 'C', explanation: 'Maximum telemetry bandwidth in bits per second' },
          { symbol: 'B', explanation: 'Allocated frequency spectrum' },
          { symbol: 'S/N', explanation: 'Signal to noise ratio' }
        ],
        intuition: 'Quantifies information-theoretic transmission capacity across contested communication fabrics.'
      },
      {
        name: `${title} - Lyapunov Asymptotic Convergence`,
        formula: 'V(\\mathbf{x}) > 0, \\quad \\dot{V}(\\mathbf{x}) = \\nabla V(\\mathbf{x})^T f(\\mathbf{x}) \\le -\\alpha \\|\\mathbf{x}\\|_2^2 < 0',
        variables: [
          { symbol: 'V(\\mathbf{x})', explanation: 'Positive-definite radially unbounded Lyapunov energy function' },
          { symbol: '\\alpha', explanation: 'Exponential convergence damping rate' }
        ],
        intuition: 'Proves that bounded state perturbations decay exponentially back to the equilibrium manifold.'
      }
    ];

    const jargon = [
      { term: topic.term, definition: topic.def },
      { term: `${sec.shortTitle} Operational Invariant`, definition: `Formal invariant preserved across state transitions in ${sec.title}.` },
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

    const sectionKeywordsMap = {
      'llm-dimensions': ['FlashAttention-3', 'LoRA', 'DPO', 'KV-Cache', 'Quantization', 'Transformer', 'Test-Time-Compute'],
      'nanotech-cellular-swarms': ['Biomolecular nanobots', 'Flagellar Locomotion', 'Cellular Swarms', 'Micro-UAV'],
      'system-performance-cloud': ['Pollaczek-Khinchine', 'CAP Theorem', 'PACELC', 'Consistent Hashing', 'Database Sharding'],
      'psychological-warfare-cognitive': ['Voice-to-skull V2S microwave', 'Frey Effect', 'Sub-perceptual Ultrasound', 'Neurological Ops'],
      'military-cyber-sovereign-cloud': ['FedRAMP High AWS GovCloud', 'CUI IL4 IL5', 'CMMC Level 3', 'Zero-Trust'],
      'superpower-command-logistics': ['PLA Eastern Theatre Command', 'US DoD JADC2', 'NATO IAMDS', 'A2 AD Hypersonic'],
      'unconventional-directed-energy': ['Rods from God orbital kinetic', 'High-Power Microwave HPM', 'Active Denial Systems ADS', 'Stealth Metamaterials'],
      'usa-national-air-shield': ['PAC-3 MSE', 'Terminal High Altitude THAAD', 'DE M-SHORAD', 'Integrated Air Shield'],
      'ai-agent-crafting': ['AntiGravity Vibe Coding', 'Prompt-to-App Compiler', 'Autonomous AI Engines'],
      'quantum-computing': ['Hamiltonian Variational Quantum', 'Quantum Superposition', 'Bloch Sphere', 'Surface Code']
    };

    const sectionSpecificKeywords = (sectionKeywordsMap[sec.id] || []).map(k => k.toLowerCase().replace(/[^a-z0-9]+/g, '-'));

    const baseTags = [
      sec.id,
      sec.shortTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      ...sectionSpecificKeywords,
      topic.prefix.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      topic.nick.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      `mk-${variant}`,
      `node-${i + 1}`,
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
      tagSoup.push(`${sec.id}-token-${tagSoup.length}`);
    }

    const classification = isMilitary
      ? 'SECRET // CUI IL5 // DOD JADC2 ENCLAVE // ITAR CONTROLLED'
      : 'UNCLASSIFIED // CUI IL4 // FEDRAMP HIGH // SOC2 TYPE II COMPLIANT';

    cards.push({
      id: cardId,
      title,
      sectionId: sec.id,
      domainClassification: sec.domainClassification || 'normal',
      category: sec.title,
      subcategory,
      subnetNumber: i + 1,
      description,
      extendedNotes: `Architected for ${sec.title}, pairing ${topic.concept} with formal invariant verification.`,
      sourceDiagram: sec.diagramReference || `${sec.shortTitle} Reference Topology`,
      level,
      neonTheme: sec.neonTheme || 'amber',
      fundamentalPrerequisiteScore: 25 + ((i * 7) % 70),
      technicalAbstractionDepth: 30 + ((i * 11) % 65),
      nicheRarityIndex: 35 + ((i * 13) % 60),
      profitabilityScore: 60 + ((i * 17) % 39),
      equations,
      jargon,
      tagSoup,
      fundamentalAlgorithm: {
        name: `${topic.prefix} Execution Pipeline`,
        type: 'Fundamental',
        complexity: 'O(N \\log N)',
        description: `Executes verified ${topic.concept} across state tensors.`,
        objective: `Guarantee invariant compliance for ${title}.`,
        pseudocode: [
          'Ingest telemetry frame into pre-allocated memory buffer',
          `Project state vector onto ${topic.prefix} basis manifold`,
          'Verify Lyapunov stability bounds within real-time budget',
          'Emit signed state confirmation to downstream subsystems'
        ]
      },
      optimizationAlgorithm: {
        name: `SIMD ${topic.prefix} Acceleration Kernel`,
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
      programManagerOverview: `Principal Program Manager Engineering Overview [${classification}]: Managing acquisition and deployment for ${title} within ${sec.title} (${subcategory}). Enforces deterministic latency bounds, zero-trust perimeter isolation, and automated verification.`,
      systemsArchitectPerspective: `Systems Architect Directive & Formal Invariant: ${title} enforces lock-free ring buffers, sub-10ms tail latency, and fail-closed transitions across ${sec.shortTitle} systems.`,
      profitabilityAnalysis: `Profitability, Unit Economics & Margin Yield (ΔProfit = +$${8400 + (i % 12) * 500}/mo Net Margin): Position ${title} as an enterprise software module with 15:1 LTV:CAC efficiency.`,
      cyberOperationsLiaison: `Cyber Operations Liaison Directive [ZERO-TRUST]: ${title} mandates mTLS attestation, immutable telemetry logs, and strict input validation.`,
      popCultureNickname: `${topic.nick} #${variant}`
    });
  }

  // Update counts in SECTIONS
  const counts = new Map();
  for (const c of cards) {
    counts.set(c.sectionId, (counts.get(c.sectionId) || 0) + 1);
  }
  for (const sec of SECTIONS) {
    if (sec.id === 'all') {
      sec.totalCards = cards.length;
    } else {
      sec.totalCards = counts.get(sec.id) || 0;
    }
  }

  return cards;
}

const cards = generateCards();
console.log(`Generated ${cards.length} nodes across ${SECTIONS.length - 1} domain sections.`);

const formattedSections = '[\n' + SECTIONS.map((s) => '  ' + JSON.stringify(s)).join(',\n') + '\n]';
const formattedCards = '[\n' + cards.map((c) => '  ' + JSON.stringify(c)).join(',\n') + '\n]';

const content = `// Generated Unified Technical Dataset for TechBook
import { SectionMeta, TechCard } from "@/types/techbook";

export const SECTIONS: SectionMeta[] = ${formattedSections};

export const TECH_CARDS: TechCard[] = ${formattedCards};
`;

fs.writeFileSync(DATASET_PATH, content, 'utf8');
console.log(`Successfully written ${DATASET_PATH} with ${cards.length} nodes!`);
