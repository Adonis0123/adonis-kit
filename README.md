# react-utils-packages

A pnpm monorepo for publishing reusable React utilities and a personal shadcn registry.

## Packages

- `@react-utils/layouts`
- `@react-utils/ui`

## Apps

- `web` (Next.js showcase + shadcn registry host)

## Commands

- `pnpm build`
- `pnpm test`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm dev`
- `pnpm dev:web`
- `pnpm build:web`
- `pnpm registry:build`
- `pnpm changeset`
- `pnpm version-packages`
- `pnpm release`

## shadcn Distribution

1. URL mode

```bash
pnpm dlx shadcn@latest add https://<your-domain>/r/button.json
```

2. Namespace mode

Configure consumer `components.json`:

```json
{
  "registries": {
    "@react-utils": "https://<your-domain>/r/{name}.json"
  }
}
```

Then install:

```bash
pnpm dlx shadcn@latest add @react-utils/button
```

## npm Distribution

```bash
pnpm add @react-utils/ui
pnpm add @react-utils/layouts
```

## Vercel Setup

- Project Root Directory: `apps/web`
- Build Command: `pnpm turbo run build --filter=web`
- Registry endpoints after deploy:
  - `https://<your-domain>/registry.json`
  - `https://<your-domain>/r/button.json`
