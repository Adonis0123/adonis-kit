import Link from 'next/link'

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@adonis/react-ui'
import { features } from '@/lib/features'

export default function FeaturesPage() {
  return (
    <div className='grid gap-6'>
      <header className='space-y-2'>
        <h2 className='text-2xl font-semibold tracking-tight'>Feature Hub</h2>
        <p className='text-sm text-slate-600'>
          Each feature has its own route so we can scale demos without making the homepage crowded.
        </p>
      </header>

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
              <Button asChild>
                <Link href={feature.href}>Open {feature.title}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}

