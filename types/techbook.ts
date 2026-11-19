export type SectionId = 
  | 'all'
  | 'psychological-warfare-cognitive'
  | 'military-cyber-sovereign-cloud'
  | 'nanotech-cellular-swarms'
  | 'superpower-command-logistics'
  | 'paramilitary-insurgent-asymmetric'
  | 'unconventional-directed-energy'
  | 'ai-roadmap'
  | 'llm-dimensions'
  | 'deep-learning-apps'
  | 'ml-algorithms'
  | 'linguistics-taxonomy'
  | 'quantum-computing'
  | 'system-performance-cloud'
  | 'engineering-principles'
  | 'gametech-systems'
  | 'production-ai-evals'
  | 'gamification-monetization'
  | 'ai-agent-crafting'
  | 'ai-product-strategy'
  | 'solo-founder-ai-stack'
  | 'ai-app-solutions'
  | 'medtech'
  | 'biotech'
  | 'edtech'
  | 'miltech'
  | 'cybertech'
  | 'mindcontroltech'
  | 'fintech'
  | 'stealthtech'
  | 'psytech'
  | 'qtech'
  | 'legtech'
  | 'nanotech'
  | 'microtech'
  | 'macrotech'
  | 'robotech'
  | 'humtech'
  | 'poltech'
  | 'govtech'
  | 'gametech'
  | 'cliptech'
  | 'usa-national-air-shield'
  | 'b2b-ecommerce'
  | 'b2c-ecommerce'
  | 'd2c-ecommerce'
  | 'c2c-ecommerce'
  | 'c2b-ecommerce'
  | 'b2g-ecommerce'
  | 'hiding-money-counter-forensics'
  | 'hidden-sexual-behavioral-dynamics'
  | 'geopolitical-abuse-coercion'
  | 'hypnotic-systems-lossy-vs-lossless'
  | 'supply-chain-sparking'
  | 'supply-chain-infiltration'
  | 'disabled-economic-systems'
  | 'salary-stacking-sting-countermath';

export type NeonTheme = 'cyan' | 'pink' | 'mint' | 'purple' | 'amber' | 'crimson' | 'bronze' | 'navy' | 'camo-olive' | 'camo-tan';

export type MacroCategory =
  | 'Autonomous Intelligence & Computational Synthesis'
  | 'Algorithmic Economics & Value Abstraction Engine'
  | 'Deterministic Systems Soundness & Frontier Scalability'
  | 'Cognitive Superiority & Cyber Electromagnetic Warfare'
  | 'Strategic Multi-Domain Power Projection & Asymmetric Operations';

export interface EquationItem {
  name: string;
  formula: string;
  variables: { symbol: string; explanation: string }[];
  intuition: string;
}

export interface JargonItem {
  term: string;
  definition: string;
}

export interface CardAlgorithm {
  name: string;
  type: 'Fundamental' | 'Optimization';
  complexity: string;
  description: string;
  objective?: string;
  pseudocode?: string[];
}

export interface ExpertInsights {
  overviewParagraph: string; // Paragraph 1: Topic Introduction & Maximum Impact Overview
  explorationOptions: string[]; // Options for Further Exploration (List 1)
  integrationParagraph: string; // Paragraph 2: Integration Tips, Maximum Impact & Profitability Delta (\Delta Profit > 0)
  exploitationOptions: string[]; // Options for Further Exploitation (List 2)
  // Legacy string mappings maintained for backward compatibility
  industryApplication?: string;
  strategicWedge?: string;
  profitabilityDelta?: string;
  executionPromptFramework?: string;
}

export type DomainClassification = 'normal' | 'military';

export interface TechCard {
  id: string;
  title: string;
  sectionId: SectionId;
  domainClassification?: DomainClassification; // Meta text classification: 'normal' | 'military'
  macroCategory?: MacroCategory; // Consolidated 3-macro-category semantic abstraction (dynamically computed if omitted)
  category: string; // Category title
  subcategory: string; // Subcategory title
  legacyCategory?: string; // Retained original category structure for enhanced search result ordering
  description: string;
  extendedNotes?: string;
  systemsArchitectPerspective?: string; // Systems Architect Directive / Invariant
  profitabilityAnalysis?: string; // Profitability focus, unit economics & ROI
  cyberOperationsLiaison?: string; // Cyber Operations Liaison Directive
  ecomGuruPerspective?: string; // Ecom Guru perspective
  gamingProjectManagerPerspective?: string; // Gaming PM perspective
  expertInsights?: ExpertInsights; // Collapsible Expert Insights
  officialBusinessClassification?: string; // Official Business Classification marking (e.g. CUI IL5, SECRET//NOFORN, EAR99)
  programManagerOverview?: string; // Principal Program Manager Engineering Overview
  sourceDiagram?: string;
  subnetNumber?: number;
  profitabilityScore?: number;
  level: 'Fundamental' | 'Intermediate' | 'Advanced' | 'Frontier' | 'Expert';
  neonTheme: NeonTheme;

  // Semantic Complexity & Niche Index Data Variables
  fundamentalPrerequisiteScore?: number; // 1-100 (1 = basic intuition, 100 = deep prerequisite stack)
  technicalAbstractionDepth?: number; // 1-100 (1 = high-level concept, 100 = multi-tensor differential formalism)
  nicheRarityIndex?: number; // 1-100 (1 = widely available open knowledge, 100 = highly guarded sovereign IP)

  equations: EquationItem[];
  popCultureNickname?: string; // Sci-fi / Magic / Tech-nerd pop culture reference
  fundamentalAlgorithm?: CardAlgorithm;
  optimizationAlgorithm?: CardAlgorithm;
  algorithms?: CardAlgorithm[];
  jargon: JargonItem[];
  tagSoup: string[]; // Up to 32 tags
  hiddenMetaTags?: string[]; // 50+ hidden user story meta tags for precision search
  relatedIds?: string[];
}

export interface SectionMeta {
  id: SectionId;
  macroCategory?: MacroCategory;
  domainClassification?: DomainClassification; // 'normal' | 'military' meta text classification
  title: string;
  shortTitle: string;
  description: string;
  entrepreneurialPowerIntro?: string;
  diagramReference: string;
  neonTheme: NeonTheme;
  icon: string;
  totalCards: number;
}

export interface SearchResult {
  card: TechCard;
  score: number;
  matchedFields: string[];
  snippet?: string;
}
