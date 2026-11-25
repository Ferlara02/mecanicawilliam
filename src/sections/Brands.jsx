import { brands } from '../data/site.js'
import styles from './Brands.module.css'

export default function Brands() {
  // La lista va dos veces para que la cinta sea continua
  const loop = [...brands, ...brands]
  return (
    <section id="marcas" aria-labelledby="marcas-titulo" className={styles.band}>
      <div className={`container ${styles.head}`} data-reveal="up">
        <h2 id="marcas-titulo" className="display">Todas las marcas</h2>
        <p>Nafta y diésel, nacionales e importados.</p>
      </div>
      <div className={styles.viewport} data-reveal="up" data-delay="0.15">
        <ul className={styles.track}>
          {loop.map((b, i) => (
            <li key={i} className={styles.chip} aria-hidden={i >= brands.length || undefined}>
              <img src={b.src} alt={i < brands.length ? b.name : ''} loading="lazy" width="120" height="70" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
