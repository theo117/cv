import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://cv.teodordev.co.za"),
  title: "Theodore Nelson — Software Developer",
  description:
    "Java and full-stack developer building practical business software with Spring Boot, React, Next.js, and SQL.",
  keywords: [
    "Theodore Nelson",
    "Java Developer",
    "Spring Boot Developer",
    "Full Stack Developer",
    "Pretoria Software Developer",
  ],
  authors: [{ name: "Theodore Nelson" }],
  openGraph: {
    title: "Theodore Nelson — Software Developer",
    description: "Professional software built around real business problems.",
    url: "https://cv.teodordev.co.za/",
    siteName: "Theodore Nelson",
    images: [
      {
        url: "/images/social-preview-whatsapp-20260729.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Theodore Nelson — Software Developer",
      },
    ],
    locale: "en_ZA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Theodore Nelson — Software Developer",
    description: "Professional software built around real business problems.",
    images: [
      {
        url: "/images/social-preview-whatsapp-20260729.jpg",
        alt: "Theodore Nelson — Software Developer",
      },
    ],
  },
  alternates: { canonical: "/" },
  icons: { icon: "/favicon-v2.svg", apple: "/apple-touch-icon-v2.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#07080a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
