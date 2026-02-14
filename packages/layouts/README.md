# @adonis-kit/layouts

Declarative layout composition for React. Wrap any page component with nested layouts and share props across the tree via context — zero prop-drilling required.

## Install

```bash
pnpm add @adonis-kit/layouts
```

> Peer dependency: `react >= 16.9.0`

## Quick Start

```tsx
import { withLayouts, useLayoutProps } from '@adonis-kit/layouts'

const Page: React.FC<{ title: string }> = ({ title }) => <h2>{title}</h2>

const Header: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { title } = useLayoutProps(Page) // type-safe, inferred as { title: string }
  return (
    <div>
      <header>{title}</header>
      <main>{children}</main>
    </div>
  )
}

const App = withLayouts(Page, [Header])

// Usage: <App title="Hello" />
// Renders:
// <Header>
//   <Page title="Hello" />
// </Header>
```

## API

### `withLayouts(Page, Layouts, options?)`

Composes a page component with an array of layout wrappers. Layouts nest **inside-out** — the first layout is closest to the page.

```tsx
const Composed = withLayouts(Page, [Layout1, Layout2])

// Equivalent to:
// <Layout2>
//   <Layout1>
//     <Page />
//   </Layout1>
// </Layout2>
```

**Parameters:**

| Name | Type | Description |
|---|---|---|
| `Page` | `ComponentType` | The page component to wrap |
| `Layouts` | `ComponentType<PropsWithChildren>[]` | Layout components applied inside-out |
| `options.propertiesHoist` | `string[]` | Static properties to copy from `Page` to the composed component |

**Returns:** A component that accepts the same props as `Page`.

### `useLayoutProps(component)`

Retrieves the props of a specific component from the nearest `withLayouts` context. Types are automatically inferred.

```tsx
const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { title } = useLayoutProps(Page) // ← fully typed
  return <div>{children}</div>
}
```

Throws if the target component is not found in context.

### `useLayoutProps()`

Returns all component props as a `ReadonlyMap<ComponentType, unknown>`.

```tsx
const Debug: React.FC<React.PropsWithChildren> = ({ children }) => {
  const allProps = useLayoutProps()
  console.log('Components in context:', allProps.size)
  return <>{children}</>
}
```

## Recipes

### Multiple Layouts

```tsx
const Sidebar: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="with-sidebar">
    <nav>Sidebar</nav>
    <div>{children}</div>
  </div>
)

const Footer: React.FC<React.PropsWithChildren> = ({ children }) => (
  <>
    {children}
    <footer>Footer</footer>
  </>
)

// Nesting order: Page → Sidebar → Footer (outermost)
const App = withLayouts(Page, [Sidebar, Footer])
```

### Nested `withLayouts`

Layouts themselves can use `withLayouts` to introduce sub-layouts. The inner `useLayoutProps` can access props from any ancestor context.

```tsx
const InnerLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { title } = useLayoutProps(Page) // works — reads from outer context
  return <section>{children}</section>
}

const OuterLayout = withLayouts(InnerLayout, [SubLayout])

const App = withLayouts(Page, [OuterLayout])
```

### Hoisting Static Properties

If your page component has static properties (e.g. `getLayout`), hoist them to the composed component:

```tsx
Page.getInitialProps = async () => ({ title: 'Hello' })

const App = withLayouts(Page, [Layout], {
  propertiesHoist: ['getInitialProps'],
})

App.getInitialProps // ← preserved
```

## Acknowledgements

This package was originally inspired by [react-dx](https://github.com/yunsii/react-dx). Special thanks to the original author for the foundational ideas.
