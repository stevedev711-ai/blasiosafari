"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Wordmark } from "./Wordmark";
import { consultHref } from "@/lib/consult-link";

const primary = [
  { href: "/journeys", label: "Journeys" },
  { href: "/destinations", label: "Destinations" },
  { href: "/our-approach", label: "Our Approach" },
];
const secondary = [
  { href: "/experiences", label: "Experiences" },
  { href: "/journal", label: "Journal" },
  { href: "/destinations/maasai-mara", label: "Maasai Mara" },
  { href: "/destinations/lewa-laikipia", label: "Lewa & Laikipia" },
  { href: "/destinations/chyulu-hills", label: "Chyulu Hills" },
  { href: "/journeys#pathways", label: "Families, couples & photographers" },
];

const SOLID_PATHS = ["/journal", "/private-consultation", "/privacy", "/cookies", "/image-credits"];

export function Header({ previewBanner }: { previewBanner?: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hasHero, setHasHero] = useState(!SOLID_PATHS.some((p) => pathname.startsWith(p)));
  const [panelTop, setPanelTop] = useState(76);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Correct the header style once the page has rendered (e.g. 404 pages have no hero).
  useEffect(() => {
    setHasHero(Boolean(document.querySelector("[data-page-hero]")));
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    setPanelTop(headerRef.current?.getBoundingClientRect().bottom ?? 76);
    document.body.style.overflow = "hidden";
    const first = panelRef.current?.querySelector<HTMLElement>("a, button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab" && panelRef.current) {
        // keep focus within the menu and its toggle
        const items = [toggleRef.current, ...Array.from(panelRef.current.querySelectorAll<HTMLElement>("a, button"))].filter(Boolean) as HTMLElement[];
        const idx = items.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && idx <= 0) {
          e.preventDefault();
          items[items.length - 1].focus();
        } else if (!e.shiftKey && idx === items.length - 1) {
          e.preventDefault();
          items[0].focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isCurrent = (href: string) => (pathname === href || pathname.startsWith(href + "/") ? "page" : undefined);
  const cls = ["site-header", hasHero && "is-over-hero", scrolled && "is-scrolled", open && "is-open"].filter(Boolean).join(" ");

  return (
    <header className={cls} ref={headerRef}>
      {previewBanner}
      <div className="container header-inner">
        <Wordmark />
        <nav className="primary-nav" aria-label="Primary">
          <ul>
            {primary.map((l) => (
              <li key={l.href}>
                <Link href={l.href} aria-current={isCurrent(l.href)}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={consultHref({ from: pathname })} className="btn" aria-current={isCurrent("/private-consultation")}>
                Request a Private Consultation
              </Link>
            </li>
          </ul>
        </nav>
        <button
          ref={toggleRef}
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span>{open ? "Close" : "Menu"}</span>
          <span className="bars" aria-hidden="true" />
        </button>
      </div>
      <div id="mobile-menu" className="mobile-panel" hidden={!open} ref={panelRef} style={{ top: panelTop }}>
        <nav aria-label="Mobile">
          <ul className="mobile-primary">
            {primary.map((l) => (
              <li key={l.href}>
                <Link href={l.href} aria-current={isCurrent(l.href)} onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link href={consultHref({ from: pathname })} className="btn" onClick={() => setOpen(false)}>
          Request a Private Consultation
        </Link>
        <ul className="mobile-secondary" aria-label="More">
          {secondary.map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
