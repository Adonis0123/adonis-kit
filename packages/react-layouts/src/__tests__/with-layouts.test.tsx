import React from 'react'
import TestRenderer from 'react-test-renderer'
import { act } from 'react-test-renderer'

import { useAllLayoutProps, useLayoutProps } from '../hooks'
import { withLayouts } from '../with-layouts'

describe('withLayouts', () => {
  it('applies layout nesting order correctly', () => {
    const Page: React.FC = () => <span data-testid='page'>page</span>

    const Layout1: React.FC<React.PropsWithChildren> = ({ children }) => (
      <div data-layout='layout-1'>{children}</div>
    )

    const Layout2: React.FC<React.PropsWithChildren> = ({ children }) => (
      <div data-layout='layout-2'>{children}</div>
    )

    const Wrapped = withLayouts(Page, [Layout1, Layout2])
    let renderer!: TestRenderer.ReactTestRenderer
    act(() => {
      renderer = TestRenderer.create(<Wrapped />)
    })

    const layout2 = renderer.root.findByProps({ 'data-layout': 'layout-2' })
    const layout1 = layout2.findByProps({ 'data-layout': 'layout-1' })
    const page = layout1.findByProps({ 'data-testid': 'page' })

    expect(page.children.join('')).toBe('page')
  })

  it('assigns displayName for anonymous layout during render', () => {
    const Page: React.FC = () => null

    const AnonymousLayout: React.FC<React.PropsWithChildren> = ({ children }) => <>{children}</>
    expect(AnonymousLayout.displayName).toBeUndefined()

    const Wrapped = withLayouts(Page, [AnonymousLayout])
    act(() => {
      TestRenderer.create(<Wrapped />)
    })

    expect(AnonymousLayout.displayName).toBe('Layout1_Page')
  })

  it('hoists selected static properties', () => {
    type PageComponent = React.FC & { routeMeta?: { auth: boolean } }

    const Page = (() => null) as PageComponent
    Page.routeMeta = { auth: true }

    const Wrapped = withLayouts(Page, [], { propertiesHoist: ['routeMeta'] }) as PageComponent

    expect(Wrapped.routeMeta).toEqual({ auth: true })
  })

  it('useLayoutProps(component) returns target component props', () => {
    interface PageProps {
      title: string
    }

    const Page: React.FC<PageProps> = ({ title }) => <span>{title}</span>

    const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
      const props = useLayoutProps(Page)
      return <div data-title={props?.title}>{children}</div>
    }

    const Wrapped = withLayouts(Page, [Layout])
    let renderer!: TestRenderer.ReactTestRenderer
    act(() => {
      renderer = TestRenderer.create(<Wrapped title='hello' />)
    })

    const node = renderer.root.findByProps({ 'data-title': 'hello' })
    expect(node).toBeTruthy()
  })

  it('useAllLayoutProps() returns all component props map', () => {
    interface PageProps {
      count: number
    }

    const Page: React.FC<PageProps> = ({ count }) => <span>{count}</span>

    const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
      const allLayoutProps = useAllLayoutProps()
      const pageProps = allLayoutProps.get(Page) as PageProps | undefined
      return (
        <div data-has-page={String(allLayoutProps.has(Page))} data-count={String(pageProps?.count)}>
          {children}
        </div>
      )
    }

    const Wrapped = withLayouts(Page, [Layout])
    let renderer!: TestRenderer.ReactTestRenderer
    act(() => {
      renderer = TestRenderer.create(<Wrapped count={7} />)
    })

    const node = renderer.root.findByProps({ 'data-has-page': 'true', 'data-count': '7' })
    expect(node).toBeTruthy()
  })

  it('useLayoutProps() returns last component props when called without arguments', () => {
    interface PageProps {
      id: string
    }

    const Page: React.FC<PageProps> = ({ id }) => <span>{id}</span>

    const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
      const props = useLayoutProps<PageProps>()
      return <div data-id={props?.id}>{children}</div>
    }

    const Wrapped = withLayouts(Page, [Layout])
    let renderer!: TestRenderer.ReactTestRenderer
    act(() => {
      renderer = TestRenderer.create(<Wrapped id='abc' />)
    })

    const node = renderer.root.findByProps({ 'data-id': 'abc' })
    expect(node).toBeTruthy()
  })

  it('returns undefined when target component props are missing', () => {
    interface PageProps {
      id: string
    }

    const Page: React.FC<PageProps> = ({ id }) => <span>{id}</span>
    const MissingComponent: React.FC<{ missing: boolean }> = () => null

    const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
      const props = useLayoutProps(MissingComponent)
      return <div data-missing={String(props === undefined)}>{children}</div>
    }

    const Wrapped = withLayouts(Page, [Layout])
    let renderer!: TestRenderer.ReactTestRenderer
    act(() => {
      renderer = TestRenderer.create(<Wrapped id='abc' />)
    })

    const node = renderer.root.findByProps({ 'data-missing': 'true' })
    expect(node).toBeTruthy()
  })
})
