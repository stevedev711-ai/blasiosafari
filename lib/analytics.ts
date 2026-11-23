"use client";

import { siteConfig } from "@/site.config";

/**
 * Analytics events never include personal details. Only these parameter keys
 * are passed through; anything else is dropped.
 */
const ALLOWED = new Set(["step", "step_name", "purpose", "party_type", "journey", "context", "source_page", "mode", "error_code"]);

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    gtag?: Gtag;
    dataLayer?: unknown[];
  }
}

export function track(event: string, params: Record<string, string | number | undefined> = {}) {
  if (typeof window === "undefined" || !window.gtag) return;
  const safe: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(params)) if (ALLOWED.has(k) && v !== undefined && v !== "") safe[k] = v;
  window.gtag("event", event, safe);
}

/** Google Ads conversion for an accepted live submission. Runs only when Ads is configured and consented. */
export function trackConversion() {
  const { googleAdsId, googleAdsConversionLabel } = siteConfig.analytics;
  if (!window.gtag || !googleAdsId || !googleAdsConversionLabel) return;
  window.gtag("event", "conversion", { send_to: `${googleAdsId}/${googleAdsConversionLabel}` });
}
