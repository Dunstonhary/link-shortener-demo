import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Link Shortener — Multi-Agent Demo',
  description: 'Built by 3 agents working in parallel, each owning one isolated route.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-neutral-50 text-neutral-900 antialiased">
        <header className="border-b border-neutral-200 bg-white">
          <nav className="mx-auto flex max-w-2xl items-center gap-6 px-5 py-4 text-sm font-medium">
            <span className="text-neutral-400">link-shortener-demo</span>
            <a href="/" className="hover:text-neutral-500">Shorten</a>
            <a href="/stats" className="hover:text-neutral-500">Stats</a>
            <a href="/qr" className="hover:text-neutral-500">QR</a>
          </nav>
        </header>
        <main className="mx-auto max-w-2xl px-5 py-10">{children}</main>
      </body>
    </html>
  )
}
