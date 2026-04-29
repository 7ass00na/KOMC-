'use client';

import Image from "next/image";
import { AnimatePresence, animate, motion, useMotionValue } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { StaticImageData } from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import D01 from "./Images/D-01.jpeg";
import D02 from "./Images/D-02.jpeg";
import D03 from "./Images/D-03.jpeg";

type Slide = {
  id: string;
  title: string;
  subtitle: string;
  image: StaticImageData;
  tag: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function RippleButton({
  "aria-label": ariaLabel,
  onClick,
  className,
  children,
}: {
  "aria-label": string;
  onClick: () => void;
  className: string;
  children: React.ReactNode;
}) {
  const [ripple, setRipple] = useState<{ x: number; y: number; k: number } | null>(null);
  const hostRef = useRef<HTMLButtonElement | null>(null);

  return (
    <motion.button
      ref={hostRef}
      type="button"
      aria-label={ariaLabel}
      className={className + " relative overflow-hidden"}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => onClick()}
      onPointerDown={(e) => {
        const rect = hostRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setRipple({ x, y, k: Date.now() });
      }}
    >
      {children}
      <AnimatePresence>
        {ripple ? (
          <motion.span
            key={ripple.k}
            className="pointer-events-none absolute rounded-full bg-white/25"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 18,
              height: 18,
              translateX: "-50%",
              translateY: "-50%",
            }}
            initial={{ opacity: 0.0, scale: 0.2 }}
            animate={{ opacity: 0, scale: 12 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            onAnimationComplete={() => setRipple(null)}
          />
        ) : null}
      </AnimatePresence>
    </motion.button>
  );
}

function ArrowIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        fill="currentColor"
        d={
          dir === "left"
            ? "M15.5 5.5 9 12l6.5 6.5-1.4 1.4L6.2 12l7.9-7.9 1.4 1.4Z"
            : "M8.5 18.5 15 12 8.5 5.5l1.4-1.4L17.8 12l-7.9 7.9-1.4-1.4Z"
        }
      />
    </svg>
  );
}

export default function DemoSlider() {
  const { dir } = useLanguage();
  const isAr = dir === "rtl";
  const autoplayMs = 5000;
  const transitionMs = 650;

  const slides = useMemo<Slide[]>(
    () => [
      {
        id: "s1",
        tag: "Maritime",
        title: "UAE Maritime & Shipping Advisory",
        subtitle: "Fast turnaround. Court‑ready drafting. Outcome‑driven strategy.",
        image: D01,
      },
      {
        id: "s2",
        tag: "Corporate",
        title: "Contracts, Governance, Compliance",
        subtitle: "Protect decisions, close deals, and reduce risk before it becomes a dispute.",
        image: D02,
      },
      {
        id: "s3",
        tag: "International",
        title: "Cross‑Border Disputes & Arbitration",
        subtitle: "Evidence‑first advocacy for complex, high‑stakes matters.",
        image: D03,
      },
    ],
    []
  );

  const extended = useMemo(() => {
    if (slides.length === 0) return [];
    return [slides[slides.length - 1], ...slides, slides[0]];
  }, [slides]);

  const [index, setIndex] = useState(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [instant, setInstant] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);

  const realIndex = useMemo(() => {
    if (slides.length === 0) return 0;
    return ((index - 1) % slides.length + slides.length) % slides.length;
  }, [index, slides.length]);

  const progress = useMotionValue(0);
  const progressAnim = useRef<ReturnType<typeof animate> | null>(null);
  const pausedRef = useRef(false);
  const lastUserActionAt = useRef<number>(0);

  const resetProgress = useCallback(() => {
    progressAnim.current?.stop();
    progress.set(0);
  }, [progress]);

  const startProgress = useCallback(
    (from?: number) => {
      const startFrom = typeof from === "number" ? clamp(from, 0, 1) : 0;
      progressAnim.current?.stop();
      progress.set(startFrom);
      const remaining = 1 - startFrom;
      if (remaining <= 0) return;
      progressAnim.current = animate(progress, 1, {
        duration: (autoplayMs / 1000) * remaining,
        ease: "linear",
        onComplete: () => {
          if (pausedRef.current) return;
          setDirection(1);
          setIndex((v) => v + 1);
        },
      });
    },
    [autoplayMs, progress]
  );

  const pauseProgress = useCallback(() => {
    progressAnim.current?.stop();
  }, []);

  const resumeProgress = useCallback(() => {
    const from = progress.get();
    startProgress(from);
  }, [progress, startProgress]);

  const goNext = useCallback(() => {
    lastUserActionAt.current = Date.now();
    setDirection(1);
    setIndex((v) => v + 1);
    resetProgress();
    if (!pausedRef.current) startProgress(0);
  }, [resetProgress, startProgress]);

  const goPrev = useCallback(() => {
    lastUserActionAt.current = Date.now();
    setDirection(-1);
    setIndex((v) => v - 1);
    resetProgress();
    if (!pausedRef.current) startProgress(0);
  }, [resetProgress, startProgress]);

  const goTo = useCallback(
    (targetReal: number) => {
      lastUserActionAt.current = Date.now();
      const dir: 1 | -1 = targetReal > realIndex ? 1 : -1;
      setDirection(dir);
      setIndex(targetReal + 1);
      resetProgress();
      if (!pausedRef.current) startProgress(0);
    },
    [realIndex, resetProgress, startProgress]
  );

  useEffect(() => {
    const onVis = () => setTabHidden(document.visibilityState !== "visible");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    pausedRef.current = hovered || tabHidden;
    if (pausedRef.current) pauseProgress();
    else {
      const now = Date.now();
      if (now - lastUserActionAt.current < 250) return;
      resumeProgress();
    }
  }, [hovered, tabHidden, pauseProgress, resumeProgress]);

  useEffect(() => {
    if (pausedRef.current) return;
    startProgress(0);
    return () => progressAnim.current?.stop();
  }, [startProgress]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const tag = t?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || (t as any)?.isContentEditable) return;
      if (e.key === "ArrowLeft") (isAr ? goNext : goPrev)();
      if (e.key === "ArrowRight") (isAr ? goPrev : goNext)();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, isAr]);

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="relative">
      <div
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-[0_30px_100px_-60px_rgba(0,0,0,0.95)]"
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-24 opacity-60"
          animate={{ rotate: [0, 7, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(60% 60% at 30% 30%, rgba(191,170,104,0.24) 0%, transparent 60%), radial-gradient(60% 60% at 70% 60%, rgba(255,255,255,0.10) 0%, transparent 55%)",
            filter: "blur(24px)",
          }}
        />

        <motion.div
          className="flex w-full"
          animate={{ x: `-${index * 100}%` }}
          transition={instant ? { duration: 0 } : { duration: transitionMs / 1000, ease: [0.22, 0.95, 0.3, 1] }}
          onAnimationComplete={() => {
            if (index === 0) {
              setInstant(true);
              setIndex(slides.length);
              setTimeout(() => setInstant(false), 0);
            }
            if (index === extended.length - 1) {
              setInstant(true);
              setIndex(1);
              setTimeout(() => setInstant(false), 0);
            }
          }}
        >
          {extended.map((s, i) => {
            const active = i === index;
            return (
              <div key={`${s.id}-${i}`} className="relative h-[520px] w-full shrink-0 md:h-[560px]">
                <motion.div
                  className="absolute inset-0"
                  initial={false}
                  animate={
                    active
                      ? { scale: [1.05, 1.12], x: [0, direction * -10, 0], y: [0, 10, 0] }
                      : { scale: 1.05, x: 0, y: 0 }
                  }
                  transition={active ? { duration: 12, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
                >
                  <Image
                    src={s.image}
                    alt=""
                    aria-hidden="true"
                    fill
                    className="object-cover blur-2xl scale-110 opacity-45"
                    sizes="100vw"
                  />
                  <Image src={s.image} alt={s.title} fill priority={i === 1} className="object-contain" sizes="100vw" />
                </motion.div>

                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(0,0,0,0.86) 0%, rgba(0,0,0,0.52) 38%, rgba(0,0,0,0.18) 70%, rgba(0,0,0,0.0) 100%), radial-gradient(120% 120% at 80% 30%, rgba(191,170,104,0.24) 0%, transparent 55%)",
                  }}
                />

                <div className="absolute inset-0 px-6 py-7 md:px-10 md:py-10">
                  <div className={["mx-auto flex h-full w-full max-w-6xl items-end", isAr ? "justify-end" : "justify-start"].join(" ")}>
                    <div className={["max-w-2xl", isAr ? "text-right" : "text-left"].join(" ")}>
                      <div
                        className={[
                          "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-widest text-white/85 backdrop-blur",
                          isAr ? "flex-row-reverse" : "",
                        ].join(" ")}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-accent)]" />
                        <span>{s.tag}</span>
                      </div>

                      <AnimatePresence mode="wait" initial={false}>
                        {active ? (
                          <motion.div
                            key={s.id}
                            initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
                            transition={{ duration: 0.45, ease: "easeOut" }}
                            className="mt-4"
                          >
                            <motion.h2
                              className="text-3xl font-extrabold leading-tight text-white md:text-5xl"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.18, duration: 0.5, ease: "easeOut" }}
                            >
                              {s.title}
                            </motion.h2>
                            <motion.p
                              className="mt-3 text-[15px] leading-7 text-white/80 md:text-[17px]"
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.28, duration: 0.55, ease: "easeOut" }}
                            >
                              {s.subtitle}
                            </motion.p>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0">
          <div className="h-1 bg-white/10">
            <motion.div
              className="h-full origin-left bg-gradient-to-r from-[var(--brand-accent)] via-[color-mix(in_oklab,var(--brand-accent),white_20%)] to-white/80"
              style={{ scaleX: progress }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-40"
              style={{
                background:
                  "repeating-linear-gradient(90deg, rgba(0,0,0,0.35) 0px, rgba(0,0,0,0.35) 1px, transparent 1px, transparent 12%)",
              }}
            />
          </div>
        </div>

        <div className="absolute inset-y-0 left-3 right-3 flex items-center justify-between md:left-5 md:right-5">
          <RippleButton
            aria-label={isAr ? "Next slide" : "Previous slide"}
            onClick={isAr ? goNext : goPrev}
            className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-black/40 text-white/90 backdrop-blur transition-colors hover:bg-black/55 hover:text-white"
          >
            <ArrowIcon dir={isAr ? "right" : "left"} />
          </RippleButton>

          <RippleButton
            aria-label={isAr ? "Previous slide" : "Next slide"}
            onClick={isAr ? goPrev : goNext}
            className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-black/40 text-white/90 backdrop-blur transition-colors hover:bg-black/55 hover:text-white"
          >
            <ArrowIcon dir={isAr ? "left" : "right"} />
          </RippleButton>
        </div>

        <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2.5">
          {slides.map((_, i) => {
            const active = i === realIndex;
            return (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
                className="group pointer-events-auto grid h-7 w-7 place-items-center"
              >
                <motion.span
                  className={[
                    "block rounded-full transition-colors",
                    active ? "bg-[var(--brand-accent)]" : "bg-transparent border border-white/35",
                  ].join(" ")}
                  initial={false}
                  animate={{ width: active ? 10 : 8, height: active ? 10 : 8, scale: active ? 1.3 : 1 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className={["mt-5 flex items-center justify-between text-xs text-white/55", isAr ? "flex-row-reverse" : ""].join(" ")}>
        <div className="tracking-widest uppercase">Autoplay {pausedRef.current ? "Paused" : "On"}</div>
        <div className="tracking-widest uppercase">{String(realIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</div>
      </div>
    </div>
  );
}
