'use client';
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

type Props = {
  lang: "en" | "ar";
};

export default function LoginView({ lang }: Props) {
  const isAr = lang === "ar";
  const { lang: activeLang, setLang, t } = useLanguage();
  const base = `/${activeLang}`;
  const router = useRouter();
  const [imgSrc, setImgSrc] = useState<string>("/Cms-low.jpg");
  const [imgStep, setImgStep] = useState<number>(0);
  const [showPass, setShowPass] = useState<boolean>(false);
  const [showResetInfo, setShowResetInfo] = useState<boolean>(false);
  const [showLoginError, setShowLoginError] = useState<boolean>(false);
  const [attemptCount, setAttemptCount] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    const v = sessionStorage.getItem("loginAttempts");
    return v ? parseInt(v, 10) : 0;
  });
  const COOLDOWN_MS = 120000; // 2 minutes
  const [lockUntil, setLockUntil] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    const v = sessionStorage.getItem("loginLockUntil");
    return v ? parseInt(v, 10) : 0;
  });
  const [now, setNow] = useState<number>(Date.now());
  const locked = lockUntil > now;
  if (typeof window !== "undefined") {
    // keep 'now' ticking
    if (!(window as any).__komc_now_timer) {
      (window as any).__komc_now_timer = setInterval(() => {
        try {
          // @ts-ignore
          const setNowGlobal = (window as any).__komc_set_now as ((n: number) => void) | undefined;
          if (setNowGlobal) setNowGlobal(Date.now());
        } catch {}
      }, 1000);
    }
    // expose setter for the ticker
    // @ts-ignore
    (window as any).__komc_set_now = setNow;
  }
  if (!locked && lockUntil && typeof window !== "undefined") {
    // cooldown expired: reset attempts and lock
    if (attemptCount >= 4) {
      setAttemptCount(0);
      sessionStorage.removeItem("loginAttempts");
    }
    setLockUntil(0);
    sessionStorage.removeItem("loginLockUntil");
  }
  const onImgError = () => {
    if (imgStep === 0) {
      setImgStep(1);
      // Try the original spaced filename as a fallback if not renamed yet
      setImgSrc("/Cms%20low.jpg");
    } else if (imgStep === 1) {
      setImgStep(2);
      setImgSrc("/images/team/khaled-omer.webp");
    } else if (imgStep === 2) {
      setImgStep(3);
      setImgSrc("/images/team/khaled-omer.jpg");
    } else if (imgStep === 3) {
      setImgStep(4);
      setImgSrc("/images/team/khaled-omer.png");
    } else {
      setImgSrc("/person.svg");
    }
  };
  return (
    <div className={"relative w-screen px-0 py-0 mx-auto bg-[color-mix(in_oklab,#f4f4f4,white_60%)] dark:bg-[var(--brand-primary)] overflow-hidden" + (isAr ? " rtl" : "")} dir={isAr ? "rtl" : "ltr"}>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
      >
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-3xl"
          style={{ background: "radial-gradient(closest-side, var(--brand-accent) 0%, transparent 70%)", left: "-6%", top: "-8%" }}
          animate={{ x: ["0%", "5%", "0%"], y: ["0%", "6%", "0%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[28rem] h-[28rem] rounded-full blur-3xl"
          style={{ background: "radial-gradient(closest-side, var(--brand-primary) 0%, transparent 70%)", right: "-10%", bottom: "-6%" }}
          animate={{ x: ["0%", "-4%", "0%"], y: ["0%", "-5%", "0%"] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      <div className="grid grid-cols-1 md:[grid-template-columns:35%_65%] gap-4 md:gap-10 min-h-screen items-stretch">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl surface p-6 md:p-8 md:rounded-r-2xl md:rounded-l-none overflow-hidden md:border-l-0 md:order-1 h-full"
        >
          <div className="relative h-full min-h-[360px]">
            <div className="absolute inset-0 rounded-xl overflow-hidden ring-1 ring-white/10">
              <Image
                src={imgSrc}
                alt={isAr ? "محامٍ محترف" : "Professional lawyer"}
                fill
                className="object-cover opacity-85"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                onError={onImgError}
                style={{ objectPosition: "50% 25%" }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_20%_100%,rgba(0,0,0,0.55),transparent_60%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.5),transparent_40%)]" />
              <div className="absolute inset-0 [mask-image:linear-gradient(to_right,black,black,rgba(0,0,0,0.6),transparent)]" />
            </div>
            <div className={"absolute inset-0 flex items-center p-3 md:p-6 " + (isAr ? "justify-end pr-3 md:pr-6" : "justify-center")}>
              <div
                dir={isAr ? "rtl" : "ltr"}
                className={
                  "rounded-xl border border-white/25 ring-1 ring-white/10 bg-black/60 dark:bg-black/60 backdrop-blur-md shadow-lg p-4 md:p-6 flex flex-col gap-3 md:max-w-md " +
                  (isAr ? "items-end text-right" : "items-start text-left")
                }
              >
                <div className={"flex items-center gap-2 " + (isAr ? "flex-row-reverse" : "")}>
                  <div className="h-6 w-6 rounded-full brand-gradient" />
                  <div className={"text-sm md:text-base font-semibold text-transparent bg-clip-text [background-image:linear-gradient(90deg,#ffd17a,#ffffff)] " + (isAr ? "text-right" : "text-left")}>
                    {isAr ? "وصول إدارة نظام المحتوى (CMS)" : "CMS Admin Access"}
                  </div>
                </div>
                <div className={"text-xs md:text-sm text-white/95 " + (isAr ? "text-right" : "text-left")}>
                  {isAr
                    ? "إدارة المحتوى والقضايا وصلاحيات الفريق وإعدادات الموقع بأمان — للمسؤولين المخوّلين فقط."
                    : "Securely manage content, cases, team permissions and site settings — for authorized administrators only."}
                </div>
                <ul className={"mt-1 grid grid-cols-1 gap-1 text-[11px] md:text-xs text-white/95 list-disc list-inside " + (isAr ? "text-right" : "text-left")}>
                  <li>{isAr ? "إدارة المحتوى" : "Manage Content"}</li>
                  <li>{isAr ? "إدارة القضايا" : "Manage Cases"}</li>
                  <li>{isAr ? "صلاحيات الفريق" : "Team Permissions"}</li>
                  <li>{isAr ? "إعدادات الموقع" : "Site Settings"}</li>
                </ul>
              </div>
            </div>
            <div className="absolute inset-x-3 top-3 md:inset-x-6 md:top-6 pointer-events-none" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel-bg)] p-6 md:p-8 md:self-center md:justify-self-center md:max-w-[560px] md:w-full md:mx-auto md:order-2"
        >
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-[var(--ink-primary)]">
              {isAr ? "واجهة الدخول لــ (CMS)" : "KOMC — CMS Admin"}
            </h1>
            <p className="text-sm text-white/90">
              {isAr
                ? "قم بتسجيل الدخول لإدارة المحتوى والقضايا وصلاحيات الفريق وإعدادات الموقع بأمان — للمسؤولين المخوّلين فقط."
                : "Login to manage content, cases, team permissions and site settings — for authorized administrators only."}
            </p>
          </div>
          <form
            className="mt-6 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget as HTMLFormElement;
              const btn = form.querySelector("button[type='submit']") as HTMLButtonElement | null;
              if (!btn) return;
              if (locked) return;
              btn.disabled = true;
              const idEl = form.querySelector("#email") as HTMLInputElement | null;
              const pwEl = form.querySelector("#password") as HTMLInputElement | null;
              const identifier = idEl?.value?.trim() || "";
              const password = pwEl?.value || "";
              try {
                const res = await fetch("/api/admin/auth/login", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ identifier, password }),
                });
                if (res.ok) {
                  const data = await res.json();
                  if (typeof window !== "undefined") {
                    try {
                      localStorage.setItem("auth", "true");
                      localStorage.setItem("role", data?.user?.role || "admin");
                    } catch {}
                  }
                  router.push(`/${isAr ? "ar" : "en"}/admin`);
                } else {
                  const next = attemptCount + 1;
                  setAttemptCount(next);
                  if (typeof window !== "undefined") sessionStorage.setItem("loginAttempts", String(next));
                  if (next >= 4 && typeof window !== "undefined") {
                    const until = Date.now() + COOLDOWN_MS;
                    setLockUntil(until);
                    sessionStorage.setItem("loginLockUntil", String(until));
                  }
                  setShowLoginError(true);
                }
              } catch {
                const next = attemptCount + 1;
                setAttemptCount(next);
                if (typeof window !== "undefined") sessionStorage.setItem("loginAttempts", String(next));
                if (next >= 4 && typeof window !== "undefined") {
                  const until = Date.now() + COOLDOWN_MS;
                  setLockUntil(until);
                  sessionStorage.setItem("loginLockUntil", String(until));
                }
                setShowLoginError(true);
              } finally {
                btn.disabled = false;
              }
            }}
          >
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-[var(--text-secondary)]">
                {isAr ? "اسم المستخدم أو البريد الإلكتروني" : "Username or Email"} <span className="text-[var(--brand-accent)]">*</span>
              </label>
              <input
                id="email"
                type="text"
                required
                placeholder={isAr ? "اسم المستخدم أو البريد" : "username or email"}
                className="h-10 w-full rounded-lg border border-[var(--panel-border)] bg-white/70 dark:bg-[color-mix(in_oklab,var(--brand-primary),white_10%)] px-3 text-sm text-[var(--ink-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-[var(--text-secondary)]">
                {isAr ? "كلمة المرور" : "Password"} <span className="text-[var(--brand-accent)]">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  required
                  className="h-10 w-full rounded-lg border border-[var(--panel-border)] bg-white/70 dark:bg-[color-mix(in_oklab,var(--brand-primary),white_10%)] pr-10 px-3 text-sm text-[var(--ink-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]"
                />
                <button
                  type="button"
                  aria-label={isAr ? (showPass ? "إخفاء كلمة المرور" : "إظهار كلمة المرور") : (showPass ? "Hide password" : "Show password")}
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute inset-y-0 end-2 my-auto h-7 w-7 rounded-md flex items-center justify-center text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/10"
                >
                  {showPass ? (
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true"><path fill="currentColor" d="M12 5c5 0 9.27 3.11 11 7-1.73 3.89-6 7-11 7S2.73 15.89 1 12c1.73-3.89 6-7 11-7Zm0 2C8.06 7 4.7 9.1 3.2 12 4.7 14.9 8.06 17 12 17s7.3-2.1 8.8-5C19.3 9.1 15.94 7 12 7Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z"/></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true"><path fill="currentColor" d="M3.28 2.22 2.22 3.28l3.05 3.06C3.61 7.66 2.27 9.67 1.5 12c1.73 3.89 6 7 11 7 2.02 0 3.93-.48 5.6-1.33l2.62 2.61 1.06-1.06L3.28 2.22ZM12 17c-3.94 0-7.3-2.1-8.8-5 .64-1.43 1.69-2.63 2.96-3.5l2 2A3.99 3.99 0 0 0 12 16c.73 0 1.4-.2 1.98-.55l1.51 1.5c-1 .34-2.1.55-3.49.55ZM9.91 8.83l2.25 2.25.02-.08a2 2 0 0 0-2.27-2.17ZM12 7c3.94 0 7.3 2.1 8.8 5-.5 1.12-1.26 2.11-2.19 2.93l-1.43-1.43A3.99 3.99 0 0 0 12 8c-.5 0-.98.09-1.42.25L8.73 6.4C9.75 6.13 10.83 6 12 6Z"/></svg>
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                <input type="checkbox" className="rounded border-[var(--panel-border)]" />
                {isAr ? "تذكرني" : "Remember me"}
              </label>
              <button
                type="button"
                onClick={() => {
                  setTimeout(() => setShowResetInfo(true), 1000);
                }}
                className="text-xs text-[var(--brand-accent)] hover:underline"
              >
                {isAr ? "نسيت كلمة المرور؟" : "Forgot password?"}
              </button>
            </div>
            <button
              type="submit"
              disabled={locked}
              className={"mt-2 h-10 w-full rounded-lg text-[var(--brand-primary)] text-sm font-semibold transition " + (locked ? "bg-gray-400 cursor-not-allowed" : "bg-[var(--brand-accent)] hover:bg-[var(--accent-hover)]")}
            >
              {isAr ? "تسجيل الدخول" : "Log in"}
            </button>
            {locked && (
              <div className={"text-xs mt-2 " + (isAr ? "text-right" : "text-left")}>
                <span className="text-red-400">
                  {(() => {
                    const remaining = Math.max(0, lockUntil - now);
                    const secs = Math.ceil(remaining / 1000);
                    const mm = Math.floor(secs / 60).toString().padStart(2, "0");
                    const ss = (secs % 60).toString().padStart(2, "0");
                    return isAr
                      ? `تم حظر المحاولة لمدة ${mm}:${ss}`
                      : `Login is temporarily locked for ${mm}:${ss}`;
                  })()}
                </span>
              </div>
            )}
          </form>
          <div aria-hidden className="my-5 h-px w-full bg-gradient-to-r from-transparent via-[var(--brand-accent)] to-transparent" />
          <div className="flex items-center gap-3">
            <p className="text-xs text-[var(--text-secondary)]">
              {isAr
                ? "هذه لوحة تسجيل دخول المدير. إذا لم تكن المدير اضغط للعودة إلى الصفحة الرئيسية "
                : "This is the admin login dashboard. If you're not the admin, go back to the home page "}
              <Link href={isAr ? "/ar" : "/en"} className="font-semibold text-[var(--brand-accent)] hover:underline">
                {isAr ? "الصفحة الرئيسية" : "Home page"}
              </Link>
              .
            </p>
            <div className="flex-1" />
            <div className="inline-flex items-center rounded-full border border-[var(--panel-border)] dark:border-white/15 bg-[var(--panel-bg)] px-1 py-1 gap-1 ui-pill">
              <button
                onClick={() => setLang("en")}
                aria-pressed={activeLang === "en"}
                className={
                  "h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-semibold transition " +
                  (activeLang === "en"
                    ? "bg-[var(--brand-accent)] text-black shadow"
                    : "text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/10")
                }
                title="English"
              >
                EN
              </button>
              <button
                onClick={() => setLang("ar")}
                aria-pressed={activeLang === "ar"}
                className={
                  "h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-semibold transition " +
                  (activeLang === "ar"
                    ? "bg-[var(--brand-accent)] text-black shadow"
                    : "text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/10")
                }
                title="العربية"
              >
                AR
              </button>
            </div>
          </div>
          {showResetInfo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowResetInfo(false)} />
              <div className="relative z-10 w-[92%] max-w-md rounded-2xl surface p-6 md:p-8 text-center overflow-hidden">
                <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(225,188,137,0.22),transparent_60%)] blur-2xl" />
                <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-accent)]/15 ring-1 ring-[var(--brand-accent)]/30 text-[var(--brand-accent)]">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                    <path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z"/>
                  </svg>
                </div>
                <div className="mt-3 text-2xl font-extrabold text-[var(--brand-accent)]">
                  {isAr ? "أُووبس!!" : "OOOPS !!"}
                </div>
                <div className="mx-auto mt-2 h-px w-24 bg-gradient-to-r from-transparent via-[var(--brand-accent)]/70 to-transparent" />
                <div className="mt-2 text-sm text-white/90">
                  {isAr
                    ? "نأسف لسماع ذلك، يُرجى التواصل مع مدير الموقع فورًا!"
                    : "We’re sorry to hear that, please contact the website administrator immediately!"}
                </div>
                <button
                  onClick={() => setShowResetInfo(false)}
                  className="mt-5 inline-flex items-center rounded-lg bg-[var(--brand-accent)] text-black px-5 py-2.5 font-semibold"
                >
                  {isAr ? "حسنًا" : "Okay"}
                </button>
              </div>
            </div>
          )}
          {showLoginError && (
            <div className="fixed inset-0 z-50 flex items-center justify-center" dir={isAr ? "rtl" : "ltr"}>
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLoginError(false)} />
              <div className={"relative z-10 w-[92%] max-w-md rounded-2xl surface p-6 md:p-8 overflow-hidden " + (isAr ? "text-right" : "text-left")}>
                <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(225,188,137,0.22),transparent_60%)] blur-2xl" />
                <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-accent)]/15 ring-1 ring-[var(--brand-accent)]/30 text-[var(--brand-accent)]">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                    <path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z"/>
                  </svg>
                </div>
                <div className="mt-3 text-2xl font-extrabold text-[var(--brand-accent)]">
                  {isAr ? "أُووبس!!" : "OOOPs !!"}
                </div>
                <div className="mx-auto mt-2 h-px w-24 bg-gradient-to-r from-transparent via-[var(--brand-accent)]/70 to-transparent" />
                <div className="mt-2 text-sm text-white/90">
                  {isAr
                    ? locked
                      ? "لقد تجاوزت الحد الأقصى للمحاولات. تم تعليق الدخول مؤقتًا — يُرجى الانتظار قبل المحاولة مرة أخرى."
                      : `أُووبس - المحاولة رقم ${attemptCount} من 4 !!, اسم المستخدم أو كلمة المرور غير صحيحة، يُرجى التحقق والمحاولة مرة أخرى.`
                    : locked
                      ? "You’ve reached the maximum attempts. Login is temporarily locked — please wait before trying again."
                      : `OOOPs - Attemp no ${attemptCount} - 4 !!, Wrong Username Or Password, Please check the username or password and try again.`}
                </div>
                <div className="mt-4 flex items-center justify-end gap-2">
                  <button onClick={() => setShowLoginError(false)} className="btn-secondary">{isAr ? "إغلاق" : "Close"}</button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
