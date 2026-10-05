/**
 * Stateless, reversible link shortening.
 *
 * There is no database: the "code" is a base64url encoding of the original
 * URL itself, so decoding the code reproduces the URL exactly. This keeps
 * the whole feature free of storage, migrations, and expiry logic.
 */

export function encodeUrl(url: string): string {
  return Buffer.from(url, 'utf-8').toString('base64url')
}

export function decodeUrl(code: string): string {
  return Buffer.from(code, 'base64url').toString('utf-8')
}

/** Throws if `value` is not a valid, absolute URL. */
export function assertValidUrl(value: string): URL {
  return new URL(value)
}
