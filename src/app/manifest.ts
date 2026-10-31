import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ugandhar Vaddi — Blog",
    short_name: "Ugandhar Blog",
    description:
      "Writing on my personal blog about technology, data science, and software engineering.",
    start_url: "/",
    display: "standalone",
    background_color: "#121211",
    theme_color: "#121211",
    icons: [
      {
        src: "/icon.png",
        sizes: "any",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
