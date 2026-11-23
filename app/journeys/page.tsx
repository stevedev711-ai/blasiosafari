import Link from "next/link";
import type { Metadata } from "next";
import { journeys } from "@/content/journeys";
import { PageHero } from "@/components/PageHero";
import { Picture } from "@/components/Picture";
import { ConsultationBand } from "@/components/ConsultationBand";
import { consultHref } from "@/lib/consult-link";

export const metadata: Metadata = {
  title: "Sample journeys",
  description:
    "Two sample private safaris in Kenya, The Private Migration Circuit and The Rhino & Big Cat Journey, plus how we plan for families, couples and photographers.",
  alternates: { canonical: "/journeys" },
  openGraph: { url: "/journeys", images: ["/images/mara-balloon.jpg"] },
};

const pathways = [
  {
    id: "family",
    interest: "family" as const,
    title: "Families",
    body: "Including several generations travelling together.",
    points: ["A private house, so the day runs on your timings", "Later starts and shorter drives", "Guides who are good with children", "Activities chosen with age limits in mind"],
    cta: "Plan a family safari",
  },
  {
    id: "couple",
    interest: "couple" as const,
    title: "Couples",
    body: "Honeymoons, anniversaries and time away together.",
    points: ["Fewer lodge changes", "Time to yourselves between drives", "Stays chosen for privacy and setting", "Celebrations handled quietly"],
    cta: "Plan a safari for two",
  },
  {
    id: "photography",
    interest: "photography" as const,
    title: "Photographers",
    body: "Solo photographers and photographic parties.",
    points: ["A dedicated vehicle with room for equipment", "Several mornings in the same area", "A guide who understands light and position", "Flights planned around kit weight"],
    cta: "Plan a photographic safari",
  },
];

export default function JourneysPage() {
  return (
    <>
      <PageHero
        image="maraBalloon"
        eyebrow="Journeys"
        title="Sample journeys, to begin the conversation"
        lede="Each journey we plan is designed after a consultation. These two routes show how we think about pace, regions and the way you travel between them."
        crumbs={[{ href: "/journeys", label: "Journeys" }]}
      />

      <section className="section" aria-labelledby="sample-title">
        <div className="container">
          <h2 id="sample-title" className="visually-hidden">Sample journeys</h2>
          {journeys.map((j, i) => (
            <article key={j.slug} className={`journey-feature${i % 2 ? " reverse" : ""}`}>
              <div className="journey-media">
                <Link href={`/journeys/${j.slug}`} aria-label={`${j.title}: view the sample journey`}>
                  <Picture image={j.image} ratio="landscape" sizes="(min-width: 960px) 56vw, 100vw" />
                </Link>
              </div>
              <div>
                <span className="tag">Sample journey · {j.length}</span>
                <h3>{j.title}</h3>
                <p>{j.summary}</p>
                <ul className="route-line" aria-label="Route">
                  {j.route.map((r, k) => (
                    <li key={r + k}>{r}</li>
                  ))}
                </ul>
                <p className="small muted">Best for: {j.bestFor.join("; ").toLowerCase()}.</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center", marginTop: 24 }}>
                  <Link className="text-link" href={`/journeys/${j.slug}`}>View day by day <span className="arrow" aria-hidden="true">→</span></Link>
                  <Link className="text-link" href={consultHref({ journey: j.slug, from: "/journeys" })}>Enquire about this route <span className="arrow" aria-hidden="true">→</span></Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section bg-linen-2" id="pathways" aria-labelledby="pathways-title">
        <div className="container">
          <div className="section-head split">
            <div>
              <p className="eyebrow">Planning for your party</p>
              <h2 id="pathways-title" className="h2">Start from who is travelling</h2>
            </div>
            <p className="lede">Choose the closest fit and we&apos;ll carry it into your enquiry, so the first conversation starts in the right place.</p>
          </div>
          <div className="pathways">
            {pathways.map((p) => (
              <div className="pathway" key={p.id} id={p.id}>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
                <ul>
                  {p.points.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                <Link className="text-link" href={consultHref({ interest: p.interest, from: "/journeys" })}>
                  {p.cta} <span className="arrow" aria-hidden="true">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ConsultationBand
        title="Not quite either route?"
        body="Most journeys we plan look different from both. Tell us what you have in mind and we'll start there."
        context={{ from: "/journeys" }}
      />
    </>
  );
}
