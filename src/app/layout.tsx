
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

// Stable for a deployment: new commits automatically select a fresh favicon URL.
// Only platform-provided identifiers are used; no request-time randomness.
const commitSha = process.env.VERCEL_GIT_COMMIT_SHA;
const deploymentId = process.env.VERCEL_DEPLOYMENT_ID;
const faviconVersion = commitSha && /^[a-f0-9]{7,64}$/i.test(commitSha)
  ? commitSha.slice(0, 12).toLowerCase()
  : deploymentId?.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64) || "development";

export const metadata: Metadata = {
  metadataBase: new URL("https://anrajplahe.com"),

  icons: {
    icon: {
      url: `/brand-icon?v=${faviconVersion}`,
      type: "image/png",
      sizes: "64x64",
    },
  },

  title: {
    default: "Anraj Plahe",
    template: "%s | Anraj Plahe",
  },

  description:
    "A personal space exploring software development, technology, Bhangra, music and everything in between.",

  openGraph: {
    title: "Anraj Plahe",
    description:
      "Software, technology, Bhangra, music and everything in between.",
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
      <body className="flex min-h-screen flex-col bg-[#0B0D14] text-white">
        {children}
      </body>
    </html>
  );
}

