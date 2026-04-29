import type { Metadata, Viewport } from "next";
import { Lora, Tajawal } from "next/font/google";
import "../lib/ssrDiagnostics";
import "./globals.css";
import Providers from "./providers";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";
import GlobalLoadingOverlay from "@/components/GlobalLoadingOverlay";
import CookieConsent from "@/components/CookieConsent";
import { Analytics } from "@vercel/analytics/react";
import AIChatFab from "@/components/AIChatFab";
import {
  BRAND_APPLE_TOUCH_ICON_PATH,
  BRAND_FAVICON_16_PATH,
  BRAND_FAVICON_32_PATH,
  BRAND_FAVICON_ICO_PATH,
  BRAND_LOGO_OG_PATH,
  BRAND_LOGO_SVG_PATH,
} from "@/lib/brandAssets";

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

const SITE_TITLE = "KOMC || Legal & Maritime Consultancy || Across the UAE";
const SITE_DESCRIPTION =
  "Trusted maritime law and legal consulting in the UAE. Admiralty, shipping, contracts, disputes, compliance. Bilingual Arabic & English.";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
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
  metadataBase: new URL("https://DN.com"),
  alternates: {
    canonical: "/",
    languages: {
      en: "/en/home",
      ar: "/ar/home",
    },
  },
  icons: {
    icon: [
      { url: BRAND_FAVICON_16_PATH, sizes: "16x16", type: "image/png" },
      { url: BRAND_FAVICON_32_PATH, sizes: "32x32", type: "image/png" },
      { url: BRAND_LOGO_SVG_PATH, type: "image/svg+xml" },
    ],
    shortcut: [BRAND_FAVICON_ICO_PATH],
    apple: [{ url: BRAND_APPLE_TOUCH_ICON_PATH, sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: SITE_TITLE,
    description:
      "Specialized in Admiralty, Commercial Shipping, Contracts, Disputes, and Compliance across the UAE and GCC.",
    url: "https://DN.com",
    siteName: "KOMC",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: BRAND_LOGO_OG_PATH,
        width: 512,
        height: 512,
        alt: "Khaled Omer Maritime & Legal Consultancy logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description:
      "Trusted maritime and legal expertise across the UAE.",
    images: [BRAND_LOGO_OG_PATH],
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
  let initialLang: "en" | "ar" = "ar";
  try {
    const { headers } = await import("next/headers");
    const h = await headers();
    const fromHeader = h.get("x-site-lang");
    if (fromHeader === "ar" || fromHeader === "en") initialLang = fromHeader;
  } catch {}
  return (
    <html lang={initialLang} dir={initialLang === "ar" ? "rtl" : "ltr"}>
      <head>
        <meta name="extension-detection" content="no-transform" />
        <meta name="format-detection" content="telephone=no,address=no,email=no" />
      </head>
      <body className={`${lora.variable} ${tajawal.variable} antialiased typography-root`} suppressHydrationWarning={true}>
        <Providers initialLang={initialLang}>
          <GlobalLoadingOverlay />
          <CookieConsent />
          {children}
          <Analytics />
          <AIChatFab />
          <WhatsAppFloatingButton />
          <ScrollToTopButton />
        </Providers>
      </body>
    </html>
  );
}
