import { TechCard } from '@/types/techbook';

export function getPowerTitleForCard(card: TechCard): string {
  return `${card.title} | Tactical Systems Architecture`;
}

export function getPowerDescriptionForCard(card: TechCard): string {
  return card.description || 'Tactical high-assurance systems architecture specification.';
}
