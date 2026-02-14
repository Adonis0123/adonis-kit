# Repository Guidelines

## Project Structure & Module Organization
This folder contains publishable libraries under `packages/*`:

- `packages/layouts`: React layout composition utilities (`src/`, tests in `src/__tests__/`, demo in `demo/`).
- `packages/ui`: shadcn-style UI components (`src/components`, shared helpers in `src/lib`, global styles in `src/styles`).

At monorepo root, `apps/web` consumes these packages for showcase/registry usage. Keep package public APIs re-exported from each package `src/index.ts`.

## Build, Test, and Development Commands
Run from monorepo root unless noted:

- `pnpm build`: Turbo builds all packages/apps.
- `pnpm test`: Runs test tasks across workspaces.
- `pnpm lint`: Type-check-based lint task in each package.
- `pnpm typecheck`: Full workspace type checks.
- `pnpm dev`: Starts workspace dev tasks in parallel.
- `pnpm -C packages/layouts test`: Runs Vitest suite for `@adonis-kit/layouts`.
- `pnpm -C packages/layouts dev`: Runs Vite demo server for layouts.
- `pnpm -C packages/ui build`: Bundles UI package with `tsup`.

## Coding Style & Naming Conventions
- Language: TypeScript + React (ESM).
- Formatting pattern used in source: 2-space indentation, single quotes, minimal semicolons.
- Components/types: `PascalCase` (for example, `ButtonProps`, `WithLayoutsOptions`).
- Functions/variables/files: `camelCase` (except React component files like `button.tsx` following existing package style).
- Add exports in `src/index.ts` whenever introducing new public modules.

## Testing Guidelines
- Framework: Vitest (`packages/layouts/vitest.config.ts`), tests matched by `src/__tests__/**/*.test.ts?(x)`.
- Prefer behavior-focused assertions (rendered output, props flow, edge cases).
- New features in `layouts` should include/adjust tests in `src/__tests__/`.
- `ui` currently has no test suite; add Vitest tests when introducing non-trivial logic.

## Commit & Pull Request Guidelines
The repository is currently bootstrap-stage (no commit history yet). Use Conventional Commits from now on:

- `feat(layouts): add nested layout memoization`
- `fix(ui): preserve child className in Button asChild mode`

For PRs, include: scope (`layouts`/`ui`/`web`), concise change summary, linked issue (if any), validation commands run, and screenshots for UI-visible changes. Add a Changeset (`pnpm changeset`) for publishable package changes.
