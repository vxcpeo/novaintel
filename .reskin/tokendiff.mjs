// Fast source-content diff: compares the current source against the frozen contract.
// Usage: node .reskin/tokendiff.mjs
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { analyzeProject } from 'file:///E:/workspace/chuangye/solana/novaintel/.reskin-tool/scripts/inventory.mjs';

const project = path.resolve(process.argv[2] || '.');
const out = path.join(project, '.reskin');
const base = JSON.parse(fs.readFileSync(path.join(out, 'content-contract.json'), 'utf8'));
const cur = (await analyzeProject(project)).contentContract;

const keyOf = (item) => item.value ?? item.key ?? item.href ?? item.target ?? (item.event ? `${item.event}:${item.handler}` : undefined) ?? (item.tag ? [item.tag, item.name, item.type].join(':') : undefined) ?? (item.kind ? `${item.kind}:${item.expr || item.target || ''}` : undefined) ?? JSON.stringify(item);

function diff(listName) {
  const a = base[listName] || [];
  const b = cur[listName] || [];
  const mapA = new Map(a.map((x) => [keyOf(x), x]));
  const mapB = new Map(b.map((x) => [keyOf(x), x]));
  const missing = [];
  const extra = [];
  for (const [k, v] of mapA) if ((mapB.get(k)?.count || 0) < v.count) missing.push({ key: k, expected: v.count, actual: mapB.get(k)?.count || 0 });
  for (const [k, v] of mapB) if (v.count > (mapA.get(k)?.count || 0)) extra.push({ key: k, expected: mapA.get(k)?.count || 0, actual: v.count });
  return { missing, extra };
}

const lists = ['visibleText', 'hiddenText', 'attributes', 'bindings', 'events', 'links', 'forms', 'i18n'];
let fail = 0;
for (const name of lists) {
  const { missing, extra } = diff(name);
  if (!missing.length && !extra.length) {
    console.log(`${name}: ok (${(base[name] || []).length})`);
    continue;
  }
  console.log(`${name}: MISSING ${missing.length} / EXTRA ${extra.length}`);
  for (const m of missing.slice(0, 25)) console.log(`  - missing x${m.expected - m.actual}: ${JSON.stringify(m.key).slice(0, 170)}`);
  for (const e of extra.slice(0, 25)) console.log(`  + extra x${e.actual - e.expected}: ${JSON.stringify(e.key).slice(0, 170)}`);
  if (name === 'visibleText' || name === 'attributes' || name === 'forms' || name === 'bindings' || name === 'events') fail += 1;
}
console.log(fail ? `\nRESULT: FAIL (${fail} critical list(s))` : '\nRESULT: PASS');
process.exit(fail ? 1 : 0);
