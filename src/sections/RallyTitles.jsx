import SectionTitle from '../components/SectionTitle.jsx'
import CarLines from '../components/CarLines.jsx'
import Stripes from '../components/Stripes.jsx'
import { Logo } from '../components/Logo.jsx'
import { titles, rallyPhotos } from '../data/site.js'
import styles from './RallyTitles.module.css'

export default function RallyTitles() {
  return (
    <section id="titulos" className={styles.section}>
      <CarLines
        parts={['hood', 'nose', 'roof', 'wheelFront', 'wheelRear', 'sillFront', 'sillRear']}
        viewBox="0 14 300 72"
        className={styles.lines}
        color="var(--blanco)"
        strokeWidth={2.5}
        opacity={0.3}
      />
      <div className="container">
        <div className={`grid-2 ${styles.head}`}>
          <div className={styles.headLeft}>
            <div className={styles.logo} data-reveal="left"><Logo color="var(--blanco)" descriptor="rally" title="William Rally Group" /></div>
            <SectionTitle color="var(--blanco)" underline={false}>Cuatro títulos de rally.</SectionTitle>
          </div>
          <p className="lead" style={{ color: 'var(--blanco)' }} data-reveal="up" data-delay="0.2">
            Desde 1995 en Rodríguez Peña 3210, preparando autos para el Rally Cordobés. En la década de 2010 llegó el
            elevador y dos campeonatos más del Rally Provincial.
          </p>
        </div>
        <ul className={`grid-4 ${styles.plates}`} data-stagger="plate" data-delay="0.1" data-step="0.12">
          {titles.map((t) => (
            <li key={t.year}>
              <div className={styles.plate}>
                <span className={styles.plateTop}>Campeones</span>
                <span className={`display ${styles.year}`}>{t.year}</span>
              </div>
              <p>{t.text}</p>
            </li>
          ))}
        </ul>
        <ul className={`grid-4 ${styles.photos}`} data-stagger="photo" data-delay="0.1" data-step="0.12">
          {rallyPhotos.map((ph) => (
            <li key={ph.src}><img src={ph.src} alt={ph.alt} width="400" height="200" loading="lazy" /></li>
          ))}
        </ul>
      </div>
      <div data-reveal="sweep"><Stripes /></div>
    </section>
  )
}
