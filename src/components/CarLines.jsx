import { useCallback, useEffect, useRef, useState } from 'react'
import { CarPart } from './Logo.jsx'
import { useInViewProgress } from '../hooks/scroll.js'
import styles from './CarLines.module.css'

const clamp01 = (x) => Math.max(0, Math.min(1, x))

/**
 * Partes del auto del logo dibujadas de fondo. Se trazan a medida que la sección entra en pantalla.
 * parts: claves de CAR_PARTS en el orden en que se dibujan.
 * viewBox: recorte del logo (0 0 300 100) que se muestra.
 * className: posición y tamaño (se define en el CSS de cada sección).
 * strokeWidth: grosor del trazo en píxeles de pantalla (se mantiene igual en cualquier tamaño de pantalla).
 * progress: opcional, para controlar el dibujo desde afuera (por ejemplo, en una sección fija).
 */
export default function CarLines({ parts, viewBox = '0 10 300 80', className = '', color = 'var(--oro-linea)', strokeWidth = 3.5, opacity = 1, start, end, progress }) {
  const ref = useRef(null)
  const paths = useRef([])
  const [unitsPerPx, setUnitsPerPx] = useState(0.2)
  const controlled = progress !== undefined
  const viewBoxWidth = Number(viewBox.split(/\s+/)[2])

  // Grosor constante: convierte los píxeles pedidos a unidades del dibujo según el tamaño real del SVG
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const w = el.getBoundingClientRect().width
      if (w > 0) setUnitsPerPx(viewBoxWidth / w)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [viewBoxWidth])

  // Cada trazo arranca un poco después del anterior y todos terminan juntos
  const draw = useCallback((p) => {
    const list = paths.current
    const n = list.length
    list.forEach((node, i) => {
      if (!node) return
      const delay = n > 1 ? (i / (n - 1)) * 0.6 : 0
      node.style.strokeDashoffset = (1 - clamp01(p * 1.6 - delay)).toFixed(4)
    })
  }, [])

  useInViewProgress(ref, { start, end, disabled: controlled, onProgress: draw })
  useEffect(() => {
    if (controlled) draw(progress)
  }, [controlled, progress, draw])

  return (
    <svg ref={ref} viewBox={viewBox} className={`${styles.lines} ${className}`} aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" opacity={opacity}>
        {parts.map((k, i) => (
          <CarPart key={k} part={k} strokeWidth={strokeWidth * unitsPerPx} pathLength="1" ref={(node) => (paths.current[i] = node)} />
        ))}
      </g>
    </svg>
  )
}
