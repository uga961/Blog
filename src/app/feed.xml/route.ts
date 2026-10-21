import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/config";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export async function GET() {
  const posts = getAllPosts(false);
  const siteUrl = siteConfig.url.replace(/\/+$/, "");

  const itemsXml = posts
    .slice(0, 25)
    .map((post) => {
      const postUrl = `${siteUrl}/posts/${post.slug}`;
      const pubDate = new Date(post.date).toUTCString();
      const description = `<![CDATA[${post.excerpt || post.title}]]>`;

      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
    </item>`;
    })
    .join("");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${siteConfig.name}]]></title>
    <link>${siteUrl}</link>
    <description><![CDATA[${siteConfig.tagline}]]></description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssFeed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
    },
  });
}
