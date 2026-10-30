import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";

const INDEXNOW_KEY = "2f8745c1a89b4f99a071de8463990b76";
const HOST = "blog.ugandhar.in";

export async function GET() {
  const posts = getAllPosts(false);
  const urlList = [
    `https://${HOST}`,
    ...posts.map((post) => `https://${HOST}/posts/${post.slug}`),
  ];

  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
    urlList,
  };

  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      submittedUrls: urlList.length,
      urls: urlList,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
