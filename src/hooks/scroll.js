import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

// Un solo listener de scroll compartido, sincronizado con requestAnimationFrame.
const subscribers = new Set()
let ticking = false

function flush() {
  ticking = false
  subscribers.forEach((fn) => fn())
}
function onScroll() {
  if (!ticking) {
    ticking = true
    requestAnimationFrame(flush)
  }
}
function subscribe(fn) {
  if (subscribers.size === 0) {
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
  }
  subscribers.add(fn)
  fn()
  return () => {
    subscribers.delete(fn)
    if (subscribers.size === 0) {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }
}

const clamp01 = (x) => Math.max(0, Math.min(1, x))

export function useMediaQuery(query) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', cb)
      return () => mq.removeEventListener('change', cb)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')

/**
 * Sigue un valor objetivo con inercia (resorte). Llama a `onFrame(valor)` en cada cuadro
 * hasta que se asienta. stiffness: qué tan rápido llega; damping: cuánto frena (menos = más rebote).
 */
function createSpring(onFrame, { stiffness = 70, damping = 13, initial = 0 } = {}) {
  let pos = initial
  let vel = 0
  let target = initial
  let raf = 0
  let last = 0
  const step = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016)
    last = now
    const acc = -stiffness * (pos - target) - damping * vel
    vel += acc * dt
    pos += vel * dt
    if (Math.abs(pos - target) < 0.0004 && Math.abs(vel) < 0.0004) {
      pos = target
      vel = 0
      raf = 0
      onFrame(pos)
      return
    }
    onFrame(pos)
    raf = requestAnimationFrame(step)
  }
  return {
    set(t) {
      target = t
      if (!raf) {
        last = performance.now()
        raf = requestAnimationFrame(step)
      }
    },
    jump(t) {
      pos = target = t
      vel = 0
      onFrame(pos)
    },
    stop() {
      cancelAnimationFrame(raf)
      raf = 0
    },
  }
}

/**
 * Progreso 0 → 1 de un elemento que entra en pantalla, con inercia.
 * Empieza cuando su borde superior toca `start` (fracción de la ventana desde arriba)
 * y termina cuando llega a `end`. No re-renderiza: llama a onProgress(valor) en cada cuadro
 * (o, si no se pasa, escribe la variable CSS --p en el elemento).
 */
export function useInViewProgress(ref, { start = 1, end = 0.3, disabled = false, onProgress } = {}) {
  const reduced = useReducedMotion()
  const cb = useRef(onProgress)
  useEffect(() => {
    cb.current = onProgress
  })
  useEffect(() => {
    const el = ref.current
    if (!el || disabled) return
    const emit = (v) => (cb.current ? cb.current(v) : el.style.setProperty('--p', v.toFixed(4)))
    if (reduced) {
      emit(1)
      return
    }
    const spring = createSpring(emit, { stiffness: 40, damping: 12 })
    const unsub = subscribe(() => {
      const vh = window.innerHeight
      const top = el.getBoundingClientRect().top
      spring.set(clamp01((vh * start - top) / (vh * (start - end))))
    })
    return () => {
      unsub()
      spring.stop()
    }
  }, [ref, start, end, reduced, disabled])
}

/**
 * Progreso 0 → 1 de una sección alta con contenido fijo (position: sticky), con inercia:
 * el valor no sigue al scroll 1:1, lo persigue con un resorte y se pasa un poquito antes de asentarse.
 * map: transforma el progreso del scroll antes de suavizarlo.
 */
export function usePinProgress(ref, { map = (x) => x, stiffness = 60, damping = 11, direct = false } = {}) {
  const [p, setP] = useState(0)
  const reduced = useReducedMotion()
  const mapRef = useRef(map)
  useEffect(() => {
    mapRef.current = map
  })
  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    // direct: el valor sigue al scroll cuadro a cuadro, sin inercia (en celular se siente pegado al dedo)
    const spring = direct ? null : createSpring(setP, { stiffness, damping })
    const unsub = subscribe(() => {
      const rect = el.getBoundingClientRect()
      const travel = rect.height - window.innerHeight
      const v = mapRef.current(travel > 0 ? clamp01(-rect.top / travel) : 1)
      if (spring) spring.set(v)
      else setP(v)
    })
    return () => {
      unsub()
      spring?.stop()
    }
  }, [ref, reduced, stiffness, damping, direct])
  return reduced ? 1 : p
}

/**
 * Parallax suave: mueve el elemento en Y según su posición en pantalla.
 * speed: px de desplazamiento por cada px de scroll (0.1 = sutil). Escribe --parallax.
 */
export function useParallax(ref, speed = 0.08) {
  const reduced = useReducedMotion()
  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    return subscribe(() => {
      const r = el.getBoundingClientRect()
      const offset = r.top + r.height / 2 - window.innerHeight / 2
      el.style.setProperty('--parallax', `${(-offset * speed).toFixed(1)}px`)
    })
  }, [ref, speed, reduced])
}

/**
 * Sección del menú que se está mirando. groups: { '#servicios': ['servicios'], '#rally': ['rally', 'titulos'], … }
 * Una sección está activa cuando cruza una línea a ~40 % del alto de la pantalla.
 * Al llegar al final de la página se marca la última (el pie suele ser más bajo que la pantalla).
 */
export function useActiveSection(groups) {
  const [active, setActive] = useState(null)
  const groupsRef = useRef(groups)
  useEffect(() => {
    const entries = Object.entries(groupsRef.current)
    return subscribe(() => {
      const line = window.innerHeight * 0.4
      let found = null
      for (const [key, ids] of entries) {
        for (const id of ids) {
          const r = document.getElementById(id)?.getBoundingClientRect()
          if (r && r.top <= line && r.bottom > line) found = key
        }
      }
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      if (atBottom) found = entries[entries.length - 1][0]
      setActive(found)
    })
  }, [])
  return active
}

export function useScrolledPast(px) {
  const [past, setPast] = useState(false)
  useEffect(() => subscribe(() => setPast(window.scrollY > px)), [px])
  return past
}
