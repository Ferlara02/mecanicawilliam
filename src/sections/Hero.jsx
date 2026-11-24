import { useRef } from 'react'
import { useParallax } from '../hooks/scroll.js'
import Button from '../components/Button.jsx'
import CarLines from '../components/CarLines.jsx'
import { whatsappUrl } from '../data/site.js'
import taller from '../assets/img/taller-mecanico.webp'
import styles from './Hero.module.css'

export default function Hero() {
  const photoRef = useRef(null)
  useParallax(photoRef, 0.06)
  return (
    <section id="inicio" className={`peg ${styles.hero}`}>
      <CarLines parts={['nose', 'roof', 'belt', 'hood']} viewBox="0 14 300 50" className={styles.lines} />
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <span className="dymo" style={{ transform: 'rotate(-2deg)' }} data-reveal="left" data-delay="0.1">Córdoba, desde 1995</span>
          <h1 className={`display ${styles.title}`} data-reveal="title" data-delay="0.2">Acá se arregla todo.</h1>
          <p className={styles.text} data-reveal="up" data-delay="0.45">
            Todas las marcas, todos los trabajos: service, motor, caja, tren delantero, frenos y electricidad.
            Diagnóstico computarizado con scanners Autel.
          </p>
          <div className={styles.actions} data-stagger="pop" data-delay="0.6" data-step="0.1">
            <Button href={whatsappUrl()}>Pedir turno por WhatsApp</Button>
            <Button href="#servicios" variant="grafito">Ver qué hacemos</Button>
          </div>
        </div>
        <figure className={styles.photo} data-reveal="pop" data-delay="0.35">
          <span className="tape" style={{ top: -14, left: 28, transform: 'rotate(-6deg)' }} />
          <span className="tape" style={{ top: -14, right: 28, transform: 'rotate(5deg)' }} />
          <div className={styles.frame} ref={photoRef} data-reveal="photo" data-delay="0.55">
            <img src={taller} alt="Mecánico del taller con la remera de William Rally Group junto a un auto" width="1600" height="825" fetchPriority="high" />
          </div>
          <figcaption>El taller de Rodríguez Peña 3210.</figcaption>
        </figure>
      </div>
    </section>
  )
}
