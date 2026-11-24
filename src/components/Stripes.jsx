/** Franjas diagonales de la librea de rally (rojo, oro y grafito). */
export default function Stripes({ className = '' }) {
  return (
    <div aria-hidden="true" className={className} style={{ display: 'flex', flexDirection: 'column', gap: 8, transform: 'skewY(-4deg)', transformOrigin: 'left', position: 'relative', zIndex: 2 }}>
      <div style={{ height: 26, background: 'var(--rojo)' }} />
      <div style={{ height: 12, background: 'var(--oro)' }} />
      <div style={{ height: 6, background: 'var(--grafito)' }} />
    </div>
  )
}
