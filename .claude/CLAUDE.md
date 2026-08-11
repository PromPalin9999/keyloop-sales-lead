# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Keyloop Sales Lead — a React admin/dashboard front end (car sales leads). Very early scaffold: many files under `src/` are stubs (empty or partially written).

## Commands

- `npm run dev` — start Vite dev server on port 3809 (see `vite.config.ts`)
- `npm run build` — type-check (`tsc -b`) then production build via Vite
- `npm run lint` — ESLint over the whole repo
- `npm run preview` — preview a production build locally

There is no test script wired up yet. Vitest is a dependency and `vite.config.ts` uses `defineConfig` from `vitest/config`, but the `test` block is commented out (no `environment`, no setup file). Uncomment/configure that block before adding tests.

## Architecture

- **Path alias**: `@/*` maps to `src/*` (configured in both `tsconfig.app.json` and `vite.config.ts`). Use `@/...` imports, not relative `../../..` chains.
- **Backend**: Supabase (Auth + Postgres, project `sales-lead-database`). The frontend calls Supabase directly via `@supabase/supabase-js` using `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` (see `.env.development`) — no dev proxy is needed since Supabase allows direct browser requests. There is no separate app backend; the legacy `/api`/`/hubs` dev proxy to `klop-car-sale-demo.net` has been removed.
- **Module layout** (`src/`):
  - `apis/<domain>/` — one folder per API domain (e.g. `account`, `auth`), each with hook(s) (e.g. `useUsers.ts`, `useLogin.ts`) and types, re-exported through a domain `index.ts`, and all domains re-exported through `src/apis/index.ts`. Follow this barrel-export pattern for new API domains.
  - `components/base/` — shared low-level UI wrappers around antd primitives, prefixed `Kl*` (e.g. `KlButton` wraps antd's `Button`). Exported via `src/components/base/index.ts`.
  - `pages/<feature>/` — route-level pages, with a `components/` subfolder for page-local components (e.g. `pages/auth/LoginPage.tsx`, `pages/auth/components/LoginForm.tsx`).
  - `store/` — Zustand stores, one per concern (e.g. `useAuthStore.ts`), re-exported through `src/store/index.ts`.
  - `constants/` — app-wide constants; `routes.ts` defines the `ROUTES` map (`ROOT`, `LOGIN`, `DASHBOARD`) — reference these instead of hardcoding path strings.
  - `utils/` — shared utilities and enums (e.g. `UserRole` in `utils/enum.ts`), re-exported through `src/utils/index.ts`.
  - Nearly every folder here re-exports through a local `index.ts` barrel — add new modules to the matching barrel rather than deep-importing.
- **UI stack**: antd (v6) for components, Tailwind v4 (via `@tailwindcss/vite`) for utility styling, `@ant-design/icons` for icons.
- **State**: Zustand for global state (auth session, etc.).
- **React Compiler**: enabled via `babel-plugin-react-compiler` — avoid manual `useMemo`/`useCallback` micro-optimizations that fight the compiler.

## Linting/formatting notes

- Prettier is run through ESLint (`eslint-plugin-prettier`), not as a separate CLI step — `npm run lint` enforces formatting (single quotes, semicolons, trailing commas, 80-char width).
- `import/order` is enforced (builtin → external → internal → parent → sibling → index, alphabetized).
- `@typescript-eslint/no-explicit-any` is off and unused-vars ignores leading-underscore names (`_foo`).
