import Link from "next/link";
import { consultHref, type ConsultContext } from "@/lib/consult-link";
import { siteConfig } from "@/site.config";

type Props = {
  title?: string;
  body?: string;
  context?: ConsultContext;
  contextLabel?: string; // human-readable, shown to the guest
};

/** Closing invitation. Carries the page's context into the consultation form. */
export function ConsultationBand({
  title = "Tell us how you'd like to spend your time in Kenya.",
  body = "Share a few details and we'll arrange a conversation. There is no obligation, and nothing is booked until you have a proposal you're happy with.",
  context = {},
  contextLabel,
}: Props) {
  return (
    <section className="section on-dark cta-band" aria-labelledby="cta-title">
      <div className="container">
        <div>
          <p className="eyebrow">Private consultation</p>
          <h2 id="cta-title" className="h2">{title}</h2>
          <p className="lede" style={{ marginTop: 20 }}>{body}</p>
          {contextLabel && (
            <p className="context-note">
              We&apos;ll include <strong style={{ color: "var(--linen)" }}>{contextLabel}</strong> with your enquiry so you don&apos;t need to repeat it.
            </p>
          )}
        </div>
        <div className="cta-actions">
          <Link className="btn btn-light" href={consultHref(context)}>
            Request a Private Consultation
          </Link>
          {siteConfig.contact.schedulingUrl && (
            <a className="text-link" href={siteConfig.contact.schedulingUrl} target="_blank" rel="noopener" style={{ color: "var(--linen)" }}>
              Or schedule a call <span className="arrow" aria-hidden="true">→</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
