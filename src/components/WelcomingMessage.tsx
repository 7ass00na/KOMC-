import Image from "next/image";
import { WelcomeLabels } from "@/lib/welcomeLabels";
import styles from "./welcome-card.module.css";

type Props = {
  lang: "ar" | "en";
  labels: WelcomeLabels;
  onPrimary: () => void;
  labelsReady?: boolean;
  onChangeLang?: (next: "ar" | "en") => void;
};

export default function WelcomingMessage({ lang, labels, onPrimary, labelsReady, onChangeLang }: Props) {
  const isAr = lang === "ar";
  const headline =
    labels.variant === "A"
      ? (isAr ? "حلول قانونية بحرية دقيقة" : "Precise Maritime Legal Solutions")
      : (isAr ? "خبرة بحرية موثوقة تسرّع النتائج" : "Trusted Maritime Expertise, Faster Outcomes");
  const sub =
    isAr
      ? "ندعم العقود، المنازعات، والامتثال عبر الإمارات بمنهج عملي سريع الاستجابة."
      : "Practical support for contracts, disputes, and compliance throughout the UAE.";
  const subLead =
    isAr
      ? "خدمة قانونية موثوقة تغطي القطاعات البحرية والتجارية في دولة الإمارات."
      : "Trusted UAE legal counsel across maritime and commercial matters.";
  const bullets = isAr
    ? ["استشارة أولية واضحة", "إستراتيجية قابلة للتنفيذ", "تواصل سريع وشفاف"]
    : ["Clear initial consult", "Actionable strategy", "Fast, transparent updates"];

  const welcomeTypeAr = (t?: string) => {
    switch (t) {
      case "new_visitor":
        return "بالزائر الجديد";
      case "returning":
        return "بالزائر العائد";
      case "referral":
        return "بالزائر المُحال";
      case "campaign":
        return "بالزائر القادم من الحملة";
      default:
        return "بالزائر";
    }
  };

  const rememberLang = () => {
    try {
      const target = isAr ? "ar" : "en";
      document.cookie = `site_lang=${target}; max-age=${60 * 60 * 24 * 365}; path=/; samesite=lax`;
      if (typeof window !== "undefined") {
        localStorage.setItem("site_lang", target);
      }
    } catch {}
  };
  const announceWaiting = () => {
    try {
      const message = isAr ? "يرجى الانتظار..." : "Please wait...";
      const dur = 2000;
      window.dispatchEvent(new CustomEvent("site-loading", { detail: { duration: dur, message } }) as any);
    } catch {}
  };

  return (
    <div dir={isAr ? "rtl" : "ltr"} className={"grid gap-5 " + (isAr ? "text-right" : "text-left")}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 logo-bg overflow-hidden">
            <Image src="/main_logo.svg" alt={isAr ? "الشعار" : "Logo"} width={40} height={40} className="object-contain logo-anim" />
          </div>
          <div className="text-xs text-[var(--text-secondary)]">
            {isAr ? "مرحبًا بكم" : "Welcome"}{labelsReady ? " — " + (isAr ? welcomeTypeAr(labels.welcomeType) : labels.welcomeType) : ""}
          </div>
        </div>
        {onChangeLang && (
          <button
            onClick={() => onChangeLang(isAr ? "en" : "ar")}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 ring-1 ring-[var(--panel-border)] hover:bg-[var(--panel-muted-bg)] text-xs font-semibold ${styles.langToggle}`}
            aria-label={isAr ? "التبديل إلى الإنجليزية" : "Switch to Arabic"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span>{isAr ? "EN" : "AR"}</span>
          </button>
        )}
      </div>
      <div
        className="grid gap-3 will-change-[opacity,transform]"
        style={{
          opacity: "var(--welcomeFade, 1)",
          transform: "translate3d(0,var(--welcomeShift,0px),0)",
          backfaceVisibility: "hidden" as any,
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--brand-accent)] tracking-tight">{headline}</h1>
        <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">{subLead}</p>
        <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">{sub}</p>
        <ul className="grid gap-2">
          {bullets.map((b) => (
            <li key={b} className="inline-flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-[var(--brand-accent)]" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.ctaDock + " pt-3"}>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={onPrimary}
            className="min-h-[44px] rounded-lg px-5 py-3 bg-[var(--brand-accent)] text-[var(--brand-primary)] font-semibold shadow hover:opacity-90"
          >
            {isAr ? "الانتقال إلى الصفحة الرئيسية" : "Move to Home"}
          </button>
          <a
            href={isAr ? "/ar/services" : "/en/services"}
            onClick={(e) => {
              rememberLang();
              announceWaiting();
            }}
            className="min-h-[44px] rounded-lg px-4 py-3 ring-1 ring-[var(--panel-border)] hover:bg-[var(--panel-muted-bg)]"
          >
            {isAr ? "استعرض الخدمات" : "Explore Services"}
          </a>
        </div>
      </div>
      <div className={`mt-3 flex items-center justify-center gap-4 text-xs ${styles.badgeRow}`}>
        <span className="inline-flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="5" width="18" height="16" rx="3" ry="3" fill="none" stroke="currentColor" strokeWidth="2"/>
            <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="2"/>
            <circle cx="8" cy="14" r="1.6" fill="currentColor"/>
            <circle cx="12" cy="14" r="1.6" fill="currentColor"/>
            <circle cx="16" cy="14" r="1.6" fill="currentColor"/>
          </svg>
          <span>{isAr ? "منذ 2010" : "Since 2010"}</span>
        </span>
        <span className="inline-flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2"/>
            <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2"/>
            <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2"/>
            <path d="M6 16c2 1 4 1 6 0s4-1 6 0" fill="none" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span>{isAr ? "تركيز بحري" : "Maritime Focus"}</span>
        </span>
        <span className="inline-flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2"/>
            <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" fill="none" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span>{isAr ? "حضور عالمي" : "Global Reach"}</span>
        </span>
      </div>
    </div>
  );
}
