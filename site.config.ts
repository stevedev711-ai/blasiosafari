/**
 * BLASIO LUXURY SAFARIS: LAUNCH CONFIGURATION
 * ---------------------------------------------------------------------------
 * This is the one file to edit before launch. Anything set to `null` is a
 * launch detail that has not been confirmed yet. The site hides features that
 * depend on a missing value (WhatsApp button, scheduling link, phone number,
 * analytics) instead of showing a placeholder to visitors.
 *
 * Secrets (API keys, webhook secrets) never go in this file. They live in
 * environment variables on the server. See `.env.example`.
 */

export type SiteMode = "preview" | "live";

const envMode = process.env.NEXT_PUBLIC_SITE_MODE;

export const siteConfig = {
  /**
   * "preview": the form validates but nothing is sent, pages are kept out
   * of search indexes, and a preview banner is shown.
   * "live": submissions are delivered and the site can be indexed.
   * Set it with NEXT_PUBLIC_SITE_MODE in the hosting environment.
   */
  mode: (envMode === "live" ? "live" : "preview") as SiteMode,

  /** Public URL of the deployed site, with no trailing slash. TODO: confirm the domain. */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://www.example.com",

  brand: {
    name: "Blasio Luxury Safaris",
    shortName: "Blasio",
    /** Text wordmark. Set `logoSrc` to a file in /public to use a supplied logo instead. */
    wordmark: { primary: "BLASIO", secondary: "Luxury Safaris · Kenya" },
    logoSrc: null as string | null,
    /** Used in the footer and structured data. Keep to what is true and public. */
    baseLocation: "Kenya",
    tagline: "Private, tailor-made safaris in Kenya.",
  },

  contact: {
    /** Public enquiries address shown on the site. TODO: provide a real inbox. */
    publicEmail: null as string | null,
    /** International format, e.g. "+254 700 000 000". Shown only when set. */
    phone: null as string | null,
    /**
     * WhatsApp click-to-chat link, e.g. "https://wa.me/2547XXXXXXXX".
     * The WhatsApp option appears only once this is set.
     */
    whatsappUrl: null as string | null,
    /**
     * Scheduling page (Cal.com, Calendly or similar). The "Schedule a call"
     * option appears only once this is set.
     */
    schedulingUrl: null as string | null,
    /** Expected reply time stated on the confirmation screen and in the email. */
    responseTime: "within two working days",
    /** Office hours statement, shown only when set. Example: "Monday to Friday, 08:00–18:00 East Africa Time". */
    hours: null as string | null,
  },

  consultation: {
    /** Approximate length of the planning call, as described on the site. */
    callLength: "around 45 minutes",
    /** When the guest can expect a proposal after the call. */
    proposalTurnaround: "usually within a week of our call",
    /** Confirmation email sent to the guest after a live submission. */
    autoReply: {
      enabled: true,
      fromName: "Blasio Luxury Safaris",
      /** Must be a verified sender with your email provider. TODO */
      fromEmail: null as string | null,
      subject: "We have received your enquiry | Blasio Luxury Safaris",
    },
    /**
     * Follow-up automation (reminders, CRM sequences). Off by default. When
     * enabled, `followUp: true` is included in the webhook payload so your CRM
     * or automation tool can start its own sequence.
     */
    followUp: { enabled: false },
  },

  social: {
    instagram: null as string | null,
    linkedin: null as string | null,
  },

  /** Optional hero footage. Leave `src` null to use the still image everywhere. */
  heroVideo: {
    src: null as string | null, // e.g. "/media/hero-loop.mp4" (H.264, muted, ~10–20 s, < 6 MB)
    webmSrc: null as string | null,
  },

  /**
   * Analytics and advertising. Nothing loads until an ID is set AND the
   * visitor has accepted the matching cookie category.
   */
  analytics: {
    ga4MeasurementId: null as string | null, // "G-XXXXXXX"
    googleAdsId: null as string | null, // "AW-XXXXXXXXX"
    googleAdsConversionLabel: null as string | null, // conversion label for successful submissions
  },

  /**
   * Properties named in the business roadmap. They stay out of public pages
   * until `approvedForPublicUse` is true and the wording and images are cleared.
   */
  propertyReferences: {
    approvedForPublicUse: false,
    names: ["Angama Mara", "Sirikoi", "Segera"],
  },

  /** Publication date shown on journal articles. */
  journalPublishedOn: "2026-11-23",

  /** Last updated date for policy pages. */
  policiesUpdatedOn: "2026-11-23",
};

export const isPreview = siteConfig.mode === "preview";
export const absoluteUrl = (path = "/") => `${siteConfig.siteUrl}${path === "/" ? "" : path}`;
