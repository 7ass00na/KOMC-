"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import AboutMissionValues from "./AboutMissionValues";

export default function AboutMissionValuesSection({
  isRTL = false,
  image,
  imageAlt,
  mission,
  values,
  badges,
  accentStripe = true,
  stats,
  valuesSteps,
  stacked = true,
  missionSteps,
  missionRepLines,
  valuesRepLines,
}: {
  isRTL?: boolean;
  image: string;
  imageAlt: string;
  mission: { title: string; body: string };
  values: { title: string; body: string };
  badges: string[];
  accentStripe?: boolean;
  stats?: Array<{ value: string; label: string }>;
  valuesSteps?: string[];
  stacked?: boolean;
  missionSteps?: string[];
  missionRepLines?: string[];
  valuesRepLines?: string[];
}) {
  const container = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };
  return (
    <section className="section no-section-bg about-mv mx-auto max-w-7xl px-5 py-16">
      <motion.div
        dir={isRTL ? "rtl" : "ltr"}
        className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-stretch"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={container}
      >
        <motion.div className={`${isRTL ? "order-2" : "order-1"} h-full`} variants={item}>
          <div className="group relative h-full overflow-hidden rounded-2xl">
            <div className="absolute inset-0 rounded-2xl ring-1 ring-zinc-700/50 group-hover:ring-[var(--brand-accent)]/50 transition" />
            <Image
              src={image}
              alt={imageAlt}
              width={1200}
              height={900}
              className="h-80 w-full rounded-2xl object-cover object-center opacity-90 md:h-full"
              priority={false}
            />
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
            {accentStripe ? (
              <div className="pointer-events-none absolute -left-10 -top-8 h-36 w-[160%] -rotate-12 bg-gradient-to-r from-[var(--brand-accent)]/18 via-transparent to-transparent md:h-44" />
            ) : null}
            {stats && stats.length > 0 ? (
              <div className={`mv-stats absolute top-4 ${isRTL ? "right-4" : "left-4"} rounded-xl bg-black/35 px-3 py-2 backdrop-blur ring-1 ring-white/10`}>
                <div className={`flex ${isRTL ? "flex-row-reverse" : "flex-row"} items-center gap-4`}>
                  {stats.map((s) => (
                    <div key={s.label} className={`${isRTL ? "text-right" : "text-left"}`}>
                      <div className="text-base font-extrabold text-white">{s.value}</div>
                      <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-300">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            <div className={`absolute ${isRTL ? "left-4" : "right-4"} bottom-4 flex flex-wrap gap-2`}>
              {badges.map((b) => (
                <span
                  key={b}
                  className="mv-badge rounded-full bg-[var(--brand-accent)]/15 px-3 py-1 text-xs font-semibold text-[var(--brand-accent)] ring-1 ring-[var(--brand-accent)]/30 backdrop-blur"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
        <motion.div className={`${isRTL ? "order-1" : "order-2"} h-full`} variants={item}>
          <div className="h-full">
            <AboutMissionValues
              isRTL={isRTL}
              mission={mission}
              values={values}
              layout={stacked ? "stacked" : "grid"}
              missionVariant="timeline"
              missionSteps={missionSteps}
              valuesVariant="timeline"
              valuesSteps={valuesSteps}
              missionRepLines={missionRepLines}
              valuesRepLines={valuesRepLines}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
