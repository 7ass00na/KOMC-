"use client";
import { useRef, useState } from "react";
import { User, Mail, Phone as PhoneIcon, MapPin, HelpCircle, FileText, AlignLeft, CalendarClock } from "lucide-react";

type FieldKey =
  | "fullName"
  | "email"
  | "phone"
  | "address"
  | "inquiry"
  | "preferredDateTime"
  | "preferredContact"
  | "caseTitle"
  | "caseDesc"
  | "attachment"
  | "attachmentNote";

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
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentNote, setAttachmentNote] = useState("");
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [showThanks, setShowThanks] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorDetail, setErrorDetail] = useState<string>("");
  const [successDetail, setSuccessDetail] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [preferredDateTime, setPreferredDateTime] = useState("");
  const [preferredContact, setPreferredContact] = useState<"phone" | "email" | "either" | "">("");
  const [companyTrap, setCompanyTrap] = useState("");
  const submitLockRef = useRef(false);
  const fieldRefs = useRef<Partial<Record<FieldKey, HTMLElement | null>>>({});

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
    attachLabel: rtl ? "مرفقات (اختياري)" : "Attachments (optional)",
    attachNote: rtl ? "ملاحظة للمرفقات" : "Attachment note",
    attachHelp: rtl ? "الحد الأقصى 10 ميجابايت" : "Max 10 MB",
    requiredMsg: rtl ? "يرجى ملء هذا الحقل" : "Please fill out this field.",
    emailMsg: rtl ? "يرجى إدخال بريد إلكتروني صالح" : "Please enter a valid email address.",
    phoneMsg: rtl ? "رقم الهاتف غير صحيح، يرجى التحقق." : "Incorrect phone number, please verify",
    submit: rtl ? "إرسال الطلب" : "Submit Request",
    thanksTitle: rtl ? "حالة إرسال الرسالة" : "Message Status",
    thanksBody: rtl ? "تم الإرسال بنجاح. سيتواصل معك أحد محامينا قريبًا بخصوص قضيتك. شكرًا لك." : "Submitted successfully. One of our lawyers will contact you soon regarding your case. Thank you.",
    duplicateBody: rtl ? "تم استلام بياناتك بالفعل. لا حاجة إلى إعادة إرسال الطلب، وسيتواصل معك فريق KOMC قريبًا." : "We already received your information. There is no need to submit the form again, and the KOMC team will contact you soon.",
    errorTitle: rtl ? "حالة إرسال الرسالة" : "Message Status",
    errorBody: rtl ? "عذرًا، تعذر إرسال الرسالة" : "Sorry, the message could not be sent",
    processingTitle: rtl ? "جاري إرسال الطلب" : "Submitting request",
    processingBody: rtl ? "يرجى الانتظار لحظات قليلة..." : "Please wait a moment...",
    preferredContact: rtl ? "طريقة التواصل المفضلة" : "Preferred Contact Method",
    contactPhone: rtl ? "الهاتف" : "Phone",
    contactEmail: rtl ? "البريد الإلكتروني" : "Email",
    contactEither: rtl ? "أي منهما" : "Either",
    verifyFieldPrefix: rtl ? "يوجد خطأ في الحقل" : "There is an error in field",
    verifyFieldSuffix: rtl ? "، يرجى التحقق" : ", please verify",
    ok: rtl ? "حسنًا" : "OK",
  };

  /** Formats attachment sizes for the upload helper text. */
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  /** Validates international-style phone numbers accepted by the consultation form. */
  const isValidPhone = (value: string) => /^[+()\-\s\d]{8,20}$/.test(value.trim());
  /** Validates email addresses before the form hits the server. */
  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  /** Validates personal-name fields while supporting Arabic and English letters. */
  const isValidHumanText = (value: string, min: number, max: number) => {
    const trimmed = value.trim();
    return trimmed.length >= min && trimmed.length <= max && /^[\p{L}\p{M}\s'.-]+$/u.test(trimmed);
  };
  /** Validates general-purpose Arabic/English text fields and optional multiline content. */
  const isValidFlexibleText = (value: string, min: number, max: number, multiline = false) => {
    const trimmed = value.trim();
    if (!trimmed) return true;
    if (trimmed.length < min || trimmed.length > max) return false;
    const pattern = multiline
      ? /^[\p{L}\p{M}\p{N}\s'".,;:!?()\-\/&@#+\n\r]+$/u
      : /^[\p{L}\p{M}\p{N}\s'".,;:!?()\-\/&@#+]+$/u;
    return pattern.test(trimmed);
  };

  const fieldLabels: Record<FieldKey, string> = {
    fullName: t.fullName,
    email: t.email,
    phone: t.phone,
    address: t.address,
    inquiry: t.inquiry,
    preferredDateTime: rtl ? "التاريخ والوقت المفضل" : "Preferred Date/Time",
    preferredContact: t.preferredContact,
    caseTitle: t.caseTitle,
    caseDesc: t.caseDesc,
    attachment: t.attachLabel,
    attachmentNote: t.attachNote,
  };

  /** Maps native invalid events to localized field messages. */
  const handleInvalid = (e: React.FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const el = e.currentTarget as HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement;
    if (el.validity.valueMissing) {
      el.setCustomValidity(t.requiredMsg);
    } else if (el.getAttribute("type") === "email" && (el as HTMLInputElement).validity.typeMismatch) {
      el.setCustomValidity(t.emailMsg);
    } else if (el.getAttribute("type") === "tel" && (el as HTMLInputElement).validity.patternMismatch) {
      el.setCustomValidity(t.phoneMsg);
    } else {
      el.setCustomValidity("");
    }
  };
  /** Clears any custom validity text once the user edits a field again. */
  const clearValidity = (e: React.FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    (e.currentTarget as any).setCustomValidity("");
  };

  const inquiries = rtl
    ? ["القانون بحري", "القانون المدني", "القانون الجنائي", "القانون التجاري", "قانون العمل", "القانون العقاري", "قانون الأسرة", "أخرى"]
    : ["Maritime Law", "Civil law", "Criminal law", "Commercial law", "Labor law", "Real estate law", "Family law", "Other"];
  /** Renders a consistent icon + label pattern for field captions. */
  const labelWrap = (icon: React.ReactNode, text: string, required?: boolean) => (
    <span className={`inline-flex items-center gap-1.5 ${rtl ? "flex-row-reverse" : "flex-row"}`}>
      <span className="inline-flex items-center justify-center h-4 w-4 text-[var(--brand-accent)]" aria-hidden="true">
        {icon}
      </span>
      <span>{text}{required ? " " : ""}{required ? <span aria-hidden="true" className="text-[var(--brand-accent)]">*</span> : null}</span>
    </span>
  );

  /** Translates server-side error codes into localized user-facing copy. */
  const formatErrorMessage = (code: string) => {
    if (rtl) {
      switch (code) {
        case "FIELD_REQUIRED":
          return "يرجى التحقق من الحقل المطلوب.";
        case "INVALID_EMAIL":
          return "يرجى إدخال بريد إلكتروني صالح.";
        case "INVALID_PHONE":
          return t.phoneMsg;
        case "INVALID_FULL_NAME":
          return "يرجى إدخال اسم صحيح بالأحرف العربية أو الإنجليزية.";
        case "INVALID_ADDRESS":
        case "INVALID_INQUIRY":
        case "INVALID_CASE_TITLE":
        case "INVALID_CASE_DESCRIPTION":
        case "INVALID_ATTACHMENT_NOTE":
        case "INVALID_PREFERRED_DATETIME":
        case "INVALID_PREFERRED_CONTACT":
          return "يرجى التحقق من تنسيق البيانات المدخلة.";
        case "ATTACHMENT_TOO_LARGE":
          return rtl ? "حجم الملف يتجاوز 25 ميجابايت." : "File exceeds the 25 MB limit.";
        case "RATE_LIMITED":
          return "تم تلقي عدة محاولات متتالية. يرجى الانتظار قليلًا ثم المحاولة مجددًا.";
        case "SMTP_NOT_CONFIGURED":
        case "SMTP_VERIFY_FAILED":
        case "EMAIL_SEND_FAILED":
          return "تعذر تسليم الطلب عبر البريد الإلكتروني حاليًا. يرجى المحاولة مرة أخرى لاحقًا.";
        default:
          return code;
      }
    }
    switch (code) {
      case "FIELD_REQUIRED":
        return "Please verify the required field.";
      case "INVALID_EMAIL":
        return "Please enter a valid email address.";
      case "INVALID_PHONE":
        return t.phoneMsg;
      case "INVALID_FULL_NAME":
        return "Please enter a valid name using Arabic or English letters.";
      case "INVALID_ADDRESS":
      case "INVALID_INQUIRY":
      case "INVALID_CASE_TITLE":
      case "INVALID_CASE_DESCRIPTION":
      case "INVALID_ATTACHMENT_NOTE":
      case "INVALID_PREFERRED_DATETIME":
      case "INVALID_PREFERRED_CONTACT":
        return "Please verify the field format.";
      case "ATTACHMENT_TOO_LARGE":
        return "File exceeds the 25 MB limit.";
      case "RATE_LIMITED":
        return "Too many submission attempts were received. Please wait a moment and try again.";
      case "SMTP_NOT_CONFIGURED":
      case "SMTP_VERIFY_FAILED":
      case "EMAIL_SEND_FAILED":
        return "We could not deliver your request by email right now. Please try again shortly.";
      default:
        return code;
    }
  };

  /** Stores DOM references so invalid fields can be focused from modal feedback. */
  const setFieldRef = (field: FieldKey, element: HTMLElement | null) => {
    fieldRefs.current[field] = element;
  };

  /** Scrolls and focuses the target field after a validation failure. */
  const focusField = (field: FieldKey) => {
    const target = fieldRefs.current[field];
    if (target && "focus" in target) {
      (target as HTMLElement).focus();
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  /** Clears only the invalid field while preserving the rest of the form state. */
  const clearFieldValue = (field: FieldKey) => {
    switch (field) {
      case "fullName":
        setFullName("");
        break;
      case "email":
        setEmail("");
        break;
      case "phone":
        setPhone("");
        break;
      case "address":
        setAddress("");
        break;
      case "inquiry":
        setInquiry("");
        break;
      case "preferredDateTime":
        setPreferredDateTime("");
        break;
      case "preferredContact":
        setPreferredContact("");
        break;
      case "caseTitle":
        setCaseTitle("");
        break;
      case "caseDesc":
        setCaseDesc("");
        break;
      case "attachment":
        setAttachment(null);
        break;
      case "attachmentNote":
        setAttachmentNote("");
        break;
    }
  };

  /** Writes or removes the inline error for a single field. */
  const updateFieldError = (field: FieldKey, message: string | null) => {
    setFieldErrors((current) => {
      const next = { ...current };
      if (message) next[field] = message;
      else delete next[field];
      return next;
    });
  };

  /** Validates one field at a time and returns the localized error, if any. */
  const validateField = (field: FieldKey, value?: string) => {
    switch (field) {
      case "fullName":
        if (!fullName.trim()) return t.requiredMsg;
        return isValidHumanText(fullName, 2, 120) ? null : formatErrorMessage("INVALID_FULL_NAME");
      case "email":
        if (!email.trim()) return t.requiredMsg;
        return isValidEmail(email) ? null : formatErrorMessage("INVALID_EMAIL");
      case "phone":
        if (!phone.trim()) return t.requiredMsg;
        return isValidPhone(phone) ? null : t.phoneMsg;
      case "address":
        return address.trim() && !isValidFlexibleText(address, 3, 200) ? formatErrorMessage("INVALID_ADDRESS") : null;
      case "inquiry":
        if (!inquiry.trim()) return t.requiredMsg;
        return isValidFlexibleText(inquiry, 2, 80) ? null : formatErrorMessage("INVALID_INQUIRY");
      case "preferredDateTime":
        return preferredDateTime && Number.isNaN(Date.parse(preferredDateTime)) ? formatErrorMessage("INVALID_PREFERRED_DATETIME") : null;
      case "preferredContact":
        if (!preferredContact.trim()) return t.requiredMsg;
        return ["phone", "email", "either"].includes(preferredContact) ? null : formatErrorMessage("INVALID_PREFERRED_CONTACT");
      case "caseTitle":
        return caseTitle.trim() && !isValidFlexibleText(caseTitle, 2, 150) ? formatErrorMessage("INVALID_CASE_TITLE") : null;
      case "caseDesc":
        return caseDesc.trim() && !isValidFlexibleText(caseDesc, 5, 3000, true) ? formatErrorMessage("INVALID_CASE_DESCRIPTION") : null;
      case "attachment":
        return attachment && attachment.size > 25 * 1024 * 1024 ? formatErrorMessage("ATTACHMENT_TOO_LARGE") : null;
      case "attachmentNote":
        return attachmentNote.trim() && !isValidFlexibleText(attachmentNote, 2, 250, true) ? formatErrorMessage("INVALID_ATTACHMENT_NOTE") : null;
      default:
        return value ? null : null;
    }
  };

  /** Opens the modal error state with a field-specific correction message. */
  const showFieldErrorModal = (field: FieldKey, customMessage?: string) => {
    const baseMessage =
      field === "phone"
        ? t.phoneMsg
        : `${t.verifyFieldPrefix} ${fieldLabels[field]}${t.verifyFieldSuffix}`;
    setErrorDetail(customMessage || baseMessage);
    setShowError(true);
    focusField(field);
  };

  /** Revalidates a field on change/blur without disturbing other inputs. */
  const handleRealtimeValidation = (field: FieldKey) => {
    const message = validateField(field);
    updateFieldError(field, message);
  };

  /** Builds the shared input class string including invalid-state styling. */
  const inputClassName = (field: FieldKey) =>
    `w-full rounded-lg bg-black/30 border px-3 py-2 text-white placeholder:text-zinc-500 ${
      fieldErrors[field]
        ? "border-red-400 ring-1 ring-red-400/70"
        : "border-[var(--panel-border)]"
    }`;

  /** Builds the shared select class string including invalid-state styling. */
  const selectClassName = (field: FieldKey) =>
    `themed-select w-full rounded-lg border px-3 py-2 pr-10 text-white ${
      fieldErrors[field]
        ? "border-red-400 ring-1 ring-red-400/70"
        : "border-[var(--panel-border)]"
    }`;

  /** Runs sequential client validation, posts the form, and coordinates modal feedback. */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitLockRef.current || status === "loading") return;
    setShowThanks(false);
    setShowError(false);
    setErrorDetail("");
    setSuccessDetail("");
    const validationOrder: FieldKey[] = [
      "fullName",
      "email",
      "phone",
      "address",
      "inquiry",
      "preferredDateTime",
      "preferredContact",
      "caseTitle",
      "caseDesc",
      "attachment",
      "attachmentNote",
    ];
    for (const field of validationOrder) {
      const message = validateField(field);
      updateFieldError(field, message);
      if (message) {
        clearFieldValue(field);
        setStatus("idle");
        showFieldErrorModal(field, field === "phone" ? t.phoneMsg : undefined);
        return;
      }
    }
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    submitLockRef.current = true;
    const requestStartedAt = Date.now();
    setStatus("loading");
    setAttachmentError(null);
    try {
      const fd = new FormData();
      fd.append("company", companyTrap);
      fd.append("fullName", fullName.trim());
      fd.append("gender", gender);
      fd.append("email", trimmedEmail);
      fd.append("phone", trimmedPhone);
      fd.append("address", address.trim());
      fd.append("inquiry", inquiry);
      fd.append("caseTitle", caseTitle.trim());
      fd.append("caseDesc", caseDesc.trim());
      fd.append("lang", lang);
      fd.append("preferredDateTime", preferredDateTime);
      fd.append("preferredContact", preferredContact);
      if (attachment) fd.append("attachment", attachment);
      if (attachmentNote) fd.append("attachmentNote", attachmentNote.trim());
      const res = await fetch("/api/contact", { method: "POST", body: fd });
      const ct = res.headers.get("content-type") || "";
      const payload =
        ct.includes("application/json")
          ? await res.json().catch(() => null)
          : null;
      let next: "success" | "error" = res.ok ? "success" : "error";
      if (!res.ok) {
        try {
          let detail = `${t.errorBody}.`;
          if (payload?.error) {
            const field = payload?.field as FieldKey | undefined;
            if (field) {
              clearFieldValue(field);
              updateFieldError(field, formatErrorMessage(String(payload.error)));
              focusField(field);
              detail += ` ${field === "phone" ? t.phoneMsg : `${t.verifyFieldPrefix} ${fieldLabels[field]}${t.verifyFieldSuffix}`}`;
            } else {
              detail += ` ${formatErrorMessage(String(payload.error))}`;
            }
            detail += ` ${formatErrorMessage(String(payload.error))}`;
          } else {
            const txt = await res.text().catch(() => "");
            if (txt) detail += ` ${txt.substring(0, 240)}`;
          }
          setErrorDetail(detail);
        } catch {
          setErrorDetail(`${t.errorBody}. HTTP ${res.status} ${res.statusText}`);
        }
      } else {
        setErrorDetail("");
        setSuccessDetail(payload?.duplicate ? t.duplicateBody : t.thanksBody);
        setFieldErrors({});
      }
      const elapsed = Date.now() - requestStartedAt;
      const delay = Math.max(0, 1000 - elapsed);
      setTimeout(() => {
        setStatus(next);
        if (next === "success") {
          setShowThanks(true);
        } else {
          setShowError(true);
        }
        submitLockRef.current = false;
      }, delay);
    } catch (e: any) {
      setErrorDetail(`${t.errorBody}. ${e?.message ? String(e.message) : "Network error"}`);
      const elapsed = Date.now() - requestStartedAt;
      const delay = Math.max(0, 1000 - elapsed);
      setTimeout(() => {
        setStatus("error");
        setShowError(true);
        submitLockRef.current = false;
      }, delay);
    }
  };

  /** Restores the consultation form to its pristine post-success state. */
  const resetForm = () => {
    setFullName("");
    setGender("unspecified");
    setEmail("");
    setPhone("");
    setAddress("");
    setInquiry("");
    setCaseTitle("");
    setCaseDesc("");
    setAttachment(null);
    setAttachmentNote("");
    setAttachmentError(null);
    setErrorDetail("");
    setSuccessDetail("");
    setPreferredDateTime("");
    setPreferredContact("");
    setCompanyTrap("");
    setStatus("idle");
    setFieldErrors({});
    submitLockRef.current = false;
  };

  return (
    <div dir={rtl ? "rtl" : "ltr"}>
      <form onSubmit={onSubmit} noValidate className="rounded-2xl surface p-6 md:p-8 h-full min-h-[420px] flex flex-col">
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="company-field">Company</label>
          <input
            id="company-field"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={companyTrap}
            onChange={(e) => setCompanyTrap(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-center gap-2 text-[var(--brand-accent)] font-extrabold text-lg uppercase">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
            <path d="M4 4h12l4 4v12H4z" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M16 4v4h4" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M7 13h10M7 9h6M7 17h6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span>{t.title}</span>
        </div>
        <div className="mt-2 h-px w-full bg-gradient-to-r from-transparent via-[var(--brand-accent)]/60 to-transparent" />
        <div className={`mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 ${rtl ? "text-right" : "text-left"} flex-1`}>
          <div className="md:col-span-1">
            <label className="block text-xs font-semibold text-[var(--brand-accent)] mb-1">
              {labelWrap(<User className="h-3.5 w-3.5" />, t.fullName, true)}
            </label>
            <input
              ref={(node) => setFieldRef("fullName", node)}
              id="contact-full-name"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                handleRealtimeValidation("fullName");
              }}
              onBlur={() => handleRealtimeValidation("fullName")}
              onInvalid={handleInvalid}
              onInput={clearValidity}
              placeholder={rtl ? "أدخل الاسم الكامل" : "Enter full name"}
              aria-invalid={Boolean(fieldErrors.fullName)}
              className={inputClassName("fullName")}
              required
            />
            {fieldErrors.fullName ? <p className="mt-1 text-xs text-red-300">{fieldErrors.fullName}</p> : null}
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs font-semibold text-[var(--brand-accent)] mb-1">{labelWrap(<HelpCircle className="h-3.5 w-3.5" />, t.gender)}</label>
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
              {labelWrap(<Mail className="h-3.5 w-3.5" />, t.email, true)}
            </label>
            <input
              ref={(node) => setFieldRef("email", node)}
              id="contact-email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                handleRealtimeValidation("email");
              }}
              onBlur={() => handleRealtimeValidation("email")}
              onInvalid={handleInvalid}
              onInput={clearValidity}
              placeholder="you@example.com"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              aria-invalid={Boolean(fieldErrors.email)}
              className={inputClassName("email")}
            />
            {fieldErrors.email ? <p className="mt-1 text-xs text-red-300">{fieldErrors.email}</p> : null}
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--brand-accent)] mb-1">
              {labelWrap(<PhoneIcon className="h-3.5 w-3.5" />, t.phone, true)}
            </label>
            <input
              ref={(node) => setFieldRef("phone", node)}
              id="contact-phone"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                handleRealtimeValidation("phone");
              }}
              onBlur={() => {
                handleRealtimeValidation("phone");
                if (phone.trim() && !isValidPhone(phone)) {
                  setErrorDetail(t.phoneMsg);
                  setShowError(true);
                }
              }}
              onInvalid={handleInvalid}
              onInput={clearValidity}
              placeholder={rtl ? "+971 5x xxx xxxx" : "+971 5x xxx xxxx"}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              pattern="^[+()\\-\\s\\d]{8,20}$"
              required
              aria-invalid={Boolean(fieldErrors.phone)}
              className={inputClassName("phone")}
            />
            {fieldErrors.phone ? <p className="mt-1 text-xs text-red-300">{fieldErrors.phone}</p> : null}
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[var(--brand-accent)] mb-1">{labelWrap(<MapPin className="h-3.5 w-3.5" />, t.address)}</label>
            <input
              ref={(node) => setFieldRef("address", node)}
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                handleRealtimeValidation("address");
              }}
              onBlur={() => handleRealtimeValidation("address")}
              placeholder={rtl ? "العنوان الكامل" : "Full address"}
              aria-invalid={Boolean(fieldErrors.address)}
              className={inputClassName("address")}
            />
            {fieldErrors.address ? <p className="mt-1 text-xs text-red-300">{fieldErrors.address}</p> : null}
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--brand-accent)] mb-1">
              {labelWrap(<HelpCircle className="h-3.5 w-3.5" />, t.inquiry, true)}
            </label>
            <div className="relative">
              <select
                ref={(node) => setFieldRef("inquiry", node)}
                value={inquiry}
                onChange={(e) => {
                  setInquiry(e.target.value);
                  handleRealtimeValidation("inquiry");
                }}
                onBlur={() => handleRealtimeValidation("inquiry")}
                onInvalid={handleInvalid}
                onInput={clearValidity}
                required
                data-select="inquiry"
                aria-invalid={Boolean(fieldErrors.inquiry)}
                className={selectClassName("inquiry")}
              >
                <option value="" disabled>{rtl ? "اختر نوع الاستفسار" : "Select inquiry type"}</option>
                {inquiries.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <span className={`pointer-events-none absolute inset-y-0 ${rtl ? "left-3" : "right-3"} flex items-center`}>
                <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true" className="text-[var(--brand-accent)]">
                  <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
            {fieldErrors.inquiry ? <p className="mt-1 text-xs text-red-300">{fieldErrors.inquiry}</p> : null}
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--brand-accent)] mb-1">
              {labelWrap(<CalendarClock className="h-3.5 w-3.5" />, rtl ? "التاريخ والوقت المفضل" : "Preferred Date/Time")}
            </label>
            <div className="relative">
              <input
                ref={(node) => setFieldRef("preferredDateTime", node)}
                type="datetime-local"
                value={preferredDateTime}
                onChange={(e) => {
                  setPreferredDateTime(e.target.value);
                  handleRealtimeValidation("preferredDateTime");
                }}
                onBlur={() => handleRealtimeValidation("preferredDateTime")}
                aria-invalid={Boolean(fieldErrors.preferredDateTime)}
                className={inputClassName("preferredDateTime")}
              />
              <CalendarClock aria-hidden="true" className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${rtl ? "left-3" : "right-3"} h-4 w-4 text-[var(--brand-accent)]`} />
            </div>
            {fieldErrors.preferredDateTime ? <p className="mt-1 text-xs text-red-300">{fieldErrors.preferredDateTime}</p> : null}
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--brand-accent)] mb-1">
              {labelWrap(<Mail className="h-3.5 w-3.5" />, t.preferredContact, true)}
            </label>
            <div className="relative">
              <select
                ref={(node) => setFieldRef("preferredContact", node)}
                required
                value={preferredContact}
                onChange={(e) => {
                  setPreferredContact(e.target.value as any);
                  handleRealtimeValidation("preferredContact");
                }}
                onBlur={() => handleRealtimeValidation("preferredContact")}
                onInvalid={handleInvalid}
                onInput={clearValidity}
                aria-invalid={Boolean(fieldErrors.preferredContact)}
                className={selectClassName("preferredContact")}
              >
                <option value="">{rtl ? "اختر طريقة التواصل" : "Select a method"}</option>
                <option value="phone">{t.contactPhone}</option>
                <option value="email">{t.contactEmail}</option>
                <option value="either">{t.contactEither}</option>
              </select>
              <span className={`pointer-events-none absolute inset-y-0 ${rtl ? "left-3" : "right-3"} flex items-center`}>
                <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true" className="text-[var(--brand-accent)]">
                  <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
            {fieldErrors.preferredContact ? <p className="mt-1 text-xs text-red-300">{fieldErrors.preferredContact}</p> : null}
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--brand-accent)] mb-1">{labelWrap(<FileText className="h-3.5 w-3.5" />, t.caseTitle)}</label>
            <input
              ref={(node) => setFieldRef("caseTitle", node)}
              value={caseTitle}
              onChange={(e) => {
                setCaseTitle(e.target.value);
                handleRealtimeValidation("caseTitle");
              }}
              onBlur={() => handleRealtimeValidation("caseTitle")}
              placeholder={rtl ? "عنوان موجز للقضية" : "Brief case title"}
              aria-invalid={Boolean(fieldErrors.caseTitle)}
              className={inputClassName("caseTitle")}
            />
            {fieldErrors.caseTitle ? <p className="mt-1 text-xs text-red-300">{fieldErrors.caseTitle}</p> : null}
          </div>
          <div className="md:col-span-2 mt-6">
            <label className="block text-xs font-semibold text-[var(--brand-accent)] mb-1">{labelWrap(<AlignLeft className="h-3.5 w-3.5" />, t.caseDesc)}</label>
            <textarea
              ref={(node) => setFieldRef("caseDesc", node)}
              value={caseDesc}
              onChange={(e) => {
                setCaseDesc(e.target.value);
                handleRealtimeValidation("caseDesc");
              }}
              onBlur={() => handleRealtimeValidation("caseDesc")}
              rows={6}
              placeholder={rtl ? "صف بإيجاز الوقائع والوثائق المتاحة ونطاق المطلوب." : "Briefly describe facts, available documents, and the scope sought."}
              aria-invalid={Boolean(fieldErrors.caseDesc)}
              className={inputClassName("caseDesc")}
            />
            {fieldErrors.caseDesc ? <p className="mt-1 text-xs text-red-300">{fieldErrors.caseDesc}</p> : null}
          </div>
          <div className="md:col-span-2 mt-4 mb-6 md:mb-8">
            <label className="block text-xs font-semibold text-[var(--brand-accent)] mb-1">{t.attachLabel} <span className="text-[var(--text-secondary)]">(Max 25 MB)</span></label>
            <div className="grid gap-3 md:grid-cols-3">
              <input
                ref={(node) => setFieldRef("attachment", node)}
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.heic,.zip,.rar,.7z"
                onChange={(e) => {
                  setAttachment(e.target.files?.[0] || null);
                  handleRealtimeValidation("attachment");
                }}
                aria-invalid={Boolean(fieldErrors.attachment)}
                className={`md:col-span-2 rounded-lg bg-black/30 border px-3 py-2 text-white text-xs md:text-[12px] file:mr-3 file:rounded-md file:border file:px-3 file:py-1 file:text-white file:text-xs ${
                  fieldErrors.attachment
                    ? "border-red-400 file:border-red-400"
                    : "border-[var(--panel-border)] file:border-[var(--panel-border)]"
                } file:bg-white/10`}
              />
              <input
                ref={(node) => setFieldRef("attachmentNote", node)}
                type="text"
                value={attachmentNote}
                onChange={(e) => {
                  setAttachmentNote(e.target.value);
                  handleRealtimeValidation("attachmentNote");
                }}
                onBlur={() => handleRealtimeValidation("attachmentNote")}
                placeholder={rtl ? "أدخل ملاحظة موجزة للمرفق" : "Add a brief note for the attachment"}
                aria-invalid={Boolean(fieldErrors.attachmentNote)}
                className={`md:col-span-1 ${inputClassName("attachmentNote")}`}
              />
            </div>
            {attachment ? (
              <div className={`mt-1 text-xs ${attachmentError ? "text-red-400" : "text-zinc-400"}`}>
                {attachmentError
                  ? attachmentError
                  : (rtl
                    ? `ملف محدد: ${attachment.name} (${formatBytes(attachment.size)})`
                    : `Selected file: ${attachment.name} (${formatBytes(attachment.size)})`)}
              </div>
            ) : (
              <div className="mt-1 text-xs text-zinc-500">
                {rtl ? "الملفات المسموح بها: PDF, DOC(X), صور، ZIP (حتى 25 ميجابايت)" : "Allowed: PDF, DOC(X), images, ZIP (up to 25 MB)"}
              </div>
            )}
            {fieldErrors.attachment ? <div className="mt-1 text-xs text-red-300">{fieldErrors.attachment}</div> : null}
            {fieldErrors.attachmentNote ? <div className="mt-1 text-xs text-red-300">{fieldErrors.attachmentNote}</div> : null}
          </div>
        </div>
        <div className="mt-auto -mx-6 -mb-6 md:-mx-8 md:-mb-8">
          <div className="border-t border-[var(--panel-border)] bg-black/10 dark:bg-black/40 backdrop-blur-lg px-6 py-4 md:px-8 rounded-b-2xl flex items-center justify-between">
            <div className={`text-xs text-white ${rtl ? "text-right" : ""}`}>
              {rtl ? "سيتم التعامل مع جميع المعلومات بسرية تامة." : "All information will be handled in strict confidence."}
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              aria-busy={status === "loading"}
              className={`inline-flex items-center gap-2 ${rtl ? "flex-row-reverse" : "flex-row"} rounded-lg bg-[var(--brand-accent)] text-white dark:text-black px-5 py-2.5 font-semibold transition-transform duration-200 will-change-transform hover:-translate-y-0.5 active:scale-95 hover:opacity-90`}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
                <path d="M3 12l18-9-7 18-3-6-6-3z" fill="currentColor" />
              </svg>
              <span>{t.submit}</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="contact-success-title">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowThanks(false)} />
          <div className="relative z-10 w-[92%] max-w-md rounded-2xl surface p-6 md:p-8 text-center overflow-hidden">
            <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(225,188,137,0.25),transparent_60%)] blur-2xl" />
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-accent)]/15 ring-1 ring-[var(--brand-accent)]/30 text-[var(--brand-accent)]">
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                <path fill="currentColor" d="M12 2c-1.1 0-2 .9-2 2v.18C7.16 4.61 5 7.06 5 10v3.5L3.29 15.8c-.19.19-.29.44-.29.71V18h18v-1.49c0-.27-.11-.52-.29-.71L19 13.5V10c0-2.94-2.16-5.39-5-5.82V4c0-1.1-.9-2-2-2zm-1.41 12.59l-2.12-2.12-1.41 1.41 3.53 3.53 6.59-6.59-1.41-1.41-5.77 5.77z"/>
              </svg>
            </div>
            <div id="contact-success-title" className="mt-3 text-2xl font-extrabold text-[var(--brand-accent)]">{t.thanksTitle}</div>
            <div className="mx-auto mt-2 h-px w-24 bg-gradient-to-r from-transparent via-[var(--brand-accent)]/70 to-transparent" />
            <div className="mt-2 text-sm text-[var(--text-secondary)]">{successDetail || t.thanksBody}</div>
            <button
              onClick={() => {
                setShowThanks(false);
                resetForm();
              }}
              className="mt-5 inline-flex items-center rounded-lg bg-[var(--brand-accent)] text-black px-5 py-2.5 font-semibold"
            >
              {t.ok}
            </button>
          </div>
        </div>
      )}
      {showError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="contact-error-title">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowError(false)} />
          <div className="relative z-10 w-[92%] max-w-md rounded-2xl surface p-6 md:p-8 text-center overflow-hidden">
            <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(225,188,137,0.22),transparent_60%)] blur-2xl" />
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-accent)]/15 ring-1 ring-[var(--brand-accent)]/30 text-[var(--brand-accent)]">
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                <path fill="currentColor" d="M12 2 1 21h22L12 2zm1 15h-2v2h2v-2zm0-8h-2v6h2V9z"/>
              </svg>
            </div>
            <div id="contact-error-title" className="mt-3 text-2xl font-extrabold text-[var(--brand-accent)]">{t.errorTitle}</div>
            <div className="mx-auto mt-2 h-px w-24 bg-gradient-to-r from-transparent via-[var(--brand-accent)]/70 to-transparent" />
            <div className="mt-2 text-sm text-[var(--text-secondary)]">
              {t.errorBody}
              {errorDetail ? <div className="mt-1 text-xs text-red-300">{errorDetail}</div> : null}
            </div>
            <button
              onClick={() => {
                setShowError(false);
              }}
              className="mt-5 inline-flex items-center rounded-lg bg-[var(--brand-accent)] text-black px-5 py-2.5 font-semibold"
            >
              {t.ok}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
