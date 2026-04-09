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
};

export default function AboutTeamGrid({ team, isRTL = false, startIndex = 0 }: { team: TeamMember[]; isRTL?: boolean; startIndex?: number }) {
  const [flipped, setFlipped] = useState<number | null>(null);
  const toggleFlip = (idx: number) => setFlipped((v) => (v === idx ? null : idx));
  const scoreFor = (name: string) => {
    const map: Record<string, number> = {
      "Khaled Omar": 95,
      "Mohammed Dafallah": 88,
      "Malik Omar": 92,
      "Ibrahim Abu Ruyas": 90,
      "خالد عمر": 95,
      "محمد دفع الله": 88,
      "مالك عمر": 92,
      "إبراهيم أبو روياس": 90,
    };
    const v = map[name] ?? 82;
    return Math.min(95, Math.max(75, v));
  };
  const credFor = (name: string) => {
    const map: Record<string, string> = {
      "Khaled Omar": isRTL ? "25 سنة" : "25y",
      "Mohammed Dafallah": isRTL ? "10 سنوات" : "10y",
      "Malik Omar": isRTL ? "18 سنة" : "18y",
      "Ibrahim Abu Ruyas": isRTL ? "15 سنة" : "15y",
      "خالد عمر": isRTL ? "25 سنة" : "25y",
      "محمد دفع الله": isRTL ? "10 سنوات" : "10y",
      "مالك عمر": isRTL ? "18 سنة" : "18y",
      "إبراهيم أبو روياس": isRTL ? "15 سنة" : "15y",
    };
    return map[name] ?? (isRTL ? "5 سنوات" : "5y");
  };
  const regionsFor = (name: string) => {
    const ar = (arr: string[]) => arr;
    const en = (arr: string[]) => arr;
    const map: Record<string, string[]> = {
      "Khaled Omar": isRTL ? ar(["الإمارات","السعودية","مصر","الخليج"]) : en(["UAE","Saudi Arabia","Egypt","GCC"]),
      "Mohammed Dafallah": isRTL ? ar(["الإمارات","مصر","الخليج"]) : en(["UAE","Egypt","GCC"]),
      "Malik Omar": isRTL ? ar(["الإمارات","مصر","الخليج"]) : en(["United Arab Emirates","Egypt","GCC"]),
      "Ibrahim Abu Ruyas": isRTL ? ar(["الإمارات","جنوب مصر","مصر"]) : en(["United Arab Emirates","Southern Egypt","Egypt"]),
      "خالد عمر": ar(["الإمارات","السعودية","مصر","الخليج"]),
      "محمد دفع الله": ar(["الإمارات","مصر","الخليج"]),
      "مالك عمر": ar(["الإمارات","مصر","الخليج"]),
      "إبراهيم أبو روياس": ar(["الإمارات","جنوب مصر","مصر"]),
    };
    return map[name] ?? (isRTL ? ["الإمارات","الخليج"] : ["UAE","GCC"]);
  };
  return (
    <div className="about-team-grid mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {team.map((p, idx) => (
        <motion.article
          key={p.name}
          className="group rounded-2xl surface border border-zinc-700/40 overflow-hidden transition flip-card"
          whileHover={{ y: -3, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          <div className="block relative" data-flipped={flipped === idx}>
            <div className="flip-inner h-72 md:h-56">
              <div className="flip-front team-card-photo team-card-front relative h-72 md:h-56 overflow-hidden">
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
              <div className="flip-back relative h-72 md:h-56 overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
                <div className="absolute top-2 left-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-zinc-700/40 text-[10px] font-extrabold text-zinc-500">
                    {String(idx + 1 + startIndex).padStart(2, "0")}
                  </span>
                </div>
                <div className="absolute top-2 right-2 rounded-full bg-[var(--brand-accent)] text-black text-[10px] font-semibold px-2 py-0.5">
                  {isRTL ? "مميز" : "Pro"}
                </div>
                <div className="h-full overflow-visible p-5 pt-8 flex flex-col">
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
                      <div className="flex flex-wrap items-center gap-2">
                        {regionsFor(p.name).map((r) => (
                          <span key={r} className="rounded-lg chip px-2 py-0.5 text-[10px] text-zinc-300">{r}</span>
                        ))}
                      </div>
                      <div className="inline-flex items-center gap-1 rounded-lg bg-zinc-800/60 px-2 py-0.5 text-[10px] text-zinc-200">
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5">
                          <path fill="currentColor" d="M12 2a7 7 0 1 1 0 14A7 7 0 0 1 12 2Zm0 2a5 5 0 1 0 .001 10.001A5 5 0 0 0 12 4Zm-.5 2h1v4h-1V6Zm0 5h1v1h-1v-1Z"/>
                        </svg>
                        <span>{credFor(p.name)}</span>
                      </div>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-zinc-700/50 overflow-hidden">
                      <div className="h-full rounded-full bg-[var(--brand-accent)]" style={{ width: `${scoreFor(p.name)}%` }} />
                    </div>
                    <div className="mt-1 text-[10px] text-zinc-400 text-right">
                      <span>{isRTL ? "الاحترافية" : "Professionalism"} {scoreFor(p.name)}%</span>
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
