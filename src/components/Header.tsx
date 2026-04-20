'use client';
// EN: Site header — brand, navigation, language selector, theme toggle, CTA
// AR: رأس الموقع — العلامة التجارية، الملاحة، اختيار اللغة، تبديل السمة، زر الدعوة
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { Home as HomeIcon, Info, Scale, Gavel, Newspaper, Mail } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { createPortal } from "react-dom";

export default function Header() {
  // EN: Read current language and theme state
  // AR: قراءة حالة اللغة والسمة الحالية
  const { t, lang, setLang } = useLanguage();
  const { dark } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement | null>(null);
  const [headerH, setHeaderH] = useState<number>(64);
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<{ languageToggle: boolean; pageLoadingCursor: boolean } | null>(null);
  const [header, setHeader] = useState<{ siteName_en?: string; siteName_ar?: string; logo?: string; published_siteName_en?: string; published_siteName_ar?: string; published_logo?: string } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (!headerRef.current || typeof window === "undefined") return;
    const el = headerRef.current;
    const measure = () => {
      try {
        setHeaderH(el.getBoundingClientRect().height || 64);
      } catch {}
    };
    measure();
    let ro: ResizeObserver | null = null;
    try {
      ro = new ResizeObserver(measure);
      ro.observe(el);
    } catch {}
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize as any);
    return () => {
      try {
        ro?.disconnect();
      } catch {}
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize as any);
    };
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
    return () => fn?.();
  };

  useEffect(() => {
    const prev = document.body.style.overflow;
    if (mobileOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [mobileOpen]);

  function Icon({ id }: { id: string }) {
    const common = "h-5 w-5 shrink-0";
    if (id === "home") return <HomeIcon className={common} aria-hidden="true" />;
    if (id === "about") return <Info className={common} aria-hidden="true" />;
    if (id === "services") return <Scale className={common} aria-hidden="true" />;
    if (id === "cases") return <Gavel className={common} aria-hidden="true" />;
    if (id === "news") return <Newspaper className={common} aria-hidden="true" />;
    if (id === "contact") return <Mail className={common} aria-hidden="true" />;
    return <span className={common} />;
  }

  // EN: Build bilingual nav items based on active language
  // AR: إنشاء عناصر الملاحة ثنائية اللغة حسب اللغة الحالية
  const navItems = useMemo(
    () => [
      { id: "home", label: t("navHome"), href: `/${lang}/home` },
      { id: "about", label: t("navAbout"), href: `/${lang}/about-us` },
      { id: "services", label: t("navServices"), href: `/${lang}/services` },
      { id: "cases", label: t("navCases"), href: `/${lang}/cases` },
      { id: "news", label: t("navNews"), href: `/${lang}/news` },
      { id: "contact", label: t("navContact"), href: `/${lang}/contact-us` },
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

  const headerMarkup = (
    <header ref={headerRef} className="site-fixed-header fixed inset-x-0 top-0 w-full z-[70]" suppressHydrationWarning>
      <div className="mx-auto max-w-7xl px-5 py-2">
        <div
          className="relative flex items-center justify-between rounded-2xl border border-transparent bg-transparent backdrop-blur shadow-none"
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
          <div className="h-8 w-8 logo-bg overflow-hidden">
            <Image src="/main_logo.svg" alt={lang === "ar" ? "الشعار الرئيسي" : "Main Logo"} width={20} height={20} className="object-contain logo-anim" />
          </div>
          <div className={
            "text-[13px] md:text-sm font-bold " +
            (dark
              ? "text-[var(--brand-accent)]"
              : "text-transparent bg-clip-text bg-gradient-to-r from-white/60 via-white to-white/60 bg-center")
          }>
            <span className="md:hidden" data-edit-key="brand-name-mobile">
              {lang === "ar" ? "خالد عمر للإستشارات البحرية" : "Khaled Omer "}
            </span>
            <span className="hidden md:inline" data-edit-key="brand-name-desktop">
              {lang === "ar" ? "خالد عمر للإستشارات البحرية" : "Khaled Omer Maritime Consultancy"}
            </span>
          </div>
        </motion.div>
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {/* EN: Primary navigation links with active indicator */}
          {/* AR: روابط الملاحة الأساسية مع مؤشر التفعيل */}
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.id === "home" && (pathname === "/" || pathname === "/en" || pathname === "/ar" || pathname === "/en/home" || pathname === "/ar/home")) ||
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
                        : "border-white/15 bg-white/10")
                    }
                  />
                ) : null}
                <motion.span
                  className={
                "relative z-10 block px-3 py-1.5 " +
                     (dark
                       ? "text-[var(--brand-accent)] hover:text-[var(--brand-accent)]"
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
          <div className="relative z-[85]" ref={langMenuRef}>
            {(() => {
              const activeLangLabel = lang === "ar" ? "عربي" : "Eng";
              const labelClass = dark ? "text-black" : "text-white";
              return (
            <button
              aria-label="Language"
              aria-haspopup="menu"
              aria-expanded={langOpen}
              onClick={() => setLangOpen((o) => !o)}
              className={
               "h-9 rounded-lg border inline-flex items-center gap-1.5 px-2.5 transition " +
               (
                 dark
                   ? "border-transparent bg-[var(--brand-accent)] hover:bg-[var(--accent-hover)]"
                   : "border-transparent bg-[var(--brand-accent)] hover:bg-[var(--accent-hover)]"
               )
              }
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3 12h18M12 3c2.5 2.6 3.8 5.3 3.8 9S14.5 20.4 12 21M12 3C9.5 5.6 8.2 8.3 8.2 12S9.5 18.4 12 21" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <span className={"text-xs font-semibold " + labelClass} style={dark ? { color: "#000000" } : { color: "#ffffff" }}>
                {activeLangLabel}
              </span>
              <svg width="12" height="12" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
              );
            })()}
            {langOpen && (
              <div
                role="menu"
                className={
                  "absolute right-0 mt-2 w-36 rounded-md border text-[var(--ink-primary)] shadow-lg overflow-hidden z-[100] ring-1 " +
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
                  <span className={"text-xs px-1.5 py-0.5 rounded bg-[var(--brand-accent)] " + (lang === "en" ? "text-white" : "text-[var(--brand-primary)]/90")}>EN</span>
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
                  <span className={"text-xs px-1.5 py-0.5 rounded bg-[var(--brand-accent)] " + (lang === "ar" ? "text-white" : "text-[var(--brand-primary)]/90")}>AR</span>
                </button>
              </div>
            )}
          </div>
          ) : null}
          {/* Theme toggle moved to footer */}
          <Link
            href={lang === "ar" ? "/ar/contact-us" : "/en/contact-us"}
            prefetch
            onClick={withWait()}
            className={[
              "rounded-lg px-3 py-1.5 text-sm hidden sm:inline transition-transform duration-200 will-change-transform hover:-translate-y-0.5 active:scale-95 shadow pointer-events-auto",
              dark
                ? "bg-[var(--brand-accent)] text-[var(--brand-primary)] font-semibold hover:bg-[var(--accent-hover)]"
                : "bg-[var(--brand-accent)] text-black font-bold hover:opacity-95"
            ].join(" ")}
          >
            <span className="inline-flex items-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                <path d="M4 6h16a1 1 0 011 1v.3l-9 5.7-9-5.7V7a1 1 0 011-1zm16 3.8V18a1 1 0 01-1 1H5a1 1 0 01-1-1V9.8l8.4 5.3a1 1 0 001.2 0L20 9.8z"/>
              </svg>
              <span>{t("ctaConsult")}</span>
            </span>
          </Link>
          <button
            aria-label="Menu"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            className={
               "md:hidden ml-2 h-11 w-11 rounded-lg border flex items-center justify-center " +
               (dark ? "border-white/10 bg-white/10" : "border-black/10 bg-black/5 hover:bg-black/10")
            }
          >
            {mobileOpen ? (
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <div className="flex flex-col gap-1.5">
                <span className={"block h-0.5 w-5 " + (dark ? "bg-[var(--brand-accent)]" : "bg-[#ffffff]")} />
                <span className={"block h-0.5 w-5 " + (dark ? "bg-[var(--brand-accent)]" : "bg-[#ffffff]")} />
                <span className={"block h-0.5 w-5 " + (dark ? "bg-[var(--brand-accent)]" : "bg-[#ffffff]")} />
              </div>
            )}
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
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          role="dialog"
          aria-modal="true"
          aria-label={lang === "ar" ? "قائمة الجوال" : "Mobile menu"}
          className="md:hidden fixed left-0 right-0 z-[60] text-[var(--ink-primary)]"
          style={{ top: headerH, bottom: 0 }}
        >
          <div
            className={
              "absolute inset-0 overflow-y-auto border-t border-[var(--panel-border)] backdrop-blur-md " +
              (dark
                ? "bg-[color-mix(in_oklab,var(--brand-primary),black_8%)] text-white"
                : "bg-[color-mix(in_oklab,#ffffff,white_0%)] text-[var(--ink-primary)]")
            }
          >
          {/* EN: Mobile navigation drawer */}
          {/* AR: قائمة ملاحة للجوال */}
          <div className="px-4 py-4 flex flex-col gap-3">
            <motion.div
              className="sticky top-0 z-10 h-[2px] rounded-full"
              style={{
                background: "linear-gradient(90deg, transparent, var(--brand-accent), transparent)",
                backgroundSize: "200% 100%",
              }}
              animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
            />
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                  (item.id === "home" && (pathname === "/" || pathname === "/en" || pathname === "/ar" || pathname === "/en/home" || pathname === "/ar/home")) ||
                (item.id !== "home" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => {
                    setMobileOpen(false);
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(new Event("site-loading-short") as any);
                    }
                  }}
                  aria-current={isActive ? "page" : undefined}
                  className={
                    "text-sm rounded flex items-center gap-3 px-3 py-3 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] " +
                    (isActive
                      ? "bg-[var(--brand-accent)] text-[var(--brand-primary)] font-semibold ring-1 ring-[var(--brand-accent)]/50"
                      : "hover:bg-[color-mix(in oklab,var(--brand-primary),white 10%)]")
                  }
                >
                  <span className={isActive ? "text-[var(--brand-primary)]" : "text-[var(--ink-primary)] opacity-90"}>
                    <Icon id={item.id} />
                  </span>
                  <span data-edit-key={`nav-${item.id}-mobile`}>{item.label}</span>
                  <svg className={(lang === "ar" ? "ms-auto" : "ml-auto") + " h-4 w-4 opacity-60"} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              );
            })}
            <motion.div
              className="my-2 h-[2px] rounded-full"
              style={{
                background: "linear-gradient(90deg, transparent, var(--brand-accent), transparent)",
                backgroundSize: "200% 100%",
              }}
              animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
            />
            <div className="flex items-center justify-center gap-2 py-1 text-[11px] uppercase tracking-widest text-zinc-500">
              <span>{lang === "ar" ? "تابعنا" : "Follow us"}</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" data-social="facebook" className="p-2 rounded-lg ring-1 ring-black/10 dark:ring-white/10 hover:bg-[#1877F2]/90 hover:text-white">
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M13.5 9H15V6h-1.5C11.6 6 11 7.4 11 9v1.5H9V14h2v6h3v-6h2l.5-3.5h-2.5V9c0-.4.1-1 .5-1h1V6h-1c-2 0-2.5 1.6-2.5 3v1.5z"/></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" data-social="twitter" className="p-2 rounded-lg ring-1 ring-black/10 dark:ring-white/10 hover:bg-[#1DA1F2]/90 hover:text-white">
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M22 5.8c-.7.3-1.5.6-2.3.7.8-.5 1.4-1.3 1.7-2.2-.8.5-1.7.9-2.6 1.1A3.9 3.9 0 0012 8.5c0 .3 0 .6.1.8-3.2-.2-6-1.7-7.9-4.1-.4.6-.6 1.3-.6 2.1 0 1.4.7 2.6 1.8 3.3-.6 0-1.2-.2-1.7-.5v.1c0 2 1.4 3.7 3.3 4.1-.3.1-.7.1-1 .1-.2 0-.5 0-.7-.1.5 1.7 2.1 3 4 3A7.9 7.9 0 014 19.6a11 11 0 006 1.8c7.2 0 11.2-6 11.2-11.2v-.5c.8-.5 1.4-1.2 1.9-1.9-.7.3-1.4.5-2.1.6z"/></svg>
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" data-social="instagram" className="p-2 rounded-lg ring-1 ring-black/10 dark:ring-white/10 hover:bg-[#E1306C]/90 hover:text-white">
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3.5a5.5 5.5 0 110 11 5.5 5.5 0 010-11zm0 2a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm5-2.3a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/></svg>
              </a>
              <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok" data-social="tiktok" className="p-2 rounded-lg ring-1 ring-black/10 dark:ring-white/10 hover:bg-[#000000]/90 hover:text-white">
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M20 8.5c-2 0-3.8-1-4.8-2.6v9.3a5.2 5.2 0 11-5.2-5.2c.3 0 .7 0 1 .1v2.7a2.5 2.5 0 10.9 4.8 2.5 2.5 0 001.6-2.3V2h2.7c.2.8.7 1.6 1.3 2.2A5.5 5.5 0 0020 5.5v3z"/></svg>
              </a>
            </div>
            {/* EN: Mobile contact CTA */}
            {/* AR: زر تواصل للجوال */}
            <Link
              href={lang === "ar" ? "/ar/contact-us" : "/en/contact-us"}
              onClick={() => setMobileOpen(false)}
              prefetch
              className="mt-2 w-full text-center rounded-lg bg-[var(--brand-accent)] text-[var(--brand-primary)] px-3 py-3 min-h-[44px] text-sm font-semibold transition-transform duration-200 will-change-transform hover:-translate-y-0.5 active:scale-95 shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
            >
              <span className="inline-flex items-center gap-2 justify-center">
                <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                  <path d="M4 6h16a1 1 0 011 1v.3l-9 5.7-9-5.7V7a1 1 0 011-1zm16 3.8V18a1 1 0 01-1 1H5a1 1 0 01-1-1V9.8l8.4 5.3a1 1 0 001.2 0L20 9.8z"/>
                </svg>
                <span>{t("ctaConsult")}</span>
              </span>
            </Link>
            <div className="mt-4 flex items-center justify-center">
              {header?.published_logo || header?.logo ? (
                <Image
                  src={(header?.published_logo || header?.logo) as string}
                  alt={lang === "ar" ? "شعار الشركة" : "Company logo"}
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain"
                  sizes="48px"
                  priority={true}
                />
              ) : (
                <Image src="/main_logo.svg" alt={lang === "ar" ? "الشعار" : "Logo"} width={48} height={48} className="h-12 w-12 object-contain" sizes="48px" priority />
              )}
            </div>
            <div className="mt-3 rounded-lg border border-[var(--panel-border)] bg-[var(--panel-bg)] p-3 text-xs text-[var(--text-secondary)]">
              {lang === "ar"
                ? "احجز استشارة أولية — سنراجع وضعك القانوني ونرسم خطة عمل واضحة مع توصيات عملية ومواعيد تنفيذ."
                : "Book an initial consultation — we assess your legal position and map a clear action plan with practical recommendations and timelines."}
            </div>
          </div>
          </div>
        </motion.div>
      )}
    </header>
  );

  if (!mounted || typeof document === "undefined") return headerMarkup;
  return createPortal(headerMarkup, document.body);
}
