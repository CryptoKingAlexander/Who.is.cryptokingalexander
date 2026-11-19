import { SECTIONS, TECH_CARDS } from '@/lib/dataset';
import {
  getProgramManagerOverviewForCard,
  getSystemsArchitectPerspectiveForCard,
  getProfitabilityAnalysisForCard,
  getCyberOperationsLiaisonForCard,
  getEcomGuruPerspectiveForCard,
  getGamingProjectManagerPerspectiveForCard,
  getPortersFiveForcesForCard,
} from '@/lib/expertInsightsGenerator';

export interface StandaloneCardPayload {
  id: string;
  sectionId: string;
  title: string;
  popCultureNickname?: string;
  category: string;
  subcategory: string;
  level: string;
  description: string;
  pmOverview: string;
  architectPerspective: string;
  profitability: string;
  cyberLiaison: string;
  ecomPerspective: string;
  gamingPerspective: string;
  portersFiveForces: ReturnType<typeof getPortersFiveForcesForCard>;
  fundamentalAlgorithm?: {
    name: string;
    complexity: string;
    description: string;
    objective?: string;
    pseudocode?: string[];
  };
  optimizationAlgorithm?: {
    name: string;
    complexity: string;
    description: string;
    objective?: string;
    pseudocode?: string[];
  };
  equations: Array<{
    name: string;
    formula: string;
    intuition: string;
    variables: Array<{
      symbol: string;
      explanation: string;
    }>;
  }>;
  jargon: Array<{
    term: string;
    definition: string;
  }>;
  tagSoup: string[];
}

let cachedExeBuffer: Buffer | null = null;

export function buildEnrichedDataset(): StandaloneCardPayload[] {
  const seenIds = new Set<string>();
  const uniqueCards = TECH_CARDS.filter((card) => {
    if (!card?.id || seenIds.has(card.id)) return false;
    seenIds.add(card.id);
    return true;
  });

  return uniqueCards.map((card) => {
    const equations = (card.equations || []).map((eq) => ({
      name: eq.name,
      formula: eq.formula || '',
      intuition: eq.intuition,
      variables: eq.variables || [],
    }));

    return {
      id: card.id,
      sectionId: card.sectionId,
      title: card.title,
      popCultureNickname: card.popCultureNickname,
      category: card.category,
      subcategory: card.subcategory || '',
      level: card.level,
      description: card.description,
      pmOverview: getProgramManagerOverviewForCard(card),
      architectPerspective: getSystemsArchitectPerspectiveForCard(card),
      profitability: getProfitabilityAnalysisForCard(card),
      cyberLiaison: getCyberOperationsLiaisonForCard(card),
      ecomPerspective: getEcomGuruPerspectiveForCard(card),
      gamingPerspective: getGamingProjectManagerPerspectiveForCard(card),
      portersFiveForces: getPortersFiveForcesForCard(card),
      fundamentalAlgorithm: card.fundamentalAlgorithm,
      optimizationAlgorithm: card.optimizationAlgorithm,
      equations,
      jargon: card.jargon || [],
      tagSoup: card.tagSoup || [],
    };
  });
}

export function generateStandaloneAppHtml(): string {
  const enrichedCards = buildEnrichedDataset();
  const sectionsJson = JSON.stringify(SECTIONS);
  const cardsJson = JSON.stringify(enrichedCards);

  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Generic.exe — Standalone Windows Desktop Enclave (Offline Client Edition)</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #070a12;
    --panel: #121410;
    --panel-alt: #0c101d;
    --border: rgba(245, 158, 11, 0.45);
    --amber: #f59e0b;
    --amber-light: #fde68a;
    --text: #f5f5f4;
    --muted: #a8a29e;
  }
  body.theme-black { --bg: #000000; --panel: #080808; --panel-alt: #050505; }
  body.theme-white {
    --bg: #f7f6f0;
    --panel: #ffffff;
    --panel-alt: #f0efe9;
    --text: #1c1917;
    --muted: #57534e;
    --border: rgba(217, 119, 6, 0.45);
  }
  body {
    background-color: var(--bg);
    color: var(--text);
    font-family: "Segoe UI", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
    line-height: 1.55;
    background-image:
      linear-gradient(to right, rgba(234, 179, 8, 0.04) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(234, 179, 8, 0.04) 1px, transparent 1px);
    background-size: 32px 32px;
    min-height: 100vh;
  }
  .mono { font-family: Consolas, "Cascadia Mono", ui-monospace, SFMono-Regular, Menlo, monospace; }
  header {
    position: sticky; top: 0; z-index: 50;
    background: rgba(15, 20, 32, 0.96);
    backdrop-filter: blur(12px);
    border-bottom: 2px solid rgba(245, 158, 11, 0.45);
    padding: 12px 18px;
  }
  body.theme-white header {
    background: rgba(255, 255, 255, 0.96);
    border-bottom: 2px solid rgba(217, 119, 6, 0.45);
  }
  .header-top {
    display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px;
    max-width: 1480px; margin: 0 auto;
  }
  .brand { display: flex; align-items: center; gap: 10px; }
  .brand-badge {
    background: rgba(245, 158, 11, 0.15); border: 2px solid var(--amber);
    color: var(--amber); padding: 6px 10px; border-radius: 8px; font-weight: 900; font-size: 12px;
    letter-spacing: 0.05em;
  }
  .status-pill {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.5);
    color: #34d399; padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: 700;
  }
  .controls { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; flex: 1; justify-content: flex-end; }
  input[type="search"], select {
    background: var(--panel-alt); color: var(--text); border: 1.5px solid rgba(245, 158, 11, 0.45);
    padding: 8px 12px; border-radius: 8px; font-size: 12.5px; outline: none;
  }
  input[type="search"]:focus, select:focus { border-color: var(--amber); box-shadow: 0 0 12px rgba(245, 158, 11, 0.25); }
  input[type="search"] { width: 270px; max-width: 100%; }
  button.btn {
    background: #1c2230; color: var(--amber-light); border: 1.5px solid rgba(245, 158, 11, 0.5);
    padding: 8px 12px; border-radius: 8px; font-size: 11.5px; font-weight: 700; cursor: pointer;
    transition: all 0.15s;
  }
  button.btn:hover { background: #273042; border-color: var(--amber); }
  button.btn-primary {
    background: linear-gradient(90deg, #f59e0b, #eab308); color: #0c0a09; border-color: #fde047;
  }
  main { max-width: 1480px; margin: 0 auto; padding: 20px 18px 80px; }
  .hero {
    background: linear-gradient(135deg, #0f1420 0%, #16120e 100%);
    border: 2px solid rgba(245, 158, 11, 0.45);
    border-radius: 12px; padding: 18px 20px; margin-bottom: 20px;
    display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px;
  }
  body.theme-white .hero {
    background: #fffbeb; border-color: #d97706;
  }
  .stats-bar {
    display: flex; flex-wrap: wrap; gap: 10px;
  }
  .stat-chip {
    background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(245, 158, 11, 0.35);
    padding: 6px 12px; border-radius: 8px; font-size: 11px;
  }
  .grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(460px, 1fr)); gap: 18px;
  }
  @media (max-width: 640px) { .grid { grid-template-columns: 1fr; } }
  .card {
    background: var(--panel); border: 2.5px solid rgba(245, 158, 11, 0.4);
    border-radius: 10px; padding: 16px; transition: border-color 0.2s, box-shadow 0.2s;
  }
  .card:hover { border-color: var(--amber); box-shadow: 0 6px 24px rgba(0, 0, 0, 0.4); }
  .card-header { cursor: pointer; user-select: none; }
  .card-top-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
  .card-title {
    font-size: 16.5px; font-weight: 800; color: #fef3c7;
    text-decoration: underline; text-underline-offset: 4px; text-decoration-color: rgba(245, 158, 11, 0.7);
    margin-bottom: 6px;
  }
  body.theme-white .card-title { color: #78350f; }
  .expand-hint {
    font-size: 10px; color: var(--amber); border: 1px solid rgba(245, 158, 11, 0.4);
    padding: 2px 7px; border-radius: 4px; white-space: nowrap;
  }
  .badge {
    display: inline-block; font-size: 10.5px; padding: 2px 8px; border-radius: 4px;
    background: rgba(245, 158, 11, 0.14); border: 1px solid rgba(245, 158, 11, 0.35);
    color: var(--amber-light); margin-right: 6px; margin-bottom: 6px;
  }
  body.theme-white .badge { color: #92400e; background: #fef3c7; }
  .desc { font-size: 13.5px; color: #d6d3d1; margin-top: 8px; }
  body.theme-white .desc { color: #44403c; }
  .details { margin-top: 14px; padding-top: 14px; border-top: 1px solid rgba(245, 158, 11, 0.25); display: none; }
  .card.expanded .details { display: block; }
  .section-box {
    background: rgba(9, 14, 26, 0.88); border: 1px solid rgba(245, 158, 11, 0.3);
    border-radius: 8px; padding: 12px; margin-bottom: 10px;
  }
  body.theme-white .section-box { background: #fafaf9; border-color: #d6d3d1; }
  .section-box h4 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--amber); margin-bottom: 6px; }
  .section-box p { font-size: 12.5px; color: #e7e5e4; }
  body.theme-white .section-box p { color: #292524; }
  .algo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
  @media (max-width: 640px) { .algo-grid { grid-template-columns: 1fr; } }
  .eq-box {
    background: #060913; border: 1px solid rgba(6, 182, 212, 0.4);
    border-radius: 8px; padding: 12px; margin-top: 8px; overflow-x: auto;
  }
  body.theme-white .eq-box { background: #f0f9ff; border-color: #0284c7; }
  .eq-title { font-size: 12px; font-weight: 700; color: #67e8f9; margin-bottom: 6px; }
  body.theme-white .eq-title { color: #0369a1; }
  .eq-formula {
    font-size: 14px; color: #fef08a; padding: 8px 10px; background: rgba(255,255,255,0.03);
    border-radius: 6px; border-left: 3px solid #06b6d4; overflow-x: auto;
  }
  body.theme-white .eq-formula { color: #0f172a; background: #e0f2fe; }
  .eq-intuition { font-size: 12px; color: #cbd5e1; margin-top: 6px; font-style: italic; }
  body.theme-white .eq-intuition { color: #334155; }
  .var-list { margin-top: 6px; padding-top: 6px; border-top: 1px dashed rgba(148, 163, 184, 0.2); font-size: 11.5px; color: #94a3b8; }
  .tag {
    display: inline-block; font-size: 10.5px; padding: 2px 7px; margin: 2px;
    background: #171923; border: 1px solid #334155; border-radius: 4px; color: #94a3b8; cursor: pointer;
  }
  .tag:hover { color: var(--amber-light); border-color: var(--amber); }
  @media print {
    header .controls { display: none !important; }
    .card { break-inside: avoid; margin-bottom: 16px; }
    .details { display: block !important; }
  }
</style>
</head>
<body>
<header>
  <div class="header-top">
    <div class="brand">
      <span class="brand-badge mono">GENERIC.EXE</span>
      <div>
        <div class="mono" style="font-weight:800;font-size:14px;display:flex;align-items:center;gap:8px;">
          <span>READ. <span style="color:#f59e0b">CODE.</span> EARN.</span>
          <span class="status-pill mono">● OFFLINE ENCLAVE ACTIVE</span>
        </div>
        <div class="mono" style="font-size:11px;color:var(--muted);">Windows Standalone Client Presentation Edition · <span id="count-badge">0</span> Architectural Nodes</div>
      </div>
    </div>
    <div class="controls">
      <input type="search" id="search-input" placeholder="Search architectures, formulas, jargon..." />
      <select id="section-select"><option value="all">All 40 Operational Sectors</option></select>
      <select id="sort-select">
        <option value="complexity">Sort: Complexity</option>
        <option value="alphabetical">Sort: A-Z Title</option>
        <option value="equations">Sort: Formula Density</option>
      </select>
      <button class="btn mono" id="expand-all-btn">Expand All</button>
      <button class="btn mono" id="random-btn">Roll Random</button>
      <button class="btn mono" id="theme-btn">Theme: Slate</button>
      <button class="btn btn-primary mono" onclick="window.print()">Print Client Dossier</button>
    </div>
  </div>
</header>
<main>
  <div class="hero">
    <div style="max-width:920px;">
      <h1 class="mono" style="font-size:18px;color:#fde68a;margin-bottom:6px;" id="sector-title">Multi-Domain Operational Systems Architecture</h1>
      <p class="mono" style="font-size:12px;color:var(--muted);" id="sector-desc">
        100% air-gapped offline Windows desktop execution containing all architectural blueprints, mathematical formulations, procedural algorithm invariants, Porter's 5 Forces factorizations, and 6 executive domain perspectives for client demonstrations.
      </p>
    </div>
    <div class="stats-bar mono">
      <div class="stat-chip"><strong style="color:#f59e0b;" id="total-nodes-stat">0</strong> Total Blueprints</div>
      <div class="stat-chip"><strong style="color:#38bdf8;">40</strong> Sectors</div>
      <div class="stat-chip"><strong style="color:#34d399;">100%</strong> Offline Native</div>
    </div>
  </div>
  <div class="grid" id="cards-grid"></div>
</main>
<script>
  const SECTIONS = ${sectionsJson};
  const CARDS = ${cardsJson};
  let currentSection = 'all';
  let searchQuery = '';
  let sortMode = 'complexity';
  let allExpanded = false;
  const themes = ['slate', 'black', 'white'];
  let themeIdx = 0;

  document.getElementById('total-nodes-stat').textContent = CARDS.length;

  const sectionSelect = document.getElementById('section-select');
  SECTIONS.forEach(s => {
    if (s.id === 'all') return;
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = (s.domainClassification === 'military' ? '[MIL] ' : '') + s.title;
    sectionSelect.appendChild(opt);
  });

  function formatOfflineLatex(raw) {
    if (!raw) return '';
    let s = raw
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    s = s.replace(/\\\\frac\\{([^{}]+)\\}\\{([^{}]+)\\}/g, '($1) / ($2)');
    s = s.replace(/\\\\sqrt\\{([^{}]+)\\}/g, '√($1)');
    s = s.replace(/\\\\text\\{([^{}]+)\\}/g, '<span style="font-style:normal;color:#cbd5e1;">$1</span>');
    s = s.replace(/\\\\left([(\\[|])/g, '$1').replace(/\\\\right([)\\]|])/g, '$1');
    const symbols = {
      '\\\\alpha': 'α', '\\\\beta': 'β', '\\\\gamma': 'γ', '\\\\delta': 'δ', '\\\\Delta': 'Δ',
      '\\\\epsilon': 'ε', '\\\\varepsilon': 'ε', '\\\\zeta': 'ζ', '\\\\eta': 'η', '\\\\theta': 'θ',
      '\\\\Theta': 'Θ', '\\\\kappa': 'κ', '\\\\lambda': 'λ', '\\\\Lambda': 'Λ', '\\\\mu': 'μ',
      '\\\\nu': 'ν', '\\\\xi': 'ξ', '\\\\pi': 'π', '\\\\Pi': 'Π', '\\\\rho': 'ρ',
      '\\\\sigma': 'σ', '\\\\Sigma': 'Σ', '\\\\tau': 'τ', '\\\\phi': 'φ', '\\\\Phi': 'Φ',
      '\\\\chi': 'χ', '\\\\psi': 'ψ', '\\\\Psi': 'Ψ', '\\\\omega': 'ω', '\\\\Omega': 'Ω',
      '\\\\sum': '∑', '\\\\prod': '∏', '\\\\int': '∫', '\\\\partial': '∂', '\\\\nabla': '∇',
      '\\\\infty': '∞', '\\\\approx': '≈', '\\\\neq': '≠', '\\\\leq': '≤', '\\\\le': '≤',
      '\\\\geq': '≥', '\\\\ge': '≥', '\\\\cdot': '·', '\\\\times': '×', '\\\\pm': '±',
      '\\\\implies': '⟹', '\\\\rightarrow': '→', '\\\\to': '→', '\\\\in': '∈', '\\\\forall': '∀'
    };
    for (const [k, v] of Object.entries(symbols)) {
      s = s.replace(new RegExp(k + '(?![a-zA-Z])', 'g'), v);
    }
    s = s.replace(/_\\{([^{}]+)\\}/g, '<sub>$1</sub>').replace(/_([a-zA-Z0-9])/g, '<sub>$1</sub>');
    s = s.replace(/\\^\\{([^{}]+)\\}/g, '<sup>$1</sup>').replace(/\\^([a-zA-Z0-9+-])/g, '<sup>$1</sup>');
    s = s.replace(/\\\\([a-zA-Z]+)/g, '$1');
    return s;
  }

  const levelRank = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert': 4 };

  function renderCards() {
    const grid = document.getElementById('cards-grid');
    const q = searchQuery.trim().toLowerCase();
    const filtered = CARDS.filter(c => {
      if (currentSection !== 'all' && c.sectionId !== currentSection) return false;
      if (!q) return true;
      return (
        (c.title || '').toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q) ||
        (c.category || '').toLowerCase().includes(q) ||
        (c.tagSoup || []).some(t => (t || '').toLowerCase().includes(q)) ||
        (c.jargon || []).some(j => (j?.term || '').toLowerCase().includes(q) || (j?.definition || '').toLowerCase().includes(q))
      );
    }).sort((a, b) => {
      if (sortMode === 'alphabetical') return (a.title || '').localeCompare(b.title || '');
      if (sortMode === 'equations') return ((b.equations || []).length) - ((a.equations || []).length);
      return (levelRank[a.level] || 2) - (levelRank[b.level] || 2);
    });

    document.getElementById('count-badge').textContent = filtered.length;
    grid.innerHTML = filtered.map(c => {
      const eqs = (c.equations || []).map(eq => {
        const mathOut = formatOfflineLatex(eq.formula || '');
        const varsHtml = (eq.variables || []).map(v =>
          \`<div><strong class="mono" style="color:#38bdf8;">\${formatOfflineLatex(v.symbol)}:</strong> \${v.explanation}</div>\`
        ).join('');
        return \`
        <div class="eq-box">
          <div class="eq-title mono">\${eq.name}</div>
          <div class="eq-formula mono">\${mathOut}</div>
          <div class="eq-intuition">\${eq.intuition || ''}</div>
          \${varsHtml ? \`<div class="var-list">\${varsHtml}</div>\` : ''}
        </div>
      \`;
      }).join('');

      const jargonHtml = (c.jargon || []).map(j => \`
        <div style="margin-bottom:5px;font-size:12px;"><strong style="color:#fde68a;">\${j.term}:</strong> \${j.definition}</div>
      \`).join('');

      const tagsHtml = (c.tagSoup || []).map(t => \`
        <span class="tag mono" onclick="setTag('\${t.replace(/'/g, "\\\\'")}')">#\${t}</span>
      \`).join('');

      const algosHtml = (c.fundamentalAlgorithm || c.optimizationAlgorithm) ? \`
        <div class="algo-grid">
          \${c.fundamentalAlgorithm ? \`
            <div class="section-box" style="margin-bottom:0;">
              <h4 class="mono">Fundamental Algorithm · \${c.fundamentalAlgorithm.complexity || ''}</h4>
              <p><strong style="color:#fde68a;">\${c.fundamentalAlgorithm.name}:</strong> \${c.fundamentalAlgorithm.description}</p>
            </div>
          \` : ''}
          \${c.optimizationAlgorithm ? \`
            <div class="section-box" style="margin-bottom:0;">
              <h4 class="mono">Optimization Target · \${c.optimizationAlgorithm.complexity || ''}</h4>
              <p><strong style="color:#34d399;">\${c.optimizationAlgorithm.name}:</strong> \${c.optimizationAlgorithm.description}</p>
            </div>
          \` : ''}
        </div>
      \` : '';

      return \`
        <article class="card \${allExpanded ? 'expanded' : ''}" id="node-\${c.id}">
          <div class="card-header" onclick="this.parentElement.classList.toggle('expanded')">
            <div class="card-top-row">
              <div class="card-title">\${c.title}</div>
              <span class="expand-hint mono">Inspect Blueprint ▾</span>
            </div>
            <div>
              <span class="badge mono">\${c.category}</span>
              <span class="badge mono">\${c.level}</span>
              \${c.popCultureNickname ? \`<span class="badge mono" style="font-style:italic;">"\${c.popCultureNickname}"</span>\` : ''}
            </div>
            <p class="desc">\${c.description}</p>
          </div>
          <div class="details">
            \${algosHtml}
            <div class="section-box">
              <h4 class="mono">1. Principal Program Manager Overview</h4>
              <p>\${c.pmOverview}</p>
            </div>
            <div class="section-box">
              <h4 class="mono">2. Systems Architect Directive &amp; Invariants</h4>
              <p>\${c.architectPerspective}</p>
            </div>
            <div class="section-box">
              <h4 class="mono">3. Monetization Forecaster &amp; Unit Economics Yield</h4>
              <p>\${c.profitability}</p>
            </div>
            <div class="section-box">
              <h4 class="mono">4. Cyber Operations Liaison Directive</h4>
              <p>\${c.cyberLiaison}</p>
            </div>
            <div class="section-box">
              <h4 class="mono">5. E-Commerce &amp; Growth Systems Perspective</h4>
              <p>\${c.ecomPerspective}</p>
            </div>
            <div class="section-box">
              <h4 class="mono">6. Gaming &amp; Simulation Systems Producer</h4>
              <p>\${c.gamingPerspective}</p>
            </div>
            <div class="section-box">
              <h4 class="mono">Porter's 5 Forces Strategic Factorization</h4>
              <p>\${c.portersFiveForces?.strategicFactorizationSummary || ''}</p>
            </div>
            <div class="section-box">
              <h4 class="mono">Mathematical Formulations (\${(c.equations || []).length})</h4>
              \${eqs}
            </div>
            <div class="section-box">
              <h4 class="mono">Domain Jargon (\${(c.jargon || []).length})</h4>
              \${jargonHtml}
            </div>
            <div>\${tagsHtml}</div>
          </div>
        </article>
      \`;
    }).join('');
  }

  window.setTag = function(tag) {
    const input = document.getElementById('search-input');
    input.value = tag;
    searchQuery = tag;
    renderCards();
  };

  document.getElementById('search-input').addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderCards();
  });

  document.getElementById('sort-select').addEventListener('change', (e) => {
    sortMode = e.target.value;
    renderCards();
  });

  sectionSelect.addEventListener('change', (e) => {
    currentSection = e.target.value;
    const sec = SECTIONS.find(s => s.id === currentSection);
    if (sec) {
      document.getElementById('sector-title').textContent = sec.title;
      document.getElementById('sector-desc').textContent = (sec.description || '').replace(/@@|!!/g, '');
    }
    renderCards();
  });

  document.getElementById('expand-all-btn').addEventListener('click', () => {
    allExpanded = !allExpanded;
    document.getElementById('expand-all-btn').textContent = allExpanded ? 'Collapse All' : 'Expand All';
    renderCards();
  });

  document.getElementById('theme-btn').addEventListener('click', () => {
    themeIdx = (themeIdx + 1) % themes.length;
    const t = themes[themeIdx];
    document.body.className = t === 'slate' ? '' : 'theme-' + t;
    document.getElementById('theme-btn').textContent = 'Theme: ' + t.charAt(0).toUpperCase() + t.slice(1);
  });

  document.getElementById('random-btn').addEventListener('click', () => {
    const rand = CARDS[Math.floor(Math.random() * CARDS.length)];
    if (rand) {
      const el = document.getElementById('node-' + rand.id);
      if (el) {
        el.classList.add('expanded');
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });

  renderCards();
</script>
</body>
</html>`;
}

function alignUp(val: number, alignment: number): number {
  return Math.ceil(val / alignment) * alignment;
}

/**
 * Builds a genuine, native 32-bit Windows Portable Executable (PE32 GUI .exe)
 * that runs natively on Windows 10/11 (both x86 and x64 via WOW64) without any
 * console window flash. When double-clicked offline, the native x86 machine code
 * writes the embedded standalone Generic application from its .data section
 * to %TEMP%\Generic_App_Standalone.html and opens it in a standalone desktop
 * application window via Microsoft Edge (--app mode) with automatic fallback
 * to the default Windows shell handler.
 */
function buildWindowsPeExecutable(htmlPayload: Buffer): Buffer {
  const FILE_ALIGNMENT = 0x200;
  const SECTION_ALIGNMENT = 0x1000;
  const IMAGE_BASE = 0x00400000;

  const headersSize = 0x400; // 1024 bytes
  const textRawOffset = 0x400;
  const textRawSize = 0x200;
  const textRva = 0x1000;

  const rdataRawOffset = 0x600;
  const rdataRawSize = 0x200;
  const rdataRva = 0x2000;

  const dataRawOffset = 0x800;
  const dataScratchSize = 0x1000; // 4096 bytes before payload at RVA 0x4000
  const dataVirtualSize = dataScratchSize + htmlPayload.length;
  const dataRawSize = alignUp(dataVirtualSize, FILE_ALIGNMENT);
  const dataRva = 0x3000;

  const sizeOfImage = dataRva + alignUp(dataVirtualSize, SECTION_ALIGNMENT);
  const totalFileSize = dataRawOffset + dataRawSize;

  const exe = Buffer.alloc(totalFileSize, 0);

  // =========================================================================
  // 1. IMAGE_DOS_HEADER (0x0000 - 0x007F)
  // =========================================================================
  exe.writeUInt16LE(0x5a4d, 0x00); // e_magic = 'MZ'
  exe.writeUInt16LE(0x0090, 0x02); // e_cblp
  exe.writeUInt16LE(0x0003, 0x04); // e_cp
  exe.writeUInt16LE(0x0004, 0x08); // e_cparhdr
  exe.writeUInt16LE(0xffff, 0x0c); // e_maxalloc
  exe.writeUInt16LE(0x00b8, 0x10); // e_sp
  exe.writeUInt16LE(0x0040, 0x18); // e_lfarlc
  exe.writeUInt32LE(0x00000080, 0x3c); // e_lfanew = 0x80

  const dosStubMsg = 'This program cannot be run in DOS mode.\r\r\n$';
  exe.write(dosStubMsg, 0x40, 'ascii');

  // =========================================================================
  // 2. IMAGE_NT_HEADERS32 (0x0080)
  // =========================================================================
  const peOffset = 0x80;
  exe.writeUInt32LE(0x00004550, peOffset); // Signature = "PE\0\0"

  // IMAGE_FILE_HEADER (20 bytes at 0x84)
  const fh = peOffset + 4;
  exe.writeUInt16LE(0x014c, fh + 0); // Machine = IMAGE_FILE_MACHINE_I386
  exe.writeUInt16LE(3, fh + 2); // NumberOfSections = 3 (.text, .rdata, .data)
  exe.writeUInt32LE(0x67180000, fh + 4); // TimeDateStamp
  exe.writeUInt32LE(0, fh + 8); // PointerToSymbolTable
  exe.writeUInt32LE(0, fh + 12); // NumberOfSymbols
  exe.writeUInt16LE(0x00e0, fh + 16); // SizeOfOptionalHeader = 224
  exe.writeUInt16LE(0x010f, fh + 18); // Characteristics (EXECUTABLE_IMAGE | 32BIT_MACHINE | RELOCS_STRIPPED)

  // IMAGE_OPTIONAL_HEADER32 (224 bytes at 0x98)
  const oh = fh + 20;
  exe.writeUInt16LE(0x010b, oh + 0); // Magic = PE32
  exe.writeUInt8(14, oh + 2); // MajorLinkerVersion
  exe.writeUInt8(0, oh + 3); // MinorLinkerVersion
  exe.writeUInt32LE(textRawSize, oh + 4); // SizeOfCode
  exe.writeUInt32LE(rdataRawSize + dataRawSize, oh + 8); // SizeOfInitializedData
  exe.writeUInt32LE(0, oh + 12); // SizeOfUninitializedData
  exe.writeUInt32LE(textRva, oh + 16); // AddressOfEntryPoint = 0x1000
  exe.writeUInt32LE(textRva, oh + 20); // BaseOfCode = 0x1000
  exe.writeUInt32LE(rdataRva, oh + 24); // BaseOfData = 0x2000
  exe.writeUInt32LE(IMAGE_BASE, oh + 28); // ImageBase = 0x00400000
  exe.writeUInt32LE(SECTION_ALIGNMENT, oh + 32); // SectionAlignment = 0x1000
  exe.writeUInt32LE(FILE_ALIGNMENT, oh + 36); // FileAlignment = 0x200
  exe.writeUInt16LE(4, oh + 40); // MajorOperatingSystemVersion
  exe.writeUInt16LE(0, oh + 42); // MinorOperatingSystemVersion
  exe.writeUInt16LE(1, oh + 44); // MajorImageVersion
  exe.writeUInt16LE(0, oh + 46); // MinorImageVersion
  exe.writeUInt16LE(4, oh + 48); // MajorSubsystemVersion
  exe.writeUInt16LE(0, oh + 50); // MinorSubsystemVersion
  exe.writeUInt32LE(0, oh + 52); // Win32VersionValue
  exe.writeUInt32LE(sizeOfImage, oh + 56); // SizeOfImage
  exe.writeUInt32LE(headersSize, oh + 60); // SizeOfHeaders = 0x400
  exe.writeUInt32LE(0, oh + 64); // CheckSum
  exe.writeUInt16LE(2, oh + 68); // Subsystem = IMAGE_SUBSYSTEM_WINDOWS_GUI (2)
  exe.writeUInt16LE(0, oh + 70); // DllCharacteristics
  exe.writeUInt32LE(0x00100000, oh + 72); // SizeOfStackReserve
  exe.writeUInt32LE(0x00001000, oh + 76); // SizeOfStackCommit
  exe.writeUInt32LE(0x00100000, oh + 80); // SizeOfHeapReserve
  exe.writeUInt32LE(0x00001000, oh + 84); // SizeOfHeapCommit
  exe.writeUInt32LE(0, oh + 88); // LoaderFlags
  exe.writeUInt32LE(16, oh + 92); // NumberOfRvaAndSizes = 16

  // DataDirectory[1] = Import Table (at oh + 96 + 8)
  exe.writeUInt32LE(rdataRva, oh + 96 + 8); // Import Table RVA = 0x2000
  exe.writeUInt32LE(0x3c, oh + 96 + 12); // Import Table Size = 60 bytes (3 descriptors)

  // DataDirectory[12] = IAT (at oh + 96 + 96)
  exe.writeUInt32LE(rdataRva + 0x80, oh + 96 + 96); // IAT RVA = 0x2080
  exe.writeUInt32LE(0x28, oh + 96 + 100); // IAT Size = 40 bytes

  // =========================================================================
  // 3. IMAGE_SECTION_HEADERS (3 sections at 0x178)
  // =========================================================================
  const sh = oh + 0xe0;

  // Section 1: .text
  exe.write('.text\0\0\0', sh + 0, 'ascii');
  exe.writeUInt32LE(textRawSize, sh + 8); // VirtualSize
  exe.writeUInt32LE(textRva, sh + 12); // VirtualAddress = 0x1000
  exe.writeUInt32LE(textRawSize, sh + 16); // SizeOfRawData = 0x200
  exe.writeUInt32LE(textRawOffset, sh + 20); // PointerToRawData = 0x400
  exe.writeUInt32LE(0x60000020, sh + 36); // Characteristics = CODE | EXECUTE | READ

  // Section 2: .rdata
  const sh2 = sh + 40;
  exe.write('.rdata\0\0', sh2 + 0, 'ascii');
  exe.writeUInt32LE(rdataRawSize, sh2 + 8); // VirtualSize
  exe.writeUInt32LE(rdataRva, sh2 + 12); // VirtualAddress = 0x2000
  exe.writeUInt32LE(rdataRawSize, sh2 + 16); // SizeOfRawData = 0x200
  exe.writeUInt32LE(rdataRawOffset, sh2 + 20); // PointerToRawData = 0x600
  exe.writeUInt32LE(0x40000040, sh2 + 36); // Characteristics = INITIALIZED_DATA | READ

  // Section 3: .data
  const sh3 = sh + 80;
  exe.write('.data\0\0\0', sh3 + 0, 'ascii');
  exe.writeUInt32LE(dataVirtualSize, sh3 + 8); // VirtualSize
  exe.writeUInt32LE(dataRva, sh3 + 12); // VirtualAddress = 0x3000
  exe.writeUInt32LE(dataRawSize, sh3 + 16); // SizeOfRawData
  exe.writeUInt32LE(dataRawOffset, sh3 + 20); // PointerToRawData = 0x800
  exe.writeUInt32LE(0xc0000040, sh3 + 36); // Characteristics = INITIALIZED_DATA | READ | WRITE

  // =========================================================================
  // 4. .rdata SECTION (File offset 0x600, RVA 0x2000)
  // =========================================================================
  // Import Descriptor 1: KERNEL32.dll
  exe.writeUInt32LE(0x2040, rdataRawOffset + 0x00); // OriginalFirstThunk
  exe.writeUInt32LE(0, rdataRawOffset + 0x04); // TimeDateStamp
  exe.writeUInt32LE(0, rdataRawOffset + 0x08); // ForwarderChain
  exe.writeUInt32LE(0x20b0, rdataRawOffset + 0x0c); // Name RVA ("KERNEL32.dll")
  exe.writeUInt32LE(0x2080, rdataRawOffset + 0x10); // FirstThunk (IAT RVA)

  // Import Descriptor 2: SHELL32.dll
  exe.writeUInt32LE(0x2060, rdataRawOffset + 0x14); // OriginalFirstThunk
  exe.writeUInt32LE(0, rdataRawOffset + 0x18); // TimeDateStamp
  exe.writeUInt32LE(0, rdataRawOffset + 0x1c); // ForwarderChain
  exe.writeUInt32LE(0x20c0, rdataRawOffset + 0x20); // Name RVA ("SHELL32.dll")
  exe.writeUInt32LE(0x20a0, rdataRawOffset + 0x24); // FirstThunk (IAT RVA)

  // ILT & IAT for KERNEL32.dll (at +0x40 and +0x80)
  const k32Thunks = [0x20d0, 0x20e0, 0x20f0, 0x2100, 0x2110, 0x0000];
  k32Thunks.forEach((rva, idx) => {
    exe.writeUInt32LE(rva, rdataRawOffset + 0x40 + idx * 4);
    exe.writeUInt32LE(rva, rdataRawOffset + 0x80 + idx * 4);
  });

  // ILT & IAT for SHELL32.dll (at +0x60 and +0xA0)
  const sh32Thunks = [0x2120, 0x0000];
  sh32Thunks.forEach((rva, idx) => {
    exe.writeUInt32LE(rva, rdataRawOffset + 0x60 + idx * 4);
    exe.writeUInt32LE(rva, rdataRawOffset + 0xa0 + idx * 4);
  });

  // DLL Names & Hint/Name entries
  exe.write('KERNEL32.dll\0', rdataRawOffset + 0xb0, 'ascii');
  exe.write('SHELL32.dll\0', rdataRawOffset + 0xc0, 'ascii');
  exe.write('\0\0GetTempPathA\0', rdataRawOffset + 0xd0, 'ascii');
  exe.write('\0\0CreateFileA\0', rdataRawOffset + 0xe0, 'ascii');
  exe.write('\0\0WriteFile\0', rdataRawOffset + 0xf0, 'ascii');
  exe.write('\0\0CloseHandle\0', rdataRawOffset + 0x100, 'ascii');
  exe.write('\0\0ExitProcess\0', rdataRawOffset + 0x110, 'ascii');
  exe.write('\0\0ShellExecuteA\0', rdataRawOffset + 0x120, 'ascii');
  exe.write('open\0', rdataRawOffset + 0x134, 'ascii'); // VA 0x00402134
  exe.write('msedge.exe\0', rdataRawOffset + 0x140, 'ascii'); // VA 0x00402140

  // =========================================================================
  // 5. .data SECTION (File offset 0x800, RVA 0x3000, VA 0x00403000)
  // =========================================================================
  exe.write('Generic_App_Standalone.html\0', dataRawOffset + 0x410, 'ascii'); // VA 0x00403410 (28 bytes)
  exe.write('--app="\0', dataRawOffset + 0x430, 'ascii'); // VA 0x00403430 (7 chars)
  exe.write('" --window-size=1440,920\0', dataRawOffset + 0x440, 'ascii'); // VA 0x00403440 (25 bytes incl null)

  // Copy HTML application payload to VA 0x00404000 (dataRawOffset + 0x1000)
  htmlPayload.copy(exe, dataRawOffset + dataScratchSize);

  // =========================================================================
  // 6. .text SECTION (File offset 0x400, RVA 0x1000, VA 0x00401000)
  // =========================================================================
  const lenBytes = Buffer.alloc(4);
  lenBytes.writeUInt32LE(htmlPayload.length, 0);

  const machineCode = Buffer.from([
    // 1. GetTempPathA(260, 0x00403000)
    0x68, 0x00, 0x30, 0x40, 0x00,             // push 0x00403000
    0x68, 0x04, 0x01, 0x00, 0x00,             // push 260
    0xff, 0x15, 0x80, 0x20, 0x40, 0x00,       // call dword ptr [GetTempPathA]

    // 2. Append "Generic_App_Standalone.html\0" (28 bytes) to 0x00403000 + EAX
    0x8d, 0xb8, 0x00, 0x30, 0x40, 0x00,       // lea edi, [eax + 0x00403000]
    0xbe, 0x10, 0x34, 0x40, 0x00,             // mov esi, 0x00403410
    0xb9, 0x1c, 0x00, 0x00, 0x00,             // mov ecx, 28
    0xfc,                                     // cld
    0xf3, 0xa4,                               // rep movsb

    // 3. CreateFileA(0x00403000, GENERIC_WRITE, 0, NULL, CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, NULL)
    0x6a, 0x00,                               // push 0
    0x68, 0x80, 0x00, 0x00, 0x00,             // push 0x80
    0x6a, 0x02,                               // push 2
    0x6a, 0x00,                               // push 0
    0x6a, 0x00,                               // push 0
    0x68, 0x00, 0x00, 0x00, 0x40,             // push 0x40000000
    0x68, 0x00, 0x30, 0x40, 0x00,             // push 0x00403000
    0xff, 0x15, 0x84, 0x20, 0x40, 0x00,       // call dword ptr [CreateFileA]
    0x89, 0xc3,                               // mov ebx, eax

    // 4. WriteFile(ebx, 0x00404000, htmlPayload.length, 0x00403400, NULL)
    0x6a, 0x00,                               // push 0
    0x68, 0x00, 0x34, 0x40, 0x00,             // push 0x00403400
    0x68, lenBytes[0], lenBytes[1], lenBytes[2], lenBytes[3], // push htmlPayload.length
    0x68, 0x00, 0x40, 0x40, 0x00,             // push 0x00404000
    0x53,                                     // push ebx
    0xff, 0x15, 0x88, 0x20, 0x40, 0x00,       // call dword ptr [WriteFile]

    // 5. CloseHandle(ebx)
    0x53,                                     // push ebx
    0xff, 0x15, 0x8c, 0x20, 0x40, 0x00,       // call dword ptr [CloseHandle]

    // 6. Build edgeArgsBuf at 0x00403200: '--app="<tempFilePath>" --window-size=1440,920\0'
    0xbf, 0x00, 0x32, 0x40, 0x00,             // mov edi, 0x00403200
    0xbe, 0x30, 0x34, 0x40, 0x00,             // mov esi, 0x00403430
    0xb9, 0x07, 0x00, 0x00, 0x00,             // mov ecx, 7
    0xf3, 0xa4,                               // rep movsb
    0xbe, 0x00, 0x30, 0x40, 0x00,             // mov esi, 0x00403000
    // loop_copy_path:
    0xac,                                     // lodsb
    0x84, 0xc0,                               // test al, al
    0x74, 0x03,                               // jz +3 (done_copy_path)
    0xaa,                                     // stosb
    0xeb, 0xf8,                               // jmp -8 (loop_copy_path)
    // done_copy_path:
    0xbe, 0x40, 0x34, 0x40, 0x00,             // mov esi, 0x00403440
    0xb9, 0x19, 0x00, 0x00, 0x00,             // mov ecx, 25
    0xf3, 0xa4,                               // rep movsb

    // 7. Launch standalone Windows app window via ShellExecuteA(0, "open", "msedge.exe", edgeArgsBuf, 0, 1)
    0x6a, 0x01,                               // push 1 (SW_SHOWNORMAL)
    0x6a, 0x00,                               // push 0
    0x68, 0x00, 0x32, 0x40, 0x00,             // push 0x00403200 (edgeArgsBuf)
    0x68, 0x40, 0x21, 0x40, 0x00,             // push 0x00402140 ("msedge.exe")
    0x68, 0x34, 0x21, 0x40, 0x00,             // push 0x00402134 ("open")
    0x6a, 0x00,                               // push 0
    0xff, 0x15, 0xa0, 0x20, 0x40, 0x00,       // call dword ptr [ShellExecuteA]

    // If EAX <= 32, fallback to opening tempFilePathBuf directly
    0x83, 0xf8, 0x20,                         // cmp eax, 32
    0x7f, 0x18,                               // jg +24 (exit_app)

    0x6a, 0x01,                               // push 1
    0x6a, 0x00,                               // push 0
    0x6a, 0x00,                               // push 0
    0x68, 0x00, 0x30, 0x40, 0x00,             // push 0x00403000 (tempFilePathBuf)
    0x68, 0x34, 0x21, 0x40, 0x00,             // push 0x00402134 ("open")
    0x6a, 0x00,                               // push 0
    0xff, 0x15, 0xa0, 0x20, 0x40, 0x00,       // call dword ptr [ShellExecuteA]

    // exit_app:
    0x6a, 0x00,                               // push 0
    0xff, 0x15, 0x90, 0x20, 0x40, 0x00,       // call dword ptr [ExitProcess]
  ]);

  machineCode.copy(exe, textRawOffset);

  return exe;
}

/**
 * Generates and caches a true Windows PE32 executable (Generic.exe) that embeds
 * the complete Generic standalone offline application and launches it as a
 * standalone Windows desktop application for offline client presentations.
 */
export function generateGenericExeBuffer(): Buffer {
  if (cachedExeBuffer) {
    return cachedExeBuffer;
  }
  const htmlContent = generateStandaloneAppHtml();
  const htmlBuffer = Buffer.from(htmlContent, 'utf-8');
  cachedExeBuffer = buildWindowsPeExecutable(htmlBuffer);
  return cachedExeBuffer;
}
