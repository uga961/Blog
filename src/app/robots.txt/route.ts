import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/config";

export async function GET() {
  const siteUrl = siteConfig.url.replace(/\/+$/, "");

  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin/

Sitemap: ${siteUrl}/sitemap.xml
`;

  return new NextResponse(robots, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400",
    },
  });
}
