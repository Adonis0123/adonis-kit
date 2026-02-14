export interface FeatureItem {
  key: string
  title: string
  description: string
  href: string
  tags: string[]
}

export const features: FeatureItem[] = [
  {
    key: 'layouts',
    title: 'withLayouts',
    description:
      'Nested layout composition showcase based on @adonis-kit/layouts, including useLayoutProps and context behaviors.',
    href: '/features/layouts',
    tags: ['adonis-kit/layouts', 'composition', 'context'],
  },
  {
    key: 'registry',
    title: 'shadcn Registry',
    description:
      'Public registry endpoints for shadcn CLI downloads, supporting both URL mode and @adonis-kit namespace mode.',
    href: '/registry.json',
    tags: ['shadcn', 'registry', 'distribution'],
  },
]
