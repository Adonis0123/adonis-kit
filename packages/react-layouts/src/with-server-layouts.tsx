import React from 'react'

import { getDisplayName } from './internal/react-nodes'

type Asyncable<T> = T | Promise<T>

export type ServerComponent<P = Record<string, unknown>> = (props: P) => Asyncable<React.ReactNode>
type PropsOf<C extends ServerComponent<any>> = C extends (props: infer P) => Asyncable<any> ? P : never

export type ServerLayoutComponent<PageProps> = ((
  props: React.PropsWithChildren<{ pageProps: Readonly<PageProps> }>,
) => Asyncable<React.ReactNode>) & { displayName?: string }

export interface WithServerLayoutsOptions<
  C extends ServerComponent<any>,
  K extends readonly (keyof C & string)[] = readonly [],
> {
  /** page properties to hoist */
  propertiesHoist?: K
}

/**
 * Compose a server page with server layouts.
 *
 * Layouts are applied inside-out:
 * `withServerLayouts(Page, [Layout1, Layout2])` =>
 * `<Layout2><Layout1><Page /></Layout1></Layout2>`
 */
export function withServerLayouts<
  C extends ServerComponent<any>,
  K extends readonly (keyof C & string)[] = readonly [],
>(
  Page: C,
  Layouts: readonly ServerLayoutComponent<PropsOf<C>>[],
  options: WithServerLayoutsOptions<C, K> = {},
): ServerComponent<PropsOf<C>> & Pick<C, K[number]> {
  const { propertiesHoist = [] } = options
  const pageDisplayName = getDisplayName(Page as unknown as React.ComponentType<any>)

  const WithServerLayoutsPage = async (pageProps: PropsOf<C>) => {
    let children = await Page(pageProps)

    for (let index = 0; index < Layouts.length; index++) {
      const Layout = Layouts[index]

      if (!Layout.displayName) {
        Layout.displayName = `Layout${index + 1}_${pageDisplayName}`
      }

      children = await Layout({ children, pageProps })
    }

    return children
  }

  ;(WithServerLayoutsPage as { displayName?: string }).displayName = `WithServerLayouts(${pageDisplayName})`

  const WrappedPage = WithServerLayoutsPage as ServerComponent<PropsOf<C>> & Pick<C, K[number]>

  propertiesHoist.forEach((item) => {
    if (item in Page) {
      const descriptor = Object.getOwnPropertyDescriptor(Page, item)
      if (descriptor) {
        Object.defineProperty(WrappedPage, item, descriptor)
      }
    }
  })

  return WrappedPage
}
