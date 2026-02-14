import Link from 'next/link'

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@react-utils/ui'
import { features } from '@/lib/features'

export default function HomePage() {
  return (
    <div className='grid gap-6'>
      <Card>
        <CardHeader>
          <CardTitle>Personal shadcn dual distribution</CardTitle>
          <CardDescription>
            Feature-first showcase. Keep each capability isolated by route so new features can be added cleanly.
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4 text-sm text-slate-700'>
          <p>
            URL mode: <code>pnpm dlx shadcn@latest add https://&lt;domain&gt;/r/button.json</code>
          </p>
          <p>
            Namespace mode: <code>pnpm dlx shadcn@latest add @react-utils/button</code>
          </p>
          <div className='flex flex-wrap gap-3'>
            <Button asChild>
              <Link href='/features'>Open feature hub</Link>
            </Button>
            <Button asChild variant='outline'>
              <a href='/registry.json'>Open registry.json</a>
            </Button>
          </div>
        </CardContent>
      </Card>
      <section className='grid gap-4 md:grid-cols-2'>
        {features.map((feature) => (
          <Card key={feature.key}>
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='flex flex-wrap gap-2'>
                {feature.tags.map((tag) => (
                  <span
                    key={tag}
                    className='rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700'
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Button asChild variant='outline'>
                <Link href={feature.href}>Open</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
