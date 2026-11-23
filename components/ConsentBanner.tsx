"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";
import { siteConfig } from "@/site.config";
import { onConsentChange, openConsentSettings, readConsent, writeConsent, type ConsentState } from "@/lib/consent";

const { ga4MeasurementId, googleAdsId } = siteConfig.analytics;
const anyTracking = Boolean(ga4MeasurementId || googleAdsId);

/**
 * Consent banner + gated tags. Nothing loads unless an ID is configured in
 * site.config.ts AND the visitor has opted in to that category.
 */
export function ConsentManager() {
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [show, setShow] = useState(false);
  const [custom, setCustom] = useState(false);
  const [draft, setDraft] = useState({ analytics: false, ads: false });

  useEffect(() => {
    const c = readConsent();
    setConsent(c);
    setDraft({ analytics: c.analytics, ads: c.ads });
    if (anyTracking && !c.decided) setShow(true);
    const off = onConsentChange((n) => setConsent(n));
    const open = () => {
      setCustom(true);
      setShow(true);
    };
    window.addEventListener("blasio-open-consent", open);
    return () => {
      off();
      window.removeEventListener("blasio-open-consent", open);
    };
  }, []);

  const save = (c: { analytics: boolean; ads: boolean }) => {
    writeConsent(c);
    setShow(false);
    setCustom(false);
  };

  const gaOn = Boolean(ga4MeasurementId && consent?.analytics);
  const adsOn = Boolean(googleAdsId && consent?.ads);
  const loadTag = gaOn || adsOn;
  const tagId = gaOn ? ga4MeasurementId! : googleAdsId!;

  return (
    <>
      {loadTag && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${tagId}`} strategy="afterInteractive" />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
gtag('consent','default',{ad_storage:'${adsOn ? "granted" : "denied"}',ad_user_data:'${adsOn ? "granted" : "denied"}',ad_personalization:'${adsOn ? "granted" : "denied"}',analytics_storage:'${gaOn ? "granted" : "denied"}'});
gtag('js',new Date());
${gaOn ? `gtag('config','${ga4MeasurementId}',{anonymize_ip:true});` : ""}
${adsOn ? `gtag('config','${googleAdsId}');` : ""}`}
          </Script>
        </>
      )}
      {show && (
        <div className="consent" role="dialog" aria-modal="false" aria-labelledby="consent-title">
          <h2 id="consent-title">Cookies</h2>
          {!anyTracking ? (
            <>
              <p>This site doesn&apos;t use analytics or advertising cookies at the moment. If that changes, you&apos;ll be asked first.</p>
              <div className="consent-actions">
                <button className="btn btn-light" onClick={() => setShow(false)}>Close</button>
              </div>
            </>
          ) : !custom ? (
            <>
              <p>
                With your permission, we use analytics to see how the site is used, and advertising cookies to measure our ads. Your enquiry
                details are never shared with these tools. <Link href="/cookies">Cookie policy</Link>
              </p>
              <div className="consent-actions">
                <button className="btn btn-light" onClick={() => save({ analytics: true, ads: true })}>Accept all</button>
                <button className="btn btn-ghost" onClick={() => save({ analytics: false, ads: false })}>Reject all</button>
                <button className="btn btn-ghost" onClick={() => setCustom(true)}>Choose</button>
              </div>
            </>
          ) : (
            <>
              <p>Strictly necessary storage is always on. Choose the rest:</p>
              {ga4MeasurementId && (
                <label>
                  <input type="checkbox" checked={draft.analytics} onChange={(e) => setDraft({ ...draft, analytics: e.target.checked })} />
                  <span>Analytics: anonymous usage measurement (Google Analytics)</span>
                </label>
              )}
              {googleAdsId && (
                <label>
                  <input type="checkbox" checked={draft.ads} onChange={(e) => setDraft({ ...draft, ads: e.target.checked })} />
                  <span>Advertising: measure whether our ads lead to enquiries (Google Ads)</span>
                </label>
              )}
              <div className="consent-actions">
                <button className="btn btn-light" onClick={() => save(draft)}>Save choices</button>
                <button className="btn btn-ghost" onClick={() => setShow(false)}>Cancel</button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export function ConsentSettingsButton() {
  return (
    <button type="button" onClick={openConsentSettings} style={{ background: "none", border: 0, padding: 0, color: "inherit", font: "inherit", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "0.22em" }}>
      Cookie settings
    </button>
  );
}
