import React from 'react'
import TestRenderer from 'react-test-renderer'
import { act } from 'react-test-renderer'

import { useAllPageProps, usePageProps } from '../hooks'
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

  it('assigns displayName to anonymous layouts', () => {
    const Page: React.FC = () => null
    Page.displayName = 'TestPage'

    const AnonymousLayout: React.FC<React.PropsWithChildren> = ({ children }) => <>{children}</>

    const Wrapped = withLayouts(Page, [AnonymousLayout])
    act(() => {
      TestRenderer.create(<Wrapped />)
    })

    expect(AnonymousLayout.displayName).toBe('Layout1_TestPage')
  })

  it('hoists selected static properties', () => {
    type PageComponent = React.FC & { routeMeta?: { auth: boolean } }

    const Page = (() => null) as PageComponent
    Page.routeMeta = { auth: true }

    const Wrapped = withLayouts(Page, [], { propertiesHoist: ['routeMeta'] }) as PageComponent

    expect(Wrapped.routeMeta).toEqual({ auth: true })
  })

  it('usePageProps() returns current page props', () => {
    interface PageProps {
      title: string
    }

    const Page: React.FC<PageProps> = ({ title }) => <span>{title}</span>

    const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
      const props = usePageProps<PageProps>()
      return <div data-title={props.title}>{children}</div>
    }

    const Wrapped = withLayouts(Page, [Layout])
    let renderer!: TestRenderer.ReactTestRenderer
    act(() => {
      renderer = TestRenderer.create(<Wrapped title='hello' />)
    })

    const node = renderer.root.findByProps({ 'data-title': 'hello' })
    expect(node).toBeTruthy()
  })

  it('usePageProps(component) returns target component props', () => {
    interface PageProps {
      count: number
    }

    const Page: React.FC<PageProps> = ({ count }) => <span>{count}</span>

    const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
      const props = usePageProps<PageProps>(Page)
      return <div data-count={String(props.count)}>{children}</div>
    }

    const Wrapped = withLayouts(Page, [Layout])
    let renderer!: TestRenderer.ReactTestRenderer
    act(() => {
      renderer = TestRenderer.create(<Wrapped count={7} />)
    })

    const node = renderer.root.findByProps({ 'data-count': '7' })
    expect(node).toBeTruthy()
  })

  it('useAllPageProps can read props from context', () => {
    interface PageProps {
      id: string
    }

    const Page: React.FC<PageProps> = ({ id }) => <span>{id}</span>

    const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
      const allPageProps = useAllPageProps()
      return <div data-has-page={String(allPageProps.has(Page))}>{children}</div>
    }

    const Wrapped = withLayouts(Page, [Layout])
    let renderer!: TestRenderer.ReactTestRenderer
    act(() => {
      renderer = TestRenderer.create(<Wrapped id='abc' />)
    })

    const node = renderer.root.findByProps({ 'data-has-page': 'true' })
    expect(node).toBeTruthy()
  })
})
