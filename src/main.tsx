import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
// Fuentes empaquetadas con la aplicación: en intranet no hay acceso a CDN externos.
import '@fontsource-variable/figtree/wght.css'
import '@fontsource-variable/noto-sans/wght.css'
import './index.css'
import { App } from './App'
import { ProveedorEstado } from './lib/store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <ProveedorEstado>
        <App />
      </ProveedorEstado>
    </HashRouter>
  </StrictMode>,
)
