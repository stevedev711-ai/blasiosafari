import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Picture } from "@/components/Picture";
import { Process } from "@/components/Process";
import { ConsultationBand } from "@/components/ConsultationBand";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Our approach",
  description:
    "How Blasio Luxury Safaris plans a private safari in Kenya, from the first conversation to a route proposal, and how we choose places to stay, guides and flights.",
  alternates: { canonical: "/our-approach" },
  openGraph: { url: "/our-approach", images: ["/images/chyulu-hills.jpg"] },
};

export default function ApproachPage() {
  return (
    <>
      <PageHero
        image="chyuluHills"
        eyebrow="Our approach"
        title="We start with how you want to spend your time."
        lede="Not with a list of lodges. The route, the places you stay and the way you travel all follow from that conversation."
        crumbs={[{ href: "/our-approach", label: "Our Approach" }]}
      />

      <section className="section" aria-labelledby="about-title">
        <div className="container two-col">
          <div>
            <p className="eyebrow">About us</p>
            <h2 id="about-title" className="h2" style={{ marginBottom: 24 }}>A Kenya-based company designing private, tailor-made safaris</h2>
          </div>
          <div className="prose">
            <p>
              {siteConfig.brand.name} plans private journeys in Kenya for couples, families, photographers and small private parties,
              whether they are travelling from the United States, the United Kingdom, the Middle East or elsewhere. We also work with
              travel advisors and assistants who are planning on someone else&apos;s behalf.
            </p>
            <p>
              We don&apos;t sell packages, and we don&apos;t publish prices. Each journey is designed after a conversation and quoted for
              the choices you make: where you stay, how you travel between regions, and the kind of guiding you want.
            </p>
            <p>
              We don&apos;t own aircraft, vehicles or properties. For each journey, we work with the camps, houses, guides and air
              operators that suit the route, and we explain why we&apos;ve suggested them. When something depends on availability, the
              season or local permissions, we say so.
            </p>
          </div>
        </div>
      </section>

      <div className="full-bleed">
        <Picture image="chyuluLava" ratio="pano" sizes="100vw" caption />
      </div>

      <section className="section" aria-labelledby="how-title">
        <div className="container">
          <div className="section-head split">
            <div>
              <p className="eyebrow">How we plan</p>
              <h2 id="how-title" className="h2">From the first conversation to a route proposal</h2>
            </div>
            <p className="lede">Four steps, at your pace. You can pause at any point. Nothing is booked until you have agreed to a proposal.</p>
          </div>
          <Process light />
        </div>
      </section>

      <section className="section bg-linen-2" aria-labelledby="principles-title">
        <div className="container">
          <p className="eyebrow">How we make decisions</p>
          <h2 id="principles-title" className="h2" style={{ marginBottom: 40 }}>What guides our recommendations</h2>
          <div className="change-grid">
            <div className="change" style={{ background: "var(--linen)" }}>
              <h3>Fewer moves, longer stays</h3>
              <p>We usually suggest more time in fewer places. Travel days are short in Kenya, but they still take time from the trip.</p>
            </div>
            <div className="change" style={{ background: "var(--linen)" }}>
              <h3>Each leg judged on its own</h3>
              <p>Charter, scheduled flight or road. We recommend the one that suits each leg, not one approach for the whole trip.</p>
            </div>
            <div className="change" style={{ background: "var(--linen)" }}>
              <h3>Conservancies, where they help</h3>
              <p>Private conservancy experiences such as walks and night drives are subject to local rules and permissions. We confirm what is possible before it goes in a proposal.</p>
            </div>
            <div className="change" style={{ background: "var(--linen)" }}>
              <h3>Plain about trade-offs</h3>
              <p>If a private house or a charter wouldn&apos;t make much difference to your trip, we&apos;ll tell you, and suggest where the budget would do more.</p>
            </div>
            <div className="change" style={{ background: "var(--linen)" }}>
              <h3>Honest about wildlife</h3>
              <p>No one can promise a sighting or a river crossing. We plan to give you the best chance, and leave room in the days to wait.</p>
            </div>
            <div className="change" style={{ background: "var(--linen)" }}>
              <h3>Advisors welcome</h3>
              <p>If you are planning for a client or principal, we can work through you and keep their details private until needed.</p>
            </div>
          </div>
          <p style={{ marginTop: 40 }}>
            Read more in the <Link href="/journal">Journal</Link>, or see how this works in practice on our{" "}
            <Link href="/journeys">sample journeys</Link>.
          </p>
        </div>
      </section>

      <ConsultationBand context={{ from: "/our-approach" }} />
    </>
  );
}
