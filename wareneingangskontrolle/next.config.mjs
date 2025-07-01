/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ NETLIFY STATIC EXPORT: Für optimales Deployment ohne Server
  // Grund: Statischer Export verhindert "Page not found" Fehler
  output: 'export',
  trailingSlash: true,
  
  // ✅ NETLIFY STATIC COMPATIBILITY: Bilder für statischen Export optimiert
  // Grund: Statischer Export benötigt unoptimierte Bilder
  images: {
    unoptimized: true
  },
  
  // ✅ NETLIFY COMPATIBILITY: Korrigierte experimentelle Features
  // Fix: serverComponentsExternalPackages → serverExternalPackages (Deprecation behoben)
  experimental: {
    serverExternalPackages: [],
  },
}

export default nextConfig
