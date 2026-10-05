import { NextRequest, NextResponse } from 'next/server'
import { encodeUrl } from '@/lib/shorten'

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Request body must be valid JSON.' },
      { status: 400 },
    )
  }

  const url = (body as { url?: unknown })?.url

  if (typeof url !== 'string' || url.trim() === '') {
    return NextResponse.json(
      { error: 'Body must include a non-empty "url" string.' },
      { status: 400 },
    )
  }

  try {
    new URL(url)
  } catch {
    return NextResponse.json(
      { error: `"${url}" is not a valid URL. Include a scheme, e.g. https://example.com` },
      { status: 400 },
    )
  }

  const code = encodeUrl(url)
  const shortUrl = `${request.nextUrl.origin}/s/${code}`

  return NextResponse.json({ code, shortUrl })
}
