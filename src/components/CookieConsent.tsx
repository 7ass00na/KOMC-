'use client';
import { useLanguage } from "@/context/LanguageContext";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function CookieConsent() {
  const { lang } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState<boolean>(true);
  const timerElapsedRef = useRef(false);
  const activitySeenRef = useRef(false);
  const shownRef = useRef(false);
  const isAr = lang === "ar";
  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    function markActivity() {
      activitySeenRef.current = true;
      if (!visible && timerElapsedRef.current) maybeShow();
    }
    function maybeShow() {
      if (cancelled) return;
      if (shownRef.current) return;
      const consent = localStorage.getItem("cookieConsent");
      const sess = sessionStorage.getItem("cookieConsentShown");
      if (consent) return;
      if (sess === "1") return;
      if (!activitySeenRef.current) return;
      shownRef.current = true;
      sessionStorage.setItem("cookieConsentShown", "1");
      setVisible(true);
    }
    async function init() {
      try {
        const res = await fetch("/api/admin/settings", { cache: "no-store" });
        const d = await res.json();
        if (!cancelled) setEnabled(d?.cookiesEnabled !== false);
      } catch {
        if (!cancelled) setEnabled(true);
      }
      const hasConsent = localStorage.getItem("cookieConsent");
      const sess = sessionStorage.getItem("cookieConsentShown");
      if (hasConsent || sess === "1") return;
      try {
        if (timer) clearTimeout(timer);
      } catch {}
      timer = setTimeout(() => {
        timerElapsedRef.current = true;
        maybeShow();
      }, 30000);
    }
    init();
    function onUpdated(e: any) {
      const d = e?.detail;
      if (d) setEnabled(d?.cookiesEnabled !== false);
    }
    window.addEventListener("site-settings-updated" as any, onUpdated);
    window.addEventListener("mousemove", markActivity, { passive: true });
    window.addEventListener("scroll", markActivity, { passive: true });
    window.addEventListener("click", markActivity, true);
    window.addEventListener("keydown", markActivity, true);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      window.removeEventListener("site-settings-updated" as any, onUpdated);
      window.removeEventListener("mousemove", markActivity as any);
      window.removeEventListener("scroll", markActivity as any);
      window.removeEventListener("click", markActivity as any, true);
      window.removeEventListener("keydown", markActivity as any, true);
    };
  }, []);
  const accept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    sessionStorage.setItem("cookieConsentShown", "1");
    setVisible(false);
  };
  const reject = () => {
    localStorage.setItem("cookieConsent", "rejected");
    sessionStorage.setItem("cookieConsentShown", "1");
    setVisible(false);
  };
  const openPrivacy = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-legal", { detail: { type: "privacy" } }));
    }
  };
  if (!enabled) return null;
  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 z-[60] pointer-events-none">
          <div className="absolute inset-0" />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className={[
              "pointer-events-auto absolute bottom-6 left-6 right-6 md:max-w-xl",
              isAr ? "md:left-6 md:right-auto" : "md:right-6 md:left-auto",
            ].join(" ")}
            dir={isAr ? "rtl" : "ltr"}
          >
            <div className="rounded-2xl surface shadow-xl ring-1 ring-black/5 dark:ring-white/10 p-5 md:p-6 backdrop-blur-md bg-white/80 dark:bg-[color-mix(in_oklab,var(--brand-primary),black_80%)]">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <div className="text-base font-semibold text-[var(--brand-accent)]">
                    {isAr ? "نستخدم ملفات تعريف الارتباط لتحسين تجربتك" : "We use cookies to enhance your experience"}
                  </div>
                  <div className="mt-1 text-sm text-[var(--text-secondary)]">
                    {isAr ? (
                      <>بمتابعتك التصفح، فإنك توافق على <button onClick={openPrivacy} className="underline hover:text-[var(--brand-accent)]">سياسة الخصوصية</button>.</>
                    ) : (
                      <>By continuing, you agree to our <button onClick={openPrivacy} className="underline hover:text-[var(--brand-accent)]">Privacy Policy</button>.</>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 md:w-64">
                  <button
                    onClick={reject}
                    className="h-10 rounded-xl border border-[var(--panel-border)] text-[var(--ink-primary)] bg-white hover:bg-[var(--panel-bg)] dark:bg-transparent dark:text-[var(--text-on-dark)]"
                  >
                    {isAr ? "رفض" : "Reject"}
                  </button>
                  <button
                    onClick={accept}
                    className="h-10 rounded-xl bg-[var(--brand-accent)] text-[var(--brand-primary)] font-semibold hover:bg-[var(--accent-hover)]"
                  >
                    {isAr ? "قبول" : "Accept"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
