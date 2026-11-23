"use client";

export type ConsentState = { analytics: boolean; ads: boolean; decided: boolean };
const KEY = "blasio-consent-v1";
const EVENT = "blasio-consent-change";

export function readConsent(): ConsentState {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "null");
    if (v && typeof v === "object") return { analytics: !!v.analytics, ads: !!v.ads, decided: true };
  } catch {}
  return { analytics: false, ads: false, decided: false };
}

export function writeConsent(c: { analytics: boolean; ads: boolean }) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...c, at: new Date().toISOString() }));
  } catch {}
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { ...c, decided: true } }));
}

export function onConsentChange(fn: (c: ConsentState) => void) {
  const h = (e: Event) => fn((e as CustomEvent).detail);
  window.addEventListener(EVENT, h);
  return () => window.removeEventListener(EVENT, h);
}

export function openConsentSettings() {
  window.dispatchEvent(new CustomEvent("blasio-open-consent"));
}
