'use client';
// EN: Footer — brand summary, quick links, services, contact, newsletter, legal
// AR: تذييل — ملخص العلامة، روابط سريعة، خدمات، تواصل، نشرة بريدية، قانوني
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { track } from "@/lib/welcomeLabels";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

function SocialIcon({ kind }: { kind: "linkedin" | "twitter" | "facebook" | "instagram" | "tiktok" }) {
  if (kind === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path fill="currentColor" d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8.98h5V24H0zM8.5 8.98H13v2.05h.06c.63-1.2 2.17-2.47 4.47-2.47C22.4 8.56 24 11 24 15.02V24h-5v-7.47c0-1.78-.03-4.06-2.48-4.06-2.48 0-2.86 1.94-2.86 3.94V24H8.5z"/>
      </svg>
    );
  }
  if (kind === "tiktok") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path fill="currentColor" d="M20 8.5c-2 0-3.8-1-4.8-2.6v9.3a5.2 5.2 0 11-5.2-5.2c.3 0 .7 0 1 .1v2.7a2.5 2.5 0 10.9 4.8 2.5 2.5 0 001.6-2.3V2h2.7c.2.8.7 1.6 1.3 2.2A5.5 5.5 0 0020 5.5v3z"/>
      </svg>
    );
  }
  if (kind === "twitter") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path fill="currentColor" d="M13.7 10.3 21.9 2h-1.9l-6.8 7.2L9 2H2l8 12.3L2 22h1.9l7.4-7.8L15 22h7l-8.3-11.7Zm-2.6 2.7-.9-1.3L4.3 3.3h3.1l4.1 6 1 1.4 4.9 7h-3.1l-3.2-4.7Z"/>
      </svg>
    );
  }
  if (kind === "facebook") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path fill="currentColor" d="M22 12.06C22 6.55 17.52 2 12 2S2 6.55 2 12.06C2 17.09 5.66 21.3 10.44 22v-7.05H7.9v-2.9h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34V22C18.34 21.3 22 17.09 22 12.06Z"/>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm10 2H7a3 3 0 0 0-3 3v10c0 1.65 1.35 3 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm-2.25 3.5a2.25 2.25 0 1 1 0 4.5 2.25 2.25 0 0 1 0-4.5ZM12 10.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"/>
    </svg>
  );
}

export default function Footer() {
  const { t, lang } = useLanguage();
  const { mode, setMode } = useTheme();
  const base = `/${lang}`;
  const pathname = usePathname();
  const [showLegal, setShowLegal] = useState(false);
  const [legalType, setLegalType] = useState<"privacy" | "terms" | "disclaimer">("privacy");
  const [legalHTML, setLegalHTML] = useState<string>("");
  const [loadingLegal, setLoadingLegal] = useState<boolean>(false);
  const [newsletterEmail, setNewsletterEmail] = useState<string>("");
  const [newsletterError, setNewsletterError] = useState<string>("");
  const [newsletterOpen, setNewsletterOpen] = useState<boolean>(false);
  const [newsletterLoading, setNewsletterLoading] = useState<boolean>(false);
  const [newsletterSuccessEmail, setNewsletterSuccessEmail] = useState<string>("");
  const [devOpsOpen, setDevOpsOpen] = useState<boolean>(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const devOpsCloseBtnRef = useRef<HTMLButtonElement | null>(null);
  const [settings, setSettings] = useState<{
    themeToggle: boolean;
    whatsapp: { enabled: boolean; number: string; message: string };
    aiAssistant: { enabled: boolean; widgetCode: string; show: "all" | "home" };
  } | null>(null);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/admin/settings", { cache: "no-store" });
        const d = await res.json();
        if (!cancelled) {
          setSettings({
            themeToggle: d?.themeToggle !== false,
            whatsapp: { enabled: !!d?.whatsapp?.enabled, number: d?.whatsapp?.number ?? "", message: d?.whatsapp?.message ?? "" },
            aiAssistant: { enabled: !!d?.aiAssistant?.enabled, widgetCode: d?.aiAssistant?.widgetCode ?? "", show: d?.aiAssistant?.show === "home" ? "home" : "all" },
          });
        }
      } catch {
        if (!cancelled) setSettings({ themeToggle: true, whatsapp: { enabled: false, number: "", message: "" }, aiAssistant: { enabled: false, widgetCode: "", show: "all" } });
      }
    }
    load();
    async function loadFooter() {
      try {
        await fetch("/api/admin/footer", { cache: "no-store" });
      } catch {}
    }
    loadFooter();
    function onUpdated(e: any) {
      const d = e?.detail;
      if (d) {
        setSettings({
          themeToggle: d?.themeToggle !== false,
          whatsapp: { enabled: !!d?.whatsapp?.enabled, number: d?.whatsapp?.number ?? "", message: d?.whatsapp?.message ?? "" },
          aiAssistant: { enabled: !!d?.aiAssistant?.enabled, widgetCode: d?.aiAssistant?.widgetCode ?? "", show: d?.aiAssistant?.show === "home" ? "home" : "all" },
        });
      }
    }
    if (typeof window !== "undefined") {
      window.addEventListener("site-settings-updated" as any, onUpdated);
    }
    return () => {
      cancelled = true;
      if (typeof window !== "undefined") {
        window.removeEventListener("site-settings-updated" as any, onUpdated);
      }
    };
  }, []);
  useEffect(() => {
    const s = settings?.aiAssistant;
    const show =
      s?.show === "home"
        ? (pathname === "/en" || pathname === "/ar" || pathname === "/")
        : s?.show === "all";
    if (s?.enabled && s.widgetCode && show) {
      const el = document.createElement("div");
      el.setAttribute("data-ai-widget", "true");
      el.innerHTML = s.widgetCode;
      document.body.appendChild(el);
      return () => {
        try {
          document.body.removeChild(el);
        } catch {}
      };
    }
  }, [settings?.aiAssistant?.enabled, settings?.aiAssistant?.widgetCode, settings?.aiAssistant?.show, pathname]);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!showLegal) return;
      setLoadingLegal(true);
      try {
        const res = await fetch("/api/admin/legal", { cache: "no-store" });
        const data = await res.json();
        const html =
          legalType === "privacy"
            ? (lang === "ar" ? data?.privacy_ar_html : data?.privacy_en_html)
            : legalType === "terms"
            ? (lang === "ar" ? data?.terms_ar_html : data?.terms_en_html)
            : (lang === "ar" ? data?.disclaimer_ar_html : data?.disclaimer_en_html);
        if (!cancelled) setLegalHTML(html || "");
      } catch {
        if (!cancelled) setLegalHTML("");
      } finally {
        if (!cancelled) setLoadingLegal(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [showLegal, legalType, lang]);
  useEffect(() => {
    function handler(e: any) {
      const typ = e?.detail?.type as "privacy" | "terms" | "disclaimer" | undefined;
      if (!typ) return;
      setLegalType(typ);
      setShowLegal(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener("open-legal" as any, handler);
      return () => window.removeEventListener("open-legal" as any, handler);
    }
  }, []);
  useEffect(() => {
    if (!newsletterOpen) return;
    const prevActive = document.activeElement as HTMLElement | null;
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setNewsletterOpen(false);
      }
      if (e.key === "Tab") {
        const dialog = document.getElementById("newsletter-dialog");
        if (!dialog) return;
        const focusable = dialog.querySelectorAll<HTMLElement>('a,button,input,textarea,select,[tabindex]:not([tabindex="-1"])');
        const list = Array.from(focusable).filter((el) => !el.hasAttribute("disabled"));
        if (list.length === 0) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      prevActive?.focus();
    };
  }, [newsletterOpen]);
  useEffect(() => {
    if (!devOpsOpen) return;
    const prevActive = document.activeElement as HTMLElement | null;
    devOpsCloseBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setDevOpsOpen(false);
      }
      if (e.key === "Tab") {
        const dialog = document.getElementById("devops-dialog");
        if (!dialog) return;
        const focusable = dialog.querySelectorAll<HTMLElement>('a,button,input,textarea,select,[tabindex]:not([tabindex="-1"])');
        const list = Array.from(focusable).filter((el) => !el.hasAttribute("disabled"));
        if (list.length === 0) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      prevActive?.focus();
    };
  }, [devOpsOpen]);
  function isValidEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }
  function sanitizePhoneNumber(v: string) {
    return v.replace(/[^\d+]/g, "");
  }
  const footerPhoneHref = `tel:${sanitizePhoneNumber(t("footerPhone"))}`;
  const devOpsWhatsappMessage = "Hello - I've seen your website and would like to create a website for myself/my company, so please contact me about this...";
  const devOpsEmailSubject = "A client from website is looking to create a website";
  const devOpsEmailBody = "Hello - I've seen your website and would like to create a website for myself/my company, so please contact me about this...";
  const devOpsWhatsappHref = `https://wa.me/971509559088?text=${encodeURIComponent(devOpsWhatsappMessage)}`;
  const devOpsEmailHref = `mailto:ahmedhussan068@gmail.com?subject=${encodeURIComponent(devOpsEmailSubject)}&body=${encodeURIComponent(devOpsEmailBody)}`;
  function trackFooterEvent(event: string, payload: Record<string, unknown>) {
    try {
      track(event, { lang, location: "footer", ...payload });
    } catch {}
  }
  async function onSubscribe() {
    const invalidMsg = t("newsletterInvalidEmail") || (lang === "ar" ? "البريد الإلكتروني غير صالح" : "Invalid email address");
    const submitErr = t("newsletterSubmitError") || (lang === "ar" ? "تعذر إتمام الاشتراك، حاول مرة أخرى." : "Subscription failed, please try again.");
    const trimmedEmail = newsletterEmail.trim();
    trackFooterEvent("newsletter_subscribe_attempt", { email: trimmedEmail });
    if (!isValidEmail(trimmedEmail)) {
      setNewsletterError(invalidMsg);
      trackFooterEvent("newsletter_subscribe_invalid", { email: trimmedEmail });
      return;
    }
    setNewsletterError("");
    setNewsletterLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });
      const ok = res.ok;
      if (!ok) {
        setNewsletterError(submitErr);
        trackFooterEvent("newsletter_subscribe_error", { email: trimmedEmail, status: res.status });
      } else {
        setNewsletterSuccessEmail(trimmedEmail);
        setNewsletterOpen(true);
        setNewsletterEmail("");
        trackFooterEvent("newsletter_subscribe_success", { email: trimmedEmail });
      }
    } catch {
      setNewsletterError(submitErr);
      trackFooterEvent("newsletter_subscribe_error", { email: trimmedEmail, status: "network_error" });
    } finally {
      setNewsletterLoading(false);
    }
  }
  const services = lang === "ar"
    ? [
        { label: "البحري", href: `${base}/services?cat=maritime` },
        { label: "التأمين", href: `${base}/services?cat=insurance` },
        { label: "التجارة", href: `${base}/services?cat=trade` },
        { label: "النزاعات", href: `${base}/services?cat=disputes` },
      ]
    : [
        { label: "Maritime", href: `${base}/services?cat=maritime` },
        { label: "Insurance", href: `${base}/services?cat=insurance` },
        { label: "Trade", href: `${base}/services?cat=trade` },
        { label: "Disputes", href: `${base}/services?cat=disputes` },
      ];
  const quick = [
    { label: t("navHome"), href: `${base}` },
    { label: t("navAbout"), href: `${base}/about` },
    { label: t("navServices"), href: `${base}/services` },
    { label: t("navCases") ?? (lang === "ar" ? "القضايا" : "Cases"), href: `${base}/cases` },
    { label: t("navNews") ?? (lang === "ar" ? "الأخبار" : "News"), href: `${base}/news` },
  ];
    const popular = lang === "ar"
    ? [
        { label: "حجز السفن", href: `${base}/services?cat=maritime` },
        { label: "استشارات التغطية", href: `${base}/services?cat=insurance` },
        { label: "التجارة والعقوبات", href: `${base}/services?cat=trade` },
      ]
    : [
        { label: "Vessel Arrests", href: `${base}/services?cat=maritime` },
        { label: "Coverage Counsel", href: `${base}/services?cat=insurance` },
        { label: "Trade & Sanctions", href: `${base}/services?cat=trade` },
      ];
  return (
    <footer className="mt-16 border-t footer-premier text-[var(--ink-primary)] border-[var(--panel-border)] dark:text-[var(--text-on-dark)] overflow-hidden">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <motion.div
          className="absolute w-80 h-80 rounded-full blur-3xl"
          style={{ background: "radial-gradient(closest-side, var(--brand-accent) 0%, transparent 70%)", opacity: 0.18, left: "-6%", top: "-8%" }}
          animate={{ x: ["0%", "6%", "0%"], y: ["0%", "5%", "0%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-3xl"
          style={{ background: "radial-gradient(closest-side, var(--brand-primary) 0%, transparent 70%)", opacity: 0.12, right: "-8%", top: "10%" }}
          animate={{ x: ["0%", "-5%", "0%"], y: ["0%", "-6%", "0%"] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      <div className="mx-auto max-w-6xl px-4 py-14 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* EN: Brand column — logo, intro, and social links */}
          {/* AR: عمود العلامة — الشعار، التعريف، وروابط التواصل الاجتماعي */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 logo-bg overflow-hidden">
                <Image src="/main_logo.svg" alt={lang === "ar" ? "الشعار" : "Logo"} width={40} height={40} className="object-contain logo-anim" />
              </div>
              <div>
                <div className="font-semibold footer-brand-name" data-edit-key="footer-brand-name">
                  {lang === "ar"
                    ? "خالد عمر"
                    : "Khaled Omer"}
                </div>
                <div className="text-xs text-[var(--brand-accent)] footer-subtitle">
                  <span data-edit-key="footer-brand-subtitle">{lang === "ar" ? "الاستشارات البحرية" : "Maritime Consultancy"}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-[var(--text-secondary)] dark:text-[color-mix(in_oklab,var(--text-on-dark),transparent_20%)] footer-copy">{t("footerIntro")}</p>
            <div className="flex items-center gap-3">
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                data-social="twitter"
                whileHover={{ y: -1.5, scale: 1.08, rotate: 0.4 }}
                whileTap={{ scale: 0.94, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="h-9 w-9 rounded-lg ring-1 ring-[var(--panel-border)] dark:ring-white/15 bg-[var(--panel-bg)] light:bg-[color-mix(in_oklab,var(--brand-primary),black_90%)] flex items-center justify-center text-[var(--ink-primary)] light:text-zinc-300 dark:text-zinc-300 hover:bg-[#1DA1F2]/90 hover:text-white"
              >
                <SocialIcon kind="twitter" />
              </motion.a>
              <motion.a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                data-social="facebook"
                whileHover={{ y: -1.5, scale: 1.08, rotate: 0.4 }}
                whileTap={{ scale: 0.94, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="h-9 w-9 rounded-lg ring-1 ring-[var(--panel-border)] dark:ring-white/15 bg-[var(--panel-bg)] light:bg-[color-mix(in_oklab,var(--brand-primary),black_90%)] flex items-center justify-center text-[var(--ink-primary)] light:text-zinc-300 dark:text-zinc-300 hover:bg-[#1877F2]/90 hover:text-white"
              >
                <SocialIcon kind="facebook" />
              </motion.a>
              <motion.a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                data-social="instagram"
                whileHover={{ y: -1.5, scale: 1.08, rotate: 0.4 }}
                whileTap={{ scale: 0.94, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="h-9 w-9 rounded-lg ring-1 ring-[var(--panel-border)] dark:ring-white/15 bg-[var(--panel-bg)] light:bg-[color-mix(in_oklab,var(--brand-primary),black_90%)] flex items-center justify-center text-[var(--ink-primary)] light:text-zinc-300 dark:text-zinc-300 hover:bg-[#E1306C]/90 hover:text-white"
              >
                <SocialIcon kind="instagram" />
              </motion.a>
              <motion.a
                href="https://www.tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                data-social="tiktok"
                whileHover={{ y: -1.5, scale: 1.08, rotate: 0.4 }}
                whileTap={{ scale: 0.94, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="h-9 w-9 rounded-lg ring-1 ring-[var(--panel-border)] dark:ring-white/15 bg-[var(--panel-bg)] light:bg-[color-mix(in_oklab,var(--brand-primary),black_90%)] flex items-center justify-center text-[var(--ink-primary)] light:text-zinc-300 dark:text-zinc-300 hover:bg-[#000000]/90 hover:text-white"
              >
                <SocialIcon kind="tiktok" />
              </motion.a>
            </div>
          </motion.div>
          {/* EN: Quick links column — site navigation shortcuts */}
          {/* AR: عمود الروابط السريعة — اختصارات الملاحة في الموقع */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            <div className="text-sm font-semibold footer-title">
              {t("footerQuick")}
            </div>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)] dark:text-[color-mix(in_oklab,var(--text-on-dark),transparent_20%)] quick-links">
              {quick.map((q, idx) => (
                <li key={q.label}>
                  <Link href={q.href} className="footer-link" data-edit-key={`footer-quick-${idx}`}>
                    {q.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-3">
              {settings?.themeToggle !== false ? (
                <div>
                  <div className="text-xs font-semibold footer-title mb-1">
                    {lang === "ar" ? "تصميم الموقع" : "Website Theme"}
                  </div>
                  <div className="inline-flex items-center rounded-full border border-[var(--panel-border)] dark:border-white/15 bg-[var(--panel-bg)] px-1 py-1 gap-1 ui-pill">
                    <button
                      aria-label={lang === "ar" ? "النظام" : "System"}
                      onClick={() => setMode("auto")}
                      aria-pressed={mode === "auto"}
                      className={"h-7 w-7 rounded-full flex items-center justify-center transition " + (mode === "auto" ? "bg-[var(--brand-accent)] text-black shadow" : "text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/10")}
                      title={lang === "ar" ? "مطابقة إعدادات النظام" : "Match system setting"}
                    >
                      <svg viewBox="0 0 24 24" className="h-[14px] w-[14px]" aria-hidden="true">
                        <path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-6l2 3H9l2-3H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 2v9h16V6H4Z"/>
                      </svg>
                    </button>
                    <button
                      aria-label={lang === "ar" ? "وضع النهار" : "Light"}
                      onClick={() => setMode("light")}
                      aria-pressed={mode === "light"}
                      className={"h-7 w-7 rounded-full flex items-center justify-center transition " + (mode === "light" ? "bg-[var(--brand-accent)] text-black shadow" : "text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/10")}
                      title={lang === "ar" ? "تفعيل الوضع الفاتح" : "Enable light mode"}
                    >
                      <svg viewBox="0 0 24 24" className="h-[14px] w-[14px]" aria-hidden="true">
                        <circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </button>
                    <button
                      aria-label={lang === "ar" ? "وضع الليل" : "Dark"}
                      onClick={() => setMode("dark")}
                      aria-pressed={mode === "dark"}
                      className={"h-7 w-7 rounded-full flex items-center justify-center transition " + (mode === "dark" ? "bg-[var(--brand-accent)] text-black shadow" : "text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/10")}
                      title={lang === "ar" ? "تفعيل الوضع الداكن" : "Enable dark mode"}
                    >
                      <svg viewBox="0 0 24 24" className="h-[14px] w-[14px]" aria-hidden="true">
                        <path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
          {/* EN: Services column — sample practice areas */}
          {/* AR: عمود الخدمات — مجالات الممارسة كمثال */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            <div className="text-sm font-semibold footer-title">
              {t("footerServices")}
            </div>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)] dark:text-[color-mix(in_oklab,var(--text-on-dark),transparent_20%)] services-list">
              {services.map((s, idx) => (
                <li key={s.label}>
                  <Link href={s.href} className="footer-link" data-edit-key={`footer-services-${idx}`}>
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-2">
              <div className="text-xs tracking-widest uppercase font-semibold footer-title">
                {lang === "ar" ? "الشائع" : "Popular"}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {popular.map((p, idx) => (
                  <Link key={p.label} href={p.href} className="rounded-lg chip px-3 py-1 text-xs dark:text-zinc-300 hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]" data-edit-key={`footer-popular-${idx}`}>
                    {p.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
          {/* EN: Contact column — address, phone, email, hours, newsletter */}
          {/* AR: عمود التواصل — العنوان، الهاتف، البريد، الساعات، والنشرة البريدية */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            <div className="text-sm font-semibold footer-title">
              {t("footerContact")}
            </div>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)] dark:text-[color-mix(in_oklab,var(--text-on-dark),transparent_20%)] contact-list">
              <li className="flex items-start gap-2">
                <span>📍</span>
                <a
                  className="footer-link"
                  href="https://maps.app.goo.gl/RZuXxXvr5b4uVrY56"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={lang === "ar" ? "افتح الموقع على خرائط Google" : "Open location in Google Maps"}
                >
                  {t("footerAddress")}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span>📞</span>
                <div className="space-y-1">
                  <a className="footer-link" href={footerPhoneHref}>{t("footerPhone")}</a>
                  <div className="text-xs text-[var(--text-secondary)]/80 dark:text-white/60">
                    {lang === "ar" ? "للتواصل السريع، اتصل بنا مباشرة على هذا الرقم." : "For quick assistance, call us directly on this number."}
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span>✉️</span>
                <a className="footer-link" href={`mailto:${t("footerEmail")}`}>{t("footerEmail")}</a>
              </li>
              <li className="flex items-start gap-2">
                <span>⏰</span>
                <span>{t("footerHours")}</span>
              </li>
            </ul>
            <div className="mt-3">
              {/* EN: Newsletter form */}
              {/* AR: نموذج النشرة البريدية */}
              <div className="text-xs font-semibold newsletter-title">
                {t("newsletterTitle")}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => {
                    setNewsletterEmail(e.target.value);
                    if (newsletterError) setNewsletterError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void onSubscribe();
                    }
                  }}
                  placeholder={t("newsletterPlaceholder")}
                  inputMode="email"
                  autoComplete="email"
                  aria-invalid={!!newsletterError}
                  aria-describedby={newsletterError ? "newsletter-error" : undefined}
                  className={"flex-1 h-10 rounded-lg px-3 text-sm bg-[var(--panel-bg)] border text-[var(--ink-primary)] dark:bg-[color-mix(in oklab,var(--brand-primary),white 10%)] dark:border-white/20 dark:text-[var(--text-on-dark)] newsletter-input " + (newsletterError ? "border-red-500 focus:outline-red-500" : "border-[var(--panel-border)]")}
                />
                <button
                  type="button"
                  onClick={() => {
                    void onSubscribe();
                  }}
                  disabled={newsletterLoading}
                  className="h-10 px-3 rounded-lg bg-[var(--brand-accent)] text-[var(--brand-primary)] text-sm hover:bg-[var(--accent-hover)] font-semibold newsletter-btn inline-flex items-center gap-2 disabled:opacity-70"
                  aria-busy={newsletterLoading}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M2 21l21-9-9 3-3 9-2.5-7.5L1 12l1 9z"/></svg>
                  <span>{t("newsletterSubscribe")}</span>
                </button>
              </div>
              <div id="newsletter-error" className="mt-1 text-xs text-red-400 min-h-4" aria-live="polite">
                {newsletterError}
              </div>
            </div>
          </motion.div>
        </div>
        {/* EN: Bottom legal bar — copyright and policies */}
        {/* AR: شريط قانوني سفلي — حقوق النشر والسياسات */}
        <div className="mt-8 border-t border-[var(--panel-border)] dark:border-white/15 pt-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[var(--text-secondary)] dark:text-[color-mix(in_oklab,var(--text-on-dark),transparent_30%)] legal-bar">
          <div className="text-center md:text-left">
            {lang === "ar" ? (
              <span>
                شركة خالد عمر للاستشارات البحرية{" "}
                <span className="font-semibold">(KOMC)</span>
                {" - تأسست عام 2010 - جميع الحقوق محفوظة © 2026 - تصميم وتطوير "}
                <button type="button" onClick={() => {
                  setDevOpsOpen(true);
                  trackFooterEvent("footer_devops_open", { source: "copyright" });
                }} className="bg-transparent p-0 text-inherit hover:underline font-semibold">
                  DevOps
                </button>
              </span>
            ) : (
              <span>
                Khaled Omar Marine Consulting Company{" "}
                <span className="font-semibold">(KOMC)</span>
                {" - Established 2010 - All rights reserved © 2026 - Designed and developed by "}
                <button type="button" onClick={() => {
                  setDevOpsOpen(true);
                  trackFooterEvent("footer_devops_open", { source: "copyright" });
                }} className="bg-transparent p-0 text-inherit hover:underline font-semibold">
                  DevOps
                </button>
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Link
              href={`${base}/privacy`}
              className="hover:underline"
              onClick={(e) => {
                e.preventDefault();
                setLegalType("privacy");
                setShowLegal(true);
              }}
            >
              {t("footerPrivacy")}
            </Link>
            <Link
              href={`${base}/terms`}
              className="hover:underline"
              onClick={(e) => {
                e.preventDefault();
                setLegalType("terms");
                setShowLegal(true);
              }}
            >
              {t("footerTerms")}
            </Link>
            <Link href={`${base}/about`} className="hover:underline" onClick={(e) => {
              e.preventDefault();
              setLegalType("disclaimer");
              setShowLegal(true);
            }}>
              {t("footerDisclaimer")}
            </Link>
          </div>
        {settings?.whatsapp?.enabled && settings.whatsapp.number ? (
          <a
            href={`https://wa.me/${encodeURIComponent(settings.whatsapp.number)}${settings.whatsapp.message ? `?text=${encodeURIComponent(settings.whatsapp.message)}` : ""}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full bg-[#25D366] text-white shadow-lg flex items-center justify-center hover:opacity-90"
            aria-label="WhatsApp"
          >
            <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden="true">
              <path fill="currentColor" d="M19.1 17.5c-.3-.1-1.8-.9-2.1-1s-.5-.1-.7.1-.8 1-.9 1.2-.3.2-.6.1c-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.4.1-.5.1-.1.3-.3.4-.4.1-.1.2-.3.3-.5.1-.2.1-.4 0-.6 0-.1-.7-1.7-1-2.3-.3-.6-.6-.5-.8-.5h-.7c-.2 0-.5.1-.7.3-.2.2-1 1-1 2.4s1.1 2.8 1.2 3c.1.2 2.1 3.2 5.1 4.4.7.3 1.3.5 1.7.6.7.2 1.3.2 1.7.1.5-.1 1.8-.7 2.1-1.4s.3-1.2.2-1.4c-.1-.2-.3-.3-.6-.4z"/>
            </svg>
          </a>
        ) : null}
        </div>
        {showLegal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" dir={lang === "ar" ? "rtl" : "ltr"}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLegal(false)} />
            <div className={"relative z-10 w-[92%] max-w-2xl rounded-2xl surface p-6 md:p-8 overflow-hidden " + (lang === "ar" ? "text-right" : "text-left")}>
              <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-accent)]/15 ring-1 ring-[var(--brand-accent)]/30 text-[var(--brand-accent)]">
                <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                  <path fill="currentColor" d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm-1 6h2v4h-2V8Zm1 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"/>
                </svg>
              </div>
              <div className="mt-3 text-2xl font-extrabold text-[var(--brand-accent)]">
                {legalType === "privacy"
                  ? (lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy")
                  : legalType === "terms"
                  ? (lang === "ar" ? "الشروط والأحكام" : "Terms of Service")
                  : (lang === "ar" ? "إخلاء المسؤولية القانونية" : "Legal Disclaimer")}
              </div>
              <div className="mx-auto mt-2 h-px w-24 bg-gradient-to-r from-transparent via-[var(--brand-accent)]/70 to-transparent" />
              <div className="mt-3 max-h-[70vh] overflow-y-auto text-sm text-white/90 space-y-3">
                {loadingLegal ? (
                  <div className="text-[var(--text-secondary)]">{lang === "ar" ? "جاري التحميل..." : "Loading..."}</div>
                ) : legalHTML ? (
                  <div
                    className={
                      "space-y-4 text-white/90 " +
                      "[&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-[var(--brand-accent)] " +
                      "[&_h4]:mt-5 [&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-[var(--brand-accent)] " +
                      "[&_ol]:list-decimal [&_ol]:space-y-2 " +
                      (lang === "ar" ? "[&_ol]:pr-5 [&_ul]:pr-5 " : "[&_ol]:pl-5 [&_ul]:pl-5 ") +
                      "[&_p]:leading-7 [&_ul]:list-disc [&_ul]:space-y-2 [&_li]:leading-7"
                    }
                    dangerouslySetInnerHTML={{ __html: legalHTML }}
                  />
                ) : (
                  <div className="text-[var(--text-secondary)]">
                    {lang === "ar"
                      ? "لا يوجد محتوى حتى الآن. يُرجى إضافته من لوحة الإدارة."
                      : "No content yet. Please add it from the Admin panel."}
                  </div>
                )}
              </div>
              <div className="sticky bottom-0 -mx-6 px-6 pt-3 pb-4 bg-gradient-to-t from-[var(--panel-bg)] via-[var(--panel-bg)]/95 to-transparent">
                <button
                  onClick={() => setShowLegal(false)}
                  className="btn-secondary mx-auto block w-[40%] max-[1024px]:w-[60%] max-[480px]:w-full max-[480px]:px-4 max-[480px]:py-4 min-h-[44px]"
                >
                  {lang === "ar" ? "إغلاق" : "Close"}
                </button>
              </div>
            </div>
          </div>
        )}
        <motion.div
          initial={{ opacity: 0 }}
          animate={devOpsOpen ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{ pointerEvents: devOpsOpen ? "auto" : "none" }}
          className="fixed inset-0 z-[10001] flex items-center justify-center"
          aria-hidden={!devOpsOpen}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDevOpsOpen(false)} />
          <motion.div
            id="devops-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="devops-title"
            aria-describedby="devops-desc"
            dir={lang === "ar" ? "rtl" : "ltr"}
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={devOpsOpen ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.98, y: 8 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className={"relative z-10 w-[92%] max-w-lg rounded-2xl surface p-6 md:p-7 " + (lang === "ar" ? "text-right" : "text-left")}
          >
            <button
              ref={devOpsCloseBtnRef}
              type="button"
              onClick={() => setDevOpsOpen(false)}
              className={"absolute top-4 rounded-full border border-[var(--panel-border)] px-2.5 py-1 text-xs text-[var(--text-secondary)] hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)] " + (lang === "ar" ? "left-4" : "right-4")}
            >
              {lang === "ar" ? "إغلاق" : "Close"}
            </button>
            <div className="pr-14">
              <div id="devops-title" className="text-2xl font-extrabold text-[var(--brand-accent)]">
                {lang === "ar" ? "DevOps" : "DevOps"}
              </div>
              <div id="devops-desc" className="mt-3 rounded-2xl border border-[var(--panel-border)] bg-[var(--panel-bg)]/70 p-4 text-sm leading-7 text-[var(--text-secondary)] dark:text-white/85">
                {lang === "ar"
                  ? "تم تصميم وتطوير هذا الموقع بواسطة DevOps كمنصة رقمية ثنائية اللغة تركز على الأداء العالي وتجربة المستخدم والهوية الاحترافية. إذا كنت ترغب في إنشاء موقع مشابه لشركتك أو نشاطك التجاري، يمكنك التواصل مباشرة عبر واتساب أو البريد الإلكتروني."
                  : "This website was designed and developed by DevOps as a tailored bilingual digital experience focused on performance, usability, and a professional brand presence. If you would like a similar website for your company or business, contact the developer directly via WhatsApp or email."}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <a
                  href={devOpsWhatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-[var(--panel-border)] bg-[var(--panel-bg)] px-4 py-3 font-semibold text-[var(--ink-primary)] transition hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)] dark:text-[var(--text-on-dark)]"
                  aria-label={lang === "ar" ? "تواصل مع المطور عبر واتساب" : "Contact the developer on WhatsApp"}
                  onClick={() => trackFooterEvent("footer_devops_whatsapp_click", { channel: "whatsapp" })}
                >
                  <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden="true">
                    <path fill="currentColor" d="M27.2 4.8A15.08 15.08 0 0 0 16.4 0C7.7 0 .6 7.1.6 15.8c0 2.8.7 5.4 2.1 7.8L0 32l8.7-2.6a15.62 15.62 0 0 0 7.5 1.9h.1c8.7 0 15.8-7.1 15.8-15.8 0-4.2-1.7-8.1-4.9-10.7Zm-10.8 24c-2.3 0-4.5-.6-6.5-1.8l-.5-.3-5.2 1.5 1.7-5.1-.3-.5a12.53 12.53 0 0 1-1.9-6.7c0-6.9 5.6-12.5 12.5-12.5 3.3 0 6.5 1.3 8.8 3.7a12.4 12.4 0 0 1 3.7 8.8c0 6.9-5.6 12.5-12.3 12.9Zm6.8-9.3c-.4-.2-2.5-1.2-2.9-1.3-.4-.1-.7-.2-1 .2-.3.4-1.1 1.3-1.3 1.5-.2.3-.5.3-.9.1-.4-.2-1.8-.7-3.4-2.1-1.2-1.1-2.1-2.4-2.4-2.9-.2-.4 0-.6.2-.8.2-.2.4-.5.6-.7.2-.2.3-.4.4-.7.1-.2.1-.5 0-.7-.1-.2-1-2.4-1.4-3.3-.4-.8-.7-.7-1-.7h-.9c-.3 0-.7.1-1 .4-.4.4-1.4 1.3-1.4 3.2 0 1.9 1.4 3.8 1.6 4 .2.3 2.8 4.3 6.9 6 1 .4 1.8.6 2.4.8 1 .3 2 .2 2.7.1.8-.1 2.5-1 2.8-1.9.4-.9.4-1.7.3-1.9-.1-.2-.4-.3-.8-.5Z" />
                  </svg>
                  <span>{lang === "ar" ? "واتساب" : "WhatsApp"}</span>
                </a>
                <a
                  href={devOpsEmailHref}
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-[var(--panel-border)] bg-[var(--panel-bg)] px-4 py-3 font-semibold text-[var(--ink-primary)] transition hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)] dark:text-[var(--text-on-dark)]"
                  aria-label={lang === "ar" ? "مراسلة المطور عبر البريد الإلكتروني" : "Email the developer"}
                  onClick={() => trackFooterEvent("footer_devops_email_click", { channel: "email" })}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                    <path fill="currentColor" d="M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 2v.2l9 6.3 9-6.3V7H3Zm18 10V9.6l-8.4 5.9a1 1 0 0 1-1.2 0L3 9.6V17h18Z" />
                  </svg>
                  <span>{lang === "ar" ? "البريد الإلكتروني" : "Email"}</span>
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={newsletterOpen ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{ pointerEvents: newsletterOpen ? "auto" : "none" }}
          className="fixed inset-0 z-[10000] flex items-center justify-center"
          aria-hidden={!newsletterOpen}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setNewsletterOpen(false)}
          />
          <motion.div
            id="newsletter-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="newsletter-title"
            aria-describedby="newsletter-desc"
            dir={lang === "ar" ? "rtl" : "ltr"}
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={newsletterOpen ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.98, y: 8 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className={"relative z-10 w-[92%] max-w-md rounded-2xl surface p-6 md:p-7 " + (lang === "ar" ? "text-right" : "text-left")}
          >
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-accent)]/15 ring-1 ring-[var(--brand-accent)]/30 text-[var(--brand-accent)]">
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm-7 9h14v2H5v-2Z"/></svg>
            </div>
            <div id="newsletter-title" className="mt-3 text-2xl font-extrabold text-[var(--brand-accent)]">
              {t("newsletterSuccessTitle")}
            </div>
            <div id="newsletter-desc" className="mt-2 text-sm text-white/90">
              {t("newsletterSuccessBody")}
              {newsletterSuccessEmail ? (
                <div className="mt-2 text-xs text-[var(--text-secondary)]">
                  {lang === "ar" ? `تم تسجيل البريد: ${newsletterSuccessEmail}` : `Subscribed email: ${newsletterSuccessEmail}`}
                </div>
              ) : null}
            </div>
            <div className="sticky bottom-0 -mx-6 px-6 pt-3 pb-4 bg-gradient-to-t from-[var(--panel-bg)] via-[var(--panel-bg)]/95 to-transparent">
              <button
                ref={closeBtnRef}
                onClick={() => setNewsletterOpen(false)}
                className="btn-secondary mx-auto block w-[40%] max-[1024px]:w-[60%] max-[480px]:w-full max-[480px]:px-4 max-[480px]:py-4 min-h-[44px]"
              >
                {lang === "ar" ? "إغلاق" : "Close"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
