import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://note-pad-app-nu.vercel.app",
      lastModified: new Date(),
    },
  ];
}
