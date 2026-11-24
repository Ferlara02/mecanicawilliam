import SectionTitle from '../components/SectionTitle.jsx'
import ToolIcon from '../components/ToolIcon.jsx'
import CarLines from '../components/CarLines.jsx'
import { services } from '../data/site.js'
import styles from './Services.module.css'

const tilt = [-1.5, 1, -0.5, 1.5, -1, 0.5, 1, -1.5, 0.5]

export default function Services() {
  return (
    <section id="servicios" className={styles.section}>
      <CarLines parts={['wheelFront']} viewBox="188 49 34 48" className={styles.lines} />
      <div className="container">
        <div className={`grid-2 ${styles.head}`}>
          <SectionTitle>Hacemos todo. Del service al motor completo.</SectionTitle>
          <p className="lead" data-reveal="up" data-delay="0.2">No derivamos tu auto a otro taller: todas las marcas y todos los trabajos, en el mismo lugar y con el mismo equipo.</p>
        </div>
        <ul className={`peg ${styles.board}`} data-reveal="up" data-delay="0.1">
          {services.map((s, i) => (
            <li key={s.name} className={styles.item} data-reveal="pop" style={{ '--d': `${0.15 + (i % 3) * 0.1 + Math.floor(i / 3) * 0.05}s` }}>
              <div className={styles.tool}>
                <ToolIcon name={s.tool} color="var(--oro)" strokeWidth={7} className={styles.shadow} />
                <ToolIcon name={s.tool} color="var(--grafito)" />
              </div>
              <h3 className="dymo" style={{ transform: `rotate(${tilt[i % tilt.length]}deg)` }}>{s.name}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
