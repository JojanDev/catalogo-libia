# catalogo-libia

Vanilla Vite 8 + TypeScript 6 web app (no framework). Single-page, no routing.

## Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | `tsc && vite build` — type-check first, then bundle |
| `npm run preview` | Serve production build locally |

There is no separate `typecheck` script; `npm run build` is the only way to run `tsc`.

## TypeScript quirks (TS 6 + Vite 8)

- **`erasableSyntaxOnly: true`** — no `enum`, `namespace`, or parameter properties allowed. Use `const` objects and type unions instead.
- **`verbatimModuleSyntax: true`** — use `import type` / `export type` for type-only imports.
- **`noUnusedLocals` + `noUnusedParameters`** — both on. Unused code is a compilation error.
- **`noEmit: true`** — Vite handles bundling; `tsc` is for type-checking only.
- **`moduleResolution: "bundler"`** — import `.ts` extensions in source (e.g. `'./counter.ts'`).

## Project structure

```
index.html          # entry point (loads /src/main.ts)
src/
  main.ts           # app root — renders into #app
  counter.ts        # exported setupCounter() helper
  style.css         # global styles
  assets/           # static images/SVGs
public/             # served as root (favicon.svg, icons.svg)
```

## What's not here

- No test framework, no tests, no test scripts.
- No linter (ESLint, etc.).
- No CI/CD workflows.
- No pre-commit hooks or task runner config.
- No framework (React, Vue, etc.) — plain DOM manipulation.

## OpenCode config

Model override in `opencode.json` — currently uses `ollama/qwen2.5-coder:7b`.
