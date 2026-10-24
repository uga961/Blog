import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";

const SITE_URL = "https://blog.ugandhar.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts(false);

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => {
    const postDate = new Date(post.date);
    return {
      url: `${SITE_URL}/posts/${post.slug}`,
      lastModified: !isNaN(postDate.getTime()) ? postDate : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    };
  });

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...postEntries,
  ];
}
