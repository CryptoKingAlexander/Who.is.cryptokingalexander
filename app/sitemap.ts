import type { MetadataRoute } from 'next';
import { TECH_CARDS } from '@/lib/dataset';

export const dynamic = 'force-dynamic';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://generic.app';
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  for (const card of TECH_CARDS) {
    routes.push({
      url: `${baseUrl}/node/${card.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }

  return routes;
}
