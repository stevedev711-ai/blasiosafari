import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: "How Blasio Luxury Safaris uses the personal details you share through this website.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const email = siteConfig.contact.publicEmail;
  return (
    <section className="page-intro" style={{ paddingBottom: "var(--section)" }}>
      <div className="container-narrow prose">
        <Breadcrumbs items={[{ href: "/privacy", label: "Privacy" }]} />
        <h1 className="h1" style={{ marginBottom: 16 }}>Privacy notice</h1>
        <p className="small muted">Last updated {siteConfig.policiesUpdatedOn}. This notice must be reviewed for your jurisdictions before launch.</p>
        <h2>Who we are</h2>
        <p>
          {siteConfig.brand.name} is a safari planning company based in {siteConfig.brand.baseLocation}. For questions about your
          personal data, contact us {email ? <>at <a href={`mailto:${email}`}>{email}</a></> : "using the consultation form"}.
        </p>
        <h2>What we collect</h2>
        <p>
          When you request a consultation, we collect the details you choose to give us: your name, email address, optional phone or
          WhatsApp number, preferred contact method, time zone, travel preferences and any notes. We also record the page you enquired
          from and any campaign parameters in the link you followed (for example, which advert brought you to the site). This helps us
          understand which of our pages and adverts are useful.
        </p>
        <h2>How we use it</h2>
        <ul>
          <li>To reply to your enquiry and arrange a consultation.</li>
          <li>To prepare and discuss a proposal for your journey.</li>
          <li>To keep a record of our correspondence with you.</li>
        </ul>
        <p>We do not sell your details. We do not send your name, email address, phone number or notes to analytics or advertising tools.</p>
        <h2>Who we share it with</h2>
        <p>
          We use service providers to receive and manage enquiries, such as email and customer-relationship software. They process your
          details on our behalf. If you go ahead with a journey, we will share the details needed with the camps, guides and air
          operators involved, and we will tell you beforehand.
        </p>
        <h2>How long we keep it</h2>
        <p>We keep enquiry details for as long as we need them to respond and plan your journey, and for a limited period afterwards for our records, unless the law requires otherwise.</p>
        <h2>Your rights</h2>
        <p>
          Depending on where you live, you may have the right to access, correct or delete your personal data, to object to how we use
          it, or to complain to a data protection authority. To exercise these rights, contact us using the details above.
        </p>
        <h2>Cookies</h2>
        <p>
          See our <Link href="/cookies">cookie policy</Link>. Analytics and advertising cookies are used only if you accept them.
        </p>
      </div>
    </section>
  );
}
