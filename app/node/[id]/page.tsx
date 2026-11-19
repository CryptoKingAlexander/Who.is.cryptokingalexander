import { notFound } from 'next/navigation';
import { TECH_CARDS } from '../../../lib/dataset';
import { NodePageClient } from './NodePageClient';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

function safeDecodeParam(rawId: string): string {
  try {
    return decodeURIComponent(rawId).trim();
  } catch {
    return String(rawId || '').trim();
  }
}

function resolveCardById(rawId: string) {
  const decodedId = safeDecodeParam(rawId);
  const lowerId = decodedId.toLowerCase();
  return (
    TECH_CARDS.find((c) => c.id === decodedId) ||
    TECH_CARDS.find((c) => c.id.toLowerCase() === lowerId)
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const card = resolveCardById(resolvedParams?.id || '');

  if (!card) {
    return {
      title: 'Node Not Found | Tactical Compendium',
    };
  }

  return {
    title: `${card.title} | Defense Specification Node`,
    description: card.description,
    openGraph: {
      title: card.title,
      description: card.description,
    },
  };
}

export default async function NodeDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const card = resolveCardById(resolvedParams?.id || '');

  if (!card) {
    notFound();
  }

  return <NodePageClient card={card} />;
}
