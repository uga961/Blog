import prisma from "./prisma";

/**
 * Converts a string into a clean, URL-friendly slug.
 */
export function generateSlug(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-") // replace spaces and underscores with -
    .replace(/[^a-z0-9-]/g, "") // remove non-alphanumeric chars
    .replace(/-+/g, "-") // collapse multiple hyphens
    .replace(/^-+|-+$/g, ""); // trim leading and trailing hyphens
}

/**
 * Ensures slug uniqueness by checking against existing posts in database.
 * If collision occurs, appends -2, -3, etc.
 */
export async function getUniqueSlug(
  baseText: string,
  excludePostId?: string
): Promise<string> {
  const baseSlug = generateSlug(baseText) || "post";
  let candidate = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.post.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existing || (excludePostId && existing.id === excludePostId)) {
      return candidate;
    }

    counter += 1;
    candidate = `${baseSlug}-${counter}`;
  }
}
