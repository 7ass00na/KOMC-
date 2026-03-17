'use client';
// EN: Hero section — animated carousel with trust badge, title, CTAs, stats, image
// AR: قسم البطل — سلايدر متحرك مع شارة الثقة، عنوان، أزرار، إحصائيات، وصورة
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

const slideIntervalMs = 12500;

function splitIntoLines(text: string, lines: number) {
  if (text.includes("\n")) {
    const parts = text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const out = parts.slice(0, lines);
    while (out.length < lines) out.push("");
    return out;
  }
  const words = text.split(/\s+/);
  const per = Math.ceil(words.length / lines);
  const out: string[] = [];
  for (let i = 0; i < lines; i++) {
    const chunk = words.slice(i * per, (i + 1) * per);
    if (chunk.length) out.push(chunk.join(" "));
  }
  while (out.length < lines) out.push("");
  return out.slice(0, lines);
}

function CountUp({
  end,
  duration = 1400,
  suffix = "",
  start = 0,
  popSuffix = false,
}: {
  end: number;
  duration?: number;
  suffix?: string;
  start?: number;
  popSuffix?: boolean;
}) {
  const [value, setValue] = useState(start);
  const [done, setDone] = useState(false);
  const raf = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);
  useEffect(() => {
    startTime.current = null;
    const animate = (ts: number) => {
      if (!startTime.current) startTime.current = ts;
      const p = Math.min((ts - startTime.current) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(start + (end - start) * eased));
      if (p < 1) raf.current = requestAnimationFrame(animate);
      else setDone(true);
    };
    raf.current = requestAnimationFrame(animate);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [end, duration, start]);
  return (
    <span className="inline-flex items-baseline">
      <motion.span
        initial={false}
        animate={
          done
            ? { filter: ["brightness(1)", "brightness(1.12)", "brightness(1)"] }
            : {}
        }
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {value.toLocaleString()}
      </motion.span>
      {suffix
        ? popSuffix && suffix === "+" ? (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: done ? 1 : 0, opacity: done ? 1 : 0 }}
              transition={{ type: "spring", stiffness: 360, damping: 18, delay: done ? 0 : 0 }}
              className="inline-block"
            >
              {suffix}
            </motion.span>
          ) : (
            suffix
          )
        : null}
    </span>
  );
}

export default function Hero() {
  const { t, dir, lang } = useLanguage();
  const isAr = dir === "rtl";
  // EN: Slides content — titles, highlights, descriptions, images, corner badges
  // AR: محتوى السلايد — العناوين، الإبراز، الوصف، الصور، وشارات الزوايا
  const slides = useMemo(
    () => [
      {
        title: t("slide1Title"),
        highlight: t("slide1Highlight"),
        desc: t("slide1Desc"),
        img: "/images/home/SL-07.png",
      },
      {
        title: t("slide2Title"),
        highlight: t("slide2Highlight"),
        desc: t("slide2Desc"),
        img: "/images/home/SL-04.png",
      },
      {
        title: t("slide3Title"),
        highlight: t("slide3Highlight"),
        desc: t("slide3Desc"),
        img: "/images/home/SL-3.png",
      },
    ],
    [t]
  );
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  // EN: Motion values for parallax effect (image and background)
  // AR: قيم الحركة لتأثير البارالاكس (الصورة والخلفية)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const bgX = useTransform(mx, (v) => v * -0.03);
  const bgY = useTransform(my, (v) => v * -0.04);
  const streaks = useMemo(
    () =>
      Array.from({ length: 16 }).map((_, i) => ({
        l: `${(i * 6 + 5) % 100}%`,
        t: `${(-12 - i * 5)}%`,
        w: i % 4 === 0 ? 128 : i % 4 === 1 ? 96 : i % 4 === 2 ? 72 : 48,
        d: 4.2 + i * 0.28,
        o: 0.08 + (i % 5) * 0.035,
      })),
    []
  );

  // EN: Auto-advance slides
  // AR: الانتقال التلقائي بين الشرائح
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, slideIntervalMs);
    return () => clearInterval(id);
  }, [slides.length]);

  // EN: Touch swipe navigation
  // AR: تنقل بالسحب على اللمس
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      setIndex((i) =>
        dx < 0 ? (i + 1) % slides.length : (i - 1 + slides.length) % slides.length
      );
    }
    touchStartX.current = null;
  };

  const variants = {
    enter: { opacity: 0, y: 14, scale: 0.98, filter: "blur(6px)" },
    center: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, y: -10, scale: 0.98, filter: "blur(6px)" },
  };

  return (
    <section
      className="relative overflow-hidden hero-bg text-white"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseMove={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        mx.set(e.clientX - rect.left - rect.width / 2);
        my.set(e.clientY - rect.top - rect.height / 2);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") setIndex((i) => (i + 1) % slides.length);
        if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + slides.length) % slides.length);
      }}
      tabIndex={0}
    >
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_50%_100%,rgba(0,0,0,0.6),transparent_60%)]" />
      {/* EN: Background parallax layer */}
      {/* AR: طبقة الخلفية بخاصية البارالاكس */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ x: bgX, y: bgY }}
      />
      <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
        {streaks.map((s, i) => (
          <motion.span
            key={i}
            className="absolute block bg-white"
            style={{
              left: s.l,
              top: s.t,
              width: s.w,
              height: 1,
              opacity: s.o,
              rotate: isAr ? -20 : 20,
              filter: "blur(0.8px)",
              transformOrigin: "left center",
            }}
            initial={{ y: "-10%" }}
            animate={{ y: "120%" }}
            transition={{
              duration: s.d,
              ease: "linear",
              repeat: Infinity,
              delay: i * 0.25,
            }}
          />
        ))}
      </div>
      <div className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <div>
            <div style={{ perspective: "1600px" }}>
              <motion.div
                key={`flip-${index}`}
                className="relative"
                initial={{ rotateY: isAr ? -24 : 24, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
                style={{ transformOrigin: isAr ? "100% 50%" : "0% 50%" }}
              >
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  initial={{ opacity: 0.3, x: isAr ? -26 : 26 }}
                  animate={{ opacity: 0, x: 0 }}
                  transition={{ duration: 0.9, ease: "easeInOut" }}
                >
                  <div className={["absolute inset-0", isAr ? "bg-gradient-to-l" : "bg-gradient-to-r", "from-black/35 via-black/15 to-transparent"].join(" ")} />
                </motion.div>
            <AnimatePresence mode="wait">
              <motion.div
                key={`badge-${index}`}
                initial={{ opacity: 0, y: -6, x: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, x: 6, scale: 0.98 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[var(--brand-accent)] text-[var(--brand-primary)] text-[11px] md:text-xs uppercase tracking-widest font-semibold"
              >
                {t("heroTrust")}
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.h1
                key={`title-${index}`}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className={[
                  "mt-3 text-2xl md:text-4xl font-extrabold leading-tight",
                  isAr ? "text-right ml-auto" : "text-left"
                ].join(" ")}
              >
                <span className="block overflow-hidden">
                  <motion.span
                    initial={{ clipPath: "inset(0 0 100% 0)" }}
                    animate={{ clipPath: "inset(0 0 0% 0)" }}
                    exit={{ clipPath: "inset(0 0 100% 0)" }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    className="inline-block"
                  >
                    <span className="block">{slides[index].title}</span>
                    <span className="block text-[var(--brand-accent)]">
                      {slides[index].highlight}
                    </span>
                  </motion.span>
                </span>
              </motion.h1>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.p
                key={`desc-${index}`}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, delay: 0.14 }}
                className={[
                  "mt-3 text-zinc-300 text-[17px] md:text-[18px] leading-7",
                  isAr ? "text-right ml-auto" : "text-left"
                ].join(" ")}
              >
                {splitIntoLines(slides[index].desc, 3).map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </motion.p>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.div
                key={`ctas-${index}`}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, delay: 0.24 }}
                dir={isAr ? "rtl" : "ltr"}
                className={[
                  "mt-5 flex gap-2.5 w-full justify-start"
                ].join(" ")}
              >
                {/* EN: Primary CTA (Consultation) and secondary CTA */}
                {/* AR: زر الدعوة الأساسي (استشارة) وزر ثانوي */}
                <motion.a
                  href={`/${lang}/contact`}
                  className="rounded-lg bg-[var(--brand-accent)] text-black px-5 py-2.5 text-base font-semibold shadow-md"
                  whileHover={{ y: -2, scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                >
                  {t("ctaConsult")}
                </motion.a>
                <motion.a
                  href="#services"
                  className="rounded-lg border border-zinc-500 text-white px-5 py-2.5 text-base font-semibold shadow-md"
                  whileHover={{ y: -2, scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                >
                  {t("ctaSecondary")}
                </motion.a>
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.div
                key={`stats-${index}`}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, delay: 0.38 }}
                dir={isAr ? "rtl" : "ltr"}
                className={[
                  "mt-5 grid grid-cols-[auto_auto] sm:grid-cols-[auto_auto_auto] gap-5 w-full justify-start justify-items-start"
                ].join(" ")}
              >
              <motion.div
                className={[
                  "w-28 md:w-32 px-2.5 py-1.5 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 ring-1 ring-inset ring-white/10 shadow-lg",
                  "flex items-center justify-center gap-1.5",
                  isAr ? "flex-row-reverse" : "flex-row"
                ].join(" ")}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.10 }}
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-xl bg-[var(--brand-accent)]/15 text-[var(--brand-accent)] ring-1 ring-[var(--brand-accent)]/30">
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5">
                      <path fill="currentColor" d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm1 5h-2v6h6v-2h-4V7Z"/>
                    </svg>
                  </span>
                  <div className="leading-6 text-center">
                    <div className="text-xl md:text-2xl font-extrabold text-[var(--brand-accent)]" suppressHydrationWarning>
                      <CountUp key={`y-${index}`} end={15} duration={900} suffix="+" popSuffix />
                    </div>
                    <div className="text-[9px] text-zinc-200">{t("statYears")}</div>
                  </div>
                </motion.div>
              <motion.div
                className={[
                  "w-28 md:w-32 px-2.5 py-1.5 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 ring-1 ring-inset ring-white/10 shadow-lg",
                  "flex items-center justify-center gap-1.5",
                  isAr ? "flex-row-reverse" : "flex-row"
                ].join(" ")}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.16 }}
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-xl bg-[var(--brand-accent)]/15 text-[var(--brand-accent)] ring-1 ring-[var(--brand-accent)]/30">
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5">
                      <path fill="currentColor" d="M12 2 3 6v6c0 5 3.8 9.4 9 10 5.2-.6 9-5 9-10V6l-9-4Zm0 4.5 6 3.1v2.3c0 3.6-2.6 6.9-6 7.4-3.4-.5-6-3.8-6-7.4V9.6l6-3.1Zm-1 9.5 6-6-1.4-1.4L11 13.2 8.4 10.6 7 12l4 4Z"/>
                    </svg>
                  </span>
                  <div className="leading-6 text-center">
                    <div className="text-xl md:text-2xl font-extrabold text-[var(--brand-accent)]" suppressHydrationWarning>
                      <CountUp key={`s-${index}`} end={99} duration={800} suffix="%" />
                    </div>
                    <div className="text-[9px] text-zinc-200">{t("statSuccess")}</div>
                  </div>
                </motion.div>
              <motion.div
                className={[
                  "w-28 md:w-32 px-2.5 py-1.5 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 ring-1 ring-inset ring-white/10 shadow-lg",
                  "flex items-center justify-center gap-1.5",
                  isAr ? "flex-row-reverse" : "flex-row"
                ].join(" ")}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.22 }}
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-xl bg-[var(--brand-accent)]/15 text-[var(--brand-accent)] ring-1 ring-[var(--brand-accent)]/30">
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5">
                      <path fill="currentColor" d="M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0Zm-6 5a6 6 0 0 0-6 6h2a4 4 0 0 1 8 0h2a6 6 0 0 0-6-6Z"/>
                    </svg>
                  </span>
                  <div className="leading-6 text-center">
                    <div className="text-xl md:text-2xl font-extrabold text-[var(--brand-accent)]" suppressHydrationWarning>
                      <CountUp key={`e-${index}`} end={25} duration={1000} suffix="+" popSuffix />
                    </div>
                    <div className="text-[9px] text-zinc-200">{t("statExperts")}</div>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
              </motion.div>
            </div>
          </div>
          <div className="relative self-stretch">
            {/* EN: Fixed hero image (decoupled from slide transitions) */}
            {/* AR: تثبيت صورة البطل (بدون تحريك عبر الشرائح) */}
          <div className="relative h-full min-h-[20rem] sm:min-h-[24rem] md:min-h-0 lg:min-h-0">
              <motion.div
                key={`imgbg-${index}`}
                className="absolute inset-0 -z-10"
                initial={{ opacity: 0.6, scale: 0.96, rotate: isAr ? -1 : 1 }}
                animate={{ opacity: 0.9, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(60% 60% at 70% 40%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 34%, transparent 70%)",
                  }}
                />
                <div className="absolute right-6 top-6 h-56 w-56 rounded-full bg-[var(--brand-accent)]/18 blur-3xl" />
                <div className="absolute left-8 bottom-8 h-48 w-48 rounded-full bg-white/12 blur-2xl" />
              </motion.div>
              <div className="h-full">
                <Image
                  src={slides[index].img || "/images/hero-man.png"}
                  alt="Professional"
                  fill
                  className="object-contain object-center"
                  sizes="(max-width: 768px) 92vw, 48vw"
                  priority
                />
              </div>
              {/* EN: Floating glassmorphism cards */}
              {/* AR: بطاقات زجاجية عائمة */}
              <motion.aside
                className="pointer-events-none absolute top-3 right-2 sm:top-6 sm:right-6 md:top-6 md:right-8"
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: [0, -4, 0], scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2, repeat: Infinity, repeatType: "mirror", repeatDelay: 3 }}
              >
                <div className="pointer-events-auto select-none rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 ring-1 ring-inset ring-white/10 shadow-lg px-2.5 py-1.5 flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-xl bg-[var(--brand-accent)]/15 text-[var(--brand-accent)] ring-1 ring-[var(--brand-accent)]/30">
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5">
                      <path fill="currentColor" d="M12 2 3 6v6c0 5 3.8 9.4 9 10 5.2-.6 9-5 9-10V6l-9-4Zm0 2.2L19 7v5c0 4-2.9 7.6-7 8.2-4.1-.6-7-4.2-7-8.2V7l7-2.8Zm-1 11.8 6-6-1.4-1.4L11 12.2 8.4 9.6 7 11l4 4Z"/>
                    </svg>
                  </span>
                  <div className="leading-5">
                    <div className="text-[11px] font-semibold text-white">
                      {isAr ? "دعم 24/7" : "24/7 Support"}
                    </div>
                  </div>
                </div>
              </motion.aside>
              <motion.aside
                className="pointer-events-none absolute bottom-4 left-2 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8"
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: [0, 6, 0], scale: 1 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.3, repeat: Infinity, repeatType: "mirror", repeatDelay: 3.5 }}
              >
                <div className="pointer-events-auto select-none rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 ring-1 ring-inset ring-white/10 shadow-lg px-2.5 py-1.5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-xl bg-[var(--brand-accent)]/15 text-[var(--brand-accent)] ring-1 ring-[var(--brand-accent)]/30">
                      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5">
                        <path fill="currentColor" d="M3 17h2v2H3v-2Zm4-4h2v6H7v-6Zm4-6h2v12h-2V7Zm4 3h2v9h-2V10Zm4-7h2v16h-2V3Z"/>
                      </svg>
                    </span>
                    <div className={isAr ? "text-right" : "text-left"}>
                      <div className="text-[11px] font-semibold text-white">
                        {isAr ? "قضايا رابحة" : "Case Won"}
                      </div>
                      <div className="text-[9px] text-zinc-200">
                        {isAr ? "أكثر من 560+ قضية رابحة" : "plus 560+ cases won"}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.aside>
            </div>
          </div>
        </div>
        {/* EN: Slide progress indicators */}
        {/* AR: مؤشرات تقدم الشرائح */}
        <div className="mt-10 flex items-center gap-2.5 justify-center">
          {slides.map((_, i) => (
            <motion.button
              key={i}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={[
                "relative h-8 w-8 rounded-md grid place-items-center font-semibold overflow-hidden",
                index === i ? "bg-[var(--brand-accent)] text-black" : "bg-white/10 text-white/70 hover:bg-white/20"
              ].join(" ")}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.96 }}
            >
              <motion.span
                key={`fill-${index === i ? i : -i}`}
                initial={{ width: 0 }}
                animate={{ width: index === i ? "100%" : "0%" }}
                transition={{ duration: index === i ? slideIntervalMs / 1000 : 0.2, ease: "linear" }}
                className={[
                  "pointer-events-none absolute left-1 right-1 bottom-1 h-0.5",
                  index === i ? "bg-black/40" : "bg-transparent"
                ].join(" ")}
              />
              <span className="text-sm">{i + 1}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
