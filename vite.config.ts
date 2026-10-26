import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { Plugin } from 'postcss'

// Blueprint declara @charset en su CSS; dentro de una capa CSS ya no es válido.
const normalizarCharset: Plugin = {
  postcssPlugin: 'rce-normalizar-charset',
  Once(root) { root.walkAtRules('charset', (regla) => { regla.remove() }) },
}

// base relativa: el build funciona en cualquier ruta (servidor de intranet o GitHub Pages).
export default defineConfig({
  base: './',
  // Vite optimiza el CSS al final, después de retirar el @charset importado.
  plugins: [react(), tailwindcss({ optimize: false })],
  css: { postcss: { plugins: [normalizarCharset] } },
  // Los componentes comparten un paquete; los iconos de Blueprint se cargan bajo demanda.
  build: { chunkSizeWarningLimit: 600 },
})
