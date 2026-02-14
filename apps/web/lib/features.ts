export interface FeatureItem {
  key: string
  title: string
  description: string
  href: string
  tags: string[]
}

export const features: FeatureItem[] = [
  {
    key: 'react-layouts',
    title: 'react-layouts',
    description:
      'Nested layout composition showcase based on @adonis-kit/react-layouts, including useLayoutProps and context behaviors.',
    href: '/features/react-layouts',
    tags: ['@adonis-kit/react-layouts', 'composition', 'context'],
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
