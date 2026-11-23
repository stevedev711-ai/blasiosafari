import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/site.config";

/** Typographic wordmark. Set `brand.logoSrc` in site.config.ts to swap in a supplied logo. */
export function Wordmark({ large = false, asLink = true }: { large?: boolean; asLink?: boolean }) {
  const { wordmark, logoSrc, name } = siteConfig.brand;
  const inner = logoSrc ? (
    <Image src={logoSrc} alt={name} width={180} height={48} priority />
  ) : (
    <>
      <span className="wordmark-primary" aria-hidden="true">{wordmark.primary}</span>
      <span className="wordmark-secondary" aria-hidden="true">{wordmark.secondary}</span>
      <span className="visually-hidden">{name}</span>
    </>
  );
  const cls = `wordmark${large ? " wordmark-lg" : ""}`;
  return asLink ? (
    <Link href="/" className={cls} aria-label={`${name}, home`}>
      {inner}
    </Link>
  ) : (
    <span className={cls}>{inner}</span>
  );
}
