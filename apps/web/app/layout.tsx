import './globals.css'

import Link from 'next/link'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'react-utils registry',
  description: 'Personal shadcn registry and layouts showcase',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className='min-h-screen bg-slate-50 text-slate-900 antialiased'>
        <div className='mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8'>
          <header className='mb-8 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between'>
            <h1 className='text-xl font-semibold tracking-tight'>react-utils registry</h1>
            <nav className='flex items-center gap-4 text-sm'>
              <Link href='/' className='text-slate-700 hover:text-slate-950'>
                Home
              </Link>
              <Link href='/features' className='text-slate-700 hover:text-slate-950'>
                Features
              </Link>
              <Link href='/features/layouts' className='text-slate-700 hover:text-slate-950'>
                withLayouts
              </Link>
              <a href='/registry.json' className='text-slate-700 hover:text-slate-950'>
                registry.json
              </a>
            </nav>
          </header>
          <main className='flex-1'>{children}</main>
        </div>
      </body>
    </html>
  )
}
