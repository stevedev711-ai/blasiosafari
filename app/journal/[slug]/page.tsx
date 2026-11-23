import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { articles, getArticle } from "@/content/journal";
import { getImage } from "@/content/images";
import { Picture } from "@/components/Picture";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ConsultationBand } from "@/components/ConsultationBand";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl, siteConfig } from "@/site.config";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const a = getArticle((await params).slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.description,
    alternates: { canonical: `/journal/${a.slug}` },
    openGraph: { type: "article", url: `/journal/${a.slug}`, images: [getImage(a.image).src!], publishedTime: siteConfig.journalPublishedOn },
  };
}

export default async function ArticlePage({ params }: Params) {
  const a = getArticle((await params).slug);
  if (!a) notFound();
  const path = `/journal/${a.slug}`;
  const date = new Date(siteConfig.journalPublishedOn + "T12:00:00Z");
  return (
    <>
      <article>
        <header className="page-intro">
          <div className="container-narrow">
            <Breadcrumbs items={[{ href: "/journal", label: "Journal" }, { href: path, label: "Article" }]} />
            <p className="eyebrow">Journal · {a.readingTime}</p>
            <h1 className="h1">{a.title}</h1>
            <p className="lede" style={{ marginTop: 20 }}>{a.description}</p>
            <p className="small muted">
              <time dateTime={siteConfig.journalPublishedOn}>{date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}</time>
            </p>
          </div>
        </header>
        <div className="container" style={{ marginBottom: "clamp(40px, 6vw, 80px)" }}>
          <Picture image={a.image} ratio="wide" sizes="(min-width: 1320px) 1224px, 100vw" priority caption />
        </div>
        <div className="container-narrow prose" style={{ paddingBottom: "var(--section)" }}>
          {a.blocks.map((b, i) => {
            if (b.type === "p") return <p key={i}>{b.text}</p>;
            if (b.type === "h2") return <h2 key={i}>{b.text}</h2>;
            if (b.type === "note") return <p className="note" key={i}>{b.text}</p>;
            return (
              <ul key={i}>
                {b.items.map((it, k) => (
                  <li key={k}>
                    {it.term && <strong>{it.term} </strong>}
                    {it.text}
                  </li>
                ))}
              </ul>
            );
          })}
          <hr className="rule" style={{ margin: "48px 0 24px" }} />
          <p className="small">
            Related:{" "}
            {a.related.map((r, i) => (
              <span key={r.href}>
                {i > 0 && " · "}
                <Link href={r.href}>{r.label}</Link>
              </span>
            ))}
          </p>
        </div>
      </article>
      <ConsultationBand
        title="Have a question about your own route?"
        body="Tell us where you're thinking of going and who's travelling. We'll talk it through with you."
        context={{ context: a.consultationContext, from: path }}
        contextLabel={a.consultationContext.toLowerCase()}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.title,
          description: a.description,
          image: absoluteUrl(getImage(a.image).src!),
          datePublished: siteConfig.journalPublishedOn,
          mainEntityOfPage: absoluteUrl(path),
          publisher: { "@type": "Organization", name: siteConfig.brand.name, url: absoluteUrl("/") },
        }}
      />
    </>
  );
}
