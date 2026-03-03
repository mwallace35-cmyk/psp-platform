import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PhillySportsPack.com",
    short_name: "PSP",
    description:
      "Philadelphia high school sports database — football, basketball, baseball, and more.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    theme_color: "#0a1628",
    background_color: "#ffffff",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon-192-maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/screenshot-540.png",
        sizes: "540x720",
        type: "image/png",
        form_factor: "narrow",
      },
      {
        src: "/screenshot-1280.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
      },
    ],
    categories: ["sports"],
    orientation: "portrait-primary",
  };
}
