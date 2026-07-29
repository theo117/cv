import type { Metadata } from "next";
import Portfolio from "@/components/portfolio";

const shareUrl = "https://cv.teodordev.co.za/share-20260729";
const previewImage =
  "https://cv.teodordev.co.za/images/social-preview-20260729.jpg";

export const metadata: Metadata = {
  title: "Theodore Nelson — Software Developer",
  description: "Professional software built around real business problems.",
  alternates: {
    canonical: "https://cv.teodordev.co.za/",
  },
  openGraph: {
    title: "Theodore Nelson — Software Developer",
    description: "Professional software built around real business problems.",
    url: shareUrl,
    siteName: "Theodore Nelson",
    images: [
      {
        url: previewImage,
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
        url: previewImage,
        alt: "Theodore Nelson — Software Developer",
      },
    ],
  },
};

export default function SharePage() {
  return <Portfolio />;
}
