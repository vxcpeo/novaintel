// Safe markdown used by both chat windows: bold, code, links, lists. No raw HTML.
export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

export const TOOL_WORDS = {
  pool_overview: 'pool',
  agent_record: 'agent record',
  loan: 'loan',
  recent_loans: 'recent loans',
  quote_borrow: 'fee quote',
  stock_prices: 'stock prices',
  wallet_position: 'wallet',
}

function href(u) {
  if (/^\/(?!\/)[^\s]*$/.test(u)) return { url: u, ext: false }
  try {
    const x = new URL(u)
    if (x.protocol !== 'https:') return null
    if (x.hostname === 'nasyai.top' || x.hostname === 'www.nasyai.top') return { url: x.pathname + x.search + x.hash, ext: false }
    // x.com is the only outbound link the site allows
    if (x.hostname === 'x.com' || x.hostname === 'twitter.com') return { url: x.href, ext: true }
  } catch {
    /* not a URL */
  }
  return null
}

function link(text, u) {
  const h = href(u)
  if (!h) return esc(text)
  return h.ext
    ? `<a href="${esc(h.url)}" target="_blank" rel="noopener">${esc(text)}</a>`
    : `<a href="${esc(h.url)}">${esc(text)}</a>`
}

function inline(s) {
  const re = /`([^`\n]+)`|\*\*([^*\n]+)\*\*|\[([^\]\n]{1,140})\]\(([^)\s]{1,400})\)|(https?:\/\/[^\s<>()]+[^\s<>().,;:!?'"])/g
  let out = ''
  let i = 0
  let m
  while ((m = re.exec(s))) {
    out += esc(s.slice(i, m.index))
    if (m[1] != null) out += `<code>${esc(m[1])}</code>`
    else if (m[2] != null) out += `<b>${esc(m[2])}</b>`
    else if (m[3] != null) out += link(m[3], m[4])
    else out += link(m[5], m[5])
    i = re.lastIndex
  }
  return out + esc(s.slice(i))
}

export function md(text) {
  const out = []
  let list = null
  let para = []
  const close = () => {
    if (list) {
      out.push(`<${list.tag}>${list.items.map((x) => `<li>${x}</li>`).join('')}</${list.tag}>`)
      list = null
    }
  }
  const flush = () => {
    if (para.length) {
      out.push(`<p>${para.map(inline).join('<br>')}</p>`)
      para = []
    }
  }
  for (const raw of String(text).replace(/\r/g, '').split('\n')) {
    const line = raw.replace(/^#{1,6}\s+(.*)$/, '**$1**')
    const ul = line.match(/^\s*[-*•]\s+(.*)$/)
    const ol = line.match(/^\s*\d+[.)]\s+(.*)$/)
    if (ul || ol) {
      flush()
      const tag = ul ? 'ul' : 'ol'
      if (!list || list.tag !== tag) {
        close()
        list = { tag, items: [] }
      }
      list.items.push(inline((ul || ol)[1]))
    } else if (!line.trim()) {
      flush()
      close()
    } else {
      close()
      para.push(line)
    }
  }
  flush()
  close()
  return out.join('')
}
