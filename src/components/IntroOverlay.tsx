"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import WelcomingMessage from "./WelcomingMessage";
import styles from "./welcome-card.module.css";
import { deriveLabels, track, type WelcomeLabels } from "@/lib/welcomeLabels";

export default function IntroOverlay() {
  const { lang } = useLanguage();
  const [mode, setMode] = useState<"pre" | "video" | "welcome" | "hidden">("pre");
  const [muted, setMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const vidRef = useRef<HTMLVideoElement | null>(null);
  const router = useRouter();
  const [labels, setLabels] = useState<WelcomeLabels | null>(null);
  const [selectedLang, setSelectedLang] = useState<"ar" | "en">(lang);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const msgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const ts = Number(localStorage.getItem("komc_intro_ts") || 0);
      const now = Date.now();
      if (ts && now - ts < 24 * 60 * 60 * 1000) {
        setMode("hidden");
      } else {
        const dur = 2000;
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("site-loading", { detail: { duration: dur } }) as any);
        }
        const t = setTimeout(() => {
          setMode("video");
        }, dur + 50);
        return () => clearTimeout(t);
      }
    } catch {}
  }, []);

  useEffect(() => {
    // Use custom controls for consistent UI and translation; keep native controls off
    setShowControls(false);
  }, []);

  useEffect(() => {
    try {
      const l = deriveLabels(lang);
      setLabels(l);
    } catch {
      setLabels({
        welcomeType: "new_visitor",
        userRole: "consumer",
        actionRequired: "cta_home",
        variant: "A",
        lang,
      });
    }
  }, [lang]);

  useEffect(() => {
    const v = vidRef.current;
    if (mode !== "video" || !v) return;
    let retryTimer: ReturnType<typeof setInterval> | null = null;
    const targetRate = 0.75;
    const applyRate = () => {
      try {
        v.playbackRate = targetRate;
      } catch {}
    };
    const ensureRate = () => {
      if (!v) return;
      if (Math.abs(v.playbackRate - targetRate) > 0.01) applyRate();
    };
    const onLoadedMeta = () => {
      ensureRate();
      try { v.muted = true; v.play()?.catch(() => {}); } catch {}
    };
    const onCanPlay = () => {
      ensureRate();
      try { v.muted = true; v.play()?.catch(() => {}); } catch {}
    };
    const onPlay = () => ensureRate();
    const onRateChange = () => ensureRate();
    const onPlayStart = () => {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("intro-video-start"));
      }
      ensureRate();
    };
    v.addEventListener("loadedmetadata", onLoadedMeta);
    v.addEventListener("canplay", onCanPlay);
    v.addEventListener("play", onPlayStart);
    v.addEventListener("ratechange", onRateChange);
    // Retry a few times to accommodate Safari/iOS quirks
    retryTimer = setInterval(() => {
      ensureRate();
    }, 250);
    setTimeout(() => {
      if (retryTimer) {
        clearInterval(retryTimer);
        retryTimer = null;
      }
    }, 2500);
    const timer = setTimeout(() => {
      if (v.readyState < 2) {
        // video not ready → fail safe to skip
        endIntro();
      }
    }, 5000);
    return () => {
      clearTimeout(timer);
      if (retryTimer) clearInterval(retryTimer);
      v.removeEventListener("loadedmetadata", onLoadedMeta);
      v.removeEventListener("canplay", onCanPlay);
      v.removeEventListener("play", onPlayStart);
      v.removeEventListener("ratechange", onRateChange);
    };
    // Safety timeout: if video doesn't end within a reasonable time, proceed
    const safety = setTimeout(() => {
      endIntro();
    }, 15000);
    return () => {
      if (retryTimer) clearInterval(retryTimer);
      clearTimeout(safety);
    };
  }, [mode]);

  useEffect(() => {
    try {
      if (mode !== "hidden") {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    } catch {}
    return () => {
      try {
        document.body.style.overflow = "";
      } catch {}
    };
  }, [mode]);

  useEffect(() => {
    const el = msgRef.current || cardRef.current;
    if (!el) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      try {
        el.style.setProperty("--welcomeFade", "1");
        el.style.setProperty("--welcomeShift", "0px");
      } catch {}
      return;
    }
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        try {
          const st = el.scrollTop || 0;
          const thresh = Math.max(120, Math.floor((el.clientHeight || 1) * 0.3));
          const fade = Math.max(0, Math.min(1, 1 - st / thresh));
          const shift = -Math.min(24, st * 0.15);
          el.style.setProperty("--welcomeFade", fade.toFixed(3));
          el.style.setProperty("--welcomeShift", `${shift.toFixed(2)}px`);
        } finally {
          ticking = false;
        }
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll as any);
  }, [mode]);

  const endIntro = () => {
    try {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("intro-video-stop"));
        window.dispatchEvent(new Event("site-loading-cancel") as any);
      }
      try {
        const now = Date.now();
        localStorage.setItem("komc_intro_ts", String(now));
        document.cookie = `komc_intro_ts=${now}; max-age=${24 * 60 * 60}; path=/; samesite=lax`;
      } catch {}
      const duration = 2000;
      if (typeof document !== "undefined") {
        document.body.setAttribute("data-intro-state", "transitioning");
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("site-loading", { detail: { duration, welcome: false } }) as any);
      }
      setTimeout(() => {
        try {
          if (typeof document !== "undefined") {
            document.body.setAttribute("data-intro-state", "ready");
          }
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("intro-transition-complete"));
          }
        } catch {}
        setMode("welcome");
      }, duration + 50);
    } catch {}
  };

  if (mode === "hidden") return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-black"
      role="dialog"
      aria-label={lang === "ar" ? "مقدمة الموقع" : "Site introduction"}
    >
      {mode === "video" ? (
        <>
          <div className="absolute inset-0">
            <video
              ref={vidRef}
              className="intro-video h-full w-full"
              autoPlay
              preload="auto"
              controls={showControls}
              controlsList="nodownload noplaybackrate"
              loop={false}
              muted={muted}
              playsInline
              onEnded={endIntro}
              onError={endIntro}
              onStalled={endIntro}
              poster="/images/about-hero-poster.jpg"
            >
              <source src="/videos/Komc.mp4" type="video/mp4" />
              <source src="/videos/about-hero.webm" type="video/webm" />
              <track kind="captions" />
              Sorry, your browser doesn’t support embedded videos. 
              {lang === "ar" ? "عذرًا، متصفحك لا يدعم تشغيل الفيديو المضمن." : "Please update your browser to view this content."}
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70 pointer-events-none" />
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 md:p-6" dir={lang === "ar" ? "rtl" : "ltr"}>
            <div className="inline-flex items-center gap-2 flex-1">
              <div className="relative h-8 w-8 logo-bg overflow-hidden">
                <Image src="/main_logo.svg" alt={lang === "ar" ? "الشعار الرئيسي" : "Main Logo"} fill sizes="32px" className="object-contain logo-anim" />
              </div>
              <span className="text-xs md:text-sm font-semibold text-white/80" dir={lang === "ar" ? "rtl" : "ltr"}>
                {lang === "ar" ? "شركة خالد عمر للاستشارات البحرية والقانونية" : "Khaled Omar Maritime & Legal Consulting Company"}
              </span>
            </div>
            <div className="inline-flex items-center gap-3">
              <button
                onClick={() => setMuted((m) => !m)}
                className="rounded-lg border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/15 min-h-[36px]"
                aria-label={lang === "ar" ? (muted ? "تشغيل الصوت" : "كتم الصوت") : (muted ? "Unmute" : "Mute")}
              >
                {lang === "ar" ? (muted ? "تشغيل الصوت" : "كتم الصوت") : muted ? "Unmute" : "Mute"}
              </button>
              <button
                onClick={endIntro}
                className="rounded-lg bg-[var(--brand-accent)] px-3 py-1.5 text-xs font-semibold text-black hover:opacity-90 min-h-[36px]"
                aria-label={lang === "ar" ? "تخطي المقدمة" : "Skip intro"}
              >
                {lang === "ar" ? "تخطي المقدمة" : "Skip Intro"}
              </button>
            </div>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0 overflow-y-auto"
          dir={lang === "ar" ? "rtl" : "ltr"}
        >
          <div className="min-h-[100svh] grid place-items-center py-6 md:py-8 px-4 max-[480px]:px-6">
          <div ref={cardRef} className="w-full max-w-5xl lg:max-w-6xl rounded-2xl surface p-6 md:p-8 max-h-[calc(100svh-96px)] md:max-h-[calc(100svh-128px)] overflow-hidden" data-intro-overlay>
            <div className={"flex items-center gap-6 lg:gap-8 max-[480px]:gap-4 max-[1024px]:flex-col " + (lang === "ar" ? "text-right" : "text-left")}>
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className={`md:basis-[36%] lg:basis-[38%] max-[1024px]:basis-full grid place-items-center self-stretch ${styles.stickyMedia}`}
              >
                <div className="relative w-full max-w-none max-[1024px]:aspect-[4/3] md:h-full md:max-w-none rounded-xl overflow-hidden ring-1 ring-[var(--panel-border)] shadow-sm">
                  <Image
                    src="/images/team/khaled-omer.png"
                    alt={selectedLang === "ar" ? "المدير التنفيذي" : "CEO"}
                    fill
                    sizes="(max-width: 480px) 100vw, (max-width: 1024px) 90vw, 480px"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="block max-[1024px]:mt-4 w-full hidden max-[1024px]:block sticky top-[calc(100%+0.5rem)]">
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--brand-accent)]/60 to-transparent" />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut", delay: 0.12 }}
                className={`md:basis-[64%] lg:basis-[62%] max-[1024px]:basis-full ${styles.scrollPane}`}
                ref={msgRef}
              >
                {labels && (
                  <>
                    {(() => {
                      try {
                        track("welcome_impression", labels);
                      } catch {}
                      return null;
                    })()}
                    <WelcomingMessage
                      lang={selectedLang}
                      labels={labels}
                      labelsReady={true}
                      onPrimary={() => {
                        try {
                          const target = selectedLang === "ar" ? "ar" : "en";
                          document.cookie = `site_lang=${target}; max-age=${60 * 60 * 24 * 365}; path=/; samesite=lax`;
                          if (typeof window !== "undefined") localStorage.setItem("site_lang", target);
                        } catch {}
                        try {
                          track("welcome_cta_click", labels);
                        } catch {}
                        try {
                          const dur = 2000;
                          window.dispatchEvent(new CustomEvent("site-loading", { detail: { duration: dur } }) as any);
                          setTimeout(() => {
                            router.push(selectedLang === "ar" ? "/ar" : "/en");
                            setMode("hidden");
                          }, dur + 20);
                        } catch {
                          router.push(selectedLang === "ar" ? "/ar" : "/en");
                          setMode("hidden");
                        }
                      }}
                      onChangeLang={(next) => {
                        setSelectedLang(next);
                      }}
                    />
                    <div className="scroll-hint max-[1024px]:block hidden" />
                  </>
                )}
              </motion.div>
            </div>
          </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
