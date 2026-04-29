'use client';
import AdminShell from "@/components/admin/AdminShell";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] grid place-items-center text-zinc-300">جارٍ التحميل…</div>}>
      <AdminShell lang="ar" />
    </Suspense>
  );
}
