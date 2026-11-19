export interface JargonDefinition {
  term: string;
  definition: string;
  source: string;
}

/**
 * A comprehensive collection of expert terms typically not found in a standard thesaurus.
 * Unified from military, cyber, engineering, and growth domains.
 */
export const NON_THESAURUS_DICTIONARY: Record<string, JargonDefinition> = {
  // --- Military & Clandestine ---
  v2s: {
    term: 'V2S',
    definition: 'Voice-to-Skull: A neuro-auditory technology using the Frey effect to transmit acoustic messages directly into the human skull via modulated radio frequencies.',
    source: 'DoD Bio-Electromagnetic Research'
  },
  kinetic: {
    term: 'Kinetic',
    definition: 'In military context, refers to active warfare involving lethal force, as opposed to cyber or information warfare.',
    source: 'Military Terminology'
  },
  clandestine: {
    term: 'Clandestine',
    definition: 'Operational activities kept secret or hidden, especially for military or intelligence purposes.',
    source: 'Intelligence Community'
  },
  asymmetric: {
    term: 'Asymmetric',
    definition: 'Warfare between parties of significantly different military power or strategy, often involving unconventional tactics.',
    source: 'Military Doctrine'
  },
  sigint: {
    term: 'SIGINT',
    definition: 'Signals Intelligence: Intelligence derived from electronic signals and systems.',
    source: 'NSA'
  },
  cyberops: {
    term: 'CYBEROPS',
    definition: 'Cyberspace Operations: The employment of cyberspace capabilities where the primary purpose is to achieve objectives in or through cyberspace.',
    source: 'US Cyber Command'
  },
  neutralize: {
    term: 'Neutralize',
    definition: 'To render an enemy force, person, or piece of equipment incapable of interfering with a particular operation.',
    source: 'Military Operations'
  },
  contested: {
    term: 'Contested',
    definition: 'An operational environment where an adversary has the capability to challenge or deny freedom of action.',
    source: 'DoD Strategy'
  },
  interception: {
    term: 'Interception',
    definition: 'The act of seizing, redirecting, or listening to communications or physical assets in transit.',
    source: 'Intelligence Community'
  },
  payload: {
    term: 'Payload',
    definition: 'The specialized software or data carried by a delivery mechanism (like a malware dropper or a missile) to achieve a specific effect.',
    source: 'Cyber/Mil Engineering'
  },
  infiltration: {
    term: 'Infiltration',
    definition: 'The process by which personnel or software secretly enter a territory or system to gather intelligence or perform sabotage.',
    source: 'Tactical Operations'
  },
  subversion: {
    term: 'Subversion',
    definition: 'Systematic attempts to undermine a government or organization by working from within.',
    source: 'Intelligence Community'
  },
  sabotage: {
    term: 'Sabotage',
    definition: 'Deliberate action aimed at weakening an entity through subversion, obstruction, or destruction.',
    source: 'Tactical Operations'
  },
  offensive: {
    term: 'Offensive',
    definition: 'Active operations designed to seize initiative and force a particular outcome on an adversary.',
    source: 'Military Doctrine'
  },
  attrition: {
    term: 'Attrition',
    definition: 'The process of gradually reducing the strength or effectiveness of an adversary through sustained attack or pressure.',
    source: 'Military Strategy'
  },
  ballistic: {
    term: 'Ballistic',
    definition: 'Refers to projectiles that are unpowered and unguided during their flight, following a trajectory determined by physics.',
    source: 'Aero-Ballistics'
  },
  'electronic warfare': {
    term: 'Electronic Warfare',
    definition: 'Military action involving the use of electromagnetic and directed energy to control the electromagnetic spectrum.',
    source: 'Joint Publication 3-13.1'
  },
  'directed energy': {
    term: 'Directed Energy',
    definition: 'Systems that produce a beam of concentrated electromagnetic energy or atomic/subatomic particles.',
    source: 'DoD Research'
  },
  stealth: {
    term: 'Stealth',
    definition: 'Technologies and tactics designed to make personnel or equipment less visible to radar, infrared, and other detection methods.',
    source: 'Aerospace Engineering'
  },
  covert: {
    term: 'Covert',
    definition: 'Operations planned and executed to conceal the identity of or permit plausible denial by the sponsor.',
    source: 'Intelligence Community'
  },
  espionage: {
    term: 'Espionage',
    definition: 'The practice of spying or using spies, typically by governments, to obtain political and military information.',
    source: 'Intelligence Community'
  },
  warfare: {
    term: 'Warfare',
    definition: 'Engagement in or the activities of maintaining a state of war or conflict.',
    source: 'Defense Studies'
  },
  adversary: {
    term: 'Adversary',
    definition: 'A person, group, or force that opposes or attacks; an opponent.',
    source: 'Tactical Analysis'
  },
  threat: {
    term: 'Threat',
    definition: 'Any circumstance or event with the potential to adversely impact organizational operations or assets.',
    source: 'Risk Management'
  },
  protocol: {
    term: 'Protocol',
    definition: 'A standard set of rules that allow electronic devices to communicate with each other.',
    source: 'Network Engineering'
  },
  intelligence: {
    term: 'Intelligence',
    definition: 'Information that is gathered and analyzed to provide a strategic or tactical advantage.',
    source: 'IC Standards'
  },
  directive: {
    term: 'Directive',
    definition: 'An authoritative instruction or order issued by a commander or executive body.',
    source: 'Governance'
  },
  invariants: {
    term: 'Invariants',
    definition: 'Conditions or properties that remain unchanged throughout the execution of a system or algorithm.',
    source: 'Formal Verification'
  },
  sovereign: {
    term: 'Sovereign',
    definition: 'Possessing supreme or independent authority; in cloud context, refers to data residency and legal jurisdiction control.',
    source: 'International Law/Cloud'
  },
  classified: {
    term: 'Classified',
    definition: 'Information or material that requires protection in the interest of national security.',
    source: 'DoD Security'
  },

  // --- IT, Engineering & SaaS ---
  it: {
    term: 'IT',
    definition: 'Information Technology: The study or use of systems (especially computers and telecommunications) for storing, retrieving, and sending information.',
    source: 'Industry Standard'
  },
  cloud: {
    term: 'Cloud',
    definition: 'On-demand availability of computer system resources, especially data storage and computing power, without direct active management by the user.',
    source: 'Cloud Computing'
  },
  saas: {
    term: 'SaaS',
    definition: 'Software as a Service: A software distribution model in which a third-party provider hosts applications and makes them available to customers over the internet.',
    source: 'Cloud Distribution'
  },
  api: {
    term: 'API',
    definition: 'Application Programming Interface: A set of functions and procedures allowing the creation of applications that access the features or data of an operating system, application, or other service.',
    source: 'Software Development'
  },
  dns: {
    term: 'DNS',
    definition: 'Domain Name System: The phonebook of the Internet, translating human-friendly domain names to IP addresses.',
    source: 'Network Infrastructure'
  },
  https: {
    term: 'HTTPS',
    definition: 'Hypertext Transfer Protocol Secure: An extension of HTTP used for secure communication over a computer network.',
    source: 'Web Security'
  },
  oauth: {
    term: 'OAuth',
    definition: 'An open standard for access delegation, commonly used as a way for internet users to grant websites or applications access to their information on other websites.',
    source: 'Auth Standards'
  },
  b2b: {
    term: 'B2B',
    definition: 'Business to Business: A form of transaction between businesses, such as one involving a manufacturer and wholesaler.',
    source: 'Business Models'
  },
  dtc: {
    term: 'DTC',
    definition: 'Direct to Consumer: A business model where companies sell their products directly to the end customer, bypassing third-party retailers.',
    source: 'E-commerce'
  },
  roi: {
    term: 'ROI',
    definition: 'Return on Investment: A performance measure used to evaluate the efficiency or profitability of an investment.',
    source: 'Finance'
  },
  cac: {
    term: 'CAC',
    definition: 'Customer Acquisition Cost: The cost related to convincing a customer to buy a product or service.',
    source: 'Growth Metrics'
  },
  ltv: {
    term: 'LTV',
    definition: 'Lifetime Value: The total revenue a customer will generate for your business over their entire relationship.',
    source: 'SaaS Metrics'
  },
  ebitda: {
    term: 'EBITDA',
    definition: 'Earnings Before Interest, Taxes, Depreciation, and Amortization: A measure of a company\'s overall financial performance.',
    source: 'Finance'
  },
  crm: {
    term: 'CRM',
    definition: 'Customer Relationship Management: Technology for managing all your company\'s relationships and interactions with customers and potential customers.',
    source: 'Enterprise Software'
  },
  erp: {
    term: 'ERP',
    definition: 'Enterprise Resource Planning: Software used by organizations to manage day-to-day business activities.',
    source: 'Enterprise Software'
  },
  gpu: {
    term: 'GPU',
    definition: 'Graphics Processing Unit: A parallel processor optimized for high-throughput computations.',
    source: 'Hardware'
  },
  cpu: {
    term: 'CPU',
    definition: 'Central Processing Unit: The primary component of a computer that acts as its "control center."',
    source: 'Hardware'
  },
  ram: {
    term: 'RAM',
    definition: 'Random Access Memory: High-speed, short-term data storage that your computer uses to store information it needs right now.',
    source: 'Hardware'
  },
  llm: {
    term: 'LLM',
    definition: 'Large Language Model: Deep learning models trained on vast amounts of text data to generate human-like language.',
    source: 'AI/ML'
  },
  nlp: {
    term: 'NLP',
    definition: 'Natural Language Processing: The branch of AI that deals with the interaction between computers and human language.',
    source: 'AI/ML'
  },
  mlops: {
    term: 'MLOps',
    definition: 'Machine Learning Operations: A set of practices that aims to deploy and maintain machine learning models in production reliably and efficiently.',
    source: 'Data Engineering'
  },
  'vector db': {
    term: 'Vector DB',
    definition: 'A database designed to store and query high-dimensional vector embeddings, crucial for RAG and LLM applications.',
    source: 'AI Infrastructure'
  },
  latency: {
    term: 'Latency',
    definition: 'The time delay between a cause and the effect of some physical change in the system being observed.',
    source: 'Systems Performance'
  },
  throughput: {
    term: 'Throughput',
    definition: 'The rate at which a system generates its products per unit of time.',
    source: 'Systems Engineering'
  },
  availability: {
    term: 'Availability',
    definition: 'The percentage of time that a system is functional and accessible.',
    source: 'Reliability Engineering'
  },
  scalability: {
    term: 'Scalability',
    definition: 'The property of a system to handle a growing amount of work by adding resources.',
    source: 'Architectural Systems'
  },
  microservices: {
    term: 'Microservices',
    definition: 'An architectural style that structures an application as a collection of small autonomous services.',
    source: 'Software Architecture'
  },
  kubernetes: {
    term: 'Kubernetes',
    definition: 'An open-source container orchestration system for automating software deployment, scaling, and management.',
    source: 'Cloud Native'
  },
  docker: {
    term: 'Docker',
    definition: 'A set of platform-as-a-service products that use OS-level virtualization to deliver software in packages called containers.',
    source: 'Infrastructure'
  },
  devops: {
    term: 'DevOps',
    definition: 'A set of practices that combines software development and IT operations.',
    source: 'Engineering Culture'
  },
  agile: {
    term: 'Agile',
    definition: 'A methodology that anticipates the need for flexibility and applies a level of pragmatism into the delivery of the finished product.',
    source: 'Project Management'
  },
  scrum: {
    term: 'Scrum',
    definition: 'An agile framework for managing complex knowledge work, with an initial emphasis on software development.',
    source: 'Project Management'
  },
  retention: {
    term: 'Retention',
    definition: 'The ability of a company or product to retain its customers over some specified period.',
    source: 'Growth Engineering'
  },
  churn: {
    term: 'Churn',
    definition: 'The rate at which customers stop doing business with an entity.',
    source: 'Business Metrics'
  },
  ecom: {
    term: 'Ecom',
    definition: 'E-commerce: The buying and selling of goods and services, or the transmitting of funds or data, over an electronic network.',
    source: 'Industry Standard'
  },
  shopify: {
    term: 'Shopify',
    definition: 'A leading e-commerce platform that allows anyone to set up an online store and sell their products.',
    source: 'Platform'
  },
  upsell: {
    term: 'Upsell',
    definition: 'A sales technique where a seller encourages a customer to purchase more expensive, premium, or upgraded items.',
    source: 'Sales Strategy'
  },
  conversion: {
    term: 'Conversion',
    definition: 'The point at which a recipient of a marketing message performs a desired action.',
    source: 'Marketing Analytics'
  },
  monetization: {
    term: 'Monetization',
    definition: 'The process of converting an asset or service into money or a revenue stream.',
    source: 'Business Strategy'
  },
  algorithm: {
    term: 'Algorithm',
    definition: 'A process or set of rules to be followed in calculations or other problem-solving operations, especially by a computer.',
    source: 'Computer Science'
  },
  deterministic: {
    term: 'Deterministic',
    definition: 'A system in which no randomness is involved in the development of future states of the system.',
    source: 'Mathematical Logic'
  },
  quantized: {
    term: 'Quantized',
    definition: 'The process of approximating a continuous range of values by a relatively small set of discrete symbols.',
    source: 'Signal Processing/AI'
  },
  inference: {
    term: 'Inference',
    definition: 'The process of using a trained machine learning model to make predictions on new data.',
    source: 'AI/ML'
  },
  tensors: {
    term: 'Tensors',
    definition: 'Multidimensional arrays used in machine learning to represent data and weights.',
    source: 'Linear Algebra'
  },
  bayesian: {
    term: 'Bayesian',
    definition: 'A method of statistical inference in which Bayes\' theorem is used to update the probability for a hypothesis.',
    source: 'Probability Theory'
  },
  stochastic: {
    term: 'Stochastic',
    definition: 'Refers to a process involving a randomly determined sequence of observations.',
    source: 'Statistics'
  },
  calculus: {
    term: 'Calculus',
    definition: 'The mathematical study of continuous change.',
    source: 'Mathematics'
  },
  formalism: {
    term: 'Formalism',
    definition: 'A rigorous mathematical description of a system or language.',
    source: 'Formal Logic'
  },

  // --- Original Jargon ---
  jadc2: {
    term: 'JADC2',
    definition: 'Joint All-Domain Command and Control: The DoD’s concept to connect sensors from all military services into a single network.',
    source: 'DoD Strategy'
  },
  cmmc: {
    term: 'CMMC',
    definition: 'Cybersecurity Maturity Model Certification: A framework designed to assess and enhance the cybersecurity posture of the Defense Industrial Base.',
    source: 'DoD CIO'
  },
  masint: {
    term: 'MASINT',
    definition: 'Measurement and Signature Intelligence: Scientific and technical intelligence information obtained by quantitative and qualitative analysis of data.',
    source: 'DIA'
  },
  elint: {
    term: 'ELINT',
    definition: 'Electronic Intelligence: Intelligence gathered by monitoring electronic signals, primarily from non-communication systems like radar.',
    source: 'Military Intelligence'
  },
  pltv: {
    term: 'pLTV',
    definition: 'Predictive Lifetime Value: A metric that uses machine learning to forecast the total revenue a customer will generate over their entire relationship with a product.',
    source: 'Growth Engineering'
  },
  'ltv:cac': {
    term: 'LTV:CAC',
    definition: 'Ratio of Lifetime Value to Customer Acquisition Cost: A core unit economics metric for SaaS profitability.',
    source: 'Venture Capital Standards'
  },
  'zero-trust': {
    term: 'Zero-Trust',
    definition: 'A security framework requiring all users, whether in or outside the organization’s network, to be authenticated and authorized.',
    source: 'NIST 800-207'
  },
  'air-gapped': {
    term: 'Air-Gapped',
    definition: 'A network security measure that ensures a computer network is physically isolated from unsecured networks, such as the public internet.',
    source: 'Information Security'
  },
  'vibe-coding': {
    term: 'Vibe Coding',
    definition: 'A high-velocity software development style prioritized by "Antigravity" agents, focusing on intent-driven generation over manual syntax.',
    source: 'Generic Internal'
  },
  'fan-out': {
    term: 'Fan-Out',
    definition: 'In distributed systems, the process of sending a single request to multiple downstream services simultaneously to gather a complete response.',
    source: 'Distributed Systems'
  },
  'back-pressure': {
    term: 'Back-Pressure',
    definition: 'A mechanism in stream processing where a downstream consumer signals the upstream producer to slow down to prevent data overflow.',
    source: 'Reactive Systems'
  },
  'c4isr': {
    term: 'C4ISR',
    definition: 'Command, Control, Communications, Computers, Intelligence, Surveillance, and Reconnaissance: A framework for military operations and situational awareness.',
    source: 'DoD Joint Doctrine'
  },
  humint: {
    term: 'HUMINT',
    definition: 'Human Intelligence: Information gathered through interpersonal contact, as opposed to technical means like SIGINT or ELINT.',
    source: 'CIA/DIA'
  },
  osint: {
    term: 'OSINT',
    definition: 'Open Source Intelligence: Data collected from publicly available sources to be used in an intelligence context.',
    source: 'IC Standards'
  },
  'acat-i': {
    term: 'ACAT I',
    definition: 'Acquisition Category I: The highest level of defense acquisition programs, typically involving major defense systems with high funding thresholds.',
    source: 'DoD 5000.02'
  },
  'zero-day': {
    term: 'Zero-Day',
    definition: 'A vulnerability in software that is unknown to those who should be interested in mitigating it, giving them zero days to fix it before an exploit occurs.',
    source: 'Cybersecurity'
  }
};
