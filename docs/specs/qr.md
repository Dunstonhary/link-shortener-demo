# QR code

`/qr` page — generates a scannable QR code image for a given URL, with a
download link.

## Route

- **`/qr`** — `app/qr/page.tsx`, a server component reading the `?url=`
  search param. Self-contained; does not depend on the shortener or stats
  routes.

## Behavior

- No `url` param → renders just the input form.
- `url` present but fails `new URL(url)` → form re-rendered with the
  submitted value preserved and an inline error: `"<url>" is not a valid
  URL. Make sure it includes a scheme, e.g. https://example.com"`
- `url` valid but QR generation throws (`QRCode.toDataURL`) → form
  re-rendered with a generic error: `"Something went wrong generating the
  QR code. Please try again."`
- Otherwise → renders:
  - the normalized URL (`parsedUrl.toString()`) as text
  - a `256×256` `<img>` built from the QR code's data URL (`qrcode`
    package, `QRCode.toDataURL`)
  - a "Download QR code" link (`download="qr.png"`) pointing at the same
    data URL
  - a "Generate another" link back to `/qr` with no params

## Design decisions

- **No server-side file storage.** The QR code is generated as a data URL
  in-memory and never written to disk or served as a static asset — the
  `<img src>` and the download link both point at the same base64 data
  URI. This keeps the route stateless, consistent with the rest of the
  app having no database.
- **Normalizes before encoding.** The QR code encodes `parsedUrl.toString()`
  (the `URL` object's canonical form), not the raw query param, so
  equivalent URLs with different literal formatting produce the same code.
- `@next/next/no-img-element` is explicitly disabled on the `<img>` tag
  (inline comment in the source) because the image is a data URL, not a
  remote or static asset Next's image optimizer could handle.

## Notes

Built as PR #1 ("QR code page"), one of 3 features built in parallel by
separate agents, self-contained from the core shortener and stats routes.
