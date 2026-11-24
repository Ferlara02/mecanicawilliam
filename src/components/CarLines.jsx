import { useRef } from 'react'
import { CarPart } from './Logo.jsx'
import { useInViewProgress } from '../hooks/scroll.js'
import styles from './CarLines.module.css'

/**
 * Partes del auto del logo dibujadas de fondo. Se trazan a medida que la sección entra en pantalla.
 * parts: claves de CAR_PARTS en el orden en que se dibujan.
 * viewBox: recorte del logo (0 0 300 100) que se muestra.
 * className: posición y tamaño (se define en el CSS de cada sección).
 * progress: opcional, para controlar el dibujo desde afuera (por ejemplo, en una sección fija).
 */
export default function CarLines({ parts, viewBox = '0 10 300 80', className = '', color = 'var(--oro-linea)', strokeWidth = 3.5, opacity = 1, start, end, progress }) {
  const ref = useRef(null)
  // Si se pasa `progress` (0 a 1), lo controla la sección; si no, se dibuja al entrar en pantalla.
  const controlled = progress !== undefined
  useInViewProgress(ref, { start, end, disabled: controlled })
  const n = parts.length
  return (
    <svg ref={ref} viewBox={viewBox} className={`${styles.lines} ${className}`} style={controlled ? { '--p': progress } : undefined} aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" opacity={opacity}>
        {parts.map((k, i) => (
          <CarPart
            key={k}
            part={k}
            strokeWidth={strokeWidth}
            pathLength="1"
            vectorEffect="non-scaling-stroke"
            style={{ '--d': n > 1 ? (i / (n - 1)) * 0.6 : 0 }}
          />
        ))}
      </g>
    </svg>
  )
}
