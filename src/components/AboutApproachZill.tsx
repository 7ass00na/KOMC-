"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useTransform, useReducedMotion } from "framer-motion";

type Step = { title: string; body: string; image: string };

export default function AboutApproachZill({
  isRTL = false,
  steps,
  heading,
}: {
  isRTL?: boolean;
  steps?: Step[];
  heading?: string;
}) {
  const prefersReduced = useReducedMotion();
  const [externalSteps, setExternalSteps] = useState<Step[] | null>(null);
  useEffect(() => {
    if (steps) return;
    const candidates = [
      isRTL ? "/images/approach/steps.ar.json" : "/images/approach/steps.en.json",
      isRTL ? "/images/Approach/steps.ar.json" : "/images/Approach/steps.en.json",
      "/images/approach/steps.json",
      "/images/Approach/steps.json",
    ];
    let cancelled = false;
    const load = async () => {
      for (const url of candidates) {
        try {
          const res = await fetch(url, { cache: "no-store" });
          if (res.ok) {
            const data = await res.json();
            if (!cancelled && Array.isArray(data) && data.length) {
              setExternalSteps(data as Step[]);
              return;
            }
          }
        } catch {
          // continue to next candidate
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [isRTL, steps]);
  const s: Step[] = useMemo(() => {
    if (steps && steps.length) return steps;
    if (externalSteps && externalSteps.length) return externalSteps;
    if (isRTL) {
      return [
        { title: "تحليل القضية", body: "نحلّل الوقائع والمخاطر والآثار القانونية بدقة متناهية.", image: "/images/Approach/case analysis.jpg" },
        { title: "التخطيط الاستراتيجي", body: "الموقف القانوني مبني على النتائج لا الافتراضات.", image: "/images/Approach/stratigic palning.jpg" },
        { title: "تعاون الخبراء", body: "تنسيق بين المستشارين الكبار يضمن العمق والسرعة والدقة.", image: "/images/Approach/Expert Colaboration.jpg" },
        { title: "التنفيذ التكتيكي", body: "كل خطوة مدروسة ومتوافقة وقانونيًا قابلة للدفاع.", image: "/images/Approach/Execution.jpg" },
        { title: "الحسم والاستمرارية", body: "نُنهي النزاع بحسم مع صون المصالح طويلة الأجل.", image: "/images/Approach/Resoulution.jpg" },
      ];
    }
    return [
      { title: "Case Analysis", body: "We analyze the facts, risks, and legal implications with meticulous precision.", image: "/images/Approach/case analysis.jpg" },
      { title: "Strategic Planning", body: "The legal position is based on results, not assumptions.", image: "/images/Approach/stratigic palning.jpg" },
      { title: "Expert Collaboration", body: "Coordination among senior advisors ensures depth, speed, and accuracy.", image: "/images/Approach/Expert Colaboration.jpg" },
      { title: "Tactical Execution", body: "Every action is carefully considered, legally compliant, and defensible.", image: "/images/Approach/Execution.jpg" },
      { title: "Resolution & Continuity", body: "We conclude the case decisively while safeguarding long-term interests.", image: "/images/Approach/Resoulution.jpg" },
    ];
  }, [externalSteps, steps, isRTL]);
  const [active, setActive] = useState(0);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useTransform(my, [-50, 50], [isRTL ? -2 : 2, isRTL ? 2 : -2]);
  const rotateY = useTransform(mx, [-50, 50], [isRTL ? 2 : -2, isRTL ? -2 : 2]);
  const translateX = useTransform(mx, [-50, 50], [isRTL ? 6 : -6, isRTL ? -6 : 6]);
  const translateY = useTransform(my, [-50, 50], [6, -6]);
  const scale = prefersReduced ? 1 : 1.02;

  return (
    <section className="section no-section-bg mx-auto max-w-7xl px-5 py-20">
      <div className="relative">
        {heading ? <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--brand-accent)]">{heading}</h2> : null}
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 md:items-stretch" dir={isRTL ? "rtl" : "ltr"}>
          <div className={`${isRTL ? "order-1 md:order-2" : "order-1 md:order-1"} flex h-full flex-col gap-3 md:min-h-[480px]`}>
            {s.map((st, i) => {
              const activeStep = i === active;
              return (
                <motion.button
                  key={st.title}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`group flex items-start gap-4 rounded-xl border p-4 text-left transition surface ${
                    activeStep ? "border-[var(--brand-accent)]/50 bg-[var(--brand-accent)]/5" : "border-zinc-700/40 hover:border-zinc-500/50"
                  }`}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--brand-accent)]/15 text-sm font-bold text-[var(--brand-accent)] ring-1 ring-[var(--brand-accent)]/30">
                    {i + 1}
                  </div>
                  <div className={`${isRTL ? "text-right" : "text-left"} min-w-0`}>
                    <div className={`text-sm font-semibold ${activeStep ? "text-white" : "text-zinc-200"} transition`}>{st.title}</div>
                    <div className={`mt-1 text-xs leading-6 ${activeStep ? "text-zinc-200" : "text-zinc-400"}`}>{st.body}</div>
                  </div>
                </motion.button>
              );
            })}
          </div>
          <div
            className={`${isRTL ? "order-2 md:order-1" : "order-2 md:order-2"} relative h-full`}
            onMouseMove={(e) => {
              if (prefersReduced) return;
              const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
              const x = e.clientX - (rect.left + rect.width / 2);
              const y = e.clientY - (rect.top + rect.height / 2);
              mx.set(Math.max(-50, Math.min(50, x / 10)));
              my.set(Math.max(-50, Math.min(50, y / 10)));
            }}
            onMouseLeave={() => {
              mx.set(0);
              my.set(0);
            }}
          >
            <motion.div
              style={{ rotateX: prefersReduced ? 0 : rotateX, rotateY: prefersReduced ? 0 : rotateY }}
              className="relative h-[360px] w-full overflow-hidden rounded-2xl border border-zinc-700/40 surface md:h-full md:min-h-[480px]"
            >
              <div className="absolute inset-0">
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={s[active].image}
                    initial={{ opacity: 0.0, scale: prefersReduced ? 1 : 1.02 }}
                    animate={{ opacity: 1, scale }}
                    exit={{ opacity: 0.0, scale: prefersReduced ? 1 : 1.02 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="absolute inset-0"
                  >
                    <Image src={s[active].image} alt={s[active].title} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover object-center opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:24px_24px]" />
                  </motion.div>
                </AnimatePresence>
              </div>
              <motion.div
                style={{ x: prefersReduced ? 0 : translateX, y: prefersReduced ? 0 : translateY }}
                className="pointer-events-none absolute inset-0"
              >
                <div className={`${isRTL ? "absolute -right-24 -top-10 h-40 w-[160%] rotate-12 bg-gradient-to-l" : "absolute -left-24 -top-10 h-40 w-[160%] -rotate-12 bg-gradient-to-r"} from-[var(--brand-accent)]/15 via-transparent to-transparent md:h-52`} />
              </motion.div>
              <div className={`absolute ${isRTL ? "left-4" : "right-4"} bottom-4 rounded-md bg-black/40 px-3 py-2 text-[11px] font-medium text-zinc-200 ring-1 ring-white/10 backdrop-blur`}>
                {s[active].title}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
