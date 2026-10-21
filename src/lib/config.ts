export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Alex Johnson",
  title: process.env.NEXT_PUBLIC_SITE_NAME || "Alex Johnson — Engineering & Systems",
  tagline: process.env.NEXT_PUBLIC_SITE_TAGLINE || "Writing on software systems, web engineering, and product craft.",
  bio:
    process.env.NEXT_PUBLIC_SITE_BIO ||
    "Staff engineer and open-source enthusiast. Exploring distributed systems, clean interfaces, and resilient web architecture.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  author: {
    name: process.env.NEXT_PUBLIC_SITE_NAME || "Alex Johnson",
    initials: "AJ",
    avatar: process.env.NEXT_PUBLIC_SITE_AVATAR || "",
    social: {
      github: process.env.NEXT_PUBLIC_SITE_GITHUB || "https://github.com",
      twitter: process.env.NEXT_PUBLIC_SITE_TWITTER || "https://twitter.com",
      linkedin: process.env.NEXT_PUBLIC_SITE_LINKEDIN || "",
    },
  },
  postsPerPage: 8,
};
