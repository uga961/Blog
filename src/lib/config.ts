export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Ugandhar Vaddi",
  title: process.env.NEXT_PUBLIC_SITE_NAME || "Ugandhar Vaddi — Data Science & Engineering",
  tagline: process.env.NEXT_PUBLIC_SITE_TAGLINE || "Writing on my personal blog about technology, data science, and software engineering.",
  bio:
    process.env.NEXT_PUBLIC_SITE_BIO ||
    "Associate Data Scientist and open-source enthusiast. Exploring Statistics, Data Analysis, and resilient systems.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://blog.ugandhar.in/",
  author: {
    name: process.env.NEXT_PUBLIC_SITE_NAME || "Ugandhar Vaddi",
    initials: "UV",
    avatar: process.env.NEXT_PUBLIC_SITE_AVATAR || "",
    social: {
      github: process.env.NEXT_PUBLIC_SITE_GITHUB || "https://github.com/uga961",
      youtube: process.env.NEXT_PUBLIC_SITE_YOUTUBE || "https://www.youtube.com/@uga961",
      linkedin: process.env.NEXT_PUBLIC_SITE_LINKEDIN || "https://www.linkedin.com/in/vaddi-ugandhar/",
    },
  },
  postsPerPage: 8,
};
