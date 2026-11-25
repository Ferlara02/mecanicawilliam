// Inserta el HTML ya renderizado de la página dentro de dist/index.html.
// Corre después de `vite build` y `vite build --ssr` (ver "build" en package.json).
import { readFile, writeFile, rm } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const dist = path.resolve('dist')
const ssrDir = path.resolve('dist-ssr')

const { render } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)
const appHtml = render()
const indexPath = path.join(dist, 'index.html')
const template = await readFile(indexPath, 'utf8')
if (!template.includes('<!--app-html-->')) throw new Error('No se encontró <!--app-html--> en dist/index.html')
await writeFile(indexPath, template.replace('<!--app-html-->', appHtml))
await rm(ssrDir, { recursive: true, force: true })
console.log(`✓ Prerender: ${(appHtml.length / 1024).toFixed(1)} kB de HTML en dist/index.html`)
