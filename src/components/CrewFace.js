// The crew characters, drawn as SVG (shape + two eyes), exactly as crew-faces.js does.
import { h } from 'vue'
import { BY } from '../data/crew.js'

const f = (n) => Math.round(n * 100) / 100
let uid = 0

function roundPoly(pts, r) {
  const n = pts.length
  const towards = (a, b, d) => {
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy)
    return [a[0] + (dx / l) * d, a[1] + (dy / l) * d]
  }
  const A = pts.map((p, i) => towards(p, pts[(i - 1 + n) % n], r))
  const B = pts.map((p, i) => towards(p, pts[(i + 1) % n], r))
  let d = `M${f(A[0][0])} ${f(A[0][1])}`
  for (let i = 0; i < n; i++) {
    const nx = A[(i + 1) % n]
    d += `Q${f(pts[i][0])} ${f(pts[i][1])} ${f(B[i][0])} ${f(B[i][1])}L${f(nx[0])} ${f(nx[1])}`
  }
  return d + 'Z'
}

const hexPts = (cx, cy, R) =>
  [-90, -30, 30, 90, 150, 210].map((a) => [cx + R * Math.cos((a * Math.PI) / 180), cy + R * Math.sin((a * Math.PI) / 180)])

function bodyOf(c, paint) {
  switch (c.shape) {
    case 'circle':
      return h('circle', { cx: 50, cy: 50, r: 46, fill: paint })
    case 'square':
      return h('rect', { x: 5, y: 5, width: 90, height: 90, rx: 28, fill: paint })
    case 'hex':
      return h('path', { d: roundPoly(hexPts(50, 51, 49), 11), fill: paint })
    case 'cloud':
      return h('g', { fill: paint }, [
        h('rect', { x: 4, y: 44, width: 92, height: 44, rx: 22 }),
        h('circle', { cx: 29, cy: 47, r: 22 }),
        h('circle', { cx: 54, cy: 35, r: 26 }),
        h('circle', { cx: 77, cy: 50, r: 19 }),
      ])
    case 'flower': {
      const children = [h('circle', { cx: 50, cy: 50, r: 33 })]
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4 - Math.PI / 8
        children.push(h('circle', { cx: f(50 + 31 * Math.cos(a)), cy: f(50 + 31 * Math.sin(a)), r: 15.5 }))
      }
      return h('g', { fill: paint }, children)
    }
    default:
      return null
  }
}

const eyes = ([x, y]) =>
  h('g', { class: 'face-eyes', fill: '#fff' }, [
    h('rect', {
      x: x - 14.5, y: y - 8, width: 7.4, height: 16, rx: 3.7,
      transform: `rotate(-9 ${x - 10.8} ${y})`,
    }),
    h('rect', {
      x: x + 7.1, y: y - 8, width: 7.4, height: 16, rx: 3.7,
      transform: `rotate(-5 ${x + 10.8} ${y})`,
    }),
  ])

const grad = (gid) =>
  h('defs', [
    h('linearGradient', { id: gid, gradientUnits: 'userSpaceOnUse', x1: 4, y1: 8, x2: 96, y2: 92 }, [
      h('stop', { offset: 0, 'stop-color': '#FFB72E' }),
      h('stop', { offset: 0.42, 'stop-color': '#22D39A' }),
      h('stop', { offset: 0.68, 'stop-color': '#1FB8EC' }),
      h('stop', { offset: 1, 'stop-color': '#8B6CFF' }),
    ]),
  ])

function inner(c) {
  if (c.fill !== 'nasyai' && !c.rim) return [bodyOf(c, c.fill), eyes(c.eyes)]
  const gid = `cfg${++uid}`
  if (c.rim) {
    return [
      grad(gid),
      bodyOf(c, c.fill),
      h('circle', { cx: 50, cy: 50, r: 44.6, fill: 'none', stroke: `url(#${gid})`, 'stroke-width': 2.8 }),
      eyes(c.eyes),
    ]
  }
  return [grad(gid), bodyOf(c, `url(#${gid})`), eyes(c.eyes)]
}

function blinkFor(id) {
  let n = 0
  for (const ch of id) n = (n * 31 + ch.charCodeAt(0)) % 997
  return -((n % 700) / 100).toFixed(2)
}

export default {
  name: 'CrewFace',
  props: {
    id: { type: String, default: 'nasyai' },
    size: { type: [Number, String], default: 40 },
    label: { type: String, default: '' },
    cls: { type: String, default: '' },
    think: { type: Boolean, default: false },
    follow: { type: Boolean, default: true },
  },
  render() {
    const size = Number(this.size) || 40
    const c = BY[this.id] || BY.nasyai
    const classes = ['face']
    if (this.cls) classes.push(this.cls)
    if (this.think) classes.push('think')
    if (this.follow) classes.push('face-follow')
    const a11y = this.label ? { role: 'img', 'aria-label': this.label } : { 'aria-hidden': 'true' }
    const open = h(
      'svg',
      {
        class: classes.join(' '),
        viewBox: '0 0 100 100',
        width: size,
        height: size,
        focusable: 'false',
        style: this.follow ? { '--blink': `${blinkFor(this.id)}s` } : undefined,
        ...a11y,
      },
      c.id === 'room'
        ? [[2, 2], [52, 2], [2, 52], [52, 52]].map(([x, y], i) =>
            h('svg', { x, y, width: 46, height: 46, viewBox: '0 0 100 100', key: i }, inner(BY[c.members[i]])),
          )
        : inner(c),
    )
    return open
  },
}
