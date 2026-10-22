
import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/config";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const siteUrl = siteConfig.url.replace(/\/+$/, "");
  const posts = getAllPosts(false);

  const urls = [
    siteUrl,
    ...posts.map((post) => `${siteUrl}/posts/${post.slug}`),
  ];

  const entries = urls
    .map(
      (url) => `
  <url>
    <loc>${escapeXml(url)}</loc>
  </url>`
    )
    .join("");

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;

  return new NextResponse(sitemapXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
    },
  });
}
