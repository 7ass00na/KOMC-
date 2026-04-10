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
  const bullets = isAr
    ? ["استشارة أولية واضحة", "إستراتيجية قابلة للتنفيذ", "تواصل سريع وشفاف"]
    : ["Clear initial consult", "Actionable strategy", "Fast, transparent updates"];

  const rememberLang = () => {
    try {
      const target = isAr ? "ar" : "en";
      document.cookie = `site_lang=${target}; max-age=${60 * 60 * 24 * 365}; path=/; samesite=lax`;
      if (typeof window !== "undefined") {
        localStorage.setItem("site_lang", target);
      }
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
            {isAr ? "مرحبًا بكم" : "Welcome"}{labelsReady ? " — " + labels.welcomeType : ""}
          </div>
        </div>
        {onChangeLang && (
          <button
            onClick={() => onChangeLang(isAr ? "en" : "ar")}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 ring-1 ring-[var(--panel-border)] hover:bg-[var(--panel-muted-bg)] text-xs font-semibold"
            aria-label={isAr ? "التبديل إلى الإنجليزية" : "Switch to Arabic"}
          >
            <Image src="/globe.svg" alt="" width={14} height={14} />
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
        <div className="flex items-center gap-3">
          <button
            onClick={onPrimary}
            className="min-h-[44px] rounded-lg px-5 py-3 bg-[var(--brand-accent)] text-[var(--brand-primary)] font-semibold shadow hover:opacity-90"
          >
            {isAr ? "الانتقال إلى الصفحة الرئيسية" : "Move to Home"}
          </button>
          <a
            href={isAr ? "/ar/services" : "/en/services"}
            onClick={rememberLang}
            className="min-h-[44px] rounded-lg px-4 py-3 ring-1 ring-[var(--panel-border)] hover:bg-[var(--panel-muted-bg)]"
          >
            {isAr ? "استعرض الخدمات" : "Explore Services"}
          </a>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
        <span>{isAr ? "منذ 2010" : "Since 2010"}</span>
        <span>•</span>
        <span>{isAr ? "تركيز بحري" : "Maritime Focus"}</span>
        <span>•</span>
        <span>{isAr ? "حضور عالمي" : "Global Reach"}</span>
      </div>
    </div>
  );
}
