import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://verceltics.com"),
  title: "VercelLens — Website analytics for your Vercel sites",
  description:
    "See who is visiting your Vercel-hosted websites. Real visitor counts, page views, bounce rates, and per-page breakdowns, right from your phone.",
  openGraph: {
    type: "website",
    url: "https://verceltics.com/",
    siteName: "VercelLens",
    title: "VercelLens — Website analytics for your Vercel sites",
    description:
      "See who is visiting your Vercel-hosted websites. Real visitor counts, page views, bounce rates, and per-page breakdowns, right from your phone.",
    images: [
      {
        url: "https://verceltics.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "VercelLens — Website analytics for your Vercel sites",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VercelLens — Website analytics for your Vercel sites",
    description:
      "See who is visiting your Vercel-hosted websites. Real visitor counts, page views, bounce rates, and per-page breakdowns, right from your phone.",
    images: ["https://verceltics.com/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
