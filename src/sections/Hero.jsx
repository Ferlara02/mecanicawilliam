import { useRef } from 'react'
import { useParallax } from '../hooks/scroll.js'
import Button from '../components/Button.jsx'
import CarLines from '../components/CarLines.jsx'
import { contact, whatsappUrl } from '../data/site.js'
import taller from '../assets/img/taller-mecanico.webp'
import styles from './Hero.module.css'

// Datos rápidos debajo de los botones
const facts = ['Desde 1995', 'Todas las marcas', 'Scanners Autel']

function PinIcon() {
  return (
    <svg viewBox="0 0 24 30" aria-hidden="true" className={styles.pinIcon}>
      <path d="M12 1.5C6.8 1.5 2.8 5.5 2.8 10.6c0 6.6 9.2 17.4 9.2 17.4s9.2-10.8 9.2-17.4C21.2 5.5 17.2 1.5 12 1.5z" fill="var(--oro)" stroke="var(--grafito)" strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx="12" cy="10.6" r="3.4" fill="var(--grafito)" />
    </svg>
  )
}

export default function Hero() {
  const photoRef = useRef(null)
  useParallax(photoRef, 0.06)
  return (
    <section id="inicio" className={`peg ${styles.hero}`} aria-labelledby="inicio-titulo">
      <CarLines parts={['nose', 'roof', 'belt', 'hood']} viewBox="0 14 300 50" className={styles.lines} />
      <div className={`container ${styles.grid}`}>
        <div className={styles.head}>
          <span className="dymo" style={{ transform: 'rotate(-2deg)' }} data-reveal="left" data-delay="0.1">
            Taller Mecánico
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
            <img src={taller} alt="Cachi, el mecánico del taller, con la remera de William Rally Group junto a un auto" width="1600" height="825" fetchPriority="high" data-zoom="polaroid" tabIndex={0} />
          </div>
          <figcaption>Cachi, el mecánico.</figcaption>
        </figure>

        <div className={styles.body}>
          <p className={styles.text} data-reveal="up" data-delay="0.5">
            Servicio mecánico integral: service, motor, caja, tren delantero, frenos. Diagnóstico computarizado con
            scanners de última generación.
          </p>
          <div className={styles.actions} data-stagger="pop" data-delay="0.65" data-step="0.1">
            <Button href={whatsappUrl()}>Pedir turno por WhatsApp</Button>
            <Button href="#servicios" variant="grafito">Ver qué hacemos</Button>
          </div>
          <div className={styles.extra} data-stagger="up" data-delay="0.8" data-step="0.08">
            <a href="#ubicacion" className={styles.pin}>
              <PinIcon />
              <span>{contact.shortAddress}</span>
            </a>
            <ul className={styles.facts}>
              {facts.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
