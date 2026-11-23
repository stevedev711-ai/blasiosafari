import Image from "next/image";
import { getImage, type ImageKey } from "@/content/images";
import { Breadcrumbs } from "./Breadcrumbs";

type Props = {
  image: ImageKey;
  eyebrow?: string;
  title: string;
  lede?: string;
  crumbs?: { href: string; label: string }[];
  children?: React.ReactNode;
};

export function PageHero({ image, eyebrow, title, lede, crumbs, children }: Props) {
  const img = getImage(image);
  return (
    <section className="page-hero" data-page-hero>
      {img.src && (
        <Image src={img.src} alt={img.alt} fill priority sizes="100vw" style={{ objectFit: "cover", objectPosition: img.position ?? "center" }} />
      )}
      <div className="container">
        {crumbs && <Breadcrumbs items={crumbs} />}
        {eyebrow && <p className="eyebrow" style={{ color: "var(--champagne-soft)" }}>{eyebrow}</p>}
        <h1 className="h1" style={{ maxWidth: "14em" }}>{title}</h1>
        {lede && <p className="lede">{lede}</p>}
        {children}
      </div>
      {img.credit && (
        <p className="hero-caption">
          {img.location} · Photo: {img.credit.author},{" "}
          <a href={img.credit.licenseUrl} rel="license noopener" target="_blank">{img.credit.license}</a>
        </p>
      )}
    </section>
  );
}
