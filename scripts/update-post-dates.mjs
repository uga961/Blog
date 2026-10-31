#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "posts");

function getGitLastModified(filePath) {
  try {
    const stdout = execSync(`git log -1 --format="%aI" -- "${filePath}"`, {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "ignore"],
    }).trim();
    if (stdout) {
      return stdout.slice(0, 10);
    }
  } catch {
    // Ignore git failure if not tracked yet
  }
  return null;
}

function getFileMtime(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.mtime.toISOString().slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

async function updatePostDates() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.error(`Posts directory not found: ${POSTS_DIR}`);
    return;
  }

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  console.log(`Auditing dates for ${files.length} markdown post(s)...`);

  const manifest = {};

  for (const file of files) {
    const filePath = path.join(POSTS_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const parsed = matter(content);

    const gitDate = getGitLastModified(filePath);
    const mtimeDate = getFileMtime(filePath);
    const lastUpdated = parsed.data.lastUpdated || gitDate || mtimeDate;

    manifest[file] = {
      title: parsed.data.title || file,
      date: parsed.data.date || mtimeDate,
      lastUpdated,
    };

    console.log(`✓ ${file} -> Published: ${manifest[file].date} | Last Updated: ${lastUpdated}`);
  }

  const manifestPath = path.join(process.cwd(), "posts-manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
  console.log(`\nManifest written to ${manifestPath}`);
}

updatePostDates();
