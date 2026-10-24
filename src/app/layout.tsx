import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2efe4" },
    { media: "(prefers-color-scheme: dark)", color: "#10100f" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://blog.ugandhar.in"),
  title: {
    default: "Ugandhar Vaddi — Personal Blog",
    template: "%s — Ugandhar Vaddi",
  },
  description:
    "Writing on my personal blog about technology, data science, and software engineering.",
  keywords: [
    "Ugandhar Vaddi",
    "uga961",
    "Data Scientist",
    "Machine Learning",
    "Applied AI",
    "Python",
    "StayActive",
    "Systems Programming",
    "Personal Blog",
    "Visakhapatnam",
  ],
  authors: [{ name: "Ugandhar Vaddi", url: "https://ugandhar.in" }],
  creator: "Ugandhar Vaddi",
  publisher: "Ugandhar Vaddi",
  alternates: {
    canonical: "https://blog.ugandhar.in",
  },
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      "d6qC6JXOnKpcVtH15DHGM1LslxfSPMTZd2mavDkuMY8",
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
    siteName: "Ugandhar's Blog",
    title: "Ugandhar Vaddi — Personal Blog",
    description:
      "Writing about technology, data science, and software engineering.",
    images: [
      {
        url: "/social/og-image blog.png",
        width: 1200,
        height: 630,
        alt: "Ugandhar Vaddi — Personal Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ugandhar Vaddi — Personal Blog",
    description: "Writing about technology, data science, and software engineering.",
    images: ["/social/og-image blog.png"],
    creator: "@uga961",
    site: "@uga961",
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
  manifest: "/manifest.webmanifest",
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
      alternateName: "uga961",
      url: "https://ugandhar.in",
      image: "https://blog.ugandhar.in/avatar/profile.jpg",
      sameAs: [
        "https://github.com/uga961",
        "https://www.youtube.com/@uga961",
        "https://www.linkedin.com/in/vaddi-ugandhar-b37877266/",
        "https://www.reddit.com/user/uga961/",
      ],
      jobTitle: "Associate Data Scientist",
      worksFor: {
        "@type": "Organization",
        name: "Tredence Analytics Solutions",
        url: "https://www.tredence.com",
      },
      description:
        "Associate Data Scientist at Tredence. Building enterprise data intelligence, automated pipelines, and applied machine learning models while exploring low-level silicon architectures.",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="any" href="/icon.png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        {/* Inline theme script — runs before paint to prevent FOUC */}
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
        {/* JSON-LD structured data for Google rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} font-sans min-h-screen flex flex-col justify-between bg-background text-on-surface antialiased selection:bg-foreground/15`}
      >
        {children}
        <ScrollNavigation />
        <Analytics />
      </body>
    </html>
  );
}
