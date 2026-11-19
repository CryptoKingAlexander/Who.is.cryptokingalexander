'use client';

import React, { useState } from 'react';
import { 
  Network, 
  ChevronRight, 
  FolderTree, 
  ExternalLink, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Sparkles,
  Layers
} from 'lucide-react';
import { SectionId } from '@/types/techbook';

export interface TaxonomyNode {
  name: string;
  cardId?: string;
  theme?: 'cyan' | 'pink' | 'mint' | 'purple' | 'amber' | 'crimson' | 'bronze' | 'navy' | 'camo-olive' | 'camo-tan';
  children?: TaxonomyNode[];
}

export const TAXONOMY_TREES: Record<string, { title: string; sectionId: SectionId; tree: TaxonomyNode }> = {
  'psychological-warfare-cognitive': {
    title: 'Psychological Warfare & Neurological Operations Graph',
    sectionId: 'psychological-warfare-cognitive',
    tree: {
      name: 'Psychological Warfare & Cognitive Operations',
      theme: 'crimson',
      children: [
        {
          name: 'Neuro-Electromagnetic Weapons',
          theme: 'crimson',
          children: [
            { name: 'Microwave Hearing (V2S)', cardId: 'neuro-em-weapons-v2s', theme: 'crimson' },
            { name: 'EEG Brain Blanking', cardId: 'bio-em-brain-blanking', theme: 'crimson' },
            { name: 'Sub-Perceptual Ultrasound Hypnosis', cardId: 'subperceptual-hypnosis-memory', theme: 'crimson' },
            { name: 'Subliminal RF Bio-Affection', cardId: 'subliminal-rf-bioaffection', theme: 'crimson' },
          ],
        },
        {
          name: 'Mass Perception & Cognitive Strategy',
          theme: 'crimson',
          children: [
            { name: 'Synthetic PsyOps & Deepfakes', cardId: 'deepfake-psychops-disruption', theme: 'crimson' },
            { name: 'Reflexive Control Theory', cardId: 'reflexive-control-theory', theme: 'crimson' },
            { name: 'Cognitive Vulnerability Mapping', cardId: 'cognitive-vulnerability-profiling', theme: 'crimson' },
          ],
        },
        {
          name: 'Directed Acoustic & Shielding Enclaves',
          theme: 'crimson',
          children: [
            { name: 'Infrasound & Tinnitus Arrays', cardId: 'acoustic-tinnitus-sonics', theme: 'crimson' },
            { name: 'Photoacoustic Laser Transducers', cardId: 'clandestine-transducer-thermal', theme: 'crimson' },
            { name: 'Faradic Bio-Sleeves & SCIF Shielding', cardId: 'counter-cognitive-shielding', theme: 'crimson' },
          ],
        },
      ],
    },
  },

  'military-cyber-sovereign-cloud': {
    title: 'Military Cyber Operations & Sovereign Cloud Architecture',
    sectionId: 'military-cyber-sovereign-cloud',
    tree: {
      name: 'Military Cyber & GovCloud Infrastructure',
      theme: 'navy',
      children: [
        {
          name: 'Sovereign Defense Cloud Enclaves',
          theme: 'navy',
          children: [
            { name: 'FedRAMP High CUI IL4/IL5 Enclaves', cardId: 'fedramp-high-il4-il5-enclaves', theme: 'navy' },
            { name: 'CMMC Level 2/3 Zero-Trust', cardId: 'cmmc-level2-3-zerotrust', theme: 'navy' },
            { name: 'DevSecOps DISA STIG Hardening', cardId: 'devsecops-stig-binary-hardening', theme: 'navy' },
            { name: 'Post-Quantum Key Distribution (Kyber)', cardId: 'postquantum-defense-key-dist', theme: 'navy' },
          ],
        },
        {
          name: 'Cyber Command & Offensive Exploitation',
          theme: 'navy',
          children: [
            { name: 'SIEM / SOAR Sentinel Matrix', cardId: 'siem-soar-threat-matrix', theme: 'navy' },
            { name: 'SCADA Infrastructure Sabotage', cardId: 'scada-grid-sabotage-exploit', theme: 'navy' },
            { name: 'Offensive APT Proxy Operations', cardId: 'offensive-cyber-proxy-apt', theme: 'navy' },
            { name: 'Orbital & Space Cyber Interception', cardId: 'satellite-space-cyber-interception', theme: 'navy' },
          ],
        },
        {
          name: 'Covert Relays & Exfiltration',
          theme: 'navy',
          children: [
            { name: 'Darknet Mesh Relays (LoRa/UWB)', cardId: 'clandestine-darknet-mesh-relays', theme: 'navy' },
            { name: 'Air-Gapped Side-Channel Exfiltration', cardId: 'airgapped-electroacoustic-exfil', theme: 'navy' },
          ],
        },
      ],
    },
  },

  'nanotech-cellular-swarms': {
    title: 'Nanotechnology, Cellular Warfare & Micro-Swarms Topology',
    sectionId: 'nanotech-cellular-swarms',
    tree: {
      name: 'Nanotech & Autonomous Micro-Swarms',
      theme: 'camo-olive',
      children: [
        {
          name: 'Biomolecular Nanobots & Manipulators',
          theme: 'camo-olive',
          children: [
            { name: 'Flagellar Locomotion Nanobots', cardId: 'biomolecular-nanosensor-flagellar', theme: 'camo-olive' },
            { name: 'Cellular Nanomanipulators & Delivery', cardId: 'cellular-nanomanipulators-delivery', theme: 'camo-olive' },
            { name: 'Dipole Antenna Energy Harvesting', cardId: 'dipole-antenna-energy-nanobots', theme: 'camo-olive' },
            { name: 'Targeted Molecular Disruption', cardId: 'molecular-disruption-engines', theme: 'camo-olive' },
          ],
        },
        {
          name: 'Autonomous Micro-Swarms & Recon',
          theme: 'camo-olive',
          children: [
            { name: 'Micro-UAV Kinetic Fleets', cardId: 'micro-uav-kinetic-swarms', theme: 'camo-olive' },
            { name: 'Self-Replicating Bio-Inhibitors', cardId: 'self-replicating-nano-inhibitors', theme: 'camo-olive' },
            { name: 'Airborne Smart Dust Clouds', cardId: 'smartdust-acoustic-recon', theme: 'camo-olive' },
            { name: 'Cyborg Insect Surveillance', cardId: 'biomechanical-cyborg-insects', theme: 'camo-olive' },
          ],
        },
        {
          name: 'Sub-Surface & Counter-Nano Defense',
          theme: 'camo-olive',
          children: [
            { name: 'Sub-Surface Micro-Tunnelling Mines', cardId: 'subsurface-microtunnelling-swarms', theme: 'camo-olive' },
            { name: 'Counter-Nano EMP Grids', cardId: 'counter-nano-emp-grids', theme: 'camo-olive' },
          ],
        },
      ],
    },
  },

  'superpower-command-logistics': {
    title: 'Global Superpower Command Structures & Theatre Logistics',
    sectionId: 'superpower-command-logistics',
    tree: {
      name: 'Superpower Command & Strategic Fires',
      theme: 'bronze',
      children: [
        {
          name: 'Sovereign Force Structures',
          theme: 'bronze',
          children: [
            { name: 'PLA Theatre Commands (GA 71-83)', cardId: 'pla-theatre-commands-group-armies', theme: 'bronze' },
            { name: 'US DoD JADC2 All-Domain Grid', cardId: 'us-dod-jadc2-all-domain', theme: 'bronze' },
            { name: 'Russian BTG Combined Arms', cardId: 'russian-btg-hybrid-doctrines', theme: 'bronze' },
            { name: 'NATO IAMDS Missile Shield', cardId: 'nato-iamds-integrated-air-defense', theme: 'bronze' },
          ],
        },
        {
          name: 'Strategic Theatre Strike & A2/AD',
          theme: 'bronze',
          children: [
            { name: 'Cross-Strait A2/AD Hypersonic Chains', cardId: 'crossstrait-a2ad-hypersonic', theme: 'bronze' },
            { name: 'Subsea Cable Interdiction & Chokepoints', cardId: 'deepsea-submarine-cable-interdiction', theme: 'bronze' },
            { name: 'Orbital ASAT & Laser Dazzling', cardId: 'orbital-asat-directed-energy', theme: 'bronze' },
            { name: 'Hypersonic Glide Skipping Fires', cardId: 'multidomain-precision-fires', theme: 'bronze' },
          ],
        },
        {
          name: 'Extreme Environment & Logistics',
          theme: 'bronze',
          children: [
            { name: 'Arctic Sub-Ice Submarine Warfare', cardId: 'arctic-circle-subice-warfare', theme: 'bronze' },
            { name: 'Automated Munition Supply Chains', cardId: 'automated-munition-logistics-base', theme: 'bronze' },
          ],
        },
      ],
    },
  },

  'paramilitary-insurgent-asymmetric': {
    title: 'Paramilitary, Insurgent Networks & Asymmetric Warfare Graph',
    sectionId: 'paramilitary-insurgent-asymmetric',
    tree: {
      name: 'Paramilitary & Asymmetric Hybrid Warfare',
      theme: 'camo-tan',
      children: [
        {
          name: 'Paramilitary & Non-State Units',
          theme: 'camo-tan',
          children: [
            { name: 'PMC Wagner Decentralized Command', cardId: 'pmc-wagner-decentralized-command', theme: 'camo-tan' },
            { name: 'Houthi/Hezbollah Drone Swarms', cardId: 'houthi-hezbollah-drone-anti-ship', theme: 'camo-tan' },
            { name: 'Cyber Proxy Ransomware Syndicates', cardId: 'cyber-proxy-militia-ransomware', theme: 'camo-tan' },
            { name: 'Gray-Zone Disinformation Militias', cardId: 'grayzone-disinformation-militia', theme: 'camo-tan' },
          ],
        },
        {
          name: 'Asymmetric Tactics & Ordnance',
          theme: 'camo-tan',
          children: [
            { name: 'Urban Subterranean Tunnel Networks', cardId: 'subterranean-urban-tunnel-warfare', theme: 'camo-tan' },
            { name: 'Vehicle CREW IED Jammers', cardId: 'ied-electronic-countermeasures', theme: 'camo-tan' },
            { name: 'Weaponized FPV Commercial Drones', cardId: 'fpv-commercial-drone-weaponization', theme: 'camo-tan' },
            { name: 'Unconventional Warfare Sabotage', cardId: 'unconventional-sabotage-proxy', theme: 'camo-tan' },
          ],
        },
        {
          name: 'Clandestine Financing & Maritime Piracy',
          theme: 'camo-tan',
          children: [
            { name: 'Darknet Arms & Monero Financing', cardId: 'darknet-arms-crypto-financing', theme: 'camo-tan' },
            { name: 'Strategic Maritime Piracy', cardId: 'maritime-piracy-chokepoint-interdiction', theme: 'camo-tan' },
          ],
        },
      ],
    },
  },

  'unconventional-directed-energy': {
    title: 'Directed Energy, Kinetic Bombardment & Stealth Systems',
    sectionId: 'unconventional-directed-energy',
    tree: {
      name: 'Directed Energy, Kinetic Strikes & Stealth',
      theme: 'crimson',
      children: [
        {
          name: 'Directed Energy Weapons (DEW)',
          theme: 'crimson',
          children: [
            { name: 'High-Power Microwave (HPM) Frying', cardId: 'high-power-microwave-electronics-fry', theme: 'crimson' },
            { name: 'Active Denial Systems (95 GHz)', cardId: 'active-denial-millimeter-wave', theme: 'crimson' },
            { name: 'High-Energy Laser Weapons (LaWS)', cardId: 'laser-weapon-systems-laws', theme: 'crimson' },
            { name: 'LRAD Directional Infrasound', cardId: 'lrad-directional-infrasound', theme: 'crimson' },
          ],
        },
        {
          name: 'Kinetic Bombardment & EMP',
          theme: 'crimson',
          children: [
            { name: 'Pulse Detonation Engines', cardId: 'pulse-detonation-hypersonic-munitions', theme: 'crimson' },
            { name: 'Transient Grid EMP Neutralization', cardId: 'transient-emp-grid-neutralization', theme: 'crimson' },
            { name: 'Rods from God Orbital Strikes', cardId: 'orbital-kinetic-rods-from-god', theme: 'crimson' },
          ],
        },
        {
          name: 'Bio-Detection, AUVs & Stealth',
          theme: 'crimson',
          children: [
            { name: 'Lab-on-a-Chip Bio-Pathogen Detection', cardId: 'clandestine-pathogen-bio-detection', theme: 'crimson' },
            { name: 'Subsea AUV Mine Countermeasures', cardId: 'subsea-auv-mine-countermeasures', theme: 'crimson' },
            { name: 'Metamaterial Radar Cross-Section Stealth', cardId: 'stealth-rcs-metamaterial-camouflage', theme: 'crimson' },
          ],
        },
      ],
    },
  },
  'ai-roadmap': {
    title: 'Diagram 1: Artificial Intelligence Roadmap & Cheat Sheet',
    sectionId: 'ai-roadmap',
    tree: {
      name: 'Artificial Intelligence (AI)',
      theme: 'mint',
      children: [
        {
          name: 'Machine Learning (ML)',
          theme: 'mint',
          children: [
            {
              name: 'Neural Networks',
              theme: 'mint',
              children: [
                {
                  name: 'Deep Learning',
                  theme: 'mint',
                  children: [
                    {
                      name: 'Generative AI & Autonomous Agents',
                      cardId: 'autonomous-agents',
                      theme: 'mint',
                      children: [
                        { name: 'Autonomous Agents & ReAct', cardId: 'autonomous-agents' },
                        { name: 'Causal AI & Decision Intelligence', cardId: 'causal-ai' },
                        { name: 'AutoML & Neural Architecture Search', cardId: 'automl-nas' },
                        { name: 'Generative Adversarial Networks (GANs)', cardId: 'semi-supervised-learning' },
                        { name: 'Variational Autoencoders (VAEs)', cardId: 'semi-supervised-learning' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'Production & Systems',
          theme: 'mint',
          children: [
            { name: 'MLOps & CI/CD Pipelines', cardId: 'mlops-lifecycle' },
            { name: 'Embedded AI & TinyML', cardId: 'embedded-edge-ai' },
            { name: 'Cybersecurity in AI & Robustness', cardId: 'cybersecurity-ai' },
            { name: 'IoT, Sensors & Autonomous Robotics', cardId: 'iot-robotics' },
          ],
        },
      ],
    },
  },

  'llm-dimensions': {
    title: 'Diagram 3: Dimensions & Architecture of LLMs',
    sectionId: 'llm-dimensions',
    tree: {
      name: 'Dimensions of LLMs',
      theme: 'purple',
      children: [
        {
          name: 'Pre-Training',
          cardId: 'llm-pretraining',
          theme: 'purple',
          children: [
            { name: 'Single-Modal (T5, GPT-3, LLaMA, PaLM)', cardId: 'llm-pretraining' },
            { name: 'Multi-Modal (GPT-4, Gemini, PaLM-E, MiniGPT-4)', cardId: 'llm-pretraining' },
          ],
        },
        {
          name: 'Fine-Tuning & Alignment',
          cardId: 'llm-alignment',
          theme: 'purple',
          children: [
            { name: 'Instruction Tuning & Transfer', cardId: 'llm-pretraining' },
            { name: 'Alignment (RLHF, DPO, RLAIF, RAFT)', cardId: 'llm-alignment' },
            { name: 'PEFT (LoRA, QLoRA, Prefix, Prompt)', cardId: 'peft-lora' },
            { name: 'Quantization (PTQ, QAT, AWQ, GPTQ)', cardId: 'llm-quantization' },
          ],
        },
        {
          name: 'Efficient Architectures',
          cardId: 'efficient-transformers',
          theme: 'purple',
          children: [
            { name: 'FlashAttention & IO-Aware Tiling', cardId: 'efficient-transformers' },
            { name: 'PagedAttention & KV Cache', cardId: 'efficient-transformers' },
            { name: 'Grouped-Query Attention (GQA)', cardId: 'efficient-transformers' },
          ],
        },
        {
          name: 'Evaluation & Benchmarks',
          cardId: 'llm-safety-eval',
          theme: 'purple',
          children: [
            { name: 'NLG (ROUGE, BLEU, BERTScore)', cardId: 'llm-safety-eval' },
            { name: 'NLU (MMLU, GSM8k, ARC)', cardId: 'llm-safety-eval' },
            { name: 'Safety & Adversarial Attacks', cardId: 'llm-safety-eval' },
          ],
        },
        {
          name: 'Inference & Reasoning',
          cardId: 'llm-reasoning',
          theme: 'purple',
          children: [
            { name: 'Chain of Thought (CoT)', cardId: 'llm-reasoning' },
            { name: 'Tree of Thoughts (ToT) & Search', cardId: 'llm-reasoning' },
            { name: 'In-Context Learning (ICL)', cardId: 'llm-reasoning' },
          ],
        },
        {
          name: 'Applications',
          cardId: 'llm-applications',
          theme: 'purple',
          children: [
            { name: 'Coding (Copilot, SWE-bench)', cardId: 'llm-applications' },
            { name: 'Medicine (Med-PaLM)', cardId: 'llm-applications' },
            { name: 'Law, Finance & Science', cardId: 'llm-applications' },
          ],
        },
      ],
    },
  },

  'deep-learning-apps': {
    title: 'Diagram 4: Applications of Deep Learning',
    sectionId: 'deep-learning-apps',
    tree: {
      name: 'Applications of Deep Learning',
      theme: 'pink',
      children: [
        {
          name: 'Information Processing',
          cardId: 'nlp-applications',
          theme: 'pink',
          children: [
            { name: 'Speech Enhancement & SER', cardId: 'speech-audio-deep-learning' },
            { name: 'NLP: Translation, QA, Summarization', cardId: 'nlp-applications' },
            { name: 'Computer Vision: Detection & Pose', cardId: 'deep-learning-vision' },
          ],
        },
        {
          name: 'Environmental & Social',
          cardId: 'environmental-social-ai',
          theme: 'pink',
          children: [
            { name: 'Ecology & Bioacoustics', cardId: 'environmental-social-ai' },
            { name: 'Precision Agriculture & Disasters', cardId: 'environmental-social-ai' },
            { name: 'Financial Fraud & GNN Rings', cardId: 'deep-learning-fraud' },
          ],
        },
        {
          name: 'Industrial & Engineering',
          cardId: 'deep-learning-engineering',
          theme: 'pink',
          children: [
            { name: 'Physics-Informed NNs (PINN & CFD)', cardId: 'deep-learning-engineering' },
            { name: 'Civil Engineering & Crack Detection', cardId: 'deep-learning-engineering' },
          ],
        },
        {
          name: 'Biomedical & Life Sciences',
          cardId: 'biomedical-ai',
          theme: 'pink',
          children: [
            { name: 'Protein Structure (AlphaFold)', cardId: 'biomedical-ai' },
            { name: 'Genomic Sequencing & scRNA-seq', cardId: 'biomedical-genomics' },
            { name: 'Medical Image Segmentation (U-Net)', cardId: 'biomedical-imaging' },
          ],
        },
      ],
    },
  },

  'ml-algorithms': {
    title: 'Diagram 5: Categories, Base Algorithms & Techniques',
    sectionId: 'ml-algorithms',
    tree: {
      name: 'Machine Learning Core',
      theme: 'amber',
      children: [
        {
          name: 'Supervised Learning',
          cardId: 'supervised-classification',
          theme: 'amber',
          children: [
            { name: 'Classification (Logistic, SVM, Trees, Bayes)', cardId: 'supervised-classification' },
            { name: 'Regression (Ridge, Lasso, Elastic Net, SVR)', cardId: 'supervised-regression' },
          ],
        },
        {
          name: 'Unsupervised Learning',
          cardId: 'unsupervised-clustering',
          theme: 'amber',
          children: [
            { name: 'Clustering (K-Means, DBSCAN, GMM)', cardId: 'unsupervised-clustering' },
            { name: 'Association Rules (Apriori, FP-Growth, Eclat)', cardId: 'association-rules' },
            { name: 'Dimensionality Reduction (PCA, t-SNE, SVD)', cardId: 'unsupervised-dimensionality' },
          ],
        },
        {
          name: 'Reinforcement Learning',
          cardId: 'reinforcement-learning',
          theme: 'amber',
          children: [
            { name: 'Q-Learning & Deep Q-Network (DQN)', cardId: 'reinforcement-learning' },
            { name: 'SARSA, Actor-Critic & AlphaZero', cardId: 'reinforcement-learning' },
          ],
        },
        {
          name: 'Deep Learning Techniques',
          cardId: 'convolutional-networks',
          theme: 'amber',
          children: [
            { name: 'ANNs: Perceptrons, CNNs, LSTMs', cardId: 'convolutional-networks' },
            { name: 'Ensembles: XGBoost, LightGBM, Bagging', cardId: 'ensemble-learning' },
          ],
        },
      ],
    },
  },

  'linguistics-taxonomy': {
    title: 'Diagram 2: Linguistics Structural Taxonomy',
    sectionId: 'linguistics-taxonomy',
    tree: {
      name: 'Linguistics Structural Hierarchy',
      theme: 'cyan',
      children: [
        {
          name: 'Micro Linguistics',
          cardId: 'phonetics-acoustics',
          theme: 'cyan',
          children: [
            { name: 'Phonetics (Articulatory, Acoustic, Auditory)', cardId: 'phonetics-acoustics' },
            { name: 'Phonology & Sound Patterns', cardId: 'phonology-morphology' },
            { name: 'Morphology (Derivational & Inflectional)', cardId: 'phonology-morphology' },
            { name: 'Syntax (CFG & Dependencies)', cardId: 'syntax-semantics' },
            { name: 'Semantics (Lexical & Compositional)', cardId: 'syntax-semantics' },
            { name: 'Pragmatics & Speech Acts', cardId: 'syntax-semantics' },
          ],
        },
        {
          name: 'Macro Linguistics',
          cardId: 'computational-linguistics',
          theme: 'cyan',
          children: [
            { name: 'Inter-Disciplinary (Sociolinguistics, Neuro, Psycholinguistics)', cardId: 'computational-linguistics' },
            { name: 'Computational Linguistics & NLP Systems', cardId: 'computational-linguistics' },
            { name: 'Intra-Disciplinary (Theoretical, Applied, Historical)', cardId: 'linguistics-intra-disciplinary' },
          ],
        },
      ],
    },
  },

  'quantum-computing': {
    title: 'Diagram: Quantum Computing Mind Map',
    sectionId: 'quantum-computing',
    tree: {
      name: 'Quantum Computing System',
      theme: 'mint',
      children: [
        {
          name: 'Introduction to Quantum Computing',
          cardId: 'quantum-fundamentals-qubits',
          theme: 'mint',
          children: [
            { name: 'Quantum Bits (Qubits) & Superposition', cardId: 'quantum-fundamentals-qubits' },
            { name: 'Quantum Gates (Pauli, Hadamard, CNOT)', cardId: 'quantum-fundamentals-qubits' },
            { name: 'Bloch Sphere & Unitary Transformations', cardId: 'quantum-fundamentals-qubits' },
            { name: 'Quantum Entanglement & Bell States', cardId: 'quantum-fundamentals-qubits' },
          ],
        },
        {
          name: 'Quantum Algorithms & Acceleration',
          cardId: 'quantum-algorithms-shor-grover',
          theme: 'mint',
          children: [
            { name: 'Quantum Fourier Transform (QFT)', cardId: 'quantum-algorithms-shor-grover' },
            { name: 'Shor\'s Factorization Algorithm', cardId: 'quantum-algorithms-shor-grover' },
            { name: 'Grover\'s Database Search (Quadratic Speedup)', cardId: 'quantum-algorithms-shor-grover' },
            { name: 'Quantum Phase Estimation & Order Finding', cardId: 'quantum-algorithms-shor-grover' },
          ],
        },
        {
          name: 'Quantum Hardware & Error Correction',
          cardId: 'quantum-hardware-qec',
          theme: 'mint',
          children: [
            { name: 'Superconducting Transmon Processors', cardId: 'quantum-hardware-qec' },
            { name: 'Trapped-Ion Qubit Registers', cardId: 'quantum-hardware-qec' },
            { name: 'Quantum Error Correction (Surface Codes)', cardId: 'quantum-hardware-qec' },
            { name: 'Coherence Dynamics (T1 Relaxation & T2 Dephasing)', cardId: 'quantum-hardware-qec' },
          ],
        },
        {
          name: 'Quantum Communication & Cryptography',
          cardId: 'quantum-crypto-teleportation',
          theme: 'mint',
          children: [
            { name: 'Quantum Key Distribution (BB84 Protocol)', cardId: 'quantum-crypto-teleportation' },
            { name: 'Quantum State Teleportation & EPR Channels', cardId: 'quantum-crypto-teleportation' },
            { name: 'Privacy Amplification & QBER Bounds', cardId: 'quantum-crypto-teleportation' },
            { name: 'No-Cloning Theorem & Hacking Defense', cardId: 'quantum-crypto-teleportation' },
          ],
        },
        {
          name: 'Quantum Machine Learning & VQE',
          cardId: 'quantum-machine-learning-vqe',
          theme: 'mint',
          children: [
            { name: 'Variational Quantum Eigensolver (VQE)', cardId: 'quantum-machine-learning-vqe' },
            { name: 'Parameterized Quantum Circuits (PQC)', cardId: 'quantum-machine-learning-vqe' },
            { name: 'Quantum Kernel Methods & QSVM', cardId: 'quantum-machine-learning-vqe' },
            { name: 'Parameter-Shift Rule & Barren Plateaus', cardId: 'quantum-machine-learning-vqe' },
          ],
        },
      ],
    },
  },

  'system-performance-cloud': {
    title: 'Diagram: Must-Know System Performance & Cloud Infrastructure',
    sectionId: 'system-performance-cloud',
    tree: {
      name: 'Distributed Systems & Cloud Architecture',
      theme: 'amber',
      children: [
        {
          name: 'Distributed Consistency & Trade-Offs',
          cardId: 'cap-pacelc-theorems',
          theme: 'amber',
          children: [
            { name: 'Brewer\'s CAP Theorem (CP vs AP)', cardId: 'cap-pacelc-theorems' },
            { name: 'Abadi\'s PACELC Theorem (Latency vs Consistency)', cardId: 'cap-pacelc-theorems' },
            { name: 'Strict Quorum Consensus (R + W > N)', cardId: 'cap-pacelc-theorems' },
            { name: 'Eventual Consistency & Replicated State', cardId: 'cap-pacelc-theorems' },
          ],
        },
        {
          name: 'Data Partitioning & Hashing',
          cardId: 'consistent-hashing-sharding',
          theme: 'amber',
          children: [
            { name: 'Database Sharding (Hash vs Range)', cardId: 'consistent-hashing-sharding' },
            { name: 'Consistent Hashing Circular Ring', cardId: 'consistent-hashing-sharding' },
            { name: 'Virtual Nodes (Vnodes) & Load Distribution', cardId: 'consistent-hashing-sharding' },
            { name: 'Hot Spot Mitigation & Shard Rebalancing', cardId: 'consistent-hashing-sharding' },
          ],
        },
        {
          name: 'Caching & Asynchronous Processing',
          cardId: 'database-caching-event-driven',
          theme: 'amber',
          children: [
            { name: 'Cache-Aside & Write-Through / Write-Behind', cardId: 'database-caching-event-driven' },
            { name: 'Cache Stampede & XFetch Probabilistic Expiration', cardId: 'database-caching-event-driven' },
            { name: 'Asynchronous Message Brokers & Queuing', cardId: 'database-caching-event-driven' },
            { name: 'Dead-Letter Queues (DLQ) & Little\'s Law', cardId: 'database-caching-event-driven' },
          ],
        },
        {
          name: 'Enterprise Cloud Management & Blueprints',
          cardId: 'cloud-infrastructure-orchestration',
          theme: 'amber',
          children: [
            { name: 'Infrastructure as Code Blueprints', cardId: 'cloud-infrastructure-orchestration' },
            { name: 'Property Dictionaries & Fabric Groups', cardId: 'cloud-infrastructure-orchestration' },
            { name: 'Automated Quota & Tenant Machine Reclamation', cardId: 'cloud-infrastructure-orchestration' },
            { name: 'Multi-Tenant Reservation Policies & Governance', cardId: 'cloud-infrastructure-orchestration' },
          ],
        },
        {
          name: 'Consensus & Fault Tolerance',
          cardId: 'distributed-consensus-fault-tolerance',
          theme: 'amber',
          children: [
            { name: 'Raft Protocol & Leader Election', cardId: 'distributed-consensus-fault-tolerance' },
            { name: 'Quorum Majority (R + W > N)', cardId: 'distributed-consensus-fault-tolerance' },
            { name: 'Saga Distributed Transactions & Rollback', cardId: 'distributed-consensus-fault-tolerance' },
            { name: 'Circuit Breaker & Bulkhead Failure Containment', cardId: 'distributed-consensus-fault-tolerance' },
          ],
        },
      ],
    },
  },
  'engineering-principles': {
    title: 'Diagram: Engineering Principles, AI Ethics & High-Assurance Systems',
    sectionId: 'engineering-principles',
    tree: {
      name: 'Engineering Principles & Governance',
      theme: 'mint',
      children: [
        {
          name: 'Algorithmic Fairness & Moral Alignment',
          cardId: 'engineering-ethics-fairness',
          theme: 'mint',
          children: [
            { name: 'Disparate Impact & 4/5ths Metric', cardId: 'engineering-ethics-fairness' },
            { name: 'Equalized Odds & Counterfactual Fairness', cardId: 'engineering-ethics-fairness' },
            { name: 'Constitutional AI & Value Alignment Objective', cardId: 'engineering-ethics-fairness' },
            { name: 'Algorithmic Recourse & Demographic Parity', cardId: 'engineering-ethics-fairness' },
          ],
        },
        {
          name: 'High-Assurance Safety & Fail-Safe Design',
          cardId: 'engineering-soundness-safety',
          theme: 'mint',
          children: [
            { name: 'Safety Integrity Levels (SIL) & PFD Analysis', cardId: 'engineering-soundness-safety' },
            { name: 'Lyapunov Stability Proofs for Autonomous Systems', cardId: 'engineering-soundness-safety' },
            { name: 'Fail-Stop Invariants & Graceful Degradation', cardId: 'engineering-soundness-safety' },
            { name: 'Deterministic Auditability & Verification Logs', cardId: 'engineering-soundness-safety' },
          ],
        },
      ],
    },
  },
  'gametech-systems': {
    title: 'Diagram: GameTech Architecture, LiveOps & High-ROAS Monetization',
    sectionId: 'gametech-systems',
    tree: {
      name: 'GameTech & High-ROAS Architecture',
      theme: 'pink',
      children: [
        {
          name: 'AdTech & Programmatic ROAS Mediation',
          cardId: 'gametech-in-app-bidding-ad-mediation',
          theme: 'pink',
          children: [
            { name: 'In-App Parallel Header Bidding & eCPM', cardId: 'gametech-in-app-bidding-ad-mediation' },
            { name: 'Predictive pLTV & Target-ROAS Cohorts', cardId: 'gametech-pltv-cohort-bidding-roas' },
            { name: 'Ad Mediation Timeout & Zero-Jank Rendering', cardId: 'gametech-in-app-bidding-ad-mediation' },
            { name: 'Dynamic SKAN Privacy Sandbox Attribution', cardId: 'gametech-pltv-cohort-bidding-roas' },
          ],
        },
        {
          name: 'Game Economy & LiveOps Monetization',
          cardId: 'gametech-game-economy-sink-faucet',
          theme: 'pink',
          children: [
            { name: 'Macro-Economic Sinks & Faucets Equilibrium', cardId: 'gametech-game-economy-sink-faucet' },
            { name: 'LiveOps Hot-Reloading & Contextual Bandits', cardId: 'gametech-liveops-feature-flagging-ab' },
            { name: 'Dynamic Difficulty & Flow-State Engagement', cardId: 'gametech-dynamic-difficulty-pacing-dda' },
            { name: 'Seasonal Battle Pass & Whale Cohort Retention', cardId: 'gametech-game-economy-sink-faucet' },
          ],
        },
        {
          name: 'Multiplayer Netcode & Matchmaking',
          cardId: 'gametech-rollback-netcode-ggpo',
          theme: 'pink',
          children: [
            { name: 'Deterministic Rollback Netcode (GGPO)', cardId: 'gametech-rollback-netcode-ggpo' },
            { name: 'Bayesian Matchmaking (TrueSkill 2 & MMR)', cardId: 'gametech-player-matchmaking-rating-trueskill' },
            { name: 'Agones Kubernetes Game Server Orchestration', cardId: 'gametech-serverless-dedicated-orchestration' },
            { name: 'State Delta Compression & Latency Compensation', cardId: 'gametech-rollback-netcode-ggpo' },
          ],
        },
        {
          name: 'Core Engine, Graphics & Cloud Streaming',
          cardId: 'gametech-cross-platform-graphics-rendering',
          theme: 'pink',
          children: [
            { name: 'Vulkan/DX12 Bindless & Mesh Shaders', cardId: 'gametech-cross-platform-graphics-rendering' },
            { name: 'Wave Function Collapse (WFC) Level Gen', cardId: 'gametech-procedural-content-generation-wfc' },
            { name: 'Sub-16ms Cloud Gaming Video Streaming', cardId: 'gametech-cloud-gaming-video-streaming' },
            { name: 'Kernel-Level Anti-Cheat & Anomaly Detection', cardId: 'gametech-anti-cheat-memory-integrity' },
          ],
        },
      ],
    },
  },
  'production-ai-evals': {
    title: 'Diagram: Production AI Systems, Automated Prompt Compilers & High-Intent Evals',
    sectionId: 'production-ai-evals',
    tree: {
      name: 'Production AI & Evals Topology',
      theme: 'purple',
      cardId: 'production-ai-mipro-prompt-compilation',
      children: [
        {
          name: 'Prompt Compilers & Automated Optimization',
          cardId: 'production-ai-mipro-prompt-compilation',
          theme: 'purple',
          children: [
            { name: 'MIPROv2 & DSPy Bayesian Prompt Compilation', cardId: 'production-ai-mipro-prompt-compilation' },
            { name: 'Grammar-Constrained Decoding (FSM & Outlines)', cardId: 'production-ai-grammar-constrained-structured-decoding' },
            { name: 'KV Prefix Caching & Prompt Cache Engineering', cardId: 'production-ai-prefix-caching-semantic-vector-dedup' },
            { name: 'Long-Context NIAH Calibration & Attention Sinks', cardId: 'production-ai-needle-haystack-context-compression' },
          ],
        },
        {
          name: 'Deterministic Agents & Guardrail Defenses',
          cardId: 'production-ai-deterministic-agent-stategraphs',
          theme: 'purple',
          children: [
            { name: 'Deterministic Agentic StateGraphs & HTN Invariants', cardId: 'production-ai-deterministic-agent-stategraphs' },
            { name: 'Semantic Entropy & Hidden-State Hallucination Probes', cardId: 'production-ai-semantic-entropy-hallucination-probes' },
            { name: 'Indirect Prompt Injection Defense & Dual-LLM Firewall', cardId: 'production-ai-prompt-injection-dual-llm-firewall' },
            { name: 'Autonomous Coding Agents & SWE-Bench Trajectories', cardId: 'production-ai-swe-bench-autonomous-coding-agents' },
          ],
        },
        {
          name: 'Advanced RAG, Multimodal & Real-Time Voice',
          cardId: 'production-ai-corrective-crag-graph-rag',
          theme: 'purple',
          children: [
            { name: 'Corrective RAG (CRAG) & Knowledge Graph Traversal', cardId: 'production-ai-corrective-crag-graph-rag' },
            { name: 'Multimodal Vision-Language Grounding & Spatial Slicing', cardId: 'production-ai-multimodal-spatial-vlm-grounding' },
            { name: 'Sub-250ms Speech-to-Speech Streaming & Turn-Taking VAD', cardId: 'production-ai-speech-to-speech-webrtc-voice-agents' },
            { name: 'AI Token-Margin Metering & Prompt-as-a-Service Pricing', cardId: 'production-ai-token-margin-metering-monetization' },
          ],
        },
        {
          name: 'Inference Throughput, Quantization & Alignment',
          cardId: 'production-ai-vllm-paged-speculative-inference',
          theme: 'purple',
          children: [
            { name: 'vLLM PagedAttention & Speculative Decoding', cardId: 'production-ai-vllm-paged-speculative-inference' },
            { name: 'DPO, KTO & Synthetic Distillation Curricula', cardId: 'production-ai-dpo-kto-alignment-pipelines' },
            { name: 'LLM-as-a-Judge Bias Calibration & Arena-Hard Elo', cardId: 'production-ai-llm-judge-elo-calibration' },
            { name: 'BitNet 1.58-bit MatMul-Free Kernels & Edge Reasoning', cardId: 'production-ai-1bit-quantization-edge-reasoning' },
          ],
        },
      ],
    },
  },
  'gamification-monetization': {
    title: 'Diagram: Behavioral Gamification, SaaS KPIs & High-Profitability Monetization Economics',
    sectionId: 'gamification-monetization',
    tree: {
      name: 'Gamification Economics & Monetization Flywheel',
      theme: 'mint',
      cardId: 'gamification-saas-kpi-unit-economics',
        children: [
          {
            name: 'SaaS Economics & Core Unit Financials',
            cardId: 'gamification-saas-kpi-unit-economics',
            theme: 'mint',
            children: [
              { name: '15 SaaS Financial KPIs & Unit Economics Architecture', cardId: 'gamification-saas-kpi-unit-economics' },
              { name: 'Endowed Progress Effect & Onboarding Activation', cardId: 'gamification-endowed-progress-activation' },
              { name: 'Enterprise Gamification & B2B Learning (27.4% CAGR)', cardId: 'gamification-enterprise-learning-cagr' },
              { name: 'Visual Gamification Advantages & Zero-Party Intent Data', cardId: 'gamification-visual-advantages-zero-party-intent' },
            ],
          },
          {
            name: 'Behavioral Economics & User Motivation',
            cardId: 'gamification-marczewski-user-types-monetization',
            theme: 'mint',
            children: [
              { name: 'Marczewski User Types & Segmented ARPU Maximization', cardId: 'gamification-marczewski-user-types-monetization' },
              { name: 'Operant Conditioning & Skinner Variable Ratio Loops', cardId: 'gamification-operant-conditioning-variable-ratio' },
              { name: 'Prospect Theory, Loss Aversion & Streak Preservation', cardId: 'gamification-prospect-theory-loss-aversion-streaks' },
              { name: 'Csikszentmihalyi Flow State Optimization & Session Yield', cardId: 'gamification-flow-state-session-yield' },
            ],
          },
          {
            name: '12 Business Game Mechanics & Retention Loops',
            cardId: 'gamification-12-business-game-mechanics',
            theme: 'mint',
            children: [
              { name: '12 Proven Business Game Mechanics & Conversion Flywheels', cardId: 'gamification-12-business-game-mechanics' },
              { name: 'The Hooked Flywheel & Viral Loop (K-Factor) Mechanics', cardId: 'gamification-hooked-viral-k-factor-loops' },
              { name: 'Hyperbolic Discounting & Instant Gratification Paywalls', cardId: 'gamification-hyperbolic-discounting-instant-gratification' },
              { name: 'Zeigarnik Effect & Open-Loop Retention Engine', cardId: 'gamification-zeigarnik-open-loop-retention' },
            ],
          },
          {
            name: 'Monetization Models & VIP Yield Architecture',
            cardId: 'gamification-tiered-battle-pass-subscription-economics',
            theme: 'mint',
            children: [
              { name: 'Dynamic Price Discrimination & Tiered Battle Pass Models', cardId: 'gamification-tiered-battle-pass-subscription-economics' },
              { name: 'Commercial Gamification (Fintech, E-commerce, B2B SaaS)', cardId: 'gamification-commercial-fintech-ecommerce' },
              { name: 'Structural Gamification: Psychological Mediators to EBITDA', cardId: 'gamification-structural-mediators-to-ebitda' },
              { name: 'Whale Monetization, Pareto Distribution & VIP Yield', cardId: 'gamification-whale-monetization-pareto-yield' },
            ],
          },
        ],
      },
    },
  'ai-app-solutions': {
    title: 'Diagram: AI Web Application Solutions, Startup Architecture & Market Volatility Edge Cases',
    sectionId: 'ai-app-solutions',
    tree: {
      name: 'AI Web Apps, Startup Verticals & Market Regimes',
      theme: 'cyan',
      cardId: 'ai-app-builders-streaming-rsc',
      children: [
        {
          name: 'Full-Stack AI Coding Foundations (2026 Playbook)',
          cardId: 'ai-app-builders-streaming-rsc',
          theme: 'cyan',
          children: [
            { name: 'AI App Builders & Next.js Streaming RSC', cardId: 'ai-app-builders-streaming-rsc' },
            { name: 'No-Code Backends & Edge Micro-Databases', cardId: 'ai-nocode-backends-edge-db' },
            { name: 'Prompt-to-Product & UI Schema Compilers', cardId: 'ai-prompt-to-product-schema-compilers' },
            { name: 'Workflow Automation & Micro-Orchestrators', cardId: 'ai-workflow-automation-orchestrators' },
            { name: 'Design Systems & Dynamic Generative UI', cardId: 'ai-design-systems-generative-landing-pages' },
            { name: 'Payments, Metering & Token Margin Billing', cardId: 'ai-payments-metering-token-margin' },
            { name: 'Deployment, Edge Serverless & DoW Defense', cardId: 'ai-deployment-edge-serverless-dow' },
          ],
        },
        {
          name: 'Enterprise Operations, Sales & CRM AI',
          cardId: 'ai-sales-lead-scoring-opportunity-qualification',
          theme: 'cyan',
          children: [
            { name: 'Autonomous Sales Lead Scoring & Qualification', cardId: 'ai-sales-lead-scoring-opportunity-qualification' },
            { name: 'Deal Win-Loss Prediction & Pipeline Risk', cardId: 'ai-deal-win-loss-prediction-pipeline-risk' },
            { name: '24/7 Agentic Support & Ticket Routing', cardId: 'ai-agentic-support-ticket-routing' },
            { name: 'Ticket Categorization & Sentiment Drift', cardId: 'ai-ticket-categorization-sentiment-drift' },
            { name: 'Robotic Process Automation & Vision Agents', cardId: 'ai-rpa-vision-language-agents' },
            { name: 'Predictive Maintenance & IoT Sensor Streams', cardId: 'ai-predictive-maintenance-iot-sensor-streams' },
          ],
        },
        {
          name: 'Financial AI, Forecasting & Capital Protection',
          cardId: 'ai-financial-data-analysis-ledger-reconciliation',
          theme: 'cyan',
          children: [
            { name: 'Autonomous Financial Analysis & Reconciliation', cardId: 'ai-financial-data-analysis-ledger-reconciliation' },
            { name: 'Budget Forecasting & Cash Flow Projections', cardId: 'ai-budget-forecasting-cash-flow' },
            { name: 'Financial Risk Assessment & Value-at-Risk (VaR)', cardId: 'ai-financial-risk-assessment-var' },
            { name: 'Real-Time Fraud Detection & Graph Probing', cardId: 'ai-fraud-detection-graph-anomaly' },
            { name: 'Macro Market Indicators & Monetary Policy', cardId: 'ai-macroeconomic-indicators-monetary-policy' },
            { name: 'Token Pricing Elasticity & Margin Preservation', cardId: 'ai-token-pricing-elasticity-margin-hedging' },
          ],
        },
        {
          name: 'High-Yield Startup Industry Verticals',
          cardId: 'ai-recruitment-talent-screening-bias-parity',
          theme: 'cyan',
          children: [
            { name: 'AI Recruitment & Talent Screening Bias Parity', cardId: 'ai-recruitment-talent-screening-bias-parity' },
            { name: 'Healthcare Telehealth & Clinical Decision Systems', cardId: 'ai-healthcare-telehealth-clinical-decision' },
            { name: 'Logistics & Supply Chain Bullwhip Mitigation', cardId: 'ai-logistics-supply-chain-inventory-optimization' },
            { name: 'Online Retail Assistants & Cold-Start Recommenders', cardId: 'ai-retail-shopping-assistants-cold-start' },
            { name: 'Smart Home IoT Edge Mesh & Local Ingress', cardId: 'ai-smart-home-edge-mesh-iot' },
            { name: 'Energy Grid Optimization & Carbon-Aware Compute', cardId: 'ai-energy-grid-optimization-carbon-aware' },
          ],
        },
        {
          name: 'Multimodal Media, Audio & Creative Pipelines',
          cardId: 'ai-video-generation-diffusion-temporal-consistency',
          theme: 'cyan',
          children: [
            { name: 'Synthetic Video & Temporal Consistency', cardId: 'ai-video-generation-diffusion-temporal-consistency' },
            { name: 'Neural Audio Synthesis & Voice Cloning Coherence', cardId: 'ai-neural-audio-synthesis-voice-cloning' },
            { name: 'Generative UI/UX & Accessible Component Design', cardId: 'ai-generative-ui-ux-design-accessibility' },
            { name: 'Synthetic Media Provenance & Watermarking', cardId: 'ai-synthetic-media-provenance-watermarking' },
            { name: 'Interactive Entertainment & Dynamic Game NPCs', cardId: 'ai-entertainment-virtual-reality-dynamic-npcs' },
          ],
        },
        {
          name: 'Cybersecurity, Regulation & Macro Resilience',
          cardId: 'ai-cybersecurity-threat-surface-mapping',
          theme: 'cyan',
          children: [
            { name: 'AI Cybersecurity & Automated Threat Surface Mapping', cardId: 'ai-cybersecurity-threat-surface-mapping' },
            { name: 'Adversarial Jailbreak Firewalls & Prompt Defenses', cardId: 'ai-adversarial-jailbreak-firewalls' },
            { name: 'EU AI Act Compliance & Risk-Tiered Audit Ledgers', cardId: 'ai-eu-ai-act-compliance-audit-ledgers' },
            { name: 'Compute Supply-Demand Elasticity & GPU Hedging', cardId: 'ai-compute-supply-demand-gpu-hedging' },
            { name: 'Geopolitical Shocks & Semiconductor Resilience', cardId: 'ai-geopolitical-semiconductor-shocks' },
            { name: 'Fail-Safe Circuit Breakers & Agent Panic Stops', cardId: 'ai-fail-safe-circuit-breakers-panic-stops' },
          ],
        },
      ],
    },
  },
  ...(['b2b', 'b2c', 'd2c', 'c2c', 'c2b', 'b2g'] as const).reduce((acc, code) => {
    const metaMap = {
      b2b: { sectionId: 'b2b-ecommerce' as SectionId, label: 'B2B (Business-to-Business)', theme: 'amber' as const },
      b2c: { sectionId: 'b2c-ecommerce' as SectionId, label: 'B2C (Business-to-Consumer)', theme: 'mint' as const },
      d2c: { sectionId: 'd2c-ecommerce' as SectionId, label: 'D2C (Direct-to-Consumer)', theme: 'purple' as const },
      c2c: { sectionId: 'c2c-ecommerce' as SectionId, label: 'C2C (Consumer-to-Consumer)', theme: 'cyan' as const },
      c2b: { sectionId: 'c2b-ecommerce' as SectionId, label: 'C2B (Consumer-to-Business)', theme: 'mint' as const },
      b2g: { sectionId: 'b2g-ecommerce' as SectionId, label: 'B2G (Business-to-Government)', theme: 'bronze' as const },
    }[code];
    const upper = code.toUpperCase();
    acc[metaMap.sectionId] = {
      title: `Diagram: ${metaMap.label} — 4-Pillar Solo Entrepreneurship & Prompt Automation Model (32 Nodes)`,
      sectionId: metaMap.sectionId,
      tree: {
        name: `${metaMap.label} Solo Prompt & Automation Model`,
        theme: metaMap.theme,
        cardId: `${code}-data-autonomous-master-orchestrator`,
        children: [
          {
            name: '1. Manufacture & Production Automation (8 Mechanics)',
            theme: metaMap.theme,
            cardId: `${code}-manufacture-package`,
            children: [
              { name: `${upper} Package & Digital Asset Bundling`, cardId: `${code}-manufacture-package`, theme: metaMap.theme },
              { name: `${upper} Raw Material & Prompt Corpus Sourcing`, cardId: `${code}-manufacture-raw-material`, theme: metaMap.theme },
              { name: `${upper} Storage of Goods & Artifact Warehousing`, cardId: `${code}-manufacture-storage-of-goods`, theme: metaMap.theme },
              { name: `${upper} Production Planning & Capacity Scheduling`, cardId: `${code}-manufacture-production-planning`, theme: metaMap.theme },
              { name: `${upper} Making: Autonomous Product Synthesis`, cardId: `${code}-manufacture-making`, theme: metaMap.theme },
              { name: `${upper} Logistics & Supply Chain Routing`, cardId: `${code}-manufacture-logistics`, theme: metaMap.theme },
              { name: `${upper} Quality Assurance & Eval Gates`, cardId: `${code}-manufacture-qa-eval-gates`, theme: metaMap.theme },
              { name: `${upper} BOM & Token Unit-Cost Compression`, cardId: `${code}-manufacture-bom-cost-optimization`, theme: metaMap.theme },
            ],
          },
          {
            name: '2. Attracting Clients & Acquisition (8 Mechanics)',
            theme: metaMap.theme,
            cardId: `${code}-attracting-content-marketing`,
            children: [
              { name: `${upper} Content Marketing Authority Engine`, cardId: `${code}-attracting-content-marketing`, theme: metaMap.theme },
              { name: `${upper} Remarketing & Behavioral Win-Back`, cardId: `${code}-attracting-remarketing`, theme: metaMap.theme },
              { name: `${upper} Contextual Advertising & Ad Synthesis`, cardId: `${code}-attracting-contextual-advertising`, theme: metaMap.theme },
              { name: `${upper} SEO Programmatic Knowledge Clusters`, cardId: `${code}-attracting-seo`, theme: metaMap.theme },
              { name: `${upper} Social Networks Viral Hook Agents`, cardId: `${code}-attracting-social-networks`, theme: metaMap.theme },
              { name: `${upper} PR Articles & Earned Media Engine`, cardId: `${code}-attracting-pr-articles`, theme: metaMap.theme },
              { name: `${upper} Online Shops Headless Merchandising`, cardId: `${code}-attracting-online-shops`, theme: metaMap.theme },
              { name: `${upper} Viral Referral & Affiliate Loops`, cardId: `${code}-attracting-viral-referral-loops`, theme: metaMap.theme },
            ],
          },
          {
            name: '3. Order Processing, Fulfillment & CRM (8 Mechanics)',
            theme: metaMap.theme,
            cardId: `${code}-order-call-center`,
            children: [
              { name: `${upper} Call Center: 24/7 Voice AI Agents`, cardId: `${code}-order-call-center`, theme: metaMap.theme },
              { name: `${upper} Delivery & Instant Webhook Provisioning`, cardId: `${code}-order-delivery`, theme: metaMap.theme },
              { name: `${upper} Warehouse Accounting & Ledger Sync`, cardId: `${code}-order-warehouse-accounting`, theme: metaMap.theme },
              { name: `${upper} Payment Services & Usage Metering`, cardId: `${code}-order-payment-services`, theme: metaMap.theme },
              { name: `${upper} Order Processing Saga State Machine`, cardId: `${code}-order-processing-core`, theme: metaMap.theme },
              { name: `${upper} Orders Refund & Save-the-Sale RMA`, cardId: `${code}-order-refund`, theme: metaMap.theme },
              { name: `${upper} CRM: Agentic Memory & Lead Scoring`, cardId: `${code}-order-crm`, theme: metaMap.theme },
              { name: `${upper} Subscription Dunning & Churn Recovery`, cardId: `${code}-order-subscription-dunning`, theme: metaMap.theme },
            ],
          },
          {
            name: '4. Data Manipulation & Analytics (8 Mechanics)',
            theme: metaMap.theme,
            cardId: `${code}-data-buying-third-party`,
            children: [
              { name: `${upper} Buying Third-Party Data & Enrichment`, cardId: `${code}-data-buying-third-party`, theme: metaMap.theme },
              { name: `${upper} Data Storage: Lakehouse & Vector DB`, cardId: `${code}-data-storage`, theme: metaMap.theme },
              { name: `${upper} Analysis: Cohort & Shapley Attribution`, cardId: `${code}-data-analysis`, theme: metaMap.theme },
              { name: `${upper} Planning: Monte Carlo Capital Allocation`, cardId: `${code}-data-planning`, theme: metaMap.theme },
              { name: `${upper} Data Management: ETL & PII Scrubbing`, cardId: `${code}-data-management`, theme: metaMap.theme },
              { name: `${upper} Reports: Executive P&L Telemetry`, cardId: `${code}-data-reports`, theme: metaMap.theme },
              { name: `${upper} Predictive pLTV & Dynamic Pricing`, cardId: `${code}-data-predictive-ltv-pricing`, theme: metaMap.theme },
              { name: `${upper} Master Node: Closed-Loop Autopilot`, cardId: `${code}-data-autonomous-master-orchestrator`, theme: metaMap.theme },
            ],
          },
        ],
      },
    };
    return acc;
  }, {} as Record<string, { title: string; sectionId: SectionId; tree: TaxonomyNode }>),
};

interface TaxonomyMindMapProps {
  onSelectCard: (cardId: string) => void;
  currentSection: SectionId;
}

export function TaxonomyMindMap({ onSelectCard, currentSection }: TaxonomyMindMapProps) {
  const [selectedTreeKey, setSelectedTreeKey] = useState<string>(() => {
    if (currentSection !== 'all' && TAXONOMY_TREES[currentSection]) {
      return currentSection;
    }
    return 'ai-roadmap';
  });

  const activeTreeData = TAXONOMY_TREES[selectedTreeKey] || TAXONOMY_TREES['ai-roadmap'];

  const renderTreeNode = (node: TaxonomyNode, depth = 0, index = 0, parentKey = 'root') => {
    const hasChildren = node.children && node.children.length > 0;
    const isLeaf = !hasChildren;
    const currentKey = `${parentKey}-${depth}-${index}-${node.name}`;

    return (
      <div key={currentKey} className="relative pl-6 pt-3 group">
        {/* Tron branch connecting line */}
        <div className="absolute left-2.5 top-0 bottom-0 w-px bg-cyan-500/20 group-hover:bg-cyan-400/50 transition-colors" />
        <div className="absolute left-2.5 top-6 w-3.5 h-px bg-cyan-500/30 group-hover:bg-cyan-400/70 transition-colors" />

        {/* Node Box */}
        <div className="inline-flex items-center gap-2">
          {node.cardId ? (
            <button
              type="button"
              onClick={() => onSelectCard(node.cardId!)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0b1222] border border-cyan-500/30 hover:border-cyan-400 text-left hover:bg-cyan-950/40 hover:shadow-[0_0_15px_rgba(103,232,249,0.2)] transition-all group/btn touch-manipulation cursor-pointer"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-semibold text-slate-100 group-hover/btn:text-cyan-200">
                {node.name}
              </span>
              <ExternalLink className="w-3 h-3 text-cyan-400/70 group-hover/btn:text-cyan-300" />
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
              <span>{node.name}</span>
            </div>
          )}
        </div>

        {/* Recursive Children */}
        {hasChildren && (
          <div className="space-y-1">
            {node.children!.map((child, idx) => renderTreeNode(child, depth + 1, idx, currentKey))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-xl bg-[#090e1a]/95 border border-cyan-500/30 p-5 shadow-[0_0_25px_rgba(103,232,249,0.08)]">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-cyan-300" />
            <h2 className="text-base sm:text-lg font-bold text-slate-100">
              Interactive Taxonomy Mind Map
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Hierarchical tree visualizer reflecting the original 5 reference diagrams. Click any node to inspect.
          </p>
        </div>

        {/* Tree Selector Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {Object.entries(TAXONOMY_TREES).map(([key, data]) => {
            const isSelected = key === selectedTreeKey;
            return (
              <button
                type="button"
                key={key}
                onClick={() => setSelectedTreeKey(key)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all touch-manipulation cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-950 text-cyan-200 border border-cyan-400/50 shadow-[0_0_10px_rgba(103,232,249,0.2)]'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {key.replace('-', ' ').toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mind map canvas */}
      <div className="mt-4 p-4 rounded-lg bg-[#060a14] border border-cyan-500/20 overflow-x-auto min-h-[400px]">
        <div className="text-[11px] font-mono text-cyan-400/80 uppercase tracking-wider mb-2">
          {activeTreeData.title}
        </div>
        <div className="pt-2">
          {renderTreeNode(activeTreeData.tree)}
        </div>
      </div>
    </div>
  );
}
