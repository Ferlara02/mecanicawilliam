import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { structuredData } from './seo/structured-data.js'

// Dirección pública de la web. Cuando tengas dominio propio, cargalo como VITE_SITE_URL
// (en .env.local y en Cloudflare Pages) y todo el SEO se actualiza solo.
const DEFAULT_SITE_URL = 'https://mecanicawilliam.com.ar'

/** Completa los datos de SEO en index.html y genera robots.txt y sitemap.xml al compilar. */
function seo(siteUrl) {
  return {
    name: 'mecanica-william-seo',
    transformIndexHtml(html) {
      const jsonLd = JSON.stringify(structuredData(siteUrl), null, 2).replace(/</g, '\\u003c')
      return html.replaceAll('%SITE_URL%', siteUrl).replace('%JSON_LD%', jsonLd)
    },
    generateBundle(_, bundle) {
      if (this.environment?.config?.build?.ssr) return
      const today = new Date().toISOString().slice(0, 10)
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
    <image:image><image:loc>${siteUrl}/og.jpg</image:loc></image:image>
  </url>
</urlset>
`,
      })
      void bundle
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '')
  return {
    plugins: [react(), seo(siteUrl)],
  }
})
