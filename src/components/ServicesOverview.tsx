"use client";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

const thumbBaseName = (cat: string) => {
  if (cat === "Maritime" || cat === "البحري") return "maritime";
  if (cat === "Insurance" || cat === "التأمين") return "insurance";
  if (cat === "Trade" || cat === "التجارة") return "trade";
  if (cat === "Disputes" || cat === "النزاعات") return "disputes";
  return "default";
};

function ThumbImage({ cat, alt, sizes, src: provided }: { cat: string; alt: string; sizes: string; src?: string }) {
  const v = process.env.NEXT_PUBLIC_ASSET_VERSION;
  const base = "/images/services";
  const name = thumbBaseName(cat);
  const withV = (p: string) => (v && p.startsWith("/") ? `${p}?v=${v}` : p);
  const initialRemote = !!provided;
  const [src, setSrc] = useState(provided ?? withV(`${base}/${name}.webp`));
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [loaded, setLoaded] = useState(false);
  const onError = () => {
    if (initialRemote && step === 0) {
      setStep(1);
      setSrc(withV(`${base}/${name}.webp`));
    } else if (step === 1) {
      setStep(2);
      setSrc(withV(`${base}/${name}.jpg`));
    } else if (step === 2) {
      setStep(3);
      setSrc(withV(`${base}/${name}.png`));
    } else {
      setSrc(withV(`${base}/default.webp`));
    }
  };
  return (
    <Image
      key={src}
      src={src}
      alt={alt}
      fill
      className={`object-cover transition-transform duration-500 ${loaded ? "opacity-100" : "opacity-0"} group-hover:scale-105`}
      sizes={sizes}
      onLoad={() => setLoaded(true)}
      onError={onError}
    />
  );
}
type Item = { title: string; desc: string; cat: string; img?: string };
type Testimonial = { text: string; initials: string; role: string };
type Props = { variant?: "home" | "page" };

export default function ServicesOverview({ variant = "home" }: Props) {
  const { lang } = useLanguage();
  const searchParams = useSearchParams();
  const reduce = useReducedMotion();
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 768px)");
    const on = () => setMobile(mq.matches);
    on();
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  const detailLines = (title: string, cat: string): string[] => {
    if (lang === "ar") {
      return [
        `نطاق واضح ومحدد لخدمة “${title}” ضمن مجال ${cat}.`,
        "منهجية قائمة على الأدلة ومتوافقة مع القوانين والإجراءات ذات الصلة في الإمارات.",
        "إدارة الوثائق والمواعيد والأطراف لضمان نتائج عملية وحاسمة.",
      ];
    }
    return [
      `Clear, tailored scope for “${title}” within ${cat}.`,
      "Evidence‑led strategy aligned with UAE law and applicable rules.",
      "Document, timeline, and counterpart management for decisive outcomes.",
    ];
  };
  const stepsFor = (cat: string) => {
    if (lang === "ar") {
      if (cat === "البحري") return ["الإخطار", "تثبيت الضمان", "التحقيق", "الاستراتيجية", "الإجراء", "الإغلاق"];
      if (cat === "التأمين") return ["إشعار المطالبة", "جمع الأدلة", "تقييم التغطية", "التفاوض", "التسوية/التقاضي"];
      if (cat === "التجارة") return ["مراجعة العقود", "تحليل الالتزامات", "إدارة المستندات", "الامتثال", "التنفيذ"];
      if (cat === "النزاعات") return ["تحليل النزاع", "اختيار المنتدى", "المذكرات", "المرافعات", "الحل"];
      return ["الاستلام", "الوقائع", "التقييم", "الاستراتيجية", "الإجراء", "النتيجة"];
    }
    if (cat === "Maritime") return ["Notice", "Secure Security", "Investigation", "Strategy", "Action", "Close‑out"];
    if (cat === "Insurance") return ["Claim Notice", "Evidence Collection", "Coverage Review", "Negotiation", "Settlement/Litigation"];
    if (cat === "Trade") return ["Contract Review", "Obligation Analysis", "Docs Management", "Compliance", "Execution"];
    if (cat === "Disputes") return ["Case Analysis", "Forum Choice", "Pleadings", "Hearings", "Resolution"];
    return ["Intake", "Facts", "Assessment", "Strategy", "Action", "Resolution"];
  };
  const faqsFor = (cat: string) => {
    if (lang === "ar") {
      if (cat === "البحري")
        return [
          { q: "هل يمكن حجز السفينة سريعًا؟", a: "نعم، عند توفر سبب ووقائع داعمة يمكن التحرك خلال ساعات." },
          { q: "ما المستندات المطلوبة؟", a: "سندات الشحن، العقود، مراسلات الأطراف، وأدلة الخسارة." },
        ];
      if (cat === "التأمين")
        return [
          { q: "هل التغطية تشمل هذا الحدث؟", a: "يعتمد على صياغة الوثيقة والاستثناءات؛ نقوم بمراجعة مفصلة." },
          { q: "كيف يتم تقدير الخسائر؟", a: "بمستندات داعمة وتقارير خبراء وتطبيق بنود الوثيقة." },
        ];
      if (cat === "التجارة")
        return [
          { q: "كيف نتعامل مع العقوبات؟", a: "نقدم فحص أطراف وإرشادات امتثال وتخفيف مخاطر." },
          { q: "هل يمكن إنفاذ الاعتمادات؟", a: "نعم وفق القواعد المصرفية والالتزامات التعاقدية." },
        ];
      if (cat === "النزاعات")
        return [
          { q: "التحكيم أم التقاضي؟", a: "نوصي وفق العقد والأهداف والسرعة والسرية والتكلفة." },
          { q: "ما فرص التسوية المبكرة؟", a: "نقيّم المخاطر ونقترح مسارات عملية قبل التصعيد." },
        ];
      return [
        { q: "كيف نبدأ؟", a: "تزويدنا بالوقائع الرئيسية والمستندات وسيتم تحديد الخطوات." },
        { q: "ما التكاليف المتوقعة؟", a: "نعرض هيكلة واضحة ورسوم ثابتة عند الإمكان." },
      ];
    }
    if (cat === "Maritime")
      return [
        { q: "Can we arrest a vessel quickly?", a: "Yes, with grounds and evidence we can act within hours." },
        { q: "What documents are needed?", a: "B/Ls, contracts, party correspondence, loss evidence." },
      ];
    if (cat === "Insurance")
      return [
        { q: "Is this event covered?", a: "Depends on wording and exclusions; we provide a detailed review." },
        { q: "How are losses quantified?", a: "With supporting records and expert reports under policy terms." },
      ];
    if (cat === "Trade")
      return [
        { q: "How to handle sanctions risk?", a: "We provide screening, compliance guidance, and risk mitigation." },
        { q: "Can L/Cs be enforced?", a: "Yes, under banking rules and contractual obligations." },
      ];
    if (cat === "Disputes")
      return [
        { q: "Arbitration or litigation?", a: "We advise based on contract, goals, speed, privacy, and cost." },
        { q: "Early settlement chances?", a: "We assess risk and propose practical paths before escalation." },
      ];
    return [
      { q: "How do we start?", a: "Share key facts and documents; we will outline next steps." },
      { q: "What are the likely costs?", a: "Clear structures and fixed fees where possible." },
    ];
  };
  const headline =
    lang === "ar"
      ? "خدمات قانونية واستشارية متكاملة"
      : "Integrated legal services & consultancy";
  const subhead =
    lang === "ar"
      ? "دعم قانوني شامل في مجالات النقل البحري، التجارة، التأمين، المنازعات — ومجالات أخرى بما يتسق مع أهدافك الأساسية. إليك جزءاً من ممارستنا."
      : "Comprehensive legal support in the areas of maritime transport, trade, insurance, disputes — and other areas in line with your core objectives. Here is a part of our practice.";
  const categoriesAll = lang === "ar"
    ? ["البحري", "التأمين", "التجارة", "النزاعات", "الأسرة", "العمل", "جنائي", "الجرائم الإلكترونية"]
    : ["Maritime", "Insurance", "Trade", "Disputes", "Family", "Labour", "Criminal", "E‑Crime"];
  const categoriesHome = lang === "ar"
    ? ["البحري", "التجارة", "العمل", "النزاعات"]
    : ["Maritime", "Trade", "Labour", "Disputes"];
  const categories = variant === "home" ? categoriesHome : categoriesAll;
  const slugToLabel = useMemo(
    () =>
      lang === "ar"
        ? { maritime: "البحري", insurance: "التأمين", trade: "التجارة", disputes: "النزاعات", family: "الأسرة", labour: "العمل", criminal: "جنائي", ecrime: "الجرائم الإلكترونية" }
        : { maritime: "Maritime", insurance: "Insurance", trade: "Trade", disputes: "Disputes", family: "Family", labour: "Labour", criminal: "Criminal", ecrime: "E‑Crime" },
    [lang]
  );
  const paramLabel = useMemo(() => {
    const v = (searchParams?.get("cat") || "").toLowerCase();
    return (slugToLabel as Record<string, string>)[v] ?? null;
  }, [searchParams, slugToLabel]);
  const chipJustify = useMemo(() => {
    if (lang === "ar") {
      // Arabic (RTL): center on mobile; right-align on md+ in Services page
      return variant === "page"
        ? "justify-center md:justify-start lg:justify-start xl:justify-start"
        : "justify-center md:justify-center lg:justify-start";
    }
    return variant === "page"
      ? "justify-start"
      : "justify-center md:justify-center lg:justify-start";
  }, [lang, variant]);
  const chipDirClass = useMemo(() => {
    return "flex-row";
  }, [lang, variant]);
  const [active, setActive] = useState(paramLabel ?? categories[0]);
  const iconForCategory = (label: string) => {
    const l = String(label).toLowerCase();
    if (/(maritime|بحر)/.test(l)) return "anchor";
    if (/(insur|تأمين)/.test(l)) return "shield";
    if (/(trade|تجار)/.test(l)) return "box";
    if (/(dispute|نزاع)/.test(l)) return "gavel";
    if (/(family|أسرة)/.test(l)) return "family";
    if (/(labou|عمل)/.test(l)) return "briefcase";
    if (/(criminal|جنائ)/.test(l)) return "gavel";
    if (/(crime|إلكترون)/.test(l)) return "cyber";
    return "category";
  };
  const tiles = useMemo(
    () =>
          lang === "ar"
        ? [
            { title: "حوادث وأميرالية", desc: "تصادم، إنقاذ، معدل عام، استجابة للأزمات.", cat: "البحري", img: "/images/Services/Maritime.jpg" },
            { title: "حجز السفن", desc: "حجز، امتيازات، وترتيبات ضمان.", cat: "البحري", img: "/images/Services/cargoArrest.jpg" },
            { title: "عقود الإيجار والتأخير", desc: "صياغة العقود ومعالجة التأخير والمطالبات.", cat: "البحري", img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80" },
            { title: "رقابة دولة الميناء", desc: "تفتيش، احتجاز، والتعامل مع المخالفات.", cat: "البحري", img: "/images/Services/Maritime.jpg" },

            { title: "تأمين بحري", desc: "تغطية، رجوع، ونوادي الحماية.", cat: "التأمين", img: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80" },
            { title: "إدارة المطالبات", desc: "استلام المطالبة وتقييمها والتفاوض عليها.", cat: "التأمين", img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80" },
            { title: "استشارات التغطية", desc: "نطاق الوثيقة والاستثناءات والمسؤوليات.", cat: "التأمين", img: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80" },
            { title: "الرجوع والتحصيل", desc: "استرداد المدفوعات من الأطراف المسؤولة.", cat: "التأمين", img: "https://images.unsplash.com/photo-1581094794329-c31d44a0b4a4?auto=format&fit=crop&w=1200&q=80" },

            { title: "مطالبات بضائع", desc: "فقدان وتلف وسوء تسليم وتغطية.", cat: "التجارة", img: "https://images.unsplash.com/photo-1497032205916-ac775f0649ae?auto=format&fit=crop&w=1200&q=80" },
            { title: "التجارة والعقوبات", desc: "عقوبات، امتثال، وفحص الأطراف.", cat: "التجارة", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80" },
            { title: "خطابات الاعتماد وبيع البضائع", desc: "الاعتمادات المستندية والعقود وسلاسل التوريد.", cat: "التجارة", img: "https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=1200&q=80" },
            { title: "الجمارك والامتثال", desc: "إفراجات، تصنيف، وتدقيقات.", cat: "التجارة", img: "https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?auto=format&fit=crop&w=1200&q=80" },

            { title: "تحكيم وتقاضي", desc: "مرافعات محلية وتحكيم مؤسسي.", cat: "النزاعات", img: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80" },
            { title: "وساطة وتسويات", desc: "حل نزاعات سريع وفعال.", cat: "النزاعات", img: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1200&q=80" },
            { title: "تنفيذ وأوامر ضمان", desc: "حجز أصول وضمانات قضائية.", cat: "النزاعات", img: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80" },
            { title: "الأدلة والخبرة الفنية", desc: "تقارير خبراء وشهادة فنية.", cat: "النزاعات", img: "/images/Services/Maritime.jpg" },

            { title: "طلاق وحضانة", desc: "إجراءات الطلاق وترتيبات الحضانة والنفقة.", cat: "الأسرة", img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80" },
            { title: "إرث ووصايا", desc: "صياغة الوصايا وتوزيع التركات وإثباتها.", cat: "الأسرة", img: "https://images.unsplash.com/photo-1518972559570-7cc1309f3229?auto=format&fit=crop&w=1200&q=80" },
            { title: "عقود زواج", desc: "عقود الزواج والاتفاقات السابقة للزواج.", cat: "الأسرة", img: "https://images.unsplash.com/photo-1521033719794-41049d18b8d3?auto=format&fit=crop&w=1200&q=80" },
            { title: "نزاعات أسرية", desc: "تسويات ودية وإجراءات محكمة الأسرة.", cat: "الأسرة", img: "https://images.unsplash.com/photo-1528747008803-c8edbac3f90d?auto=format&fit=crop&w=1200&q=80" },

            { title: "عقود العمل", desc: "صياغة العقود وسياسات الموارد البشرية.", cat: "العمل", img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80" },
            { title: "الفصل والشكاوى", desc: "إجراءات الفصل العادل وتسوية الشكاوى.", cat: "العمل", img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80" },
            { title: "الأجور والعمل الإضافي", desc: "مطالبات الأجور وساعات العمل.", cat: "العمل", img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80" },
            { title: "الامتثال العمالي", desc: "لوائح العمل وسياسات أماكن العمل.", cat: "العمل", img: "https://images.unsplash.com/photo-1554774853-b415df9eeb92?auto=format&fit=crop&w=1200&q=80" },

            { title: "دفاع جنائي", desc: "قضايا جنائية وجرائم أموال.", cat: "جنائي", img: "https://images.unsplash.com/photo-1523246191318-7f2d7d4b4d78?auto=format&fit=crop&w=1200&q=80" },
            { title: "تحقيقات الشرطة", desc: "تمثيل أثناء التحقيق والاستجواب.", cat: "جنائي", img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=1200&q=80" },
            { title: "الكفالة والاحتجاز", desc: "طلبات الإفراج والضمان.", cat: "جنائي", img: "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=1200&q=80" },
            { title: "طعون وتخفيف", desc: "استئناف الأحكام وإجراءات التخفيف.", cat: "جنائي", img: "https://images.unsplash.com/photo-1528747008803-c8edbac3f90d?auto=format&fit=crop&w=1200&q=80" },

            { title: "احتيال إلكتروني", desc: "الاختراق والجرائم المالية الرقمية.", cat: "الجرائم الإلكترونية", img: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=1200&q=80" },
            { title: "حوادث حماية البيانات", desc: "خروقات البيانات وإخطار الجهات.", cat: "الجرائم الإلكترونية", img: "https://images.unsplash.com/photo-1512427691650-1f4b2a1c2d48?auto=format&fit=crop&w=1200&q=80" },
            { title: "تشهير إلكتروني", desc: "قضايا المحتوى والإساءة عبر الإنترنت.", cat: "الجرائم الإلكترونية", img: "https://images.unsplash.com/photo-1494883759339-0b042055a4ee?auto=format&fit=crop&w=1200&q=80" },
            { title: "أدلة رقمية", desc: "طب شرعي رقمي وأدلة إلكترونية.", cat: "الجرائم الإلكترونية", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80" },
          ]
        : [
            { title: "Admiralty & Casualty", desc: "Collisions, salvage, GA, crisis response.", cat: "Maritime", img: "/images/Services/Maritime.jpg" },
            { title: "Vessel Arrests", desc: "Arrest, liens, security arrangements.", cat: "Maritime", img: "/images/Services/cargoArrest.jpg" },
            { title: "Charterparty & Demurrage", desc: "Drafting, delays, claims management.", cat: "Maritime", img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80" },
            { title: "Port State Control", desc: "Inspections, detentions, compliance.", cat: "Maritime", img: "/images/Services/Maritime.jpg" },

            { title: "Marine Insurance", desc: "Coverage, subrogation, P&I clubs.", cat: "Insurance", img: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80" },
            { title: "Claims Handling", desc: "Intake, evaluation, negotiation.", cat: "Insurance", img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80" },
            { title: "Coverage Counsel", desc: "Policy scope, exclusions, liabilities.", cat: "Insurance", img: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80" },
            { title: "Subrogation & Recoveries", desc: "Recovery from liable parties.", cat: "Insurance", img: "https://images.unsplash.com/photo-1581094794329-c31d44a0b4a4?auto=format&fit=crop&w=1200&q=80" },

            { title: "Cargo Claims", desc: "Loss, damage, misdelivery, recoveries.", cat: "Trade", img: "https://images.unsplash.com/photo-1497032205916-ac775f0649ae?auto=format&fit=crop&w=1200&q=80" },
            { title: "Trade & Sanctions", desc: "Sanctions, compliance, party screening.", cat: "Trade", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80" },
            { title: "LCs & Sale of Goods", desc: "Letters of credit and contracts.", cat: "Trade", img: "https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=1200&q=80" },
            { title: "Customs & Compliance", desc: "Clearance, classification, audits.", cat: "Trade", img: "https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?auto=format&fit=crop&w=1200&q=80" },

            { title: "Arbitration & Litigation", desc: "Courts and institutional arbitration.", cat: "Disputes", img: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80" },
            { title: "Mediation & Settlements", desc: "Fast and efficient dispute resolution.", cat: "Disputes", img: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1200&q=80" },
            { title: "Enforcement & Security", desc: "Asset freezes and security orders.", cat: "Disputes", img: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80" },
            { title: "Expert Evidence", desc: "Expert reports and testimony.", cat: "Disputes", img: "/images/Services/Maritime.jpg" },

            { title: "Divorce & Guardianship", desc: "Separation, custody, and support orders.", cat: "Family", img: "https://images.unsplash.com/photo-1518972559570-7cc1309f3229?auto=format&fit=crop&w=1200&q=80" },
            { title: "Inheritance & Wills", desc: "Wills, probate, and estate distribution.", cat: "Family", img: "https://images.unsplash.com/photo-1512427691650-1f4b2a1c2d48?auto=format&fit=crop&w=1200&q=80" },
            { title: "Marriage Contracts", desc: "Prenuptials and marital agreements.", cat: "Family", img: "https://images.unsplash.com/photo-1521033719794-41049d18b8d3?auto=format&fit=crop&w=1200&q=80" },
            { title: "Family Settlements", desc: "Mediation and family court strategy.", cat: "Family", img: "https://images.unsplash.com/photo-1528747008803-c8edbac3f90d?auto=format&fit=crop&w=1200&q=80" },

            { title: "Employment Contracts", desc: "Hiring terms and HR policies.", cat: "Labour", img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80" },
            { title: "Termination & Grievances", desc: "Fair dismissal and dispute handling.", cat: "Labour", img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80" },
            { title: "Wage & Overtime Claims", desc: "Recovery of unpaid dues.", cat: "Labour", img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80" },
            { title: "Workplace Compliance", desc: "Labour regulations and SOPs.", cat: "Labour", img: "https://images.unsplash.com/photo-1554774853-b415df9eeb92?auto=format&fit=crop&w=1200&q=80" },

            { title: "White‑Collar Defense", desc: "Fraud and financial crimes.", cat: "Criminal", img: "https://images.unsplash.com/photo-1523246191318-7f2d7d4b4d78?auto=format&fit=crop&w=1200&q=80" },
            { title: "Police Investigations", desc: "Representation during questioning.", cat: "Criminal", img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=1200&q=80" },
            { title: "Bail & Remand", desc: "Release applications and surety.", cat: "Criminal", img: "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=1200&q=80" },
            { title: "Appeals & Mitigation", desc: "Post‑conviction advocacy.", cat: "Criminal", img: "https://images.unsplash.com/photo-1528747008803-c8edbac3f90d?auto=format&fit=crop&w=1200&q=80" },

            { title: "Cyber Fraud & Hacking", desc: "Intrusions and digital theft.", cat: "E‑Crime", img: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=1200&q=80" },
            { title: "Data Incidents", desc: "Breach response and notifications.", cat: "E‑Crime", img: "https://images.unsplash.com/photo-1512427691650-1f4b2a1c2d48?auto=format&fit=crop&w=1200&q=80" },
            { title: "Online Defamation", desc: "Content takedown and redress.", cat: "E‑Crime", img: "https://images.unsplash.com/photo-1494883759339-0b042055a4ee?auto=format&fit=crop&w=1200&q=80" },
            { title: "Digital Evidence", desc: "Forensics and chain of custody.", cat: "E‑Crime", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80" },
          ],
    [lang]
  );
  const filtered = tiles.filter((t) => t.cat === active).slice(0, 4);
  const [selected, setSelected] = useState<Item | null>(null);
  const detailsTitle = lang === "ar" ? "تفاصيل الخدمة" : "Service details";
  const explore = lang === "ar" ? "اكتشف الخدمة" : "Explore service";
  const closeLabel = lang === "ar" ? "إغلاق" : "Close";
  const contactLabel = lang === "ar" ? "اطلب استشارة" : "Request consultation";
  const contactHref = `/${lang}/contact`;
  const compareCats = lang === "ar" ? ["البحري", "التأمين", "التجارة", "النزاعات"] : ["Maritime", "Insurance", "Trade", "Disputes"];
  const featureRows = lang === "ar"
    ? [
        "استجابة طارئة وحجز سفن",
        "إدارة المطالبات والتعويض",
        "استشارات التغطية التأمينية",
        "امتثال وعقوبات وتجاري",
        "تحكيم وتقاضي",
        "تقارير وخبرة فنية",
      ]
    : [
        "Emergency response & arrests",
        "Claims handling & recoveries",
        "Coverage counsel",
        "Trade compliance & sanctions",
        "Arbitration & litigation",
        "Expert reports & evidence",
      ];
  const compareMatrix: boolean[][] = [
    [true,  false, false, false], // Emergency & arrests
    [true,  true,  true,  false], // Claims handling
    [false, true,  false, false], // Coverage counsel
    [false, false, true,  false], // Trade compliance
    [true,  true,  true,  true ], // Arbitration & litigation
    [true,  true,  true,  true ], // Expert evidence
  ];
  const testimonialsPool: Testimonial[] = useMemo(
    () =>
      lang === "ar"
        ? [
            { text: "استجابة سريعة ونتائج ملموسة في نزاع بحري معقد.", initials: "GC", role: "GC, Shipping Co." },
            { text: "إرشاد واضح للتغطية التأمينية أدى إلى تسوية عادلة.", initials: "CL", role: "Claims Lead, Insurer" },
            { text: "امتثال تجاري محكم خفض المخاطر وسرّع العمليات.", initials: "OM", role: "Ops Manager, Trader" },
            { text: "فريق احترافي قدم حلولاً عملية قللت الكلفة والوقت.", initials: "LA", role: "Legal Advisor, Logistics" },
            { text: "تحليل دقيق للعقد أنقذنا من نزاع طويل.", initials: "CO", role: "COO, Trading House" },
            { text: "تواصل واضح وخطة تنفيذ محكمة منذ اليوم الأول.", initials: "PM", role: "Project Manager" },
          ]
        : [
            { text: "Fast response and tangible results in a complex maritime dispute.", initials: "GC", role: "GC, Shipping Co." },
            { text: "Clear coverage guidance led to a fair settlement.", initials: "CL", role: "Claims Lead, Insurer" },
            { text: "Tight trade compliance reduced risk and accelerated operations.", initials: "OM", role: "Ops Manager, Trader" },
            { text: "Professional team with pragmatic solutions that saved time and costs.", initials: "LA", role: "Legal Advisor, Logistics" },
            { text: "Contract analysis spared us a long dispute.", initials: "CO", role: "COO, Trading House" },
            { text: "Clear communication and a focused execution plan from day one.", initials: "PM", role: "Project Manager" },
          ],
    [lang]
  );
  const seed = useMemo(() => {
    let s = 0;
    for (let i = 0; i < lang.length; i++) s = ((s << 5) - s + lang.charCodeAt(i)) >>> 0;
    return s >>> 0;
  }, [lang]);
  const selectedTestimonials = useMemo(() => {
    const arr = [...testimonialsPool];
    let s = seed;
    for (let i = arr.length - 1; i > 0; i--) {
      s = (s * 1664525 + 1013904223) >>> 0;
      const r = s / 0x100000000;
      const j = Math.floor(r * (i + 1));
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr.slice(0, 3);
  }, [testimonialsPool, seed]);
  const [tIndex, setTIndex] = useState(0);
  useEffect(() => {
    if (selectedTestimonials.length <= 1) return;
    const id = setInterval(() => {
      setTIndex((i) => (i + 1) % selectedTestimonials.length);
    }, 5000);
    return () => clearInterval(id);
  }, [selectedTestimonials.length]);
  return (
    <section
      id="services"
      className={`${variant === "page" ? "no-section-bg dark:section-strong dark:tone-light" : "no-section-bg"} relative mx-auto max-w-7xl px-5 py-20 overflow-hidden`}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -z-10 inset-0"
      >
        <motion.div
          className="absolute w-80 h-80 rounded-full blur-3xl"
          style={{ background: "radial-gradient(closest-side, var(--brand-accent) 0%, transparent 70%)", opacity: 0.22, left: "-8%", top: "-10%" }}
          animate={{ x: ["0%", "8%", "0%"], y: ["0%", "6%", "0%"] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-3xl"
          style={{ background: "radial-gradient(closest-side, var(--brand-primary) 0%, transparent 70%)", opacity: 0.16, right: "-12%", top: "10%" }}
          animate={{ x: ["0%", "-6%", "0%"], y: ["0%", "-8%", "0%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      <div className={`max-w-3xl ${lang === "ar" ? "ml-auto text-right" : "mr-auto text-left"}`}>
        <div className="inline-flex items-center px-2.5 py-1 rounded-md badge-ink text-[11px] tracking-widest uppercase font-semibold">
          {lang === "ar" ? "ضمن خدماتنا" : "Part of our services"}
        </div>
        <h2 className={`mt-2 text-3xl md:text-5xl font-extrabold text-[var(--brand-primary)] leading-tight ${lang === "ar" ? "text-right" : "text-left"}`}>
          {headline}
        </h2>
        <p className={`mt-3 text-zinc-300 ${lang === "ar" ? "text-right" : "text-left"}`}>{subhead}</p>
      </div>
      <div className={`mt-6 w-full flex flex-wrap items-center ${chipDirClass} ${chipJustify} gap-2`}>
        {categories.map((c) => {
          const activeMatch = c === active;
          return (
            <button
              key={c}
              onClick={() => setActive(c)}
              aria-pressed={activeMatch ? "true" : "false"}
              className={
                "svc-chip px-3 py-1.5 rounded-lg text-xs font-semibold border transition-transform duration-200 will-change-transform hover:-translate-y-0.5 active:scale-95 " +
                (activeMatch
                  ? "bg-[var(--brand-accent)] text-white border-[color-mix(in_oklab,var(--brand-accent),black_8%)]"
                  : "bg-[var(--panel-bg)] text-[var(--brand-accent)] border-[var(--panel-border)] hover:bg-[color-mix(in_oklab,var(--panel-bg),white_8%)] dark:bg-[color-mix(in_oklab,var(--brand-primary),white_8%)] dark:text-zinc-300 dark:border-white/20 dark:hover:bg-[color-mix(in_oklab,var(--brand-primary),white_14%)]")
              }
              data-icon={iconForCategory(String(c))}
            >
              {c}
            </button>
          );
        })}
      </div>
      <div className="mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((c, i) => {
            const isActive = variant === "page" && selected?.title === c.title;
            return (
            <motion.div
              key={c.title}
              className={`group rounded-xl surface p-6 h-64 lg:h-72 flex flex-col ${variant === "page" ? "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]/60" : ""}`}
              initial={mobile && !reduce ? { opacity: 0, y: 14, filter: "blur(4px)" } : undefined}
              whileInView={mobile && !reduce ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
              viewport={mobile && !reduce ? { once: true, amount: 0.2 } : undefined}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: mobile && !reduce ? i * 0.06 : 0 }}
              role={variant === "page" ? "button" : undefined}
              tabIndex={variant === "page" ? 0 : undefined}
              aria-pressed={variant === "page" ? (isActive ? "true" : "false") : undefined}
              aria-label={variant === "page" ? `${detailsTitle}: ${c.title}` : undefined}
              onClick={variant === "page" ? () => setSelected(c) : undefined}
              onKeyDown={
                variant === "page"
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelected(c);
                      }
                    }
                  : undefined
              }
            >
              <div className={`mb-4 relative aspect-[16/9] rounded-lg overflow-hidden transition-all shadow-sm surface ${isActive ? "tone-strong" : ""}`}>
                <ThumbImage
                  cat={c.cat}
                  alt={typeof c.cat === "string" ? c.cat : "service"}
                  sizes="(max-width: 1024px) 50vw, 20vw"
                  src={c.img}
                />
              </div>
              <div className="font-semibold text-white" data-edit-key={`services-card-title-${String(c.title).toLowerCase().replace(/[^a-zA-Z0-9]+/g,"-")}`}>{c.title}</div>
              <div className="mt-2 text-sm text-zinc-300" data-edit-key={`services-card-desc-${String(c.title).toLowerCase().replace(/[^a-zA-Z0-9]+/g,"-")}`}>{c.desc}</div>
              {variant !== "page" ? (
                <div className="mt-auto pt-5 pb-2 flex justify-center">
                  <Link
                    href={`/${lang}/services`}
                    className="inline-flex items-center gap-1 rounded-lg bg-[var(--brand-accent)] text-black px-3 py-1.5 text-xs font-semibold transition-transform duration-200 will-change-transform hover:-translate-y-0.5 active:scale-95 shadow"
                  >
                    {explore} <span className="transition-transform group-hover:translate-x-0.5">→</span>
                  </Link>
                </div>
              ) : null}
            </motion.div>
          )})}
        </div>
      </div>
      {variant === "page" && (
        <div className="mt-8">
          <AnimatePresence mode="wait">
            {selected ? (
            <motion.div
                key={selected.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              className="rounded-2xl surface p-6 md:p-8"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="relative w-full md:w-80 aspect-[16/9] rounded-xl overflow-hidden bg-white/10">
                    <ThumbImage cat={selected.cat} alt={selected.title} sizes="(max-width: 1024px) 60vw, 30vw" src={selected.img} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs tracking-widest uppercase text-[var(--brand-accent)] font-semibold" data-edit-key="services-details-label">{detailsTitle}</div>
                    <h3 className="mt-2 text-2xl font-bold text-white" data-edit-key="services-details-title">{selected.title}</h3>
                    <p className="mt-3 text-zinc-300" data-edit-key="services-details-desc">
                      {detailLines(selected.title, selected.cat).map((l, i) => (
                        <span key={i}>
                          {l}
                          {i < 2 ? <><br/></> : null}
                        </span>
                      ))}
                    </p>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-zinc-300">
                      <div className="rounded-lg surface p-3">
                        <div className="font-semibold text-white">{lang === "ar" ? "نطاق العمل" : "Scope"}</div>
                        <ul className="mt-1 list-disc list-inside">
                          <li>{lang === "ar" ? "تقييم الحالة والمخاطر" : "Case and risk assessment"}</li>
                          <li>{lang === "ar" ? "استراتيجية وتحضيرات" : "Strategy and preparation"}</li>
                          <li>{lang === "ar" ? "تمثيل وتفاوض" : "Representation and negotiation"}</li>
                        </ul>
                      </div>
                      <div className="rounded-lg surface p-3">
                        <div className="font-semibold text-white">{lang === "ar" ? "القيمة المتوقعة" : "Expected value"}</div>
                        <ul className="mt-1 list-disc list-inside">
                          <li>{lang === "ar" ? "سرعة واستجابة" : "Responsive and fast"}</li>
                          <li>{lang === "ar" ? "وضوح وتواصل" : "Clear communication"}</li>
                          <li>{lang === "ar" ? "تركيز على النتائج" : "Outcome-focused"}</li>
                        </ul>
                      </div>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-2">
                      <Link href={contactHref} className="inline-flex items-center rounded-lg bg-[var(--brand-accent)] text-black px-4 py-2 text-sm font-semibold transition-transform duration-200 will-change-transform hover:-translate-y-0.5 active:scale-95 shadow">
                        {contactLabel}
                      </Link>
                      <button onClick={() => setSelected(null)} className="inline-flex items-center rounded-lg border border-zinc-700/40 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/5">
                        {closeLabel}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-dashed border-[var(--panel-border)] bg-[var(--panel-muted-bg)] p-6 text-center"
              >
                <span className="font-semibold text-[var(--brand-accent)]">
                  {lang === "ar" ? "اختر بطاقة لعرض المزيد من التفاصيل هنا." : "Select a card to preview more details here."}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      {variant === "page" && (
        <div className="mt-8 lg:sticky lg:top-24">
          {selected ? (
            <motion.div
              key={`${selected.title}-panels`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl surface p-6"
              >
                <div className="text-xs tracking-widest uppercase text-[var(--brand-accent)] font-semibold">
                  {lang === "ar" ? "خطوات العمل" : "Process steps"}
                </div>
                <ol className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {stepsFor(selected.cat).map((s, i) => (
                    <li key={s} className="flex items-start gap-3 rounded-xl surface p-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--brand-accent)] text-black text-sm font-bold">{i + 1}</span>
                      <span className="text-sm text-zinc-200">{s}</span>
                    </li>
                  ))}
                </ol>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl surface p-6"
              >
                <div className="text-xs tracking-widest uppercase text-[var(--brand-accent)] font-semibold">
                  {lang === "ar" ? "الأسئلة الشائعة" : "FAQs"}
                </div>
                <div className="mt-4 space-y-3">
                  {faqsFor(selected.cat).map((f) => (
                    <details key={f.q} className="rounded-xl surface p-4">
                      <summary className="cursor-pointer text-white font-semibold">{f.q}</summary>
                      <div className="mt-2 text-sm text-zinc-300">{f.a}</div>
                    </details>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--panel-border)] bg-[var(--panel-muted-bg)] p-6 text-center">
              <span className="font-semibold text-[var(--brand-accent)]">
                {lang === "ar" ? "اختر بطاقة لعرض خطوات العمل والأسئلة الشائعة هنا." : "Select a card to preview process steps and FAQs here."}
              </span>
            </div>
          )}
        </div>
      )}
      {variant === "page" && (
        <div className="mt-10">
          <div className="mt-8 rounded-2xl surface p-6 md:p-8">
            <div className="flex items-center">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md badge-ink text-[10px] tracking-widest uppercase font-semibold bg-[var(--brand-accent)]" data-edit-key="services-compare-badge">
                {lang === "ar" ? "مقارنة سريعة للخدمات" : "Quick service comparison"}
              </span>
            </div>
            <div className="mt-4 hidden md:grid md:[grid-template-columns:minmax(320px,_2fr)_repeat(4,_minmax(0,_1fr))] gap-3 text-sm">
              <div className="text-zinc-300">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md badge-ink text-[10px] tracking-widest uppercase font-semibold bg-[var(--brand-accent)]" data-edit-key="services-compare-features-label">
                  {lang === "ar" ? "الميزات" : "Features"}
                </span>
              </div>
              {compareCats.map((c) => (
                <div key={c} className="text-center font-semibold">
                  <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md badge-ink text-[10px] tracking-widest uppercase bg-[var(--brand-accent)]" data-edit-key={`services-compare-cat-${String(c).toLowerCase().replace(/[^a-zA-Z0-9]+/g,"-")}`}>
                    {c}
                  </span>
                </div>
              ))}
              {featureRows.map((feat, r) => (
                <div key={feat} className="contents">
                  <div className="text-zinc-300 py-2 flex items-center gap-2 whitespace-nowrap">
                    <button
                      type="button"
                      aria-label={(lang === "ar" ? "ميزة" : "Feature") + " " + (r + 1)}
                      className="h-5 w-5 inline-flex items-center justify-center rounded-md bg-[var(--brand-accent)] text-[10px] font-bold leading-none text-white dark:text-black"
                    >
                      {r + 1}
                    </button>
                    <span data-edit-key={`services-compare-feature-${r+1}`}>{feat}</span>
                  </div>
                  {compareCats.map((c, col) => (
                    <div key={c + r} className="py-2 text-center">
                      <span className={compareMatrix[r][col] ? "text-[var(--brand-accent)]" : "text-zinc-500"}>
                        {compareMatrix[r][col] ? "✓" : "–"}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="mt-4 grid md:hidden grid-cols-1 gap-3 tone-compare">
              {compareCats.map((cat, col) => (
                <div key={cat} className="rounded-xl surface p-4">
                  <div className="font-semibold">
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md badge-ink text-[10px] tracking-widest uppercase bg-[var(--brand-accent)]" data-edit-key={`services-compare-cat-${String(cat).toLowerCase().replace(/[^a-zA-Z0-9]+/g,"-")}`}>
                      {cat}
                    </span>
                  </div>
                  <ul className="mt-2 list-disc list-inside text-sm text-zinc-300">
                    {featureRows.map((feat, r) =>
                      compareMatrix[r][col] ? <li key={feat} data-edit-key={`services-compare-cat-${col+1}-feature-${r+1}`}>{feat}</li> : null
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 rounded-2xl surface p-6 md:p-8">
            <div className="text-xs tracking-widest uppercase text-[var(--brand-accent)] font-semibold">
              {lang === "ar" ? "موثوق من العملاء" : "Trusted by clients"}
            </div>
            {/* Mobile slider */}
            <div className="mt-4 md:hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`t-${tIndex}-${lang}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                  className="relative rounded-xl surface p-5 overflow-hidden"
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-[var(--brand-accent)]/80" />
                  <div className="text-sm text-zinc-200 leading-relaxed">
                    <span className="text-[var(--brand-accent)]">“</span>
                    {selectedTestimonials[tIndex].text}
                    <span className="text-[var(--brand-accent)]">”</span>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-xs text-zinc-400">
                    <div className="h-8 w-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[10px] text-zinc-300">
                      {selectedTestimonials[tIndex].initials}
                    </div>
                    <div>{selectedTestimonials[tIndex].role}</div>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="mt-3 flex items-center justify-center gap-2">
                {selectedTestimonials.map((_, i) => (
                  <button
                    key={`dot-${i}`}
                    aria-label={`Testimonial ${i + 1}`}
                    onClick={() => setTIndex(i)}
                    className={`h-2.5 rounded-lg transition-all ${tIndex === i ? "w-6 bg-[var(--brand-accent)]" : "w-2.5 bg-white/30"}`}
                  />
                ))}
              </div>
            </div>
            {/* Desktop grid */}
            <div className="mt-4 hidden md:grid md:grid-cols-3 gap-4">
              {selectedTestimonials.map((t, idx) => (
                <motion.div
                  key={t.role + idx}
                  className="relative rounded-xl surface p-5 overflow-hidden"
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: idx * 0.05 }}
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-[var(--brand-accent)]/80" />
                  <div className="text-sm text-zinc-200 leading-relaxed">
                    <span className="text-[var(--brand-accent)]">“</span>
                    {t.text}
                    <span className="text-[var(--brand-accent)]">”</span>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-xs text-zinc-400">
                    <div className="h-8 w-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[10px] text-zinc-300">
                      {t.initials}
                    </div>
                    <div>{t.role}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="mt-8 rounded-2xl surface p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs tracking-widest uppercase text-[var(--brand-accent)] font-semibold" data-edit-key="services-cta-heading">
                {lang === "ar" ? "جاهز للبدء؟" : "Ready to start?"}
              </div>
              <div className="mt-1 text-white font-semibold" data-edit-key="services-cta-subline">
                {lang === "ar" ? "احجز استشارة أو تواصل معنا للانطلاق." : "Book a consultation or contact us to get started."}
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={contactHref} className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-accent)] text-black px-4 py-2 text-sm font-semibold transition-transform duration-200 will-change-transform hover:-translate-y-0.5 active:scale-95 shadow">
                <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M4 6h16a1 1 0 011 1v.3l-9 5.7-9-5.7V7a1 1 0 011-1zm16 3.8V18a1 1 0 01-1 1H5a1 1 0 01-1-1V9.8l8.4 5.3a1 1 0 001.2 0L20 9.8z"/></svg>
                <span>{contactLabel}</span>
              </Link>
              <Link href={`/${lang}/cases`} className="inline-flex items-center gap-2 rounded-lg border border-zinc-700/40 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/5 transition-transform duration-200 will-change-transform hover:-translate-y-0.5 active:scale-95">
                <span>{lang === "ar" ? "اطلع على النجاحات" : "See case results"}</span>
                <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
