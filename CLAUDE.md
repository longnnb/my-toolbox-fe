# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server with HMR
- `npm run build` — type-check (`tsc -b`) then bundle with Vite; build fails on TS errors
- `npm run lint` — ESLint flat config across the repo
- `npm run preview` — serve the production build locally

There is no test runner configured.

## Architecture

Single-page Vite + React 19 + TypeScript app, currently a scaffolded starter (one `App` component rendered into `#root` via `src/main.tsx`). Entry HTML is `index.html` at the repo root.

Two non-default toolchain choices to know about:

1. **React Compiler is enabled.** `vite.config.ts` runs `@rolldown/plugin-babel` with `reactCompilerPreset()` alongside `@vitejs/plugin-react`. This auto-memoizes components — do not add manual `useMemo`/`useCallback`/`React.memo` unless the compiler bails out on a specific case. Expect dev/build to be slower than a vanilla template (per `README.md`).
2. **TypeScript project references.** Root `tsconfig.json` references `tsconfig.app.json` (covers `src/`, browser/DOM libs) and `tsconfig.node.json` (covers `vite.config.ts`). When adding files outside `src/` that need types, place them under the node tsconfig's scope rather than widening the app config.

`tsconfig.app.json` enables `verbatimModuleSyntax`, `erasableSyntaxOnly`, `noUnusedLocals`, and `noUnusedParameters` — type-only imports must use `import type`, and unused symbols break the build.

Static assets in `public/` (e.g. `icons.svg`) are served from `/` at runtime; assets imported from `src/assets/` go through Vite's bundler.
