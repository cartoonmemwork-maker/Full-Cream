import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://fullcream.online/",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      images: [
        "https://fullcream.online/images/fabrica-produccion.webp",
        "https://fullcream.online/images/helados-fut.webp",
        "https://fullcream.online/images/sabores-full-cream.webp",
        "https://fullcream.online/images/helado-full-cream-2048.webp",
        "https://fullcream.online/images/heladeria-full-cream.webp",
      ],
    },
  ];
}
