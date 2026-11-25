import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './Lightbox.module.css'

// Visor de fotos de toda la página. Se activa con cualquier <img data-zoom>:
//   data-zoom              → foto común: se amplía desde su lugar hasta el centro de la pantalla.
//   data-zoom="polaroid"   → foto instantánea (la de Cachi): se agranda como polaroid con cinta
//                            y la imagen "se revela" de a poco.
// Se cierra con la cruz, tocando afuera de la foto o con Escape, y vuelve a su lugar.
const DURATION = 520

function fit(ratio, maxW, maxH) {
  let w = maxW
  let h = w / ratio
  if (h > maxH) {
    h = maxH
    w = h * ratio
  }
  return { w, h }
}

// Posición y tamaño REALES del elemento (sin contar su rotación) y su ángulo.
// getBoundingClientRect de algo rotado devuelve una caja más grande; si se usara esa,
// al cerrar la copia no coincidiría con el original y "saltaría" de tamaño.
// También tiene en cuenta el zoom (scale) que algunas fotos tienen en la página.
function rectOf(el) {
  const r = el.getBoundingClientRect()
  const cs = getComputedStyle(el)
  let angle = 0
  let s = parseFloat(cs.scale) || 1
  const m = cs.transform
  if (m && m !== 'none') {
    const v = m.match(/matrix\(([^)]+)\)/)?.[1].split(',').map(Number)
    if (v) {
      angle = (Math.atan2(v[1], v[0]) * 180) / Math.PI
      s *= Math.hypot(v[0], v[1])
    }
  }
  const w = (el.offsetWidth || r.width) * s
  const h = (el.offsetHeight || r.height) * s
  const cx = r.left + r.width / 2
  const cy = r.top + r.height / 2
  return { left: cx - w / 2, top: cy - h / 2, width: w, height: h, angle }
}

export default function Lightbox() {
  const [item, setItem] = useState(null)
  const [shown, setShown] = useState(false)
  const closeRef = useRef(null)
  const itemRef = useRef(null)
  const sourceRef = useRef(null)
  const stageRef = useRef(null)
  const byKeyboard = useRef(false)
  useEffect(() => {
    itemRef.current = item
  }, [item])

  const open = useCallback((img) => {
    const polaroid = img.dataset.zoom === 'polaroid'
    const source = polaroid ? img.closest('figure') || img : img
    const ratio = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 16 / 10
    const vw = window.innerWidth
    const vh = window.innerHeight
    const small = vw < 700
    let to
    let imgBox
    if (polaroid) {
      const pad = small ? 12 : 20
      const cap = small ? 54 : 72
      const { w, h } = fit(ratio, Math.min(vw * (small ? 0.84 : 0.7), 980) - pad * 2, vh * 0.8 - pad - cap)
      to = { width: w + pad * 2, height: h + pad + cap }
      imgBox = { pad, w, h }
    } else {
      // Las fotos chicas no se estiran más del doble de su tamaño real (se verían borrosas)
      const maxW = Math.min(vw * 0.92, 1400, (img.naturalWidth || 9999) * 2)
      const { w, h } = fit(ratio, maxW, vh * (small ? 0.7 : 0.8))
      to = { width: w, height: h }
    }
    to.left = (vw - to.width) / 2
    to.top = (vh - to.height) / 2 - (polaroid ? 0 : 20)
    sourceRef.current = source
    const cs = getComputedStyle(img)
    // Dónde está la foto dentro del marco de la polaroid (para que arranque exactamente ahí)
    let fromImg = null
    if (polaroid) {
      const fr = img.parentElement || img
      fromImg = { left: fr.offsetLeft, top: fr.offsetTop, width: fr.offsetWidth, height: fr.offsetHeight }
    }
    setItem({
      src: img.currentSrc || img.src,
      alt: img.alt,
      caption: polaroid ? source.querySelector('figcaption')?.textContent || img.alt : img.alt,
      polaroid,
      source,
      img,
      from: rectOf(source),
      to,
      imgBox,
      fromImg,
      fromPosition: cs.objectPosition,
      fromScale: cs.scale && cs.scale !== 'none' ? cs.scale : '1',
      fromClip: cs.clipPath && cs.clipPath !== 'none' ? cs.clipPath : null,
    })
    setShown(false)
  }, [])

  const close = useCallback(() => {
    const it = itemRef.current
    if (!it || it.closing) return
    setItem({ ...it, from: rectOf(it.source), closing: true })
    setShown(false)
    // Se desmonta recién cuando la copia llegó exactamente a su lugar (fin real de la transición),
    // y en el mismo cuadro reaparece la original: así no hay salto.
    let done = false
    const finish = () => {
      if (done) return
      done = true
      stageRef.current?.removeEventListener('transitionend', onEnd)
      if (sourceRef.current) sourceRef.current.style.visibility = ''
      setItem(null)
      // Con teclado, el foco vuelve a la foto (sin mover la página); con mouse/dedo no hace falta
      if (byKeyboard.current) it.img.focus?.({ preventScroll: true })
    }
    const pending = new Set(['left', 'top', 'width', 'height'])
    const onEnd = (e) => {
      if (e.target !== stageRef.current) return
      pending.delete(e.propertyName)
      if (pending.size === 0) finish()
    }
    stageRef.current?.addEventListener('transitionend', onEnd)
    // En el último tramo la original ya está visible debajo y la copia se funde encima:
    // cualquier diferencia mínima (recortes, parallax) queda disimulada.
    setTimeout(() => {
      if (sourceRef.current) sourceRef.current.style.visibility = ''
    }, 300)
    setTimeout(finish, DURATION + 300) // por si alguna transición no dispara el evento
  }, [])

  // Abrir: un cuadro en la posición de origen y al siguiente pasa a la final (así hay transición)
  const openKey = item ? item.src : null
  useEffect(() => {
    if (!openKey) return
    if (sourceRef.current) sourceRef.current.style.visibility = 'hidden'
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)))
    return () => cancelAnimationFrame(id)
  }, [openKey])

  useEffect(() => {
    if (shown) closeRef.current?.focus({ preventScroll: true })
  }, [shown])

  // Clic (o Enter/Espacio) sobre cualquier foto ampliable
  useEffect(() => {
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
    // Al tocar la foto con el mouse/dedo no se le da foco: si no, el navegador scrollea la página
    // para mostrarla entera y la foto "salta" de lugar al abrir y al cerrar.
    const onDown = (e) => {
      if (e.target.closest?.('img[data-zoom]')) {
        e.preventDefault()
        byKeyboard.current = false
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

  // Mientras está abierta, la página no scrollea. Se frena la rueda, el dedo y las teclas
  // en vez de ocultar la barra de scroll: así no cambia el ancho y nada de la página se mueve.
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
  const r = shown ? item.to : item.from
  const rot = shown ? (item.polaroid ? -1.5 : 0) : item.from.angle || 0
  const stageStyle = {
    left: r.left,
    top: r.top,
    width: r.width,
    height: r.height,
    transform: `rotate(${rot}deg)`,
    // Si la foto original tiene un recorte diagonal, se abre hasta quedar rectangular (mismos 4 puntos: se anima)
    clipPath: item.fromClip ? (shown ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' : item.fromClip) : undefined,
  }

  return (
    <div className={`${styles.root} ${shown ? styles.shown : ''} ${item.closing ? styles.closing : ''}`} role="dialog" aria-modal="true" aria-label={item.alt || 'Foto ampliada'}>
      <div className={styles.backdrop} onClick={close} />
      {item.polaroid ? (
        <figure ref={stageRef} className={`${styles.stage} ${styles.polaroid}`} style={stageStyle}>
          <span className="tape" style={{ top: -14, left: '14%', transform: 'rotate(-6deg)' }} />
          <span className="tape" style={{ top: -14, right: '14%', transform: 'rotate(5deg)' }} />
          <div
            className={styles.polaroidImg}
            style={shown ? { left: item.imgBox.pad, top: item.imgBox.pad, width: item.imgBox.w, height: item.imgBox.h } : item.fromImg}
          >
            <img src={item.src} alt={item.alt} style={{ objectPosition: shown ? 'center' : item.fromPosition, scale: shown ? '1' : item.fromScale }} />
          </div>
          <figcaption className={styles.polaroidCaption}>{item.caption}</figcaption>
        </figure>
      ) : (
        <div ref={stageRef} className={`${styles.stage} ${styles.photo}`} style={stageStyle}>
          <img src={item.src} alt={item.alt} style={{ objectPosition: shown ? 'center' : item.fromPosition }} />
        </div>
      )}
      {!item.polaroid && item.caption && (
        <p className={styles.caption} style={{ top: item.to.top + item.to.height + 14 }}>{item.caption}</p>
      )}
      <button ref={closeRef} type="button" className={styles.close} onClick={close} aria-label="Cerrar foto">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6 L18 18 M18 6 L6 18" /></svg>
      </button>
    </div>
  )
}
