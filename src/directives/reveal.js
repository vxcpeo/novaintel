// v-reveal: adds .rv.in when the element scrolls into view (the site's reveal-on-scroll).
let io = null

function observer() {
  if (io) return io
  if (typeof IntersectionObserver === 'undefined') return null
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('in')
          io.unobserve(e.target)
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  )
  return io
}

export const reveal = {
  mounted(el, binding) {
    el.classList.add('rv')
    const d = typeof binding.value === 'number' ? binding.value : 0
    if (d) el.style.transitionDelay = `${d * 80}ms`
    const o = observer()
    if (o) o.observe(el)
    else el.classList.add('in')
  },
  unmounted(el) {
    io?.unobserve(el)
  },
}
