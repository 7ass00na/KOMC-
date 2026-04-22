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
  if (cat === "Commercial" || cat === "التجاري" || cat === "Trade" || cat === "التجارة") return "trade";
  if (cat === "Civil" || cat === "المدني") return "disputes";
  if (cat === "Real Estate" || cat === "العقارات") return "trade";
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
type FAQ = { q: string; a: string | string[] };
type Props = { variant?: "home" | "page" };

const serviceFolderImage = (folder: string, imageNumber: number, ext = "jpg") =>
  `/images/Services/${folder}/${imageNumber}.${ext}`;

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
  const detailLines = (item: Item): string[] => {
    const cleanDesc = item.desc.replace(/[.،]\s*$/, "");
    if (lang === "ar") {
      return [
        `تركّز خدمة “${item.title}” على ${cleanDesc} ضمن نطاق ${item.cat}.`,
        "نصمم مسار العمل بحسب الوقائع والمستندات ومتطلبات الإجراء ذات الصلة في الإمارات.",
        "ننسق التفاوض والمتابعة والتمثيل بصورة عملية للوصول إلى نتيجة واضحة وقابلة للتنفيذ.",
      ];
    }
    return [
      `${item.title} focuses on ${cleanDesc} within our ${item.cat} practice.`,
      "We tailor the workstream to the facts, documents, counterpart position, and UAE procedural requirements affecting the matter.",
      "The team coordinates negotiation, filings, and representation to move the case toward a practical outcome.",
    ];
  };
  const scopeItems = (item: Item): string[] => {
    const cleanDesc = item.desc.replace(/[.،]\s*$/, "");
    if (lang === "ar") {
      return [
        `مراجعة وقائع وملف “${item.title}” والمستندات الداعمة.`,
        `خطة عمل مخصصة لمعالجة ${cleanDesc}.`,
        "دعم التفاوض والإجراءات والتمثيل حسب مرحلة الملف.",
      ];
    }
    return [
      `Review the ${item.title} facts, documents, and counterparty position.`,
      `Build a strategy tailored to ${cleanDesc}.`,
      "Support negotiation, filings, and representation as the matter develops.",
    ];
  };
  const valueItems = (item: Item): string[] => {
    if (lang === "ar") {
      return [
        `صياغة قانونية عملية تتناسب مع طبيعة ${item.cat}.`,
        "وضوح في الأولويات والمستندات والخطوات التالية.",
        "تركيز على تقليل المخاطر وتحسين فرص الحل أو التنفيذ.",
      ];
    }
    return [
      `Practical legal guidance aligned with the demands of ${item.cat}.`,
      "Clear priorities, document requests, and next actions.",
      "Outcome-focused handling that reduces risk and improves leverage.",
    ];
  };
  const detailsFooterLabel = (item: Item): string => {
    const cleanDesc = item.desc.replace(/[.،]\s*$/, "");
    if (lang === "ar") {
      return `ابدأ ملف “${item.title}” بخطة واضحة، ومستندات مرتبة، ومسار عملي لمعالجة ${cleanDesc}.`;
    }
    return `Start ${item.title} with a clear brief, organized documents, and a practical action plan for ${cleanDesc}.`;
  };
  const stepsFor = (cat: string) => {
    if (lang === "ar") {
      if (cat === "البحري") return ["الإخطار", "تثبيت الضمان", "التحقيق", "الاستراتيجية", "الإجراء", "الإغلاق"];
      if (cat === "التأمين") return ["إشعار المطالبة", "جمع الأدلة", "تقييم التغطية", "التفاوض", "التسوية/التقاضي"];
      if (cat === "التجاري" || cat === "التجارة") return ["مراجعة العقود", "تحليل الالتزامات", "إدارة المستندات", "الامتثال", "التنفيذ"];
      if (cat === "المدني") return ["دراسة الوقائع", "تحليل المسؤولية", "تجهيز المستندات", "محاولة التسوية", "رفع الدعوى/الدفاع", "التنفيذ"];
      if (cat === "العقارات") return ["مراجعة العقود", "فحص الملكية", "إشعار الأطراف", "التفاوض", "الإجراء", "التنفيذ"];
      if (cat === "النزاعات") return ["تحليل النزاع", "اختيار المنتدى", "المذكرات", "المرافعات", "الحل"];
      return ["الاستلام", "الوقائع", "التقييم", "الاستراتيجية", "الإجراء", "النتيجة"];
    }
    if (cat === "Maritime") return ["Notice", "Secure Security", "Investigation", "Strategy", "Action", "Close‑out"];
    if (cat === "Insurance") return ["Claim Notice", "Evidence Collection", "Coverage Review", "Negotiation", "Settlement/Litigation"];
    if (cat === "Commercial" || cat === "Trade") return ["Contract Review", "Obligation Analysis", "Docs Management", "Compliance", "Execution"];
    if (cat === "Civil") return ["Fact Review", "Liability Analysis", "Document Build", "Settlement Attempt", "Action/Defense", "Enforcement"];
    if (cat === "Real Estate") return ["Contract Review", "Title Check", "Notice Stage", "Negotiation", "Proceedings", "Enforcement"];
    if (cat === "Disputes") return ["Case Analysis", "Forum Choice", "Pleadings", "Hearings", "Resolution"];
    return ["Intake", "Facts", "Assessment", "Strategy", "Action", "Resolution"];
  };
  const requiredDocumentsFor = (item: Item): string[] => {
    const title = item.title.toLowerCase();
    if (lang === "ar") {
      if (/حوادث|أميرالية/.test(title)) return ["التقارير البحرية", "سجل الرحلة", "صور أو فيديو الحادث", "مراسلات الأطراف"];
      if (/حجز السفن/.test(title)) return ["مستند الدين أو المطالبة", "مستندات ملكية أو تشغيل السفينة", "بيانات الميناء والوصول", "المراسلات الداعمة"];
      if (/الإيجار|التأخير/.test(title)) return ["عقد الإيجار", "كشف الوقت", "إشعارات التأخير", "مراسلات الرحلة"];
      if (/رقابة دولة الميناء/.test(title)) return ["تقرير التفتيش", "ملاحظات الاحتجاز", "شهادات السفينة", "خطة المعالجة"];
      if (/تأمين بحري/.test(title)) return ["وثيقة التأمين", "إخطار الحادث", "تقرير المساح", "المطالبة والمرفقات"];
      if (/إدارة المطالبات/.test(title)) return ["إشعار المطالبة", "المستندات المؤيدة", "تقدير الخسارة", "مراسلات التسوية"];
      if (/التغطية/.test(title)) return ["الوثيقة والملحقات", "نصوص الاستثناءات", "إخطار الحدث", "مراسلات المؤمن"];
      if (/الرجوع|التحصيل/.test(title)) return ["إثبات السداد", "مستند المسؤولية", "مراسلات الرجوع", "بيانات الطرف المسؤول"];
      if (/البضائع/.test(title)) return ["عقد البيع أو النقل", "سندات الشحن", "تقارير الضرر", "مطالبات الاسترداد"];
      if (/العقوبات|التجارية/.test(title)) return ["العقود التجارية", "بيانات الأطراف", "سجلات الامتثال", "المراسلات التشغيلية"];
      if (/الاعتمادات المستندية|بيع البضائع/.test(title)) return ["الاعتماد المستندي", "الفواتير", "مستندات الشحن", "شهادات المطابقة"];
      if (/الجمارك|الامتثال/.test(title)) return ["بيانات جمركية", "فواتير تجارية", "شهادات المنشأ", "تقارير التدقيق"];
      if (/مطالبات مدنية/.test(title)) return ["العقد أو أساس الالتزام", "المراسلات", "أدلة الضرر", "هوية الأطراف"];
      if (/تحصيل الديون/.test(title)) return ["الفواتير", "كشف الحساب", "الإنذارات", "إثبات التسليم أو الخدمة"];
      if (/تعويضات وأضرار/.test(title)) return ["تقارير الخسارة", "الفواتير أو التقديرات", "الأدلة الفنية", "المراسلات ذات الصلة"];
      if (/تسويات وتنفيذ/.test(title)) return ["اتفاق التسوية أو الحكم", "إخطارات التنفيذ", "بيانات الأصول", "مستندات الإخطار"];
      if (/تصرفات عقارية/.test(title)) return ["عقد البيع أو الشراء", "مستندات الملكية", "المخططات", "موافقات الجهة المختصة"];
      if (/الإيجار|الانتفاع/.test(title)) return ["عقد الإيجار", "الإشعارات", "سجل السداد", "المراسلات"];
      if (/التطوير|الإنشاء/.test(title)) return ["عقد المشروع", "برامج التنفيذ", "شهادات الإنجاز", "مطالبات الدفعات"];
      if (/الملاك|الأصول/.test(title)) return ["مستندات الملكية", "الإشعارات", "سجلات التشغيل", "تقارير المخاطر"];
      if (/تحكيم|تقاضي/.test(title)) return ["العقد", "المطالبات والدفوع", "المراسلات", "المستندات المؤيدة"];
      if (/وساطة|تسويات/.test(title)) return ["مذكرة النزاع", "موقف التسوية", "المستندات الأساسية", "المراسلات"];
      if (/تنفيذ|أوامر ضمان/.test(title)) return ["الحكم أو الأمر", "بيانات الأصول", "تقارير التحري", "طلبات الضمان"];
      if (/الأدلة|الخبرة/.test(title)) return ["تقرير الخبير", "المستندات الفنية", "الصور أو العينات", "المراسلات الفنية"];
      return ["هوية الأطراف", "العقود أو الاتفاقات", "المراسلات الرئيسية", "أي مستندات داعمة مرتبطة بالملف"];
    }
    if (/admiralty|accidents|casualty/.test(title)) return ["Marine incident report", "Voyage log", "Photos or video evidence", "Party correspondence"];
    if (/vessel arrests/.test(title)) return ["Claim evidence", "Vessel ownership or operator details", "Port call information", "Supporting correspondence"];
    if (/charterparty|demurrage/.test(title)) return ["Charterparty", "Statement of facts", "Delay notices", "Voyage correspondence"];
    if (/port state control/.test(title)) return ["Inspection report", "Detention notice", "Statutory certificates", "Rectification plan"];
    if (/marine insurance/.test(title)) return ["Insurance policy", "Incident notice", "Survey report", "Claim file attachments"];
    if (/claims handling/.test(title)) return ["Claim notice", "Supporting records", "Loss assessment", "Settlement correspondence"];
    if (/coverage counsel/.test(title)) return ["Policy wording and endorsements", "Exclusion clauses", "Notice of event", "Insurer correspondence"];
    if (/subrogation|recoveries/.test(title)) return ["Proof of indemnity payment", "Liability evidence", "Recovery correspondence", "Third-party details"];
    if (/cargo claims/.test(title)) return ["Sale or carriage contract", "Bills of lading", "Damage reports", "Recovery claim papers"];
    if (/commercial contracts|sanctions/.test(title)) return ["Commercial contracts", "Counterparty information", "Compliance records", "Operational correspondence"];
    if (/sale of goods|lcs/.test(title)) return ["Letter of credit", "Invoices", "Shipping documents", "Inspection or conformity certificates"];
    if (/customs|commercial compliance/.test(title)) return ["Customs declarations", "Commercial invoices", "Certificates of origin", "Audit records"];
    if (/civil claims/.test(title)) return ["Contract or liability basis", "Key correspondence", "Damage evidence", "Party identification documents"];
    if (/debt recovery/.test(title)) return ["Invoices", "Statement of account", "Demand letters", "Proof of delivery or services"];
    if (/compensation claims/.test(title)) return ["Loss reports", "Invoices or estimates", "Technical evidence", "Related correspondence"];
    if (/settlement|enforcement/.test(title)) return ["Settlement agreement or judgment", "Enforcement notices", "Asset information", "Service records"];
    if (/property transactions/.test(title)) return ["Sale and purchase agreement", "Title documents", "Plans or unit details", "Authority approvals"];
    if (/lease|tenancy/.test(title)) return ["Lease agreement", "Notices", "Payment history", "Tenant-landlord correspondence"];
    if (/developer|construction/.test(title)) return ["Project contract", "Progress schedules", "Completion records", "Payment claims"];
    if (/landlord|asset advisory/.test(title)) return ["Title records", "Portfolio notices", "Operational records", "Risk review documents"];
    if (/arbitration|litigation/.test(title)) return ["Contract", "Statements of claim or defense", "Key correspondence", "Supporting exhibits"];
    if (/mediation|settlements/.test(title)) return ["Dispute summary", "Settlement position paper", "Core documents", "Negotiation correspondence"];
    if (/enforcement|security/.test(title)) return ["Judgment or order", "Asset information", "Investigation findings", "Security application papers"];
    if (/expert evidence/.test(title)) return ["Expert report", "Technical documents", "Photos or samples", "Expert correspondence"];
    return ["Party identification documents", "Contracts or agreements", "Key correspondence", "Supporting records relevant to the matter"];
  };
  const faqsFor = (item: Item): FAQ[] => {
    const documentsAnswer = requiredDocumentsFor(item);
    const title = item.title.toLowerCase();
    const cleanDesc = item.desc.replace(/[.،]\s*$/, "");

    if (lang === "ar") {
      if (/حوادث بحرية|حوادث وأميرالية|أميرالية/.test(title))
        return [
          { q: "ما أول أولوية بعد الحادث البحري؟", a: "الأولوية تكون لحفظ الأدلة وتثبيت الوقائع وتقييم المسؤولية بسرعة قبل اتساع الخسائر أو تغير موقف الأطراف." },
          { q: "ما المستندات المطلوبة؟", a: documentsAnswer },
          { q: "هل يمكن تنسيق الخبرة والإشعارات العاجلة؟", a: "نعم، ننسق مع الخبراء والإشعارات والمراسلات العاجلة لدعم المطالبة أو الدفاع منذ المرحلة الأولى." },
        ];
      if (/حجز السفن/.test(title))
        return [
          { q: "متى يكون حجز السفينة مناسبًا؟", a: "يكون مناسبًا عندما توجد مطالبة بحرية مدعومة ويكون تأمين الضمان أو الضغط الإجرائي السريع ذا قيمة عملية." },
          { q: "ما المستندات المطلوبة؟", a: documentsAnswer },
          { q: "هل يتطلب الحجز ترتيبات ضمان؟", a: "غالبًا نعم، ونراجع شكل الضمان وآلية الإفراج أو الاستمرار بحسب قيمة المطالبة والجهة المختصة." },
        ];
      if (/الإيجار|التأخير/.test(title))
        return [
          { q: "كيف يتم تقييم مسؤولية التأخير؟", a: "نراجع العقد وكشف الوقت والإشعارات ومسار الرحلة لتحديد سبب التأخير وأثره المالي والتعاقدي." },
          { q: "ما المستندات المطلوبة؟", a: documentsAnswer },
          { q: "هل يمكن تسوية المطالبة دون نزاع طويل؟", a: "نعم، كثير من هذه الملفات تُحسم مبكرًا عندما تكون الوقائع والمستندات منظمة بشكل جيد." },
        ];
      if (/الوكلاء الملاحيين|رقابة دولة الميناء/.test(title))
        return [
          { q: "كيف نتعامل مع الملاحظات أو الاحتجاز؟", a: "نقيّم أسباب الملاحظة أو الاحتجاز وننسق المعالجة النظامية والتواصل مع الجهات المختصة لتقليل التعطيل." },
          { q: "ما المستندات المطلوبة؟", a: documentsAnswer },
          { q: "هل يمكن تقليل الأثر التشغيلي؟", a: "نعم، نربط بين المعالجة القانونية والمتطلبات الفنية والتشغيلية لتسريع الحل." },
        ];
      if (/تأمين بحري/.test(title))
        return [
          { q: "كيف يتم تقييم نطاق التغطية؟", a: "نراجع صياغة الوثيقة والملحقات وسبب الحادث وتسلسل الإخطار لتحديد مدى انطباق التغطية أو الاستثناءات." },
          { q: "ما المستندات المطلوبة؟", a: documentsAnswer },
          { q: "هل يمكن تحسين موقف المطالبة أمام المؤمن؟", a: "نعم، من خلال عرض منظم للوقائع والخسارة والالتزام بشروط الوثيقة والمتطلبات الإجرائية." },
        ];
      if (/إدارة المطالبات/.test(title))
        return [
          { q: "ما الذي يجعل إدارة المطالبة فعالة؟", a: "فعالية الملف تعتمد على ترتيب الوقائع وتقدير الخسارة وتوجيه المراسلات بصورة تدعم التفاوض أو التصعيد عند الحاجة." },
          { q: "ما المستندات المطلوبة؟", a: documentsAnswer },
          { q: "متى ننتقل من التفاوض إلى الإجراء؟", a: "ننتقل عندما تتعثر التسوية أو يظهر خلل واضح في موقف الطرف المقابل يستدعي خطوة أكثر إلزامًا." },
        ];
      if (/التغطية/.test(title))
        return [
          { q: "متى تظهر إشكالات التغطية عادة؟", a: "تظهر غالبًا عند وجود استثناءات أو تأخر في الإشعار أو خلاف حول سبب الخسارة أو وصف الخطر." },
          { q: "ما المستندات المطلوبة؟", a: documentsAnswer },
          { q: "هل تقدمون رأيًا مكتوبًا حول التغطية؟", a: "نعم، يمكن إعداد تقييم قانوني واضح يبين الموقف التعاقدي ونقاط القوة والمخاطر المحتملة." },
        ];
      if (/الرجوع|التحصيل/.test(title))
        return [
          { q: "كيف تُبنى مطالبة الرجوع؟", a: "تُبنى بإثبات السداد وتحديد الطرف المسؤول وإظهار العلاقة السببية والخسارة القابلة للاسترداد." },
          { q: "ما المستندات المطلوبة؟", a: documentsAnswer },
          { q: "هل يمكن بدء التحصيل دون دعوى كاملة؟", a: "في كثير من الحالات نعم، إذا كان الملف موثقًا جيدًا ويمكن استخدامه بفاعلية في التفاوض." },
        ];
      if (/مطالبات البضائع/.test(title))
        return [
          { q: "كيف يتم إثبات فقد أو تلف البضاعة؟", a: "نربط بين مستندات الشحن وحالة البضاعة والتقارير والمراسلات لتحديد المسؤولية وتسلسل الواقعة." },
          { q: "ما المستندات المطلوبة؟", a: documentsAnswer },
          { q: "هل يمكن الرجوع على أكثر من طرف؟", a: "قد يكون ذلك ممكنًا بحسب العقد ودور الناقل أو البائع أو المؤمن ومرحلة التسليم." },
        ];
      if (/العقود التجارية والعقوبات/.test(title))
        return [
          { q: "كيف تُدار مخاطر العقوبات والامتثال؟", a: "نراجع الأطراف والبنود ومسار الصفقة لتحديد المخاطر التعاقدية والتنظيمية ووضع بدائل تشغيلية آمنة." },
          { q: "ما المستندات المطلوبة؟", a: documentsAnswer },
          { q: "هل يمكن تعديل العقد لتخفيف التعرض؟", a: "نعم، غالبًا ما نوصي بصياغات حماية وآليات تعليق أو إنهاء والتزامات امتثال إضافية." },
        ];
      if (/الاعتمادات المستندية|بيع البضائع/.test(title))
        return [
          { q: "ما أهم نقطة في هذا النوع من الملفات؟", a: "الدقة في مطابقة المستندات مع شروط الاعتماد أو العقد تكون غالبًا العامل الحاسم في قوة الموقف." },
          { q: "ما المستندات المطلوبة؟", a: documentsAnswer },
          { q: "هل يمكن معالجة الرفض أو عدم المطابقة بسرعة؟", a: "نعم، إذا تم تقييم نقاط الخلل مبكرًا ووضع مسار تفاوضي أو تحفظ قانوني واضح." },
        ];
      if (/الجمارك|الامتثال التجاري/.test(title))
        return [
          { q: "كيف يُعالج ملف الامتثال أو التدقيق الجمركي؟", a: "نراجع التصنيف والمستندات الداعمة وسجل المعاملات لتحديد المخاطر ووضع رد منظم على الملاحظات." },
          { q: "ما المستندات المطلوبة؟", a: documentsAnswer },
          { q: "هل يمكن تقليل أثر الجزاءات أو التعطيل؟", a: "نعم، كلما كان الملف موثقًا بشكل أفضل أمكن تحسين المعالجة وتقليل الأثر التشغيلي." },
        ];
      if (/مطالبات مدنية/.test(title))
        return [
          { q: "متى تكون المطالبة المدنية قوية؟", a: "تكون أقوى عندما يتضح أساس الالتزام أو الخطأ ويتوافر دليل واضح على الضرر والعلاقة السببية." },
          { q: "ما المستندات المطلوبة؟", a: documentsAnswer },
          { q: "هل تسبق الدعوى المدنية تسوية؟", a: "غالبًا نعم، ونستخدم تقييم الملف والمستندات لتحسين فرص التسوية قبل التصعيد الرسمي." },
        ];
      if (/تحصيل الديون/.test(title))
        return [
          { q: "ما الذي يسرّع تحصيل الدين؟", a: "وضوح أصل المديونية وكشوف الحساب وسجل المطالبات السابقة يساعد كثيرًا في تعزيز الضغط على المدين أو دعم الإجراء." },
          { q: "ما المستندات المطلوبة؟", a: documentsAnswer },
          { q: "هل نبدأ بإنذار أم بإجراء مباشر؟", a: "يعتمد ذلك على حجم الدين وقوة الإثبات وسلوك الطرف المقابل، ونختار المسار الأكثر كفاءة." },
        ];
      if (/تعويضات وأضرار/.test(title))
        return [
          { q: "كيف يتم تقدير قيمة التعويض؟", a: "نعتمد على تقارير الخسارة والمستندات المالية والأثر الفعلي للضرر لبناء مطالبة قابلة للدعم." },
          { q: "ما المستندات المطلوبة؟", a: documentsAnswer },
          { q: "هل يشمل الملف أضرارًا مباشرة وغير مباشرة؟", a: "نقيّم ذلك بحسب طبيعة الضرر والأساس القانوني أو العقد وحدود الإثبات المتاحة." },
        ];
      if (/تسويات وتنفيذ/.test(title))
        return [
          { q: "متى تكون التسوية العملية أفضل من الاستمرار؟", a: "عندما تحقق حماية مالية أو زمنية أفضل من مسار النزاع الكامل مع إمكانية تنفيذ واضحة." },
          { q: "ما المستندات المطلوبة؟", a: documentsAnswer },
          { q: "كيف يتم التعامل مع التنفيذ بعد الحكم أو الاتفاق؟", a: "نراجع الأصول المتاحة ووسائل التنفيذ والإخطارات اللازمة لدفع الملف نحو نتيجة فعلية." },
        ];
      if (/تصرفات عقارية/.test(title))
        return [
          { q: "ما أهم نقطة قبل إتمام التصرف العقاري؟", a: "التحقق من الملكية والقيود والموافقات وصياغة الالتزامات التعاقدية بصورة تقلل المخاطر المستقبلية." },
          { q: "ما المستندات المطلوبة؟", a: documentsAnswer },
          { q: "هل تشمل الخدمة مراجعة المخاطر قبل التوقيع؟", a: "نعم، نراجع الهيكل التعاقدي والمستندات الأساسية قبل الإتمام أو التسجيل." },
        ];
      if (/نزاعات الإيجار|الانتفاع/.test(title))
        return [
          { q: "ما الذي يحسم نزاع الإيجار أو الانتفاع غالبًا؟", a: "العقد والإشعارات وسجل السداد والالتزامات الفعلية للأطراف تكون عادة محور الحسم." },
          { q: "ما المستندات المطلوبة؟", a: documentsAnswer },
          { q: "هل يمكن إنهاء النزاع بسرعة؟", a: "يمكن ذلك عندما تكون الإشعارات والوقائع موثقة جيدًا ويُختار المسار الإجرائي المناسب مبكرًا." },
        ];
      if (/التطوير|الإنشاء/.test(title))
        return [
          { q: "كيف تُدار مطالبات التأخير أو العيوب؟", a: "نربط بين العقد والبرنامج الزمني وشهادات الإنجاز والمراسلات لتحديد المسؤولية والأثر المالي." },
          { q: "ما المستندات المطلوبة؟", a: documentsAnswer },
          { q: "هل يمكن حماية مستحقات المشروع أثناء النزاع؟", a: "نعم، بحسب العقود وآليات الإشعار والدفع والضمانات المتاحة في الملف." },
        ];
      if (/الملاك|الأصول/.test(title))
        return [
          { q: "ما القيمة الأساسية من هذه الاستشارات؟", a: "الهدف هو تقليل المخاطر التشغيلية والتنظيمية وتحسين الجاهزية قبل ظهور نزاع أو مخالفة." },
          { q: "ما المستندات المطلوبة؟", a: documentsAnswer },
          { q: "هل تشمل الخدمة مراجعة الإشعارات والالتزامات؟", a: "نعم، نراجع الإشعارات والالتزامات التشغيلية والتنظيمية ذات الأثر على الأصل أو المحفظة." },
        ];
      if (/تحكيم وتقاضي/.test(title))
        return [
          { q: "كيف يتم اختيار المسار الأنسب؟", a: "يعتمد القرار على العقد والاختصاص والسرعة والتكلفة وقابلية التنفيذ والهدف التجاري من النزاع." },
          { q: "ما المستندات المطلوبة؟", a: documentsAnswer },
          { q: "هل يمكن الجمع بين الضغط التفاوضي والإجراء؟", a: "نعم، نستخدم المسارين بصورة متوازنة متى كان ذلك يخدم موقف الملف." },
        ];
      if (/وساطة|تسويات/.test(title))
        return [
          { q: "متى تكون الوساطة مجدية؟", a: "تكون مجدية عندما توجد مساحة تفاوض حقيقية ويمكن تنظيم الملف لإنتاج حل أسرع وأقل كلفة." },
          { q: "ما المستندات المطلوبة؟", a: documentsAnswer },
          { q: "كيف نرفع فرص التسوية؟", a: "من خلال عرض منظم للنزاع وتحديد المصالح الجوهرية للطرفين وتقديم بدائل عملية." },
        ];
      if (/تنفيذ|أوامر ضمان/.test(title))
        return [
          { q: "ما الهدف العملي من أوامر الضمان أو التنفيذ؟", a: "الهدف هو حماية الحق وتحسين فرص التحصيل أو منع تهريب الأصول قبل أو بعد صدور القرار." },
          { q: "ما المستندات المطلوبة؟", a: documentsAnswer },
          { q: "هل يلزم تتبع أصول أو معلومات إضافية؟", a: "في بعض الملفات نعم، إذ يكون تحديد الأصول أو مواضع التنفيذ جزءًا حاسمًا من الاستراتيجية." },
        ];
      if (/الأدلة|الخبرة/.test(title))
        return [
          { q: "متى تكون الخبرة الفنية مؤثرة؟", a: "تكون مؤثرة عندما يتوقف تقدير المسؤولية أو الضرر على رأي متخصص أو تحليل تقني قابل للاعتماد." },
          { q: "ما المستندات المطلوبة؟", a: documentsAnswer },
          { q: "هل يمكن إدارة التواصل مع الخبراء؟", a: "نعم، ننسق نطاق التكليف والوثائق والأسئلة الفنية بما يخدم استراتيجية الملف." },
        ];

      return [
        { q: `كيف نتعامل مع خدمة “${item.title}”؟`, a: `نبدأ بمراجعة الوقائع والمستندات المتعلقة بـ ${cleanDesc} ثم نحدد أفضل مسار تفاوضي أو إجرائي بحسب طبيعة الملف.` },
        { q: "ما المستندات المطلوبة؟", a: documentsAnswer },
        { q: `ما النتيجة العملية المستهدفة في “${item.title}”؟`, a: `نركز على تقليل المخاطر وتسريع القرار وتحسين فرص الوصول إلى نتيجة قابلة للتنفيذ ضمن نطاق ${item.cat}.` },
      ];
    }

    if (/maritime\s+accidents|admiralty|casualty/.test(title))
      return [
        { q: "What is the first priority after a maritime incident?", a: "The first priority is to secure evidence, fix the factual record, and assess liability before losses escalate or positions harden." },
        { q: "What documents are required?", a: documentsAnswer },
        { q: "Can you coordinate experts and urgent notices?", a: "Yes. We coordinate surveys, expert input, and urgent communications to support the claim or defense from the outset." },
      ];
    if (/vessel arrests/.test(title))
      return [
        { q: "When is a vessel arrest the right step?", a: "It is usually the right step when a supported maritime claim exists and immediate security or procedural leverage is commercially important." },
        { q: "What documents are required?", a: documentsAnswer },
        { q: "Does the arrest process involve security arrangements?", a: "Often yes. We assess the right form of security and the release strategy based on claim value and forum requirements." },
      ];
    if (/charterparty|demurrage/.test(title))
      return [
        { q: "How do you assess delay responsibility?", a: "We review the contract terms, statement of facts, notices, and voyage record to identify cause, liability, and financial exposure." },
        { q: "What documents are required?", a: documentsAnswer },
        { q: "Can delay claims be resolved without a long dispute?", a: "Yes. Many of these matters can be narrowed or resolved through disciplined factual and contractual analysis early on." },
      ];
    if (/shipping agents|port state control/.test(title))
      return [
        { q: "How do you handle inspection findings or detention issues?", a: "We assess the basis of the finding, align the regulatory response, and coordinate communications to reduce operational disruption." },
        { q: "What documents are required?", a: documentsAnswer },
        { q: "Can you help limit the operational impact?", a: "Yes. We align the legal response with technical and operational steps to support a faster resolution." },
      ];
    if (/marine insurance/.test(title))
      return [
        { q: "How is coverage assessed in a marine insurance matter?", a: "We review the policy wording, endorsements, incident chronology, and notice position to assess cover and exclusions properly." },
        { q: "What documents are required?", a: documentsAnswer },
        { q: "Can you improve the claim position with the insurer?", a: "Yes, by presenting the loss, causation, and compliance record in a structured way under the policy terms." },
      ];
    if (/claims handling/.test(title))
      return [
        { q: "What makes claims handling effective?", a: "Strong claims handling depends on structured facts, quantified loss, disciplined correspondence, and timely escalation when needed." },
        { q: "What documents are required?", a: documentsAnswer },
        { q: "When do you move from negotiation to action?", a: "We escalate when settlement stalls or the opposing position creates a clear need for a stronger procedural step." },
      ];
    if (/coverage counsel/.test(title))
      return [
        { q: "When do coverage disputes usually arise?", a: "They often arise around exclusions, notice timing, risk description, causation, or disagreement over how the policy should respond." },
        { q: "What documents are required?", a: documentsAnswer },
        { q: "Do you provide a written coverage position?", a: "Yes. We can prepare a clear legal assessment of coverage, exclusions, leverage points, and risk areas." },
      ];
    if (/subrogation|recoveries/.test(title))
      return [
        { q: "How is a recovery or subrogation claim built?", a: "It is built around proof of payment, third-party liability, causation, and a recoverable loss supported by clean evidence." },
        { q: "What documents are required?", a: documentsAnswer },
        { q: "Can recovery start without full litigation?", a: "Often yes. A well-documented recovery file can create useful leverage in commercial negotiation before formal proceedings." },
      ];
    if (/cargo claims/.test(title))
      return [
        { q: "How do you prove cargo loss or damage?", a: "We connect the transport documents, cargo condition, survey findings, and correspondence to establish the liability chain." },
        { q: "What documents are required?", a: documentsAnswer },
        { q: "Can losses be pursued against more than one party?", a: "Potentially yes, depending on the contract chain, delivery stage, and the role of the carrier, seller, or insurer." },
      ];
    if (/commercial contracts|sanctions/.test(title))
      return [
        { q: "How do you manage sanctions and compliance risk?", a: "We review counterparties, deal structure, and contract terms to identify regulatory exposure and build safer execution options." },
        { q: "What documents are required?", a: documentsAnswer },
        { q: "Can the contract be revised to reduce exposure?", a: "Yes. We often recommend protective drafting, suspension or termination mechanics, and stronger compliance obligations." },
      ];
    if (/sale of goods|lcs/.test(title))
      return [
        { q: "What matters most in this type of file?", a: "Document conformity against the LC or contract terms is often the key point that decides leverage and recoverability." },
        { q: "What documents are required?", a: documentsAnswer },
        { q: "Can a rejection or discrepancy issue be addressed quickly?", a: "Yes, if the discrepancy is assessed early and the response is structured with both legal and commercial leverage in mind." },
      ];
    if (/customs|commercial compliance/.test(title))
      return [
        { q: "How do you handle a customs or compliance review?", a: "We review classification, supporting records, and transaction history to respond to questions or findings in an organized way." },
        { q: "What documents are required?", a: documentsAnswer },
        { q: "Can you help reduce disruption or penalties?", a: "Yes. A well-prepared response often improves the handling position and helps limit operational impact." },
      ];
    if (/civil claims/.test(title))
      return [
        { q: "When is a civil claim strongest?", a: "A civil claim is strongest when the underlying obligation or fault is clear and the loss and causation are properly evidenced." },
        { q: "What documents are required?", a: documentsAnswer },
        { q: "Should settlement be attempted first?", a: "Usually yes. We use the file strength and documentary position to assess whether early settlement improves outcome and cost efficiency." },
      ];
    if (/debt recovery/.test(title))
      return [
        { q: "What usually accelerates debt recovery?", a: "Clear proof of the debt, account history, and prior demand efforts often create the strongest leverage for recovery." },
        { q: "What documents are required?", a: documentsAnswer },
        { q: "Do you start with a demand or a direct filing?", a: "That depends on the debt size, proof quality, and counterparty conduct. We choose the most efficient route for pressure and recovery." },
      ];
    if (/compensation claims/.test(title))
      return [
        { q: "How is compensation value assessed?", a: "We assess compensation through loss reports, financial records, expert input, and the provable impact of the damage." },
        { q: "What documents are required?", a: documentsAnswer },
        { q: "Can both direct and indirect losses be considered?", a: "That depends on the legal basis, contract framework, and what can be supported by the available evidence." },
      ];
    if (/settlement|enforcement/.test(title))
      return [
        { q: "When is a practical settlement better than continued action?", a: "It is usually better when it protects value, time, or enforcement certainty more effectively than a longer dispute path." },
        { q: "What documents are required?", a: documentsAnswer },
        { q: "How do you approach enforcement after judgment or settlement?", a: "We assess asset position, available enforcement tools, and notice steps to move the file toward an actual recovery result." },
      ];
    if (/property transactions/.test(title))
      return [
        { q: "What matters most before a property transaction closes?", a: "Title position, restrictions, approvals, and properly drafted obligations are the main issues to clear before completion." },
        { q: "What documents are required?", a: documentsAnswer },
        { q: "Does the work include pre-signing risk review?", a: "Yes. We review the transaction structure and core documents before completion or registration." },
      ];
    if (/lease|tenancy/.test(title))
      return [
        { q: "What usually decides a lease or tenancy dispute?", a: "The lease terms, notices, payment history, and the parties' actual performance usually determine the strength of the file." },
        { q: "What documents are required?", a: documentsAnswer },
        { q: "Can the dispute be resolved quickly?", a: "It can, especially when notices and core facts are documented clearly and the right forum is engaged early." },
      ];
    if (/developer|construction/.test(title))
      return [
        { q: "How do you manage delay or defect claims in a project?", a: "We connect the contract, programme, completion records, and project correspondence to establish responsibility and financial exposure." },
        { q: "What documents are required?", a: documentsAnswer },
        { q: "Can payment entitlement be protected during the dispute?", a: "Yes, depending on contract mechanics, notice compliance, and the security or payment structure in the file." },
      ];
    if (/landlord|asset advisory/.test(title))
      return [
        { q: "What is the main value of landlord or asset advisory?", a: "The main value is reducing operational and regulatory risk before it turns into a dispute, default, or portfolio issue." },
        { q: "What documents are required?", a: documentsAnswer },
        { q: "Does the work include notice and obligation review?", a: "Yes. We review notices, operational obligations, and compliance exposures affecting the asset or portfolio." },
      ];
    if (/arbitration|litigation/.test(title))
      return [
        { q: "How do you choose between arbitration and litigation?", a: "The choice depends on the contract, forum, speed, confidentiality, cost, enforcement, and the client's wider commercial goal." },
        { q: "What documents are required?", a: documentsAnswer },
        { q: "Can negotiation continue while proceedings are prepared?", a: "Yes. We often use procedural readiness and negotiation pressure together where that improves leverage." },
      ];
    if (/mediation|settlements/.test(title))
      return [
        { q: "When is mediation worth pursuing?", a: "It is usually worthwhile where there is real settlement space and the file can be organized to support a faster, lower-cost outcome." },
        { q: "What documents are required?", a: documentsAnswer },
        { q: "How do you improve settlement prospects?", a: "We structure the dispute narrative, identify the real commercial drivers, and present workable resolution options." },
      ];
    if (/enforcement|security/.test(title))
      return [
        { q: "What is the practical goal of enforcement or security relief?", a: "The goal is to protect the claim position and improve the chances of recovery by securing assets or restricting dissipation." },
        { q: "What documents are required?", a: documentsAnswer },
        { q: "Does the strategy involve asset tracing?", a: "In some matters yes, because identifying assets or enforcement points can be decisive to the recovery path." },
      ];
    if (/expert evidence/.test(title))
      return [
        { q: "When does expert evidence become critical?", a: "It becomes critical when liability, causation, technical failure, or loss valuation depends on specialized analysis." },
        { q: "What documents are required?", a: documentsAnswer },
        { q: "Can you manage the expert workstream?", a: "Yes. We help define the scope, inputs, and technical issues so the expert process supports the case strategy." },
      ];

    return [
      { q: `How do you handle ${item.title}?`, a: `We begin with the facts and documents behind ${cleanDesc}, then build the most practical negotiation or action plan for the matter.` },
      { q: "What documents are required?", a: documentsAnswer },
      { q: `What practical outcome do you target in ${item.title}?`, a: `We focus on reducing risk, accelerating decision-making, and improving the prospects of an enforceable outcome within the ${item.cat} practice.` },
    ];
  };
  const headline =
    lang === "ar"
      ? "خدمات قانونية واستشارية متكاملة"
      : "Integrated legal services & consultancy";
  const subhead =
    lang === "ar"
      ? "دعم قانوني شامل في مجالات النقل البحري، التجاري، التأمين، المدني، العقارات، والمنازعات بما يتسق مع أهدافك الأساسية. إليك جزءاً من ممارستنا."
      : "Comprehensive legal support across maritime, commercial, insurance, civil, real estate, and disputes matters, aligned with your core objectives. Here is part of our practice.";
  const categoriesAll = lang === "ar"
    ? ["البحري", "التأمين", "التجاري", "المدني", "العقارات", "النزاعات", "الأسرة", "العمل", "جنائي", "الجرائم الإلكترونية"]
    : ["Maritime", "Insurance", "Commercial", "Civil", "Real Estate", "Disputes", "Family", "Labour", "Criminal", "E‑Crime"];
  const categoriesHome = lang === "ar"
    ? ["البحري", "التجاري", "المدني", "التأمين", "النزاعات"]
    : ["Maritime", "Commercial", "Civil", "Insurance", "Disputes"];
  const categories = variant === "home" ? categoriesHome : categoriesAll;
  const slugToLabel = useMemo(
    () =>
      lang === "ar"
        ? {
            maritime: "البحري",
            insurance: "التأمين",
            trade: "التجاري",
            commercial: "التجاري",
            civil: "المدني",
            disputes: "النزاعات",
            "real-estate": "العقارات",
            realestate: "العقارات",
            family: "الأسرة",
            labour: "العمل",
            labor: "العمل",
            criminal: "جنائي",
            ecrime: "الجرائم الإلكترونية",
          }
        : {
            maritime: "Maritime",
            insurance: "Insurance",
            trade: "Commercial",
            commercial: "Commercial",
            civil: "Civil",
            disputes: "Disputes",
            "real-estate": "Real Estate",
            realestate: "Real Estate",
            family: "Family",
            labour: "Labour",
            labor: "Labour",
            criminal: "Criminal",
            ecrime: "E‑Crime",
          },
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
  const [selected, setSelected] = useState<Item | null>(null);
  const iconForCategory = (label: string) => {
    const l = String(label).toLowerCase();
    if (/(maritime|بحر)/.test(l)) return "anchor";
    if (/(insur|تأمين)/.test(l)) return "shield";
    if (/(commercial|trade|تجار)/.test(l)) return "box";
    if (/(civil|مدني)/.test(l)) return "gavel";
    if (/(real estate|real-estate|عقار)/.test(l)) return "briefcase";
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
            { title: "حوادث بحرية", desc: "تصادم، إنقاذ، معدل عام، استجابة للأزمات.", cat: "البحري", img: serviceFolderImage("Maritime", 1) },
            { title: "حجز السفن", desc: "حجز، امتيازات، وترتيبات ضمان.", cat: "البحري", img: serviceFolderImage("Maritime", 2) },
            { title: "عقود الإيجار والتأخير", desc: "صياغة العقود ومعالجة التأخير والمطالبات.", cat: "البحري", img: serviceFolderImage("Maritime", 3) },
            { title: "عقود الوكلاء الملاحيين", desc: "تفتيش، احتجاز، والتعامل مع المخالفات.", cat: "البحري", img: serviceFolderImage("Maritime", 4, "png") },

            { title: "تأمين بحري", desc: "تغطية، رجوع، ونوادي الحماية.", cat: "التأمين", img: serviceFolderImage("Insurance", 1) },
            { title: "إدارة المطالبات", desc: "استلام المطالبة وتقييمها والتفاوض عليها.", cat: "التأمين", img: serviceFolderImage("Insurance", 2) },
            { title: "استشارات التغطية", desc: "نطاق الوثيقة والاستثناءات والمسؤوليات.", cat: "التأمين", img: serviceFolderImage("Insurance", 3) },
            { title: "الرجوع والتحصيل", desc: "استرداد المدفوعات من الأطراف المسؤولة.", cat: "التأمين", img: serviceFolderImage("Insurance", 4) },

            { title: "مطالبات البضائع", desc: "فقدان وتلف وسوء تسليم واستردادات.", cat: "التجاري", img: serviceFolderImage("Commercial", 1) },
            { title: "العقود التجارية والعقوبات", desc: "عقوبات وامتثال وفحص الأطراف والالتزامات.", cat: "التجاري", img: serviceFolderImage("Commercial", 2) },
            { title: "الاعتمادات المستندية وبيع البضائع", desc: "اعتمادات مستندية وعقود توريد وسلاسل بيع.", cat: "التجاري", img: serviceFolderImage("Commercial", 3) },
            { title: "الجمارك والامتثال التجاري", desc: "إفراجات وتصنيف وتدقيقات وإجراءات تشغيلية.", cat: "التجاري", img: serviceFolderImage("Commercial", 4) },

            { title: "مطالبات مدنية", desc: "إخلالات تعاقدية ومسؤولية مدنية ومطالبات تعويض.", cat: "المدني", img: serviceFolderImage("Civil", 1) },
            { title: "تحصيل الديون", desc: "إنذارات ومفاوضات وإجراءات لتحصيل المستحقات.", cat: "المدني", img: serviceFolderImage("Civil", 2) },
            { title: "تعويضات وأضرار", desc: "تقدير الضرر وبناء ملف المطالبة بالأدلة.", cat: "المدني", img: serviceFolderImage("Civil", 3) },
            { title: "تسويات وتنفيذ", desc: "حلول ودية وتنفيذ الأحكام والالتزامات.", cat: "المدني", img: serviceFolderImage("Civil", 4) },

            { title: "تصرفات عقارية", desc: "بيع وشراء وصياغة وثائق الملكية والتصرف.", cat: "العقارات", img: serviceFolderImage("Real Estate", 1) },
            { title: "نزاعات الإيجار والانتفاع", desc: "عقود إيجار وإخلاء ومطالبات إيجارية.", cat: "العقارات", img: serviceFolderImage("Real Estate", 2) },
            { title: "مطالبات التطوير والإنشاء", desc: "تأخير وعيوب وتسليم ومدفوعات المشاريع.", cat: "العقارات", img: serviceFolderImage("Real Estate", 3) },
            { title: "استشارات الملاك والأصول", desc: "إشعارات ومخاطر تشغيلية وامتثال للعقارات.", cat: "العقارات", img: serviceFolderImage("Real Estate", 4) },

            { title: "تحكيم وتقاضي", desc: "مرافعات محلية وتحكيم مؤسسي.", cat: "النزاعات", img: serviceFolderImage("Disputes", 1) },
            { title: "وساطة وتسويات", desc: "حل نزاعات سريع وفعال.", cat: "النزاعات", img: serviceFolderImage("Disputes", 2) },
            { title: "تنفيذ وأوامر ضمان", desc: "حجز أصول وضمانات قضائية.", cat: "النزاعات", img: serviceFolderImage("Disputes", 3) },
            { title: "الأدلة والخبرة الفنية", desc: "تقارير خبراء وشهادة فنية.", cat: "النزاعات", img: serviceFolderImage("Disputes", 4) },

            { title: "طلاق وحضانة", desc: "إجراءات الطلاق وترتيبات الحضانة والنفقة.", cat: "الأسرة", img: serviceFolderImage("Family", 1) },
            { title: "إرث ووصايا", desc: "صياغة الوصايا وتوزيع التركات وإثباتها.", cat: "الأسرة", img: serviceFolderImage("Family", 2) },
            { title: "عقود زواج", desc: "عقود الزواج والاتفاقات السابقة للزواج.", cat: "الأسرة", img: serviceFolderImage("Family", 3) },
            { title: "نزاعات أسرية", desc: "تسويات ودية وإجراءات محكمة الأسرة.", cat: "الأسرة", img: serviceFolderImage("Family", 4) },

            { title: "عقود العمل", desc: "صياغة العقود وسياسات الموارد البشرية.", cat: "العمل", img: serviceFolderImage("Labour", 1) },
            { title: "الفصل والشكاوى", desc: "إجراءات الفصل العادل وتسوية الشكاوى.", cat: "العمل", img: serviceFolderImage("Labour", 2) },
            { title: "الأجور والعمل الإضافي", desc: "مطالبات الأجور وساعات العمل.", cat: "العمل", img: serviceFolderImage("Labour", 3) },
            { title: "الامتثال العمالي", desc: "لوائح العمل وسياسات أماكن العمل.", cat: "العمل", img: serviceFolderImage("Labour", 4) },

            { title: "دفاع جنائي", desc: "قضايا جنائية وجرائم أموال.", cat: "جنائي", img: serviceFolderImage("Criminal", 1) },
            { title: "تحقيقات الشرطة", desc: "تمثيل أثناء التحقيق والاستجواب.", cat: "جنائي", img: serviceFolderImage("Criminal", 2) },
            { title: "الكفالة والاحتجاز", desc: "طلبات الإفراج والضمان.", cat: "جنائي", img: serviceFolderImage("Criminal", 3) },
            { title: "طعون وتخفيف", desc: "استئناف الأحكام وإجراءات التخفيف.", cat: "جنائي", img: serviceFolderImage("Criminal", 4) },

            { title: "احتيال إلكتروني", desc: "الاختراق والجرائم المالية الرقمية.", cat: "الجرائم الإلكترونية", img: serviceFolderImage("E-Crime", 1) },
            { title: "حوادث حماية البيانات", desc: "خروقات البيانات وإخطار الجهات.", cat: "الجرائم الإلكترونية", img: serviceFolderImage("E-Crime", 2) },
            { title: "تشهير إلكتروني", desc: "قضايا المحتوى والإساءة عبر الإنترنت.", cat: "الجرائم الإلكترونية", img: serviceFolderImage("E-Crime", 3) },
            { title: "أدلة رقمية", desc: "طب شرعي رقمي وأدلة إلكترونية.", cat: "الجرائم الإلكترونية", img: serviceFolderImage("E-Crime", 4) },
          ]
        : [
            { title: "Maritime  Accidents", desc: "Collisions, salvage, GA, crisis response.", cat: "Maritime", img: serviceFolderImage("Maritime", 1) },
            { title: "Vessel Arrests", desc: "Arrest, liens, security arrangements.", cat: "Maritime", img: serviceFolderImage("Maritime", 2) },
            { title: "Charterparty & Demurrage", desc: "Drafting, delays, claims management.", cat: "Maritime", img: serviceFolderImage("Maritime", 3) },
            { title: "Shipping Agent Contracts", desc: "Inspections, detentions, compliance.", cat: "Maritime", img: serviceFolderImage("Maritime", 4, "png") },

            { title: "Marine Insurance", desc: "Coverage, subrogation, P&I clubs.", cat: "Insurance", img: serviceFolderImage("Insurance", 1) },
            { title: "Claims Handling", desc: "Intake, evaluation, negotiation.", cat: "Insurance", img: serviceFolderImage("Insurance", 2) },
            { title: "Coverage Counsel", desc: "Policy scope, exclusions, liabilities.", cat: "Insurance", img: serviceFolderImage("Insurance", 3) },
            { title: "Subrogation & Recoveries", desc: "Recovery from liable parties.", cat: "Insurance", img: serviceFolderImage("Insurance", 4) },

            { title: "Cargo Claims", desc: "Loss, damage, misdelivery, and recovery strategy.", cat: "Commercial", img: serviceFolderImage("Commercial", 1) },
            { title: "Commercial Contracts & Sanctions", desc: "Sanctions, compliance, party screening, and contract risk.", cat: "Commercial", img: serviceFolderImage("Commercial", 2) },
            { title: "Sale of Goods & LCs", desc: "Letters of credit, supply contracts, and delivery obligations.", cat: "Commercial", img: serviceFolderImage("Commercial", 3) },
            { title: "Customs & Commercial Compliance", desc: "Clearance, classification, audits, and operational compliance.", cat: "Commercial", img: serviceFolderImage("Commercial", 4) },

            { title: "Civil Claims", desc: "Contract breaches, liability disputes, and compensation actions.", cat: "Civil", img: serviceFolderImage("Civil", 1) },
            { title: "Debt Recovery", desc: "Demand strategy, negotiations, and court-backed recovery.", cat: "Civil", img: serviceFolderImage("Civil", 2) },
            { title: "Compensation Claims", desc: "Damages analysis, evidence building, and recovery planning.", cat: "Civil", img: serviceFolderImage("Civil", 3) },
            { title: "Settlement & Enforcement", desc: "Practical settlements, judgment strategy, and enforcement action.", cat: "Civil", img: serviceFolderImage("Civil", 4) },

            { title: "Property Transactions", desc: "Sale, purchase, and title documentation for real estate deals.", cat: "Real Estate", img: serviceFolderImage("Real Estate", 1) },
            { title: "Lease & Tenancy Disputes", desc: "Lease enforcement, eviction, and rent recovery matters.", cat: "Real Estate", img: serviceFolderImage("Real Estate", 2) },
            { title: "Developer & Construction Claims", desc: "Delay, defects, payment, and handover disputes.", cat: "Real Estate", img: serviceFolderImage("Real Estate", 3) },
            { title: "Landlord & Asset Advisory", desc: "Portfolio notices, risk reviews, and operational compliance.", cat: "Real Estate", img: serviceFolderImage("Real Estate", 4) },

            { title: "Arbitration & Litigation", desc: "Courts and institutional arbitration.", cat: "Disputes", img: serviceFolderImage("Disputes", 1) },
            { title: "Mediation & Settlements", desc: "Fast and efficient dispute resolution.", cat: "Disputes", img: serviceFolderImage("Disputes", 2) },
            { title: "Enforcement & Security", desc: "Asset freezes and security orders.", cat: "Disputes", img: serviceFolderImage("Disputes", 3) },
            { title: "Expert Evidence", desc: "Expert reports and testimony.", cat: "Disputes", img: serviceFolderImage("Disputes", 4) },

            { title: "Divorce & Guardianship", desc: "Separation, custody, and support orders.", cat: "Family", img: serviceFolderImage("Family", 1) },
            { title: "Inheritance & Wills", desc: "Wills, probate, and estate distribution.", cat: "Family", img: serviceFolderImage("Family", 2) },
            { title: "Marriage Contracts", desc: "Prenuptials and marital agreements.", cat: "Family", img: serviceFolderImage("Family", 3) },
            { title: "Family Settlements", desc: "Mediation and family court strategy.", cat: "Family", img: serviceFolderImage("Family", 4) },

            { title: "Employment Contracts", desc: "Hiring terms and HR policies.", cat: "Labour", img: serviceFolderImage("Labour", 1) },
            { title: "Termination & Grievances", desc: "Fair dismissal and dispute handling.", cat: "Labour", img: serviceFolderImage("Labour", 2) },
            { title: "Wage & Overtime Claims", desc: "Recovery of unpaid dues.", cat: "Labour", img: serviceFolderImage("Labour", 3) },
            { title: "Workplace Compliance", desc: "Labour regulations and SOPs.", cat: "Labour", img: serviceFolderImage("Labour", 4) },

            { title: "White‑Collar Defense", desc: "Fraud and financial crimes.", cat: "Criminal", img: serviceFolderImage("Criminal", 1) },
            { title: "Police Investigations", desc: "Representation during questioning.", cat: "Criminal", img: serviceFolderImage("Criminal", 2) },
            { title: "Bail & Remand", desc: "Release applications and surety.", cat: "Criminal", img: serviceFolderImage("Criminal", 3) },
            { title: "Appeals & Mitigation", desc: "Post‑conviction advocacy.", cat: "Criminal", img: serviceFolderImage("Criminal", 4) },

            { title: "Cyber Fraud & Hacking", desc: "Intrusions and digital theft.", cat: "E‑Crime", img: serviceFolderImage("E-Crime", 1) },
            { title: "Data Incidents", desc: "Breach response and notifications.", cat: "E‑Crime", img: serviceFolderImage("E-Crime", 2) },
            { title: "Online Defamation", desc: "Content takedown and redress.", cat: "E‑Crime", img: serviceFolderImage("E-Crime", 3) },
            { title: "Digital Evidence", desc: "Forensics and chain of custody.", cat: "E‑Crime", img: serviceFolderImage("E-Crime", 4) },
          ],
    [lang]
  );
  const filtered = useMemo(() => tiles.filter((t) => t.cat === active).slice(0, 4), [active, tiles]);
  useEffect(() => {
    if (!paramLabel || !categories.includes(paramLabel)) return;
    setActive(paramLabel);
  }, [categories, paramLabel]);
  useEffect(() => {
    if (variant !== "page") return;
    if (!filtered.length) {
      setSelected(null);
      return;
    }
    setSelected((current) => {
      if (current && filtered.some((item) => item.title === current.title)) return current;
      return filtered[0];
    });
  }, [filtered, variant]);
  const detailsTitle = lang === "ar" ? "تفاصيل الخدمة" : "Service details";
  const explore = lang === "ar" ? "اكتشف الخدمة" : "Explore service";
  const closeLabel = lang === "ar" ? "إغلاق" : "Close";
  const contactLabel = lang === "ar" ? "اطلب استشارة" : "Request consultation";
  const contactHref = `/${lang}/contact`;
  const compareCats = lang === "ar" ? ["البحري", "التأمين", "التجاري", "النزاعات"] : ["Maritime", "Insurance", "Commercial", "Disputes"];
  const featureRows = lang === "ar"
    ? [
        "الاستجابة الطارئة وحجز السفن",
        "إدارة المطالبات والتعويضات",
        "الاستشارات الخاصة بالتغطية التأمينية",
        "الامتثال والعقوبات والشؤون التجارية",
        "التحكيم والتقاضي",
        "التقارير والخبرة فنية",
      ]
    : [
        "Emergency response & vessel booking",
        "Claims and compensation management",
        "Insurance coverage consulting",
        "Compliance, sanctions, and commercial",
        "Arbitration & litigation",
        "Expert reports & evidence",
      ];
  const compareMatrix: boolean[][] = [
    [true,  true,  true,  true ], // Emergency response & vessel booking
    [true,  true,  true,  true ], // Claims and compensation management
    [true,  true,  true,  false], // Insurance coverage consulting
    [true,  false, true,  true ], // Compliance, sanctions, and commercial
    [true,  true,  true,  true ], // Arbitration & litigation
    [true,  true,  true,  true ], // Expert evidence
  ];
  const testimonialsPool: Testimonial[] = useMemo(
    () =>
      lang === "ar"
        ? [
            { text: "استجابة سريعة ونتائج ملموسة في نزاع بحري معقد.", initials: "GC", role: "GC, Shipping Co." },
            { text: "إرشاد واضح للتغطية التأمينية أدى إلى تسوية عادلة.", initials: "CL", role: "Claims Lead, Insurer" },
            { text: "امتثال تجاري محكم خفض المخاطر وسرّع العمليات.", initials: "OM", role: "Ops Manager, Commercial Group" },
            { text: "فريق احترافي قدم حلولاً عملية قللت الكلفة والوقت.", initials: "LA", role: "Legal Advisor, Logistics" },
            { text: "تحليل دقيق للعقد أنقذنا من نزاع طويل.", initials: "CO", role: "COO, Trading House" },
            { text: "تواصل واضح وخطة تنفيذ محكمة منذ اليوم الأول.", initials: "PM", role: "Project Manager" },
          ]
        : [
            { text: "Fast response and tangible results in a complex maritime dispute.", initials: "GC", role: "GC, Shipping Co." },
            { text: "Clear coverage guidance led to a fair settlement.", initials: "CL", role: "Claims Lead, Insurer" },
            { text: "Tight commercial compliance reduced risk and accelerated operations.", initials: "OM", role: "Ops Manager, Commercial Group" },
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
              className="rounded-2xl surface overflow-hidden"
              >
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="relative w-full md:w-80 aspect-[16/9] rounded-xl overflow-hidden bg-white/10">
                      <ThumbImage cat={selected.cat} alt={selected.title} sizes="(max-width: 1024px) 60vw, 30vw" src={selected.img} />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs tracking-widest uppercase text-[var(--brand-accent)] font-semibold" data-edit-key="services-details-label">{detailsTitle}</div>
                      <h3 className="mt-2 text-2xl font-bold text-white" data-edit-key="services-details-title">{selected.title}</h3>
                      <p className="mt-3 text-zinc-300" data-edit-key="services-details-desc">
                        {detailLines(selected).map((l, i) => (
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
                            {scopeItems(selected).map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-lg surface p-3">
                          <div className="font-semibold text-white">{lang === "ar" ? "القيمة المتوقعة" : "Expected value"}</div>
                          <ul className="mt-1 list-disc list-inside">
                            {valueItems(selected).map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  dir={lang === "ar" ? "rtl" : "ltr"}
                  className="border-t border-[var(--panel-border)] bg-black/10 dark:bg-black/40 backdrop-blur-lg px-6 md:px-8 py-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:w-full">
                    <div className={`sticky-label flex-1 min-w-0 text-xs text-white ${lang === "ar" ? "text-right" : "text-left"}`}>
                      {detailsFooterLabel(selected)}
                    </div>
                    <div className={`flex shrink-0 flex-wrap items-center gap-2 ${lang === "ar" ? "md:mr-auto" : "md:ml-auto"}`}>
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
                  {faqsFor(selected).map((f) => (
                    <details key={f.q} className="rounded-xl surface p-4">
                      <summary className="cursor-pointer text-white font-semibold">{f.q}</summary>
                      <div className="mt-2 text-sm text-zinc-300">
                        {Array.isArray(f.a) ? (
                          <ul className="list-disc list-inside space-y-1">
                            {f.a.map((doc) => (
                              <li key={doc}>{doc}</li>
                            ))}
                          </ul>
                        ) : (
                          f.a
                        )}
                      </div>
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
