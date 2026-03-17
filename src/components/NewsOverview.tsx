'use client';
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NewsOverview() {
  const { lang } = useLanguage();
  const posts =
    lang === "ar"
      ? [
          {
            title: "فهم مطالبات تأمين الملاحة البحرية: دليل شامل",
            desc: "خرائط للغطاء، ونقاط المطالبة الشائعة، وكيفية تقليل خسائر التعويض.",
            tag: "قانون بحري",
            date: "2026-02-01",
            readTime: "8 دقائق قراءة",
            image: "/images/Case/shiping%20cont.jpg",
          },
          {
            title: "الامتثال التجاري في 2026: أهم التغييرات",
            desc: "كيف تؤثر التحديثات التنظيمية على العقود والحوكمة.",
            tag: "امتثال",
            date: "2026-01-20",
            readTime: "5 دقائق قراءة",
            image: "/images/Services/Trade1.jpg",
          },
          {
            title: "حل نزاعات التجارة الدولية",
            desc: "خطوات عملية لإدارة المخاطر وتسريع التسويات.",
            tag: "تحكيم",
            date: "2026-01-05",
            readTime: "6 دقائق قراءة",
            image: "/images/Services/Insurance.jpg",
          },
        ]
      : [
          {
            title: "Understanding Maritime Insurance Claims: A Complete Guide",
            desc: "Coverage maps, common pitfalls, and how to recover faster.",
            tag: "Maritime Law",
            date: "2026-02-01",
            readTime: "8 min read",
            image: "/images/Case/shiping%20cont.jpg",
          },
          {
            title: "Corporate Compliance in 2026: Key Changes",
            desc: "How regulatory updates affect contracts and governance.",
            tag: "Compliance",
            date: "2026-01-20",
            readTime: "5 min read",
            image: "/images/Services/Trade1.jpg",
          },
          {
            title: "Resolving International Trade Disputes",
            desc: "Actionable steps to reduce exposure and settle faster.",
            tag: "Arbitration",
            date: "2026-01-05",
            readTime: "6 min read",
            image: "/images/Services/Insurance.jpg",
          },
        ];
  const container = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { staggerChildren: 0.07 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };
  const fmt = (iso?: string) =>
    iso
      ? new Intl.DateTimeFormat(lang === "ar" ? "ar" : "en", { year: "numeric", month: "short", day: "numeric" }).format(new Date(iso))
      : null;
  const title = lang === "ar" ? "معرفة قانونية وتحديثات" : "Legal Knowledge & Updates";
  const subtitle =
    lang === "ar"
      ? "ابقَ على اطلاع بتحليلات الخبراء في القانون البحري والامتثال وأفضل الممارسات."
      : "Stay informed with expert analysis on maritime law, corporate regulations, and legal best practices.";
  const viewAll = lang === "ar" ? "عرض كل المقالات" : "View All Articles";
  const newsHref = `/${lang}/news`;
  return (
    <motion.section
      id="news"
      className="relative section no-section-bg mx-auto max-w-7xl px-5 py-20 cards-ink"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={container}
    >
      <div className="relative rounded-3xl surface p-6 md:p-10">
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(120%_120%_at_12%_0%,rgba(225,188,137,0.28),transparent_60%)] opacity-70 dark:opacity-25" />
        <motion.div className={`relative z-10 ${lang === "ar" ? "text-right" : "text-left"}`} variants={item}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <motion.h2 className="text-3xl md:text-4xl font-extrabold text-[var(--ink-primary)]" variants={item} data-edit-key="news-overview-title">{title}</motion.h2>
            <motion.div variants={item}>
              <Link
                href={newsHref}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-accent)] text-black px-5 py-2.5 font-semibold hover:opacity-90 transition-transform duration-200 will-change-transform hover:-translate-y-0.5 active:scale-95 shadow-md"
              >
                {viewAll}
                <span>→</span>
              </Link>
            </motion.div>
          </div>
          <motion.p className="mt-3 text-sm text-[var(--text-secondary)]" variants={item} data-edit-key="news-overview-subtitle">
            {subtitle}
          </motion.p>
        </motion.div>
        <div className="relative z-10 mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
          <motion.div variants={item}>
            <Link
              href={newsHref}
              className="group relative flex min-h-[320px] lg:min-h-[504px] flex-col justify-end overflow-hidden rounded-2xl surface p-6 md:p-8"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-[1.03]"
                style={{ backgroundImage: `url('${posts[0].image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1326]/95 via-[#0a1326]/45 to-transparent" />
              <div className="relative z-10">
                <div className="insight-badge inline-flex items-center rounded-full bg-black/35 px-3 py-1 text-xs text-white dark:bg-[var(--brand-accent)] dark:text-black">
                  {posts[0].tag}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                  <span>{fmt(posts[0].date)}</span>
                  <span>•</span>
                  <span>{posts[0].readTime}</span>
                </div>
                <div className="insight-title mt-3 text-2xl font-semibold text-white" data-edit-key="news-featured-title">{posts[0].title}</div>
                <div className="mt-3 text-sm text-slate-200" data-edit-key="news-featured-desc">{posts[0].desc}</div>
              </div>
            </Link>
          </motion.div>
          <div className="grid gap-6">
              {posts.slice(1).map((p, i) => (
              <motion.div key={p.title} variants={item}>
                <Link
                  href={newsHref}
                  className="group relative flex min-h-[220px] lg:min-h-[240px] flex-col justify-end overflow-hidden rounded-2xl surface p-5"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-[1.03]"
                    style={{ backgroundImage: `url('${p.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1326]/95 via-[#0a1326]/50 to-transparent" />
                  <div className="relative z-10">
                <div className="insight-badge inline-flex items-center rounded-full bg-black/35 px-3 py-1 text-[10px] text-white dark:bg-[var(--brand-accent)] dark:text-black">
                      {p.tag}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-300">
                      <span>{fmt(p.date)}</span>
                      <span>•</span>
                      <span>{p.readTime}</span>
                    </div>
                    <div className="insight-title mt-3 text-lg font-semibold text-white" data-edit-key={`news-card-title-${i+1}`}>{p.title}</div>
                    <div className="mt-2 text-xs text-slate-200" data-edit-key={`news-card-desc-${i+1}`}>{p.desc}</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
