// ===========================================
// P5C Tech - Root Layout
// Applies dark theme, fonts, and SEO metadata
// ===========================================

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "P5C Tech — Modern Web Development Agency",
    template: "%s | P5C Tech",
  },
  description:
    "We craft high-performance web applications with cutting-edge technology. Next.js, React, TypeScript — built for speed, scale, and stunning design.",
  keywords: [
    "web development",
    "agency",
    "Next.js",
    "React",
    "TypeScript",
    "full-stack",
    "modern design",
    "SaaS development",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "P5C Tech",
    title: "P5C Tech — Modern Web Development Agency",
    description:
      "We craft high-performance web applications with cutting-edge technology.",
  },
  twitter: {
    card: "summary_large_image",
    title: "P5C Tech — Modern Web Development Agency",
    description:
      "We craft high-performance web applications with cutting-edge technology.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
