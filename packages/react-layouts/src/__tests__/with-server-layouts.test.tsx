import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import type { ServerComponent, ServerLayoutComponent } from '../server'
import { withServerLayouts } from '../server'

describe('withServerLayouts', () => {
  it('applies layout nesting order and forwards pageProps', async () => {
    interface PageProps {
      title: string
    }

    const Page: ServerComponent<PageProps> = async ({ title }) => <span>{title}</span>

    const Layout1: ServerLayoutComponent<PageProps> = async ({ children, pageProps }) => (
      <div data-layout='layout-1' data-title={pageProps.title}>
        {children}
      </div>
    )

    const Layout2: ServerLayoutComponent<PageProps> = ({ children }) => (
      <section data-layout='layout-2'>{children}</section>
    )

    const Wrapped = withServerLayouts(Page, [Layout1, Layout2])
    const result = await Wrapped({ title: 'hello' })
    const html = renderToStaticMarkup(<>{result}</>)

    expect(html).toContain('data-layout="layout-2"')
    expect(html).toContain('data-layout="layout-1"')
    expect(html).toContain('data-title="hello"')
    expect(html).toContain('<span>hello</span>')
  })

  it('assigns displayName for anonymous layout during execution', async () => {
    const Page: ServerComponent<{}> = async () => null

    const AnonymousLayout: ServerLayoutComponent<{}> = async ({ children }) => <>{children}</>
    expect(AnonymousLayout.displayName).toBeUndefined()

    const Wrapped = withServerLayouts(Page, [AnonymousLayout])
    await Wrapped({})

    expect(AnonymousLayout.displayName).toBe('Layout1_Page')
  })

  it('hoists selected static properties', () => {
    interface PageProps {
      id: string
    }

    type PageComponent = ServerComponent<PageProps> & { routeMeta?: { auth: boolean } }

    const Page = (async ({ id }: PageProps) => <span>{id}</span>) as PageComponent
    Page.routeMeta = { auth: true }

    const Wrapped = withServerLayouts(Page, [], { propertiesHoist: ['routeMeta'] }) as PageComponent

    expect(Wrapped.routeMeta).toEqual({ auth: true })
  })
})
