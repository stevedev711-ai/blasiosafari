import Link from "next/link";
import type { Metadata } from "next";
import { destinations } from "@/content/destinations";
import { PageHero } from "@/components/PageHero";
import { Picture } from "@/components/Picture";
import { ConsultationBand } from "@/components/ConsultationBand";

export const metadata: Metadata = {
  title: "Destinations in Kenya",
  description:
    "The Maasai Mara, Lewa & Laikipia and the Chyulu Hills: what distinguishes each region, how it fits into a wider Kenya safari, and what to consider when choosing.",
  alternates: { canonical: "/destinations" },
  openGraph: { url: "/destinations", images: ["/images/lewa-landscape.jpg"] },
};

export default function DestinationsPage() {
  return (
    <>
      <PageHero
        image="lewaLandscape"
        eyebrow="Destinations"
        title="Three regions, three different trips"
        lede="Where you go in Kenya shapes the wildlife you see, the pace of each day and how you travel. These are three places where many of our journeys begin."
        crumbs={[{ href: "/destinations", label: "Destinations" }]}
      />
      <section className="section">
        <div className="container">
          {destinations.map((d, i) => (
            <article key={d.slug} className={`journey-feature${i % 2 ? " reverse" : ""}`}>
              <div className="journey-media">
                <Link href={`/destinations/${d.slug}`} aria-label={`${d.name}: read more`}>
                  <Picture image={d.image} ratio="landscape" sizes="(min-width: 960px) 56vw, 100vw" />
                </Link>
              </div>
              <div>
                <span className="tag">Typical stay {d.typicalStay}</span>
                <h2 className="h2" style={{ margin: "12px 0 16px" }}>{d.name}</h2>
                <p style={{ color: "var(--ink-soft)" }}>{d.reason}</p>
                <Link className="text-link" href={`/destinations/${d.slug}`}>
                  Explore {d.shortName} <span className="arrow" aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section-tight bg-linen-2">
        <div className="container-narrow">
          <h2 className="h3" style={{ marginBottom: 16 }}>Combining regions</h2>
          <div className="prose">
            <p>
              Most first visits combine two regions. The Mara is often paired with Lewa & Laikipia, or with the Chyulu Hills for a contrast
              of landscape and pace. The distance between regions, and whether to fly a charter, take scheduled flights or drive, affects
              how many places fit comfortably into your time.
            </p>
            <p>
              <Link href="/journal/when-a-private-charter-makes-sense">When a private charter makes sense on a multi-stop trip</Link>
            </p>
          </div>
        </div>
      </section>
      <ConsultationBand context={{ from: "/destinations" }} />
    </>
  );
}
