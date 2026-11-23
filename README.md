# Blasio Luxury Safaris: website

Next.js (App Router) + TypeScript. Static pages, one server route for the consultation form, and no CMS or database. Content lives in typed files that are easy to edit.

## Run it

```bash
npm install
npm run dev            # http://localhost:3000 (preview mode)
npm run build && npm start
```

## Where things live

| To change… | Edit |
|---|---|
| Launch details: contact, links, mode, analytics IDs, service promises | `site.config.ts` (**the one config file**) |
| Secrets: webhook, email API key, Turnstile | environment variables, see `.env.example` |
| Sample journeys (days, nights, what could change) | `content/journeys.ts` |
| Destination pages | `content/destinations.ts` |
| Experiences page | `content/experiences.ts` |
| Journal articles | `content/journal.ts` |
| Images (file, alt text, credit, rights status) | `content/images.ts` + `public/images/`; see `ASSETS.md` |
| Form questions and options | `lib/consultation.ts` (shared by browser and server validation) |
| Lead delivery and guest confirmation email | `lib/server/delivery.ts` |
| Page layouts and copy not covered above | `app/**/page.tsx` |
| Colours, type, spacing | `app/globals.css` (tokens at the top) |
| Wordmark | `site.config.ts → brand.wordmark` or set `brand.logoSrc` |

## Modes

- **preview** (default): a banner on every page, `noindex` meta + `X-Robots-Tag`, `robots.txt` disallows everything, and the form is labelled as a test. Submissions are validated on the server and **not sent**. The result screen says so.
- **live** (`NEXT_PUBLIC_SITE_MODE=live`): submissions go to the configured webhook and/or inbox. The guest sees a confirmation **only after** at least one delivery channel accepts the lead. If none is configured, or all fail, the guest gets an error with a retry and keeps their answers.

## Consultation flow

Five steps: reason, party, timing, preferences, contact. Answers persist when moving back, and in session storage if the page is reloaded. "I'd like your advice" is available for length, transport, guiding, accommodation, experiences and regions. A phone number is required only when phone or WhatsApp is the preferred contact.

Each lead includes: the answers, the originating page, the journey (if any), a context label, `utm_*`, `gclid`/`gbraid`/`wbraid`/`fbclid`, the landing page and the referrer. Links into the form carry context as query parameters (`?journey=`, `?destination=`, `?interest=family|couple|photography`, `?context=`, `?from=`). See `lib/consult-link.ts`.

Spam protection: a hidden honeypot field, a minimum completion time, a per-instance rate limit, and optional Cloudflare Turnstile.

Webhook payload: `{ type: "consultation_request", lead: {...}, summary: {...} }`, signed with HMAC-SHA256 in `X-Blasio-Signature` when `LEAD_WEBHOOK_SECRET` is set.

## Testing

`tests/e2e.mjs` drives Chromium through every page: navigation, the mobile menu, itinerary links, form progression and validation, failure and retry, the preview result, campaign tracking, no horizontal scroll at 390, 768 and 1440px, metadata, links and robots.

```bash
npm i -D playwright && npx playwright install chromium   # once
npm run build && npm start &
npm run test:e2e
```

Live-mode check (uses a local mock webhook, not a real CRM):

```bash
NEXT_PUBLIC_SITE_MODE=live npm run build
LEAD_WEBHOOK_URL=http://localhost:4010/hook NEXT_PUBLIC_SITE_MODE=live npm start &
# run any HTTP listener on :4010 that returns 200
MODE=live npm run test:e2e
```

## Fonts

Cormorant Garamond (display) and Instrument Sans (text) are self-hosted from `app/fonts/` under the SIL Open Font License. No requests go to Google Fonts.

See `LAUNCH_CHECKLIST.md` before going live.
