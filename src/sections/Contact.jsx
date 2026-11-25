import Button from '../components/Button.jsx'
import CarLines from '../components/CarLines.jsx'
import GoogleMap from '../components/GoogleMap.jsx'
import { Logo } from '../components/Logo.jsx'
import { contact, whatsappUrl } from '../data/site.js'
import styles from './Contact.module.css'

const YEAR = new Date().getFullYear()

export default function Contact() {
  return (
    <footer id="contacto" className={styles.section}>
      <CarLines
        parts={['hood', 'nose', 'roof', 'belt', 'sillFront', 'sillRear', 'wheelFront', 'wheelRear']}
        viewBox="0 14 300 72"
        className={styles.lines}
        color="var(--oro)"
        strokeWidth={2.5}
        opacity={0.3}
      />
      <div className={`container ${styles.inner}`}>
        <div className={`grid-2 ${styles.cta}`}>
          <h2 className={`display ${styles.title}`} data-reveal="title">Pedí tu turno.</h2>
          <div className={styles.ctaText} data-stagger="up" data-delay="0.2" data-step="0.12">
            <p>Mandanos por WhatsApp el modelo del auto y qué le pasa. Te respondemos con día y horario.</p>
            <Button href={whatsappUrl()}>WhatsApp {contact.whatsappLabel}</Button>
          </div>
        </div>

        <div id="ubicacion" className={styles.place}>
          <div className={styles.info} data-stagger="up" data-delay="0.1" data-step="0.1">
            <div>
              <h3>Dónde estamos</h3>
              <address>{contact.address.map((l) => <span key={l}>{l}<br /></span>)}</address>
              <a href={contact.mapsUrl} target="_blank" rel="noopener noreferrer">Cómo llegar</a>
            </div>
            <div>
              <h3>Horarios</h3>
              <p>{contact.hours.map((h) => <span key={h}>{h}<br /></span>)}</p>
            </div>
            <div>
              <h3>Redes</h3>
              <p className={styles.links}>
                <a href={contact.instagram.url} target="_blank" rel="noopener noreferrer">Instagram {contact.instagram.handle}</a>
                <a href={contact.facebook.url} target="_blank" rel="noopener noreferrer">Facebook</a>
              </p>
            </div>
          </div>
          <div className={styles.map} data-reveal="up" data-delay="0.2">
            <GoogleMap query={contact.mapQuery} title="Ubicación de Mecánica William en Google Maps" />
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.logo} data-reveal="left"><Logo descriptor="mecanica" /></div>
          <p>© {YEAR} Mecánica William. Córdoba, Argentina.</p>
        </div>
      </div>
    </footer>
  )
}
