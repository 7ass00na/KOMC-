import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const PRIMARY_CONTACT_RECIPIENT = "info@khaledomer.ae";
const CONTACT_BCC_RECIPIENT = "ahmedhussan068@gmail.com";

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
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || "unknown";
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
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "587", 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || user || "no-reply@localhost";

    if (!host || !user || !pass) {
      console.warn("[contact] SMTP not configured");
      return NextResponse.json({ ok: false, error: "SMTP_NOT_CONFIGURED" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465 || process.env.SMTP_SECURE === "true",
      auth: { user, pass },
      pool: true,
      maxConnections: Number(process.env.SMTP_MAX_CONNECTIONS || 5),
      maxMessages: Number(process.env.SMTP_MAX_MESSAGES || 100),
      tls: {
        rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTH !== "false",
        ciphers: "TLSv1.2",
      },
      connectionTimeout: Number(process.env.SMTP_CONN_TIMEOUT || 20000),
      greetingTimeout: Number(process.env.SMTP_GREET_TIMEOUT || 10000),
      socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT || 20000),
    } as any);

    const mail: any = {
      from,
      to,
      bcc: bcc && bcc !== to ? bcc : undefined,
      replyTo: email,
      subject,
      text,
      html,
    };
    if (file) {
      const buf = Buffer.from(await file.arrayBuffer());
      mail.attachments = [
        {
          filename: file.name,
          content: buf,
          contentType: file.type || "application/octet-stream",
        },
      ];
    }
    try {
      await transporter.verify();
    } catch (e) {
      console.error("[contact] SMTP verify failed", (e as any)?.message || e);
      return NextResponse.json({ ok: false, error: "SMTP_VERIFY_FAILED" }, { status: 502 });
    }
    // Retry with exponential backoff on transient failures
    const transient = new Set(["ETIMEDOUT", "ECONNRESET", "EAI_AGAIN", "ESOCKET", "ETIME"]);
    const delays = [500, 1500, 3000];
    let sent = false;
    for (let attempt = 0; attempt < delays.length && !sent; attempt++) {
      try {
        await transporter.sendMail(mail);
        sent = true;
      } catch (e: any) {
        const code = e?.code || e?.responseCode || "";
        const isTransient =
          transient.has(String(code)) ||
          (typeof code === "number" && code >= 400 && code < 500);
        console.error("[contact] sendMail error", { attempt: attempt + 1, code, message: e?.message || e });
        if (attempt < delays.length - 1 && isTransient) {
          await new Promise((r) => setTimeout(r, delays[attempt]));
          continue;
        }
        throw e;
      }
    }
    console.info("[contact] email delivered", { to, bcc: bcc && bcc !== to ? bcc : undefined, subject, ts, ip });
    return NextResponse.json({ ok: true, queued: true });
  } catch (err) {
    console.error("[contact] Failed to send email", err);
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
