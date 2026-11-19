import { SectionMeta } from '@/types/techbook';

export interface CategoryPerspective {
  id: string;
  title: string;
  subtitle: string;
  iconName: 'Cpu' | 'BarChart3' | 'ShieldAlert' | 'TrendingUp' | 'Layers';
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  content: string;
  keyTakeaways: string[];
}

/**
 * OMNICLEARANCE // OMNISINGULARITY TRAINING-SET MATH UP-PERSPECTIVES
 * Generates the 5 top-level Category Overview Perspective Subnode Containers
 * with explicit differential, game-theoretic, and information-geometric equations
 * to out-math standard domain analyses across all 56 Normal & Tactical categories.
 */
export function getCategoryPerspectives(section: SectionMeta): CategoryPerspective[] {
  const isAll = section.id === 'all';
  const shortTitle = section.shortTitle || section.title;
  const isMilitary =
    section.domainClassification === 'military' ||
    [
      'psychological-warfare-cognitive',
      'military-cyber-sovereign-cloud',
      'nanotech-cellular-swarms',
      'superpower-command-logistics',
      'paramilitary-insurgent-asymmetric',
      'unconventional-directed-energy',
      'miltech',
      'stealthtech',
      'geopolitical-abuse-coercion',
      'hypnotic-systems-lossy-vs-lossless',
      'supply-chain-infiltration',
      'salary-stacking-sting-countermath',
    ].includes(section.id);

  // 1. Program Manager Directive (Stochastic HJB & Queueing Velocity Math)
  let pmContent = `[OMNISINGULARITY PM FORMALISM] Executing production deployment across ${shortTitle} enforces Pollaczek-Khinchine queue stability $\\sum_{k=1}^M \\rho_k < 1 - \\epsilon$ with expected wait bound $W_q = \\frac{\\lambda \\mathbb{E}[S^2]}{2(1-\\rho)}$ and continuous-time Hamilton-Jacobi-Bellman milestone control $-\\partial_t V = \\min_u \\{ \\mathcal{L}(x,u) + \\nabla V^T f(x,u) \\}$.`;
  if (isAll) {
    pmContent =
      '[OMNICLEARANCE MASTER PM SYNTHESIS] Cross-domain execution across all 56 Super Hyperbook categories enforces global multi-echelon HJB optimality $-\\partial_t V = \\min_{\\mathbf{u}} \\{ \\mathcal{L} + \\nabla V^T \\mathbf{f} + \\frac{1}{2}\\text{Tr}(\\boldsymbol{\\Sigma}\\nabla^2 V) \\}$ and sublinear Blackwell regret $\\mathcal{R}_T / T \\le \\sqrt{2\\ln K / T} \\to 0$ across every normal and tactical node.';
  } else if (section.id === 'salary-stacking-sting-countermath') {
    pmContent =
      '[STACK-AND-SHIELD PM DIRECTIVE] Parallel M-role execution requires strict Pollaczek-Khinchine headroom $\\rho_{total} = \\sum_{k=1}^M (\\lambda_k / \\kappa_{AI}\\mu_0) < 0.72$, paired with Wald Sequential Probability Ratio Testing $\\Lambda_n = \\sum_{i=1}^n \\ln[f_1(x_i)/f_0(x_i)]$ to detect and neutralize long-term entrapping sting campaigns ("Car Stubby Spam" Poisson/Hawkes anomalies) at zero legal exposure.';
  } else if (section.id === 'hypnotic-systems-lossy-vs-lossless') {
    pmContent =
      '[SYMPLECTIC VS. LOSSY PM DIRECTIVE] Reject open-loop lossy & data-poisoned conditioning where mutual information collapses $I(X;Y_t) \\propto e^{-t/\\tau_{hab}} \\to 0$ and KL poisoning explodes $D_{KL}(P^{(n)} \\parallel P^{(0)}) \\to \\infty$. Mandate lossless symplectic Hamiltonian steering $\\det(\\mathbf{J}_{\\Phi_t}) \\equiv 1$ that beats evolutionary replicator-mutator resistance.';
  } else if (isMilitary) {
    pmContent = `[TACTICAL JADC2 PM DIRECTIVE] Defense execution for ${shortTitle} enforces ACAT I / CMMC Level 3 formal verification gates, bounding sensor-to-shooter kill-chain latency by $T_{kill} = \\arg\\min_{\\mathbf{P}} \\text{Tr}(\\mathbf{C}_{assign} \\mathbf{P}^T)$ under active electronic/cyber warfare jamming $(S/J)_{eff} > \\gamma_{burn}$.`;
  }

  // 2. Chief Systems Architect Perspective (Symplectic, Lyapunov & Fisher-Rao Math)
  let archContent = `[OMNISINGULARITY ARCHITECT INVARIANT] State transitions in ${shortTitle} obey symplectic phase-space volume conservation $\\det(\\mathbf{J}_{\\Phi_t}) = 1$, Control Barrier Function forward safety $L_f h(\\mathbf{x}) + L_g h(\\mathbf{x})\\mathbf{u} + \\alpha(h(\\mathbf{x})) \\ge 0$, and Fisher-Rao geodesic parameter convergence $ds^2 = \\sum g_{ij}(\\theta) d\\theta^i d\\theta^j$.`;
  if (section.id === 'hiding-money-counter-forensics') {
    archContent =
      '[ZK-CAPITAL ARCHITECT INVARIANT] Multi-hop ledger routing enforces Pedersen homomorphic balance $\\sum C_{in} - \\sum C_{out} = \\mathcal{O}_{\\mathbb{E}}$, cyclic shell eigenvalue attenuation $\\|(\\mathbf{I}-\\mathbf{W})^{-1}\\mathbf{D}\\|_\\infty < 0.25$, and Benford first-digit KL stealth $D_{KL}(P_{emp} \\parallel P_{Benford}) < 10^{-4}$.';
  } else if (section.id === 'supply-chain-sparking') {
    archContent =
      '[PERCOLATION SPARK ARCHITECT INVARIANT] Cold-start BOM ignition requires crossing the Molloy-Reed directed percolation threshold $p > p_c = \\langle k_{in} \\rangle / (\\langle k_{in}k_{out} \\rangle - \\langle k_{in} \\rangle)$ while clamping upstream bullwhip amplification via $\\|T_{D \\to O}(z)\\|_{\\mathcal{H}_\\infty} < 1.0$.';
  } else if (section.id === 'supply-chain-infiltration') {
    archContent =
      '[ZERO-TRUST SILICON ARCHITECT INVARIANT] Hardware provenance mandates SAT-Miter formal equivalence $\\text{SAT}(f_{RTL} \\oplus f_{Gate}) = \\text{UNSAT}$, Karhunen-Loève side-channel residual projection $T^2 = \\mathbf{r}^T \\boldsymbol{\\Sigma}^{-1} \\mathbf{r} < \\gamma$, and silicon PUF inter-die entropy $d_H^{\\text{inter}} \\approx 0.50$.';
  }

  // 3. High-Yield Monetization & Economics (Stochastic NPV, Pareto & VCG Math)
  let econContent = `[OMNISINGULARITY YIELD CALCULUS] Monetizing ${shortTitle} maximizes risk-adjusted net present surplus $\\Delta \\text{Profit} = \\int_0^\\infty e^{-rt} [R(t)(1 - c_{marg}) - C_{ops}]\\,dt > 0$ with Weibull cohort survival $S(t) = \\exp(-(t/\\lambda)^k)$ and LTV:CAC ratio $\\frac{\\text{ARPU} \\cdot \\text{GM}}{\\text{CAC} \\cdot c_{churn}} \\ge 6.4$.`;
  if (section.id === 'disabled-economic-systems') {
    econContent =
      '[ASSISTIVE YIELD MULTIPLIER CALCULUS] Neuro-adaptive economic systems multiply Wolpaw BCI/ocular channel bit-rate $B_{ITR}$ by AST semantic macro expansion $\\Lambda_{AST} \\ge 250\\times$ while eliminating statutory welfare-cliff notches via smooth Mirrlees marginal effective tax curves $\\text{METR}(z) = \\tau\'(z) - B\'(z) \\in [0, 0.35]$.';
  } else if (section.id === 'hidden-sexual-behavioral-dynamics') {
    econContent =
      '[SUB-ROSA NEURO-ECONOMIC CALCULUS] Dyadic and platform value extraction obeys Spence-Zahavi single-crossing signaling $\\partial_q (\\partial_s c / \\partial_w u) < 0$, variable-ratio dopamine RPE variance $\\mathbb{E}[\\delta_t^2] = p(1-p)R_{max}^2$, and Nash bargaining threat-point leverage $\\Lambda = \\frac{\\alpha(u_2 - d_2)}{(1-\\alpha)(u_1 - d_1)}$.';
  }

  // 4. Cyber Operations & Enclave Liaison (Zero-Knowledge, PQC & Counter-Surveillance Math)
  let cyberContent = `[OMNISINGULARITY CYBER ENCLAVE MATH] Enclave hardening for ${shortTitle} enforces ML-KEM-1024 lattice security, PlonK KZG polynomial soundness $\\mathbb{P}(\\text{Forge}) \\le \\deg(P)/|\\mathbb{F}_p| < 2^{-128}$, and cross-compartment mutual information zeroing $I(\\mathcal{S}_{sec}; \\mathcal{O}_{adv}) \\equiv 0$.`;
  if (section.id === 'salary-stacking-sting-countermath') {
    cyberContent =
      '[COUNTER-STING & CAR STUBBY SPAM DEFENSE MATH] Rejects coincidence hypotheses when repetitive stubby-antenna vehicular encounters breach spatial-temporal Poisson bounds $\\sum_{m=k}^\\infty \\frac{\\Lambda_0^m e^{-\\Lambda_0}}{m!} < 10^{-9}$ or exhibit Hawkes self-exciting branching $\\hat{n}_{branch} > 0.65$; enforces 360-dashcam Merkle timestamping and Maximum-Entropy Markov Walk route randomization $h_{\\text{MEMW}} = \\ln \\lambda_{max}(A)$.';
  } else if (section.id === 'geopolitical-abuse-coercion') {
    cyberContent =
      '[SOVEREIGN COUNTER-COERCION MATH] Neutralizes weaponized SWIFT/correspondent chokepoint centrality $C_B(v_{hub})$ and Foreign Direct Product Rule taint $1 - \\prod(1 - \\omega_k)$ via atomic mBridge PvP settlement and minimum-variance sanction-orthogonal reserve portfolios $\\mathbf{w}^T \\mathbf{s}_{sanction} = 0$.';
  }

  // 5. Strategic Market Forces (Porter's 5 Forces Bilevel Stackelberg & Nash Math)
  const porterContent = `[OMNISINGULARITY STACKELBERG MOAT MATH] Competitive factorization of ${shortTitle} solves the bilevel Stackelberg leader-follower game $\\max_{\\mathbf{x}_L} F(\\mathbf{x}_L, \\mathbf{x}_F^*(\\mathbf{x}_L))$, where entry barrier height $B_{entry} = K_{IP} + \\mathcal{I}_{data} \\ln N$, buyer switching friction $C_{switch} / \\text{ARR} > 2.4$, and Cheeger network conductance $\\phi(G) \\ge \\lambda_2(\\mathcal{L})/2$ lock in structural monopoly surplus.`;

  return [
    {
      id: 'program-manager',
      title: 'Principal Program Manager Directive (HJB & Queue Math)',
      subtitle: 'Stochastic Control, SLA Queuing & Milestone Velocity',
      iconName: 'BarChart3',
      borderColor: 'border-amber-500/70',
      badgeBg: 'bg-amber-950/80',
      badgeText: 'text-amber-300 border-amber-600/50',
      content: pmContent,
      keyTakeaways: [
        'Enforce Pollaczek-Khinchine queue stability $\\rho = \\lambda / \\mu < 1 - \\epsilon$ across all parallel execution streams.',
        'Bound cumulative decision regret via Blackwell approachability $\\mathcal{R}_T / T \\le \\mathcal{O}(T^{-1/2})$.',
        'Verify milestone gates via Doubly-Robust AIPW causal estimators $\\hat{\\tau}_{DR}$ with zero confounding bias.',
      ],
    },
    {
      id: 'systems-architect',
      title: 'Chief Systems Architect Perspective (Symplectic & CBF Math)',
      subtitle: 'Liouville Volume Conservation & Forward Safety Invariants',
      iconName: 'Cpu',
      borderColor: 'border-cyan-500/70',
      badgeBg: 'bg-cyan-950/80',
      badgeText: 'text-cyan-300 border-cyan-600/50',
      content: archContent,
      keyTakeaways: [
        'Preserve lossless phase-space information volume $\\det(\\mathbf{J}_{\\Phi_t}) \\equiv 1$ across state transformations.',
        'Guarantee hard safety boundaries via Zeroing Control Barrier Functions $L_f h + L_g h \\cdot u + \\alpha(h) \\ge 0$.',
        'Precondition high-dimensional state updates with the inverse Fisher Information Metric $\\mathbf{G}(\\theta)^{-1}$.',
      ],
    },
    {
      id: 'monetization-economics',
      title: 'High-Yield Monetization & Economics (Stochastic NPV & VCG)',
      subtitle: 'Profitability Deviations, Weibull Retention & Truthful Auctions',
      iconName: 'TrendingUp',
      borderColor: 'border-emerald-500/70',
      badgeBg: 'bg-emerald-950/80',
      badgeText: 'text-emerald-300 border-emerald-600/50',
      content: econContent,
      keyTakeaways: [
        'Maximize discounted net surplus $\\Delta \\text{Profit} = \\mathbb{E}[\\int_0^\\infty e^{-rt}(R_t - C_t)dt] > 0$ at 88%+ gross margin.',
        'Enforce VCG Clarke-Pivot truthful pricing $p_i = \\min \\sum_{j\\neq i} b_j - \\sum_{j\\neq i} b_j^*$ in multi-party clearing.',
        'Eliminate discontinuous welfare/pricing cliffs so marginal utility $\\partial U / \\partial z > 0$ holds everywhere.',
      ],
    },
    {
      id: 'cyber-operations',
      title: 'Cyber Operations & Enclave Liaison (ZK, PQC & SPRT Math)',
      subtitle: 'Zero-Knowledge Soundness & Counter-Sting Anomaly Detection',
      iconName: 'ShieldAlert',
      borderColor: 'border-red-500/70',
      badgeBg: 'bg-red-950/80',
      badgeText: 'text-red-300 border-red-600/50',
      content: cyberContent,
      keyTakeaways: [
        'Enforce zero mutual information leakage $I(\\text{Secret}; \\text{Adversary}) = 0$ across hardware-isolated enclaves.',
        'Run Wald Sequential Probability Ratio Tests $\\Lambda_n \\notin (B, A)$ to flag coordinated stings or intrusions in minimum time.',
        'Attest hardware/software provenance via PlonK/Groth16 zero-knowledge proofs with soundness error $< 2^{-128}$.',
      ],
    },
    {
      id: 'porters-forces',
      title: "Strategic Market Forces (Porter's 5 Forces Stackelberg Math)",
      subtitle: 'Bilevel Game Equilibria & Structural Moat Factorization',
      iconName: 'Layers',
      borderColor: 'border-purple-500/70',
      badgeBg: 'bg-purple-950/80',
      badgeText: 'text-purple-300 border-purple-600/50',
      content: porterContent,
      keyTakeaways: [
        'Entry Barrier Lower Bound: $B_{entry} = K_{capex} + \\gamma D_{KL}(P_{incumbent} \\parallel P_{entrant}) \\gg 0$.',
        'Supplier & Buyer Power Attenuation: bound Herfindahl-Hirschman concentration $\\text{HHI} = \\sum s_i^2$ via dual-sourcing.',
        'Rivalry Dominance: commit to Stackelberg leader trajectories that out-math reactive Nash competitors.',
      ],
    },
  ];
}
