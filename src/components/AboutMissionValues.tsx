"use client";
import { motion } from "framer-motion";
import AboutApproachCard from "./AboutApproachCard";

function Card({
  title,
  body,
  icon,
  isRTL,
  repLines = [],
}: {
  title: string;
  body: string;
  icon: "target" | "shield";
  isRTL?: boolean;
  repLines?: string[];
}) {
  return (
    <motion.article
      className="group relative h-full overflow-hidden rounded-2xl surface border border-zinc-700/40 p-6"
      whileHover={{ y: -2, scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-[var(--brand-accent)]/50" />
      <div className={`flex items-start ${isRTL ? "flex-row-reverse text-right" : "flex-row text-left"} gap-4`}>
        <div className="shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-accent)]/15 text-[var(--brand-accent)] ring-1 ring-[var(--brand-accent)]/30">
            {icon === "target" ? (
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
                <path fill="currentColor" d="M12 2a1 1 0 0 1 1 1v1.062a7.94 7.94 0 0 1 6.938 6.938H21a1 1 0 1 1 0 2h-1.062A7.94 7.94 0 0 1 13 19.938V21a1 1 0 1 1-2 0v-1.062A7.94 7.94 0 0 1 4.062 13H3a1 1 0 1 1 0-2h1.062A7.94 7.94 0 0 1 11 4.062V3a1 1 0 0 1 1-1Zm0 4a6 6 0 1 0 0 12.001A6 6 0 0 0 12 6Zm0 3.5A2.5 2.5 0 1 1 9.5 12 2.5 2.5 0 0 1 12 9.5Z" />
              </svg>
            ) : (
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
                <path fill="currentColor" d="M12 2 4 6v6c0 5 4.5 8 8 10 3.5-2 8-5 8-10V6l-8-4Zm0 2.2L18 7v5c0 3.6-2.95 6.08-6 7.86C8.95 18.07 6 15.6 6 12V7l6-2.8Zm-1 9.3 5-5 1.4 1.4-6.4 6.4-3-3L9.4 11.5Z" />
              </svg>
            )}
          </div>
        </div>
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2">
            <span className="rounded-md bg-[var(--brand-accent)]/15 px-2 py-0.5 text-[11px] font-semibold text-[var(--brand-accent)] ring-1 ring-[var(--brand-accent)]/30">
              {title}
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
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[var(--brand-accent)]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </motion.article>
  );
}

export default function AboutMissionValues({
  isRTL = false,
  mission,
  values,
  layout = "grid",
  valuesVariant = "chip",
  valuesSteps,
  missionVariant = "timeline",
  missionSteps,
  missionAccentAlt = true,
  missionRepLines,
  valuesRepLines,
}: {
  isRTL?: boolean;
  mission: { title: string; body: string };
  values: { title: string; body: string };
  layout?: "grid" | "stacked";
  valuesVariant?: "chip" | "timeline";
  valuesSteps?: string[];
  missionVariant?: "chip" | "timeline";
  missionSteps?: string[];
  missionAccentAlt?: boolean;
  missionRepLines?: string[];
  valuesRepLines?: string[];
}) {
  if (layout === "stacked") {
    return (
      <div className="mt-6 md:mt-0 grid grid-cols-1 gap-6 md:h-full md:grid-rows-2">
        {missionVariant === "timeline" ? (
          <AboutApproachCard isRTL={isRTL} title={mission.title} body={mission.body} steps={missionSteps ?? []} iconName="target" altAccent={missionAccentAlt} repLines={missionRepLines ?? []} />
        ) : (
          <Card title={mission.title} body={mission.body} icon="target" isRTL={isRTL} repLines={missionRepLines ?? []} />
        )}
        {valuesVariant === "timeline" ? (
          <AboutApproachCard isRTL={isRTL} title={values.title} body={values.body} steps={valuesSteps ?? []} repLines={valuesRepLines ?? []} />
        ) : (
          <Card title={values.title} body={values.body} icon="shield" isRTL={isRTL} repLines={valuesRepLines ?? []} />
        )}
      </div>
    );
  }
  return (
    <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
      {missionVariant === "timeline" ? (
        <AboutApproachCard isRTL={isRTL} title={mission.title} body={mission.body} steps={missionSteps ?? []} iconName="target" altAccent={missionAccentAlt} repLines={missionRepLines ?? []} />
      ) : (
        <Card title={mission.title} body={mission.body} icon="target" isRTL={isRTL} repLines={missionRepLines ?? []} />
      )}
      {valuesVariant === "timeline" ? (
        <AboutApproachCard isRTL={isRTL} title={values.title} body={values.body} steps={valuesSteps ?? []} repLines={valuesRepLines ?? []} />
      ) : (
        <Card title={values.title} body={values.body} icon="shield" isRTL={isRTL} repLines={valuesRepLines ?? []} />
      )}
    </div>
  );
}

