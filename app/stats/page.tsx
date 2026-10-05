/**
 * Owned by agent 3 (feature: stats page). Fully self-contained — reads the
 * `?url=` search param, parses it, and reports a few honest, locally
 * computed facts about it. No imports from other agents' routes.
 */

const SHORT_PREFIX = '/s/'

type StatsPageProps = {
  searchParams: Promise<{ url?: string | string[] }>
}

function UrlForm({ initialValue, error }: { initialValue?: string; error?: string }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6">
      <h1 className="text-2xl font-bold">URL stats</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Paste a URL to see its domain, length, and how it would compare if shortened.
      </p>
      <form action="/stats" method="get" className="mt-5 flex gap-2">
        <input
          type="text"
          name="url"
          defaultValue={initialValue}
          placeholder="https://example.com/some/long/path"
          className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
        />
        <button
          type="submit"
          className="shrink-0 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          Check
        </button>
      </form>
      {error && (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}

export default async function StatsPage({ searchParams }: StatsPageProps) {
  const params = await searchParams
  const raw = params.url
  const urlParam = Array.isArray(raw) ? raw[0] : raw

  if (!urlParam) {
    return <UrlForm />
  }

  let parsed: URL
  try {
    parsed = new URL(urlParam)
  } catch {
    return (
      <UrlForm
        initialValue={urlParam}
        error={`"${urlParam}" is not a valid URL. Make sure it includes a scheme, e.g. https://example.com.`}
      />
    )
  }

  const originalLength = urlParam.length
  const encodedLength = Buffer.from(urlParam).toString('base64url').length
  const shortenedLength = SHORT_PREFIX.length + encodedLength
  const isShorter = shortenedLength < originalLength
  const diff = Math.abs(originalLength - shortenedLength)

  return (
    <div className="flex flex-col gap-6">
      <UrlForm initialValue={urlParam} />

      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-semibold">Breakdown</h2>
        <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-neutral-200 p-3">
            <dt className="text-xs uppercase tracking-wide text-neutral-400">Domain</dt>
            <dd className="mt-1 break-all font-mono text-sm">{parsed.hostname}</dd>
          </div>
          <div className="rounded-md border border-neutral-200 p-3">
            <dt className="text-xs uppercase tracking-wide text-neutral-400">Protocol</dt>
            <dd className="mt-1 font-mono text-sm">{parsed.protocol}</dd>
          </div>
          <div className="rounded-md border border-neutral-200 p-3">
            <dt className="text-xs uppercase tracking-wide text-neutral-400">Original length</dt>
            <dd className="mt-1 font-mono text-sm">{originalLength} characters</dd>
          </div>
          <div className="rounded-md border border-neutral-200 p-3">
            <dt className="text-xs uppercase tracking-wide text-neutral-400">
              Shortened length ({SHORT_PREFIX}+base64url)
            </dt>
            <dd className="mt-1 font-mono text-sm">{shortenedLength} characters</dd>
          </div>
        </dl>

        <p className="mt-4 text-sm text-neutral-600">
          {isShorter ? (
            <>
              Encoding this URL as base64url under <span className="font-mono">{SHORT_PREFIX}</span> is{' '}
              <span className="font-semibold text-green-700">{diff} character{diff === 1 ? '' : 's'} shorter</span>{' '}
              than the original.
            </>
          ) : shortenedLength === originalLength ? (
            <>
              Encoding this URL as base64url under <span className="font-mono">{SHORT_PREFIX}</span> comes out to{' '}
              <span className="font-semibold">exactly the same length</span> as the original.
            </>
          ) : (
            <>
              Encoding this URL as base64url under <span className="font-mono">{SHORT_PREFIX}</span> is actually{' '}
              <span className="font-semibold text-amber-700">{diff} character{diff === 1 ? '' : 's'} longer</span>{' '}
              than the original. Base64url encoding the whole URL isn&apos;t a real shortening scheme for short
              URLs — it only pays off once the original URL is long enough that a fixed-width code (like a random
              short ID) would beat it. This demo shows the honest number either way.
            </>
          )}
        </p>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-semibold">Demo stat</h2>
        <p className="mt-2 text-sm text-neutral-600">
          <span className="font-semibold">Demo click count: 1</span> — this demo has no database, so this number is
          illustrative, not a real measurement.
        </p>
      </div>
    </div>
  )
}
