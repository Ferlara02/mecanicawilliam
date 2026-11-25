import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/global.css'
import './styles/reveal.css'
import App from './App.jsx'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// En producción el HTML ya viene armado (prerender): React solo lo "activa".
// En desarrollo (npm run dev) la página se arma en el navegador.
if (root.firstElementChild) hydrateRoot(root, app)
else createRoot(root).render(app)
