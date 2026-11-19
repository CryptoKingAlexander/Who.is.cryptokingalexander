import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { TECH_CARDS, SECTIONS } from './lib/dataset.ts';

const baseUrl = process.env.APP_URL || 'https://generic.app';
const lastModDate = new Date().toISOString();

function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function calculatePriority(card) {
  let priority = 0.6;
  const cat = (card.category || '').toLowerCase();
  const sub = (card.subcategory || '').toLowerCase();
  const title = (card.title || '').toLowerCase();

  if (
    cat.includes('ai') ||
    cat.includes('learning') ||
    cat.includes('agent') ||
    sub.includes('synthesis') ||
    title.includes('agent')
  ) {
    priority = 0.85;
  } else if (
    cat.includes('monetization') ||
    cat.includes('economics') ||
    cat.includes('saas') ||
    sub.includes('revenue')
  ) {
    priority = 0.8;
  } else if (
    cat.includes('defense') ||
    cat.includes('cyber') ||
    cat.includes('security') ||
    cat.includes('tactical')
  ) {
    priority = 0.75;
  } else if (card.level === 'Frontier' || card.level === 'Advanced') {
    priority = 0.7;
  }
  return priority.toFixed(2);
}

function generateSitemap() {
  console.log(`[Sitemap Generator] Scanning Generic hyper-book architecture...`);
  console.log(`[Sitemap Generator] Found ${SECTIONS.length} sections and ${TECH_CARDS.length} node cards.`);

  const xmlEntries = [];

  // Home Page
  xmlEntries.push(`  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${lastModDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.00</priority>
  </url>`);

  // Privacy Page
  xmlEntries.push(`  <url>
    <loc>${baseUrl}/privacy</loc>
    <lastmod>${lastModDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.30</priority>
  </url>`);

  // Section Filter Views
  SECTIONS.forEach((sec) => {
    if (sec.id === 'all') return;
    xmlEntries.push(`  <url>
    <loc>${baseUrl}/?section=${escapeXml(sec.id)}</loc>
    <lastmod>${lastModDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.70</priority>
  </url>`);
  });

  // Node Cards
  TECH_CARDS.forEach((card) => {
    const priority = calculatePriority(card);
    const cardUrl = `${baseUrl}/node/${escapeXml(card.id)}`;
    
    xmlEntries.push(`  <url>
    <loc>${cardUrl}</loc>
    <lastmod>${lastModDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
    <image:image>
      <image:loc>${baseUrl}/icon.svg</image:loc>
      <image:title>${escapeXml(card.title)}</image:title>
      <image:caption>${escapeXml(card.description)}</image:caption>
    </image:image>
  </url>`);
  });

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
<!-- Generic Hyper-Book Architecture Dynamic Sitemap -->
<!-- Total Node Cards Indexed: ${TECH_CARDS.length} -->
<!-- Total Sections Indexed: ${SECTIONS.length} -->
${xmlEntries.join('\n')}
</urlset>
`;

  const publicPath = resolve(process.cwd(), 'public', 'sitemap.xml');

  writeFileSync(publicPath, sitemapXml, 'utf-8');

  console.log(`[Sitemap Generator] Successfully generated sitemap.xml with ${TECH_CARDS.length + SECTIONS.length + 2} URLs.`);
  console.log(`[Sitemap Generator] Written to ${publicPath}`);
}

generateSitemap();
