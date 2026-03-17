"use client";
import { useState } from "react";

export function ContactForm({ lang }: { lang: "en" | "ar" }) {
  const rtl = lang === "ar";
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "unspecified">("unspecified");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [inquiry, setInquiry] = useState("");
  const [caseTitle, setCaseTitle] = useState("");
  const [caseDesc, setCaseDesc] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [showThanks, setShowThanks] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loadingShownAt, setLoadingShownAt] = useState<number | null>(null);

  const t = {
    title: rtl ? "نموذج الاستشارة" : "Consultation Form",
    fullName: rtl ? "الاسم الكامل" : "Full Name",
    gender: rtl ? "النوع" : "Gender",
    male: rtl ? "ذكر" : "Male",
    female: rtl ? "أنثى" : "Female",
    email: "Email",
    phone: rtl ? "رقم الهاتف" : "Phone Number",
    address: rtl ? "العنوان" : "Address",
    inquiry: rtl ? "نوع الاستفسار" : "Type of Inquiry",
    caseTitle: rtl ? "عنوان القضية" : "Case Title",
    caseDesc: rtl ? "وصف القضية" : "Case Description",
    submit: rtl ? "إرسال الطلب" : "Submit Request",
    thanksTitle: rtl ? "تم إرسال الطلب بنجاح" : "Request submitted successfully",
    thanksBody: rtl ? "سيتواصل معك أحد خبرائنا قريبًا." : "One of our experts will contact you soon.",
    errorTitle: rtl ? "تعذر إرسال الطلب" : "Submission failed",
    errorBody: rtl ? "حدث خطأ أثناء الإرسال. حاول مرة أخرى لاحقًا." : "An error occurred during submission. Please try again later.",
    processingTitle: rtl ? "جاري إرسال الطلب" : "Submitting request",
    processingBody: rtl ? "يرجى الانتظار لحظات قليلة..." : "Please wait a moment...",
  };

  const inquiries = rtl
    ? ["قانون بحري", "امتثال شركات", "تحكيم ومنازعات", "عقود واتفاقيات", "أخرى"]
    : ["Maritime Law", "Corporate Compliance", "Arbitration & Disputes", "Contracts & Agreements", "Other"];

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setLoadingShownAt(Date.now());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          gender,
          email,
          phone,
          address,
          inquiry,
          caseTitle,
          caseDesc,
          lang,
        }),
      });
      const next = res.ok ? "success" as const : "error" as const;
      const elapsed = loadingShownAt ? Date.now() - loadingShownAt : 0;
      const delay = Math.max(0, 1000 - elapsed);
      setTimeout(() => {
        setStatus(next);
        if (next === "success") {
          setShowThanks(true);
        } else {
          setShowError(true);
        }
      }, delay);
    } catch {
      const elapsed = loadingShownAt ? Date.now() - loadingShownAt : 0;
      const delay = Math.max(0, 1000 - elapsed);
      setTimeout(() => {
        setStatus("error");
        setShowError(true);
      }, delay);
    }
  };

  const resetForm = () => {
    setFullName("");
    setGender("unspecified");
    setEmail("");
    setPhone("");
    setAddress("");
    setInquiry("");
    setCaseTitle("");
    setCaseDesc("");
    setStatus("idle");
  };

  return (
    <div dir={rtl ? "rtl" : "ltr"}>
      <form onSubmit={onSubmit} className="rounded-2xl surface p-6 md:p-8 h-full min-h-[420px] flex flex-col">
        <div className={`text-center text-[var(--brand-accent)] font-extrabold text-lg`}>{t.title}</div>
        <div className="mt-2 h-px w-full bg-gradient-to-r from-transparent via-[var(--brand-accent)]/60 to-transparent" />
        <div className={`mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 ${rtl ? "text-right" : "text-left"} flex-1`}>
          <div className="md:col-span-1">
            <label className="block text-xs font-semibold text-[var(--brand-accent)] mb-1">
              {t.fullName} <span aria-hidden="true" className="text-[var(--brand-accent)]">*</span>
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={rtl ? "أدخل الاسم الكامل" : "Enter full name"}
              className="w-full rounded-lg bg-black/30 border border-[var(--panel-border)] px-3 py-2 text-white placeholder:text-zinc-500"
              required
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs font-semibold text-[var(--brand-accent)] mb-1">{t.gender}</label>
            <div className={`flex gap-2 ${rtl ? "justify-end" : "justify-start"}`}>
              <label className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer ${gender === "male" ? "border-[var(--brand-accent)] text-[var(--brand-accent)] bg-[var(--brand-accent)]/15" : "border-[var(--panel-border)] text-[var(--brand-accent)] bg-[var(--panel-bg)]/30"}`}>
                <input type="checkbox" checked={gender === "male"} onChange={() => setGender(gender === "male" ? "unspecified" : "male")} className="accent-[var(--brand-accent)]" />
                <span>{t.male}</span>
              </label>
              <label className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer ${gender === "female" ? "border-[var(--brand-accent)] text-[var(--brand-accent)] bg-[var(--brand-accent)]/15" : "border-[var(--panel-border)] text-[var(--brand-accent)] bg-[var(--panel-bg)]/30"}`}>
                <input type="checkbox" checked={gender === "female"} onChange={() => setGender(gender === "female" ? "unspecified" : "female")} className="accent-[var(--brand-accent)]" />
                <span>{t.female}</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--brand-accent)] mb-1">
              {t.email} <span aria-hidden="true" className="text-[var(--brand-accent)]">*</span>
            </label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" type="email" required className="w-full rounded-lg bg-black/30 border border-[var(--panel-border)] px-3 py-2 text-white placeholder:text-zinc-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--brand-accent)] mb-1">
              {t.phone} <span aria-hidden="true" className="text-[var(--brand-accent)]">*</span>
            </label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={rtl ? "+971 5x xxx xxxx" : "+971 5x xxx xxxx"} required className="w-full rounded-lg bg-black/30 border border-[var(--panel-border)] px-3 py-2 text-white placeholder:text-zinc-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[var(--brand-accent)] mb-1">{t.address}</label>
            <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder={rtl ? "العنوان الكامل" : "Full address"} className="w-full rounded-lg bg-black/30 border border-[var(--panel-border)] px-3 py-2 text-white placeholder:text-zinc-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--brand-accent)] mb-1">
              {t.inquiry} <span aria-hidden="true" className="text-[var(--brand-accent)]">*</span>
            </label>
            <select value={inquiry} onChange={(e) => setInquiry(e.target.value)} required className="w-full rounded-lg bg-black/30 border border-[var(--panel-border)] px-3 py-2 text-white">
              <option value="" disabled>{rtl ? "اختر نوع الاستفسار" : "Select inquiry type"}</option>
              {inquiries.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--brand-accent)] mb-1">{t.caseTitle}</label>
            <input value={caseTitle} onChange={(e) => setCaseTitle(e.target.value)} placeholder={rtl ? "عنوان موجز للقضية" : "Brief case title"} className="w-full rounded-lg bg-black/30 border border-[var(--panel-border)] px-3 py-2 text-white placeholder:text-zinc-500" />
          </div>
          <div className="md:col-span-2 mt-6">
            <label className="block text-xs font-semibold text-[var(--brand-accent)] mb-1">{t.caseDesc}</label>
            <textarea value={caseDesc} onChange={(e) => setCaseDesc(e.target.value)} rows={6} placeholder={rtl ? "صف بإيجاز الوقائع والوثائق المتاحة ونطاق المطلوب." : "Briefly describe facts, available documents, and the scope sought."} className="w-full rounded-lg bg-black/30 border border-[var(--panel-border)] px-3 py-2 text-white placeholder:text-zinc-500" />
          </div>
        </div>
        <div className="mt-auto -mx-6 -mb-6 md:-mx-8 md:-mb-8">
          <div className="border-t border-[var(--panel-border)] bg-black/10 dark:bg-black/40 backdrop-blur-lg px-6 py-4 md:px-8 rounded-b-2xl flex items-center justify-between">
            <div className={`text-xs text-white ${rtl ? "text-right" : ""}`}>
              {rtl ? "سيتم التعامل مع جميع المعلومات بسرية تامة." : "All information will be handled in strict confidence."}
            </div>
            <button type="submit" className="inline-flex items-center rounded-lg bg-[var(--brand-accent)] text-white dark:text-black px-5 py-2.5 font-semibold transition hover:opacity-90">
              {t.submit}
            </button>
          </div>
        </div>
      </form>
      {status === "loading" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center cursor-wait">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative z-10 w-[92%] max-w-md rounded-2xl surface p-6 md:p-8 text-center overflow-hidden">
            <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(225,188,137,0.2),transparent_60%)] blur-2xl" />
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-accent)]/15 ring-1 ring-[var(--brand-accent)]/30 text-[var(--brand-accent)]">
              <div className="h-6 w-6 rounded-full border-2 border-[var(--brand-accent)] border-t-transparent animate-spin" aria-hidden="true" />
            </div>
            <div className="mt-3 text-2xl font-extrabold text-[var(--brand-accent)]">{t.processingTitle}</div>
            <div className="mx-auto mt-2 h-px w-24 bg-gradient-to-r from-transparent via-[var(--brand-accent)]/70 to-transparent" />
            <div className="mt-2 text-sm text-[var(--text-secondary)]">{t.processingBody}</div>
          </div>
        </div>
      )}
      {showThanks && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowThanks(false)} />
          <div className="relative z-10 w-[92%] max-w-md rounded-2xl surface p-6 md:p-8 text-center overflow-hidden">
            <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(225,188,137,0.25),transparent_60%)] blur-2xl" />
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-accent)]/15 ring-1 ring-[var(--brand-accent)]/30 text-[var(--brand-accent)]">
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                <path fill="currentColor" d="M12 2c-1.1 0-2 .9-2 2v.18C7.16 4.61 5 7.06 5 10v3.5L3.29 15.8c-.19.19-.29.44-.29.71V18h18v-1.49c0-.27-.11-.52-.29-.71L19 13.5V10c0-2.94-2.16-5.39-5-5.82V4c0-1.1-.9-2-2-2zm-1.41 12.59l-2.12-2.12-1.41 1.41 3.53 3.53 6.59-6.59-1.41-1.41-5.77 5.77z"/>
              </svg>
            </div>
            <div className="mt-3 text-2xl font-extrabold text-[var(--brand-accent)]">{t.thanksTitle}</div>
            <div className="mx-auto mt-2 h-px w-24 bg-gradient-to-r from-transparent via-[var(--brand-accent)]/70 to-transparent" />
            <div className="mt-2 text-sm text-[var(--text-secondary)]">{t.thanksBody}</div>
            <button
              onClick={() => {
                setShowThanks(false);
                resetForm();
              }}
              className="mt-5 inline-flex items-center rounded-lg bg-[var(--brand-accent)] text-black px-5 py-2.5 font-semibold"
            >
              {rtl ? "حسنًا" : "Okay"}
            </button>
          </div>
        </div>
      )}
      {showError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowError(false)} />
          <div className="relative z-10 w-[92%] max-w-md rounded-2xl surface p-6 md:p-8 text-center overflow-hidden">
            <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(225,188,137,0.22),transparent_60%)] blur-2xl" />
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-accent)]/15 ring-1 ring-[var(--brand-accent)]/30 text-[var(--brand-accent)]">
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                <path fill="currentColor" d="M12 2 1 21h22L12 2zm1 15h-2v2h2v-2zm0-8h-2v6h2V9z"/>
              </svg>
            </div>
            <div className="mt-3 text-2xl font-extrabold text-[var(--brand-accent)]">{t.errorTitle}</div>
            <div className="mx-auto mt-2 h-px w-24 bg-gradient-to-r from-transparent via-[var(--brand-accent)]/70 to-transparent" />
            <div className="mt-2 text-sm text-[var(--text-secondary)]">{t.errorBody}</div>
            <button
              onClick={() => {
                setShowError(false);
                resetForm();
              }}
              className="mt-5 inline-flex items-center rounded-lg bg-[var(--brand-accent)] text-black px-5 py-2.5 font-semibold"
            >
              {rtl ? "حسنًا" : "OK"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
