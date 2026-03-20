"use client";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function CasesOverview({ variant = "home" }: { variant?: "home" | "page" }) {
  const { t, lang } = useLanguage();
  const [taxonomy, setTaxonomy] = useState<{ tags: string[]; categories: { news: string[]; cases: string[] } } | null>(null);
  useEffect(() => {
    fetch("/api/admin/taxonomy", { cache: "no-store" }).then((r) => r.json()).then((d) => setTaxonomy(d)).catch(() => {});
  }, []);
  const searchParams = useSearchParams();
  type CaseItem = { id: string; title: string; desc: string; date: string; views: number; tags: string[] };
  const items: CaseItem[] =
    lang === "ar"
      ? [
          { id: "arrest", title: "حجز سفينة ناجح", desc: "تنفيذ سريع لحماية الحقوق.", date: "2026-02-14", views: 1240, tags: ["maritime", "enforcement"] },
          { id: "charter", title: "نزاع عقد شحن", desc: "تسوية تحكيم بتعويض مناسب.", date: "2026-01-18", views: 980, tags: ["maritime", "arbitration"] },
          { id: "compliance", title: "امتثال سلسلة توريد", desc: "خفض المخاطر بإطار حوكمة.", date: "2025-12-05", views: 760, tags: ["compliance", "trade"] },
          { id: "recovery", title: "استرداد أضرار البضائع", desc: "تعويض خسائر بشحنات تالفة.", date: "2025-11-10", views: 650, tags: ["claims", "maritime"] },
          { id: "collision", title: "توزيع مسؤولية التصادم", desc: "تقسيم الخطأ واسترداد تغطية الهيكل.", date: "2025-10-02", views: 540, tags: ["collision", "maritime", "litigation"] },
        ]
      : [
          { id: "arrest", title: "Successful Vessel Arrest", desc: "Rapid execution to secure rights.", date: "2026-02-14", views: 1240, tags: ["maritime", "enforcement"] },
          { id: "charter", title: "Shipping Contract Dispute", desc: "Arbitration settlement with fair damages.", date: "2026-01-18", views: 980, tags: ["maritime", "arbitration"] },
          { id: "compliance", title: "Supply Chain Compliance", desc: "Risk reduction via governance framework.", date: "2025-12-05", views: 760, tags: ["compliance", "trade"] },
          { id: "recovery", title: "Cargo Damage Recovery", desc: "Recovered losses for damaged shipments.", date: "2025-11-10", views: 650, tags: ["claims", "maritime"] },
          { id: "collision", title: "Collision Liability Apportionment", desc: "Fault split and hull recovery.", date: "2025-10-02", views: 540, tags: ["collision", "maritime", "litigation"] },
        ];
  const tagLabels: Record<string, string> =
    lang === "ar"
      ? {
          maritime: "بحري",
          enforcement: "تنفيذ",
          arbitration: "تحكيم",
          compliance: "امتثال",
          trade: "تجارة",
          claims: "مطالبات",
          collision: "تصادم",
          litigation: "تقاضي",
        }
      : {
          maritime: "Maritime",
          enforcement: "Enforcement",
          arbitration: "Arbitration",
          compliance: "Compliance",
          trade: "Trade",
          claims: "Claims",
          collision: "Collision",
          litigation: "Litigation",
        };
  const homeConfig: Array<CaseItem["id"]> = ["arrest", "charter", "compliance", "recovery", "collision"];
  const initialTag = variant === "page" ? searchParams.get("tag") : null;
  const [selectedTag, setSelectedTag] = useState<string | null>(initialTag);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const pool: CaseItem[] =
    variant === "page"
      ? selectedTag
        ? items.filter((i) => i.tags.includes(selectedTag))
        : items
      : homeConfig
          .map((id) => items.find((i) => i.id === id))
          .filter((x): x is CaseItem => Boolean(x));
  // page resets handled when tag changes via handleTagChange()
  const displayPool =
    variant === "page" && !selectedTag ? (page === 1 ? pool.slice(0, 6) : pool.slice(6)) : pool;
  const fmtDate = (iso: string) =>
    new Intl.DateTimeFormat(lang === "ar" ? "ar" : "en", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }).format(new Date(iso));
  const chipRowJustify = lang === "ar" ? "justify-center md:justify-center lg:justify-end" : "justify-center md:justify-center lg:justify-start";
  const chipInnerJustify = lang === "ar" ? "justify-center md:justify-center lg:justify-end" : "justify-center md:justify-center lg:justify-start";
  const chipOffsetClass = lang === "ar" ? "lg:ml-auto" : "lg:mr-auto";
  const chipDirection = lang === "ar" ? "lg:flex-row-reverse" : "lg:flex-row";
  const details =
    lang === "ar"
      ? {
          arrest: {
            headline: "حجز سفينة خلال 48 ساعة وتأمين الضمان كاملاً",
            summary:
              "تحرك سريع في نزاع بحري نتج عنه حجز ناجح وتأمين ضمان يعادل المطالبة بالكامل، مما أدى إلى تسوية مبكرة ووفورات كبيرة في التكاليف.",
            chips: ["العميل: مالك سفينة", "الاختصاص: الإمارات", "القطاع: الشحن البحري"],
            challenge: ["مطالبة متنازع عليها ومخاطر تهرب", "مهلة زمنية ضيقة"],
            approach: ["صياغة عاجلة للطلب والأدلة", "تنسيق مع سلطات الميناء", "تأمين الضمان والمفاوضات"],
            metrics: { time: "48h", timeLbl: "الحجز", sec: "100%", secLbl: "الضمان", settle: "مبكر", settleLbl: "تسوية" },
          },
          charter: {
            headline: "تسوية نزاع عقد شحن بتحكيم عادل",
            summary:
              "إستراتيجية تراعي أداء السفينة والتأخير أدت إلى تعويض مناسب وتسوية فعالة في إطار التحكيم.",
            chips: ["العميل: مستأجر", "الاختصاص: الإمارات", "القطاع: الشحن"],
            challenge: ["خلاف على الأداء والتأخير", "وثائق متنازع عليها"],
            approach: ["تحليل بنود العقد", "تجميع الأدلة الفنية", "تفاوض قبل الجلسات"],
            metrics: { time: "8w", timeLbl: "الإطار", sec: "—", secLbl: "الضمان", settle: "عادل", settleLbl: "النتيجة" },
          },
          compliance: {
            headline: "إطار امتثال لسلسلة التوريد يقلل المخاطر",
            summary:
              "تطبيق ضوابط العقوبات والتحقق من الأطراف أدى إلى تقليل التعرض للمخاطر وتسريع العمليات.",
            chips: ["العميل: شركة لوجستية", "النطاق: الخليج", "القطاع: التجارة"],
            challenge: ["مخاطر عقوبات متعددة الاختصاص", "نواقص في المستندات"],
            approach: ["فحص الأطراف", "تحديث إجراءات العمل", "تدريب الفرق"],
            metrics: { time: "30d", timeLbl: "التنفيذ", sec: "↓", secLbl: "المخاطر", settle: "سريع", settleLbl: "التشغيل" },
          },
          recovery: {
            headline: "استرداد أضرار بضائع بتعويض كامل للمطالبة",
            summary:
              "إدارة مطالبات فعّالة وتوثيق دقيق أدّت إلى تعويض أضرار بضائع بالكامل لصالح العميل.",
            chips: ["العميل: مستورد", "الاختصاص: الإمارات", "القطاع: الشحن"],
            challenge: ["نزاع على مسؤولية الضرر", "نقص في مستندات النقل"],
            approach: ["تتبع السلسلة اللوجستية", "تقارير خبراء فنيين", "تفاوض مع المؤمن"],
            metrics: { time: "6w", timeLbl: "المدة", sec: "100%", secLbl: "التعويض", settle: "ناجح", settleLbl: "النتيجة" },
          },
          collision: {
            headline: "توزيع مسؤولية تصادم بسابقة قضائية مؤثرة",
            summary:
              "تحليل ملاحي وخبرات فنية أدى إلى توزيع عادل للمسؤولية واسترداد تغطية هيكلية للعميل.",
            chips: ["العميل: مالك سفينة", "الاختصاص: الخليج", "القطاع: الملاحة"],
            challenge: ["تنازع على أسباب الحادث", "بيانات ملاحية متضاربة"],
            approach: ["تحليل سجلات AIS", "تقارير خبراء مستقلين", "مرافعات محكمة دقيقة"],
            metrics: { time: "10w", timeLbl: "المدة", sec: "جزئي", secLbl: "التغطية", settle: "مفيد", settleLbl: "الأثر" },
          },
        }
      : {
          arrest: {
            headline: "Vessel Arrest in 48h with Full Security Secured",
            summary:
              "Rapid action led to a successful arrest and security matching the full claim, enabling early settlement and cost savings.",
            chips: ["Client: Ship Owner", "Jurisdiction: UAE", "Industry: Maritime Shipping"],
            challenge: ["Disputed claim with flight risk", "Very tight time window"],
            approach: ["Expedited arrest pleadings & evidence", "Port authority coordination", "Security and negotiation"],
            metrics: { time: "48h", timeLbl: "Arrest", sec: "100%", secLbl: "Security", settle: "Early", settleLbl: "Settlement" },
          },
          charter: {
            headline: "Charterparty Dispute Resolved via Fair Arbitration",
            summary:
              "Strategy around vessel performance and delays delivered a fair award and efficient resolution.",
            chips: ["Client: Charterer", "Jurisdiction: UAE", "Industry: Shipping"],
            challenge: ["Performance and delay dispute", "Contested documents"],
            approach: ["Clause analysis", "Technical evidence pack", "Pre‑hearing negotiation"],
            metrics: { time: "8w", timeLbl: "Timeline", sec: "—", secLbl: "Security", settle: "Fair", settleLbl: "Outcome" },
          },
          compliance: {
            headline: "Supply Chain Compliance Framework Reduces Exposure",
            summary:
              "Sanctions controls and party screening reduced risk and accelerated throughput.",
            chips: ["Client: Logistics Co.", "Region: GCC", "Industry: Trade"],
            challenge: ["Multi‑jurisdiction sanctions risk", "Document gaps"],
            approach: ["Party screening", "Process updates", "Team training"],
            metrics: { time: "30d", timeLbl: "Rollout", sec: "↓", secLbl: "Risk", settle: "Faster", settleLbl: "Ops" },
          },
          recovery: {
            headline: "Full Recovery on Cargo Damage Claim",
            summary:
              "Effective claim management and evidence secured a full recovery for cargo damage.",
            chips: ["Client: Importer", "Jurisdiction: UAE", "Industry: Shipping"],
            challenge: ["Liability dispute on damage", "Gaps in carriage documents"],
            approach: ["Logistics chain tracing", "Independent technical reports", "Negotiation with insurer"],
            metrics: { time: "6w", timeLbl: "Timeline", sec: "100%", secLbl: "Recovery", settle: "Successful", settleLbl: "Outcome" },
          },
          collision: {
            headline: "Collision Liability Fairly Apportioned with Favorable Recovery",
            summary:
              "Navigational analysis and expert evidence secured a fair split of fault and hull recovery.",
            chips: ["Client: Ship Owner", "Region: Gulf", "Industry: Navigation"],
            challenge: ["Dispute over causation", "Conflicting navigational data"],
            approach: ["AIS track analysis", "Independent expert reports", "Precise court advocacy"],
            metrics: { time: "10w", timeLbl: "Timeline", sec: "Partial", secLbl: "Coverage", settle: "Favorable", settleLbl: "Impact" },
          },
        };
  const latestId = (pool.length ? pool : items).reduce((a, b) =>
    new Date(b.date).valueOf() > new Date(a.date).valueOf() ? b : a
  ).id;
  const qParam = searchParams.get("case");
  const initialSelected =
    variant === "page" && qParam && (selectedTag ? pool : items).find((i) => i.id === qParam) ? qParam : latestId;
  const [selected, setSelected] = useState<string | null>(initialSelected);
  const selectedItem = selected ? items.find((i) => i.id === selected) : undefined;
  const selectedDetails = selected ? details[selected as keyof typeof details] : undefined;
  const imageFor = (id: string) => {
    if (id === "arrest") return "/images/Services/cargoArrest.jpg";
    if (id === "charter") return "/images/Case/shiping cont.jpg";
    if (id === "compliance") return "/images/Case/Supply Ch.jpg";
    if (id === "recovery") return "/images/Case/Vessel arrest.jpg";
    if (id === "collision") return "/images/Case/shiping cont.jpg";
    return "/images/Case/Vessel arrest.jpg";
  };
  const legalDescText = (id: string) => {
    if (lang === "ar") {
      if (id === "arrest")
        return "أحدث إنجاز قانوني يعكس سرعتنا ودقتنا في حماية حقوق عملائنا من خلال إجراءات حجز فعّالة وتنسيق مؤسسي منضبط لتحقيق نتيجة مؤكدة.";
      if (id === "charter")
        return "وصف قانوني موجز لقضية ناجحة في نزاع عقد شحن؛ تحليل بنود العقد والأدلة الفنية والتفاوض المنهجي قاد إلى نتيجة عادلة ومتوازنة.";
      if (id === "compliance")
        return "طورنا إطار امتثال عملي يدمج فحص الأطراف وضوابط العقوبات ضمن العمليات، ما دعم الحوكمة وخفّض التعرض للمخاطر التشغيلية والقانونية.";
      if (id === "recovery")
        return "قضية استرداد أضرار بضائع ناجحة؛ إثبات رابطة السببية وتحصيل التعويض الكامل عبر توثيق متخصص وتقارير خبراء وتفاوض مدروس.";
      return "";
    }
    if (id === "arrest")
      return "A concise legal narrative of a recent success: swift and precise arrest measures safeguarded client rights through disciplined filings and authority coordination.";
    if (id === "charter")
      return "A successful outcome in a charterparty dispute achieved via clause interpretation, technical evidence, and structured negotiation to secure a fair resolution.";
    if (id === "compliance")
      return "Delivered a pragmatic compliance framework that embeds party screening and sanctions controls into operations, strengthening governance and reducing exposure.";
    if (id === "recovery")
      return "Secured full recovery on cargo damage by proving causation and liability, leveraging expert documentation and focused engagement with the insurer.";
    return "";
  };
  const handleSelect = (id: string) => {
    setSelected(id);
  };
  const handleTagChange = (tag: string | null) => {
    if (variant !== "page") return;
    setSelectedTag(tag);
    setPage(1);
    const nextPool = tag ? items.filter((i) => i.tags.includes(tag)) : items;
    if (nextPool.length > 0) {
      const newest = nextPool.reduce((a, b) =>
        new Date(b.date).valueOf() > new Date(a.date).valueOf() ? b : a
      ).id;
      setSelected(newest);
    } else {
      setSelected(null);
    }
  };
  const [copied, setCopied] = useState(false);
  const copyShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  const handleSelectWithTag = (id: string, tag?: string) => {
    setSelected(id);
    if (variant === "page" && tag) {
      setSelectedTag(tag);
      setPage(1);
    }
  };
  const timelineFor = (id: string) => {
    if (lang === "ar") {
      if (id === "arrest") return ["تعليمات العميل", "إعداد الأدلة", "تقديم الطلب والتنسيق", "تأمين الضمان", "تسوية مبكرة"];
      if (id === "charter") return ["إشعار النزاع", "مذكرات ومرافعات", "تبادل الأدلة", "جلسات الاستماع", "حكم/تسوية"];
      if (id === "compliance") return ["تقييم المخاطر", "فحص الأطراف", "تحديث الإجراءات", "تدريب الفرق", "مراجعة مستمرة"];
      if (id === "recovery") return ["قبول المطالبة", "توثيق الضرر", "مخاطبة المؤمن", "التفاوض", "التحصيل"];
      if (id === "collision") return ["التحقيق الأولي", "تحليل AIS", "تقارير الخبراء", "المرافعات", "حكم/تسوية"];
      return [];
    }
    if (id === "arrest") return ["Client instruction", "Evidence prep", "Filing & coordination", "Security secured", "Early settlement"];
    if (id === "charter") return ["Notice of dispute", "Memorials", "Evidence exchange", "Hearings", "Award/Settlement"];
    if (id === "compliance") return ["Risk assessment", "Party screening", "SOP updates", "Team training", "Ongoing review"];
    if (id === "recovery") return ["Claim intake", "Damage documentation", "Insurer engagement", "Negotiation", "Recovery"];
    if (id === "collision") return ["Initial investigation", "AIS analysis", "Expert reports", "Pleadings", "Judgment/Settlement"];
    return [];
  };
  const groundsFor = (id: string) => {
    if (lang === "ar") {
      if (id === "arrest")
        return ["قانون التجارة البحرية الإماراتي: أحكام الحجز", "قواعد الإثبات: أساس المسؤولية والضمان", "بنود العقد ذات الصلة"];
      if (id === "charter")
        return ["بنود عقد الشحن: الأداء والتأخير", "قواعد التحكيم المؤسسية", "مبادئ تعويض الضرر"];
      if (id === "compliance")
        return ["سياسات العقوبات المتعددة الاختصاص", "إجراءات اعرف عميلك", "ضوابط الامتثال الداخلية"];
      if (id === "recovery")
        return ["مسؤولية الناقل البحري", "شروط التأمين البحري", "أحكام إثبات الضرر والسببية"];
      if (id === "collision")
        return ["قواعد الملاحة الدولية", "مسؤولية التصادم البحري", "مبادئ توزيع الخطأ"];
      return [];
    }
    if (id === "arrest") return ["UAE Maritime Code: arrest provisions", "Evidence rules: liability & security", "Relevant contract clauses"];
    if (id === "charter") return ["Charterparty clauses: performance/delay", "Institutional arbitration rules", "Damages principles"];
    if (id === "compliance") return ["Multi‑jurisdiction sanctions policies", "KYC/AML procedures", "Internal compliance controls"];
    if (id === "recovery") return ["Carrier liability", "Marine insurance terms", "Proof of damage and causation"];
    if (id === "collision") return ["COLREGS navigational rules", "Maritime collision liability", "Fault apportionment principles"];
    return [];
  };
  return (
    <section id="cases" className="section-strong cards-ink no-section-bg mx-auto max-w-7xl px-5 py-20">
      {variant === "page" ? (
        <>
          <h1 className={`text-4xl md:text-5xl font-extrabold text-[var(--brand-accent)] ${lang === "ar" ? "text-right" : "text-left"}`} data-edit-key="cases-hero-title">
            {lang === "ar" ? "دراسات حالة" : "Case Studies"}
          </h1>
          <p className={`mt-2 text-zinc-300 ${lang === "ar" ? "text-right" : "text-left"}`} data-edit-key="cases-hero-subtitle">
            {lang === "ar" ? (
              <>
                دراسات حالة قانونية ممثِّلة تُبرز الإستراتيجية والإجراءات عبر مجالاتنا.
                <br />
                كل دراسة تلخص الوقائع والمنهج والنتيجة لتقديم فهم عملي.
              </>
            ) : (
              <>
                Representative legal case studies showing strategy and procedure across our practice.
                <br />
                Each summary distills facts, approach, and outcome for practical insight.
              </>
            )}
          </p>
          <div className={`mt-4 -mx-5 px-5 overflow-visible flex w-full ${chipRowJustify}`}>
            <div className={`w-full flex flex-wrap gap-2 pb-1 ${chipInnerJustify} ${chipOffsetClass} ${chipDirection}`}>
              <button
                onClick={() => handleTagChange(null)}
                className={`case-filter-chip rounded-lg border px-3 py-1 text-xs ${
                  !selectedTag ? "active border-[var(--brand-accent)] text-[var(--brand-accent)]" : "border-zinc-600 text-zinc-300 hover:border-zinc-500"
                }`}
                aria-pressed={!selectedTag ? "true" : "false"}
                data-icon="filter"
              >
                {lang === "ar" ? "الكل" : "All"}
              </button>
              {(taxonomy?.categories?.cases?.length ? taxonomy.categories.cases : Array.from(new Set(items.flatMap((i) => i.tags)))).map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagChange(tag)}
                  className={`case-filter-chip rounded-lg border px-3 py-1 text-xs ${
                    selectedTag === tag
                      ? "active border-[var(--brand-accent)] text-[var(--brand-accent)]"
                      : "border-zinc-600 text-zinc-300 hover:border-zinc-500"
                  }`}
                  aria-pressed={selectedTag === tag ? "true" : "false"}
                  data-icon={
                    (() => {
                      const t = String(tag).toLowerCase();
                      if (t.includes("maritime")) return "anchor";
                      if (t.includes("enforcement")) return "lock";
                      if (t.includes("arbitration") || t.includes("litigation")) return "gavel";
                      if (t.includes("compliance")) return "shieldcheck";
                      if (t.includes("trade")) return "box";
                      if (t.includes("claims")) return "doc";
                      if (t.includes("collision")) return "warn";
                      return "category";
                    })()
                  }
                >
                  {tagLabels[tag] ?? tag}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <h2 className={`text-3xl md:text-4xl font-extrabold text-[var(--brand-accent)] ${lang === "ar" ? "text-right" : "text-left"}`} data-edit-key="cases-overview-title">{t("casesTitle")}</h2>
          <p className={`mt-2 text-zinc-300 text-sm ${lang === "ar" ? "text-right" : "text-left"}`} data-edit-key="cases-overview-subtitle">
            {lang === "ar" ? "أمثلة عملية على نجاحات حديثة عبر ممارستنا." : "Practical examples of recent successes across our practice."}
          </p>
        </>
      )}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 items-stretch gap-6">
        <div
          className={`md:col-span-1 pr-1 h-full ${variant === "page" ? "overflow-visible" : ""}`}
        >
          <div className="space-y-4 h-full overflow-auto pr-1">
          {/* chips row moved to header for variant='page' */}
          {displayPool.map((c, idx) => (
            <button
              key={c.title}
              onClick={() => handleSelect(c.id)}
              aria-current={selected === c.id ? "true" : undefined}
              className={`group relative w-full ${lang === "ar" ? "text-right" : "text-left"} rounded-xl border surface p-5 transition-all duration-200 will-change-transform shadow-sm ${
                selected === c.id
                  ? "border-[var(--brand-accent)] shadow-md"
                  : "border-zinc-600/60 hover:border-zinc-500 hover:-translate-y-0.5"
              }`}
            >
              <div className={`absolute top-4 ${lang === "ar" ? "left-4 right-auto" : "right-4 left-auto"}`}>
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-zinc-700/40 text-[10px] font-extrabold text-zinc-500 transition-colors duration-200 group-hover:text-[var(--brand-accent)] group-hover:border-[var(--brand-accent)]/60 group-hover:bg-[var(--brand-accent)]/10">
                  {String((variant === "page" && !selectedTag ? (page - 1) * pageSize + idx + 1 : idx + 1)).padStart(2, "0")}
                </span>
              </div>
              <div className="font-semibold text-white" data-edit-key={`cases-card-title-${String(c.title).toLowerCase().replace(/[^a-zA-Z0-9]+/g,"-")}`}>{c.title}</div>
              <div className="mt-2 text-sm text-zinc-300" data-edit-key={`cases-card-desc-${String(c.title).toLowerCase().replace(/[^a-zA-Z0-9]+/g,"-")}`}>{c.desc}</div>
              <div className={`mt-3 flex items-center gap-4 text-xs text-zinc-400 ${lang === "ar" ? "justify-end flex-row-reverse" : "justify-start flex-row"}`}>
                <div className={`flex items-center gap-1 ${lang === "ar" ? "flex-row-reverse" : "flex-row"}`}>
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
                    <path fill="currentColor" d="M7 2h10a2 2 0 0 1 2 2v2H5V4a2 2 0 0 1 2-2Zm12 6H5v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Zm-3-6v2M8 2v2" />
                  </svg>
                  <span>{fmtDate(c.date)}</span>
                </div>
                <div className={`flex items-center gap-1 ${lang === "ar" ? "flex-row-reverse" : "flex-row"}`}>
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
                    <path fill="currentColor" d="M12 5c5.5 0 9.5 5 9.5 7s-4 7-9.5 7S2.5 14 2.5 12 6.5 5 12 5Zm0 3.5A3.5 3.5 0 1 0 12 16.5 3.5 3.5 0 0 0 12 8.5Z" />
                  </svg>
                  <span>{c.views.toLocaleString(lang === "ar" ? "ar" : "en")}</span>
                </div>
              </div>
            </button>
          ))}
          {variant === "page" && !selectedTag && pool.length > 6 ? (
            <div className="mt-4 flex justify-center gap-2">
              {[1, 2].map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-7 w-7 rounded-md border text-xs font-semibold ${
                    page === p
                      ? "border-[var(--brand-accent)] text-[var(--brand-accent)]"
                      : "border-zinc-700/40 text-zinc-400 hover:border-zinc-600/60"
                  }`}
                  aria-label={(lang === "ar" ? "الصفحة" : "Page") + " " + p}
                >
                  {p}
                </button>
              ))}
            </div>
          ) : null}
          </div>
        </div>
        <div className="md:col-span-3 rounded-2xl surface p-6 md:p-8 h-full flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-[var(--brand-accent)] to-[color-mix(in_oklab,var(--brand-accent),white_18%)] bg-clip-text text-transparent">
              {selectedItem?.title}
            </div>
            <div className="flex items-center">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-accent)] text-black text-xs font-extrabold">
                {String(pool.findIndex((c) => c.id === selected) + 1).padStart(2, "0")}
              </span>
            </div>
          </div>
          {selected ? (
            <>
              <div className="mt-3">
                <div className="mb-3 h-px w-full bg-gradient-to-r from-[var(--brand-accent)]/90 via-[var(--brand-accent)]/40 to-transparent" />
                <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
                  <div className="relative w-full" style={{ aspectRatio: "3 / 1" }}>
                    <Image
                      src={imageFor(selected)}
                      alt={lang === "ar" ? "صورة دراسة الحالة" : "Case study image"}
                      fill
                      sizes="100vw"
                      className="object-cover"
                      priority={false}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/25" />
                    <div className="absolute bottom-0 left-0 h-0.5 w-full bg-[var(--brand-accent)]/90" />
                  </div>
                </div>
                {selectedDetails && (
                  <div className="mt-4">
                    <div className="text-2xl font-bold text-white">{selectedDetails.headline}</div>
                    <p className="mt-2 text-sm text-zinc-300 max-w-3xl">{selectedDetails.summary}</p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                {selectedDetails?.chips.map((chip) => (
                  <span key={chip} className="rounded-lg chip px-3 py-1 text-zinc-300">
                    {chip}
                  </span>
                )) ?? null}
                {selectedItem ? (
                  <>
                    <span className="inline-flex items-center gap-1 rounded-lg chip px-3 py-1 text-zinc-300">
                      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5">
                        <path fill="currentColor" d="M7 2h10a2 2 0 0 1 2 2v2H5V4a2 2 0 0 1 2-2Zm12 6H5v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Zm-3-6v2M8 2v2" />
                      </svg>
                      <span>{fmtDate(selectedItem.date)}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg chip px-3 py-1 text-zinc-300">
                      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5">
                        <path fill="currentColor" d="M12 5c5.5 0 9.5 5 9.5 7s-4 7-9.5 7S2.5 14 2.5 12 6.5 5 12 5Zm0 3.5A3.5 3.5 0 1 0 12 16.5 3.5 3.5 0 0 0 12 8.5Z" />
                      </svg>
                      <span>{selectedItem.views.toLocaleString(lang === 'ar' ? 'ar' : 'en')}</span>
                    </span>
                  </>
                ) : null}
              </div>
              {variant === "page" && (
                <div className="mt-2">
                  <button
                    onClick={copyShare}
                    className="inline-flex items-center gap-1 rounded-lg border border-zinc-700/40 px-3 py-1 text-xs font-semibold text-zinc-200 hover:bg-white/5 transition"
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5">
                      <path fill="currentColor" d="M8 3h8a2 2 0 0 1 2 2v6h-2V5H8v14h6v2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm9 8 4 3-4 3v-2h-7v-2h7v-2Z" />
                    </svg>
                    {copied ? (lang === "ar" ? "نُسخ!" : "Copied!") : (lang === "ar" ? "انسخ الرابط" : "Copy link")}
                  </button>
                </div>
              )}
              {variant === "page" && (
                <div className="mt-6 rounded-2xl surface p-4 md:p-5">
                  <div className="inline-flex items-center px-2.5 py-1 rounded-md badge-ink text-[10px] tracking-widest uppercase font-semibold">
                    {lang === "ar" ? "الوصف القانوني" : "Legal Description"}
                  </div>
                  <p className="mt-2 text-sm text-zinc-300 leading-7">
                    {legalDescText(selected as string)}
                  </p>
                </div>
              )}
              {variant === "page" && selectedItem && selectedDetails && (
                <div className="mt-6 rounded-2xl surface p-4 md:p-5">
                  <div className="inline-flex items-center px-2.5 py-1 rounded-md badge-ink text-[10px] tracking-widest uppercase font-semibold">
                    {lang === "ar" ? "أهم النقاط" : "Outcome Highlights"}
                  </div>
                  <ul className="mt-2 list-disc list-inside text-sm text-zinc-300">
                    <li>{`${selectedDetails.metrics.timeLbl}: ${selectedDetails.metrics.time}`}</li>
                    <li>{`${selectedDetails.metrics.secLbl}: ${selectedDetails.metrics.sec}`}</li>
                    <li>{`${selectedDetails.metrics.settleLbl}: ${selectedDetails.metrics.settle}`}</li>
                  </ul>
                </div>
              )}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl surface p-4">
                  <div className="inline-flex items-center px-2.5 py-1 rounded-md badge-ink text-[10px] tracking-widest uppercase font-semibold">
                    {lang === "ar" ? "التحدي" : "Challenge"}
                  </div>
                  <ul className="mt-2 list-disc list-inside text-sm text-zinc-300">
                    {selectedDetails?.challenge.map((c) => (
                      <li key={c}>{c}</li>
                    )) ?? null}
                  </ul>
                </div>
                <div className="rounded-xl surface p-4">
                  <div className="inline-flex items-center px-2.5 py-1 rounded-md badge-ink text-[10px] tracking-widest uppercase font-semibold">
                    {lang === "ar" ? "النهج" : "Approach"}
                  </div>
                  <ul className="mt-2 list-disc list-inside text-sm text-zinc-300">
                    {selectedDetails?.approach.map((a) => (
                      <li key={a}>{a}</li>
                    )) ?? null}
                  </ul>
                </div>
                <div className="rounded-xl surface p-4">
                  <div className="inline-flex items-center px-2.5 py-1 rounded-md badge-ink text-[10px] tracking-widest uppercase font-semibold">
                    {lang === "ar" ? "النتائج" : "Results"}
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                    {selectedDetails ? (
                      <>
                        <div className="rounded-lg bg-white/5 p-2">
                          <div className="text-lg font-extrabold text-[var(--brand-accent)]">{selectedDetails.metrics.time}</div>
                          <div className="text-[10px] text-zinc-400">{selectedDetails.metrics.timeLbl}</div>
                        </div>
                        <div className="rounded-lg bg-white/5 p-2">
                          <div className="text-lg font-extrabold text-[var(--brand-accent)]">{selectedDetails.metrics.sec}</div>
                          <div className="text-[10px] text-zinc-400">{selectedDetails.metrics.secLbl}</div>
                        </div>
                        <div className="rounded-lg bg-white/5 p-2">
                          <div className="text-lg font-extrabold text-[var(--brand-accent)]">{selectedDetails.metrics.settle}</div>
                          <div className="text-[10px] text-zinc-400">{selectedDetails.metrics.settleLbl}</div>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
              {variant === "page" && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl surface p-4 md:p-5">
                    <div className="inline-flex items-center px-2.5 py-1 rounded-md badge-ink text-[10px] tracking-widest uppercase font-semibold">
                      {lang === "ar" ? "الخط الزمني" : "Process Timeline"}
                    </div>
                    <ol className="mt-2 space-y-2 text-sm text-zinc-300">
                      {timelineFor(selected).map((s, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-lg bg-[var(--brand-accent)]/10 text-[var(--brand-accent)] text-xs font-bold">{i + 1}</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="rounded-2xl surface p-4 md:p-5">
                    <div className="inline-flex items-center px-2.5 py-1 rounded-md badge-ink text-[10px] tracking-widest uppercase font-semibold">
                      {lang === "ar" ? "الأسس القانونية والاستشهادات" : "Legal Grounds & Citations"}
                    </div>
                    <ul className="mt-2 list-disc list-inside text-sm text-zinc-300">
                      {groundsFor(selected).map((g, i) => (
                        <li key={i}>{g}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              {variant === "page" && selectedItem && (
                <div className="mt-6 rounded-2xl surface p-4 md:p-5">
                  <div className="inline-flex items-center px-2.5 py-1 rounded-md badge-ink text-[10px] tracking-widest uppercase font-semibold">
                    {lang === "ar" ? "خدمات ذات صلة" : "Related Services"}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedItem.tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagChange(tag)}
                        aria-pressed={selectedTag === tag ? "true" : "false"}
                        className={`rounded-lg chip px-3 py-1 text-xs text-zinc-300 hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)] ${selectedTag === tag ? "active" : ""}`}
                      >
                        {tagLabels[tag] ?? tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {variant === "page" && (
                <div className="mt-6 rounded-2xl surface p-4 md:p-5">
                  <div className="inline-flex items-center px-2.5 py-1 rounded-md badge-ink text-[10px] tracking-widest uppercase font-semibold" data-edit-key="cases-side-team-badge">
                    {lang === "ar" ? "الفريق والخبرة" : "Team & Expertise"}
                  </div>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl border border-zinc-700/40 bg-black/20 p-4">
                      <div className="text-sm font-semibold text-white" data-edit-key="cases-side-lead-label">
                        {lang === "ar" ? "المحامي المسؤول" : "Lead Counsel"}
                      </div>
                      <div className="mt-1 text-xs text-zinc-400" data-edit-key="cases-side-focus">
                        {lang === "ar" ? "ممارسات: بحري وتنفيذ" : "Focus: Maritime & Enforcement"}
                      </div>
                    </div>
                    <div className="rounded-xl border border-zinc-700/40 bg-black/20 p-4">
                      <div className="text-sm font-semibold text-white">
                        {lang === "ar" ? "محامٍ مساعد" : "Associate"}
                      </div>
                      <div className="mt-1 text-xs text-zinc-400">
                        {lang === "ar" ? "ممارسات: تحكيم ومنازعات" : "Focus: Arbitration & Disputes"}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {variant === "page" && (
                <div className="mt-6 rounded-2xl surface p-4 md:p-5">
                  <div className="inline-flex items-center px-2.5 py-1 rounded-md badge-ink text-[10px] tracking-widest uppercase font-semibold">
                    {lang === "ar" ? "الأسئلة الشائعة" : "FAQ"}
                  </div>
                  {(() => {
                    const t = selectedItem?.tags?.[0] ?? "maritime";
                    const faqs =
                      lang === "ar"
                        ? t === "arbitration"
                          ? [
                              { q: "كم يستغرق التحكيم عادة؟", a: "يعتمد على المؤسسية والقضية؛ غالباً أشهر، مع تسويات أسرع." },
                              { q: "هل نحتاج بند تحكيم؟", a: "وجود بند واضح يسهل الإجراءات ويجنب نزاع الاختصاص." },
                              { q: "هل يمكن التسوية قبل الجلسات؟", a: "نعم، كثير من القضايا تُسوّى بعد تبادل المذكرات والأدلة." },
                            ]
                          : t === "compliance"
                          ? [
                              { q: "ما فائدة فحص الأطراف؟", a: "تقليل مخاطر العقوبات والسمعة عبر منع التعامل مع جهات محظورة." },
                              { q: "كيف ندمج الامتثال في العمل؟", a: "بسياسات واضحة، إجراءات محدثة، وتدريب مستمر للفرق." },
                              { q: "هل يؤثر الامتثال على السرعة؟", a: "مع الأتمتة المناسبة يتحسن التدفق وتقل الأخطاء." },
                            ]
                          : [
                              { q: "كم تستغرق إجراءات الحجز البحري؟", a: "في حالات ملائمة يمكن التحرك خلال 24–48 ساعة حسب الاختصاص." },
                              { q: "ما المستندات المطلوبة؟", a: "مطالبة أولية، أدلة مسؤولية، وأي اتفاقيات أو بوالص داعمة." },
                              { q: "هل يلزم ضمان؟", a: "قد يُطلب توفير ضمان لمعادلة المطالبة أو لتغطية الأضرار المحتملة." },
                            ]
                        : t === "arbitration"
                        ? [
                            { q: "How long does arbitration take?", a: "It varies by forum and complexity; often months with earlier settlements." },
                            { q: "Do we need an arbitration clause?", a: "A clear clause streamlines proceedings and avoids jurisdiction disputes." },
                            { q: "Can we settle before hearings?", a: "Yes, many matters resolve after memorials and evidence exchange." },
                          ]
                        : t === "compliance"
                        ? [
                            { q: "Why perform party screening?", a: "To reduce sanctions and reputational risks by avoiding prohibited parties." },
                            { q: "How to embed compliance?", a: "With clear policies, updated SOPs, and regular team training." },
                            { q: "Will compliance slow operations?", a: "With automation and process design, throughput typically improves." },
                          ]
                        : [
                            { q: "How fast is a vessel arrest?", a: "Under suitable conditions, action can proceed within 24–48 hours." },
                            { q: "What documents are required?", a: "Preliminary claim, liability evidence, and supporting contracts or policies." },
                            { q: "Is security required?", a: "Courts may request security equal to the claim or for potential damages." },
                          ];
                    return (
                      <div className="mt-2">
                        {faqs.map((f, i) => (
                          <details key={i} className="group border-b border-zinc-700/40 py-2">
                            <summary className="cursor-pointer list-none text-sm font-semibold text-zinc-200 flex justify-between items-center">
                              <span>{f.q}</span>
                              <span className="text-[var(--brand-accent)]">+</span>
                            </summary>
                            <div className="mt-1 text-sm text-zinc-300">{f.a}</div>
                          </details>
                        ))}
                        <script
                          type="application/ld+json"
                          dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                              "@context": "https://schema.org",
                              "@type": "FAQPage",
                              mainEntity: faqs.map((f) => ({
                                "@type": "Question",
                                name: f.q,
                                acceptedAnswer: { "@type": "Answer", text: f.a },
                              })),
                            }),
                          }}
                        />
                      </div>
                    );
                  })()}
                </div>
              )}
              {variant !== "page" && (
                <div className="mt-auto pt-6 -mx-6 -mb-6 md:-mx-8 md:-mb-8">
                  <div className="border-t border-[var(--panel-border)] bg-black/10 dark:bg-black/40 backdrop-blur-lg px-6 md:px-8 py-4 rounded-b-2xl">
                    <div className="flex items-center justify-between gap-3">
                      <div className="sticky-label text-xs text-white">
                        {lang === "ar" ? "كل قضية يمكن أن تتحول إلى انتصار بالاستراتيجية المناسبة." : "Every case can turn into a win with the right strategy."}
                      </div>
                      <div className={`flex flex-wrap gap-2 ${lang === "ar" ? "mr-auto justify-start" : "ml-auto justify-end"}`}>
                        <Link
                          href={`/${lang}/cases`}
                          className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-accent)] text-black px-3 py-1.5 text-xs font-semibold transition-transform duration-200 will-change-transform hover:-translate-y-0.5 active:scale-95 shadow lg:px-4 lg:py-2 lg:text-sm"
                        >
                          <span>{lang === "ar" ? "اقرأ الدراسة كاملة" : "Read full case"}</span>
                          <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M7 4h10v2H7zM7 9h10v2H7zM7 14h7v2H7z"/></svg>
                        </Link>
                        <Link
                          href={`/${lang}/contact`}
                          className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-accent)] text-black px-3 py-1.5 text-xs font-semibold transition-transform duration-200 will-change-transform hover:-translate-y-0.5 active:scale-95 shadow lg:px-4 lg:py-2 lg:text-sm"
                        >
                          <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M4 6h16a1 1 0 011 1v.3l-9 5.7-9-5.7V7a1 1 0 011-1zm16 3.8V18a1 1 0 01-1 1H5a1 1 0 01-1-1V9.8l8.4 5.3a1 1 0 001.2 0L20 9.8z"/></svg>
                          <span>{lang === "ar" ? "اطلب استشارة" : "Request consultation"}</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {variant === "page" && (
                <div className="mt-auto pt-6 -mx-6 -mb-6 md:-mx-8 md:-mb-8">
                  <div className="border-t border-[var(--panel-border)] bg-black/10 dark:bg-black/40 backdrop-blur-lg px-6 md:px-8 py-4 rounded-b-2xl">
                    <div className="flex items-center justify-between gap-3">
                      <div className="sticky-label text-xs text-white">
                        {lang === "ar" ? "كل قضية يمكن أن تتحول إلى انتصار بالاستراتيجية المناسبة." : "Every case can turn into a win with the right strategy."}
                      </div>
                      <div className={`${lang === "ar" ? "mr-auto justify-start" : "ml-auto justify-end"} flex items-center`}>
                        <Link
                          href={`/${lang}/contact?subject=${encodeURIComponent((lang === "ar" ? "قضية: " : "Case: ") + selected)}`}
                          className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-accent)] text-black px-3 py-1.5 text-xs font-semibold hover:opacity-95 lg:px-4 lg:text-sm"
                        >
                          <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M4 6h16a1 1 0 011 1v.3l-9 5.7-9-5.7V7a1 1 0 011-1zm16 3.8V18a1 1 0 01-1 1H5a1 1 0 01-1-1V9.8l8.4 5.3a1 1 0 001.2 0L20 9.8z"/></svg>
                          <span>{lang === "ar" ? "احجز استشارة" : "Book consultation"}</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="mt-3 rounded-2xl border border-dashed border-[var(--panel-border)] bg-[var(--panel-muted-bg)] p-6 text-center">
              <span className="font-semibold text-[var(--brand-accent)]">
                {lang === "ar" ? "اختر قضية لعرض التفاصيل هنا." : "Select a case to preview details here."}
              </span>
            </div>
          )}
        </div>
      </div>
      {variant === "page" && selectedItem && (
        <section className="mt-10 -mx-5 md:-mx-8">
          <div className="bg-gradient-to-b from-white/[0.04] to-transparent border-t border-white/10">
            <div className="mx-auto max-w-7xl px-5 md:px-8 py-10 md:py-12">
            {(() => {
              const primary = selectedItem.tags[0];
              const candidates = items
                .filter((i) => i.id !== selected && i.tags.includes(primary))
                .sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf())
                .slice(0, 3);
              return (
                <>
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center px-2.5 py-1 rounded-md badge-ink text-[10px] tracking-widest uppercase font-semibold">
                      {lang === "ar" ? "قضايا مشابهة" : "Similar Cases"}
                      <span className="ml-2 rounded-lg border border-[var(--brand-accent)]/40 px-2 py-0.5 text-[10px] normal-case tracking-normal text-[var(--brand-accent)]">
                        {lang === "ar" ? "حسب الوسم:" : "Based on:"} {tagLabels[primary] ?? primary}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTagChange(primary)}
                      className="inline-flex items-center gap-1 rounded-lg border border-zinc-700/40 px-3 py-1 text-xs font-semibold text-zinc-200 hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)] transition"
                      aria-label={lang === "ar" ? "عرض جميع القضايا ضمن الوسم" : "View all under tag"}
                    >
                      <span>{lang === "ar" ? "عرض الكل" : "View all"}</span>
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>
                    <div className="pt-2">
                      <div className="mt-3 h-px bg-gradient-to-r from-[var(--brand-accent)]/30 to-transparent" />
                    </div>
                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3" role="list">
                    {candidates.map((c) => {
                      const common = c.tags.find((t) => selectedItem.tags.includes(t));
                      return (
                        <motion.button
                          key={c.id}
                          onClick={() => handleSelectWithTag(c.id, common)}
                          className="group relative overflow-hidden rounded-xl border border-zinc-700/40 bg-transparent p-4 text-left transition will-change-transform"
                          whileHover={{ y: -3, scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          transition={{ type: "spring", stiffness: 300, damping: 22 }}
                          role="listitem"
                          aria-label={c.title}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="text-sm font-semibold text-white">{c.title}</div>
                            <span className="text-[var(--brand-accent)] opacity-0 translate-x-0.5 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-1">
                              →
                            </span>
                          </div>
                          <div className="mt-1 text-xs text-zinc-400">{fmtDate(c.date)}</div>
                          <div className="mt-2 text-xs text-zinc-300 line-clamp-3">{c.desc}</div>
                        </motion.button>
                      );
                    })}
                    {candidates.length === 0 && (
                      <div className="col-span-full text-sm text-zinc-400">
                        {lang === "ar" ? "لا توجد قضايا مشابهة ضمن الوسم الحالي." : "No similar cases under the current tag."}
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
            </div>
          </div>
        </section>
      )}
    </section>
  );
}
