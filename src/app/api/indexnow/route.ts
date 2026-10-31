import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

const HOST = "blog.ugandhar.in";
const KEY = "2f8745c1a89b4f99a071de8463990b76";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

export async function POST() {
  try {
    const posts = getAllPosts(false);
    const urls = [
      `https://${HOST}`,
      ...posts.map((post) => `https://${HOST}/posts/${post.slug}`),
    ];

    const payload = {
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList: urls,
    };

    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    return NextResponse.json({
      success: res.ok,
      status: res.status,
      urlsSubmitted: urls.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to submit IndexNow", details: String(error) },
      { status: 500 }
    );
  }
}
