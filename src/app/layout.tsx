import type { Metadata, Viewport } from "next";
import { Lora, Tajawal } from "next/font/google";
import "../lib/ssrDiagnostics";
import "./globals.css";
import Providers from "./providers";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";
import GlobalLoadingOverlay from "@/components/GlobalLoadingOverlay";
import CookieConsent from "@/components/CookieConsent";
import { Analytics } from "@vercel/analytics/next";

const lora = Lora({
  variable: "--font-en",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const tajawal = Tajawal({
  variable: "--font-ar",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KOMC || Legal & Maitime Consultation a cross the UAE",
  description:
    "Trusted maritime law and legal consulting in the UAE. Admiralty, shipping, contracts, disputes, compliance. Bilingual Arabic & English.",
  keywords: [
    "Maritime Law UAE",
    "Legal Consulting",
    "Admiralty",
    "Shipping Law",
    "Contracts",
    "Dispute Resolution",
    "Compliance",
    "Arabic",
    "English",
  ],
  metadataBase: new URL("https://www.example.com"),
  alternates: {
    canonical: "/en",
    languages: {
      "en": "/en",
      "ar": "/ar",
    },
  },
  icons: {
    icon: "/icon.svg",
    shortcut: ["/icon.svg"],
    apple: "/icon.svg",
  },
  openGraph: {
    title:
      "KOMC | Legal & Maitime Consultation UAE",
    description:
      "Specialized in Admiralty, Commercial Shipping, Contracts, Disputes, and Compliance across the UAE & GCC.",
    url: "https://www.example.com/en",
    siteName: "KOMC",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "KOMC || Legal & Maitime Consultation UAE",
    description:
      "Trusted maritime & legal expertise a cross the UAE.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A192F",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let initialLang: "en" | "ar" = "en";
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/admin/theme`, { cache: "no-store" });
    const d = await res.json();
    if (d?.defaultLang === "ar" || d?.defaultLang === "en") initialLang = d.defaultLang;
  } catch {}
  return (
    <html lang="en">
      <body className={`${lora.variable} ${tajawal.variable} antialiased`}>
        <Providers initialLang={initialLang}>
          <GlobalLoadingOverlay />
          <CookieConsent />
          {children}
          <WhatsAppFloatingButton />
          <ScrollToTopButton />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
