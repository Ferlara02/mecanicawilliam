import { useEffect } from 'react'

/**
 * Animaciones de entrada. Cualquier elemento con data-reveal="tipo" aparece al entrar en pantalla
 * (los tipos están en src/styles/reveal.css). Un contenedor con data-stagger="tipo" anima a sus hijos
 * uno tras otro. data-delay (en segundos) retrasa la entrada.
 */
export function useRevealOnScroll() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const show = (el) => el.setAttribute('data-in', '')

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            show(e.target)
            io.unobserve(e.target)
          }
        })
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0 },
    )

    const prepare = (root) => {
      root.querySelectorAll?.('[data-stagger]:not([data-stagger-ready])').forEach((parent) => {
        const type = parent.dataset.stagger || 'up'
        const base = parseFloat(parent.dataset.delay || 0)
        const step = parseFloat(parent.dataset.step || 0.08)
        ;[...parent.children].forEach((child, i) => {
          if (!child.dataset.reveal) child.dataset.reveal = type
          child.style.setProperty('--d', `${(base + i * step).toFixed(2)}s`)
        })
        parent.setAttribute('data-stagger-ready', '')
      })
      root.querySelectorAll?.('[data-reveal]:not([data-in])').forEach((el) => {
        if (el.dataset.delay && !el.style.getPropertyValue('--d')) el.style.setProperty('--d', `${el.dataset.delay}s`)
        if (reduced) show(el)
        else if (firstScreen && el.getBoundingClientRect().top < window.innerHeight) {
          // Lo que ya se ve al cargar la página entra enseguida (con sus retrasos), sin esperar al scroll
          requestAnimationFrame(() => requestAnimationFrame(() => show(el)))
        } else io.observe(el)
      })
    }

    let firstScreen = true
    prepare(document)
    firstScreen = false
    // Elementos que aparecen después (por ejemplo, al pasar de celular a escritorio)
    const mo = new MutationObserver((muts) => muts.forEach((m) => m.addedNodes.forEach((n) => n.nodeType === 1 && prepare(n.parentElement || n))))
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])
}
