import Image from "next/image";
import { getImage, type ImageKey } from "@/content/images";

type Props = {
  image: ImageKey;
  ratio?: "landscape" | "wide" | "pano" | "portrait" | "tall";
  sizes: string;
  priority?: boolean;
  caption?: string | boolean; // true = use location
  className?: string;
  credit?: boolean;
};

/** Responsive photograph with a fixed frame ratio, or a labelled placeholder when no photo exists yet. */
export function Picture({ image, ratio = "landscape", sizes, priority, caption, className, credit = true }: Props) {
  const img = getImage(image);
  const cap = caption === true ? img.location : caption || null;
  return (
    <figure className={`figure ${className ?? ""}`}>
      <div className={`figure-frame ratio-${ratio}`}>
        {img.src ? (
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes={sizes}
            priority={priority}
            style={{ objectPosition: img.position ?? "center" }}
          />
        ) : (
          <div className="placeholder-panel" role="img" aria-label={`Photograph to be supplied: ${img.alt}`}>
            <span className="ph-label">Photograph to be supplied</span>
            <span className="ph-text">{img.alt}</span>
          </div>
        )}
      </div>
      {(cap || (credit && img.credit)) && (
        <figcaption>
          {cap}
          {cap && credit && img.credit ? " · " : ""}
          {credit && img.credit ? (
            <>
              Photo: {img.credit.author},{" "}
              <a href={img.credit.licenseUrl} rel="license noopener" target="_blank">
                {img.credit.license}
              </a>
            </>
          ) : null}
        </figcaption>
      )}
    </figure>
  );
}
