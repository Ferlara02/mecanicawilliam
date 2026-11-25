// Tramos de la animación de la maleta: [inicio, duración] dentro del progreso total (0 a 1).
export const STAGES = {
  latches: [0.04, 0.12],
  lid: [0.18, 0.36],
  tablet: [0.58, 0.26],
  screen: [0.84, 0.14],
}

// En celular la maleta sigue al dedo sin resorte: los tramos se encadenan sin pausas
// y cada movimiento avanza parejo (sin rebotes), así se ve progresivo mientras deslizás.
export const STAGES_TOUCH = {
  latches: [0, 0.14],
  lid: [0.1, 0.4],
  tablet: [0.46, 0.36],
  screen: [0.78, 0.2],
}

export const clamp01 = (x) => Math.max(0, Math.min(1, x))
export const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
// Llega un poco más allá y vuelve: da sensación de peso (tapa que rebota, scanner que se acomoda)
export const easeBack = (t, k = 1.4) => 1 + (k + 1) * Math.pow(t - 1, 3) + k * Math.pow(t - 1, 2)
export const stage = (p, [start, dur]) => clamp01((p - start) / dur)
// Suave al empezar y al terminar, sin pasarse: avanza siempre en el mismo sentido que el dedo
export const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2
export function stageIndex(p, stages = STAGES) {
  if (p < stages.lid[0]) return 0
  if (p < stages.tablet[0]) return 1
  if (p < stages.screen[0]) return 2
  return 3
}

