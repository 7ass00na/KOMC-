import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[chat-analytics]", {
      at: new Date().toISOString(),
      ...body,
      ua: req.headers.get("user-agent"),
    });
  } catch {}
  return NextResponse.json({ ok: true });
}

