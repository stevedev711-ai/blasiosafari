import type { Metadata } from "next";
import Image from "next/image";
import { getImage } from "@/content/images";
import { ConsultationForm } from "@/components/ConsultationForm";
import { Process } from "@/components/Process";

/** Paid-search landing page. Kept out of search indexes and the sitemap to avoid duplicating the main pages. */
export const metadata: Metadata = {
  title: "Private safaris in Kenya, planned around your party",
  description:
    "Private, tailor-made safaris in Kenya. Your own guide and vehicle, exclusive-use houses or small camps, and flights planned leg by leg. Request a private consultation.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/private-safari-kenya" },
};

const options = [
  { title: "Your own guide and vehicle", body: "Leave when you like, stay with a sighting as long as you like, with a guide matched to your interests." },
  { title: "Where you stay", body: "Small camps, lodges or an exclusive-use house in the Mara conservancies or Laikipia, chosen around your party." },
  { title: "How you travel", body: "Private charter, scheduled bush flights or road, assessed for each leg of the route." },
  { title: "Where you go", body: "The Maasai Mara, Lewa & Laikipia, the Chyulu Hills, or a combination that suits your dates." },
];

export default function LandingPage() {
  const img = getImage("maraVehicle");
  return (
    <>
      <section className="page-hero" data-page-hero style={{ minHeight: "clamp(520px, 78vh, 760px)" }}>
        <Image src={img.src!} alt={img.alt} fill priority sizes="100vw" style={{ objectFit: "cover", objectPosition: img.position }} />
        <div className="container">
          <p className="eyebrow" style={{ color: "var(--champagne-soft)" }}>Private safaris · Kenya</p>
          <h1 className="h1" style={{ maxWidth: "13em" }}>A private safari in Kenya, planned around your party.</h1>
          <p className="lede">Your own guide and vehicle, places to stay chosen for you, and flights planned leg by leg. Quoted after a short consultation.</p>
          <div style={{ marginTop: 32 }}>
            <a className="btn btn-light" href="#consultation">Request a Private Consultation</a>
          </div>
        </div>
        {img.credit && (
          <p className="hero-caption">
            {img.location} · Photo: {img.credit.author}, <a href={img.credit.licenseUrl} rel="license noopener" target="_blank">{img.credit.license}</a>
          </p>
        )}
      </section>

      <section className="section-tight" aria-labelledby="options-title">
        <div className="container">
          <h2 id="options-title" className="h3" style={{ marginBottom: 32 }}>What we plan around you</h2>
          <div className="landing-options">
            {options.map((o) => (
              <div className="landing-option" key={o.title}>
                <h3>{o.title}</h3>
                <p>{o.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight bg-linen-2" aria-labelledby="lp-process-title">
        <div className="container">
          <h2 id="lp-process-title" className="h3" style={{ marginBottom: 8 }}>How it works</h2>
          <p className="muted" style={{ marginTop: 0, marginBottom: 32 }}>No packages and no published prices. Each journey is quoted after we&apos;ve talked.</p>
          <Process light />
        </div>
      </section>

      <section className="section" id="consultation" aria-label="Consultation form">
        <div className="container consult-shell">
          <aside className="consult-aside">
            <p className="eyebrow">Private consultation</p>
            <h2 className="h2" style={{ marginBottom: 16 }}>Start with a few details.</h2>
            <p>Answer what you can. &ldquo;I&apos;d like your advice&rdquo; is always a good answer.</p>
            <p className="small muted">No obligation. Nothing is booked until you agree to a proposal.</p>
          </aside>
          <ConsultationForm variant="landing" context={{ from: "/private-safari-kenya", context: "Paid search landing page" }} />
        </div>
      </section>
    </>
  );
}
