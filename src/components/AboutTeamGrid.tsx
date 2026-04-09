"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

type TeamMember = {
  name: string;
  role: string;
  focus: string;
  bio: string;
  src: string;
  tags?: string[];
  mobileFocal?: string;
  regions?: string;
  experience?: string;
  rating?: number;
};

export default function AboutTeamGrid({ team, isRTL = false, startIndex = 0 }: { team: TeamMember[]; isRTL?: boolean; startIndex?: number }) {
  const [flipped, setFlipped] = useState<number | null>(null);
  const toggleFlip = (idx: number) => setFlipped((v) => (v === idx ? null : idx));
  const scoreFor = (p: TeamMember) => p.rating ?? 82;
  const normalize = (s: string) => s.trim().toLowerCase();
  const teamData = team.map((p, idx) => {
    const n = normalize(p.name);
    const number = idx + 1 + startIndex;
    if (!isRTL) {
      if (n === "khaled omer") {
        return {
          ...p,
          role: "Certified Maritime Legal Advisor",
          focus: "Maritime, Complex Disputes",
          bio: "Trusted Advisor on Maritime and High-Risk Matters.",
          regions: "UAE/SUD/EGP/GCC",
          experience: "25yrs",
          rating: 95,
        };
      }
      if (n === "mohammed dafaallah" || n === "mohamed dafallah") {
        return {
          ...p,
          role: "Manager/Legal Advisor",
          focus: "Diverse Legal Advice",
          bio: "Trusted Advisor on Commercial and Labor Matters.",
          regions: "UAE/EGP/GCC",
          experience: "10yrs",
          rating: 88,
        };
      }
      if (n === "malik omer") {
        return {
          ...p,
          role: "Maritime/Commercial",
          focus: "Former Ship Captain, specializing in commercial maritime matters",
          bio: "Trusted Consultant in Complex Maritime and Commercial Matters.",
          regions: "UAE/EGP/GCC",
          experience: "18yrs",
          rating: 92,
        };
      }
      if (n === "ibrahim abu roais" || n === "ibrahim abu roais ") {
        return {
          ...p,
          role: "Business/Companies",
          focus: "Business, Management",
          bio: "Trusted Consultant in Complex Maritime and Commercial Matters.",
          regions: "UAE/ EGP / SUD",
          experience: "15yrs",
          rating: 90,
        };
      }
      // Card-number-based overrides (About page cards 5–12)
      if (number === 5) {
        return {
          ...p,
          name: "Hazim Abu Baker",
          role: "Lawyer & Legal Consultant",
          focus: "General Law, Complex Disputes",
          bio: "Trusted Consultant in all kind of Legal Cases.",
          regions: "UAE/SUD/GCC",
          experience: "10yrs",
          rating: 92,
        };
      }
      if (number === 6) {
        return {
          ...p,
          name: "Mohammed Yousif",
          role: "Legal Advisor",
          focus: "Various Legal Consultations",
          bio: "Trusted Consultant in Execution and Labor Cases.",
          regions: "UAE/SUD/GCC",
          experience: "6yrs",
          rating: 85,
        };
      }
      if (number === 7) {
        return {
          ...p,
          name: "Mohammed Siddig",
          role: "Legal Advisor",
          focus: "Various Legal Consultations",
          bio: "Trusted Consultant in Execution and Labor Cases.",
          regions: "UAE/SUD/GCC",
          experience: "6yrs",
          rating: 85,
        };
      }
      if (number === 8) {
        return {
          ...p,
          name: "Jayantah Ganegama",
          role: "Accountant and Financial advisor",
          focus: "Financial Cases",
          bio: "Trusted consultant in maritime and financial matters.",
          regions: "UAE/SER/GCC",
          experience: "15yrs",
          rating: 90,
        };
      }
      if (number === 9) {
        return {
          ...p,
          name: "Enas Ali",
          role: "Lawyer and Legal Advisor",
          focus: "Various Legal Consultations",
          bio: "Trusted Consultant in Commercial and Family Cases.",
          regions: "UAE/SUD/GCC",
          experience: "8yrs",
          rating: 89,
        };
      }
      if (number === 10) {
        return {
          ...p,
          name: "Nada Fadail",
          role: "Lawyer and Legal Advisor",
          focus: "Various Legal Consultations",
          bio: "Trusted Consultant in Commercial and Financial Cases.",
          regions: "UAE/SUD/GCC",
          experience: "8yrs",
          rating: 88,
        };
      }
      if (number === 11) {
        return {
          ...p,
          name: "Gehad Abd Elgwad",
          role: "Lawyer and Legal Advisor",
          focus: "Various Legal Consultations",
          bio: "Trusted Consultant in media and rent cases.",
          regions: "UAE/EGP/GCC",
          experience: "8yrs",
          rating: 84,
        };
      }
      if (number === 12) {
        return {
          ...p,
          name: "Aya Khaled",
          role: "Lawyer and Legal Advisor",
          focus: "Various Legal Consultations",
          bio: "Trusted Consultant in media and real estate cases.",
          regions: "UAE/EGP/GCC",
          experience: "4yrs",
          rating: 86,
        };
      }
      if (number === 13) {
        return {
          ...p,
          name: "Ahmed Ali",
          role: "Lawyer and Legal Advisor",
          focus: "Various Legal Consultations",
          bio: "Trusted Consultant in crime and media cases.",
          regions: "UAE/EGP/GCC",
          experience: "8yrs",
          rating: 84,
        };
      }
      if (number === 14) {
        return {
          ...p,
          name: "Essam Hamza",
          role: "Lawyer and Legal Advisor",
          focus: "Various Legal Consultations",
          bio: "Trusted Consultant in rent and real estate cases.",
          regions: "UAE/EGP/GCC",
          experience: "8yrs",
          rating: 86,
        };
      }
      if (number === 15) {
        return {
          ...p,
          name: "Ibrahim Abu Roais",
          role: "Business Advisor",
          focus: "Various business and corporate consultations",
          bio: "Trusted Consultant in business and corporate cases.",
          regions: "UAE/EGP/GCC",
          experience: "8yrs",
          rating: 86,
        };
      }
      if (number === 16) {
        return {
          ...p,
          name: "Ahmed Ameen",
          role: "Legal Advisor",
          focus: "Various Legal Consultations",
          bio: "Trusted Consultant in rent and real estate cases.",
          regions: "UAE/SUD/GCC",
          experience: "10yrs",
          rating: 90,
        };
      }
    } else {
      if (n === "خالد عمر") {
        return {
          ...p,
          role: "مستشار قانوني بحري معتمد",
          focus: "بحري، منازعات معقدة",
          bio: "مستشار موثوق في الشؤون البحرية والمسائل عالية المخاطر.",
          regions: "UAE/SUD/EGP/GCC",
          experience: "25 سنة",
          rating: 95,
        };
      }
      if (n === "محمد دفع الله" || n === " محمد دفع الله") {
        return {
          ...p,
          role: "مدير / مستشار قانوني",
          focus: "استشارات قانونية متنوعة",
          bio: "مستشار موثوق في القضايا التجارية والعمالية.",
          regions: "UAE/EGP/GCC",
          experience: "10 سنوات",
          rating: 88,
        };
      }
      if (n === "مالك عمر") {
        return {
          ...p,
          role: "بحري / تجاري",
          focus: "قائد سفينة سابق، مختص في الشؤون البحرية التجارية",
          bio: "مستشار موثوق في القضايا البحرية والتجارية المعقدة.",
          regions: "UAE/EGP/GCC",
          experience: "18 سنة خبرة",
          rating: 92,
        };
      }
      if (n === "إبراهيم أبو رويص" || n === "ابراهيم ابو رويص") {
        return {
          ...p,
          role: "أعمال / شركات",
          focus: "أعمال، إدارة",
          bio: "مستشار موثوق في القضايا البحرية والتجارية المعقدة.",
          regions: "UAE/EGP/SUD",
          experience: "15 سنة خبرة",
          rating: 90,
        };
      }
      // Arabic card-number-based overrides (5–12)
      if (number === 5) {
        return {
          ...p,
          name: "حازم أبو بكر",
          role: "محامٍ ومستشار قانوني",
          focus: "قانون عام، منازعات معقدة",
          bio: "مستشار موثوق في جميع أنواع القضايا القانونية.",
          regions: "UAE/SUD/GCC",
          experience: "10 سنوات",
          rating: 92,
        };
      }
      if (number === 6) {
        return {
          ...p,
          name: "محمد يوسف",
          role: "مستشار قانوني",
          focus: "استشارات قانونية متنوعة",
          bio: "مستشار موثوق في قضايا التنفيذ والعمالة.",
          regions: "UAE/SUD/GCC",
          experience: "6 سنوات",
          rating: 85,
        };
      }
      if (number === 7) {
        return {
          ...p,
          name: "محمد صديق",
          role: "مستشار قانوني",
          focus: "استشارات قانونية متنوعة",
          bio: "مستشار موثوق في قضايا التنفيذ والعمالة.",
          regions: "UAE/SUD/GCC",
          experience: "6 سنوات",
          rating: 85,
        };
      }
      if (number === 8) {
        return {
          ...p,
          name: "جاينثا جانيغاما",
          role: "محاسب ومستشار مالي",
          focus: "قضايا مالية",
          bio: "مستشار موثوق في الشؤون البحرية والمالية.",
          regions: "UAE/SER/GCC",
          experience: "15 سنة",
          rating: 90,
        };
      }
      if (number === 9) {
        return {
          ...p,
          name: "إيناس علي",
          role: "محامية ومستشارة قانونية",
          focus: "استشارات قانونية متنوعة",
          bio: "مستشارة موثوقة في القضايا التجارية والأسرية.",
          regions: "UAE/SUD/GCC",
          experience: "8 سنوات",
          rating: 89,
        };
      }
      if (number === 10) {
        return {
          ...p,
          name: "ندى فضيل",
          role: "محامية ومستشارة قانونية",
          focus: "استشارات قانونية متنوعة",
          bio: "مستشارة موثوقة في القضايا التجارية والمالية.",
          regions: "UAE/SUD/GCC",
          experience: "8 سنوات",
          rating: 88,
        };
      }
      if (number === 11) {
        return {
          ...p,
          name: "جهاد عبد الجواد",
          role: "محامٍ ومستشار قانوني",
          focus: "استشارات قانونية متنوعة",
          bio: "مستشار موثوق في قضايا الإعلام والإيجارات.",
          regions: "UAE/EGP/GCC",
          experience: "8 سنوات",
          rating: 84,
        };
      }
      if (number === 12) {
        return {
          ...p,
          name: "آية خالد",
          role: "محامية ومستشارة قانونية",
          focus: "استشارات قانونية متنوعة",
          bio: "مستشارة موثوقة في قضايا الإعلام والعقارات.",
          regions: "UAE/EGP/GCC",
          experience: "4 سنوات",
          rating: 86,
        };
      }
      if (number === 13) {
        return {
          ...p,
          name: "أحمد علي",
          role: "محامٍ ومستشار قانوني",
          focus: "استشارات قانونية متنوعة",
          bio: "مستشار موثوق في قضايا الجرائم والإعلام.",
          regions: "UAE/EGP/GCC",
          experience: "8 سنوات",
          rating: 84,
        };
      }
      if (number === 14) {
        return {
          ...p,
          name: "عصام حمزة",
          role: "محامٍ ومستشار قانوني",
          focus: "استشارات قانونية متنوعة",
          bio: "مستشار موثوق في قضايا الإيجار والعقارات.",
          regions: "UAE/EGP/GCC",
          experience: "8 سنوات",
          rating: 86,
        };
      }
      if (number === 15) {
        return {
          ...p,
          name: "إبراهيم أبو رويص",
          role: "مستشار أعمال",
          focus: "استشارات أعمال وشركات",
          bio: "مستشار موثوق في قضايا الأعمال والشركات.",
          regions: "UAE/EGP/GCC",
          experience: "8 سنوات",
          rating: 86,
        };
      }
      if (number === 16) {
        return {
          ...p,
          name: "أحمد أمين",
          role: "مستشار قانوني",
          focus: "استشارات قانونية متنوعة",
          bio: "مستشار موثوق في قضايا الإيجار والعقارات.",
          regions: "UAE/SUD/GCC",
          experience: "10 سنوات",
          rating: 90,
        };
      }
    }
    return p;
  });
  return (
    <div className="about-team-grid mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {teamData.map((p, idx) => (
        <motion.article
          key={p.name}
          className="group rounded-2xl surface border border-zinc-700/40 overflow-hidden transition flip-card"
          whileHover={{ y: -3, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          <div className="block relative" data-flipped={flipped === idx}>
            <div className="flip-inner h-80 md:h-64 lg:h-72">
              <div className="flip-front team-card-photo team-card-front relative h-80 md:h-64 lg:h-72 overflow-hidden">
                <Image
                  src={p.src}
                  alt={isRTL ? `صورة ${p.name}` : `${p.name} portrait`}
                  fill
                  className="team-photo object-cover object-center w-full h-full"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                  quality={85}
                  priority={false}
                  style={p.mobileFocal ? { objectPosition: p.mobileFocal, ["--mobile-focal" as any]: p.mobileFocal } : undefined}
                />
                <div className="absolute inset-0 gradient-overlay bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute top-2 left-2 z-20">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-zinc-700/40 text-[10px] font-extrabold text-zinc-500 transition-colors duration-200 group-hover:text-[var(--brand-accent)] group-hover:border-[var(--brand-accent)]/60 group-hover:bg-[var(--brand-accent)]/10">
                    {String(idx + 1 + startIndex).padStart(2, "0")}
                  </span>
                </div>
                <div className="absolute top-2 right-2 z-20 rounded-full bg-[var(--brand-accent)] text-black text-[10px] font-semibold px-2 py-0.5 shadow-[0_2px_10px_rgba(0,0,0,0.25)]">
                  {isRTL ? "مميز" : "Pro"}
                </div>
                <button
                  type="button"
                  onClick={() => toggleFlip(idx)}
                  className="absolute inset-0 z-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]/80"
                  aria-label={isRTL ? `عرض تفاصيل ${p.name}` : `Show ${p.name} details`}
                />
              </div>
              <div className="flip-back relative h-80 md:h-64 lg:h-72 overflow-visible" dir={isRTL ? "rtl" : "ltr"}>
                <div className="absolute top-2 left-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-zinc-700/40 text-[10px] font-extrabold text-zinc-500">
                    {String(idx + 1 + startIndex).padStart(2, "0")}
                  </span>
                </div>
                <div className="absolute top-2 right-2 rounded-full bg-[var(--brand-accent)] text-black text-[10px] font-semibold px-2 py-0.5">
                  {isRTL ? "مميز" : "Pro"}
                </div>
                <div className="min-h-full overflow-visible p-5 pt-8 flex flex-col">
                  <div className="text-center font-semibold text-white text-base">{p.name}</div>
                  <div className="mt-0.5 text-center text-sm text-zinc-300">{p.role}</div>
                  {p.tags && p.tags.length > 0 ? (
                    <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                      {p.tags.map((t) => (
                        <span key={t} className="rounded-lg chip px-2.5 py-1 text-xs text-zinc-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <div className="mt-3 text-center text-xs text-zinc-400">
                    <span className="inline-flex items-center justify-center gap-1">
                      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5">
                        <path fill="currentColor" d="M10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a1 1 0 0 1 1-1h3V4a2 2 0 0 1 2-2Zm4 4V4h-4v2h4Z" />
                      </svg>
                      <span>{isRTL ? `التخصص: ${p.focus}` : `Focus: ${p.focus}`}</span>
                    </span>
                  </div>
                  <p className="mt-2 text-center text-xs text-zinc-300 leading-6">
                    <span className="inline-flex items-start justify-center gap-1">
                      <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 h-3.5 w-3.5">
                        <path fill="currentColor" d="M6 2h7l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm7 1v4h4" />
                      </svg>
                      <span>{p.bio}</span>
                    </span>
                  </p>
                  <div className="mt-auto pt-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">{(p.regions || "").split("/").filter(Boolean).map((r) => (<span key={r} className="rounded-lg chip px-2 py-0.5 text-[10px] text-zinc-300">{r}</span>))}</div>
                      <div className="inline-flex items-center gap-1 rounded-lg bg-zinc-800/60 px-2 py-0.5 text-[10px] text-zinc-200">
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5">
                          <path fill="currentColor" d="M12 2a7 7 0 1 1 0 14A7 7 0 0 1 12 2Zm0 2a5 5 0 1 0 .001 10.001A5 5 0 0 0 12 4Zm-.5 2h1v4h-1V6Zm0 5h1v1h-1v-1Z"/>
                        </svg>
                        <span>{p.experience || (isRTL ? "خبرة" : "Exp")}</span>
                      </div>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-zinc-700/50 overflow-hidden">
                      <div className="h-full rounded-full bg-[var(--brand-accent)]" style={{ width: `${scoreFor(p)}%` }} />
                    </div>
                    <div className="mt-1 text-[10px] text-zinc-400 text-right">
                      <span>{isRTL ? "الاحترافية" : "Professionalism"} {scoreFor(p)}%</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleFlip(idx)}
                  className="absolute inset-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]/80"
                  aria-label={isRTL ? `إغلاق تفاصيل ${p.name}` : `Close ${p.name} details`}
                />
              </div>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
