import SectionTitle from '../components/SectionTitle.jsx'
import CarLines from '../components/CarLines.jsx'
import { workSteps } from '../data/site.js'
import styles from './WorkOrder.module.css'

export default function WorkOrder() {
  return (
    <section id="trabajo" className={styles.section}>
      <CarLines parts={['sillFront', 'sillRear', 'wheelRear']} viewBox="84 48 200 40" className={styles.lines} />
      <div className="container grid-2">
        <div className={styles.intro}>
          <SectionTitle>Así trabajamos con tu auto.</SectionTitle>
          <p className="lead" data-reveal="up" data-delay="0.2">Cada auto que entra tiene su orden de trabajo. La vas a ver completa antes de pagar.</p>
        </div>
        <div className={styles.sheet} data-reveal="right" data-delay="0.1">
          <div className={styles.sheetHead}>
            <h3 className="display">Orden de trabajo</h3>
            <span>Mecánica William</span>
          </div>
          <ol className={styles.list} data-stagger="left" data-delay="0.35" data-step="0.12">
            {workSteps.map((s, i) => (
              <li key={s.title}>
                <span className={styles.check} aria-hidden="true">
                  <svg viewBox="0 0 20 20" width="22"><path pathLength="1" d="M3 10.5 L8 15 L17 4" fill="none" stroke="var(--grafito)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                <div>
                  <h4 className="display">{i + 1}. {s.title}</h4>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
