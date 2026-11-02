import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: { formats: ["image/avif", "image/webp"] },
  // Keep every original URL working (keelerdental.org used .html pages).
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/about.html", destination: "/about", permanent: true },
      { source: "/services.html", destination: "/services", permanent: true },
      { source: "/financing.html", destination: "/financing", permanent: true },
      { source: "/contact.html", destination: "/contact", permanent: true },
    ];
  },
};

export default nextConfig;
