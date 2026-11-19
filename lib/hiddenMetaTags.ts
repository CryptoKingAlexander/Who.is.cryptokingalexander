/**
 * 50+ Hidden Meta Tags for each topic node
 * Target audiences: Consumer AI Builders, Startup Founders, Indie Hackers,
 * Enterprise Architects, Quant Traders, Growth Marketers, and ML Engineers.
 */

// Base user story tag pools across major architectural domains
const AGENT_AND_BUILDER_STORY_TAGS = [
  'how-to-monetize-ai-agents',
  'build-profitable-ai-saas',
  'indie-hacker-revenue-stream',
  'automate-client-deliverables',
  'replace-manual-labor-with-code',
  'high-gross-margin-software',
  'stripe-billing-ai-agent-integration',
  'freelance-ai-architect-retainers',
  'client-facing-autonomous-bots',
  'multi-agent-debate-architecture',
  'tool-calling-function-execution',
  'langchain-langgraph-alternative',
  'long-term-episodic-memory-vector-db',
  'reduce-human-support-payroll',
  'b2b-contract-deliverable-automation',
  'zero-to-one-founder-playbook',
  'agency-in-a-box-ai-workflows',
  'side-hustle-ai-software-launch',
  'production-grade-agent-guardrails',
  'structured-agentic-decision-trees',
  'real-time-tool-invocation-loop',
  'resilient-agent-fallback-mechanisms',
  'high-ticket-consulting-architectures',
  'automated-lead-qualification-agents',
  'continuous-background-worker-agents',
  'human-in-the-loop-approval-flows',
  'self-correcting-code-generation',
  'swe-bench-autonomous-coding-agents',
  'ai-agent-orchestration-patterns',
  'stateful-conversation-sessions',
  'token-efficient-agent-prompts',
  'distributed-agent-workforces',
  'enterprise-ready-agent-compliance',
  'agent-telemetry-and-audit-trails',
  'cost-effective-agent-reasoning',
  'low-latency-agent-response-times',
  'autonomous-market-research-bots',
  'automated-financial-report-writer',
  'content-engine-multi-agent-pipeline',
  'agent-driven-social-media-automation',
  'custom-tool-api-wrapper-architecture',
  'agentic-rag-hybrid-retrieval',
  'deterministic-state-machines-for-ai',
  'multi-turn-planning-and-reflection',
  'fast-mvp-launch-strategy',
  'scalable-ai-micro-saas-ideas',
  'passive-income-ai-code-patterns',
  'enterprise-ai-vendor-selection',
  'soc2-compliant-agent-deployment',
  'read-code-earn-methodology',
  'monetize-technical-blueprints'
];

const LLM_AND_COST_STORY_TAGS = [
  'slash-openai-api-token-bills',
  'reduce-llm-inferencing-costs-80-percent',
  'self-host-open-source-models-runpod',
  'vllm-paged-attention-setup-guide',
  'lora-fine-tuning-domain-data',
  'multi-tenant-adapter-serving',
  'quantize-70b-llm-to-4bit-awq',
  'fastest-time-to-first-token-ttft',
  'prevent-hallucination-critical-apps',
  'structured-json-output-guaranteed',
  'outlines-xgrammar-logit-masking',
  'dspy-mipro-automated-prompt-compiler',
  'llm-judge-elo-calibration-benchmarks',
  'crag-corrective-rag-knowledge-graphs',
  'prefix-caching-radix-tree-cost-savings',
  'bitnet-1-58-bit-cpu-inference',
  'prompt-injection-jailbreak-firewall',
  'speculative-decoding-speedup',
  'continuous-batching-and-chunked-prefill',
  'tensorrt-llm-production-deployment',
  'model-context-protocol-mcp-servers',
  'test-time-compute-scaling-o1-patterns',
  'rlaif-constitutional-ai-pipelines',
  'dpo-vs-rlhf-alignment-guide',
  'synthetic-data-curation-pipeline',
  'enterprise-knowledge-base-rag',
  'hybrid-sparse-dense-bm25-vector',
  'semantic-cache-redis-query-dedup',
  'llm-latency-profiling-metrics',
  'cost-per-million-tokens-optimization',
  'local-first-ollama-desktop-apps',
  'fine-tuning-pricing-calculator',
  'enterprise-sla-token-rate-limits',
  'streaming-sse-websocket-protocols',
  'hallucination-detection-probes',
  'semantic-entropy-confidence-scoring',
  'guardrails-ai-input-output-validation',
  'dual-llm-sandboxed-privilege-isolation',
  'rag-triplet-extraction-neo4j',
  'ragas-truera-evaluation-metrics',
  'automated-eval-test-suites-ci-cd',
  'gpu-memory-vram-allocation-formula',
  'flashattention-2-cuda-acceleration',
  'multi-gpu-tensor-parallelism-deepspeed',
  'high-throughput-inference-cluster',
  'custom-system-prompt-architectures',
  'enterprise-ai-adoption-roadmap',
  'monetize-vertical-llm-apps',
  'profitable-rag-micro-services',
  'read-code-earn-llm-mastery'
];

const MONETIZATION_AND_SAAS_STORY_TAGS = [
  'saas-pricing-tier-optimization',
  'reduce-customer-churn-rate',
  'calculate-ltv-to-cac-ratio',
  'rule-of-40-financial-health',
  'quick-ratio-growth-formula',
  'payback-period-under-12-months',
  'viral-coefficient-k-factor-loops',
  'hooked-model-4-step-retention',
  'marczewski-gamification-framework',
  'points-badges-leaderboards-pbl',
  'endowed-progress-effect-onboarding',
  'skinner-box-variable-reward-schedules',
  'flow-state-user-experience-design',
  'cohort-retention-heatmap-analysis',
  'day-1-day-7-day-30-retention-benchmarks',
  'freemium-to-paid-conversion-funnel',
  'paywall-ab-testing-framework',
  'in-app-purchase-iap-economy-design',
  'virtual-currency-sinks-and-faucets',
  'whale-segmentation-high-arpu',
  'first-party-data-skan-roas-bidding',
  'ad-mediation-waterfall-bidding',
  'header-bidding-ecpm-maximization',
  'saas-metrics-dashboard-architecture',
  'stripe-subscription-lifecycle-webhooks',
  'dunning-management-failed-payments',
  'annual-prepayment-cashflow-boost',
  'product-led-growth-plg-flywheel',
  'self-serve-checkout-optimization',
  'price-discrimination-enterprise-plans',
  'customer-expansion-net-revenue-retention',
  'nrr-above-120-percent-strategies',
  'bootstrap-profitable-bootstrapped-saas',
  'venture-scale-unit-economics',
  'pitch-deck-traction-metrics',
  'ai-startup-gross-margin-preservation',
  'billing-infrastructure-scalability',
  'monetize-technical-knowledge-base',
  'subscription-retention-playbooks',
  'high-converting-checkout-ui',
  'social-proof-and-urgency-triggers',
  'customer-lifetime-value-expansion',
  'referral-program-growth-mechanics',
  'gamified-learning-completion-rates',
  'digital-product-monetization-playbook',
  'read-code-earn-monetization-blueprint',
  'high-yield-software-assets',
  'automated-revenue-generating-systems',
  'turn-technical-skills-into-wealth',
  'consumer-ai-monetization-strategy'
];

const INFRA_AND_SCALE_STORY_TAGS = [
  'scale-system-to-1-million-users',
  'prevent-database-meltdown-launch-day',
  'redis-caching-cache-aside-pattern',
  'probabilistic-early-expiration-xfetch',
  'database-sharding-consistent-hashing',
  'virtual-nodes-load-distribution',
  'kafka-event-streaming-message-broker',
  'rabbitmq-dead-letter-retry-backoff',
  'cap-theorem-consistency-availability',
  'pacelc-theorem-latency-tradeoffs',
  'raft-consensus-leader-election',
  'paxos-state-machine-replication',
  'saga-pattern-distributed-transactions',
  'circuit-breaker-bulkhead-resilience',
  'microservices-vs-modular-monolith',
  'kubernetes-pod-autoscaling-hpa',
  'cloud-cost-finops-optimization',
  'aws-gcp-multi-region-failover',
  'zero-downtime-canary-deployments',
  'high-availability-99-99-percent-uptime',
  'low-latency-grpc-microservices',
  'websocket-realtime-connection-pooling',
  'rate-limiting-leaky-bucket-redis',
  'soc2-type-2-security-compliance',
  'rbac-role-based-access-control',
  'distributed-tracing-opentelemetry',
  'postgresql-query-index-optimization',
  'database-connection-pool-pgbouncer',
  'ddos-mitigation-cloudflare-waf',
  'quantum-resistant-cryptography-kyber',
  'read-code-earn-systems-mastery',
  'scalable-infrastructure-blueprints',
  'high-cagr-software-assets',
  'quarterly-search-volume-optimization',
  'semantic-mid-point-classification',
  'high-yield-micro-saas-blueprint',
  'enterprise-grade-roi-forecasting',
  'unit-economics-calibrated-architecture'
];

/**
 * Returns an array of 50+ rich user story & search intent tags for any card
 */
export function getHiddenMetaTagsForCard(
  cardId: string,
  sectionId: string,
  category: string,
  title: string
): string[] {
  const specificTags: string[] = [
    `how-to-use-${cardId}`,
    `monetize-${cardId}`,
    `best-practices-${cardId}`,
    `architecture-pattern-${cardId}`,
    `enterprise-guide-${cardId}`,
    `interview-questions-${cardId}`,
    `math-formula-${cardId}`,
    `system-design-${cardId}`,
    `production-checklist-${cardId}`,
    `code-sample-${cardId}`
  ];

  let domainPool: string[] = [];
  if (sectionId === 'ai-roadmap' || sectionId === 'production-ai-evals') {
    domainPool = [...AGENT_AND_BUILDER_STORY_TAGS, ...LLM_AND_COST_STORY_TAGS];
  } else if (sectionId === 'llm-dimensions') {
    domainPool = [...LLM_AND_COST_STORY_TAGS, ...AGENT_AND_BUILDER_STORY_TAGS];
  } else if (
    sectionId === 'gamification-monetization' ||
    sectionId === 'gametech-systems' ||
    sectionId === 'b2b-ecommerce' ||
    sectionId === 'b2c-ecommerce' ||
    sectionId === 'd2c-ecommerce' ||
    sectionId === 'c2c-ecommerce' ||
    sectionId === 'c2b-ecommerce' ||
    sectionId === 'b2g-ecommerce'
  ) {
    domainPool = [...MONETIZATION_AND_SAAS_STORY_TAGS, ...AGENT_AND_BUILDER_STORY_TAGS];
  } else if (sectionId === 'system-performance-cloud' || sectionId === 'engineering-principles') {
    domainPool = [...INFRA_AND_SCALE_STORY_TAGS, ...MONETIZATION_AND_SAAS_STORY_TAGS];
  } else {
    // Math, deep learning, quantum, linguistics
    domainPool = [
      ...AGENT_AND_BUILDER_STORY_TAGS.slice(0, 20),
      ...LLM_AND_COST_STORY_TAGS.slice(0, 20),
      ...INFRA_AND_SCALE_STORY_TAGS.slice(0, 15),
      ...MONETIZATION_AND_SAAS_STORY_TAGS.slice(0, 15)
    ];
  }

  // Combine and deduplicate to guarantee 50+ tags
  const combined = Array.from(new Set([...specificTags, ...domainPool]));
  return combined.slice(0, 60);
}
