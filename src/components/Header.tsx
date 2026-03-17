'use client';
// EN: Site header — brand, navigation, language selector, theme toggle, CTA
// AR: رأس الموقع — العلامة التجارية، الملاحة، اختيار اللغة، تبديل السمة، زر الدعوة
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Header() {
  // EN: Read current language and theme state
  // AR: قراءة حالة اللغة والسمة الحالية
  const { t, lang, setLang } = useLanguage();
  const { toggleDark, dark } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState<{ languageToggle: boolean; pageLoadingCursor: boolean } | null>(null);
  const [header, setHeader] = useState<{ siteName_en?: string; siteName_ar?: string; logo?: string; published_siteName_en?: string; published_siteName_ar?: string; published_logo?: string } | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/admin/settings", { cache: "no-store" });
        const data = await res.json();
        if (!cancelled) {
          setSettings({ languageToggle: data?.languageToggle !== false, pageLoadingCursor: !!data?.pageLoadingCursor });
        }
      } catch {
        if (!cancelled) setSettings({ languageToggle: true, pageLoadingCursor: false });
      }
    }
    load();
    async function loadHeader() {
      try {
        const res = await fetch("/api/admin/header", { cache: "no-store" });
        const d = await res.json();
        if (!cancelled) setHeader(d || {});
      } catch {}
    }
    loadHeader();
    function onUpdated(e: any) {
      const d = e?.detail;
      if (d) setSettings({ languageToggle: d?.languageToggle !== false, pageLoadingCursor: !!d?.pageLoadingCursor });
    }
    function onHeaderUpdated(e: any) {
      const d = e?.detail;
      if (d) setHeader((h) => ({ ...(h || {}), ...d }));
    }
    if (typeof window !== "undefined") {
      window.addEventListener("site-settings-updated" as any, onUpdated);
      window.addEventListener("site-header-updated" as any, onHeaderUpdated);
      return () => window.removeEventListener("site-settings-updated" as any, onUpdated);
    }
  }, []);

  const withWait = (fn?: () => void) => {
    const enabled = settings?.pageLoadingCursor;
    return () => {
      if (enabled && typeof document !== "undefined") {
        const prev = document.body.style.cursor;
        document.body.style.cursor = "progress";
        setTimeout(() => {
          document.body.style.cursor = prev;
        }, 900);
      }
      fn?.();
    };
  };

  useEffect(() => {
    const prev = document.body.style.overflow;
    if (mobileOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [mobileOpen]);

  // EN: Build bilingual nav items based on active language
  // AR: إنشاء عناصر الملاحة ثنائية اللغة حسب اللغة الحالية
  const navItems = useMemo(
    () => [
      { id: "home", label: t("navHome"), href: lang === "ar" ? "/ar" : "/en" },
      { id: "about", label: t("navAbout"), href: `/${lang}/about` },
      { id: "services", label: t("navServices"), href: `/${lang}/services` },
      { id: "cases", label: t("navCases"), href: `/${lang}/cases` },
      { id: "news", label: t("navNews"), href: `/${lang}/news` },
      { id: "contact", label: t("navContact"), href: `/${lang}/contact` },
    ],
    [t, lang]
  );

  // EN: Close language menu when clicking outside
  // AR: إغلاق قائمة اللغة عند النقر خارجها
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (
        langMenuRef.current &&
        !langMenuRef.current.contains(e.target as Node)
      ) {
        setLangOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <header className="fixed top-0 w-full z-50">
      <div className="mx-auto max-w-7xl px-5 py-2">
        <div
          className={
            "relative flex items-center justify-between rounded-2xl border backdrop-blur transition-all duration-300 " +
            (scrolled
              ? (dark
                  ? "bg-[color-mix(in_oklab,var(--brand-primary),white_10%)]/85 border-black/25 shadow-[0_6px_28px_rgba(0,0,0,0.25)]"
                  : "bg-[color-mix(in_oklab,#ffffff,transparent_0%)]/40 border-black/10 shadow-[0_6px_22px_rgba(0,0,0,0.06)]")
              : "bg-transparent border-transparent shadow-none")
          }
        >
          {/* EN: Sticky header bar container */}
          {/* AR: حاوية شريط الرأس الثابت */}
          <div className="flex-1 px-3 py-2 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          {/* EN: Brand mark and name */}
          {/* AR: علامة الشعار واسم العلامة */}
          <div className="h-8 w-8 rounded-full brand-gradient" />
          {(header?.published_logo || header?.logo) ? (
            <Image src={(header?.published_logo || header?.logo) as string} alt="Logo" width={28} height={28} className="rounded-full object-contain" />
          ) : null}
          <div className={
            "text-[13px] md:text-sm font-bold " +
            (dark
              ? (scrolled
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-white/60 via-white to-white/60 bg-center"
                  : "text-[var(--brand-accent)]")
              : (!scrolled
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-white/60 via-white to-white/60 bg-center"
                  : "text-transparent bg-clip-text bg-gradient-to-r from-[#132437] via-[color-mix(in_oklab,#132437,white_18%)] to-[#132437] bg-center"))
          }>
            <span data-edit-key="brand-name">
            {lang === "ar"
              ? ((header?.published_siteName_ar || header?.siteName_ar) ?? t("brandName"))
              : ((header?.published_siteName_en || header?.siteName_en) ?? t("brandName"))}
            </span>
          </div>
        </motion.div>
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {/* EN: Primary navigation links with active indicator */}
          {/* AR: روابط الملاحة الأساسية مع مؤشر التفعيل */}
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.id === "home" && (pathname === "/" || pathname === "/en" || pathname === "/ar")) ||
              (item.id !== "home" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={withWait()}
                aria-current={isActive ? "page" : undefined}
                className="relative rounded-lg"
              >
                {isActive ? (
                  <motion.span
                    layoutId="navPill"
                    className={
                       "absolute inset-0 rounded-lg border " +
                       (dark
                         ? "border-white/10 bg-white/10"
                         : scrolled
                           ? "border-transparent bg-[var(--brand-accent)]"
                           : "border-white/15 bg-white/10")
                    }
                  />
                ) : null}
                <motion.span
                  className={
                    "relative z-10 block px-3 py-1.5 " +
                     (dark
                       ? (scrolled
                           ? "text-[#ffffff]"
                           : "text-[var(--brand-accent)] hover:text-[var(--brand-accent)]")
                       : scrolled
                         ? (isActive ? "text-[#ffffff] font-bold hover:text-[#ffffff]" : "text-[var(--ink-primary)] font-bold hover:text-[var(--ink-primary)]")
                         : "text-[#ffffff] font-bold hover:text-[#ffffff]") +
                    (isActive ? " font-bold" : "")
                  }
                  whileHover={{ y: -1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  data-edit-key={`nav-${item.id}`}
                >
                  {item.label}
                </motion.span>
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          {/* EN: Language menu, theme toggle, and contact CTA */}
          {/* AR: قائمة اللغة، تبديل السمة، وزر التواصل */}
          {settings?.languageToggle !== false ? (
          <div className="relative" ref={langMenuRef}>
            {(() => {
              const activeLangLabel = lang === "ar" ? "عربي" : "Eng";
              const colorClass = dark ? (scrolled ? "text-white" : "text-[var(--brand-accent)]") : "text-[#ffffff]";
              return (
            <button
              aria-label="Language"
              aria-haspopup="menu"
              aria-expanded={langOpen}
              onClick={() => setLangOpen((o) => !o)}
              className={
               "h-9 rounded-lg border inline-flex items-center gap-1.5 px-2.5 transition " +
               (dark ? "border-white/10 bg-white/10 hover:bg-white/15" : (scrolled ? "border-transparent bg-[var(--brand-accent)] hover:bg-[var(--brand-accent)]" : "border-black/10 bg-black/5 hover:bg-black/10"))
              }
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={colorClass}>
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3 12h18M12 3c2.5 2.6 3.8 5.3 3.8 9S14.5 20.4 12 21M12 3C9.5 5.6 8.2 8.3 8.2 12S9.5 18.4 12 21" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <span className={"text-xs font-semibold " + colorClass}>{activeLangLabel}</span>
              <svg width="12" height="12" viewBox="0 0 20 20" fill="none" aria-hidden="true" className={colorClass}>
                <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
              );
            })()}
            {langOpen && (
              <div
                role="menu"
                className={
                  "absolute right-0 mt-2 w-36 rounded-md border text-[var(--ink-primary)] shadow-lg overflow-hidden z-50 ring-1 " +
                  (dark
                    ? "border-black/20 ring-white/5 bg-[var(--brand-primary)]"
                    : "border-black/15 ring-black/5 bg-white")
                }
              >
                {/* EN: English option */}
                {/* AR: خيار اللغة الإنجليزية */}
                <button
                  role="menuitem"
                  onClick={() => {
                    setLang("en");
                    setLangOpen(false);
                  }}
                  className={[
                    "flex items-center justify-between w-full text-left px-3 py-2.5 text-sm",
                    dark ? "text-white hover:bg-white/10" : "text-[var(--ink-primary)] hover:bg-black/5",
                    lang === "en" ? "bg-[var(--brand-accent)] text-white font-semibold" : "",
                  ].join(" ")}
                >
                  <span>English</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--brand-accent)] text-[var(--brand-primary)]/90">EN</span>
                </button>
                {/* EN: Arabic option */}
                {/* AR: خيار اللغة العربية */}
                <button
                  role="menuitem"
                  onClick={() => {
                    setLang("ar");
                    setLangOpen(false);
                  }}
                  className={[
                    "flex items-center justify-between w-full text-left px-3 py-2.5 text-sm",
                    dark ? "text-white hover:bg-white/10" : "text-[var(--ink-primary)] hover:bg-black/5",
                    lang === "ar" ? "bg-[var(--brand-accent)] text-white font-semibold" : "",
                  ].join(" ")}
                >
                  <span>العربية</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--brand-accent)] text-[var(--brand-primary)]/90">AR</span>
                </button>
              </div>
            )}
          </div>
          ) : null}
          {/* Theme toggle moved to footer */}
          <Link
            href={lang === "ar" ? "/ar/contact" : "/en/contact"}
            prefetch
            onClick={withWait()}
            className={[
              "rounded-lg px-3 py-1.5 text-sm hidden sm:inline transition-transform duration-200 will-change-transform hover:-translate-y-0.5 active:scale-95 shadow pointer-events-auto",
              dark
                ? "bg-[var(--brand-accent)] text-[var(--brand-primary)] font-semibold hover:bg-[var(--accent-hover)]"
                : "bg-[var(--brand-accent)] text-white font-bold hover:opacity-95"
            ].join(" ")}
          >
            {t("ctaConsult")}
          </Link>
          <button
            aria-label="Menu"
            onClick={() => setMobileOpen((v) => !v)}
            className={
               "md:hidden ml-2 h-9 w-9 rounded-lg border flex items-center justify-center " +
               (dark ? "border-white/10 bg-white/10" : (scrolled ? "border-transparent bg-[var(--brand-accent)]" : "border-black/10 bg-black/5 hover:bg-black/10"))
            }
          >
            <div className="flex flex-col gap-1.5">
               <span className={"block h-0.5 w-5 " + (dark ? (scrolled ? "bg-white" : "bg-[var(--brand-accent)]") : "bg-[#ffffff]")} />
               <span className={"block h-0.5 w-5 " + (dark ? (scrolled ? "bg-white" : "bg-[var(--brand-accent)]") : "bg-[#ffffff]")} />
               <span className={"block h-0.5 w-5 " + (dark ? (scrolled ? "bg-white" : "bg-[var(--brand-accent)]") : "bg-[#ffffff]")} />
            </div>
          </button>
          </div>
          {dark ? (
            <div aria-hidden className="pointer-events-none absolute left-2 right-2 -bottom-px h-px bg-gradient-to-r from-transparent via-[var(--brand-accent)]/70 to-transparent" />
          ) : (
            <div aria-hidden className="pointer-events-none absolute left-2 right-2 -bottom-px h-px bg-gradient-to-r from-transparent via-[color-mix(in_oklab,#132437,white_35%)] to-transparent" />
          )}
        </div>
        </div>
      </div>
      {mobileOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className={
            "md:hidden border-t text-[var(--ink-primary)] " +
            (dark ? "border-black/30 bg-[var(--brand-primary)]" : "border-black/10 bg-[color-mix(in_oklab,#e5d8cb,white_70%)]")
          }
        >
          {/* EN: Mobile navigation drawer */}
          {/* AR: قائمة ملاحة للجوال */}
          <div className="px-4 py-3 flex flex-col gap-3">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.id === "home" && (pathname === "/" || pathname === "/en" || pathname === "/ar")) ||
                (item.id !== "home" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={
                    "text-sm py-2 rounded " +
                    (isActive
                      ? "bg-[var(--brand-accent)] text-[var(--brand-primary)] font-semibold"
                      : "hover:bg-[color-mix(in oklab,var(--brand-primary),white 10%)]")
                  }
                >
                  <span data-edit-key={`nav-${item.id}-mobile`}>{item.label}</span>
                </Link>
              );
            })}
            {/* EN: Mobile contact CTA */}
            {/* AR: زر تواصل للجوال */}
            <Link
              href={lang === "ar" ? "/ar/contact" : "/en/contact"}
              onClick={() => setMobileOpen(false)}
              prefetch
              className="mt-2 rounded-lg bg-[var(--brand-accent)] text-[var(--brand-primary)] px-3 py-2 text-sm font-semibold transition-transform duration-200 will-change-transform hover:-translate-y-0.5 active:scale-95 shadow"
            >
              {t("ctaConsult")}
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}
