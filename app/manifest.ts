import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Generic Tactical Architecture Hyperbook — OMNICLEARANCE Super Hyperbook",
    short_name: "SuperHyperbook",
    description: "OMNICLEARANCE Super Hyperbook backed by OmniSingularity Training Set Math across 1,526+ nodes and 56 Normal & Tactical categories.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#070a12",
    theme_color: "#ef4444",
    icons: [
      {
        src: "/pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
