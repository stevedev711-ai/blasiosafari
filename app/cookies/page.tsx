import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ConsentSettingsButton } from "@/components/ConsentBanner";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Cookie policy",
  description: "Which cookies and similar storage this website uses, and how to change your choices.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  const { ga4MeasurementId, googleAdsId } = siteConfig.analytics;
  return (
    <section className="page-intro" style={{ paddingBottom: "var(--section)" }}>
      <div className="container-narrow prose">
        <Breadcrumbs items={[{ href: "/cookies", label: "Cookies" }]} />
        <h1 className="h1" style={{ marginBottom: 16 }}>Cookie policy</h1>
        <p className="small muted">Last updated {siteConfig.policiesUpdatedOn}. This policy must be reviewed before launch.</p>
        <h2>Strictly necessary</h2>
        <p>
          Your browser stores your cookie choices, an unsent consultation draft for the current session, and the campaign parameters of
          the link you arrived from, so they can be included with your enquiry. These are not shared with third parties.
        </p>
        <h2>Analytics</h2>
        <p>
          {ga4MeasurementId
            ? "With your consent, we use Google Analytics to understand how the site is used. Your enquiry details are never sent to it."
            : "We do not currently use analytics cookies."}
        </p>
        <h2>Advertising</h2>
        <p>
          {googleAdsId
            ? "With your consent, we use Google Ads conversion measurement to see whether our adverts lead to enquiries. No personal details from the form are shared."
            : "We do not currently use advertising cookies."}
        </p>
        <h2>Changing your choices</h2>
        <p>
          <ConsentSettingsButton />
        </p>
      </div>
    </section>
  );
}
