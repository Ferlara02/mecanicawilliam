import { useEffect, useId, useRef, useState } from 'react'
import { Logo } from './Logo.jsx'
import Button from './Button.jsx'
import { nav, whatsappUrl } from '../data/site.js'
import { useScrolledPast } from '../hooks/scroll.js'
import styles from './Header.module.css'

// Llave fija de doble boca (viewBox 0 0 48 14). Dos de estas forman el botón del menú.
// Las bocas se recortan con una máscara para que se vea lo que hay detrás.
function Wrench({ className }) {
  // useId puede traer caracteres especiales: se limpian para usarlo dentro de url(#…)
  const id = `wrench${useId().replace(/[^\w-]/g, '')}`
  return (
    <svg viewBox="0 0 48 14" className={className} aria-hidden="true">
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x="-5" y="-5" width="58" height="24">
          <circle cx="6.6" cy="7" r="5.8" fill="#fff" />
          <circle cx="41.4" cy="7" r="5.8" fill="#fff" />
          <path d="M9 4.6 Q24 5.9 39 4.6 L39 9.4 Q24 8.1 9 9.4 Z" fill="#fff" />
          <rect x="-2" y="4.75" width="9.4" height="4.5" rx="0.6" fill="#000" transform="rotate(15 6.6 7)" />
          <rect x="40.6" y="4.75" width="9.4" height="4.5" rx="0.6" fill="#000" transform="rotate(-15 41.4 7)" />
        </mask>
      </defs>
      <rect x="-5" y="-5" width="58" height="24" fill="var(--oro)" mask={`url(#${id})`} />
    </svg>
  )
}

export default function Header() {
  const compact = useScrolledPast(40)
  const [open, setOpen] = useState(false)
  const headerRef = useRef(null)

  // Cerrar con Escape o tocando fuera del menú
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const onPointer = (e) => !headerRef.current?.contains(e.target) && setOpen(false)
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  return (
    <header ref={headerRef} className={`${styles.header} ${compact ? styles.compact : ''}`}>
      <div className={`container ${styles.bar}`}>
        <a href="#inicio" className={styles.brand} aria-label="Mecánica William, ir al inicio">
          <Logo descriptor="mecanica" draw title="Mecánica William" />
        </a>

        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="menu-principal"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="visually-hidden">{open ? 'Cerrar menú' : 'Abrir menú'}</span>
          <Wrench className={`${styles.wrench} ${styles.wrenchTop}`} />
          <Wrench className={`${styles.wrench} ${styles.wrenchBottom}`} />
        </button>

        <nav id="menu-principal" aria-label="Principal" className={`${styles.nav} ${open ? styles.open : ''}`}>
          <div className={styles.panel}>
            <ul>
              {nav.map((item, i) => (
                <li key={item.href} style={{ '--i': i }}>
                  <a href={item.href} onClick={() => setOpen(false)}>{item.label}</a>
                </li>
              ))}
            </ul>
            <div className={styles.cta} style={{ '--i': nav.length }}>
              <Button href={whatsappUrl()} variant="oro">Pedir turno</Button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
