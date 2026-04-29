import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const PRIMARY_CONTACT_RECIPIENT = "info@khaledomer.com";
const CONTACT_BCC_RECIPIENT = "ahmedhussano68@gmail.com";
const SUBMISSION_DEDUPE_WINDOW_MS = 2 * 60 * 1000;

type ContactTransportRole = "primary" | "bcc";

type ContactTransportConfig = {
  role: ContactTransportRole;
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
  if (!fullName || !email || !phone || !inquiry) {
    return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "INVALID_EMAIL" }, { status: 400 });
  }
  if (!/^[+()\-\s\d]{8,20}$/.test(phone)) {
    return NextResponse.json({ ok: false, error: "INVALID_PHONE" }, { status: 400 });
  }
  if (file && file.size > 25 * 1024 * 1024) {
    return NextResponse.json({ ok: false, error: "ATTACHMENT_TOO_LARGE" }, { status: 413 });
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
  const subject =
    lang === "ar"
      ? `طلب استشارة جديد من موقع KOMC - ${ts}`
      : `New consultation request from the KOMC website - ${ts}`;

  const salutation =
    lang === "ar"
      ? "مرحبًا فريق شركة خالد عمر للاستشارات البحرية،"
      : "Hello Khaled Omar Marine Consulting team,";
  const introLine =
    lang === "ar"
      ? `تم استلام طلب استشارة جديد من ${escapeHtml(fullName)} عبر موقع KOMC. نرجو مراجعة بيانات العميل أدناه والتواصل معه وفق وسيلة الاتصال المفضلة لديه.`
      : `A new consultation request was submitted on the KOMC website by ${escapeHtml(fullName)}. Please review the client details below and follow up using the preferred contact method provided.`;
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
    sourceValue: lang === "ar" ? "موقع KOMC - صفحة التواصل" : "KOMC website - Contact page",
  };

  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Noto Sans, sans-serif; line-height:1.6; color:#0f172a;">
      <h2 style="margin:0 0 10px 0; font-weight:800; color:#132437;">${lang === "ar" ? "طلب استشارة جديد عبر موقع KOMC" : "New Consultation Request from KOMC Website"}</h2>
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
      <p style="margin-top:16px; color:#64748b;">${lang === "ar" ? "هذه رسالة إشعار آلية من نموذج الاستشارة. يُرجى الرد على المرسل مباشرةً لبدء المتابعة." : "This is an automated consultation notification. Please reply directly to the sender to begin follow-up."}</p>
      <p style="margin-top:10px; color:#64748b;">IP ${escapeHtml(ip)} · ${ts}</p>
    </div>
  `;

  const text = `
${lang === "ar" ? "طلب استشارة جديد عبر موقع KOMC" : "New Consultation Request from KOMC Website"}
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

    const primaryConfig = getTransportConfig("primary", to);
    const bccConfig = getTransportConfig("bcc", bcc);

    if (!primaryConfig || !bccConfig) {
      console.warn("[contact] SMTP not configured", {
        requestId,
        primaryConfigured: Boolean(primaryConfig),
        bccConfigured: Boolean(bccConfig),
      });
      return NextResponse.json({ ok: false, error: "SMTP_NOT_CONFIGURED" }, { status: 500 });
    }

    const primaryTransporter = createConfiguredTransport(primaryConfig);
    const bccTransporter = createConfiguredTransport(bccConfig);

    const baseMail: any = {
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

    const primaryMail = {
      ...baseMail,
      from: primaryConfig.from,
      to,
    };
    const bccMail = {
      ...baseMail,
      from: bccConfig.from,
      to: bcc,
    };

    try {
      await verifyTransport(primaryTransporter, primaryConfig, requestId, to);
      await verifyTransport(bccTransporter, bccConfig, requestId, bcc);
    } catch (e) {
      console.error("[contact] SMTP verify failed", {
        requestId,
        message: (e as any)?.message || e,
      });
      return NextResponse.json({ ok: false, error: "SMTP_VERIFY_FAILED" }, { status: 502 });
    }

    markSubmissionInFlight(duplicateKey);
    try {
      const primaryInfo = await sendMailWithRetry(primaryTransporter, primaryMail, {
        requestId,
        role: "primary",
        recipient: to,
      });
      const bccInfo = await sendMailWithRetry(bccTransporter, bccMail, {
        requestId,
        role: "bcc",
        recipient: bcc,
      });
      markSubmissionSent(duplicateKey);
      console.info("[contact] email delivered", {
        requestId,
        to,
        bcc,
        subject,
        ts,
        ip,
        primaryMessageId: primaryInfo?.messageId,
        bccMessageId: bccInfo?.messageId,
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

function createRequestId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `komc-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function buildSubmissionFingerprint(input: Record<string, string>) {
  return Object.values(input)
    .map((value) => value.trim().toLowerCase())
    .join("|");
}

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

function markSubmissionInFlight(key: string) {
  recentSubmissions.set(key, { status: "in_flight", reset: Date.now() + SUBMISSION_DEDUPE_WINDOW_MS });
}

function markSubmissionSent(key: string) {
  recentSubmissions.set(key, { status: "sent", reset: Date.now() + SUBMISSION_DEDUPE_WINDOW_MS });
}

function clearSubmissionState(key: string) {
  recentSubmissions.delete(key);
}

function getTransportConfig(role: ContactTransportRole, recipient: string): ContactTransportConfig | null {
  const primaryDefaults = {
    host: process.env.CONTACT_PRIMARY_SMTP_HOST || process.env.SMTP_HOST || "smtp.hostinger.com",
    port: Number(process.env.CONTACT_PRIMARY_SMTP_PORT || process.env.SMTP_PORT || 465),
    user: process.env.CONTACT_PRIMARY_SMTP_USER || process.env.SMTP_USER || recipient,
    pass: process.env.CONTACT_PRIMARY_SMTP_PASS || process.env.SMTP_PASS || "",
    from: process.env.CONTACT_PRIMARY_SMTP_FROM || process.env.SMTP_FROM || process.env.CONTACT_PRIMARY_SMTP_USER || process.env.SMTP_USER || recipient,
    secure: String(process.env.CONTACT_PRIMARY_SMTP_SECURE || process.env.SMTP_SECURE || "true").toLowerCase() === "true",
  };
  const bccDefaults = {
    host: process.env.CONTACT_BCC_SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.CONTACT_BCC_SMTP_PORT || 465),
    user: process.env.CONTACT_BCC_SMTP_USER || recipient,
    pass: process.env.CONTACT_BCC_SMTP_PASS || "",
    from: process.env.CONTACT_BCC_SMTP_FROM || process.env.CONTACT_BCC_SMTP_USER || recipient,
    secure: String(process.env.CONTACT_BCC_SMTP_SECURE || "true").toLowerCase() === "true",
  };
  const selected = role === "primary" ? primaryDefaults : bccDefaults;
  if (!selected.host || !selected.user || !selected.pass) {
    return null;
  }
  return {
    role,
    host: selected.host,
    port: selected.port,
    user: selected.user,
    pass: selected.pass,
    from: selected.from,
    secure: role === "primary" ? selected.secure || selected.port === 465 : selected.secure || selected.port === 465,
    maxConnections: Number(process.env.SMTP_MAX_CONNECTIONS || 5),
    maxMessages: Number(process.env.SMTP_MAX_MESSAGES || 100),
    rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTH !== "false",
    connectionTimeout: Number(process.env.SMTP_CONN_TIMEOUT || 20000),
    greetingTimeout: Number(process.env.SMTP_GREET_TIMEOUT || 10000),
    socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT || 20000),
  };
}

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

async function verifyTransport(
  transporter: MailTransport,
  config: ContactTransportConfig,
  requestId: string,
  recipient: string
) {
  console.info("[contact] SMTP verify attempt", {
    requestId,
    role: config.role,
    host: config.host,
    port: config.port,
    secure: config.secure,
    recipient,
  });
  await transporter.verify();
}

async function sendMailWithRetry(
  transporter: MailTransport,
  mail: any,
  context: { requestId: string; role: ContactTransportRole; recipient: string }
) {
  const transient = new Set(["ETIMEDOUT", "ECONNRESET", "EAI_AGAIN", "ESOCKET", "ETIME"]);
  const delays = [500, 1500, 3000];
  for (let attempt = 0; attempt < delays.length; attempt++) {
    try {
      console.info("[contact] send attempt", {
        requestId: context.requestId,
        role: context.role,
        recipient: context.recipient,
        attempt: attempt + 1,
      });
      const info = await transporter.sendMail(mail);
      console.info("[contact] send success", {
        requestId: context.requestId,
        role: context.role,
        recipient: context.recipient,
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
        role: context.role,
        recipient: context.recipient,
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
