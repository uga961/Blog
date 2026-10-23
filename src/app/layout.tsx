import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/config";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "UGANDHAR VADDI",
  description:
    "Writing on my personal blog about technology, data science, and software engineering.",
  metadataBase: new URL("https://blog.ugandhar.in"),
   
  alternates: {
     canonical: "/",
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
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('theme');
                var supportDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (theme === 'dark' || (!theme && supportDark)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} font-sans min-h-screen flex flex-col justify-between`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
