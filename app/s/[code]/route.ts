import { NextRequest, NextResponse } from 'next/server'
import { decodeUrl } from '@/lib/shorten'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params

  let decoded: string
  try {
    decoded = decodeUrl(code)
  } catch {
    return new NextResponse('Could not decode this short link.', {
      status: 400,
      headers: { 'content-type': 'text/plain' },
    })
  }

  try {
    new URL(decoded)
  } catch {
    return new NextResponse('This short link does not decode to a valid URL.', {
      status: 400,
      headers: { 'content-type': 'text/plain' },
    })
  }

  return NextResponse.redirect(decoded, 302)
}
