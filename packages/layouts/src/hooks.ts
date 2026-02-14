import type React from 'react'
import { useContext } from 'react'

import { AllPagePropsContext } from './context'
import type { AnyComponent } from './context'

type PropsOf<C extends AnyComponent> = React.ComponentProps<C>

export function useAllLayoutProps(): ReadonlyMap<AnyComponent, unknown> {
  return useContext(AllPagePropsContext) as ReadonlyMap<AnyComponent, unknown>
}

export function useLayoutProps<T = unknown>(): T | undefined
export function useLayoutProps<C extends AnyComponent>(component: C): Readonly<PropsOf<C>> | undefined
export function useLayoutProps<C extends AnyComponent, T = unknown>(component?: C) {
  const allPageProps = useAllLayoutProps()

  if (component) {
    return allPageProps.get(component) as Readonly<PropsOf<C>> | undefined
  }

  const mapKeys = Array.from(allPageProps.keys())
  const lastKey = mapKeys[mapKeys.length - 1]
  return (lastKey ? allPageProps.get(lastKey) : undefined) as T | undefined
}
