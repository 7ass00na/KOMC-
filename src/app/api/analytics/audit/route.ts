import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const encKeyB64 = process.env.AUDIT_ENC_KEY || "";
    const webhook = process.env.AUDIT_WEBHOOK_URL || "";
    if (!encKeyB64 || !webhook) {
      return NextResponse.json({ ok: true, skipped: true });
    }
    const key = Buffer.from(encKeyB64, "base64");
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
    const payload = Buffer.from(JSON.stringify({ ...body, at: Date.now() }), "utf8");
    const enc = Buffer.concat([cipher.update(payload), cipher.final()]);
    const tag = cipher.getAuthTag();
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        iv: iv.toString("base64"),
        data: enc.toString("base64"),
        tag: tag.toString("base64"),
      }),
    }).catch(() => {});
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}

