import Link from "next/link";
import type { Metadata } from "next";
import { experiences, shapingChoices } from "@/content/experiences";
import { PageHero } from "@/components/PageHero";
import { Picture } from "@/components/Picture";
import { ConsultationBand } from "@/components/ConsultationBand";
import { consultHref } from "@/lib/consult-link";

export const metadata: Metadata = {
  title: "Experiences: guiding, houses, flights and permitted activities",
  description:
    "Private guiding, photography, exclusive-use houses, charter and scheduled flights, and permitted experiences such as guided walks, balloon flights and night drives in Kenya.",
  alternates: { canonical: "/experiences" },
  openGraph: { url: "/experiences", images: ["/images/mara-vehicle.jpg"] },
};

export default function ExperiencesPage() {
  return (
    <>
      <PageHero
        image="maraElephant"
        eyebrow="Experiences"
        title="The choices that shape a journey"
        lede="Some decisions change a single afternoon. Others change the whole route. Here is how we think about each."
        crumbs={[{ href: "/experiences", label: "Experiences" }]}
      />
      <div className="container">
        {experiences.map((e) => (
          <section className="exp" id={e.id} key={e.id} aria-labelledby={`${e.id}-title`}>
            <div className="exp-media">
              <Picture image={e.image} ratio="landscape" sizes="(min-width: 960px) 42vw, 100vw" caption />
            </div>
            <div>
              <h2 id={`${e.id}-title`}>{e.title}</h2>
              {e.body.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
              <div className="shape-note">
                <strong>How it shapes the itinerary</strong>
                {e.shapes}
              </div>
              <p style={{ marginTop: 24 }}>
                <Link className="text-link" href={consultHref({ context: e.title, from: `/experiences#${e.id}` })}>
                  Ask about this <span className="arrow" aria-hidden="true">→</span>
                </Link>
              </p>
            </div>
          </section>
        ))}
      </div>

      <section className="section on-dark" aria-labelledby="shape-title">
        <div className="container">
          <div className="section-head split">
            <div>
              <p className="eyebrow">At a glance</p>
              <h2 id="shape-title" className="h2">Which choices change the shape of an itinerary</h2>
            </div>
            <p className="lede">We usually settle these in this order on the first call, because each one narrows the next.</p>
          </div>
          <div className="table-scroll">
            <table className="shape-table">
              <thead>
                <tr>
                  <th scope="col">Choice</th>
                  <th scope="col">What it decides</th>
                  <th scope="col">For example</th>
                </tr>
              </thead>
              <tbody>
                {shapingChoices.map((c) => (
                  <tr key={c.choice}>
                    <th scope="row">{c.choice}</th>
                    <td>{c.effect}</td>
                    <td>{c.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <ConsultationBand context={{ from: "/experiences" }} />
    </>
  );
}
