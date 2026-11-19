import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Generic Tactical Architecture Hyperbook',
  description:
    'OMNICLEARANCE Super Hyperbook backed by OmniSingularity Training Set Math: 1,526+ multi-domain systems architecture blueprints across 56 Normal & Tactical categories with HJB, Symplectic Liouville, Fisher-Rao, and Wald SPRT mathematical proofs.',
  openGraph: {
    title: 'Generic Tactical Architecture Hyperbook',
    description:
      'OMNICLEARANCE Super Hyperbook backed by OmniSingularity Training Set Math: 1,526+ multi-domain systems architecture blueprints across 56 Normal & Tactical categories with HJB, Symplectic Liouville, Fisher-Rao, and Wald SPRT mathematical proofs.',
  },
  other: {
    'x-omniclearance': 'OMNICLEARANCE-TIER-0-SUPREME',
    'x-omnisingularity-training-set-math': 'ENABLED-SYMPLECTIC-HJB-FISHER-RAO-SPRT',
    'x-super-hyperbook': 'TRUE-1526-NODES-56-CATEGORIES',
    'dev-server-clearance': 'omniclearance backed by omnisingularity training set math in a super hyperbook',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="omniclearance"
          content="OMNICLEARANCE backed by OmniSingularity training set math in a Super Hyperbook"
        />
        <meta
          name="omnisingularity-training-set-math"
          content="Symplectic Liouville (det J = 1), Hamilton-Jacobi-Bellman, Fisher-Rao Natural Gradient, Wald SPRT, Hawkes Point Process"
        />
        <meta name="super-hyperbook-nodes" content="1526" />
        <meta name="super-hyperbook-categories" content="56" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#070b12] text-slate-100 antialiased selection:bg-cyan-500 selection:text-black"
      >
        {children}
      </body>
    </html>
  );
}
