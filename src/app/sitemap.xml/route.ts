import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/config";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export async function GET() {
  const posts = getAllPosts(false);
  const siteUrl = siteConfig.url.replace(/\/+$/, "");

  const staticUrls = [
    `
    <url>
      <loc>${siteUrl}</loc>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
    </url>`,
  ];

  const postUrls = posts.map((post) => {
    return `
    <url>
      <loc>${siteUrl}/posts/${post.slug}</loc>
      <lastmod>${new Date(post.date).toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`;
  });

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls.join("")}
  ${postUrls.join("")}
</urlset>`;

  return new NextResponse(sitemapXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
    },
  });
}
