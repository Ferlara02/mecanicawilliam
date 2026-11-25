import styles from './Logo.module.css'

import { CAR_PARTS } from './carParts.js'

const LOGO_ORDER = ['hood', 'nose', 'roof', 'belt', 'accent', 'sillFront', 'sillRear', 'wheelFront', 'wheelRear']

export function CarPart({ part, strokeWidth, ref, ...rest }) {
  const p = CAR_PARTS[part]
  const sw = strokeWidth ?? p.w
  if (p.ellipse) {
    const [cx, cy, rx, ry] = p.ellipse
    return <ellipse ref={ref} cx={cx} cy={cy} rx={rx} ry={ry} strokeWidth={sw} {...rest} />
  }
  return <path ref={ref} d={p.d} strokeWidth={sw} {...rest} />
}

const DESCRIPTORS = {
  mecanica: { text: 'MECÁNICA INTEGRAL', x: 3, size: 8.6, length: 86 },
  rally: { text: 'RALLY GROUP', x: 12, size: 9.5, length: 70 },
}

/**
 * Logo completo: WILLIAM + descriptor + auto.
 * descriptor: 'mecanica' | 'rally' | null. draw: anima el trazo al montar.
 */
export function Logo({ color = 'var(--oro)', descriptor = 'mecanica', draw = false, className = '', title = 'Mecánica William' }) {
  const d = descriptor ? DESCRIPTORS[descriptor] : null
  return (
    <svg viewBox="0 0 300 100" className={`${styles.logo} ${draw ? styles.draw : ''} ${className}`} role="img" aria-label={title}>
      <g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
        {LOGO_ORDER.map((k, i) => (
          <CarPart key={k} part={k} pathLength="1" style={{ '--i': i }} />
        ))}
      </g>
      <text x="2" y="53" fontSize="23" fontWeight="900" fill={color} textLength="88" lengthAdjust="spacingAndGlyphs" className={styles.word}>
        WILLIAM
      </text>
      {d && (
        <text x={d.x} y="70" fontSize={d.size} fontWeight="600" fill={color} textLength={d.length} lengthAdjust="spacingAndGlyphs" className={styles.desc}>
          {d.text}
        </text>
      )}
    </svg>
  )
}

/** Solo el auto, sin texto. */
export function Isotipo({ color = 'var(--oro)', className = '' }) {
  return (
    <svg viewBox="84 12 220 76" className={`${styles.logo} ${className}`} aria-hidden="true">
      <g fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
        {LOGO_ORDER.slice(1).map((k) => <CarPart key={k} part={k} />)}
      </g>
    </svg>
  )
}
