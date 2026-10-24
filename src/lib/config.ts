const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://blog.ugandhar.in";

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Ugandhar Vaddi",
  handle: "uga961",
  domain: "blog.ugandhar.in",
  mainDomain: "ugandhar.in",
  title:
    process.env.NEXT_PUBLIC_SITE_NAME ||
    "Ugandhar Vaddi — Personal Engineering Journal",
  tagline:
    process.env.NEXT_PUBLIC_SITE_TAGLINE ||
    "Associate Data Scientist at Tredence — Writing about resilient systems, machine learning & hardware.",
  bio:
    process.env.NEXT_PUBLIC_SITE_BIO ||
    "Associate Data Scientist at Tredence. Building enterprise data intelligence, automated pipelines, and applied machine learning models while exploring low-level silicon architectures.",
  bioLong:
    "I'm Ugandhar, an engineer who enjoys understanding how systems work from first principles — from transistor-level circuit design in Cadence to enterprise machine learning pipelines, predictive modeling, and native desktop utilities.",
  location: "Visakhapatnam, India",
  email: "annajiratnam@gmail.com",
  resumePath: "/resume/Resume.pdf",
  url: rawUrl.replace(/\/+$/, ""), // strip trailing slashes
  author: {
    name: process.env.NEXT_PUBLIC_SITE_NAME || "Ugandhar Vaddi",
    initials: "UV",
    avatar: "/avatar/profile.jpg",
    social: {
      website: process.env.NEXT_PUBLIC_SITE_WEBSITE || "https://ugandhar.in",
      github: process.env.NEXT_PUBLIC_SITE_GITHUB || "https://github.com/uga961",
      youtube:
        process.env.NEXT_PUBLIC_SITE_YOUTUBE ||
        "https://www.youtube.com/@uga961",
      linkedin:
        process.env.NEXT_PUBLIC_SITE_LINKEDIN ||
        "https://www.linkedin.com/in/vaddi-ugandhar-b37877266/",
      reddit:
        process.env.NEXT_PUBLIC_SITE_REDDIT ||
        "https://www.reddit.com/user/uga961/",
      hackerrank: "https://www.hackerrank.com/profile/42130516_ECE",
      email: "mailto:annajiratnam@gmail.com",
    },
  },
  postsPerPage: 6,
};
