import { onMounted, onUnmounted } from 'vue'

// Eyes follow the pointer, on every face marked .cf-follow.
export function useEyes() {
  if (typeof window === 'undefined') return
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  const fine = matchMedia('(pointer: fine)').matches
  if (reduce || !fine) return
  let px = -1
  let py = -1
  let raf = 0
  const look = () => {
    raf = 0
    for (const svg of document.querySelectorAll('.face-follow')) {
      const r = svg.getBoundingClientRect()
      if (!r.width || r.bottom < 0 || r.top > innerHeight) continue
      const dx = px - (r.left + r.width / 2)
      const dy = py - (r.top + r.height / 2)
      const d = Math.hypot(dx, dy) || 1
      const k = Math.min(1, d / 240) * 5
      for (const g of svg.querySelectorAll('.face-eyes')) {
        g.style.translate = `${((dx / d) * k).toFixed(2)}px ${((dy / d) * k * 0.8).toFixed(2)}px`
      }
    }
  }
  const move = (e) => {
    px = e.clientX
    py = e.clientY
    if (!raf) raf = requestAnimationFrame(look)
  }
  onMounted(() => window.addEventListener('pointermove', move, { passive: true }))
  onUnmounted(() => {
    window.removeEventListener('pointermove', move)
    cancelAnimationFrame(raf)
  })
}
