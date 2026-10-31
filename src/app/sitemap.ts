import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";

const SITE_URL = "https://blog.ugandhar.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts(false);

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => {
    const postDate = new Date(post.lastUpdated || post.date);
    const validDate = !isNaN(postDate.getTime()) ? postDate : new Date();

    return {
      url: `${SITE_URL}/posts/${post.slug}`,
      lastModified: validDate,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    };
  });

  const latestPostDate =
    posts.length > 0 && !isNaN(new Date(posts[0].lastUpdated || posts[0].date).getTime())
      ? new Date(posts[0].lastUpdated || posts[0].date)
      : new Date();

  return [
    {
      url: SITE_URL,
      lastModified: latestPostDate,
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    ...postEntries,
  ];
}
