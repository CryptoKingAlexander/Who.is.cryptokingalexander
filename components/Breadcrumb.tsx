'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { TechCard } from '@/types/techbook';

interface BreadcrumbProps {
  card: TechCard;
}

export function Breadcrumb({ card }: BreadcrumbProps) {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/10 border border-stone-800/10 backdrop-blur-[2px] transition-opacity hover:opacity-100 opacity-60 w-fit"
    >
      <Link 
        href="/" 
        className="flex items-center gap-1 text-[10px] font-mono text-stone-400 hover:text-amber-400 uppercase tracking-widest"
      >
        <Home className="w-2.5 h-2.5" />
        <span className="hidden xs:inline">Home</span>
      </Link>
      
      <ChevronRight className="w-2.5 h-2.5 text-stone-600" />
      
      <Link 
        href={`/?section=${card.sectionId}`}
        className="text-[10px] font-mono text-stone-400 hover:text-amber-400 uppercase tracking-widest truncate max-w-[100px] xs:max-w-none"
      >
        {card.category}
      </Link>
      
      <ChevronRight className="w-2.5 h-2.5 text-stone-600" />
      
      <span className="text-[10px] font-mono text-stone-200 uppercase tracking-widest truncate max-w-[120px] xs:max-w-none font-bold">
        {card.title}
      </span>

      {/* JSON-LD for Breadcrumb SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': 'https://generic.app/'
              },
              {
                '@type': 'ListItem',
                'position': 2,
                'name': card.category,
                'item': `https://generic.app/?section=${card.sectionId}`
              },
              {
                '@type': 'ListItem',
                'position': 3,
                'name': card.title,
                'item': `https://generic.app/node/${card.id}`
              }
            ]
          })
        }}
      />
    </nav>
  );
}
