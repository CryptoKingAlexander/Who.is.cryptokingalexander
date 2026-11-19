import { TechCard } from '@/types/techbook';

export function computeSemanticComplexityIndex(card: TechCard): number {
  if (card.fundamentalPrerequisiteScore && card.technicalAbstractionDepth) {
    return Math.round((card.fundamentalPrerequisiteScore * 0.5) + (card.technicalAbstractionDepth * 0.5));
  }
  const levelWeight: Record<string, number> = {
    Fundamental: 25,
    Intermediate: 45,
    Advanced: 68,
    Frontier: 88,
    Expert: 96,
  };
  const base = levelWeight[card.level] || 50;
  const eqBonus = Math.min(20, (card.equations?.length || 0) * 4);
  return Math.min(100, base + eqBonus);
}

export function computeProfitabilityDeviationScore(card: TechCard): number {
  if (card.profitabilityScore) {
    return card.profitabilityScore;
  }
  const complexity = computeSemanticComplexityIndex(card);
  const niche = card.nicheRarityIndex || 60;
  return Math.round((complexity * 0.4) + (niche * 0.6));
}

export function sortCardsByComplexityAscending(cards: TechCard[]): TechCard[] {
  return [...cards].sort((a, b) => computeSemanticComplexityIndex(a) - computeSemanticComplexityIndex(b));
}
