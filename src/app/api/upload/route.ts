import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

async function ensureDir() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch {}
}

export async function POST(req: Request) {
  try {
    await ensureDir();
    const form = await req.formData();
    const files = form.getAll("files");
    const saved: string[] = [];
    for (const f of files) {
      if (!(f instanceof File)) continue;
      const arrayBuffer = await f.arrayBuffer();
      const ext = path.extname(f.name) || "";
      const name = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}${ext}`;
      const dest = path.join(UPLOAD_DIR, name);
      await fs.writeFile(dest, Buffer.from(arrayBuffer));
      saved.push(`/uploads/${name}`);
    }
    return NextResponse.json({ urls: saved }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Upload failed" }, { status: 500 });
  }
}
