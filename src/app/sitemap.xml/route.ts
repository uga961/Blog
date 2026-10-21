import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { siteConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function GET() {
  const now = new Date();
  const siteUrl = siteConfig.url.replace(/\/+$/, "");

  let posts: { slug: string; updatedAt: Date; publishedAt: Date | null }[] = [];

  try {
    posts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: {
          lte: now,
        },
      },
      select: {
        slug: true,
        updatedAt: true,
        publishedAt: true,
      },
    });
  } catch {
    // If DB is offline or not yet migrated during build, continue gracefully
  }

  const staticUrls = [
    `
    <url>
      <loc>${siteUrl}</loc>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
    </url>`,
  ];

  const postUrls = posts.map((post) => {
    const lastMod = (post.updatedAt || post.publishedAt || new Date()).toISOString();
    return `
    <url>
      <loc>${siteUrl}/posts/${post.slug}</loc>
      <lastmod>${lastMod}</lastmod>
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
