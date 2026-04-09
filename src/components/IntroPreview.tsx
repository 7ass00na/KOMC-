"use client";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";

type Scene = {
  id: number;
  bg: string;
  content: ReactNode;
};

export default function IntroPreview() {
  const { lang, dir } = useLanguage();
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const step = setInterval(() => {
      setIdx((i) => (i < 4 ? i + 1 : i));
    }, 3000);
    return () => clearInterval(step);
  }, []);

  const scenes: Scene[] = [
    {
      id: 0,
      bg: "bg-gradient-to-b from-[#0a1930] via-[#0a1930] to-[#111827]",
      content: (
        <div className="flex h-full w-full items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <div className="text-xs tracking-widest text-white/70">{lang === "ar" ? "أمر قضائي — حجز بحري" : "COURT ORDER – MARITIME SEIZURE"}</div>
            <div className="mt-6 text-[10px] text-white/70">{lang === "ar" ? "السفينة: KOMC‑A12 • الإحداثيات: 25.2953°N, 55.3283°E • الحالة: قيد المراجعة القانونية" : "Vessel: KOMC‑A12 • Coordinates: 25.2953°N, 55.3283°E • Status: UNDER LEGAL REVIEW"}</div>
          </motion.div>
        </div>
      ),
    },
    {
      id: 1,
      bg: "bg-gradient-to-b from-[#0a1930] via-[#0a1930] to-[#1f2937]",
      content: (
        <div className="flex h-full w-full items-center justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="text-center">
            <div className="text-sm font-semibold text-white">{lang === "ar" ? "مكتب قانوني احترافي" : "Corporate Legal Office"}</div>
            <div className="mt-2 text-[12px] text-white/80">{lang === "ar" ? "أزرار أنيقة • توقيع • مراجعة ملف • إيماءة واثقة" : "Cufflinks • Signature • Case Review • Confident Nod"}</div>
            <div className="mt-4 inline-flex items-center rounded-md bg-amber-500/20 px-2.5 py-1 text-[11px] text-amber-300">{lang === "ar" ? "إضاءة دافئة مميزة • انعكاسات الميناء" : "Premium warm lighting • Port reflections"}</div>
          </motion.div>
        </div>
      ),
    },
    {
      id: 2,
      bg: "bg-gradient-to-b from-[#0a1930] via-[#0a1930] to-[#0b2742]",
      content: (
        <div className="flex h-full w-full items-center justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="text-center">
            <div className="text-sm font-semibold text-white">{lang === "ar" ? "عملية حجز عند الرصيف" : "Dockside Seizure Operation"}</div>
            <div className="mt-2 text-[12px] text-white/80">{lang === "ar" ? "خطوات ثابتة • يتقدم المحامي • يتبعه الضباط" : "Footsteps • Lawyer advances • Officers follow"}</div>
            <div className="mt-3 inline-flex items-center rounded-md bg-white/10 px-3 py-1 text-[11px] text-white/90">{lang === "ar" ? "أمر حجز" : "SEIZURE ORDER"}</div>
            <div className="mt-3 text-[11px] text-white/70">{lang === "ar" ? "تظهر بنود بحرية • تتلاشى" : "Maritime clauses appear • dissolve"}</div>
          </motion.div>
        </div>
      ),
    },
    {
      id: 3,
      bg: "bg-gradient-to-b from-[#0a1930] via-[#0a1930] to-[#0a1930]",
      content: (
        <div className="flex h-full w-full items-center justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="text-center">
            <div className="text-sm font-semibold text-white">{lang === "ar" ? "حسم وسيطرة" : "Resolution & Control"}</div>
            <div className="mt-2 text-[12px] text-white/80">{lang === "ar" ? "سفينة محجوزة • مصافحة واثقة • قوة هادئة" : "Seized ship visible • Confident handshake • Calm power"}</div>
          </motion.div>
        </div>
      ),
    },
    {
      id: 4,
      bg: "bg-gradient-to-b from-[#0a1930] via-[#0a1930] to-[#0a1930]",
      content: (
        <div className="flex h-full w-full items-center justify-center" dir={dir}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="text-center">
            <div className="mx-auto mb-3 relative h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14">
              <Image src={"/main_logo.svg"} alt={lang === "ar" ? "الشعار الرئيسي" : "Main Logo"} fill sizes="(max-width: 768px) 40px, (max-width: 1024px) 48px, 56px" className="object-contain" priority />
            </div>
            <div className="text-2xl font-extrabold tracking-wide text-amber-300">{lang === "ar" ? "شركة خالد عمر للاستشارات البحرية والقانونية" : "Khaled Omar Legal & Maritime Consultancy "}</div>
            <div className="mt-2 text-sm text-white/90">{lang === "ar" ? "دقة في القانون البحري" : "Precision in Maritime Law."}</div>
          </motion.div>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5" dir={dir}>
      <div className="relative h-[400px] w-full overflow-hidden rounded-2xl border border-white/10">
        <AnimatePresence mode="wait">
          <motion.div
            key={scenes[idx].id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className={`absolute inset-0 ${scenes[idx].bg}`}
          >
            {scenes[idx].content}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-[12px] text-white/70">{lang === "ar" ? "معاينة • 15 ثانية • 5 مشاهد" : "Preview • 15s • 5 scenes"}</div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-md bg-white/10 px-3 py-1 text-[12px] text-white hover:bg-white/15"
            onClick={() => setIdx(0)}
          >
            Replay
          </button>
          <button
            className="rounded-md bg-[var(--brand-accent)] px-3 py-1 text-[12px] text-black hover:opacity-90"
            onClick={() => setIdx((i) => Math.min(4, i + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
