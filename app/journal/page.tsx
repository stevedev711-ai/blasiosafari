import Link from "next/link";
import type { Metadata } from "next";
import { articles } from "@/content/journal";
import { Picture } from "@/components/Picture";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ConsultationBand } from "@/components/ConsultationBand";

export const metadata: Metadata = {
  title: "Journal: planning notes for a private safari in Kenya",
  description: "Practical notes on planning a private safari in Kenya: exclusive-use houses, private charters and the decisions that shape a route.",
  alternates: { canonical: "/journal" },
  openGraph: { url: "/journal" },
};

export default function JournalPage() {
  return (
    <>
      <section className="page-intro">
        <div className="container">
          <Breadcrumbs items={[{ href: "/journal", label: "Journal" }]} />
          <p className="eyebrow">Journal</p>
          <h1 className="h1" style={{ maxWidth: "14em" }}>Planning notes</h1>
          <p className="lede" style={{ marginTop: 20 }}>
            Practical writing on the decisions that shape a private safari in Kenya: where to stay, how to travel, and what to ask.
          </p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container article-list">
          {articles.map((a) => (
            <article className="article-card" key={a.slug}>
              <Link href={`/journal/${a.slug}`} aria-label={a.title}>
                <Picture image={a.image} ratio="landscape" sizes="(min-width: 900px) 45vw, 100vw" credit={false} />
              </Link>
              <p className="meta-row" style={{ margin: 0 }}>{a.readingTime}</p>
              <h2><Link href={`/journal/${a.slug}`}>{a.title}</Link></h2>
              <p>{a.description}</p>
              <Link className="text-link" href={`/journal/${a.slug}`} style={{ justifySelf: "start" }}>
                Read <span className="arrow" aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
      <ConsultationBand context={{ from: "/journal" }} />
    </>
  );
}
