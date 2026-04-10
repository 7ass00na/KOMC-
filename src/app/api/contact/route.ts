import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

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
  if (file && file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ ok: false, error: "ATTACHMENT_TOO_LARGE" }, { status: 413 });
  }

  const to = "ahmedhussan068@gmail.com";
  const ts = new Date().toISOString();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || "unknown";
  const subject =
    lang === "ar"
      ? `عميل من موقع خالد عمر (KOMC) يطلب استشارة وتمثيل قانوني - ${ts}`
      : `Customer from Khaled Omar (KOMC) website seeking Consultation & Legal Representation - ${ts}`;

  const salutation =
    lang === "ar"
      ? "مرحبًا، شركة خالد عمر للاستشارات القانونية والبحرية،"
      : "Hello, Khaled Omar Maritime & Legal Consulting Law Firm,";
  const introLine =
    lang === "ar"
      ? `أنا ${escapeHtml(fullName)} أطلب استشارة وتمثيلًا قانونيًا للتفاصيل أدناه.`
      : `I am ${escapeHtml(fullName)} seeking legal consultation and representation for the details below.`;
  const headers = {
    section: lang === "ar" ? "بيانات النموذج" : "Form Data",
    fullName: lang === "ar" ? "الاسم الكامل" : "Full Name",
    contact: lang === "ar" ? "معلومات التواصل" : "Contact Information",
    preferredContact: lang === "ar" ? "طريقة التواصل المفضلة" : "Preferred Contact Method",
    serviceType: lang === "ar" ? "نوع الخدمة" : "Service Type",
    preferredDT: lang === "ar" ? "الوقت المفضل" : "Preferred Date/Time",
    caseTitle: lang === "ar" ? "عنوان القضية" : "Case Title",
    caseDesc: lang === "ar" ? "وصف القضية" : "Case Description",
    additional: lang === "ar" ? "تعليقات إضافية" : "Additional Comments",
  };

  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Noto Sans, sans-serif; line-height:1.6; color:#0f172a;">
      <h2 style="margin:0 0 10px 0; font-weight:800; color:#132437;">${lang === "ar" ? "طلب استشارة وتمثيل قانوني" : "Consultation & Legal Representation Request"}</h2>
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
          <tr><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${headers.contact}</td><td style="padding:10px; border-bottom:1px solid #e5e7eb;">Email: ${escapeHtml(email)} | ${lang === "ar" ? "هاتف" : "Phone"}: ${escapeHtml(phone)}</td></tr>
          <tr><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${headers.preferredContact}</td><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${escapeHtml(preferredContact || "-")}</td></tr>
          <tr><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${headers.serviceType}</td><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${escapeHtml(serviceType || "-")}</td></tr>
          <tr><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${headers.preferredDT}</td><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${escapeHtml(preferredDateTime || "-")}</td></tr>
          <tr><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${headers.caseTitle}</td><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${escapeHtml(caseTitle || "-")}</td></tr>
          <tr><td style="padding:10px; border-bottom:1px solid #e5e7eb; vertical-align:top;">${headers.caseDesc}</td><td style="padding:10px; border-bottom:1px solid #e5e7eb; white-space:pre-wrap;">${escapeHtml(caseDesc || "-")}</td></tr>
          ${comments ? `<tr><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${headers.additional}</td><td style="padding:10px; border-bottom:1px solid #e5e7eb; white-space:pre-wrap;">${escapeHtml(comments)}</td></tr>` : ""}
          ${file ? `<tr><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${lang === "ar" ? "ملاحظة المرفق" : "Attachment Note"}</td><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${escapeHtml(attachmentNote || "-")}</td></tr>` : ""}
        </tbody>
      </table>
      <p style="margin-top:16px; color:#64748b;">${lang === "ar" ? "هذه رسالة آلية. يُرجى الرد على المرسل مباشرةً." : "This is an automated message. Please reply directly to the sender."}</p>
      <p style="margin-top:10px; color:#64748b;">IP ${escapeHtml(ip)} · ${ts}</p>
    </div>
  `;

  const text = `
${lang === "ar" ? "طلب استشارة وتمثيل قانوني" : "Consultation & Legal Representation Request"}
${salutation}
${introLine}

${headers.fullName}: ${fullName}
${headers.contact}: Email ${email} | ${lang === "ar" ? "هاتف" : "Phone"} ${phone}
${headers.preferredContact}: ${preferredContact || "-"}
${headers.serviceType}: ${serviceType || "-"}
${headers.preferredDT}: ${preferredDateTime || "-"}
${headers.caseTitle}: ${caseTitle || "-"}
${headers.caseDesc}: ${caseDesc || "-"}
${comments ? `${headers.additional}: ${comments}` : ""}
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
    await transporter.sendMail(mail);
    console.info("[contact] email delivered", { to, subject, ts, ip });
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
