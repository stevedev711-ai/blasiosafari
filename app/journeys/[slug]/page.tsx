import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getJourney, journeys } from "@/content/journeys";
import { destinations } from "@/content/destinations";
import { PageHero } from "@/components/PageHero";
import { Picture } from "@/components/Picture";
import { ConsultationBand } from "@/components/ConsultationBand";
import { JsonLd } from "@/components/JsonLd";
import { consultHref } from "@/lib/consult-link";
import { absoluteUrl } from "@/site.config";
import { getImage } from "@/content/images";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return journeys.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const j = getJourney((await params).slug);
  if (!j) return {};
  return {
    title: `${j.title} | ${j.length} sample journey`,
    description: `${j.summary} A sample private safari in Kenya with a route overview, day-by-day outline and what could change.`,
    alternates: { canonical: `/journeys/${j.slug}` },
    openGraph: { url: `/journeys/${j.slug}`, images: [getImage(j.image).src!] },
  };
}

export default async function JourneyPage({ params }: Params) {
  const j = getJourney((await params).slug);
  if (!j) notFound();
  const path = `/journeys/${j.slug}`;
  const related = destinations.filter((d) => d.relatedJourneys.includes(j.slug));
  const other = journeys.find((x) => x.slug !== j.slug)!;

  return (
    <>
      <PageHero
        image={j.image}
        eyebrow={`Sample journey · ${j.length}`}
        title={j.title}
        lede={j.summary}
        crumbs={[
          { href: "/journeys", label: "Journeys" },
          { href: path, label: j.title },
        ]}
      >
        <div style={{ marginTop: 32 }}>
          <Link className="btn btn-light" href={consultHref({ journey: j.slug, from: path })}>
            Request a Private Consultation
          </Link>
        </div>
      </PageHero>

      <section className="section-tight">
        <div className="container">
          <dl className="facts">
            <div className="fact"><dt>Length</dt><dd>{j.length} · {j.nights} nights</dd></div>
            <div className="fact"><dt>Regions</dt><dd>{j.nightsByRegion.filter((n) => n.region !== "Nairobi").length} bases after Nairobi</dd></div>
            <div className="fact"><dt>Season</dt><dd className="fact-long">{j.seasonNote}</dd></div>
            <div className="fact"><dt>Status</dt><dd>Sample, fully adjustable</dd></div>
          </dl>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }} aria-labelledby="overview-title">
        <div className="container two-col">
          <div>
            <p className="eyebrow">Route overview</p>
            <h2 id="overview-title" className="h2" style={{ marginBottom: 24 }}>The shape of the journey</h2>
            <ol className="route-line" aria-label="Route" style={{ fontSize: "1rem" }}>
              {j.route.map((r, k) => (
                <li key={r + k}>{r}</li>
              ))}
            </ol>
            <div className="prose">
              {j.intro.map((p) => (
                <p key={p.slice(0, 20)}>{p}</p>
              ))}
              <p>{j.routeNote}</p>
            </div>
            <h3 className="h4" style={{ margin: "32px 0 12px" }}>Who this suits</h3>
            <ul className="check-list">
              {j.bestFor.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
          <div>
            <Picture image={j.detailImage} ratio="portrait" sizes="(min-width: 900px) 44vw, 100vw" caption />
          </div>
        </div>
      </section>

      <section className="section bg-linen-2" aria-labelledby="days-title">
        <div className="container">
          <div className="section-head split">
            <div>
              <p className="eyebrow">Day by day</p>
              <h2 id="days-title" className="h2">A sample progression</h2>
            </div>
            <p className="lede">This is how the days might unfold. Your version will reflect your dates, your party and how you like to travel.</p>
          </div>
          <ol className="day-list">
            {j.days.map((d) => (
              <li className="day" key={d.days}>
                <div className="day-label">
                  {d.days}
                  <span>{d.region}</span>
                </div>
                <div>
                  <h3>{d.title}</h3>
                  <p>{d.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="nights-title">
        <div className="container">
          <p className="eyebrow">Where you would spend your nights</p>
          <h2 id="nights-title" className="h2" style={{ marginBottom: 40 }}>Nights by region</h2>
          <div className="table-scroll">
            <table className="nights-table">
              <caption>Accommodation is chosen with you during planning and depends on availability. Named properties are suggested in your proposal, not here.</caption>
              <thead>
                <tr>
                  <th scope="col">Region</th>
                  <th scope="col">Nights</th>
                  <th scope="col">Type of stay</th>
                  <th scope="col">Why here</th>
                </tr>
              </thead>
              <tbody>
                {j.nightsByRegion.map((n) => (
                  <tr key={n.region}>
                    <th scope="row">{n.region}</th>
                    <td className="n">{n.nights}</td>
                    <td className="stay">{n.stay}</td>
                    <td className="why">{n.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {related.length > 0 && (
            <p style={{ marginTop: 32 }}>
              Read more about{" "}
              {related.map((d, i) => (
                <span key={d.slug}>
                  {i > 0 && " and "}
                  <Link href={`/destinations/${d.slug}`}>{d.name}</Link>
                </span>
              ))}
              .
            </p>
          )}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }} aria-labelledby="change-title">
        <div className="container">
          <p className="eyebrow">Your version</p>
          <h2 id="change-title" className="h2" style={{ marginBottom: 40 }}>What could change during planning</h2>
          <div className="change-grid">
            {j.couldChange.map((c) => (
              <div className="change" key={c.title}>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
            ))}
          </div>
          <div className="conditions" style={{ marginTop: 48 }}>
            <p className="eyebrow" style={{ margin: 0 }}>Please note</p>
            <p>{j.conditions}</p>
          </div>
          <p style={{ marginTop: 40 }}>
            Also see: <Link href={`/journeys/${other.slug}`}>{other.title} ({other.length})</Link>
          </p>
        </div>
      </section>

      <ConsultationBand
        title={`Shape ${j.title} around your party.`}
        body="Tell us who is travelling and when. We'll suggest how this route would change for you, or propose a different one."
        context={{ journey: j.slug, from: path }}
        contextLabel={`${j.title} (${j.length})`}
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TouristTrip",
          name: j.title,
          description: j.summary,
          url: absoluteUrl(path),
          touristType: j.bestFor,
          itinerary: {
            "@type": "ItemList",
            itemListElement: j.days.map((d, i) => ({ "@type": "ListItem", position: i + 1, name: `${d.days}: ${d.title}` })),
          },
        }}
      />
    </>
  );
}
