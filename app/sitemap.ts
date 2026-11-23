import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/site.config";
import { journeys } from "@/content/journeys";
import { destinations } from "@/content/destinations";
import { articles } from "@/content/journal";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/journeys",
    ...journeys.map((j) => `/journeys/${j.slug}`),
    "/destinations",
    ...destinations.map((d) => `/destinations/${d.slug}`),
    "/experiences",
    "/our-approach",
    "/journal",
    ...articles.map((a) => `/journal/${a.slug}`),
    "/private-consultation",
    "/privacy",
    "/cookies",
  ];
  return paths.map((p) => ({ url: absoluteUrl(p), changeFrequency: "monthly", priority: p === "/" ? 1 : 0.7 }));
}
