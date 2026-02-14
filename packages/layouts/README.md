# @react-utils/layouts

React layout composition helpers migrated from `react-dx` (phase 1, no optimization).

## Install

```bash
pnpm add @react-utils/layouts
```

## Usage

```tsx
import { withLayouts, usePageProps } from '@react-utils/layouts'

type PageProps = { title: string }

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const props = usePageProps<PageProps>()
  return (
    <section>
      <h1>{props.title}</h1>
      {children}
    </section>
  )
}

const Page: React.FC<PageProps> = ({ title }) => <div>{title}</div>

export const ComposedPage = withLayouts(Page, [Layout])
```
