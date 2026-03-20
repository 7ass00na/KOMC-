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
      className="object-cover object-center"
      sizes="(max-width: 768px) 100vw, 33vw"
      onError={onError}
    />
  );
}

export default function TeamOverview() {
  const { t, lang } = useLanguage();
  type Person = {
    name: string;
    role: string;
    tags: string[];
    slug: string;
    focus: string;
    bio: string;
  };
  const items: Person[] =
    lang === "ar"
      ? [
          { name: "خالد عمر", role: "مستشار قانوني ، مالك", tags: ["بحري", "تنفيذ"], slug: "khaled-omer", focus: "بحري، استراتيجية، منازعات معقدة", bio: "مستشار موثوق في الأميرالية والتقاضي عالي المخاطر." },
          { name: " محمد دفع الله", role: "مدير المكتب", tags: ["إدارة", "تنفيذ"], slug: "Mohamed Daffa Allah", focus: "أميرالية، بضائع، حجز سفن", bio: "حلول سريعة وتنفيذ دقيق للقضايا." },
          { name: "مالك عمر", role: "مستشار شركات", tags: ["إدارة", "بحري"], slug: "Malik Omer", focus: "شركات، امتثال، معاملات", bio: "هيكلة صفقات وحوكمة بنهج عملي." },
          { name: "ابراهيم حسن", role: "محامية دعاوى", tags: ["منازعات", "تنفيذ"], slug: "nour-hassan", focus: "تقاضي، دعم التحكيم", bio: "إدارة نزاعات بكفاءة وإتقان للإجراءات." },
        ]
      : [
          { name: "Khaled Omer", role: "Managing Partner", tags: ["Maritime", "Enforcement"], slug: "khaled-omer", focus: "Maritime, Strategy, Complex Disputes", bio: "Trusted adviser on admiralty and high-stakes litigation." },
          { name: "Mohamed Daffa Allah", role: "Maritime Attorney", tags: ["Enforcement", "Manage"], slug: "Mohamed Daffa Allah", focus: "Admiralty, Cargo, Vessel Arrests", bio: "Delivers fast remedies and precise case execution." },
          { name: "Malik Omer", role: "Corporate Counsel", tags: ["Manage", "Maritime"], slug: "Malik Omer", focus: "Corporate, Compliance, Transactions", bio: "Structuring deals and governance with pragmatic advice." },
          { name: "Ibrahim Hassan", role: "Litigation Associate", tags: ["Disputes", "Arbitration"], slug: "nour-hassan", focus: "Litigation, Arbitration Support", bio: "Efficient dispute management and procedural mastery." },
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
          <motion.h2 className="text-3xl md:text-4xl font-extrabold text-[var(--brand-accent)]" variants={item} data-edit-key="team-overview-title">{t("teamTitle")}</motion.h2>
          <motion.p className="mt-1 text-sm text-zinc-300" variants={item} data-edit-key="team-overview-subtitle">
            {lang === "ar" ? "نخبة قانونية تقود النتائج" : "A legal team focused on outcomes"}
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
            <span>{lang === "ar" ? "تعرف على الفريق" : "Meet the team"}</span>
          </Link>
        </motion.div>
      </motion.div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((p, idx) => (
          <motion.div
            key={p.name}
            className="group rounded-2xl surface border border-zinc-700/40 overflow-hidden transition"
            variants={item}
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
          >
            <div className="block">
              <div className="relative h-40 overflow-hidden">
                <TeamPhoto slug={p.slug} alt={p.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute top-2 left-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-zinc-700/40 text-[10px] font-extrabold text-zinc-500 transition-colors duration-200 group-hover:text-[var(--brand-accent)] group-hover:border-[var(--brand-accent)]/60 group-hover:bg-[var(--brand-accent)]/10">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="absolute top-2 right-2 rounded-full bg-[var(--brand-accent)] text-black text-[10px] font-semibold px-2 py-0.5 shadow-[0_2px_10px_rgba(0,0,0,0.25)]">
                  {lang === "ar" ? "احترافي" : "Pro"}
                </div>
              </div>
              <div className="px-5 py-5">
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
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div className="mt-8 md:hidden" variants={item}>
        <Link href={`/${lang}/about`} className="inline-flex items-center rounded-lg bg-[var(--brand-accent)] text-black px-5 py-2.5 font-semibold hover:opacity-90">
          {t("aboutRead")}
        </Link>
      </motion.div>
    </motion.section>
  );
}
