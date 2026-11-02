import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ["", "/about", "/services", "/financing", "/contact"].map((p, i) => ({
    url: `${site.url}${p}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: i === 0 ? 1 : 0.8,
  }));
}
