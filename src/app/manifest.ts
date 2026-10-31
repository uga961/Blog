import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ugandhar Vaddi — Thoughts",
    short_name: "Thoughts",
    description:
      "Writing and personal thoughts by Ugandhar Vaddi on technology, data science, and software engineering.",
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
