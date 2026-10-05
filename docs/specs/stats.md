# Stats

`/stats` page — shows a few locally-computed facts about a URL, including
how it would compare if run through the shortener's own encoding.

## Route

- **`/stats`** — `app/stats/page.tsx`, a server component reading the
  `?url=` search param. No other route or file depends on it.

## Behavior

- No `url` param → renders just the input form.
- `url` present but fails `new URL(url)` → form re-rendered with the
  submitted value preserved and an inline error: `"<url>" is not a valid
  URL. Make sure it includes a scheme, e.g. https://example.com."`
- `url` present and valid → renders a breakdown:
  - **Domain** — `parsed.hostname`
  - **Protocol** — `parsed.protocol`
  - **Original length** — `url.length` (raw param string, in characters)
  - **Shortened length** — `'/s/'.length + base64url(url).length`, i.e.
    the same encoding `lib/shorten.ts` uses for the actual short link
  - A sentence stating whether the shortened form is shorter, longer, or
    exactly the same length, with the character difference called out
  - A fixed "Demo stat" block: `"Demo click count: 1"`, explicitly labeled
    as illustrative since there's no database to count real clicks

## Design decision: honest numbers, not flattering ones

The length comparison can (and often does) show the "shortened" URL as
*longer* than the original — because, per `app/stats/page.tsx`'s own copy,
"Base64url encoding the whole URL isn't a real shortening scheme for short
URLs — it only pays off once the original URL is long enough that a
fixed-width code (like a random short ID) would beat it." This page exists
to surface that honestly rather than hide it, using the exact encoding
`/api/shorten` uses so the numbers are never hypothetical.

The click count is a hardcoded `1`, explicitly labeled as a demo value —
there is no database anywhere in this app to track real visits.

## Notes

Built as PR #2 ("URL stats page"), one of 3 features built in parallel by
separate agents against the same shortener encoding (`lib/shorten.ts`),
intentionally self-contained: it imports nothing from the other two
routes, it re-derives the same base64url math inline.
