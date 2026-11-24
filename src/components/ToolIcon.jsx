// Herramientas dibujadas con el mismo trazo que el auto del logo (viewBox 0 0 120 40).
const TOOLS = {
  llave: (
    <>
      <circle cx="16" cy="20" r="11" />
      <path d="M10.5 20 L13.25 15.2 L18.75 15.2 L21.5 20 L18.75 24.8 L13.25 24.8 Z" />
      <path d="M26.5 16.5 C50 17.5 80 17.5 98 16.8 M26.5 23.5 C50 22.5 80 22.5 98 23.2" />
      <path d="M98 16.8 C101 11 106 8 112 8.5 L118 10 L112.5 16 L106 16.5 L104 20 L106 23.5 L112.5 24 L118 30 L112 31.5 C106 32 101 29 98 23.2" />
    </>
  ),
  destornillador: (
    <>
      <path d="M8 14 H38 C42 14 44 16.5 46 17.5 V22.5 C44 23.5 42 26 38 26 H8 C5 26 4 23 4 20 C4 17 5 14 8 14 Z" />
      <path d="M12 18 H34 M12 22 H34" strokeWidth="1.3" />
      <path d="M46 17.8 H52 V22.2 H46 M52 20 H104 L112 18.5 V21.5 L104 20" />
    </>
  ),
  crique: (
    <>
      <circle cx="18" cy="20" r="12" />
      <circle cx="18" cy="20" r="4" />
      <path d="M29 15 C55 16 80 17 104 17.5 C109 17.6 112 19 112 20 C112 21 109 22.4 104 22.5 C80 23 55 24 29 25" />
    </>
  ),
  bujia: <path d="M60 2 V8 M53 8 H67 V15 H53 Z M55 15 V20 H65 V15 M50 20 H70 L68 28 H52 Z M57 28 V35 H63 V28 M60 35 V38 H65" />,
  vaso: (
    <>
      <path d="M50 4 H70 V30 C70 34 66 36 60 36 C54 36 50 34 50 30 Z" />
      <path d="M50 12 H70 M54 4 V12 M66 4 V12" strokeWidth="1.3" />
    </>
  ),
  cruz: (
    <>
      <path d="M30 6 L90 34 M30 34 L90 6" />
      <circle cx="30" cy="6" r="4" />
      <circle cx="90" cy="34" r="4" />
      <circle cx="30" cy="34" r="4" />
      <circle cx="90" cy="6" r="4" />
    </>
  ),
}

export default function ToolIcon({ name, color = 'currentColor', strokeWidth = 2.6, className = '' }) {
  return (
    <svg viewBox="0 0 120 40" className={className} aria-hidden="true" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
      <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        {TOOLS[name]}
      </g>
    </svg>
  )
}
