"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export default function IntroOverlay() {
  const { lang } = useLanguage();
  const [show, setShow] = useState<boolean>(true);
  const [muted, setMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const vidRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    try {
      const ts = Number(localStorage.getItem("komc_intro_ts") || 0);
      const now = Date.now();
      if (ts && now - ts < 24 * 60 * 60 * 1000) {
        setShow(false);
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
    if (!show || !v) return;
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
  }, [show]);

  const endIntro = () => {
    try {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("intro-video-stop"));
      }
      try {
        const now = Date.now();
        localStorage.setItem("komc_intro_ts", String(now));
        document.cookie = `komc_intro_ts=${now}; max-age=${24 * 60 * 60}; path=/; samesite=lax`;
      } catch {}
      const duration = 2500;
      if (typeof document !== "undefined") {
        document.body.setAttribute("data-intro-state", "transitioning");
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("site-loading", { detail: { duration, welcome: true, lang } }) as any);
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
      }, duration + 50);
    } catch {}
    setShow(false);
  };

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-black"
      role="dialog"
      aria-label={lang === "ar" ? "مقدمة الموقع" : "Site introduction"}
    >
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
      <div className="absolute inset-0 flex items-end justify-between p-4 md:p-6">
        <div className="inline-flex items-center gap-2">
          <div className="relative h-8 w-8">
            <Image src={lang === "ar" ? "/icon.svg" : "/favicon.ico"} alt="KOMC" fill sizes="32px" className="object-contain" />
          </div>
          <span className="text-xs md:text-sm font-semibold text-white/80" dir={lang === "ar" ? "rtl" : "ltr"}>
            {lang === "ar" ? "شركة خالد عمر للاستشارات البحرية والقانونية" : "Khaled Omar Maritime & Legal Consulting Company"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMuted((m) => !m)}
            className="rounded-lg border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/15"
            aria-label={lang === "ar" ? (muted ? "تشغيل الصوت" : "كتم الصوت") : (muted ? "Unmute" : "Mute")}
          >
            {lang === "ar" ? (muted ? "تشغيل الصوت" : "كتم الصوت") : muted ? "Unmute" : "Mute"}
          </button>
          <button
            onClick={endIntro}
            className="rounded-lg bg-[var(--brand-accent)] px-3 py-1.5 text-xs font-semibold text-black hover:opacity-90"
            aria-label={lang === "ar" ? "تخطي المقدمة" : "Skip intro"}
          >
            {lang === "ar" ? "تخطي المقدمة" : "Skip Intro"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
