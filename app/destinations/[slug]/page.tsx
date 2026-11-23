import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { destinations, getDestination } from "@/content/destinations";
import { journeys } from "@/content/journeys";
import { getImage } from "@/content/images";
import { PageHero } from "@/components/PageHero";
import { Picture } from "@/components/Picture";
import { ConsultationBand } from "@/components/ConsultationBand";
import { consultHref } from "@/lib/consult-link";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const d = getDestination((await params).slug);
  if (!d) return {};
  return {
    title: `${d.name}: planning a private safari`,
    description: `${d.reason} How ${d.shortName} fits into a wider Kenya trip and what to consider when choosing.`,
    alternates: { canonical: `/destinations/${d.slug}` },
    openGraph: { url: `/destinations/${d.slug}`, images: [getImage(d.image).src!] },
  };
}

export default async function DestinationPage({ params }: Params) {
  const d = getDestination((await params).slug);
  if (!d) notFound();
  const path = `/destinations/${d.slug}`;
  const related = journeys.filter((j) => d.relatedJourneys.includes(j.slug));
  const others = destinations.filter((x) => x.slug !== d.slug);

  return (
    <>
      <PageHero
        image={d.image}
        eyebrow="Destination"
        title={d.name}
        lede={d.reason}
        crumbs={[
          { href: "/destinations", label: "Destinations" },
          { href: path, label: d.shortName },
        ]}
      />

      <section className="section">
        <div className="container two-col">
          <div className="prose">
            <p className="eyebrow">Overview</p>
            {d.intro.map((p) => (
              <p key={p.slice(0, 24)} style={{ fontSize: "1.15rem" }}>{p}</p>
            ))}
            <dl className="review-list" style={{ background: "transparent", padding: 0, marginTop: 32 }}>
              <dt>Typical stay</dt>
              <dd>{d.typicalStay}</dd>
              <dt>Getting there</dt>
              <dd>{d.gettingThere}</dd>
            </dl>
          </div>
          <Picture image={d.detailImage} ratio="portrait" sizes="(min-width: 900px) 44vw, 100vw" caption />
        </div>
      </section>

      <section className="section bg-linen-2" aria-labelledby="dist-title">
        <div className="container">
          <p className="eyebrow">What sets it apart</p>
          <h2 id="dist-title" className="h2" style={{ marginBottom: 40 }}>Why {d.shortName}</h2>
          <div className="change-grid">
            {d.distinguishes.map((x) => (
              <div className="change" style={{ background: "var(--linen)" }} key={x.title}>
                <h3>{x.title}</h3>
                <p>{x.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="fit-title">
        <div className="container two-col">
          <div>
            <p className="eyebrow">In a wider trip</p>
            <h2 id="fit-title" className="h3" style={{ marginBottom: 24 }}>How it could fit</h2>
            <ul className="check-list">
              {d.fitsInTrip.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">Before you choose</p>
            <h2 className="h3" style={{ marginBottom: 24 }}>What to consider</h2>
            <ul className="check-list">
              {d.consider.map((c) => (
                <li key={c.title}>
                  <strong>{c.title}.</strong> {c.body}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-tight bg-linen-2" aria-labelledby="rel-title">
          <div className="container">
            <h2 id="rel-title" className="h3" style={{ marginBottom: 32 }}>Sample journeys that include {d.shortName}</h2>
            <div className="article-list">
              {related.map((j) => (
                <article className="article-card" key={j.slug}>
                  <Link href={`/journeys/${j.slug}`} aria-label={j.title}>
                    <Picture image={j.image} ratio="landscape" sizes="(min-width: 900px) 45vw, 100vw" credit={false} />
                  </Link>
                  <span className="tag" style={{ justifySelf: "start" }}>{j.length}</span>
                  <h3><Link href={`/journeys/${j.slug}`}>{j.title}</Link></h3>
                  <p>{j.summary}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-tight">
        <div className="container" style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ margin: 0 }}>
            Also consider:{" "}
            {others.map((o, i) => (
              <span key={o.slug}>
                {i > 0 && " · "}
                <Link href={`/destinations/${o.slug}`}>{o.name}</Link>
              </span>
            ))}
          </p>
          <Link className="text-link" href={consultHref({ destination: d.slug, from: path })}>
            Ask about {d.shortName} <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <ConsultationBand
        title={`Thinking about ${d.shortName}?`}
        body="Tell us when you'd like to travel and who's coming. We'll suggest how it could fit into a wider journey."
        context={{ destination: d.slug, from: path }}
        contextLabel={d.name}
      />
    </>
  );
}
