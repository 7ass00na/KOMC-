'use client';
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { useEffect } from "react";

function DirController() {
  const { dir, lang } = useLanguage();
  useEffect(() => {
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);
  }, [dir, lang]);
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
        {children}
      </ThemeProvider>
    </LanguageProvider>
  );
}
