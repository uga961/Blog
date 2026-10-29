import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/config";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export async function GET() {
  const posts = getAllPosts(false);
  const siteUrl = siteConfig.url.replace(/\/+$/, "");

  const itemsXml = posts
    .slice(0, 50)
    .map((post) => {
      const postUrl = `${siteUrl}/posts/${post.slug}`;
      const pubDate = new Date(post.date).toUTCString();
      const articleTitle = `${post.title} by ${siteConfig.name}`;

      return `
    <item>
      <title><![CDATA[${articleTitle}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <dc:creator><![CDATA[${siteConfig.name}]]></dc:creator>
      <author><![CDATA[${siteConfig.email} (${siteConfig.name})]]></author>
      <description><![CDATA[${post.excerpt || post.title}]]></description>
      ${post.tags.map((t) => `<category>${t}</category>`).join("\n      ")}
    </item>`;
    })
    .join("");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title><![CDATA[${siteConfig.name} — Personal Blog]]></title>
    <link>${siteUrl}</link>
    <description><![CDATA[${siteConfig.tagline}]]></description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteUrl}/Logo.png</url>
      <title>${siteConfig.name}</title>
      <link>${siteUrl}</link>
    </image>
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
