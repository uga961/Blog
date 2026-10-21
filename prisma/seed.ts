import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const adminEmail = (process.env.ADMIN_EMAIL || "admin@xyz.in").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "AdminPassword123!";
  const adminName = process.env.ADMIN_NAME || "Alex Johnson";

  // 1. Upsert Administrator User
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      passwordHash, // Keeps password synced if changed in env
    },
    create: {
      email: adminEmail,
      name: adminName,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log(`✓ Admin user configured: ${admin.email}`);

  // 2. Check if posts already exist
  const postCount = await prisma.post.count();
  if (postCount > 0) {
    console.log(`ℹ️  Database already contains ${postCount} posts. Skipping sample posts.`);
    return;
  }

  // 3. Create Sample Tags
  const tagDistributed = await prisma.tag.upsert({
    where: { name: "Distributed Systems" },
    create: { name: "Distributed Systems", slug: "distributed-systems" },
    update: {},
  });

  const tagArchitecture = await prisma.tag.upsert({
    where: { name: "Architecture" },
    create: { name: "Architecture", slug: "architecture" },
    update: {},
  });

  const tagUIUX = await prisma.tag.upsert({
    where: { name: "Design & UX" },
    create: { name: "Design & UX", slug: "design-ux" },
    update: {},
  });

  const tagWebDev = await prisma.tag.upsert({
    where: { name: "Web Engineering" },
    create: { name: "Web Engineering", slug: "web-engineering" },
    update: {},
  });

  // 4. Create Sample Post 1 (Published)
  const post1 = await prisma.post.create({
    data: {
      title: "Building Resilient Distributed Systems: Practical Patterns",
      slug: "building-resilient-distributed-systems",
      excerpt:
        "An engineering deep dive into circuit breakers, idempotency keys, and graceful degradation in high-throughput cloud architectures.",
      content: `## The Reality of Failure in Distributed Systems

In monolithic applications, a procedure call either succeeds or fails synchronously within the same operating system process and memory space. In distributed systems, communication spans unreliable networks, asynchronous workers, and transient dependencies. Networks partition, DNS caches stale records, garbage collection pauses induce timeouts, and downstream services face sudden load spikes.

> "Everything fails, all the time." — Werner Vogels

When building mission-critical backends, designing for failure must be a first-class engineering priority rather than an afterthought.

## Core Architectural Patterns

To prevent cascading failures across services, several proven patterns should be applied cohesively.

### 1. Circuit Breakers

A circuit breaker prevents an application from repeatedly attempting an operation that is guaranteed to fail. Instead of consuming socket descriptors and worker threads, the breaker trips to open after consecutive thresholds.

Here is a streamlined implementation of an asynchronous circuit breaker:

\`\`\`typescript
export class CircuitBreaker {
  private failureCount = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private nextAttempt = Date.now();

  constructor(
    private threshold = 5,
    private timeoutMs = 10000
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('CircuitBreaker: Circuit is OPEN');
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure();
      throw err;
    }
  }

  private onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  private onFailure() {
    this.failureCount += 1;
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeoutMs;
    }
  }
}
\`\`\`

### 2. Idempotency Keys

When a client retries a mutation (such as processing an invoice or charging a credit card) due to a network timeout, the server must guarantee that the action executes exactly once.

Key design points for idempotency:
- Generate a unique client-side UUID key (\`Idempotency-Key\` header).
- Atomically store the request status (\`PROCESSING\`, \`COMPLETED\`) in Redis or PostgreSQL.
- Return the stored response payload when an identical key is presented.

| Header Name | Purpose | Example |
| :--- | :--- | :--- |
| \`Idempotency-Key\` | Ensures at-most-once execution | \`d7a5b3f1-4c2e-4b68\` |
| \`X-Request-Id\` | Distributed tracing across hops | \`req_99214ab6\` |
| \`Retry-After\` | Informs client of backoff window | \`15\` |

## Graceful Degradation

When non-essential systems degrade (e.g. recommendation algorithms, analytics tracking, or real-time avatars), fall back to cached defaults or sensible static placeholders rather than throwing a 500 internal server error.

By decoupling dependencies and anticipating transient failures, distributed architectures remain robust, predictable, and maintainable.`,
      coverImage:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
      status: "PUBLISHED",
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      readingTime: 5,
      authorId: admin.id,
      tags: {
        create: [
          { tagId: tagDistributed.id },
          { tagId: tagArchitecture.id },
        ],
      },
    },
  });

  // 5. Create Sample Post 2 (Published)
  const post2 = await prisma.post.create({
    data: {
      title: "The Craft of Minimalist Interfaces: Restraint as a Feature",
      slug: "the-craft-of-minimalist-interfaces",
      excerpt:
        "Why the best user experiences are defined by intentional omissions, typography hierarchy, and quiet visual feedback.",
      content: `## Subtraction Over Decoration

In modern software interfaces, there is an insidious temptation to fill empty space with gradients, decorative badges, floating action buttons, and unsolicited animations. However, real digital craftsmanship is demonstrated through disciplined omission.

> "Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away." — Antoine de Saint-Exupéry

When an interface steps back, the reader's attention shifts effortlessly to the content itself.

## The Pillars of Editorial Design

### 1. Typographic Hierarchy

A solid typographic scale establishes intuitive orientation without requiring noisy containers or dividing lines:

- **Serif Headlines**: Provide warmth, cadence, and editorial gravitas.
- **Clean Sans-Serif Body**: Delivers effortless legibility across display densities.
- **Monospace Accents**: Anchors technical metadata, dates, and code snippets with precision.

### 2. Restrained Color Palettes

A harmonious color system requires very few ingredients:

1. **Paper Background**: Soft off-white in light mode (\`#faf9f5\`), deep obsidian in dark mode (\`#0e1014\`).
2. **Ink Charcoal**: Crisp, contrast-compliant foreground text (\`#181b20\`).
3. **Single Accent Tint**: A calm forest emerald (\`#059669\`) reserved exclusively for interactive links, progress indicators, and active states.

\`\`\`css
/* Custom editorial design tokens */
:root {
  --background: 40 20% 98%;
  --foreground: 220 15% 12%;
  --accent: 158 64% 39%;
}
\`\`\`

### 3. Tactile Micro-Interactions

Every interaction should feel physical and reassuring:
- Subtly shifting arrow icons upon hovering an article title.
- Clear, visible keyboard focus rings (\`focus-visible:ring-2\`) for accessibility.
- A thin, unhurried reading progress bar at the top of the viewport.

By honoring these principles, software feels enduring, respectful of the user's cognitive energy, and deeply satisfying to use.`,
      coverImage:
        "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
      status: "PUBLISHED",
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      readingTime: 4,
      authorId: admin.id,
      tags: {
        create: [{ tagId: tagUIUX.id }],
      },
    },
  });

  // 6. Create Sample Post 3 (Draft - Private)
  const post3 = await prisma.post.create({
    data: {
      title: "Draft: Deep Dive into Zero-Copy Network Buffers",
      slug: "draft-deep-dive-into-zero-copy-network-buffers",
      excerpt:
        "Exploring epoll, io_uring, and zero-copy packet processing in high performance kernel subsystems.",
      content:
        "## Work in Progress\n\nThis article is a draft exploring Linux kernel network buffers and socket polling mechanisms.",
      status: "DRAFT",
      publishedAt: null,
      readingTime: 2,
      authorId: admin.id,
      tags: {
        create: [{ tagId: tagArchitecture.id }],
      },
    },
  });

  console.log(`✓ Sample posts seeded:
  - "${post1.title}" (PUBLISHED)
  - "${post2.title}" (PUBLISHED)
  - "${post3.title}" (DRAFT)`);
  console.log("🌱 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
