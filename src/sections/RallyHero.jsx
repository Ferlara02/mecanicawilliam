import Button from '../components/Button.jsx'
import CarLines from '../components/CarLines.jsx'
import Stripes from '../components/Stripes.jsx'
import { Logo } from '../components/Logo.jsx'
import { useRef } from 'react'
import { useParallax } from '../hooks/scroll.js'
import { whatsappUrl } from '../data/site.js'
import rally517 from '../assets/img/rally-517.webp'
import styles from './RallyHero.module.css'

export default function RallyHero() {
  const photoRef = useRef(null)
  useParallax(photoRef, 0.08)
  return (
    <section id="rally" className={styles.section} aria-labelledby="rally-titulo">
      <CarLines parts={['roof', 'belt']} viewBox="116 14 184 34" className={styles.lines} color="var(--rojo)" strokeWidth={3} opacity={0.55} />
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <div className={styles.logo} data-reveal="left"><Logo color="var(--grafito)" descriptor="rally" title="William Rally Group" /></div>
          <h2 id="rally-titulo" className={`display ${styles.title}`} data-reveal="title" data-delay="0.1">
            Preparamos autos campeones. <span>El tuyo también.</span>
          </h2>
          <p className="lead" data-reveal="up" data-delay="0.25">
            William Rally Group arma autos y motores de competición desde 1995. La precisión que usamos en el tramo es la
            misma que usamos con tu auto de todos los días.
          </p>
          <div className={styles.actions} data-stagger="pop" data-delay="0.4" data-step="0.1">
            <Button href={whatsappUrl('Hola, quiero consultar por el armado de un auto de rally.')} variant="rojo">Consultar por un armado</Button>
            <Button href="#titulos" variant="grafito">Ver los títulos</Button>
          </div>
        </div>
        <div className={styles.photoWrap} data-reveal="photo-r" data-delay="0.1">
          <img ref={photoRef} className={styles.photo} src={rally517} alt={'Ford Ka N2 de los Torres en la "Cueva"'} width="1600" height="825" loading="lazy" data-zoom tabIndex={0} />
        </div>
      </div>
      <div className={styles.stripes} data-reveal="sweep" data-delay="0.2"><Stripes /></div>
    </section>
  )
}
