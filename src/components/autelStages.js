// Tramos de la animación de la maleta: [inicio, duración] dentro del progreso total (0 a 1).
export const STAGES = {
  latches: [0.04, 0.12],
  lid: [0.18, 0.36],
  tablet: [0.58, 0.26],
  screen: [0.84, 0.14],
}

export const clamp01 = (x) => Math.max(0, Math.min(1, x))
export const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
// Llega un poco más allá y vuelve: da sensación de peso (tapa que rebota, scanner que se acomoda)
export const easeBack = (t, k = 1.4) => 1 + (k + 1) * Math.pow(t - 1, 3) + k * Math.pow(t - 1, 2)
export const stage = (p, [start, dur]) => clamp01((p - start) / dur)
export function stageIndex(p) {
  if (p < STAGES.lid[0]) return 0
  if (p < STAGES.tablet[0]) return 1
  if (p < STAGES.screen[0]) return 2
  return 3
}

