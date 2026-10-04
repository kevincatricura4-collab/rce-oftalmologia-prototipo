import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base relativa: el build funciona en cualquier ruta (servidor de intranet o GitHub Pages).
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  // Un solo paquete de ~440 kB (132 kB comprimido) se sirve desde la intranet: no vale la pena dividirlo.
  build: { chunkSizeWarningLimit: 600 },
})
