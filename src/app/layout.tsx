import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL("https://anrajplahe.com"),

  title: {
    default: "Anraj Plahe",
    template: "%s | Anraj Plahe",
  },

  description:
    "A personal space exploring software development, technology, Bhangra, music and everything in between.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Anraj Plahe",
    description:
      "Software, technology, Bhangra, music and everything in between.",
    url: "https://anrajplahe.com",
    siteName: "Anraj Plahe",
    locale: "en_GB",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Anraj Plahe",
    description:
      "Technology, creativity and everything in between.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
