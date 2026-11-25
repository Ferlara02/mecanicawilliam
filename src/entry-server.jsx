// Se usa solo al compilar: arma el HTML de la página para que llegue completo a Google
// y a las redes sociales, sin depender de JavaScript (ver scripts/prerender.js).
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.jsx'

export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
