import React from 'react'

import { useAllLayoutProps, useLayoutProps } from '../hooks'
import { withLayouts } from '../with-layouts'

interface PageProps {
  title: string
}

type PageComponent = React.FC<PageProps> & {
  routeMeta?: {
    auth: boolean
  }
}

const Page = (({ title }) => <div>{title}</div>) as PageComponent
Page.routeMeta = { auth: true }

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const props = useLayoutProps(Page)
  // @ts-expect-error props can be undefined
  const requiredTitle: string = props.title
  const title: string | undefined = props?.title

  void requiredTitle
  void title
  return <>{children}</>
}

const Wrapped = withLayouts(Page, [Layout], { propertiesHoist: ['routeMeta'] as const })
const wrappedProps: React.ComponentProps<typeof Wrapped> = { title: 'ok' }

wrappedProps.title
Wrapped.routeMeta?.auth

const ReadonlyMapLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const allProps = useAllLayoutProps()

  allProps.get(Page)
  allProps.has(Layout)

  // @ts-expect-error ReadonlyMap cannot be mutated
  allProps.set(Page, { title: 'mutate' })

  const current = useLayoutProps<PageProps>()
  const maybeTitle: string | undefined = current?.title

  void maybeTitle
  return <>{children}</>
}

void ReadonlyMapLayout

// @ts-expect-error invalid hoist key
withLayouts(Page, [Layout], { propertiesHoist: ['missing'] as const })
