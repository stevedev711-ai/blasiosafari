import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getImage } from "@/content/images";
import { destinations } from "@/content/destinations";
import { journeys } from "@/content/journeys";
import { Picture } from "@/components/Picture";
import { HeroVideo } from "@/components/HeroVideo";
import { Process } from "@/components/Process";
import { ConsultationBand } from "@/components/ConsultationBand";
import { consultHref } from "@/lib/consult-link";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: { absolute: `${siteConfig.brand.name} | Private safaris in Kenya, designed around you` },
  description:
    "Private, tailor-made safaris in Kenya. We design each journey around your party, your pace, where you stay and how you travel between the Maasai Mara, Lewa & Laikipia and the Chyulu Hills.",
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

const planItems = [
  {
    title: "The pace of the trip",
    body: "How many places you visit, how long you stay in each, and how early you start. Fewer moves usually mean better days.",
    example: "A couple might prefer two stays in nine days, with an afternoon kept free at each.",
  },
  {
    title: "Where you stay",
    body: "Small tented camps, lodges, or an exclusive-use house with its own staff, guides and vehicles. We explain why we suggest each one and what it changes.",
    example: "A family might take a private house with later starts and meals whenever suits the children.",
  },
  {
    title: "How you travel between regions",
    body: "Private charters, scheduled bush flights and road transfers each have their place. We assess them leg by leg, against your route, timings, luggage and priorities. We don't own aircraft or vehicles, so we recommend whatever suits the journey.",
    example: "A direct charter from Lewa to the Mara can save most of a day compared with a scheduled connection through Nairobi.",
  },
  {
    title: "The guiding you want",
    body: "A private vehicle so your party decides when to go and how long to stay, and a guide chosen for your interests, from children to birds to photography. Particular guides depend on availability.",
    example: "A photographer might want a dedicated vehicle and several mornings in the same area.",
  },
];

export default function HomePage() {
  const hero = getImage("maraDawn");
  const video = siteConfig.heroVideo;
  return (
    <>
      {/* 1. Hero */}
      <section className="hero" data-page-hero aria-labelledby="hero-title">
        <div className="hero-media">
          <Image src={hero.src!} alt={hero.alt} fill priority sizes="100vw" style={{ objectPosition: hero.position }} />
        </div>
        {video.src && <HeroVideo src={video.src} webmSrc={video.webmSrc} poster={hero.src!} />}
        <div className="container hero-content">
          <p className="eyebrow" style={{ color: "var(--champagne-soft)" }}>Private safaris · Kenya</p>
          <h1 id="hero-title" className="display">Private safaris in Kenya, designed around you.</h1>
          <p className="lede">
            Tell us how you want to spend your time in Kenya. We&apos;ll design a journey around the places you want to see, the people
            you&apos;re travelling with, and the pace that suits you.
          </p>
          <div className="hero-actions">
            <Link href={consultHref({ from: "/" })} className="btn btn-light">
              Request a Private Consultation
            </Link>
            <Link href="/journeys" className="text-link" style={{ color: "var(--linen)" }}>
              See sample journeys <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        {hero.credit && (
          <p className="hero-caption">
            {hero.location} at first light · Photo: {hero.credit.author},{" "}
            <a href={hero.credit.licenseUrl} rel="license noopener" target="_blank">{hero.credit.license}</a>
          </p>
        )}
      </section>

      {/* 2. What we plan around you */}
      <section className="section" aria-labelledby="plan-title">
        <div className="container">
          <div className="plan-grid">
            <div className="sticky-media">
              <p className="eyebrow">Tailor-made, from the first conversation</p>
              <h2 id="plan-title" className="h2" style={{ marginBottom: 24 }}>What we plan around you</h2>
              <p className="lede" style={{ marginBottom: 40 }}>
                No two parties want the same trip. Before we suggest a single camp, we ask how you like to spend your days. Then we build
                the route around four decisions.
              </p>
              <Picture image="maraVehicle" ratio="landscape" sizes="(min-width: 960px) 42vw, 100vw" caption="A private vehicle in the Maasai Mara" />
            </div>
            <ol className="plan-list" style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {planItems.map((p, i) => (
                <li key={p.title} className="plan-item">
                  <span className="num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{p.title}</h3>
                    <p>{p.body}</p>
                    <p className="plan-example">{p.example}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="examples-strip" aria-label="Planning for different travellers">
            <div className="example">
              <p className="eyebrow">Families</p>
              <h3>A private house and later starts</h3>
              <p>One base for longer, a guide who is good with children, and meals and naps on your schedule.</p>
              <Link className="text-link" href={consultHref({ interest: "family", from: "/" })}>Plan a family safari <span className="arrow" aria-hidden="true">→</span></Link>
            </div>
            <div className="example">
              <p className="eyebrow">Couples</p>
              <h3>Fewer lodge changes, more time alone</h3>
              <p>Two well-chosen stays rather than four, with time to yourselves between drives.</p>
              <Link className="text-link" href={consultHref({ interest: "couple", from: "/" })}>Plan a safari for two <span className="arrow" aria-hidden="true">→</span></Link>
            </div>
            <div className="example">
              <p className="eyebrow">Photographers</p>
              <h3>A dedicated vehicle and repeat mornings</h3>
              <p>Several mornings in the same area, early starts, and a guide who understands light and positioning.</p>
              <Link className="text-link" href={consultHref({ interest: "photography", from: "/" })}>Plan a photographic safari <span className="arrow" aria-hidden="true">→</span></Link>
            </div>
          </div>
        </div>
      </section>

      <div className="full-bleed">
        <Picture image="maraAirstrip" ratio="pano" sizes="100vw" caption="A bush airstrip in the Maasai Mara" />
      </div>

      {/* 3. Regions */}
      <section className="section" aria-labelledby="regions-title">
        <div className="container">
          <div className="section-head split">
            <div>
              <p className="eyebrow">Where to begin</p>
              <h2 id="regions-title" className="h2">Three starting points</h2>
            </div>
            <p className="lede">
              Kenya has many more places to explore than these. They are where many of our conversations begin, because each offers
              something quite different.
            </p>
          </div>
          <div className="region-grid">
            {destinations.map((d) => (
              <article className="region-card" key={d.slug}>
                <Link href={`/destinations/${d.slug}`} className="card-link" aria-label={`${d.name}: explore the region`}>
                  <Picture image={d.image} ratio="tall" sizes="(min-width: 900px) 30vw, 100vw" credit={false} />
                </Link>
                <div className="meta-row"><span>Typical stay {d.typicalStay}</span></div>
                <h3>{d.name}</h3>
                <p>{d.reason}</p>
                <Link className="text-link" href={`/destinations/${d.slug}`}>
                  Explore {d.shortName} <span className="arrow" aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Detail pair: stays */}
      <section className="section-tight bg-linen-2" aria-label="Time at camp">
        <div className="container two-col" style={{ alignItems: "center" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Picture image="veranda" ratio="portrait" sizes="(min-width: 900px) 24vw, 50vw" />
            <Picture image="outdoorTable" ratio="portrait" sizes="(min-width: 900px) 24vw, 50vw" />
          </div>
          <div>
            <p className="eyebrow">Between drives</p>
            <h2 className="h3" style={{ marginBottom: 16 }}>The hours in between matter too.</h2>
            <p style={{ color: "var(--ink-soft)" }}>
              A shaded veranda in the heat of the day, lunch laid outside, an evening without a schedule. When we choose where you stay,
              we think about the time you&apos;ll spend there as well as the wildlife nearby.
            </p>
            <Link className="text-link" href="/experiences#exclusive-use">Exclusive-use houses <span className="arrow" aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      {/* 4. Sample journeys */}
      <section className="section" aria-labelledby="journeys-title">
        <div className="container">
          <div className="section-head split">
            <div>
              <p className="eyebrow">Sample journeys</p>
              <h2 id="journeys-title" className="h2">Two routes to start the conversation</h2>
            </div>
            <p className="lede">
              These are illustrations, not packages. Every journey we plan is drawn up after we&apos;ve talked, and every day can change.
            </p>
          </div>
          {journeys.map((j, i) => (
            <article key={j.slug} className={`journey-feature${i % 2 ? " reverse" : ""}`}>
              <div className="journey-media">
                <Link href={`/journeys/${j.slug}`} aria-label={`${j.title}: view the sample journey`}>
                  <Picture image={j.image} ratio="landscape" sizes="(min-width: 960px) 56vw, 100vw" credit={false} />
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
                <Link className="text-link" href={`/journeys/${j.slug}`}>
                  View the route and day by day <span className="arrow" aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
          <p className="small muted" style={{ marginTop: 56, maxWidth: "48em" }}>
            Migration movements vary from year to year. Wildlife sightings, particular guides, private properties and specialist activities
            depend on conditions, availability and permissions.
          </p>
        </div>
      </section>

      {/* 5. How it works */}
      <section className="section on-dark" aria-labelledby="process-title">
        <div className="container">
          <div className="section-head split">
            <div>
              <p className="eyebrow">How it works</p>
              <h2 id="process-title" className="h2">From first enquiry to a proposal</h2>
            </div>
            <p className="lede">Journeys are quoted after a consultation, never from a price list, because the price depends on the choices you make.</p>
          </div>
          <Process />
          <div className="two-col" style={{ marginTop: "clamp(56px, 7vw, 96px)" }}>
            <div>
              <h3 className="h3" style={{ marginBottom: 20 }}>What we discuss on the call</h3>
              <ul className="check-list">
                <li><strong>Who is travelling</strong> and what each of you wants from the trip</li>
                <li><strong>Timing</strong>: the season, your dates and how long you have</li>
                <li><strong>Pace</strong>: how many moves, how early, how much free time</li>
                <li><strong>Where you stay</strong>: camp, lodge or a private house</li>
                <li><strong>Getting around</strong>: charter, scheduled flights or road</li>
                <li><strong>Guiding</strong>, specialist interests and anything we should plan around</li>
              </ul>
            </div>
            <div>
              <h3 className="h3" style={{ marginBottom: 20 }}>What you receive afterwards</h3>
              <ul className="check-list">
                <li>A <strong>route</strong> with a night-by-night outline</li>
                <li><strong>Accommodation options</strong>, with our reasons for each</li>
                <li>A <strong>transport plan</strong> for every leg</li>
                <li>What is <strong>included</strong>, what isn&apos;t, and a <strong>quote</strong></li>
                <li>A clear note of what is <strong>confirmed</strong> and what still depends on availability</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <ConsultationBand context={{ from: "/" }} />
    </>
  );
}
