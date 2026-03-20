import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const ctype = req.headers.get("content-type") || "";
  let fullName = "", gender = "", email = "", phone = "", address = "", inquiry = "", caseTitle = "", caseDesc = "", lang = "en", attachmentNote = "";
  let file: File | null = null;
  if (ctype.includes("multipart/form-data")) {
    const fd = await req.formData();
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
  }

  if (!fullName || !email || !phone || !inquiry) {
    return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
  }
  if (file && file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ ok: false, error: "ATTACHMENT_TOO_LARGE" }, { status: 413 });
  }

  const to = "ahmedhussan068@gmail.com";
  const subject = `Legal Consultation from the Website - Regarding ${inquiry}`;

  const intro =
    lang === "ar"
      ? "تم إرسال هذا البريد تلقائيًا من واجهة نموذج الاستشارة في موقع KOMC."
      : "This email was generated automatically from the KOMC Website Consultation Form.";
  const prefaceHtml =
    lang === "ar"
      ? `
      <div style="margin:12px 0; padding:10px; border:1px solid #e5e7eb; background:#f9fafb; border-radius:10px;">
        <div style="font-weight:700; margin-bottom:6px; color:#0f172a;">مقدمة سريعة</div>
        <ul style="margin:0; padding-left:18px; color:#334155;">
          <li>المصدر: موقع KOMC</li>
          <li>التواصل المفضل: الهاتف/البريد</li>
          <li>الاختصاص: الإمارات</li>
          <li>الموضوع: ${escapeHtml(inquiry)}</li>
        </ul>
      </div>`
      : `
      <div style="margin:12px 0; padding:10px; border:1px solid #e5e7eb; background:#f9fafb; border-radius:10px;">
        <div style="font-weight:700; margin-bottom:6px; color:#0f172a;">Quick Preface</div>
        <ul style="margin:0; padding-left:18px; color:#334155;">
          <li>Source: KOMC Website</li>
          <li>Preferred contact: Phone/Email</li>
          <li>Jurisdiction: UAE</li>
          <li>Matter: ${escapeHtml(inquiry)}</li>
        </ul>
      </div>`;

  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Noto Sans, sans-serif; line-height:1.6; color:#0f172a;">
      <h2 style="margin:0 0 10px 0; font-weight:800; color:#132437;">${lang === "ar" ? "طلب استشارة قانونية" : "Legal Consultation Request"}</h2>
      <p style="margin:0 0 14px 0; color:#334155;">${intro}</p>
      ${prefaceHtml}
      <table style="border-collapse:collapse; width:100%; margin-top:8px;">
        <thead>
          <tr>
            <th style="text-align:${lang === "ar" ? "right" : "left"}; padding:10px; border-bottom:1px solid #e2e8f0; background:#f8fafc; color:#0f172a;">${lang === "ar" ? "الحقل" : "Field"}</th>
            <th style="text-align:${lang === "ar" ? "right" : "left"}; padding:10px; border-bottom:1px solid #e2e8f0; background:#f8fafc; color:#0f172a;">${lang === "ar" ? "القيمة" : "Value"}</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${lang === "ar" ? "الاسم الكامل" : "Full Name"}</td><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${escapeHtml(fullName)}</td></tr>
          <tr><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${lang === "ar" ? "النوع" : "Gender"}</td><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${escapeHtml(gender || "-")}</td></tr>
          <tr><td style="padding:10px; border-bottom:1px solid #e5e7eb;">Email</td><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${escapeHtml(email)}</td></tr>
          <tr><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${lang === "ar" ? "رقم الهاتف" : "Phone Number"}</td><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${escapeHtml(phone)}</td></tr>
          <tr><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${lang === "ar" ? "العنوان" : "Address"}</td><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${escapeHtml(address || "-")}</td></tr>
          <tr><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${lang === "ar" ? "نوع الاستفسار" : "Type of Inquiry"}</td><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${escapeHtml(inquiry)}</td></tr>
          <tr><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${lang === "ar" ? "عنوان القضية" : "Case Title"}</td><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${escapeHtml(caseTitle || "-")}</td></tr>
          <tr><td style="padding:10px; border-bottom:1px solid #e5e7eb; vertical-align:top;">${lang === "ar" ? "وصف القضية" : "Case Description"}</td><td style="padding:10px; border-bottom:1px solid #e5e7eb; white-space:pre-wrap;">${escapeHtml(caseDesc || "-")}</td></tr>
          ${file ? `<tr><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${lang === "ar" ? "ملاحظة المرفق" : "Attachment Note"}</td><td style="padding:10px; border-bottom:1px solid #e5e7eb;">${escapeHtml(attachmentNote || "-")}</td></tr>` : ""}
          <tr><td style="padding:10px;">${lang === "ar" ? "اللغة" : "Language"}</td><td style="padding:10px;">${lang}</td></tr>
        </tbody>
      </table>
      <p style="margin-top:16px; color:#64748b;">${lang === "ar" ? "الرجاء الرد على المرسل مباشرةً لمتابعة التفاصيل." : "Please reply to the sender directly to follow up."}</p>
    </div>
  `;

  const text = `
${lang === "ar" ? "طلب استشارة قانونية" : "Legal Consultation Request"}
${intro}

${lang === "ar" ? "مقدمة سريعة" : "Quick Preface"}
${lang === "ar" ? "المصدر" : "Source"}: KOMC Website
${lang === "ar" ? "التواصل المفضل" : "Preferred contact"}: Phone/Email
${lang === "ar" ? "الاختصاص" : "Jurisdiction"}: UAE
${lang === "ar" ? "الموضوع" : "Matter"}: ${inquiry}

${lang === "ar" ? "الاسم الكامل" : "Full Name"}: ${fullName}
${lang === "ar" ? "النوع" : "Gender"}: ${gender || "-"}
Email: ${email}
${lang === "ar" ? "رقم الهاتف" : "Phone Number"}: ${phone}
${lang === "ar" ? "العنوان" : "Address"}: ${address || "-"}
${lang === "ar" ? "نوع الاستفسار" : "Type of Inquiry"}: ${inquiry}
${lang === "ar" ? "عنوان القضية" : "Case Title"}: ${caseTitle || "-"}
${lang === "ar" ? "وصف القضية" : "Case Description"}: ${caseDesc || "-"}
${file ? (lang === "ar" ? "ملاحظة المرفق" : "Attachment Note") + `: ${attachmentNote || "-"}` : ""}
Language: ${lang}
  `.trim();

  try {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "587", 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || user || "no-reply@localhost";

    if (!host || !user || !pass) {
      console.warn("[contact] SMTP not configured; printing email to server logs instead.");
      console.info({ to, subject, text, html, attachment: file ? { name: file.name, size: file.size, type: file.type } : null });
      return NextResponse.json({ ok: true, queued: false, note: "SMTP not configured — logged only" });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

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
    await transporter.sendMail(mail);
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
