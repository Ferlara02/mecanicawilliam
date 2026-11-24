import SectionTitle from '../components/SectionTitle.jsx'
import CarLines from '../components/CarLines.jsx'
import { reviews, contact } from '../data/site.js'
import styles from './Reviews.module.css'

export default function Reviews() {
  return (
    <section className={styles.section} aria-labelledby="opiniones-titulo">
      <CarLines parts={['wheelRear']} viewBox="266 48 26 48" className={styles.lines} />
      <div className="container">
        <div className={styles.head}>
          <SectionTitle id="opiniones-titulo">Lo que dicen los clientes.</SectionTitle>
          <a href={contact.reviewsUrl} target="_blank" rel="noopener noreferrer" className={styles.more} data-reveal="right" data-delay="0.2">Ver todas las opiniones en Google</a>
        </div>
        <div className="grid-2" data-stagger="up" data-delay="0.1" data-step="0.15">
          {reviews.map((r) => (
            <figure key={r.author} className={styles.review}>
              <blockquote className="display">«{r.quote}»</blockquote>
              <figcaption>{r.author}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
