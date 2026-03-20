import { createContext, useContext, useMemo, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

type Lang = "en" | "ar";

type LanguageContextValue = {
  lang: Lang;
  dir: "ltr" | "rtl";
  t: (key: string) => string;
  setLang: (next: Lang) => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

const translations: Record<Lang, Record<string, string>> = {
  en: {
    brandName: "Khaled Omer Maritime Consultancy",
    tagline: "Legal & Maritime Consultation in the UAE",
    ctaConsult: "Book a Consultation",
    navHome: "Home",
    navAbout: "About",
    navServices: "Services",
    navNews: "News",
    navCases: "Cases",
    navContact: "Contact",
    heroTitle: "Trusted Maritime & Legal Expertise",
    heroDesc:
      "Specialized in Admiralty, Commercial Shipping, Contracts, Disputes, and Compliance across the UAE & GCC.",
    servicesTitle: "Practice Areas",
    servicesFeature: "FEATURE",
    servicesDiscover: "Discover Our Services",
    servicesRead: "READ MORE",
    servicesViewAll: "VIEW ALL SERVICE",
    aboutRead: "Learn more",
    teamTitle: "Our Legal Team",
    casesTitle: "Successful Case Studies",
    trustTitle: "Trusted by Clients across the UAE",
    aboutIntro:
      "We deliver strategic legal solutions across maritime, corporate, and international matters.",
    aboutBullets1: "Admiralty & Shipping",
    aboutBullets2: "Contracts & Compliance",
    aboutBullets3: "Disputes & Arbitration",
    aboutBullets4: "Corporate Advisory",
    aboutMetrics: "Our Track Record",
    newsTitle: "Insights & Legal Updates",
    newsRead: "Read more",
    expertiseEyebrow: "EXPERTISE",
    expertiseH1a: "Strategy-first.",
    expertiseH1b: "Detail-obsessed.",
    expertiseDesc:
      "We combine executive judgment with rigorous analysis to reduce risk early and drive outcomes efficiently.",
    cap1Title: "Early risk mapping",
    cap2Title: "Document & evidence",
    cap3Title: "Negotiate / arbitrate",
    capCTA: "Meet the team →",
    leadTitle: "Request a Consultation",
    leadDisclaimer:
      "This form and AI assistant collect intake information only and do not provide legal advice.",
    leadName: "Full Name",
    leadEmail: "Email",
    leadPhone: "Phone",
    leadCompany: "Company",
    leadCategory: "Inquiry Category",
    leadJurisdiction: "Jurisdiction",
    leadUrgency: "Urgency",
    leadDetails: "Brief Case Details",
    submit: "Submit",
    chatOpen: "AI Legal Intake",
    heroTrust: "Trusted by 1000+ Clients Worldwide",
    ctaSecondary: "Learn More",
    slide1Title: "Legal & Maritime Consultancy",
    slide1Highlight: "Expert Guidance",
    slide1Desc:
      "UAE maritime, shipping, and commercial matters handled end‑to‑end.\nClear advice, fast turnaround, and court‑ready drafting.\nTrusted by owners, insurers, P&I clubs, and operators.",
    slide2Title: "Charterparty & Cargo",
    slide2Highlight: "Commercial Shipping",
    slide2Desc:
      "Laytime, demurrage, off‑hire, bills of lading, cargo claims, and charter disputes.\nPrecise calculations, documentary review, and liability allocation under UAE law.\nCommercial resolution or arbitration with enforceable outcomes.",
    slide3Title: "Disputes & Arbitration",
    slide3Highlight: "Advocacy & Enforcement",
    slide3Desc:
      "Evidence‑driven case theory, pleadings, and interim relief.\nJurisdiction, enforcement, and recognition across GCC and international regimes.\nStructured negotiations and hearings to secure durable judgments and awards.",
    slide4Title: "Compliance & Governance",
    slide4Highlight: "Regulatory Strategy",
    slide4Desc:
      "Sanctions screening, AML/KYC, and operational compliance for shipping.\nPractical policies, audit trails, and board‑level governance frameworks.\nImplemented onboard and onshore to reduce regulatory exposure.",
    statYears: "Years Experience",
    statSuccess: "Success Rate",
    statCases: "Cases",
    statExperts: "Experts",
    footerIntro:
      "Expert Legal Solutions You Can Trust. Providing comprehensive legal services with integrity and professionalism.",
    footerQuick: "Quick Links",
    footerServices: "Our Services",
    footerContact: "Contact Us",
    footerHome: "Home",
    footerAbout: "About",
    footerBlog: "Blog",
    footerPrivacy: "Privacy Policy",
    footerTerms: "Terms of Service",
    footerDisclaimer: "Legal Disclaimer",
    footerAddress:
      "123 Legal Tower, Business Bay Dubai, United Arab Emirates",
    footerPhone: "+971 50 123 4567",
    footerEmail: "info@khaledomer.com",
    footerHours: "Sun - Thu: 9:00 AM - 6:00 PM",
    newsletterTitle: "Subscribe to our newsletter",
    newsletterPlaceholder: "Your email",
    newsletterSubscribe: "Subscribe",
    footerCopyright:
      "$ Khaled Omer Maritime Consultancy - All rights reserved @ 2026 - Create & Dev by 7assona",
    footerTheme: "Theme",
    badgeLegalMaritime: "LEGAL & MARITIME Consultancy",
    badgeUAEShippingTrade: "UAE · SHIPPING & TRADE",
    badgeRiskComplianceGovernance: "RISK · COMPLIANCE · GOVERNANCE",
    badgeDisputesArbitrationEnforcement: "DISPUTES · ARBITRATION · ENFORCEMENT",
  },
  ar: {
    brandName: "خالد عمر للاستشارات البحرية",
    tagline: "الاستشارات القانونية والبحرية في دولة الإمارات",
    ctaConsult: "احجز استشارة",
    navHome: "الرئيسية",
    navServices: "الخدمات",
    navAbout: "من نحن",
    navNews: "الأخبار",
    navCases: "القضايا",
    navContact: "تواصل معنا",
    heroTitle: "خبرة موثوقة في القانون البحري",
    heroDesc:
      "متخصصون في قضايا الملاحة التجارية، العقود، المنازعات، والامتثال داخل الإمارات والخليج.",
    servicesTitle: "مجالات الممارسة",
    servicesFeature: "المميز",
    servicesDiscover: "اكتشف خدماتنا",
    servicesRead: "اقرأ المزيد",
    servicesViewAll: "عرض جميع الخدمات",
    aboutRead: "اعرف المزيد",
    teamTitle: "فريقنا القانوني",
    casesTitle: "دراسة حالة لقضايا ناجحة",
    trustTitle: "موضع ثقة لدى عملاء في الإمارات",
    aboutIntro:
      "نقدم حلولًا قانونية استراتيجية في المجالات البحرية والشركات والقضايا الدولية.",
    aboutBullets1: "الأميرالية والشحن",
    aboutBullets2: "العقود والامتثال",
    aboutBullets3: "المنازعات والتحكيم",
    aboutBullets4: "استشارات الشركات",
    aboutMetrics: "سجل الإنجازات",
    newsTitle: "مقالات وتحديثات قانونية",
    newsRead: "اقرأ المزيد",
    expertiseEyebrow: "الخبرات",
    expertiseH1a: "الاستراتيجية أولاً.",
    expertiseH1b: "تفاصيل دقيقة.",
    expertiseDesc:
      "نمزج الحكم التنفيذي مع التحليل الدقيق لخفض المخاطر مبكرًا وتحقيق نتائج بكفاءة.",
    cap1Title: "رسم مخاطر مبكر",
    cap2Title: "الوثائق والأدلة",
    cap3Title: "التفاوض / التحكيم",
    capCTA: "تعرف على الفريق →",
    leadTitle: "طلب استشارة",
    leadDisclaimer:
      "يقوم هذا النموذج والمساعد الذكي بجمع معلومات أولية فقط ولا يقدم أي نصيحة قانونية.",
    leadName: "الاسم الكامل",
    leadEmail: "البريد الإلكتروني",
    leadPhone: "رقم الهاتف",
    leadCompany: "الشركة",
    leadCategory: "نوع الطلب",
    leadJurisdiction: "الاختصاص القضائي",
    leadUrgency: "درجة الإلحاح",
    leadDetails: "وصف موجز للحالة",
    submit: "إرسال",
    chatOpen: "المساعد القانوني الذكي",
    heroTrust: "موثوق من أكثر من 1000 عميل حول العالم",
    ctaSecondary: "تعرف أكثر",
    slide1Title: "الاستشارات القانونية والبحرية",
    slide1Highlight: "إرشاد خبير",
    slide1Desc:
      "خدمات قانونية وبحرية متكاملة لقضايا الشحن والأميرالية داخل الإمارات.\nاستشارات واضحة، إنجاز سريع، ومستندات جاهزة للتقاضي.\nحلول عملية لمالكي السفن وشركات التأمين ونوادي الحماية والمشغلين.",
    slide2Title: "عقود الشحن والبضائع",
    slide2Highlight: "الشحن التجاري",
    slide2Desc:
      "وقت التوقف والديمرج، خارج الخدمة، سندات الشحن، مطالبات البضائع، ونزاعات عقود الإيجار.\nحسابات دقيقة، مراجعة المستندات، وتوزيع المسؤولية وفق القانون الإماراتي.\nتسوية تجارية أو تحكيم بنتائج قابلة للإنفاذ.",
    slide3Title: "المنازعات والتحكيم",
    slide3Highlight: "مرافعة وإنفاذ",
    slide3Desc:
      "نظرية دعوى قائمة على الأدلة، مذكرات وإغاثة وقتية.\nالاختصاص والإنفاذ والاعتراف عبر الخليج والأنظمة الدولية.\nمفاوضات وجلسات منظمة لضمان أحكام وقرارات قابلة للتنفيذ.",
    slide4Title: "الامتثال والحوكمة",
    slide4Highlight: "استراتيجية تنظيمية",
    slide4Desc:
      "فحص العقوبات ومكافحة غسل الأموال/اعرف عميلك وامتثال تشغيلي لقطاع الشحن.\nسياسات عملية، سجلات تدقيق، وأطر حوكمة على مستوى الإدارة.\nتطبيق فعّال في البحر والبر لخفض التعرض التنظيمي.",
    statYears: "سنوات الخبرة",
    statSuccess: "نسبة النجاح",
    statCases: "القضايا",
    statExperts: "الخبراء",
    footerIntro:
      "حلول قانونية موثوقة. نقدم خدمات قانونية شاملة بنزاهة واحترافية.",
    footerQuick: "روابط سريعة",
    footerServices: "خدماتنا",
    footerContact: "تواصل معنا",
    footerHome: "الرئيسية",
    footerAbout: "من نحن",
    footerBlog: "المدونة",
    footerPrivacy: "سياسة الخصوصية",
    footerTerms: "الشروط والأحكام",
    footerDisclaimer: "إخلاء المسؤولية القانونية",
    footerAddress:
      "برج القانون، الخليج التجاري دبي، الإمارات العربية المتحدة",
    footerPhone: "+971 50 123 4567",
    footerEmail: "info@khaledomer.com",
    footerHours: "الأحد - الخميس: 9:00 ص - 6:00 م",
    newsletterTitle: "اشترك في النشرة البريدية",
    newsletterPlaceholder: "بريدك الإلكتروني",
    newsletterSubscribe: "اشترك",
    footerCopyright:
      "خالد عمر للاستشارات البحرية. جميع الحقوق محفوظة @ 2026 - تصميم وتطوير بواسطة 7assona",
    footerTheme: "السمة",
    badgeLegalMaritime: "الاستشارات القانونية والبحرية",
    badgeUAEShippingTrade: "الإمارات · الشحن والتجارة",
    badgeRiskComplianceGovernance: "المخاطر · الامتثال · الحوكمة",
    badgeDisputesArbitrationEnforcement: "المنازعات · التحكيم · الإنفاذ",
  },
};

export function LanguageProvider({
  children,
  initialLang,
}: {
  children: React.ReactNode;
  initialLang?: Lang;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const detected: Lang =
    initialLang ??
    (pathname?.startsWith("/ar")
      ? "ar"
      : pathname?.startsWith("/en")
      ? "en"
      : "en");
  const [lang, setLangState] = useState<Lang>(detected);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("site-loading-short"));
    }
    if (pathname === "/Demo.tsx") return;
    const segments = pathname?.split("/") ?? [];
    if (segments.length > 1 && (segments[1] === "en" || segments[1] === "ar")) {
      segments[1] = next;
      router.push(segments.join("/") || "/");
    } else {
      router.push(`/${next}`);
    }
  }, [pathname, router]);

  const value = useMemo<LanguageContextValue>(() => {
    return {
      lang,
      dir: lang === "ar" ? "rtl" : "ltr",
      t: (key: string) => translations[lang][key] ?? key,
      setLang,
    };
  }, [lang, setLang]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
