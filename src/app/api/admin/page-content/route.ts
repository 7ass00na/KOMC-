 import { NextResponse } from "next/server";
 import { readEntity, writeEntity } from "@/lib/store";
 
export async function GET() {
  const data = await readEntity("page-content", { home: { changes: [] }, about: { changes: [] }, services: { changes: [] }, cases: { changes: [] }, news: { changes: [] }, header: { changes: [] }, footer: { changes: [] } });
   return NextResponse.json(data, { status: 200 });
 }
 
 export async function PUT(req: Request) {
   try {
     const body = await req.json();
    const current = await readEntity("page-content", { home: { changes: [] }, about: { changes: [] }, services: { changes: [] }, cases: { changes: [] }, news: { changes: [] }, header: { changes: [] }, footer: { changes: [] } });
     const merged = { ...current, ...body };
     await writeEntity("page-content", merged);
     return NextResponse.json(merged, { status: 200 });
   } catch (e: any) {
     return NextResponse.json({ error: e?.message || "Invalid payload" }, { status: 400 });
   }
 }
