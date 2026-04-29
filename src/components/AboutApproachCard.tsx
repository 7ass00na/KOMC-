"use client";
import { motion } from "framer-motion";

export default function AboutApproachCard({
  isRTL = false,
  title,
  body,
  steps = [],
  iconName = "roadmap",
  altAccent = false,
  repLines = [],
}: {
  isRTL?: boolean;
  title: string;
  body: string;
  steps?: string[];
  iconName?: "roadmap" | "target" | "flag";
  altAccent?: boolean;
  repLines?: string[];
}) {
  return (
    <motion.article
      className="relative h-full rounded-2xl surface border border-zinc-700/40 p-6 overflow-hidden"
      whileHover={{ y: -2, scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
    >
      <div className={`absolute top-0 ${isRTL ? "right-0" : "left-0"} h-full w-1 bg-gradient-to-b ${altAccent ? "from-[var(--brand-accent)]/30 via-[var(--brand-accent)]/15" : "from-[var(--brand-accent)]/60 via-[var(--brand-accent)]/25"} to-transparent`} />
      <div className={`pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:${altAccent ? "ring-[var(--brand-accent)]/30" : "ring-[var(--brand-accent)]/40"}`} />
      <div className={`${isRTL ? "text-right" : "text-left"}`}>
        <div className="inline-flex items-center gap-2">
          <span className="rounded-md bg-[var(--brand-accent)]/10 px-2 py-0.5 text-[11px] font-semibold text-[var(--brand-accent)] ring-1 ring-[var(--brand-accent)]/30">
            {title}
          </span>
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[var(--brand-accent)]/15 text-[var(--brand-accent)] ring-1 ring-[var(--brand-accent)]/30">
            {iconName === "target" ? (
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5">
                <path fill="currentColor" d="M12 2a1 1 0 0 1 1 1v1.062a7.94 7.94 0 0 1 6.938 6.938H21a1 1 0 1 1 0 2h-1.062A7.94 7.94 0 0 1 13 19.938V21a1 1 0 1 1-2 0v-1.062A7.94 7.94 0 0 1 4.062 13H3a1 1 0 1 1 0-2h1.062A7.94 7.94 0 0 1 11 4.062V3a1 1 0 0 1 1-1Zm0 4a6 6 0 1 0 0 12.001A6 6 0 0 0 12 6Zm0 3.5A2.5 2.5 0 1 1 9.5 12 2.5 2.5 0 0 1 12 9.5Z" />
              </svg>
            ) : iconName === "flag" ? (
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5">
                <path fill="currentColor" d="M5 3h1a1 1 0 0 1 1 1v1h10l-2 3 2 3H7v9H5V3Z" />
              </svg>
            ) : (
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5">
                <path fill="currentColor" d="M4 4h6v2H6v2h4v2H6v3h6v2H4V4Zm10 0h6v9h-3l-3 3V4Zm2 2v7.586L18.586 13H20V6h-4Z" />
              </svg>
            )}
          </span>
        </div>
        <p className="mt-3 text-sm leading-7 text-zinc-200">{body}</p>
        {repLines && repLines.length > 0 ? (
          <div className="mt-3 text-[11px] leading-5 text-zinc-300">
            <div>{repLines[0]}</div>
            {repLines[1] ? <div className="opacity-80">{repLines[1]}</div> : null}
          </div>
        ) : null}
      </div>
      {steps.length > 0 ? (
        <div className={`mt-5 flex ${isRTL ? "flex-row-reverse" : "flex-row"} items-center gap-4`}>
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="relative inline-flex h-2.5 w-2.5 items-center justify-center">
                  <span className="absolute h-2.5 w-2.5 rounded-full bg-[var(--brand-accent)]/70" />
                  <span className="absolute h-4 w-4 rounded-full bg-[var(--brand-accent)]/20" />
                </span>
                <span className="text-xs font-medium text-zinc-200">{s}</span>
              </div>
              {i < steps.length - 1 ? (
                <span className="h-px w-8 bg-gradient-to-r from-[var(--brand-accent)]/40 to-transparent" />
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </motion.article>
  );
}
