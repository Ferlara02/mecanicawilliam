import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import styles from './Lightbox.module.css'

// Visor de fotos de toda la página. Se activa con cualquier <img data-zoom>:
//   data-zoom              → foto común: se amplía desde su lugar hasta el centro de la pantalla.
//   data-zoom="polaroid"   → foto instantánea (la de Cachi): la polaroid se agranda, se endereza,
//                            se abre hasta mostrar la foto completa y la imagen "se revela".
// Se cierra con la cruz, tocando afuera de la foto o con Escape, y vuelve a su lugar.
//
// Rendimiento: la foto ampliada se dibuja una sola vez en su tamaño final y lo que se anima es
// solo transform (escala y posición, lo hace la placa de video) y el recorte. Nada de la página
// cambia de tamaño durante la animación, por eso va fluida también en celular.
const CLOSE_MS = 400
const POL_OPEN_MS = 560
const POL_CLOSE_MS = 440
const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const fit = (ratio, maxW, maxH) => (maxW / ratio <= maxH ? { w: maxW, h: maxW / ratio } : { w: maxH * ratio, h: maxH })

// Posición y tamaño reales (sin la rotación) y ángulo del elemento
function rectOf(el) {
  const r = el.getBoundingClientRect()
  const w = el.offsetWidth || r.width
  const h = el.offsetHeight || r.height
  let angle = 0
  const m = getComputedStyle(el).transform
  const v = m && m !== 'none' ? m.match(/matrix\(([^)]+)\)/)?.[1].split(',').map(Number) : null
  if (v) angle = (Math.atan2(v[1], v[0]) * 180) / Math.PI
  return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, w, h, angle }
}

// Valor de una coordenada de clip-path ("18%", "0px", "calc(100% - 27px)") en píxeles
function coord(tok, size) {
  let total = 0
  for (const [, sign, num, unit] of tok.matchAll(/([+-])?\s*([\d.]+)(%|px)?/g)) {
    const val = unit === '%' ? (parseFloat(num) / 100) * size : parseFloat(num)
    total += sign === '-' ? -val : val
  }
  return total
}

// Puntos del recorte de la foto original, normalizados 0–1 (o un rectángulo si no tiene)
function clipPoints(img, w, h) {
  const cp = getComputedStyle(img).clipPath
  const m = cp && cp.startsWith('polygon(') ? cp.slice(8, -1) : null
  if (!m) return [[0, 0], [1, 0], [1, 1], [0, 1]]
  return m.split(',').map((pt) => {
    const toks = pt.trim().match(/calc\([^)]*\)|[-\d.]+(?:px|%)?/g) || ['0', '0']
    return [coord(toks[0], w) / w, coord(toks[1] ?? '0', h) / h]
  })
}

const poly = (pts) => `polygon(${pts.map(([x, y]) => `${x.toFixed(2)}px ${y.toFixed(2)}px`).join(', ')})`

// Estado "en su lugar" de una foto común: transform y recorte para que la foto grande
// (ya dibujada en el centro) se vea exactamente como la original
function photoFrom(it) {
  const S = rectOf(it.img)
  const { F, pos, pts } = it
  const k = Math.max(S.w / F.w, S.h / F.h)
  const ox = F.w * k - S.w
  const oy = F.h * k - S.h
  const imgLeft = S.cx - S.w / 2 - ox * pos[0]
  const imgTop = S.cy - S.h / 2 - oy * pos[1]
  const x0 = (ox * pos[0]) / k
  const y0 = (oy * pos[1]) / k
  return {
    transform: `translate(${imgLeft - F.left}px, ${imgTop - F.top}px) scale(${k})`,
    clipPath: poly(pts.map(([x, y]) => [x0 + (x * S.w) / k, y0 + (y * S.h) / k])),
  }
}
const photoTo = (it) => ({
  transform: 'translate(0px, 0px) scale(1)',
  clipPath: poly(it.pts.map(([x, y]) => [Math.round(x) * it.F.w, Math.round(y) * it.F.h])),
})

// Polaroid: la tarjeta cambia de forma (de la vertical recortada de la página a la foto completa),
// así que se arma la animación cuadro a cuadro. Cada cuadro sigue siendo solo transform y recorte.
const FRAMES = 32
const easeOut = (t) => 1 + 1.6 * (t - 1) ** 3 + 0.6 * (t - 1) ** 2 // llega con un mínimo rebote
const easeInOut = (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2)

function polaroidFrame(it, S, p) {
  const { C, I, fr, pos, tapes } = it
  const L = (a, b) => a + (b - a) * p
  const cx = C.w / 2
  const cy = C.h / 2
  // Tarjeta blanca (centrada en el contenedor)
  const cw = L(S.w, C.w)
  const ch = L(S.h, C.h)
  // Ventana visible de la foto: de recorte de la página a la foto entera
  const W = { x: L(cx - S.w / 2 + fr.x, C.pad), y: L(cy - S.h / 2 + fr.y, C.pad), w: L(fr.w, I.w), h: L(fr.h, I.h) }
  const k = Math.max(W.w / I.w, W.h / I.h)
  const il = W.x - (I.w * k - W.w) * pos[0]
  const itop = W.y - (I.h * k - W.h) * pos[1]
  const cl = (W.x - il) / k
  const ct = (W.y - itop) / k
  const cr = I.w - cl - W.w / k
  const cb = I.h - ct - W.h / k
  return {
    box: { transform: `translate(${L(S.cx - (C.left + cx), 0)}px, ${L(S.cy - (C.top + cy), 0)}px) rotate(${L(S.angle, -1.5)}deg)` },
    card: { transform: `scale(${cw / C.w}, ${ch / C.h})` },
    img: {
      transform: `translate(${il - C.pad}px, ${itop - C.pad}px) scale(${k})`,
      clipPath: `inset(${ct}px ${cr}px ${cb}px ${cl}px)`,
    },
    caption: { transform: `translateY(${cy + ch / 2 - C.h}px)`, opacity: Math.min(1, Math.max(0, (p - 0.6) / 0.4)) },
    tapes: tapes.map((t) => ({
      transform: `translate(${L(cx - S.w / 2 + t.x, t.fx) - t.fx}px, ${L(cy - S.h / 2 + t.y, t.fy) - t.fy}px) rotate(${t.angle}deg) scale(${L(1 / it.kT, 1)})`,
    })),
  }
}

function polaroidAnimate(it, els, opening, duration) {
  const S = rectOf(it.source)
  const frames = Array.from({ length: FRAMES + 1 }, (_, i) => {
    const t = i / FRAMES
    return polaroidFrame(it, S, opening ? easeOut(t) : 1 - easeInOut(t))
  })
  const opts = { duration, fill: 'forwards', easing: 'linear' }
  const run = (el, pick) => el?.animate(frames.map(pick), opts)
  const anims = [
    run(els.box, (f) => f.box),
    run(els.card, (f) => f.card),
    run(els.img, (f) => f.img),
    run(els.caption, (f) => f.caption),
    ...els.tapes.map((el, i) => run(el, (f) => f.tapes[i])),
  ].filter(Boolean)
  return Promise.all(anims.map((a) => a.finished)).catch(() => {})
}

const angleOf = (el) => {
  const m = getComputedStyle(el).transform
  const v = m && m !== 'none' ? m.match(/matrix\(([^)]+)\)/)?.[1].split(',').map(Number) : null
  return v ? (Math.atan2(v[1], v[0]) * 180) / Math.PI : 0
}

export default function Lightbox() {
  const [item, setItem] = useState(null)
  const [phase, setPhase] = useState('from') // from → open → closing
  const itemRef = useRef(null)
  const stageRef = useRef(null)
  const closeRef = useRef(null)
  const sourceRef = useRef(null)
  const pol = useRef({ tapes: [] })
  const byKeyboard = useRef(false)
  useEffect(() => {
    itemRef.current = item
  }, [item])

  const open = useCallback((img) => {
    const polaroid = img.dataset.zoom === 'polaroid'
    const vw = window.innerWidth
    const vh = window.innerHeight
    const small = vw < 700
    const base = { img, polaroid, src: img.currentSrc || img.src, alt: img.alt }
    let it
    if (polaroid) {
      // La polaroid se abre hasta mostrar la foto completa, con su marco blanco y el texto abajo
      const source = img.closest('figure') || img
      const frame = img.parentElement
      const S = rectOf(source)
      const ratio = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1600 / 825
      const pad = small ? 10 : 18
      const capH = small ? 46 : 68
      const maxW = small ? vw * 0.94 : Math.min(vw * 0.82, 1150)
      const maxH = vh * (small ? 0.62 : 0.8)
      const I = fit(ratio, maxW - 2 * pad, maxH - pad - capH)
      const C = { w: I.w + 2 * pad, h: I.h + pad + capH, pad, capH }
      C.left = (vw - C.w) / 2
      C.top = (vh - C.h) / 2
      const kT = small ? 1.3 : 1.5
      const tapes = [...source.querySelectorAll('.tape')].map((t) => {
        const x = t.offsetLeft + t.offsetWidth / 2
        const y = t.offsetTop + t.offsetHeight / 2
        return { x, y, w: t.offsetWidth * kT, h: t.offsetHeight * kT, fx: (x / S.w) * C.w, fy: y * kT, angle: angleOf(t) }
      })
      it = {
        ...base, source, C, I, kT, tapes,
        fr: { x: frame.offsetLeft, y: frame.offsetTop, w: frame.offsetWidth, h: frame.offsetHeight },
        pos: getComputedStyle(img).objectPosition.split(' ').map((v) => (v.endsWith('%') ? parseFloat(v) / 100 : 0.5)),
        caption: source.querySelector('figcaption')?.textContent || img.alt,
      }
    } else {
      const ratio = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 16 / 10
      // Las fotos chicas no se estiran más del doble de su tamaño real (se verían borrosas)
      const { w, h } = fit(ratio, Math.min(vw * 0.92, 1400, (img.naturalWidth || 9999) * 2), vh * (small ? 0.7 : 0.8))
      const F = { w, h, left: (vw - w) / 2, top: (vh - h) / 2 - 20 }
      const S = rectOf(img)
      const pos = getComputedStyle(img).objectPosition.split(' ').map((p) => (p.endsWith('%') ? parseFloat(p) / 100 : 0.5))
      it = { ...base, source: img, F, pos, pts: clipPoints(img, S.w, S.h), caption: img.alt }
    }
    if (!it.polaroid) it.from = photoFrom(it)
    sourceRef.current = it.source
    itemRef.current = it
    setItem(it)
    setPhase('from')
  }, [])

  // Abrir: un cuadro "en su lugar" y al siguiente pasa a la posición final
  const openKey = item && !item.closing ? item.src : null
  // Polaroid: la animación arranca antes del primer pintado, con la tarjeta en su lugar de la página
  useLayoutEffect(() => {
    const it = itemRef.current
    if (!openKey || !it?.polaroid) return
    polaroidAnimate(it, pol.current, true, reduced() ? 1 : POL_OPEN_MS)
  }, [openKey])
  useEffect(() => {
    if (!openKey) return
    // La copia ya está dibujada encima en el mismo lugar: recién ahora se oculta la original
    if (sourceRef.current) sourceRef.current.style.visibility = 'hidden'
    let id = requestAnimationFrame(() => {
      id = requestAnimationFrame(() => setPhase('open'))
    })
    return () => cancelAnimationFrame(id)
  }, [openKey])

  useEffect(() => {
    if (phase === 'open') closeRef.current?.focus({ preventScroll: true })
  }, [phase])

  const close = useCallback(() => {
    const it = itemRef.current
    if (!it || it.closing) return
    if (it.polaroid) {
      setItem({ ...it, closing: true })
      setPhase('closing')
      polaroidAnimate(it, pol.current, false, reduced() ? 1 : POL_CLOSE_MS).then(() => {
        it.source.style.visibility = ''
        setItem(null)
        if (byKeyboard.current) it.img.focus?.({ preventScroll: true })
      })
      return
    }
    const from = photoFrom(it)
    setItem({ ...it, from, closing: true })
    setPhase('closing')
    let done = false
    const finish = () => {
      if (done) return
      done = true
      stageRef.current?.removeEventListener('transitionend', onEnd)
      it.source.style.visibility = ''
      setItem(null)
      if (byKeyboard.current) it.img.focus?.({ preventScroll: true })
    }
    const onEnd = (e) => {
      if (e.target === stageRef.current && e.propertyName === 'transform') finish()
    }
    stageRef.current?.addEventListener('transitionend', onEnd)
    // En el último tramo la original ya está visible debajo y la copia se funde encima
    setTimeout(() => {
      it.source.style.visibility = ''
    }, CLOSE_MS - 120)
    setTimeout(finish, CLOSE_MS + 250)
  }, [])

  // Clic / Enter / Espacio sobre una foto; Escape para cerrar
  useEffect(() => {
    const onDown = (e) => {
      // Sin foco al tocar con mouse/dedo: si no, el navegador scrollea para mostrar la foto entera
      if (e.target.closest?.('img[data-zoom]')) {
        e.preventDefault()
        byKeyboard.current = false
      }
    }
    const onClick = (e) => {
      const img = e.target.closest?.('img[data-zoom]')
      if (img && !itemRef.current) {
        e.preventDefault()
        open(img)
      }
    }
    const onKey = (e) => {
      if (itemRef.current) {
        if (e.key === 'Escape') close()
        return
      }
      const img = e.target.closest?.('img[data-zoom]')
      if (img && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        byKeyboard.current = true
        open(img)
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, close])

  // Mientras está abierta la página no scrollea (sin ocultar la barra: nada se mueve)
  const isOpen = Boolean(item)
  useEffect(() => {
    if (!isOpen) return
    const stop = (e) => e.preventDefault()
    const keys = (e) => {
      if ([' ', 'PageUp', 'PageDown', 'Home', 'End', 'ArrowUp', 'ArrowDown'].includes(e.key)) e.preventDefault()
    }
    window.addEventListener('wheel', stop, { passive: false })
    window.addEventListener('touchmove', stop, { passive: false })
    window.addEventListener('keydown', keys)
    return () => {
      window.removeEventListener('wheel', stop)
      window.removeEventListener('touchmove', stop)
      window.removeEventListener('keydown', keys)
    }
  }, [isOpen])

  if (!item) return null
  const opened = phase === 'open'
  const look = item.polaroid ? null : opened ? photoTo(item) : item.from
  const rootClass = [styles.root, opened && styles.shown, phase === 'closing' && styles.closing].filter(Boolean).join(' ')

  return (
    <div className={rootClass} role="dialog" aria-modal="true" aria-label={item.alt || 'Foto ampliada'}>
      <div className={styles.backdrop} onClick={close} />
      {item.polaroid ? (
        <figure
          ref={(el) => { pol.current.box = el }}
          className={styles.polaroid}
          style={{ left: item.C.left, top: item.C.top, width: item.C.w, height: item.C.h }}
        >
          <span ref={(el) => { pol.current.card = el }} className={styles.polaroidCard} />
          <div
            ref={(el) => { pol.current.img = el }}
            className={styles.polaroidImg}
            style={{ left: item.C.pad, top: item.C.pad, width: item.I.w, height: item.I.h }}
          >
            <img src={item.src} alt={item.alt} />
            <span className={styles.revelado} aria-hidden="true" />
          </div>
          {item.tapes.map((t, i) => (
            <span
              key={i}
              ref={(el) => { pol.current.tapes[i] = el }}
              className={`tape ${styles.polaroidTape}`}
              style={{ left: t.fx - t.w / 2, top: t.fy - t.h / 2, width: t.w, height: t.h }}
            />
          ))}
          <figcaption
            ref={(el) => { pol.current.caption = el }}
            className={styles.polaroidCaption}
            style={{ top: item.C.pad + item.I.h, height: item.C.capH, fontSize: item.C.capH * 0.4 }}
          >
            {item.caption}
          </figcaption>
        </figure>
      ) : (
        <div
          ref={stageRef}
          className={`${styles.stage} ${styles.photo}`}
          style={{ left: item.F.left, top: item.F.top, width: item.F.w, height: item.F.h, ...look }}
        >
          <img src={item.src} alt={item.alt} />
        </div>
      )}
      {!item.polaroid && item.caption && (
        <p className={styles.caption} style={{ top: item.F.top + item.F.h + 14 }}>{item.caption}</p>
      )}
      <button ref={closeRef} type="button" className={styles.close} onClick={close} aria-label="Cerrar foto">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6 L18 18 M18 6 L6 18" /></svg>
      </button>
    </div>
  )
}
