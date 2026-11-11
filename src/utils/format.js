export const money = (n, d = 2) =>
  Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })

export const int = (n) => Number(n).toLocaleString('en-US')

export const shortAddr = (a) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : '')

export const toUsd = (b) => Number(b) / 1e6

export const TIERS = [
  [850, 'Pulsar', 'var(--violet)'],
  [600, 'Nasyai', 'var(--cyan)'],
  [300, 'Flare', 'var(--mint)'],
  [100, 'Spark', 'var(--gold)'],
  [0, 'Dust', 'var(--dim)'],
]
export const tierOf = (s) => TIERS.find(([min]) => s >= min)

export const scoreOf = (dollarDays) => Math.min(1000, Math.round(140 * Math.log(1 + dollarDays / 100)))

export const fee = (amt, days) => (amt * days * 0.01) / 30

export function ago(ts) {
  const d = Date.now() / 1000 - ts
  if (d < 0) return 'just now'
  return d < 90 ? 'just now' : d < 5400 ? `${Math.round(d / 60)} min ago` : d < 172800 ? `${Math.round(d / 3600)} h ago` : `${Math.round(d / 86400)} d ago`
}

export const day = (ts) => new Date(ts * 1000).toISOString().slice(0, 10)
