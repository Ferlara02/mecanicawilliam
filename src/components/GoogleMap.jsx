import styles from './GoogleMap.module.css'

// Clave de la Maps Embed API de Google (gratuita). Se define en .env.local y en Cloudflare Pages
// como VITE_GOOGLE_MAPS_API_KEY. Sin clave, usa el mapa embebido de la ficha de Google (embedUrl),
// que abre con la tarjeta del lugar ya seleccionada (Google la muestra si el mapa mide ~400 px o más).
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

export default function GoogleMap({ query, embedUrl, zoom = 17, title = 'Mapa' }) {
  const q = encodeURIComponent(query)
  const src = API_KEY
    ? `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${q}&zoom=${zoom}&language=es&region=AR`
    : embedUrl || `https://maps.google.com/maps?q=${q}&z=${zoom}&hl=es&output=embed`
  return (
    <div className={styles.frame}>
      <div className={styles.mapBox}>
        <iframe
          className={styles.map}
          src={src}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  )
}
