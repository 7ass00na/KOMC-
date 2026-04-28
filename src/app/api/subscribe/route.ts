import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const NEWSLETTER_RECIPIENT = "info.komc23@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
    }
    const host = process.env.SMTP_HOST || "";
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER || "";
    const pass = process.env.SMTP_PASS || "";
    const secure = String(process.env.SMTP_SECURE || "false").toLowerCase() === "true";
    const from = process.env.FROM_EMAIL || "no-reply@komc.local";
    const to = NEWSLETTER_RECIPIENT;
    if (!host || !user || !pass) {
      return NextResponse.json({ ok: true, note: "email_not_sent_env_missing" });
    }
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
    const info = await transporter.sendMail({
      from,
      to,
      subject: "KOMC Website Newsletter Subscription",
      text: [
        "A new newsletter subscription has been received from the KOMC website.",
        "",
        `Subscriber email: ${email}`,
        `Received at: ${new Date().toISOString()}`,
      ].join("\n"),
      html: `
        <div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#132437">
          <h2 style="margin:0 0 12px;color:#132437;">KOMC Website Newsletter Subscription</h2>
          <p style="margin:0 0 8px;">A new newsletter subscription has been received from the website.</p>
          <p style="margin:0 0 8px;"><strong>Subscriber email:</strong> ${email}</p>
          <p style="margin:0;color:#64748b;"><strong>Received at:</strong> ${new Date().toISOString()}</p>
        </div>
      `,
    });
    return NextResponse.json({ ok: true, id: info.messageId });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 500 });
  }
}
