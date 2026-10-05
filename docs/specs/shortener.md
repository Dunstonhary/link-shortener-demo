# Shortener

Core link-shortening flow: paste a URL, get a short link back, visiting the
short link redirects to the original.

## Routes

- **`POST /api/shorten`** — `app/api/shorten/route.ts`
- **`GET /s/[code]`** — `app/s/[code]/route.ts`
- **`/` (home page)** — `app/page.tsx`, the form that drives both of the
  above

## Behavior

### `POST /api/shorten`

Input: JSON body `{ "url": string }`.

- Malformed JSON body → `400` with `{ error: "Request body must be valid JSON." }`.
- Missing or non-string or empty-after-trim `url` → `400` with
  `{ error: 'Body must include a non-empty "url" string.' }`.
- `url` that fails `new URL(url)` (no scheme, not absolute, etc.) → `400`
  with `{ error: '"<url>" is not a valid URL. Include a scheme, e.g.
  https://example.com' }`.
- Otherwise → `200` with `{ code, shortUrl }`, where `shortUrl` is
  `${origin}/s/${code}`.

### `GET /s/[code]`

- `code` is decoded (base64url → UTF-8 string).
- If decoding throws → `400` plain-text `"Could not decode this short link."`
- If the decoded string isn't a valid absolute URL → `400` plain-text
  `"This short link does not decode to a valid URL."`
- Otherwise → `302` redirect to the decoded URL.

### `/` page

Client form: POSTs to `/api/shorten`, shows the resulting short URL with a
copy-to-clipboard button, and links out to `/stats?url=<url>` and
`/qr?url=<url>` for the same URL.

## Design decision: stateless, reversible encoding

`lib/shorten.ts` encodes the short code as the base64url encoding of the
original URL itself (`encodeUrl`/`decodeUrl`), rather than generating a
random ID and storing a URL↔ID mapping. Per the file's own comment, this
is deliberate: *"There is no database: the 'code' is a base64url encoding
of the original URL itself, so decoding the code reproduces the URL
exactly. This keeps the whole feature free of storage, migrations, and
expiry logic."* The redirect route is therefore pure decode-and-redirect —
no lookup, no persistence layer, no expiry to manage. The tradeoff (made
explicit in `docs/specs/stats.md`) is that the short code's length scales
with the original URL's length, so this isn't a "shortening" scheme in the
traditional sense for already-short URLs.

## Notes

Built as PR #3 ("core link shortener"). Per that PR's build notes: plain
`next build` (Turbopack, the Next 16 default) can panic in a worktree with
a symlinked `node_modules` pointing outside the worktree root — an
environment issue, not a code issue. `next build --webpack` is the
verified fallback; `next lint` no longer exists in Next 16, so `eslint .`
is used directly.
