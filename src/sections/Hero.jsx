import { useRef } from 'react'
import { useParallax } from '../hooks/scroll.js'
import Button from '../components/Button.jsx'
import CarLines from '../components/CarLines.jsx'
import { whatsappUrl } from '../data/site.js'
import taller from '../assets/img/taller-mecanico.webp'
import styles from './Hero.module.css'

// Datos rápidos debajo de los botones
const facts = ['Desde 1995 en Córdoba', 'Todas las marcas', 'Scanners Autel']

export default function Hero() {
  const photoRef = useRef(null)
  useParallax(photoRef, 0.06)
  return (
    <section id="inicio" className={`peg ${styles.hero}`} aria-labelledby="inicio-titulo">
      <CarLines parts={['nose', 'roof', 'belt', 'hood']} viewBox="0 14 300 50" className={styles.lines} />
      <div className={`container ${styles.grid}`}>
        <div className={styles.head}>
          <span className="dymo" style={{ transform: 'rotate(-2deg)' }} data-reveal="left" data-delay="0.1">
            Taller mecánico en Córdoba
          </span>
          <h1 id="inicio-titulo" className={`display ${styles.title}`} data-reveal="title" data-delay="0.2">
            Mecánica integral
          </h1>
          <p className={`display ${styles.tagline}`} data-reveal="up" data-delay="0.4">
            Acá se arregla todo.
          </p>
        </div>

        <figure className={styles.photo} data-reveal="pop" data-delay="0.35">
          <span className="tape" style={{ top: -14, left: '12%', transform: 'rotate(-6deg)' }} />
          <span className="tape" style={{ top: -14, right: '12%', transform: 'rotate(5deg)' }} />
          <div className={styles.frame} ref={photoRef} data-reveal="photo" data-delay="0.55">
            <img src={taller} alt="Mecánico del taller con la remera de William Rally Group junto a un auto" width="1600" height="825" fetchPriority="high" />
          </div>
          <figcaption>El taller de Rodríguez Peña 3210.</figcaption>
        </figure>

        <div className={styles.body}>
          <p className={styles.text} data-reveal="up" data-delay="0.5">
            Arreglamos autos de todas las marcas, nafta y diésel: service, motor, caja, tren delantero, frenos y
            electricidad. Diagnosticamos con scanners Autel de última generación y te decimos qué tiene tu auto antes de
            tocar nada.
          </p>
          <div className={styles.actions} data-stagger="pop" data-delay="0.65" data-step="0.1">
            <Button href={whatsappUrl()}>Pedir turno por WhatsApp</Button>
            <Button href="#servicios" variant="grafito">Ver qué hacemos</Button>
          </div>
          <ul className={styles.facts} data-stagger="up" data-delay="0.8" data-step="0.08">
            {facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
