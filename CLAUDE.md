# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server with HMR
- `npm run build` — type-check (`tsc -b`) then bundle with Vite; build fails on TS errors
- `npm run lint` — ESLint flat config across the repo
- `npm run preview` — serve the production build locally

There is no test runner configured.

## Architecture

Personal-tools SPA: Vite + React 19 + TypeScript, with `react-router-dom` v7 for routing and Material UI (MUI v7) for components. Entry HTML is `index.html` at the repo root.

**Routing tree lives in `src/main.tsx`.** `BrowserRouter` wraps a single layout route — `App` (in `src/App.tsx`) renders `<Navigation />` plus `<Outlet />` inside an MUI `<Container>`. Page routes are nested children: `/` (Home), `/bookmarks`, `/habits`, `/library`. Add new pages by creating `src/pages/<Name>.tsx` and registering a `<Route>` in `main.tsx`; don't introduce per-page routers.

**MUI theming.** `src/theme.ts` exports a `createTheme` config with `colorSchemes: { light, dark }` and CSS variables enabled (`cssVariables.colorSchemeSelector: 'class'`). `main.tsx` wraps the app in `<ThemeProvider theme={theme} defaultMode="dark">` + `<CssBaseline />`. Style components with the `sx` prop and the theme's tokens (`color: 'text.secondary'`, `py: 5`) — don't reach for raw CSS files; the only remaining stylesheet is `src/index.css`, which is a tiny reset. When updating theme tokens, edit `src/theme.ts` rather than `index.css`.

**Router + MUI integration pattern.** To make MUI components act as router links, pass `component={RouterLink}` and `to="..."` (see `src/components/Navigation.tsx`). For the active-tab indicator, derive `value` from `useLocation().pathname` rather than tracking it in state — this keeps the `<Tabs>` in sync with deep links and back/forward navigation.

**Toolchain quirks (non-default).**

1. **React Compiler is enabled.** `vite.config.ts` runs `@rolldown/plugin-babel` with `reactCompilerPreset()` alongside `@vitejs/plugin-react`. This auto-memoizes components — do not add manual `useMemo`/`useCallback`/`React.memo` unless the compiler bails out on a specific case. Expect dev/build to be slower than a vanilla template (per `README.md`).
2. **TypeScript project references.** Root `tsconfig.json` references `tsconfig.app.json` (covers `src/`, browser/DOM libs) and `tsconfig.node.json` (covers `vite.config.ts`). When adding files outside `src/` that need types, place them under the node tsconfig's scope rather than widening the app config.

`tsconfig.app.json` enables `verbatimModuleSyntax`, `erasableSyntaxOnly`, `noUnusedLocals`, and `noUnusedParameters` — type-only imports must use `import type`, and unused symbols break the build.

Static assets in `public/` (e.g. `icons.svg`) are served from `/` at runtime; assets imported from `src/assets/` go through Vite's bundler.
