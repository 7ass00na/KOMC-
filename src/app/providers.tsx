'use client';
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

function DirController() {
  const { dir, lang } = useLanguage();
  useEffect(() => {
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);
  }, [dir, lang]);
  return null;
}

function LangAutoDetect() {
  const pathname = usePathname();
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const p = typeof pathname === "string" ? pathname : "/";
      if (p.startsWith("/en") || p.startsWith("/ar")) return;
      const alreadyRedirected = sessionStorage.getItem("komc_lang_redirected") === "1";
      if (alreadyRedirected) return;
      const cookieLang = document.cookie.match(/(?:^|; )site_lang=(ar|en)/)?.[1];
      if (cookieLang === "ar" || cookieLang === "en") return;
      let ar = false;
      const nav = (typeof navigator !== "undefined" && (navigator.language || (navigator as any).userLanguage)) || "";
      if (nav.toLowerCase().startsWith("ar")) ar = true;
      const ref = (typeof document !== "undefined" && document.referrer) || "";
      if (!ar && ref) {
        const hasArabicChars = /[\u0600-\u06FF]/.test(ref);
        const isArQuery = /[?&](hl|lr|lang|langpair)=(ar|ar-SA|ar_EG)\b/i.test(ref);
        if (hasArabicChars || isArQuery) ar = true;
      }
      const lang = ar ? "ar" : "en";
      document.cookie = `site_lang=${lang}; max-age=${60 * 60 * 24 * 365}; path=/; samesite=lax`;
      if (typeof window !== "undefined") {
        const loc = window.location;
        const basePath = typeof loc.pathname === "string" ? loc.pathname : "/";
        const search = loc.search || "";
        const hash = loc.hash || "";
        // Map non-localized path to localized path while preserving query and hash
        let targetPath = `/${lang}${basePath}`;
        targetPath = targetPath.replace(/\/{2,}/g, "/");
        // Avoid redirect loops or malformed URLs
        if (targetPath === basePath) return;
        sessionStorage.setItem("komc_lang_redirected", "1");
        try {
          const url = new URL(targetPath + search + hash, loc.origin);
          window.location.replace(url.toString());
        } catch {
          // Fallback to just /{lang} if URL construction fails
          window.location.replace(`/${lang}`);
        }
      }
    } catch {}
  }, [pathname]);
  return null;
}

export default function Providers({
  children,
  initialLang,
}: {
  children: React.ReactNode;
  initialLang?: "en" | "ar";
}) {
  return (
    <LanguageProvider initialLang={initialLang}>
      <ThemeProvider>
        <DirController />
        <LangAutoDetect />
        {children}
      </ThemeProvider>
    </LanguageProvider>
  );
}
