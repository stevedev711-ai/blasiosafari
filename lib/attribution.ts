"use client";

/** Captures campaign parameters on the first page of a visit and keeps them for the session. */
const KEY = "blasio-attribution";
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid", "fbclid"] as const;

export type Attribution = Partial<Record<(typeof PARAMS)[number] | "landingPage" | "referrer", string>>;

export function captureAttribution() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  const found: Attribution = {};
  for (const p of PARAMS) {
    const v = url.searchParams.get(p);
    if (v) found[p] = v.slice(0, 300);
  }
  let existing: Attribution | null = null;
  try {
    existing = JSON.parse(sessionStorage.getItem(KEY) || "null");
  } catch {}
  // New campaign parameters replace older ones; otherwise keep the first touch of the session.
  if (Object.keys(found).length || !existing) {
    const next: Attribution = {
      ...found,
      landingPage: url.pathname + url.search,
      referrer: document.referrer && !document.referrer.startsWith(window.location.origin) ? document.referrer.slice(0, 500) : "",
    };
    try {
      sessionStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
    memory = next;
  }
}

let memory: Attribution = {};

export function getAttribution(): Attribution {
  try {
    const v = JSON.parse(sessionStorage.getItem(KEY) || "null");
    if (v) return v;
  } catch {}
  return memory;
}
