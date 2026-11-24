/** Título de sección con el subrayado del logo (la raya de WILLIAM que termina en la nariz del auto). */
export default function SectionTitle({ children, color = 'var(--grafito)', underline = true, as: Tag = 'h2', className = '', style, id }) {
  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Tag id={id} className="display" data-reveal="title" style={{ fontSize: 'clamp(36px, 4.8vw, 64px)', color, maxWidth: '18ch', ...style }}>
        {children}
      </Tag>
      {underline && (
        <svg viewBox="0 0 120 12" width="120" aria-hidden="true" style={{ overflow: 'visible' }} data-reveal="line" data-delay="0.15">
          <path pathLength="1" d="M2 5 H92 C98 5 101 8 108 8.5 C112 8.7 116 8 118 7" fill="none" stroke="var(--oro)" strokeWidth="4" strokeLinecap="round" />
        </svg>
      )}
    </div>
  )
}
