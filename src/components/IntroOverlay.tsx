"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";

export default function IntroOverlay() {
  const { lang } = useLanguage();
  const [mode, setMode] = useState<"video" | "welcome" | "hidden">("video");
  const [muted, setMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const vidRef = useRef<HTMLVideoElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const ts = Number(localStorage.getItem("komc_intro_ts") || 0);
      const now = Date.now();
      if (ts && now - ts < 24 * 60 * 60 * 1000) {
        setMode("hidden");
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const isSmall = window.matchMedia("(max-width: 768px)").matches;
        setShowControls(isSmall);
      } catch {}
    }
  }, []);

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
      const duration = 1200;
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
              preload="metadata"
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
              <source src="/videos/komc.webm" type="video/webm" />
              <source src="/videos/komc.mp4" type="video/mp4" />
              <source src="/videos/komc-intro.mp4" type="video/mp4" />
              <source src="/videos/komc.ogv" type="video/ogg" />
              <track kind="captions" />
              Sorry, your browser doesn’t support embedded videos. 
              {lang === "ar" ? "عذرًا، متصفحك لا يدعم تشغيل الفيديو المضمن." : "Please update your browser to view this content."}
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70 pointer-events-none" />
          </div>
          <div className="absolute top-3 right-3 z-[1001]" style={{ insetInlineEnd: "0.75rem", insetBlockStart: "0.75rem" }}>
            <div className="flex items-center gap-3">
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
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 md:p-6">
            <div className="inline-flex items-center gap-2">
              <div className="relative h-8 w-8">
                <Image src="/icon.svg" alt="KOMC" fill sizes="32px" className="object-contain" />
              </div>
              <span className="text-xs md:text-sm font-semibold text-white/80" dir={lang === "ar" ? "rtl" : "ltr"}>
                {lang === "ar" ? "شركة خالد عمر للاستشارات البحرية والقانونية" : "Khaled Omar Maritime & Legal Consulting Company"}
              </span>
            </div>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0 grid place-items-center p-4"
          dir={lang === "ar" ? "rtl" : "ltr"}
        >
          <div className="w-full max-w-4xl rounded-2xl surface p-6 md:p-8">
            <div className={"flex items-center gap-6 max-[600px]:flex-col " + (lang === "ar" ? "text-right" : "text-left")}>
              <div className="basis-[30%] max-[600px]:basis-full grid place-items-center">
                <div className="relative w-full max-w-[240px] aspect-square rounded-xl overflow-hidden ring-1 ring-[var(--panel-border)]">
                  <Image
                    src="/images/team/khaled-omer.png"
                    alt={lang === "ar" ? "المدير التنفيذي" : "CEO"}
                    fill
                    sizes="(max-width: 600px) 240px, 240px"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
              <div className="basis-[70%] max-[600px]:basis-full">
                <div className="text-2xl md:text-3xl font-extrabold text-[var(--brand-accent)]">
                  {lang === "ar" ? "مرحبًا بكم في خالد عمر للاستشارات البحرية والقانونية" : "Welcome to Khaled Omer Maritime & Legal Consultancy"}
                </div>
                <div className="mt-3 text-sm md:text-base text-[var(--text-secondary)]">
                  {lang === "ar"
                    ? "نقدّم خبرة دقيقة في القانون البحري والعقود والنزاعات عبر دولة الإمارات، مع التزام كامل بالجودة والسرعة."
                    : "We deliver precise expertise in maritime law, contracts, and disputes across the UAE, with an uncompromising focus on quality and speed."}
                </div>
                <div className="mt-6">
                  <button
                    onClick={() => {
                      try {
                        const dur = 1200;
                        window.dispatchEvent(new CustomEvent("site-loading", { detail: { duration: dur } }) as any);
                        router.push(lang === "ar" ? "/ar" : "/en");
                        setTimeout(() => {
                          setMode("hidden");
                        }, dur + 50);
                      } catch {
                        router.push(lang === "ar" ? "/ar" : "/en");
                        setMode("hidden");
                      }
                    }}
                    className="mx-auto block w-[40%] max-[1024px]:w-[60%] max-[480px]:w-full max-[480px]:px-4 max-[480px]:py-4 min-h-[44px] rounded-lg bg-[var(--brand-accent)] text-[var(--brand-primary)] font-semibold shadow hover:opacity-90"
                  >
                    {lang === "ar" ? "الانتقال إلى الصفحة الرئيسية" : "Move to Homepage"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
