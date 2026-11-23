# Launch checklist

Everything below is either unconfirmed or untested against a real service. Most items are a single value in `site.config.ts` or an environment variable.

## 1. Domain and hosting
- [ ] Confirm the domain. Set `NEXT_PUBLIC_SITE_URL` (canonical URLs, sitemap, social previews).
- [ ] Deploy to a Node-capable host (Vercel, Netlify, Render, or your own server). The form needs the `/api/consultation` server route. It won't work on a static-only host.
- [ ] Set `NEXT_PUBLIC_SITE_MODE=live` **only on production**. Leave preview and staging deployments on `preview` so they stay noindexed and send nothing.
- [ ] After going live, check that `/robots.txt` lists the sitemap and that pages no longer carry `noindex`. Then submit `/sitemap.xml` in Google Search Console.

## 2. Approved media
- [ ] Replace the temporary Wikimedia Commons photographs with owner-supplied or licensed images (see `ASSETS.md`). Until then, keep attribution visible.
- [ ] Supply photos for the two placeholders: a shaded veranda and a dining table set outdoors.
- [ ] Optional: supply hero footage and set `heroVideo.src`.
- [ ] Optional: supply a logo file and set `brand.logoSrc`. The text wordmark is a stand-in.
- [ ] Property references (Angama Mara, Sirikoi, Segera) are **not shown anywhere**. To use them, approve the wording and imagery, get permission from each property, then set `propertyReferences.approvedForPublicUse`.

## 3. Contact details (all `null` today, so all hidden)
- [ ] `contact.publicEmail`: shown in the footer, privacy notice and form failure message.
- [ ] `contact.phone`: shown in the footer.
- [ ] `contact.whatsappUrl` (`https://wa.me/<number>`): the WhatsApp option appears on the form failure and confirmation screens and in the footer.
- [ ] `contact.schedulingUrl` (Cal.com or Calendly): the "Schedule a call" option appears.
- [ ] Confirm the service promises: `contact.responseTime` ("within two working days"), `consultation.callLength` ("around 45 minutes"), `consultation.proposalTurnaround` ("usually within a week of our call"). These are defaults I chose. Change them to what you can deliver.
- [ ] Confirm `brand.baseLocation` ("Kenya"). Add a city or registered address only if you want it public.

## 4. Live form delivery (**untested against a real inbox or CRM**)
Tested here: validation, spam traps, preview behaviour, failure and retry, and live delivery to a **local mock webhook**, including the signature and campaign fields.
- [ ] Choose a delivery path and set the server environment variables (see `.env.example`):
  - `LEAD_WEBHOOK_URL` (+ optional `LEAD_WEBHOOK_SECRET`) for HubSpot, Pipedrive (via Make or Zapier), n8n or similar, **and/or**
  - `RESEND_API_KEY` + `LEAD_INBOX_EMAIL` for an email to your inbox.
- [ ] Guest confirmation email: verify a sending domain with Resend and set `consultation.autoReply.fromEmail`. The text is in `lib/server/delivery.ts` → `guestConfirmationEmail`. It acknowledges receipt only. **Not yet sent to a real mailbox.**
- [ ] Send a real test enquiry on production, then confirm it arrived and the reply-to works.
- [ ] Optional: Cloudflare Turnstile. Set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`. **Untested.**
- [ ] Follow-up automation is off (`consultation.followUp.enabled`). If enabled, the webhook payload carries `followUp: true` for your CRM to act on. The site sends nothing further itself.
- [ ] The built-in rate limit is per server instance. Add a host firewall rule if you see abuse.

## 5. Analytics and ads (**untested: no IDs supplied**)
- [ ] Set `analytics.ga4MeasurementId`, `analytics.googleAdsId` and `analytics.googleAdsConversionLabel`. The consent banner appears only once at least one ID is set, and tags load only after the visitor opts in.
- [ ] In Google Ads, set the landing page to `/private-safari-kenya` and enable auto-tagging. `gclid` and `utm_*` are stored with each lead.
- [ ] Check the conversion fires once on a successful **live** submission and never on a preview or failed one.
- [ ] Analytics events carry no personal details. Only the whitelisted keys in `lib/analytics.ts` are sent.

## 6. Policy pages (drafts, need review)
- [ ] Have `/privacy` and `/cookies` reviewed for your markets (Kenya Data Protection Act, UK GDPR, EU GDPR, US state laws). Add your legal entity name, contact, processors and retention periods.
- [ ] Add booking terms and conditions before taking bookings. Payment schedules and cancellation terms from the roadmap are **not** published.
- [ ] Add your company registration and any tourism licence details only once confirmed. None are shown today.

## 7. Facts kept off the site until verified
These came from the roadmap and are deliberately absent: founder biography and history, years of operation, guide certifications ("gold/silver-level"), lodge partnerships, priority allocation, 24/7 concierge, owned aircraft or fleet, helicopter-specific offers, testimonials and reviews, awards, licence numbers, "unregulated access". Add any of them only when you can support it.

## 8. Before switching to live
- [ ] Run `npm run build && npm start`, then `npm run test:e2e` (preview), and the live-mode check described in README.
- [ ] Check pages on a real phone (iOS Safari and Android Chrome).
