// Maleta del scanner Autel. `progress` va de 0 (cerrada) a 1 (scanner afuera y encendido).
// Los tramos de cada etapa están en autelStages.js; cambialos para acelerar o frenar una parte.

const COLORS = {
  shell: '#3a3a3e',
  shellDark: '#232226',
  foam: '#46474c',
  foamDark: '#2c2d31',
  accent: '#dfba69',
  tablet: '#1d1b1e',
  screen: '#17191d',
  ui: '#7bd88f',
  fault: '#d2281e',
  faultText: '#ff8578',
  plateText: '#dfba69',
}

import { STAGES, STAGES_TOUCH, clamp01, ease, easeBack, easeInOutSine, stage } from './autelStages.js'

const pivotY = (y, k) => `translate(0 ${y}) scale(1 ${k.toFixed(3)}) translate(0 ${-y})`

function compute(p, direct) {
  // direct (celular): movimientos parejos que siguen al dedo; si no, con peso y rebote
  const S = direct ? STAGES_TOUCH : STAGES
  const t1 = direct ? easeInOutSine(stage(p, S.latches)) : easeBack(stage(p, S.latches), 2)
  const t2 = direct ? easeInOutSine(stage(p, S.lid)) : easeBack(ease(stage(p, S.lid)), 0.9)
  const t3 = direct ? easeInOutSine(stage(p, S.tablet)) : easeBack(stage(p, S.tablet), 1.2)
  const t4 = stage(p, S.screen)
  // La tapa gira sobre la bisagra trasera: de 1 (cerrada) a -0.62 (abierta, vista desde arriba)
  const s = 1 - 1.62 * t2
  const sl = Math.abs(s) < 0.02 ? (s < 0 ? -0.02 : 0.02) : s
  const k = 1 + 0.55 * t3
  const cx = 248 + 72 * t3
  const cy = 327 - 95 * t3
  return {
    lidT: pivotY(210, sl),
    outerOp: s > 0 ? 1 : 0,
    innerOp: s > 0 ? 0 : 1,
    latchLT: pivotY(486, 1 - 1.7 * t1),
    latchRT: pivotY(486, 1 - 1.7 * t1),
    tabT: `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${k.toFixed(3)}) translate(-248 -327)`,
    tabShadowOp: 0.45 * Math.min(1, t3),
    tabInOp: t3 > 0 ? 0 : 1,
    tabOutOp: t3 > 0 ? 1 : 0,
    screenOp: t4,
    ledOp: 0.3 + 0.7 * t4,
    closedOp: 1,
  }
}

// lift (0 a 1): ya abierta, la maleta entera sube y queda flotando; la sombra se achica y se aclara.
export default function AutelCase({ progress = 1, direct = false, lift = 0, colors, className = '' }) {
  const c = { ...COLORS, ...colors }
  const v = compute(clamp01(progress), direct)
  // Sube rápido al principio y se frena arriba, como si quedara suspendida
  const lf = 1 - Math.pow(1 - clamp01(lift), 2)
  return (
    <svg viewBox="0 0 640 560" className={className} role="img" aria-label="Maleta del scanner Autel abriéndose" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
      <ellipse
        cx="320" cy="512" rx="270" ry="22" fill="#000000"
        opacity={(0.28 * (1 - 0.55 * lf)).toFixed(3)}
        transform={`translate(320 512) scale(${(1 - 0.3 * lf).toFixed(3)}) translate(-320 -512)`}
      ></ellipse>
      <g transform={`translate(320 ${(300 - 120 * lf).toFixed(1)}) scale(${(1 + 0.05 * lf).toFixed(3)}) translate(-320 -300)`}>
      <rect x="80" y="440" width="480" height="58" rx="22" fill={c.shellDark}></rect>
      <rect x="80" y="210" width="480" height="270" rx="26" fill={c.shell}></rect>
      <rect x="102" y="228" width="436" height="234" rx="14" fill={c.foam}></rect>
      <rect x="122" y="244" width="252" height="166" rx="12" fill={c.foamDark}></rect>
      <rect x="392" y="244" width="126" height="70" rx="10" fill={c.foamDark}></rect>
      <rect x="404" y="256" width="102" height="46" rx="8" fill={c.shellDark}></rect>
      <rect x="404" y="256" width="24" height="46" rx="6" fill={c.accent}></rect>
      <circle cx="488" cy="279" r="5" fill={c.ui} opacity={v.ledOp}></circle>
      <circle cx="455" cy="380" r="56" fill={c.foamDark}></circle>
      <circle cx="455" cy="380" r="44" fill="none" stroke={c.shellDark} strokeWidth="7"></circle>
      <circle cx="455" cy="380" r="32" fill="none" stroke={c.shellDark} strokeWidth="7"></circle>
      <circle cx="455" cy="380" r="20" fill="none" stroke={c.shellDark} strokeWidth="7"></circle>
      <rect x="122" y="424" width="72" height="26" rx="6" fill={c.foamDark}></rect>
      <rect x="204" y="424" width="72" height="26" rx="6" fill={c.foamDark}></rect>
      <rect x="286" y="424" width="88" height="26" rx="6" fill={c.foamDark}></rect>
      <rect x="132" y="430" width="52" height="14" rx="4" fill={c.shellDark}></rect>
      <rect x="214" y="430" width="52" height="14" rx="4" fill={c.shellDark}></rect>
      <rect x="296" y="430" width="68" height="14" rx="4" fill={c.accent}></rect>
      <g opacity={v.tabInOp}>
        <rect x="136" y="262" width="236" height="160" rx="18" fill="#000000" opacity={v.tabShadowOp}></rect>
        <rect x="128" y="250" width="240" height="154" rx="14" fill={c.tablet}></rect>
        <rect x="128" y="250" width="240" height="154" rx="14" fill="none" stroke={c.accent} strokeWidth="3"></rect>
        <rect x="140" y="261" width="216" height="132" rx="5" fill="#0B0F14"></rect>
        <g opacity={v.screenOp}>
          <rect x="140" y="261" width="216" height="132" rx="5" fill={c.screen}></rect>
          <rect x="140" y="261" width="216" height="18" rx="5" fill="#0B0F14" opacity="0.55"></rect>
          <circle cx="150" cy="270" r="3.5" fill={c.ui}></circle>
          <text x="158" y="273.5" fontSize="8.5" fontWeight="700" fill="#FFFFFF" fontFamily="var(--f-body)">Diagnóstico completo</text>
          <text x="348" y="273.5" fontSize="7.5" fill="#FFFFFF" opacity="0.7" textAnchor="end" fontFamily="var(--f-body)">Escaneo 100 %</text>
          <text x="150" y="294" fontSize="7.5" fill="#FFFFFF" opacity="0.75" fontFamily="var(--f-body)">Peugeot 208 1.6, 24 sistemas</text>
          <rect x="150" y="301" width="196" height="22" rx="4" fill={c.fault}></rect>
          <text x="157" y="315.5" fontSize="8.5" fontWeight="800" fill="#FFFFFF" fontFamily="var(--f-body)">P0301</text>
          <text x="190" y="315.5" fontSize="7.5" fill="#FFFFFF" fontFamily="var(--f-body)">Falla de encendido, cilindro 1</text>
          <text x="150" y="340" fontSize="7.5" fill="#FFFFFF" fontFamily="var(--f-body)">Motor</text>
          <text x="346" y="340" fontSize="7.5" fontWeight="700" fill={c.faultText} textAnchor="end" fontFamily="var(--f-body)">1 falla</text>
          <rect x="150" y="345" width="196" height="1" fill="#FFFFFF" opacity="0.15"></rect>
          <text x="150" y="358" fontSize="7.5" fill="#FFFFFF" fontFamily="var(--f-body)">ABS y frenos</text>
          <text x="346" y="358" fontSize="7.5" fontWeight="700" fill={c.ui} textAnchor="end" fontFamily="var(--f-body)">OK</text>
          <polyline points="150,386 170,382 190,384 210,377 230,380 250,373 270,378 290,370 310,375 330,368 346,371" fill="none" stroke={c.ui} strokeWidth="1.5" opacity="0.8"></polyline>
        </g>
      </g>
      <g transform={v.lidT}>
        <g opacity={v.outerOp}>
          <rect x="80" y="210" width="480" height="262" rx="26" fill={c.shell}></rect>
          <rect x="96" y="462" width="448" height="4" rx="2" fill={c.shellDark} opacity="0.7"></rect>
          <rect x="112" y="236" width="416" height="206" rx="18" fill="none" stroke={c.shellDark} strokeWidth="5"></rect>
          <rect x="140" y="262" width="360" height="12" rx="6" fill={c.shellDark} opacity="0.6"></rect>
          <rect x="140" y="408" width="360" height="12" rx="6" fill={c.shellDark} opacity="0.6"></rect>
          <rect x="236" y="314" width="168" height="52" rx="10" fill={c.shellDark}></rect>
          <text x="320" y="348" fontSize="24" fontWeight="900" fill={c.plateText} textAnchor="middle" letterSpacing="6" fontFamily="var(--f-body)">AUTEL</text>
        </g>
        <g opacity={v.innerOp}>
          <rect x="80" y="210" width="480" height="270" rx="26" fill={c.shellDark}></rect>
          <rect x="102" y="226" width="436" height="238" rx="14" fill={c.foam}></rect>
          <rect x="102" y="226" width="436" height="238" rx="14" fill="url(#autel-crate)"></rect>
        </g>
      </g>
      <defs>
        <pattern id="autel-crate" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="6" cy="6" r="5" fill={c.foamDark}></circle>
          <circle cx="18" cy="18" r="5" fill={c.foamDark}></circle>
        </pattern>
      </defs>
      <g transform={v.tabT} opacity={v.tabOutOp}>
        <rect x="136" y="262" width="236" height="160" rx="18" fill="#000000" opacity={v.tabShadowOp}></rect>
        <rect x="128" y="250" width="240" height="154" rx="14" fill={c.tablet}></rect>
        <rect x="128" y="250" width="240" height="154" rx="14" fill="none" stroke={c.accent} strokeWidth="3"></rect>
        <rect x="140" y="261" width="216" height="132" rx="5" fill="#0B0F14"></rect>
        <g opacity={v.screenOp}>
          <rect x="140" y="261" width="216" height="132" rx="5" fill={c.screen}></rect>
          <rect x="140" y="261" width="216" height="18" rx="5" fill="#0B0F14" opacity="0.55"></rect>
          <circle cx="150" cy="270" r="3.5" fill={c.ui}></circle>
          <text x="158" y="273.5" fontSize="8.5" fontWeight="700" fill="#FFFFFF" fontFamily="var(--f-body)">Diagnóstico completo</text>
          <text x="348" y="273.5" fontSize="7.5" fill="#FFFFFF" opacity="0.7" textAnchor="end" fontFamily="var(--f-body)">Escaneo 100 %</text>
          <text x="150" y="294" fontSize="7.5" fill="#FFFFFF" opacity="0.75" fontFamily="var(--f-body)">Peugeot 208 1.6, 24 sistemas</text>
          <rect x="150" y="301" width="196" height="22" rx="4" fill={c.fault}></rect>
          <text x="157" y="315.5" fontSize="8.5" fontWeight="800" fill="#FFFFFF" fontFamily="var(--f-body)">P0301</text>
          <text x="190" y="315.5" fontSize="7.5" fill="#FFFFFF" fontFamily="var(--f-body)">Falla de encendido, cilindro 1</text>
          <text x="150" y="340" fontSize="7.5" fill="#FFFFFF" fontFamily="var(--f-body)">Motor</text>
          <text x="346" y="340" fontSize="7.5" fontWeight="700" fill={c.faultText} textAnchor="end" fontFamily="var(--f-body)">1 falla</text>
          <rect x="150" y="345" width="196" height="1" fill="#FFFFFF" opacity="0.15"></rect>
          <text x="150" y="358" fontSize="7.5" fill="#FFFFFF" fontFamily="var(--f-body)">ABS y frenos</text>
          <text x="346" y="358" fontSize="7.5" fontWeight="700" fill={c.ui} textAnchor="end" fontFamily="var(--f-body)">OK</text>
          <polyline points="150,386 170,382 190,384 210,377 230,380 250,373 270,378 290,370 310,375 330,368 346,371" fill="none" stroke={c.ui} strokeWidth="1.5" opacity="0.8"></polyline>
        </g>
      </g>
      <g opacity={v.closedOp}>
        <path d="M268 498 C268 528 372 528 372 498" fill="none" stroke={c.shellDark} strokeWidth="12" strokeLinecap="round"></path>
      </g>
      <g transform={v.latchLT}>
        <rect x="168" y="452" width="46" height="34" rx="7" fill={c.accent}></rect>
        <rect x="178" y="462" width="26" height="6" rx="3" fill={c.shellDark}></rect>
      </g>
      <g transform={v.latchRT}>
        <rect x="426" y="452" width="46" height="34" rx="7" fill={c.accent}></rect>
        <rect x="436" y="462" width="26" height="6" rx="3" fill={c.shellDark}></rect>
      </g>
      </g>
    </svg>
  )
}
