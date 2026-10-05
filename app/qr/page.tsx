import QRCode from 'qrcode'

export const metadata = {
  title: 'QR Code — Link Shortener',
}

function UrlForm({ initialValue, error }: { initialValue?: string; error?: string }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">QR code generator</h1>
      <p className="mt-2 text-neutral-500">
        Paste a URL below to generate a scannable QR code for it.
      </p>

      {error ? (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <form method="GET" action="/qr" className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          name="url"
          defaultValue={initialValue}
          placeholder="https://example.com"
          className="flex-1 rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
        />
        <button
          type="submit"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          Generate QR code
        </button>
      </form>
    </div>
  )
}

export default async function QrPage({
  searchParams,
}: {
  searchParams: Promise<{ url?: string | string[] }>
}) {
  const { url: rawUrl } = await searchParams
  const url = Array.isArray(rawUrl) ? rawUrl[0] : rawUrl

  if (!url) {
    return <UrlForm />
  }

  let parsedUrl: URL
  try {
    parsedUrl = new URL(url)
  } catch {
    return (
      <UrlForm
        initialValue={url}
        error={`"${url}" is not a valid URL. Make sure it includes a scheme, e.g. https://example.com`}
      />
    )
  }

  let dataUrl: string
  try {
    dataUrl = await QRCode.toDataURL(parsedUrl.toString())
  } catch {
    return (
      <UrlForm
        initialValue={url}
        error="Something went wrong generating the QR code. Please try again."
      />
    )
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">QR code</h1>
      <p className="mt-2 break-all text-neutral-500">{parsedUrl.toString()}</p>

      <div className="mt-6 flex flex-col items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element -- data URL, not an optimizable remote/static image */}
        <img
          src={dataUrl}
          alt={`QR code for ${parsedUrl.toString()}`}
          width={256}
          height={256}
          className="h-64 w-64 rounded-md border border-neutral-200"
        />

        <a
          href={dataUrl}
          download="qr.png"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          Download QR code
        </a>
      </div>

      <div className="mt-6 border-t border-neutral-200 pt-4 text-center">
        <a href="/qr" className="text-sm text-neutral-500 hover:text-neutral-700">
          Generate another
        </a>
      </div>
    </div>
  )
}
