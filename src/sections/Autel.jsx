import { useRef } from 'react'
import SectionTitle from '../components/SectionTitle.jsx'
import CarLines from '../components/CarLines.jsx'
import AutelCase from '../components/AutelCase.jsx'
import { STAGES_TOUCH, stageIndex } from '../components/autelStages.js'
import { usePinProgress, useMediaQuery } from '../hooks/scroll.js'
import { autelStages } from '../data/site.js'
import styles from './Autel.module.css'

function Copy() {
  return (
    <div className={styles.copy}>
      <span className="dymo" style={{ background: 'var(--oro)', color: 'var(--grafito)', transform: 'rotate(-1.5deg)' }} data-reveal="left">
        Diagnóstico Autel
      </span>
      <SectionTitle color="var(--blanco)">El scanner encuentra la falla. Nosotros la arreglamos.</SectionTitle>
      <p className="lead" style={{ color: 'var(--texto-suave-oscuro)' }} data-reveal="up" data-delay="0.2">
        Scanners Autel de última generación conectados a la computadora del auto: motor, sensores, inyección, ABS, airbag
        y caja automática. En minutos sabemos qué tiene.
      </p>
      <figure className={styles.quote} data-reveal="up" data-delay="0.3">
        <blockquote className="display">«Me diagnosticaron una falla en un sensor en cuestión de minutos.»</blockquote>
        <figcaption>Maximiliano Carreras, cliente</figcaption>
      </figure>
    </div>
  )
}

export default function Autel() {
  const ref = useRef(null)
  const mobile = useMediaQuery('(max-width: 860px)')
  // La apertura sigue al scroll: avanza y retrocede a medida que bajás o subís.
  // En celular va pegada al dedo. En compu lleva un suavizado muy corto y sin rebote,
  // solo para que los saltos de la ruedita del mouse no se vean a los tirones.
  // Primero se abre (hasta OPEN del recorrido) y después la maleta entera sube flotando
  // mientras la sección sigue fija, antes de pasar a la siguiente.
  const OPEN = 0.66
  const raw = usePinProgress(ref, {
    map: (x) => x / OPEN,
    stiffness: 220,
    damping: 30,
    direct: mobile,
  })
  const caseP = Math.min(1, raw)
  const lift = Math.max(0, Math.min(1, (raw - 1) / ((1 - OPEN) / OPEN) / 0.85))
  const active = stageIndex(caseP, STAGES_TOUCH)

  return (
    <section id="autel" className={styles.section} aria-labelledby="autel-titulo">
      <h2 id="autel-titulo" className="visually-hidden">Diagnóstico con scanners Autel</h2>
      {mobile && (
        <div className={`container ${styles.mobileCopy}`}>
          <Copy />
        </div>
      )}
      <div ref={ref} className={styles.track}>
        <div className={styles.sticky}>
          <CarLines
            parts={['hood', 'nose', 'roof', 'belt', 'sillFront', 'sillRear', 'wheelFront', 'wheelRear']}
            viewBox="0 14 300 72"
            className={styles.lines}
            color="var(--oro)"
            strokeWidth={2.5}
            opacity={0.35}
            progress={Math.max(0, Math.min(1, caseP * 1.3))}
          />
          <div className={`container ${styles.grid}`}>
            {!mobile && <Copy />}
            <div className={styles.stage} data-reveal="pop" data-delay="0.15">
              <AutelCase progress={caseP} lift={lift} direct />
              <ol className={styles.steps} aria-label="Etapas de la apertura">
                {autelStages.map((label, i) => (
                  <li key={label} className={i === active ? styles.on : i < active ? styles.done : ''} aria-current={i === active ? 'step' : undefined}>
                    {label}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
