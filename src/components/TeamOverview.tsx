"use client";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

function TeamPhoto({ slug, alt }: { slug: string; alt: string }) {
  const v = process.env.NEXT_PUBLIC_ASSET_VERSION;
  const withV = (p: string) => (v ? `${p}?v=${v}` : p);
  const [src, setSrc] = useState(withV(`/images/team/${slug}.webp`));
  const [step, setStep] = useState(0);
  const focalMap: Record<string, string> = {
    "khaled-omer": "50% 18%",
    "mohamed-dafallah": "50% 12%",
    "Mohamed Dafallah": "50% 12%",
    "Malik Omer": "50% 18%",
    "nour-hassan": "50% 16%",
  };
  const onError = () => {
    if (step === 0) {
      setStep(1);
      setSrc(withV(`/images/team/${slug}.jpg`));
    } else if (step === 1) {
      setStep(2);
      setSrc(withV(`/images/team/${slug}.png`));
    } else if (step === 2 && slug === "khaled-omer") {
      setStep(3);
      setSrc(withV(`/images/team/khaled-omer.png`));
    } else {
      setStep(4);
      setSrc(withV(`/person.svg`));
    }
  };
  return (
    <Image
      key={src}
      src={src}
      alt={alt}
      fill
      className="team-photo object-cover object-center w-full h-full"
      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
      quality={85}
      onError={onError}
      style={{
        ...(slug === "Mohamed Dafallah" ? { objectPosition: "50% 10%" } : {}),
        ["--mobile-focal" as any]: focalMap[slug] || "50% 15%",
      }}
    />
  );
}

export default function TeamOverview() {
  const { t, lang } = useLanguage();
  const [flipped, setFlipped] = useState<number | null>(null);
  const toggleFlip = (idx: number) => setFlipped((v) => (v === idx ? null : idx));
  const scoreFor = (slug: string, items: Person[]) => {
    const p = items.find((i) => i.slug === slug);
    return p?.rating ?? 82;
  };
  type Person = {
    name: string;
    role: string;
    tags: string[];
    slug: string;
    focus: string;
    bio: string;
    regions?: string;
    experience?: string;
    rating?: number;
  };
  const items: Person[] =
    lang === "ar"
      ? [
          { name: "خالد عمر", role: "مستشار قانوني بحري معتمد", tags: ["بحري", "منازعات معقدة"], slug: "khaled-omer", focus: "بحري، منازعات معقدة", bio: "مستشار موثوق في الشؤون البحرية والمسائل عالية المخاطر.", regions: "UAE/SUD/EGP/GCC", experience: "25 سنة", rating: 95 },
          { name: "محمد دفع الله", role: "مدير / مستشار قانوني", tags: ["تجاري", "عمل"], slug: "Mohamed Dafallah", focus: "استشارات قانونية متنوعة", bio: "مستشار موثوق في القضايا التجارية والعمالية.", regions: "UAE/EGP/GCC", experience: "10 سنة خبرة", rating: 88 },
          { name: "مالك عمر", role: "بحري / تجاري", tags: ["بحري", "تجاري"], slug: "Malik Omer", focus: "قائد سفينة سابق، مختص في الشؤون البحرية التجارية", bio: "مستشار موثوق في القضايا البحرية والتجارية المعقدة.", regions: "UAE/EGP/GCC", experience: "18 سنة خبرة", rating: 92 },
          { name: "إبراهيم أبو رويص", role: "أعمال / شركات", tags: ["أعمال", "إدارة"], slug: "nour-hassan", focus: "أعمال، إدارة", bio: "مستشار موثوق في القضايا البحرية والتجارية المعقدة.", regions: "UAE/EGP/SUD", experience: "15 سنة خبرة", rating: 90 },
        ]
      : [
          { name: "Khaled Omer", role: "Certified Maritime Legal Advisor", tags: ["Maritime", "Complex Disputes"], slug: "khaled-omer", focus: "Maritime, Complex Disputes", bio: "Trusted Advisor on Maritime and High-Risk Matters.", regions: "UAE/SUD/EGP/GCC", experience: "25 yrs", rating: 95 },
          { name: "Mohammed Dafaallah", role: "Manager/Legal Advisor", tags: ["Commercial", "Labor"], slug: "Mohamed Dafallah", focus: "Diverse Legal Advice", bio: "Trusted Advisor on Commercial and Labor Matters.", regions: "UAE/EGP/GCC", experience: "10 yrs", rating: 88 },
          { name: "Malik Omer", role: "Maritime/Commercial", tags: ["Maritime", "Commercial"], slug: "Malik Omer", focus: "Former Ship Captain, specializing in commercial maritime matters", bio: "Trusted Consultant in Complex Maritime and Commercial Matters.", regions: "UAE/EGP/GCC", experience: "18 yrs", rating: 92 },
          { name: "Ibrahim Abu Roais", role: "Business/Companies", tags: ["Business", "Management"], slug: "nour-hassan", focus: "Business, Management", bio: "Trusted Consultant in Complex Maritime and Commercial Matters.", regions: "UAE/ EGP / SUD", experience: "15 yrs", rating: 90 },
        ];
  const teamLines =
    lang === "ar"
      ? [
          "فريق قانوني محترف يقدم استراتيجية دقيقة وتواصل واضح في كل مرحلة.",
          "تحضير ملفات صارم وتحليل مبني على الأدلة وتنفيذ منضبط.",
          "نهج يضع العميل أولًا ويركز على نتائج قابلة للقياس وإنجاز في الوقت المناسب.",
        ]
      : [
          "Seasoned advocates with precise strategy and clear communication at every stage.",
          "Rigorous preparation, evidence‑led analysis, and disciplined execution.",
          "Client‑first mindset focused on measurable outcomes and timely results.",
        ];
  const container = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { staggerChildren: 0.07 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };
  return (
    <motion.section
      id="team"
      className="section-alt no-section-bg mx-auto max-w-7xl px-5 py-20 cards-ink"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={container}
    >
      <motion.div className="flex items-end justify-between gap-4" variants={item}>
        <div>
          <div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-md badge-ink text-[11px] tracking-widest uppercase font-semibold">
              {lang === "ar" ? "ضمن فريق خبرائنا" : "Part of our expert team"}
            </span>
          </div>
          <motion.h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-[var(--brand-accent)]" variants={item} data-edit-key="team-overview-title">{t("teamTitle")}</motion.h2>
          <motion.p className="mt-1 text-zinc-300 leading-6" variants={item} data-edit-key="team-overview-subtitle">
            <span>
              {teamLines[0]}<br/>{teamLines[1]}<br/>{teamLines[2]}
            </span>
          </motion.p>
        </div>
        <motion.div variants={item}>
          <Link
            href={`/${lang}/about`}
            className="hidden md:inline-flex items-center gap-2 rounded-lg bg-[var(--brand-accent)] text-black px-4 py-2 text-sm font-semibold transition will-change-transform hover:-translate-y-0.5 hover:bg-[color-mix(in_oklab,var(--brand-accent),black_10%)] active:scale-[0.98] ring-1 ring-[var(--brand-accent)]/40"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
              <path d="M12 12a3 3 0 100-6 3 3 0 000 6zM3 20a6 6 0 1112 0H3zm13.5-8a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM21 20a5 5 0 00-6-4.9 7.1 7.1 0 012 4.9h4z"/>
            </svg>
            <span>{lang === "ar" ? "تعرف على الفريق" : "Meet our team"}</span>
          </Link>
        </motion.div>
      </motion.div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((p, idx) => (
          <motion.div
            key={p.name}
            className="group rounded-2xl surface border border-zinc-700/40 overflow-hidden transition flip-card"
            variants={item}
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
          >
            <div className="block relative" data-flipped={flipped === idx}>
              <div className="flip-inner h-80 md:h-64 lg:h-72">
                <div className="flip-front team-card-photo team-card-front relative h-80 md:h-64 lg:h-72 overflow-hidden">
                  <TeamPhoto slug={p.slug} alt={p.name} />
                  <div className="absolute inset-0 gradient-overlay bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-2 left-2 z-20">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-zinc-700/40 text-[10px] font-extrabold text-zinc-500 transition-colors duration-200 group-hover:text-[var(--brand-accent)] group-hover:border-[var(--brand-accent)]/60 group-hover:bg-[var(--brand-accent)]/10">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2 z-20 rounded-full bg-[var(--brand-accent)] text-black text-[10px] font-semibold px-2 py-0.5 shadow-[0_2px_10px_rgba(0,0,0,0.25)]">
                    {lang === "ar" ? "احترافي" : "Pro"}
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleFlip(idx)}
                    className="absolute inset-0 z-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]/80"
                    aria-label={lang === "ar" ? `عرض تفاصيل ${p.name}` : `Show ${p.name} details`}
                  />
                </div>
                <div className="flip-back relative h-80 md:h-64 lg:h-72 overflow-visible" dir={lang === "ar" ? "rtl" : "ltr"}>
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-zinc-700/40 text-[10px] font-extrabold text-zinc-500">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2 rounded-full bg-[var(--brand-accent)] text-black text-[10px] font-semibold px-2 py-0.5">
                    {lang === "ar" ? "احترافي" : "Pro"}
                  </div>
                  <div className="min-h-full overflow-visible p-5 pt-8 flex flex-col">
                    <div className="text-center font-semibold text-white" data-edit-key={`team-member-name-${idx}`}>{p.name}</div>
                    <div className="mt-0.5 text-center text-sm text-zinc-300" data-edit-key={`team-member-role-${idx}`}>{p.role}</div>
                    <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                      {p.tags?.map((t) => (
                        <span key={t} className="rounded-lg chip px-2.5 py-1 text-xs text-zinc-300">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 text-center text-xs text-zinc-400">
                      <span className="inline-flex items-center justify-center gap-1">
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5">
                          <path fill="currentColor" d="M10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a1 1 0 0 1 1-1h3V4a2 2 0 0 1 2-2Zm4 4V4h-4v2h4Z" />
                        </svg>
                        <span data-edit-key={`team-member-focus-${idx}`}>{(lang === "ar" ? "التخصص: " : "Focus: ") + p.focus}</span>
                      </span>
                    </div>
                    <p className="mt-2 text-center text-xs text-zinc-300 leading-6">
                      <span className="inline-flex items-start justify-center gap-1">
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 h-3.5 w-3.5">
                          <path fill="currentColor" d="M6 2h7l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm7 1v4h4" />
                        </svg>
                        <span data-edit-key={`team-member-bio-${idx}`}>{p.bio}</span>
                      </span>
                    </p>
                    <div className="mt-auto pt-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">{(p.regions || "").split("/").filter(Boolean).map((r) => (<span key={r} className="rounded-lg chip px-2 py-0.5 text-[10px] text-zinc-300">{r}</span>))}</div>
                        <div className="inline-flex items-center gap-1 rounded-lg bg-zinc-800/60 px-2 py-0.5 text-[10px] text-zinc-200">
                          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5">
                            <path fill="currentColor" d="M12 2a7 7 0 1 1 0 14A7 7 0 0 1 12 2Zm0 2a5 5 0 1 0 .001 10.001A5 5 0 0 0 12 4Zm-.5 2h1v4h-1V6Zm0 5h1v1h-1v-1Z"/>
                          </svg>
                          <span>{p.experience || (lang === "ar" ? "خبرة" : "Exp")}</span>
                        </div>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-zinc-700/50 overflow-hidden">
                        <div className="h-full rounded-full bg-[var(--brand-accent)]" style={{ width: `${scoreFor(p.slug, items)}%` }} />
                      </div>
                      <div className="mt-1 text-[10px] text-zinc-400 text-right">
                        <span>{lang === "ar" ? "الاحترافية" : "Professionalism"} {scoreFor(p.slug, items)}%</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleFlip(idx)}
                    className="absolute inset-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]/80"
                    aria-label={lang === "ar" ? `إغلاق تفاصيل ${p.name}` : `Close ${p.name} details`}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div className="mt-8 md:hidden text-center" variants={item}>
        <Link href={`/${lang}/about`} className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-accent)] text-black px-5 py-2.5 font-semibold hover:opacity-90">
          <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
            <path d="M12 12a3 3 0 100-6 3 3 0 000 6zM3 20a6 6 0 1112 0H3zm13.5-8a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM21 20a5 5 0 00-6-4.9 7.1 7.1 0 012 4.9h4z"/>
          </svg>
          <span>{lang === "ar" ? "تعرف على الفريق" : "Meet our team"}</span>
        </Link>
      </motion.div>
    </motion.section>
  );
}
