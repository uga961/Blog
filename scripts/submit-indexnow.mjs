#!/usr/bin/env node

/**
 * Submits thought article URLs to IndexNow (Bing, Microsoft Copilot, and Yandex).
 * Protocol spec: https://www.indexnow.org/
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const HOST = "thoughts.ugandhar.in";
const KEY = "2f8745c1a89b4f99a071de8463990b76";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const POSTS_DIR = path.join(process.cwd(), "posts");

function getPostSlugs() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const content = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
      const { data } = matter(content);
      if (data.published === false) return null;
      return data.slug || file.replace(/\.md$/, "");
    })
    .filter(Boolean);
}

async function submitIndexNow() {
  const slugs = getPostSlugs();
  const URLs = [
    `https://${HOST}`,
    ...slugs.map((slug) => `https://${HOST}/posts/${slug}`),
  ];

  console.log(`Submitting ${URLs.length} URLs to IndexNow for Bing and Microsoft Copilot...`);

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: URLs,
  };

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    console.log(`IndexNow response status: ${res.status} ${res.statusText}`);
    if (res.ok || res.status === 200 || res.status === 202) {
      console.log("✓ Successfully notified Bing and Microsoft Copilot!");
      console.log("Submitted URLs:");
      URLs.forEach((u) => console.log(`  - ${u}`));
    } else {
      console.warn("IndexNow returned non-200 status:", await res.text());
    }
  } catch (err) {
    console.error("IndexNow submission failed:", err);
  }
}

submitIndexNow();
