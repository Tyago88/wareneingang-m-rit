/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ NETLIFY OPTIMIERUNG: Build-Fehler nicht mehr ignorieren
  // Entfernt: eslint.ignoreDuringBuilds und typescript.ignoreBuildErrors
  // Grund: Netlify braucht saubere Builds für optimale Performance
  
  // ✅ NETLIFY IMAGE CDN: Aktiviert automatische Bildoptimierung
  // Entfernt: images.unoptimized = true
  // Grund: Netlify Image CDN bietet bessere Performance als unoptimierte Bilder
  images: {
    // Externe Domains können hier hinzugefügt werden falls nötig
    domains: [],
    // Netlify Image CDN wird automatisch verwendet
  },
  
  // ✅ NETLIFY DEPLOYMENT: Optimiert für Netlify's OpenNext Adapter
  // Standalone Output für bessere Performance (optional)
  output: 'standalone',
  
  // ✅ NETLIFY COMPATIBILITY: Experimentelle Features für bessere Netlify-Integration
  experimental: {
    // Optimiert für Netlify's Edge Functions
    serverComponentsExternalPackages: [],
  },
}

export default nextConfig
