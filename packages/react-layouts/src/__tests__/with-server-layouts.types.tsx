import React from 'react'

import type { ServerComponent, ServerLayoutComponent } from '../server'
import { withServerLayouts } from '../server'

interface PageProps {
  title: string
}

type PageComponent = ServerComponent<PageProps> & {
  routeMeta?: {
    auth: boolean
  }
}

const Page = (async ({ title }: PageProps) => <div>{title}</div>) as PageComponent
Page.routeMeta = { auth: true }

const Layout: ServerLayoutComponent<PageProps> = async ({ children, pageProps }) => {
  const title: string = pageProps.title
  void title
  return <>{children}</>
}

const Wrapped = withServerLayouts(Page, [Layout], { propertiesHoist: ['routeMeta'] as const })

const wrappedInput: Parameters<typeof Wrapped>[0] = { title: 'ok' }
const wrappedOutput: ReturnType<typeof Wrapped> = Promise.resolve(<div />)

wrappedInput.title
void wrappedOutput
Wrapped.routeMeta?.auth

const LayoutWithoutProps: ServerLayoutComponent<PageProps> = ({ children }) => <>{children}</>
void LayoutWithoutProps

// @ts-expect-error invalid hoist key
withServerLayouts(Page, [Layout], { propertiesHoist: ['missing'] as const })
