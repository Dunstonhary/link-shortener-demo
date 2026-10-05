'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'

type ShortenResult = {
  code: string
  shortUrl: string
}

export default function HomePage() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState<ShortenResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    setCopied(false)

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error ?? 'Something went wrong.')
        return
      }

      setResult(data)
    } catch {
      setError('Could not reach the server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setError('Could not copy to clipboard.')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Link shortener</h1>
        <p className="mt-2 text-neutral-500">
          Paste a URL. The short code is a reversible encoding of the URL
          itself — no database needed.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-5 sm:flex-row"
      >
        <input
          type="text"
          inputMode="url"
          placeholder="https://example.com/a/long/path"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          required
          className="flex-1 rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? 'Shortening…' : 'Shorten'}
        </button>
      </form>

      {error && (
        <p className="rounded-md border border-neutral-200 bg-white p-4 text-sm text-red-600">
          {error}
        </p>
      )}

      {result && (
        <div className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <a
              href={result.shortUrl}
              className="break-all text-sm font-medium text-neutral-900 underline"
            >
              {result.shortUrl}
            </a>
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 rounded-md border border-neutral-200 px-3 py-1.5 text-sm font-medium hover:bg-neutral-50"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <div className="flex gap-4 border-t border-neutral-200 pt-4 text-sm">
            <a
              href={`/stats?url=${encodeURIComponent(url)}`}
              className="text-neutral-500 hover:text-neutral-900"
            >
              View stats →
            </a>
            <a
              href={`/qr?url=${encodeURIComponent(url)}`}
              className="text-neutral-500 hover:text-neutral-900"
            >
              Get QR code →
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
