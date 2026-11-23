import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-intro" style={{ paddingBottom: "var(--section)" }}>
      <div className="container-narrow">
        <p className="eyebrow">Page not found</p>
        <h1 className="h1" style={{ marginBottom: 20 }}>We couldn&apos;t find that page.</h1>
        <p className="lede">It may have moved. These are good places to continue:</p>
        <ul className="check-list" style={{ marginTop: 24 }}>
          <li><Link href="/journeys">Sample journeys</Link></li>
          <li><Link href="/destinations">Destinations</Link></li>
          <li><Link href="/private-consultation">Request a Private Consultation</Link></li>
        </ul>
      </div>
    </section>
  );
}
