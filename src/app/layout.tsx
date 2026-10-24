import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/config";
import { Analytics } from "@vercel/analytics/next";
import { ScrollNavigation } from "@/components/ui/ScrollNavigation";

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
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "UGANDHAR VADDI — Personal Blog",
    template: "%s — Ugandhar Vaddi",
  },
  description:
    "Writing on my personal blog about technology, data science, and software engineering.",
  metadataBase: new URL("https://blog.ugandhar.in"),

  alternates: {
    canonical: "https://blog.ugandhar.in",
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/Logo.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },

  openGraph: {
    title: "UGANDHAR VADDI",
    description:
      "Writing about technology, data science, and software engineering.",
    url: "https://blog.ugandhar.in",
    siteName: "Ugandhar's Blog",
    images: [
      {
        url: "https://blog.ugandhar.in/ugandhar-profile.jpg",
        width: 1200,
        height: 630,
        alt: "Ugandhar Vaddi",
      },
    ],
    type: "website",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "UGANDHAR VADDI",
    description: "My personal blog about technology and software engineering.",
    images: ["https://blog.ugandhar.in/ugandhar-profile.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      "d6qC6JXOnKpcVtH15DHGM1LslxfSPMTZd2mavDkuMY8",
  },
};

// JSON-LD structured data for the site (Person + WebSite)
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://blog.ugandhar.in/#website",
      url: "https://blog.ugandhar.in",
      name: "Ugandhar's Blog",
      description:
        "Writing about technology, data science, and software engineering.",
      publisher: { "@id": "https://blog.ugandhar.in/#person" },
      inLanguage: "en-US",
    },
    {
      "@type": "Person",
      "@id": "https://blog.ugandhar.in/#person",
      name: "Ugandhar Vaddi",
      url: "https://blog.ugandhar.in",
      image: {
        "@type": "ImageObject",
        url: "https://blog.ugandhar.in/ugandhar-profile.jpg",
        width: 400,
        height: 400,
      },
      sameAs: [
        "https://github.com/uga961",
        "https://www.youtube.com/@uga961",
        "https://www.linkedin.com/in/vaddi-ugandhar/",
        "https://www.reddit.com/user/uga961",
      ],
      jobTitle: "Associate Data Scientist",
      description:
        "Associate Data Scientist and open-source enthusiast. Exploring Statistics, Data Analysis, and resilient systems.",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Inline theme script — runs before paint to prevent FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('theme');
                var d = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (t === 'dark' || (!t && d)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
        {/* JSON-LD structured data for Google rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} font-sans min-h-screen flex flex-col justify-between`}
      >
        {children}
        <ScrollNavigation />
        <Analytics />
      </body>
    </html>
  );
}
