import type { MetadataRoute } from "next";
import { absoluteUrl, isPreview } from "@/site.config";

export default function robots(): MetadataRoute.Robots {
  if (isPreview) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/private-safari-kenya"] },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
