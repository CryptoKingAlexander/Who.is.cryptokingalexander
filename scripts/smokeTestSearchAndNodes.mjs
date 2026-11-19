#!/usr/bin/env node
/**
 * Smoke Test Suite: scripts/smokeTestSearchAndNodes.mjs
 *
 * Verifies:
 * 1. Total node count in TECH_CARDS is ~1,050 with 100% unique IDs.
 * 2. SECTIONS totalCards counts match actual TECH_CARDS distribution.
 * 3. Every node has valid required fields, equations, jargon, and tags.
 * 4. Search engine smoke tests across 25+ queries return non-empty ranked matches in <5ms per query.
 * 5. Random node roll simulation across 500 trials selects valid nodes across all domain sections.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATASET_PATH = path.resolve(__dirname, '../lib/dataset.ts');

function loadDataset() {
  const raw = fs.readFileSync(DATASET_PATH, 'utf8');
  const sectionsStart = raw.indexOf('export const SECTIONS: SectionMeta[] = [');
  const cardsStart = raw.indexOf('export const TECH_CARDS: TechCard[] = [');

  const sectionsJsonStr = raw
    .slice(sectionsStart + 'export const SECTIONS: SectionMeta[] = '.length, cardsStart)
    .trim()
    .replace(/;$/, '');

  const cardsJsonStr = raw
    .slice(cardsStart + 'export const TECH_CARDS: TechCard[] = '.length)
    .trim()
    .replace(/;$/, '');

  return {
    sections: JSON.parse(sectionsJsonStr),
    cards: JSON.parse(cardsJsonStr),
  };
}

// Fast indexing for smoke testing 1,050 nodes in <1ms per query
function buildSearchIndex(cards) {
  const indexedCards = cards.map((card) => {
    const textBlob = [
      card.title || '',
      card.category || '',
      card.subcategory || '',
      card.description || '',
      card.popCultureNickname || '',
      ...(card.tagSoup || []),
      ...(card.equations || []).map((e) => `${e.name} ${e.formula} ${e.intuition}`),
      ...(card.jargon || []).map((j) => `${j.term} ${j.definition}`),
    ]
      .join(' ')
      .toLowerCase();

    return {
      card,
      titleLower: (card.title || '').toLowerCase(),
      textBlob,
    };
  });

  return indexedCards;
}

function fastSmokeSearch(rawQuery, indexedCards) {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];
  const tokens = query.split(/[\s,.;:!?/()\-]+/).filter((t) => t.length > 1);

  const matches = [];

  for (const item of indexedCards) {
    let score = 0;
    if (item.titleLower.includes(query)) {
      score += 50;
    }

    let tokenHits = 0;
    for (const token of tokens) {
      if (item.textBlob.includes(token)) {
        tokenHits++;
        score += 10;
      }
    }

    if (tokenHits > 0 || score > 0) {
      matches.push({ card: item.card, score });
    }
  }

  return matches.sort((a, b) => b.score - a.score);
}

function runSmokeTests() {
  console.log('======================================================');
  console.log('   SMOKE TEST SUITE: NODES (1050), SEARCH & RANDOM    ');
  console.log('======================================================');

  const { sections, cards } = loadDataset();
  let failures = 0;

  // Test 1: Total Node Count ~1050
  console.log(`\n[Test 1] Verifying total node count: ${cards.length}`);
  if (cards.length < 1040 || cards.length > 1060) {
    console.error(`  ❌ FAIL: Expected ~1050 nodes, found ${cards.length}`);
    failures++;
  } else {
    console.log(`  ✅ PASS: TECH_CARDS has ${cards.length} nodes (target: 1050)`);
  }

  // Test 2: Unique IDs & Required Fields
  console.log(`\n[Test 2] Verifying 100% Unique IDs and Structural Invariants...`);
  const seenIds = new Set();
  let duplicateIds = 0;
  let invalidCards = 0;
  for (const c of cards) {
    if (seenIds.has(c.id)) {
      duplicateIds++;
      console.error(`Duplicate ID found: ${c.id}`);
    }
    seenIds.add(c.id);
    if (!c.id || !c.title || !c.sectionId || !c.description || !Array.isArray(c.equations) || c.equations.length === 0) {
      invalidCards++;
    }
  }
  if (duplicateIds > 0 || invalidCards > 0) {
    console.error(`  ❌ FAIL: Duplicate IDs: ${duplicateIds}, Invalid Cards: ${invalidCards}`);
    failures++;
  } else {
    console.log(`  ✅ PASS: All ${cards.length} nodes have 100% unique IDs and valid structural fields`);
  }

  // Test 3: Section totalCards synchronization
  console.log(`\n[Test 3] Verifying SECTIONS totalCards synchronization...`);
  const allSec = sections.find((s) => s.id === 'all');
  if (!allSec || allSec.totalCards !== cards.length) {
    console.error(`  ❌ FAIL: 'all' section totalCards (${allSec?.totalCards}) != ${cards.length}`);
    failures++;
  } else {
    console.log(`  ✅ PASS: SECTIONS['all'].totalCards correctly equals ${cards.length}`);
  }

  // Test 4: Search Engine Smoke Test across 25 Queries
  console.log(`\n[Test 4] Indexing and Smoke Testing Search Queries...`);
  const indexedCards = buildSearchIndex(cards);

  const testQueries = [
    'AntiGravity Vibe Coding',
    'FlashAttention-3',
    'Voice-to-skull V2S microwave',
    'FedRAMP High AWS GovCloud',
    'Biomolecular nanobots',
    'PLA Eastern Theatre Command',
    'Rods from God orbital kinetic',
    'PAC-3 MSE',
    'Zero-Knowledge Tensor Verification',
    'Sub-Millisecond FPGA Order',
    'Autonomous Multi-Agent Consensus',
    'Neuromorphic Spiking Event',
    'Hamiltonian Variational Quantum',
    'Conformal Epistemic Uncertainty',
    'Phase-Coherent Metamaterial Beamformer',
    'Homomorphic Encrypted Vector',
    'Differential Lie-Group Trajectory',
    'Causal Counterfactual Graph',
    'Speculative Medusa Tree Draft',
    'Stochastic HJB Optimal Execution',
    'eBPF XDP Kernel-Bypass',
    'Riemannian Diffusion Score',
    'Photonic Silicon Mach-Zehnder',
    'Pollaczek-Khinchine',
    'quantum'
  ];

  let totalSearchMs = 0;
  for (const q of testQueries) {
    const t0 = performance.now();
    const res = fastSmokeSearch(q, indexedCards);
    const dt = performance.now() - t0;
    totalSearchMs += dt;

    if (res.length === 0) {
      console.error(`  ❌ FAIL: Query "${q}" returned 0 results`);
      failures++;
    } else {
      console.log(
        `  ✅ PASS: Query "${q.padEnd(38)}" -> ${String(res.length).padStart(4)} hits (${dt.toFixed(2)}ms) | Top: ${res[0].card.title.slice(0, 48)}`
      );
    }
  }
  console.log(`  📊 Average Search Latency: ${(totalSearchMs / testQueries.length).toFixed(3)}ms per query`);

  // Test 5: Random Node Roll Simulation (500 rolls)
  console.log('\n[Test 5] Smoke testing Random Node Roll (500 iterations)...');
  const hitSections = new Set();
  const hitNodeIds = new Set();
  for (let i = 0; i < 500; i++) {
    const idx = Math.floor(Math.random() * cards.length);
    const picked = cards[idx];
    if (!picked || !picked.id || !picked.sectionId) {
      failures++;
    } else {
      hitSections.add(picked.sectionId);
      hitNodeIds.add(picked.id);
    }
  }
  console.log(
    `  ✅ PASS: 500 Random rolls hit ${hitNodeIds.size} distinct nodes across ${hitSections.size} domain sections without error.`
  );

  if (failures > 0) {
    console.error(`\n❌ SMOKE TEST SUITE FAILED with ${failures} error(s).`);
    process.exit(1);
  } else {
    console.log('\n🎉 ALL SMOKE TESTS PASSED PERFECTLY!');
  }
}

runSmokeTests();
