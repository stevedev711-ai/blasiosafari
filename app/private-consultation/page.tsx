import type { Metadata } from "next";
import { ConsultationForm } from "@/components/ConsultationForm";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Picture } from "@/components/Picture";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Request a Private Consultation",
  description:
    "Tell us about the safari you have in mind. Answer five short questions and we'll arrange a conversation, then prepare a tailored proposal for Kenya.",
  alternates: { canonical: "/private-consultation" },
  openGraph: { url: "/private-consultation" },
};

type SP = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.slice(0, 200);

export default async function ConsultationPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const from = one(sp.from);
  const context = {
    journey: one(sp.journey),
    destination: one(sp.destination),
    interest: one(sp.interest),
    context: one(sp.context),
    from: from && from.startsWith("/") ? from : undefined,
  };
  return (
    <section className="section" style={{ paddingTop: "clamp(48px, 6vw, 88px)" }}>
      <div className="container consult-shell">
        <aside className="consult-aside">
          <Breadcrumbs items={[{ href: "/private-consultation", label: "Private Consultation" }]} />
          <p className="eyebrow">Private consultation</p>
          <h1 className="h1" style={{ fontSize: "clamp(2.4rem, 4vw, 3.6rem)", marginBottom: 20 }}>Tell us about the trip you have in mind.</h1>
          <p>Five short steps. Answer what you can, and choose &ldquo;I&apos;d like your advice&rdquo; for anything you haven&apos;t decided.</p>
          <p>
            We&apos;ll reply {siteConfig.contact.responseTime} to arrange a call, {siteConfig.consultation.callLength}. After the call, we
            prepare a proposal with a route, places to stay and a quote, {siteConfig.consultation.proposalTurnaround}.
          </p>
          <p className="small muted">No obligation. Nothing is booked or held until you agree to a proposal.</p>
          <div style={{ marginTop: 32 }} className="aside-image">
            <Picture image="maraAirstripShade" ratio="landscape" sizes="(min-width: 1000px) 30vw, 100vw" caption="Waiting for the morning flight, Maasai Mara" />
          </div>
        </aside>
        <ConsultationForm context={context} />
      </div>
    </section>
  );
}
