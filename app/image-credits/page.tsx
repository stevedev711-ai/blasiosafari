import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { images, type SiteImage } from "@/content/images";

export const metadata: Metadata = {
  title: "Image credits",
  description: "Photographers and licences for the images used on this site.",
  alternates: { canonical: "/image-credits" },
};

export default function CreditsPage() {
  const list = (Object.values(images) as SiteImage[]).filter((i) => i.credit);
  return (
    <section className="page-intro" style={{ paddingBottom: "var(--section)" }}>
      <div className="container">
        <Breadcrumbs items={[{ href: "/image-credits", label: "Image credits" }]} />
        <h1 className="h1" style={{ marginBottom: 16 }}>Image credits</h1>
        <p className="lede" style={{ marginBottom: 40 }}>
          Photographs on this site are used under the licences shown. Images may have been cropped or resized. They do not depict
          properties we represent.
        </p>
        <div className="table-scroll">
          <table className="credits-table">
            <thead>
              <tr>
                <th scope="col">Subject</th>
                <th scope="col">Photographer</th>
                <th scope="col">Licence</th>
                <th scope="col">Source</th>
              </tr>
            </thead>
            <tbody>
              {list.map((i) => (
                <tr key={i.src}>
                  <td>{i.alt}</td>
                  <td>{i.credit!.author}</td>
                  <td><a href={i.credit!.licenseUrl} rel="license noopener" target="_blank">{i.credit!.license}</a></td>
                  <td><a href={i.credit!.sourceUrl} rel="noopener" target="_blank">Wikimedia Commons</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
