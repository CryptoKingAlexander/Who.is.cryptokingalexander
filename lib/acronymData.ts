export interface AcronymDefinition {
  acronym: string;
  fullName: string;
  explanation: string;
}

export const ACRONYM_DICTIONARY: Record<string, AcronymDefinition> = {
  v2s: {
    acronym: 'V2S',
    fullName: 'Voice-to-Skull (Frey Effect)',
    explanation: 'Microwave Neuro-Auditory Frey Effect inducing targeted RF acoustic perception inside the human skull without external acoustic pressure waves.',
  },
  govcloud: {
    acronym: 'GovCloud',
    fullName: 'FedRAMP High Sovereign GovCloud',
    explanation: 'Air-gapped IL5/IL6 multi-tenant sovereign enclaves for classified defense and national security workloads.',
  },
  il5: {
    acronym: 'IL5',
    fullName: 'DoD Impact Level 5',
    explanation: 'Department of Defense security authorization level for higher-sensitivity Controlled Unclassified Information (CUI).',
  },
  il6: {
    acronym: 'IL6',
    fullName: 'DoD Impact Level 6',
    explanation: 'Department of Defense cloud classification framework for Secret national security information.',
  },
  cui: {
    acronym: 'CUI',
    fullName: 'Controlled Unclassified Information',
    explanation: 'Federal security mandate regulating sensitive unclassified government technology data.',
  },
  pla: {
    acronym: 'PLA',
    fullName: 'People\'s Liberation Army',
    explanation: 'Armed forces of the People\'s Republic of China encompassing Eastern Theatre Command strategic forces.',
  },
  dod: {
    acronym: 'DoD',
    fullName: 'Department of Defense',
    explanation: 'Executive branch department of the United States Armed Forces.',
  },
  nato: {
    acronym: 'NATO',
    fullName: 'North Atlantic Treaty Organization',
    explanation: 'Intergovernmental military alliance of North American and European sovereign nations.',
  },
  ew: {
    acronym: 'EW',
    fullName: 'Electronic Warfare',
    explanation: 'Military actions leveraging electromagnetic energy to attack adversaries and secure spectrum dominance.',
  },
  rf: {
    acronym: 'RF',
    fullName: 'Radio Frequency',
    explanation: 'Electromagnetic wave frequencies used in radar, communications, and directed energy weapons.',
  },
  hpm: {
    acronym: 'HPM',
    fullName: 'High-Power Microwave',
    explanation: 'Directed energy weapon radiating high-peak power electromagnetic pulses to disrupt electronic circuitry.',
  },
  itar: {
    acronym: 'ITAR',
    fullName: 'International Traffic in Arms Regulations',
    explanation: 'United States regulatory regime restricting export of defense technologies.',
  },
  disa: {
    acronym: 'DISA',
    fullName: 'Defense Information Systems Agency',
    explanation: 'US Department of Defense combat support agency providing global IT infrastructure.',
  },
  gps: {
    acronym: 'GPS',
    fullName: 'Global Positioning System',
    explanation: 'Space-based satellite constellation providing positioning, navigation, and timing.',
  },
  vio: {
    acronym: 'VIO',
    fullName: 'Visual-Inertial Odometry',
    explanation: 'Autonomous navigation combining camera vision and inertial sensors under GPS-denied environments.',
  },
  pmc: {
    acronym: 'PMC',
    fullName: 'Private Military Company',
    explanation: 'Commercial organization providing specialized tactical and defense capabilities.',
  },
  llm: {
    acronym: 'LLM',
    fullName: 'Large Language Model',
    explanation: 'Deep learning transformer model trained on massive text corpora for computational reasoning.',
  },
  nlp: {
    acronym: 'NLP',
    fullName: 'Natural Language Processing',
    explanation: 'Computational linguistics domain analyzing and synthesizing human natural language.',
  },
  gpu: {
    acronym: 'GPU',
    fullName: 'Graphics Processing Unit',
    explanation: 'Parallel computational architecture optimized for matrix calculations and neural tensor processing.',
  },
};
