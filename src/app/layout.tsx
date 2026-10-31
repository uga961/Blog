import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { siteConfig } from "@/lib/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F7F4" },
    { media: "(prefers-color-scheme: dark)", color: "#121211" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://blog.ugandhar.in"),
  title: {
    default: "Ugandhar Vaddi — Personal Blog",
    template: "%s | Ugandhar Vaddi",
  },
  description:
    "Writing on my personal blog about technology, data science, and software engineering.",
  keywords: [
    "Ugandhar Vaddi",
    "Ugandhar",
    "Ugandhar Vaddi Blog",
    "Ugandhar Blog",
    "uga961",
    "Data Scientist",
    "Associate Data Scientist",
    "Tredence Analytics Solutions",
    "Machine Learning",
    "Applied AI",
    "StayActive",
    "TV Detox Launcher",
    "Android TV",
    "ADB",
    "Python Data Visualization",
    "Matplotlib",
    "Seaborn",
    "Systems Programming",
    "Technical Journal",
    "Engineering Diaries",
    "Visakhapatnam",
    "Chennai",
  ],
  authors: [{ name: siteConfig.name, url: "https://www.ugandhar.in" }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: {
    canonical: "https://blog.ugandhar.in",
    types: {
      "application/rss+xml": "https://blog.ugandhar.in/feed.xml",
    },
  },
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      "d6qC6JXOnKpcVtH15DHGM1LslxfSPMTZd2mavDkuMY8",
    other: {
      "msvalidate.01": "2f8745c1a89b4f99a071de8463990b76",
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://blog.ugandhar.in",
    siteName: "Ugandhar Vaddi — Blog",
    title: "Ugandhar Vaddi — Personal Blog",
    description:
      "Writing on my personal blog about technology, data science, and software engineering.",
    images: [
      {
        url: "https://blog.ugandhar.in/social/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ugandhar Vaddi — Personal Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ugandhar Vaddi — Personal Blog",
    description:
      "Writing on my personal blog about technology, data science, and software engineering.",
    images: ["https://blog.ugandhar.in/social/og-image.png"],
    creator: "@uga961",
    site: "@uga961",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon.png", type: "image/png", sizes: "96x96" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
};

// JSON-LD structured data for Google Search Console (WebSite + Person)
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://blog.ugandhar.in/#website",
      url: "https://blog.ugandhar.in",
      name: "Ugandhar Vaddi — Personal Blog",
      alternateName: ["Ugandhar's Blog", "Ugandhar Vaddi Blog", "Ugandhar Vaddi"],
      description:
        "Writing on my personal blog about technology, data science, and software engineering.",
      publisher: { "@id": "https://www.ugandhar.in/#person" },
      inLanguage: "en-US",
    },
    {
      "@type": "Person",
      "@id": "https://www.ugandhar.in/#person",
      name: "Ugandhar Vaddi",
      alternateName: ["uga961", "VADDI UGANDHAR"],
      url: "https://www.ugandhar.in",
      image: "https://blog.ugandhar.in/avatar/profile.jpg",
      sameAs: [
        "https://github.com/uga961",
        "https://www.linkedin.com/in/vaddi-ugandhar-b37877266/",
        "https://www.youtube.com/@uga961",
        "https://blog.ugandhar.in",
        "https://www.reddit.com/user/uga961/",
      ],
      jobTitle: "Associate Data Scientist",
      worksFor: {
        "@type": "Organization",
        name: "Tredence Analytics Solutions",
        url: "https://www.tredence.com",
      },
      description:
        "Associate Data Scientist at Tredence. Writing about technology, data science, and software engineering.",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Inline theme script — prevents flash of light/dark mode */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const storedTheme = localStorage.getItem('theme');
                if (storedTheme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (_) {}
            `,
          }}
        />
        {/* JSON-LD structured data for Google rich search results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} font-sans min-h-screen flex flex-col justify-between bg-background text-on-surface antialiased selection:bg-foreground/15 selection:text-foreground`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
