"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";

type Source = { src: string; type: string };

export default function AboutHero({
  title,
  subtitle,
  sources,
  poster,
  isRTL = false,
  overlay = "strong",
  kicker,
  kickerVariant = "filled",
}: {
  title: string;
  subtitle: string;
  sources: Source[];
  poster?: string;
  isRTL?: boolean;
  overlay?: "none" | "soft" | "medium" | "strong";
  kicker?: string;
  kickerVariant?: "filled" | "outline";
}) {
  const vidRef = useRef<HTMLVideoElement | null>(null);
  const prefersReduced = useReducedMotion();
  useEffect(() => {
    const v = vidRef.current;
    if (!v) return;
    const setRate = () => {
      try {
        v.playbackRate = 0.75;
      } catch {}
    };
    v.addEventListener("canplay", setRate, { once: true });
    return () => v.removeEventListener("canplay", setRate);
  }, []);
  const variants = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };
  const scrimClass = useMemo(() => {
    switch (overlay) {
      case "none":
        return "absolute inset-0";
      case "soft":
        return "absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-black/50 md:from-black/30 md:via-black/20 md:to-black/45";
      case "medium":
        return "absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/65 md:from-black/40 md:via-black/30 md:to-black/60";
      default:
        return "absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80 md:from-black/55 md:via-black/45 md:to-black/75";
    }
  }, [overlay]);
  return (
    <section className="relative isolate overflow-hidden" aria-label={isRTL ? "فيديو خلفي لفريق قانوني" : "Background video of legal team"}>
      <div className="absolute inset-0 -z-10">
        <video
          ref={vidRef}
          className="h-full w-full object-cover object-center opacity-60"
          autoPlay={!prefersReduced}
          loop
          muted
          playsInline
          poster={poster}
          aria-label={isRTL ? "لقطات اجتماع محامين بالحركة البطيئة" : "Slow-motion meeting of lawyers"}
        >
          {sources.map((s) => (
            <source key={s.src} src={s.src} type={s.type} />
          ))}
        </video>
        <div className={scrimClass} />
      </div>
      <div className="mx-auto max-w-6xl px-5 py-24 md:py-32 min-h-[70vh] md:min-h-[78vh] flex items-center">
        <div className={`w-full ${isRTL ? "text-right ml-auto" : "text-left"}`}>
          {kicker ? (
            <div
              className={
                "inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs uppercase tracking-widest font-semibold mb-3 " +
                (kickerVariant === "outline"
                  ? "border border-[var(--brand-accent)] text-[var(--brand-accent)]"
                  : "bg-[var(--brand-accent)] text-[var(--brand-primary)]")
              }
            >
              <span data-edit-key="about-hero-kicker">{kicker}</span>
            </div>
          ) : null}
        <motion.h1
          initial="hidden"
          animate="show"
          variants={variants}
          transition={{ duration: 0.5 }}
          className={`text-4xl md:text-6xl font-extrabold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] ${isRTL ? "text-right" : "text-left"}`}
        >
          <span data-edit-key="about-hero-title">{title}</span>
        </motion.h1>
        <motion.p
          initial="hidden"
          animate="show"
          variants={variants}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`mt-3 md:mt-4 text-sm md:text-xl text-zinc-200 max-w-3xl drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)] ${isRTL ? "ml-auto text-right" : "text-left"}`}
        >
          <span data-edit-key="about-hero-subtitle">{subtitle}</span>
        </motion.p>
        </div>
      </div>
    </section>
  );
}
