# Reskin inventory — nasyai-website

Generated: 2026-11-11T09:19:48.559Z

## Project

| Field | Value |
|---|---|
| Root | `E:/workspace/chuangye/solana/novaintel/.baseline-src` |
| Vue | ^3.5.13 |
| Package manager | pnpm |
| Nuxt | no |
| CSS frameworks | none detected |
| Files scanned | 55 (36 SFCs) |

## Original skeleton

- Archetype: **orbital** (spatial)
- Traits: sidebar, cards, hero, table, grid, tabs, modal, charts, sticky, orbital, terminal, ticker
- Max template depth: 11
- Top-level tags: appheader, routerview, appfooter, toasthost, walletsheet, nasyaibuddy, article, footer, a, header, div, div, aside, article, div, section, section, div, section, section, canvas, span, section, div, div, main, main, main, main, main, main, main, main, main, main, main, main, main, main, main, main, main, main

The replacement skeleton must not be `orbital` and must not be in the same family (`spatial`).

## Routes

- `/`
- `/agents`
- `/board`
- `/brand`
- `/contact`
- `/crew`
- `/desk`
- `/launches`
- `/log`
- `/nasyai`
- `/participate`
- `/privacy`
- `/protocol`
- `/seats`
- `/start`
- `/stocks`
- `/use`

## Palette (most used first)

`#000000` (35) · `#ffffff` (30) · `#05050b` (20) · `#3dd8ff` (17) · `#4dffb8` (17) · `#8b6cff` (13) · `#f5f6ff` (8) · `#ffc24b` (8) · `#0b0b13` (6) · `#0c0c14` (4)

## Content lock

- Static visible text tokens: **1158**
- Binding expressions: **206**
- Event handlers: **73**
- Contract hash: `4de9e856b5c7552f44f8b7b5339a48365181c18f71ecc106a9ed8fbac85af600`

Everything in `.reskin/content-contract.json` is immutable: visible copy, placeholders, labels, routes, link targets, asset sources, bindings, handlers, API endpoints and i18n values. A reskin may move these tokens to new markup but may not rewrite, remove or hide them.

## Next

```bash
node scripts/choose-style.mjs --project "E:/workspace/chuangye/solana/novaintel/.baseline-src" --out .reskin
node scripts/verify.mjs baseline --project "E:/workspace/chuangye/solana/novaintel/.baseline-src" --out .reskin
```

Then rewrite the UI and run `verify.mjs check`.
