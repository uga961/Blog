import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";
import prisma from "../src/lib/prisma";
import { calculateReadingTime, extractExcerpt } from "../src/lib/markdown";
import { generateSlug } from "../src/lib/slug";

const frontmatterSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  date: z.union([z.string(), z.date()]).optional(),
  excerpt: z.string().optional(),
  tags: z.array(z.string()).default([]),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]).default("PUBLISHED"),
  coverImage: z.string().optional(),
});

async function main() {
  console.log("🚀 Starting Markdown content synchronization...\n");

  const postsDir = path.join(process.cwd(), "content", "posts");

  try {
    await fs.access(postsDir);
  } catch {
    console.error(`❌ Content directory not found: ${postsDir}`);
    process.exit(1);
  }

  // Find or create default admin user
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (!admin) {
    console.error(
      "❌ No administrator user found in database. Run 'npm run prisma:seed' first."
    );
    process.exit(1);
  }

  const entries = await fs.readdir(postsDir);
  const mdFiles = entries.filter((f) => f.endsWith(".md"));

  console.log(`Found ${mdFiles.length} Markdown files in content/posts/`);

  let createdCount = 0;
  let updatedCount = 0;

  for (const filename of mdFiles) {
    const filePath = path.join(postsDir, filename);
    const fileContent = await fs.readFile(filePath, "utf-8");

    const parsed = matter(fileContent);
    const validation = frontmatterSchema.safeParse(parsed.data);

    if (!validation.success) {
      console.warn(
        `⚠️  Skipping ${filename}: ${validation.error.errors[0]?.message}`
      );
      continue;
    }

    const { title, date, excerpt, tags, status, coverImage } = validation.data;
    const slug =
      validation.data.slug ||
      generateSlug(filename.replace(/\.md$/, "")) ||
      generateSlug(title);

    const content = parsed.content.trim();
    const readingTime = calculateReadingTime(content);
    const finalExcerpt = excerpt || extractExcerpt(content);
    const publishedAt = date ? new Date(date) : new Date();

    // Check if post already exists
    const existing = await prisma.post.findUnique({
      where: { slug },
      include: { tags: true },
    });

    if (existing) {
      // Update existing post
      await prisma.$transaction(async (tx) => {
        await tx.post.update({
          where: { id: existing.id },
          data: {
            title,
            excerpt: finalExcerpt,
            content,
            coverImage: coverImage || null,
            status,
            publishedAt,
            readingTime,
          },
        });

        // Reconcile tags
        await tx.postTag.deleteMany({ where: { postId: existing.id } });

        for (const tagName of tags) {
          const cleanName = tagName.trim();
          if (!cleanName) continue;
          const tagSlug = generateSlug(cleanName);

          const tag = await tx.tag.upsert({
            where: { name: cleanName },
            create: { name: cleanName, slug: tagSlug },
            update: {},
          });

          await tx.postTag.create({
            data: { postId: existing.id, tagId: tag.id },
          });
        }
      });

      console.log(`✓ Updated: "${title}" (${slug})`);
      updatedCount += 1;
    } else {
      // Create new post
      await prisma.$transaction(async (tx) => {
        const newPost = await tx.post.create({
          data: {
            title,
            slug,
            excerpt: finalExcerpt,
            content,
            coverImage: coverImage || null,
            status,
            publishedAt,
            readingTime,
            authorId: admin.id,
          },
        });

        for (const tagName of tags) {
          const cleanName = tagName.trim();
          if (!cleanName) continue;
          const tagSlug = generateSlug(cleanName);

          const tag = await tx.tag.upsert({
            where: { name: cleanName },
            create: { name: cleanName, slug: tagSlug },
            update: {},
          });

          await tx.postTag.create({
            data: { postId: newPost.id, tagId: tag.id },
          });
        }
      });

      console.log(`+ Created: "${title}" (${slug})`);
      createdCount += 1;
    }
  }

  console.log(
    `\n✅ Sync complete! Created: ${createdCount}, Updated: ${updatedCount}`
  );
}

main()
  .catch((err) => {
    console.error("Sync failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
