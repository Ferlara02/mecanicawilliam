import { brands } from '../data/site.js'
import styles from './Brands.module.css'

// Cuántas veces se repite la lista dentro de cada tramo de la cinta.
// Cada tramo tiene que ser más ancho que la pantalla más grande, para que nunca quede un hueco.
const REPEAT = 3

export default function Brands() {
  const group = Array.from({ length: REPEAT }, () => brands).flat()
  return (
    <section id="marcas" aria-labelledby="marcas-titulo" className={styles.band}>
      <div className={`container ${styles.head}`} data-reveal="up">
        <h2 id="marcas-titulo" className="display">Todas las marcas</h2>
        <p>Nafta y diésel, nacionales e importados.</p>
      </div>
      <div className={styles.viewport} data-reveal="up" data-delay="0.15">
        {/* Dos tramos idénticos: la cinta se mueve exactamente un tramo y vuelve a empezar sin que se note */}
        <div className={styles.track}>
          {[0, 1].map((copy) => (
            <ul key={copy} className={styles.group} aria-hidden={copy === 1 || undefined}>
              {group.map((b, i) => {
                const visible = copy === 0 && i < brands.length
                return (
                  <li key={`${b.name}-${i}`} className={styles.chip} aria-hidden={visible ? undefined : true}>
                    <img src={b.src} alt={visible ? b.name : ''} width="120" height="70" decoding="async" />
                  </li>
                )
              })}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
