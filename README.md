# adonis-react-utils

A pnpm monorepo for publishing reusable React utilities and a personal shadcn registry.

## Packages

- `@adonis/react-layouts`
- `@adonis/react-ui`

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
    "@adonis": "https://<your-domain>/r/{name}.json"
  }
}
```

Then install:

```bash
pnpm dlx shadcn@latest add @adonis/button
```

## npm Distribution

```bash
pnpm add @adonis/react-ui
pnpm add @adonis/react-layouts
```

## Vercel Setup

- Project Root Directory: `apps/web`
- Build Command: `pnpm turbo run build --filter=web`
- Registry endpoints after deploy:
  - `https://<your-domain>/registry.json`
  - `https://<your-domain>/r/button.json`
