import type { NextConfig } from "next";

const preview = process.env.NEXT_PUBLIC_SITE_MODE !== "live";

const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"], deviceSizes: [640, 828, 1080, 1280, 1600, 1920] },
  poweredByHeader: false,
  async headers() {
    const security = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];
    return [
      {
        source: "/:path*",
        headers: preview ? [...security, { key: "X-Robots-Tag", value: "noindex, nofollow" }] : security,
      },
    ];
  },
};

export default nextConfig;
