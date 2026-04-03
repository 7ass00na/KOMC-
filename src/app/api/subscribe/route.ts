import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

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
    const to = "ahmedhussan068@gmail.com";
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
      subject: "New Newsletter Subscription",
      text: `A new user subscribed with email: ${email}`,
      html: `<div style="font-family:Arial,sans-serif;font-size:14px"><p>New subscriber:</p><p><strong>${email}</strong></p></div>`,
    });
    return NextResponse.json({ ok: true, id: info.messageId });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 500 });
  }
}
