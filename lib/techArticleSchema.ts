import { TechCard } from '@/types/techbook';

export function generateTechArticleSchema(card: TechCard, currentUrl?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: card.title,
    description: card.description,
    articleSection: card.category,
    keywords: (card.tagSoup || []).slice(0, 15).join(','),
    url: currentUrl || `https://example.com/node/${card.id}`,
    author: {
      '@type': 'Organization',
      name: 'Generic Systems Architecture Group',
    },
  };
}

export function getSpecialistJargonKeywords(card: TechCard): string[] {
  return (card.jargon || []).map((j) => j.term);
}
