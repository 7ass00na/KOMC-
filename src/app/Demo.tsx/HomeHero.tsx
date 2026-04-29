'use client';

import Image, { type StaticImageData } from "next/image";
import { AnimatePresence, animate, motion, useMotionValue } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import maritimeImg from "@/app/Demo.tsx/Images/Admiralty01.jpg";

export interface SlideData {
  id: number;
  image: string | StaticImageData;
  title: string;
  subtitle: string;
  description: string;
  category: string;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function Chevron({ dir }: { dir: "left" | "right" }) {
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

export default function HomeHero({
  slides,
  autoplayMs = 8000,
}: {
  slides?: SlideData[];
  autoplayMs?: number;
}) {
  const { dir } = useLanguage();
  const isAr = dir === "rtl";
  const data = useMemo<SlideData[]>(
    () =>
      slides ?? [
        {
          id: 1,
          category: "KOMC · LEGAL & MARITIME",
          title: "ADMIRALTY",
          subtitle: "Claims, Arrests, Detention",
          description:
            "From vessel arrests to urgent injunctions, we act fast when time and leverage matter most. Evidence‑first strategy, crisp drafting, and decisive steps to protect your position.",
          image: maritimeImg,
        },
        {
          id: 2,
          category: "UAE · SHIPPING & TRADE",
          title: "CHARTER PARTY",
          subtitle: "Charters, Bills, Cargo",
          description:
            "Commercial shipping disputes handled with pragmatic speed—demurrage, off‑hire, laytime, cargo claims, and bill of lading issues. Clear positions, tight timelines, strong outcomes.",
          image: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=2400&q=85",
        },
        {
          id: 3,
          category: "RISK · COMPLIANCE · GOVERNANCE",
          title: "CONTRACTS",
          subtitle: "Drafting, Review, Negotiation",
          description:
            "Court‑ready drafting for maritime and corporate agreements—clear obligations, enforceable remedies, and smart risk allocation. Built to prevent disputes before they start.",
          image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=2400&q=85",
        },
        {
          id: 4,
          category: "DISPUTES · ARBITRATION · ENFORCEMENT",
          title: "ARBITRATION",
          subtitle: "Strategy, Evidence, Advocacy",
          description:
            "Cross‑border disputes handled with disciplined case theory and high‑quality submissions. We manage evidence, experts, and hearings with a focus on enforceable results.",
          image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=2400&q=85",
        },
        {
          id: 5,
          category: "INSURANCE · P&I · RECOVERY",
          title: "P&I",
          subtitle: "Coverage, Liability, Recovery",
          description:
            "Advisory and claims support for insurers, P&I clubs, and operators—fast incident response, liability analysis, and recovery strategy aligned to your commercial reality.",
          image: "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?auto=format&fit=crop&w=2400&q=85",
        },
      ],
    [slides]
  );

  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);

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
          setActive((v) => mod(v + 1, data.length));
        },
      });
    },
    [autoplayMs, data.length, progress]
  );

  const pause = useCallback(() => {
    progressAnim.current?.stop();
  }, []);

  const resume = useCallback(() => {
    const from = progress.get();
    startProgress(from);
  }, [progress, startProgress]);

  const goTo = useCallback(
    (next: number) => {
      if (data.length === 0) return;
      lastUserActionAt.current = Date.now();
      const dir: 1 | -1 = next === active ? 1 : next > active ? 1 : -1;
      setDirection(dir);
      setActive(mod(next, data.length));
      resetProgress();
      if (!pausedRef.current) startProgress(0);
    },
    [active, data.length, resetProgress, startProgress]
  );

  const next = useCallback(() => {
    if (data.length === 0) return;
    lastUserActionAt.current = Date.now();
    setDirection(1);
    setActive((v) => mod(v + 1, data.length));
    resetProgress();
    if (!pausedRef.current) startProgress(0);
  }, [data.length, resetProgress, startProgress]);

  const prev = useCallback(() => {
    if (data.length === 0) return;
    lastUserActionAt.current = Date.now();
    setDirection(-1);
    setActive((v) => mod(v - 1, data.length));
    resetProgress();
    if (!pausedRef.current) startProgress(0);
  }, [data.length, resetProgress, startProgress]);

  useEffect(() => {
    const onVis = () => setTabHidden(document.visibilityState !== "visible");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    pausedRef.current = hovered || tabHidden || dragging;
    if (pausedRef.current) pause();
    else {
      const now = Date.now();
      if (now - lastUserActionAt.current < 250) return;
      resume();
    }
  }, [dragging, hovered, pause, resume, tabHidden]);

  useEffect(() => {
    if (pausedRef.current || data.length === 0) return;
    startProgress(0);
    return () => progressAnim.current?.stop();
  }, [data.length, startProgress]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const tag = t?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || (t as any)?.isContentEditable) return;
      if (e.key === "ArrowLeft") (isAr ? next : prev)();
      if (e.key === "ArrowRight") (isAr ? prev : next)();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isAr, next, prev]);

  const activeSlide = data[active];

  return (
    <div
      dir={isAr ? "rtl" : "ltr"}
      className="relative h-[100vh] w-full bg-black text-white overflow-hidden"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <motion.div
        className="absolute inset-0 [touch-action:pan-y] cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        dragMomentum={false}
        onDragStart={() => setDragging(true)}
        onDragEnd={(_, info) => {
          setDragging(false);
          const swipeDir = isAr ? -1 : 1;
          const offsetX = info.offset.x * swipeDir;
          const velocityX = info.velocity.x * swipeDir;
          if (offsetX <= -80 || velocityX <= -500) next();
          else if (offsetX >= 80 || velocityX >= 500) prev();
        }}
      />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeSlide?.id}
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1.0 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.75, ease: [0.22, 0.95, 0.3, 1] }}
        >
          <motion.div
            className="absolute -inset-px"
            initial={false}
            animate={{ scale: [1.0, 1.08], x: [0, direction * -20, 0], y: [0, 10, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            style={{ willChange: "transform" }}
          >
            <Image
              src={activeSlide.image}
              alt={activeSlide.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
              draggable={false}
              style={{ backfaceVisibility: "hidden", transform: "translateZ(0)" }}
            />
          </motion.div>

          <div
            aria-hidden="true"
            className="absolute -inset-px"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.86) 0%, rgba(0,0,0,0.58) 42%, rgba(0,0,0,0.20) 72%, rgba(0,0,0,0.0) 100%), linear-gradient(180deg, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0.75) 100%)",
            }}
          />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full px-6 pt-10 md:px-12 md:pt-14 lg:px-24">
        <div className="grid h-full grid-cols-1 items-center pb-36 md:grid-cols-12 md:pb-44">
          <div className={["md:col-span-5 lg:col-span-5", isAr ? "md:col-start-8 text-right ml-auto" : "md:col-start-1 text-left"].join(" ")}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeSlide?.id}
                initial="hidden"
                animate="show"
                exit="exit"
                variants={{
                  hidden: { opacity: 0, x: -50, filter: "blur(10px)" },
                  show: { opacity: 1, x: 0, filter: "blur(0px)", transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
                  exit: { opacity: 0, x: -30, filter: "blur(10px)", transition: { duration: 0.25 } },
                }}
                className="max-w-xl"
              >
                <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }} className="text-xs tracking-[0.35em] uppercase text-white/70">
                  {activeSlide.category}
                </motion.div>

                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="mt-4">
                  <div className="text-[28px] leading-none font-extrabold sm:text-3xl md:text-5xl">LEGAL &amp; MARITIME</div>
                  <div className="text-[28px] leading-none font-extrabold sm:text-3xl md:text-5xl text-[var(--brand-accent)]">{activeSlide.title}</div>
                </motion.div>

                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="mt-3 text-base md:text-lg font-semibold text-white/85">
                  {activeSlide.subtitle}
                </motion.div>

                <motion.p variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="mt-5 text-sm md:text-base text-white/70 max-w-[600px] leading-7">
                  {activeSlide.description}
                </motion.p>

                <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }} className="mt-7 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    className="h-11 px-6 rounded-md bg-[var(--brand-accent)] text-[var(--brand-primary)] font-semibold tracking-wide hover:bg-[var(--accent-hover)] transition-transform duration-200 will-change-transform hover:-translate-y-0.5 active:scale-95 shadow"
                  >
                    REQUEST CONSULTATION
                  </button>
                  <button
                    type="button"
                    className="h-11 px-6 rounded-md border border-[color-mix(in_oklab,var(--brand-accent),white_30%)] text-white font-semibold tracking-wide hover:border-[var(--brand-accent)] hover:bg-white/10 transition-transform duration-200 will-change-transform hover:-translate-y-0.5 active:scale-95"
                  >
                    VIEW SERVICES
                  </button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className={["hidden md:block md:col-span-7 lg:col-span-7", isAr ? "md:col-start-1" : "md:col-start-6"].join(" ")} />
        </div>

        <div className="absolute bottom-8 left-6 right-6 md:left-12 md:right-12 lg:left-24 lg:right-24">
          <div className={["flex items-center justify-between gap-6", isAr ? "flex-row-reverse" : ""].join(" ")}>
            <div className="hidden md:flex items-center gap-3">
              <button
                type="button"
                aria-label="Previous slide"
                onClick={prev}
                className="h-11 w-11 rounded-lg border border-white/15 bg-white/10 backdrop-blur-md grid place-items-center text-white/90 transition-transform duration-200 will-change-transform hover:-translate-y-0.5 hover:border-[var(--brand-accent)]/60 hover:bg-white/15 active:scale-95 shadow"
              >
                <Chevron dir={isAr ? "right" : "left"} />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={next}
                className="h-11 w-11 rounded-lg border border-white/15 bg-white/10 backdrop-blur-md grid place-items-center text-white/90 transition-transform duration-200 will-change-transform hover:-translate-y-0.5 hover:border-[var(--brand-accent)]/60 hover:bg-white/15 active:scale-95 shadow"
              >
                <Chevron dir={isAr ? "left" : "right"} />
              </button>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-visible [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-3">
              <div className={["flex items-end gap-3 justify-center min-w-max md:min-w-0", isAr ? "md:justify-start" : "md:justify-end"].join(" ")}>
                {data.map((s, i) => {
                  const isActive = i === active;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      aria-label={`Open ${s.title}`}
                      onClick={() => goTo(i)}
                      className={[
                        "relative z-0 h-16 w-[150px] sm:h-20 sm:w-[170px] md:h-24 md:w-[190px] overflow-hidden rounded-xl border bg-white/5 backdrop-blur-md shadow-lg transition-transform hover:z-30 focus-visible:z-30",
                        isActive ? "border-[var(--brand-accent)]/80 scale-[1.05] z-20" : "border-white/10 hover:-translate-y-2 hover:border-white/20",
                      ].join(" ")}
                      style={{ willChange: "transform" }}
                    >
                      <Image src={s.image} alt={s.title} fill className="object-cover" sizes="220px" draggable={false} />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0"
                        style={{
                          background: "linear-gradient(0deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.20) 60%, rgba(0,0,0,0.0) 100%)",
                        }}
                      />

                      <div className={["absolute inset-0 p-3 flex flex-col justify-end", isAr ? "text-right" : "text-left"].join(" ")}>
                        <div className="text-xs font-extrabold tracking-wide text-white">{s.title}</div>
                        <div className="mt-0.5 text-[11px] text-white/70">{s.subtitle}</div>

                        <div className="mt-2 h-1 rounded bg-white/15 overflow-hidden">
                          {isActive ? (
                            <motion.div
                              className="h-full bg-gradient-to-r from-[var(--brand-accent)] via-[color-mix(in_oklab,var(--brand-accent),white_22%)] to-white/75 origin-left"
                              style={{ scaleX: progress }}
                            />
                          ) : (
                            <div className="h-full w-0" />
                          )}
                        </div>
                      </div>

                      {isActive ? (
                        <motion.div layoutId="thumb-active" className="absolute inset-0 rounded-xl ring-2 ring-[var(--brand-accent)]/70" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-3 md:hidden text-center text-xs text-white/60 tracking-widest uppercase">
            {isAr ? "→ Swipe ←" : "← Swipe →"}
          </div>
        </div>
      </div>
    </div>
  );
}
