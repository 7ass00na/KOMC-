import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const PRIMARY_CONTACT_RECIPIENT = "info@khaledomer.ae";
const CONTACT_BCC_RECIPIENT = "ahmedhussan068@gmail.com";
const SUBMISSION_DEDUPE_WINDOW_MS = 2 * 60 * 1000;

type ContactTransportConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  secure: boolean;
  maxConnections: number;
  maxMessages: number;
  rejectUnauthorized: boolean;
  connectionTimeout: number;
  greetingTimeout: number;
  socketTimeout: number;
};

type MailTransport = {
  verify: () => Promise<unknown>;
  sendMail: (mail: any) => Promise<any>;
};

type ValidationFailure = {
  error: string;
  field: string;
};

export async function POST(req: Request) {
  const ctype = req.headers.get("content-type") || "";
  let fullName = "", gender = "", email = "", phone = "", address = "", inquiry = "", caseTitle = "", caseDesc = "", lang = "en", attachmentNote = "", serviceType = "", preferredDateTime = "", preferredContact = "", comments = "", honeypot = "";
  let file: File | null = null;
  if (ctype.includes("multipart/form-data")) {
    const fd = await req.formData();
    honeypot = String(fd.get("company") || "");
    fullName = String(fd.get("fullName") || "");
    gender = String(fd.get("gender") || "");
    email = String(fd.get("email") || "");
    phone = String(fd.get("phone") || "");
    address = String(fd.get("address") || "");
    inquiry = String(fd.get("inquiry") || "");
    caseTitle = String(fd.get("caseTitle") || "");
    caseDesc = String(fd.get("caseDesc") || "");
    lang = String(fd.get("lang") || "en");
    attachmentNote = String(fd.get("attachmentNote") || "");
    serviceType = String(fd.get("serviceType") || "");
    preferredDateTime = String(fd.get("preferredDateTime") || "");
    preferredContact = String(fd.get("preferredContact") || "");
    comments = String(fd.get("comments") || "");
    const maybe = fd.get("attachment");
    if (maybe instanceof File) file = maybe;
  } else {
    const data = await req.json();
    fullName = data?.fullName || "";
    gender = data?.gender || "";
    email = data?.email || "";
    phone = data?.phone || "";
    address = data?.address || "";
    inquiry = data?.inquiry || "";
    caseTitle = data?.caseTitle || "";
    caseDesc = data?.caseDesc || "";
    lang = data?.lang || "en";
    attachmentNote = data?.attachmentNote || "";
    serviceType = data?.serviceType || "";
    preferredDateTime = data?.preferredDateTime || "";
    preferredContact = data?.preferredContact || "";
    comments = data?.comments || "";
  }

  if (honeypot) {
    return NextResponse.json({ ok: true, queued: false, note: "Dropped by honeypot" });
  }
  const validationFailure = validateSubmission({
    fullName,
    email,
    phone,
    address,
    inquiry,
    caseTitle,
    caseDesc,
    attachmentNote,
    preferredDateTime,
    preferredContact,
    comments,
  });
  if (validationFailure) {
    return NextResponse.json({ ok: false, ...validationFailure }, { status: 400 });
  }
  if (file && file.size > 25 * 1024 * 1024) {
    return NextResponse.json({ ok: false, error: "ATTACHMENT_TOO_LARGE", field: "attachment" }, { status: 413 });
  }

  const to = process.env.CONTACT_TO_EMAIL || PRIMARY_CONTACT_RECIPIENT;
  const bcc = process.env.CONTACT_BCC_EMAIL || CONTACT_BCC_RECIPIENT;
  const ts = new Date().toISOString();
  const requestId = createRequestId();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || "unknown";
  const duplicateKey = buildSubmissionFingerprint({
    fullName,
    email,
    phone,
    inquiry,
    caseTitle,
    caseDesc,
    preferredDateTime,
    preferredContact,
    serviceType,
    comments,
    lang,
  });
  const subject = "Customer seeking legal representation from the KOMC - website";

  const salutation =
    lang === "ar"
      ? "مرحبا فريق خالد عمر للاستشارات البحرية والقانونية."
      : "Hello, Khaled Omar Maritime & Legal Consulting Team.";
  const introLine =
    lang === "ar"
      ? "أنا أطلب المشورة القانونية والتمثيل القانوني بخصوص الموضوع التالي، مع التفاصيل أدناه."
      : "I am seeking legal advice and representation for the subject with the details below.";
  const headers = {
    section: lang === "ar" ? "بيانات النموذج" : "Form Data",
    fullName: lang === "ar" ? "الاسم الكامل" : "Full Name",
    gender: lang === "ar" ? "النوع" : "Gender",
    contact: lang === "ar" ? "معلومات التواصل" : "Contact Information",
    address: lang === "ar" ? "العنوان" : "Address",
    inquiry: lang === "ar" ? "نوع الاستفسار" : "Type of Inquiry",
    preferredContact: lang === "ar" ? "طريقة التواصل المفضلة" : "Preferred Contact Method",
    serviceType: lang === "ar" ? "نوع الخدمة" : "Service Type",
    preferredDT: lang === "ar" ? "الوقت المفضل" : "Preferred Date/Time",
    caseTitle: lang === "ar" ? "عنوان القضية" : "Case Title",
    caseDesc: lang === "ar" ? "وصف القضية" : "Case Description",
    additional: lang === "ar" ? "تعليقات إضافية" : "Additional Comments",
    submittedAt: lang === "ar" ? "وقت الإرسال" : "Submitted At",
    source: lang === "ar" ? "مصدر الطلب" : "Lead Source",
    sourceValue: lang === "ar" ? "موقع KOMC - صفحة اتصل بنا" : "KOMC website - Contact Us page",
  };

  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Noto Sans, sans-serif; line-height:1.6; color:#0f172a;">
      <h2 style="margin:0 0 10px 0; font-weight:800; color:#132437;">${escapeHtml(subject)}</h2>
      <p style="margin:0 0 6px 0; color:#334155;">${salutation}</p>
      <p style="margin:0 0 14px 0; color:#334155;">${introLine}</p>
      <table style="border-collapse:collapse; width:100%; margin-top:8px;">
        <thead>
          <tr>
            <th style="text-align:${lang === "ar" ? "right" : "left"}; padding:10px; border-bottom:1px solid #e2e8f0; background:#f8fafc; color:#0f172a;">${headers.section}</th>
            <th style="text-align:${lang === "ar" ? "right" : "left"}; padding:10px; border-bottom:1px solid #e2e8f0; background:#f8fafc; color:#0f172a;"></th>
          </tr>
        </thead>
        <tbody>
          <tr><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${headers.fullName}</td><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${escapeHtml(fullName)}</td></tr>
          <tr><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${headers.gender}</td><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${escapeHtml(gender || "-")}</td></tr>
          <tr><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${headers.contact}</td><td style="padding:10px; border-bottom:1px solid #e5e7eb;">Email: ${escapeHtml(email)} | ${lang === "ar" ? "هاتف" : "Phone"}: ${escapeHtml(phone)}</td></tr>
          <tr><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${headers.address}</td><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${escapeHtml(address || "-")}</td></tr>
          <tr><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${headers.inquiry}</td><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${escapeHtml(inquiry || "-")}</td></tr>
          <tr><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${headers.preferredContact}</td><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${escapeHtml(preferredContact || "-")}</td></tr>
          <tr><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${headers.serviceType}</td><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${escapeHtml(serviceType || "-")}</td></tr>
          <tr><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${headers.preferredDT}</td><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${escapeHtml(preferredDateTime || "-")}</td></tr>
          <tr><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${headers.caseTitle}</td><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${escapeHtml(caseTitle || "-")}</td></tr>
          <tr><td style="padding:10px; border-bottom:1px solid #e5e7eb; vertical-align:top;">${headers.caseDesc}</td><td style="padding:10px; border-bottom:1px solid #e5e7eb; white-space:pre-wrap;">${escapeHtml(caseDesc || "-")}</td></tr>
          ${comments ? `<tr><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${headers.additional}</td><td style="padding:10px; border-bottom:1px solid #e5e7eb; white-space:pre-wrap;">${escapeHtml(comments)}</td></tr>` : ""}
          ${file ? `<tr><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${lang === "ar" ? "ملاحظة المرفق" : "Attachment Note"}</td><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${escapeHtml(attachmentNote || "-")}</td></tr>` : ""}
          <tr><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${headers.source}</td><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${headers.sourceValue}</td></tr>
          <tr><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${headers.submittedAt}</td><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${ts}</td></tr>
        </tbody>
      </table>
      <p style="margin-top:16px; color:#64748b;">${lang === "ar" ? "هذه رسالة آلية من نموذج الاستشارة. يرجى الرد على العميل مباشرة لبدء المتابعة." : "This is an automated consultation-form message. Please reply directly to the client to begin follow-up."}</p>
      <p style="margin-top:10px; color:#64748b;">IP ${escapeHtml(ip)} · ${ts}</p>
    </div>
  `;

  const text = `
${subject}
${salutation}
${introLine}

${headers.fullName}: ${fullName}
${headers.gender}: ${gender || "-"}
${headers.contact}: Email ${email} | ${lang === "ar" ? "هاتف" : "Phone"} ${phone}
${headers.address}: ${address || "-"}
${headers.inquiry}: ${inquiry || "-"}
${headers.preferredContact}: ${preferredContact || "-"}
${headers.serviceType}: ${serviceType || "-"}
${headers.preferredDT}: ${preferredDateTime || "-"}
${headers.caseTitle}: ${caseTitle || "-"}
${headers.caseDesc}: ${caseDesc || "-"}
${comments ? `${headers.additional}: ${comments}` : ""}
${headers.source}: ${headers.sourceValue}
${headers.submittedAt}: ${ts}
IP ${ip} · ${ts}
  `.trim();

  try {
    const limitOk = await rateLimit(ip);
    if (!limitOk) {
      return NextResponse.json({ ok: false, error: "RATE_LIMITED" }, { status: 429 });
    }
    const duplicateState = getSubmissionState(duplicateKey);
    if (duplicateState === "in_flight") {
      console.info("[contact] duplicate submission blocked", { requestId, duplicateKey, phase: "in_flight", ip });
      return NextResponse.json({ ok: true, queued: false, duplicate: true, requestId });
    }
    if (duplicateState === "sent") {
      console.info("[contact] duplicate submission blocked", { requestId, duplicateKey, phase: "recent", ip });
      return NextResponse.json({ ok: true, queued: false, duplicate: true, requestId });
    }

    const transportConfig = getTransportConfig();

    if (!transportConfig) {
      console.warn("[contact] SMTP not configured", {
        requestId,
        configured: false,
      });
      return NextResponse.json({ ok: false, error: "SMTP_NOT_CONFIGURED" }, { status: 500 });
    }

    const transporter = createConfiguredTransport(transportConfig);

    const baseMail: any = {
      from: transportConfig.from,
      to,
      bcc: bcc && bcc !== to ? bcc : undefined,
      replyTo: email,
      subject,
      text,
      html,
      headers: {
        "X-KOMC-Request-ID": requestId,
      },
    };
    if (file) {
      const buf = Buffer.from(await file.arrayBuffer());
      baseMail.attachments = [
        {
          filename: file.name,
          content: buf,
          contentType: file.type || "application/octet-stream",
        },
      ];
    }

    try {
      await verifyTransport(transporter, transportConfig, requestId, to, bcc);
    } catch (e) {
      console.error("[contact] SMTP verify failed", {
        requestId,
        message: (e as any)?.message || e,
      });
      return NextResponse.json({ ok: false, error: "SMTP_VERIFY_FAILED" }, { status: 502 });
    }

    markSubmissionInFlight(duplicateKey);
    try {
      const deliveryInfo = await sendMailWithRetry(transporter, baseMail, {
        requestId,
        recipient: to,
        bcc,
      });
      markSubmissionSent(duplicateKey);
      console.info("[contact] email delivered", {
        requestId,
        to,
        bcc: baseMail.bcc,
        subject,
        ts,
        ip,
        messageId: deliveryInfo?.messageId,
      });
      return NextResponse.json({ ok: true, queued: true, requestId });
    } catch (deliveryError) {
      clearSubmissionState(duplicateKey);
      throw deliveryError;
    }
  } catch (err) {
    console.error("[contact] Failed to send email", {
      requestId,
      to,
      bcc,
      error: err,
    });
    return NextResponse.json({ ok: false, error: "EMAIL_SEND_FAILED" }, { status: 500 });
  }
}

/** Escapes user-supplied content before it is inserted into HTML email markup. */
function escapeHtml(input: string) {
  return String(input)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const buckets = new Map<string, { count: number; reset: number }>();
const recentSubmissions = new Map<string, { status: "in_flight" | "sent"; reset: number }>();

/** Applies a lightweight per-IP rate limit to reduce abuse on the contact endpoint. */
async function rateLimit(ip: string) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const max = 5;
  const k = ip || "unknown";
  const entry = buckets.get(k);
  if (!entry || entry.reset < now) {
    buckets.set(k, { count: 1, reset: now + windowMs });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count++;
  return true;
}

/** Creates a stable request identifier for delivery logs and trace headers. */
function createRequestId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `komc-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Builds a normalized fingerprint used to suppress accidental duplicate submissions. */
function buildSubmissionFingerprint(input: Record<string, string>) {
  return Object.values(input)
    .map((value) => value.trim().toLowerCase())
    .join("|");
}

/** Returns the active duplicate-submission state if the suppression window is still valid. */
function getSubmissionState(key: string) {
  const now = Date.now();
  const record = recentSubmissions.get(key);
  if (!record) return null;
  if (record.reset <= now) {
    recentSubmissions.delete(key);
    return null;
  }
  return record.status;
}

/** Marks a submission fingerprint as currently being processed. */
function markSubmissionInFlight(key: string) {
  recentSubmissions.set(key, { status: "in_flight", reset: Date.now() + SUBMISSION_DEDUPE_WINDOW_MS });
}

/** Marks a submission fingerprint as already delivered inside the suppression window. */
function markSubmissionSent(key: string) {
  recentSubmissions.set(key, { status: "sent", reset: Date.now() + SUBMISSION_DEDUPE_WINDOW_MS });
}

/** Clears any stored suppression state after a failed delivery attempt. */
function clearSubmissionState(key: string) {
  recentSubmissions.delete(key);
}

/** Resolves the SMTP transport configuration from environment variables. */
function getTransportConfig(): ContactTransportConfig | null {
  const host = process.env.CONTACT_SMTP_HOST || process.env.SMTP_HOST || "";
  const port = Number(process.env.CONTACT_SMTP_PORT || process.env.SMTP_PORT || 465);
  const user = process.env.CONTACT_SMTP_USER || process.env.SMTP_USER || "";
  const pass = process.env.CONTACT_SMTP_PASS || process.env.SMTP_PASS || "";
  const from = process.env.CONTACT_SMTP_FROM || process.env.SMTP_FROM || user || "no-reply@komc.local";
  const secure = String(process.env.CONTACT_SMTP_SECURE || process.env.SMTP_SECURE || "true").toLowerCase() === "true";
  if (!host || !user || !pass) {
    return null;
  }
  return {
    host,
    port,
    user,
    pass,
    from,
    secure: secure || port === 465,
    maxConnections: Number(process.env.SMTP_MAX_CONNECTIONS || 5),
    maxMessages: Number(process.env.SMTP_MAX_MESSAGES || 100),
    rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTH !== "false",
    connectionTimeout: Number(process.env.SMTP_CONN_TIMEOUT || 20000),
    greetingTimeout: Number(process.env.SMTP_GREET_TIMEOUT || 10000),
    socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT || 20000),
  };
}

/** Creates the Nodemailer transport used by the consultation endpoint. */
function createConfiguredTransport(config: ContactTransportConfig): MailTransport {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.pass },
    pool: true,
    maxConnections: config.maxConnections,
    maxMessages: config.maxMessages,
    tls: {
      rejectUnauthorized: config.rejectUnauthorized,
      ciphers: "TLSv1.2",
    },
    connectionTimeout: config.connectionTimeout,
    greetingTimeout: config.greetingTimeout,
    socketTimeout: config.socketTimeout,
  } as any);
}

/** Verifies that the configured SMTP transport is reachable before delivery starts. */
async function verifyTransport(
  transporter: MailTransport,
  config: ContactTransportConfig,
  requestId: string,
  recipient: string,
  bcc?: string
) {
  console.info("[contact] SMTP verify attempt", {
    requestId,
    host: config.host,
    port: config.port,
    secure: config.secure,
    recipient,
    bcc,
  });
  await transporter.verify();
}

/** Sends mail with bounded retries for transient transport failures. */
async function sendMailWithRetry(
  transporter: MailTransport,
  mail: any,
  context: { requestId: string; recipient: string; bcc?: string }
) {
  const transient = new Set(["ETIMEDOUT", "ECONNRESET", "EAI_AGAIN", "ESOCKET", "ETIME"]);
  const delays = [500, 1500, 3000];
  for (let attempt = 0; attempt < delays.length; attempt++) {
    try {
      console.info("[contact] send attempt", {
        requestId: context.requestId,
        recipient: context.recipient,
        bcc: context.bcc,
        attempt: attempt + 1,
      });
      const info = await transporter.sendMail(mail);
      console.info("[contact] send success", {
        requestId: context.requestId,
        recipient: context.recipient,
        bcc: context.bcc,
        attempt: attempt + 1,
        messageId: info?.messageId,
      });
      return info;
    } catch (e: any) {
      const code = e?.code || e?.responseCode || "";
      const isTransient =
        transient.has(String(code)) ||
        (typeof code === "number" && code >= 400 && code < 500);
      console.error("[contact] sendMail error", {
        requestId: context.requestId,
        recipient: context.recipient,
        bcc: context.bcc,
        attempt: attempt + 1,
        code,
        message: e?.message || e,
      });
      if (attempt < delays.length - 1 && isTransient) {
        await new Promise((r) => setTimeout(r, delays[attempt]));
        continue;
      }
      throw e;
    }
  }
}

/** Validates the normalized submission payload and returns the first field-level failure. */
function validateSubmission(input: Record<string, string>): ValidationFailure | null {
  const requiredFields: Array<[string, string]> = [
    ["fullName", input.fullName],
    ["email", input.email],
    ["phone", input.phone],
    ["inquiry", input.inquiry],
    ["preferredContact", input.preferredContact],
  ];
  for (const [field, value] of requiredFields) {
    if (!value.trim()) {
      return { error: "FIELD_REQUIRED", field };
    }
  }

  if (!isValidHumanText(input.fullName, 2, 120)) {
    return { error: "INVALID_FULL_NAME", field: "fullName" };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    return { error: "INVALID_EMAIL", field: "email" };
  }
  if (!/^[+()\-\s\d]{8,20}$/.test(input.phone.trim())) {
    return { error: "INVALID_PHONE", field: "phone" };
  }
  if (input.address.trim() && !isValidFlexibleText(input.address, 3, 200)) {
    return { error: "INVALID_ADDRESS", field: "address" };
  }
  if (!isValidFlexibleText(input.inquiry, 2, 80)) {
    return { error: "INVALID_INQUIRY", field: "inquiry" };
  }
  if (input.caseTitle.trim() && !isValidFlexibleText(input.caseTitle, 2, 150)) {
    return { error: "INVALID_CASE_TITLE", field: "caseTitle" };
  }
  if (input.caseDesc.trim() && !isValidFlexibleText(input.caseDesc, 5, 3000, true)) {
    return { error: "INVALID_CASE_DESCRIPTION", field: "caseDesc" };
  }
  if (input.attachmentNote.trim() && !isValidFlexibleText(input.attachmentNote, 2, 250, true)) {
    return { error: "INVALID_ATTACHMENT_NOTE", field: "attachmentNote" };
  }
  if (input.preferredDateTime.trim() && Number.isNaN(Date.parse(input.preferredDateTime))) {
    return { error: "INVALID_PREFERRED_DATETIME", field: "preferredDateTime" };
  }
  if (!["phone", "email", "either"].includes(input.preferredContact.trim())) {
    return { error: "INVALID_PREFERRED_CONTACT", field: "preferredContact" };
  }
  if (input.comments.trim() && !isValidFlexibleText(input.comments, 2, 2000, true)) {
    return { error: "INVALID_COMMENTS", field: "comments" };
  }
  return null;
}

/** Validates human name fields while allowing Arabic and English letterforms. */
function isValidHumanText(value: string, min: number, max: number) {
  const trimmed = value.trim();
  if (trimmed.length < min || trimmed.length > max) return false;
  return /^[\p{L}\p{M}\s'.-]+$/u.test(trimmed);
}

/** Validates freeform short or multiline fields across Arabic and English input. */
function isValidFlexibleText(value: string, min: number, max: number, multiline = false) {
  const trimmed = value.trim();
  if (trimmed.length < min || trimmed.length > max) return false;
  const pattern = multiline
    ? /^[\p{L}\p{M}\p{N}\s'".,;:!?()\-\/&@#+\n\r]+$/u
    : /^[\p{L}\p{M}\p{N}\s'".,;:!?()\-\/&@#+]+$/u;
  return pattern.test(trimmed);
}
