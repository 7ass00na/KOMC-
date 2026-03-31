"use client";
import Image from "next/image";
import { motion } from "framer-motion";

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
  return (
    <div className="about-team-grid mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {team.map((p, idx) => (
        <motion.article
          key={p.name}
          className="group rounded-2xl surface border border-zinc-700/40 overflow-hidden transition"
          whileHover={{ y: -3, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          <div className="relative h-56 md:h-44 overflow-hidden">
            <Image
              src={p.src}
              alt={isRTL ? `صورة ${p.name}` : `${p.name} portrait`}
              fill
              className="object-cover object-top md:object-center"
              sizes="(max-width: 768px) 100vw, 25vw"
              priority={false}
              style={p.mobileFocal ? { objectPosition: p.mobileFocal } : undefined}
            />
            <div className="absolute top-2 left-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-zinc-700/40 text-[10px] font-extrabold text-zinc-500 transition-colors duration-200 group-hover:text-[var(--brand-accent)] group-hover:border-[var(--brand-accent)]/60 group-hover:bg-[var(--brand-accent)]/10">
                {String(idx + 1 + startIndex).padStart(2, "0")}
              </span>
            </div>
            <div className="absolute top-2 right-2 rounded-full bg-[var(--brand-accent)] text-black text-[10px] font-semibold px-2 py-0.5 shadow-[0_2px_10px_rgba(0,0,0,0.25)]">
              {isRTL ? "مميز" : "Pro"}
            </div>
          </div>
          <div className="p-5">
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
          </div>
        </motion.article>
      ))}
    </div>
  );
}
