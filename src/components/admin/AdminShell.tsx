'use client';
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import RichTextEditor from "./RichTextEditor";

type Lang = "en" | "ar";
type Props = { lang: Lang };

const sections = [
  { id: "users", icon: UsersIcon, en: "Users", ar: "المستخدمون" },
  { id: "stats", icon: ChartIcon, en: "Statistics", ar: "الإحصائيات" },
  { id: "colors", icon: PaletteIcon, en: "Colors", ar: "الألوان" },
  { id: "workflow", icon: WorkflowIcon, en: "Workflow", ar: "سير العمل" },
  { id: "schedule", icon: ScheduleIcon, en: "Scheduling", ar: "الجدولة" },
  { id: "revisions", icon: RevisionsIcon, en: "Revisions", ar: "المراجعات" },
  { id: "seo", icon: SeoIcon, en: "SEO", ar: "السيو" },
  { id: "scripts", icon: ScriptIcon, en: "Scripts", ar: "الأكواد" },
  { id: "robots", icon: RobotIcon, en: "Robots/Sitemap", ar: "روبوتس/سيتماップ" },
  { id: "redirects", icon: RedirectIcon, en: "Redirects", ar: "إعادة التوجيه" },
  { id: "media", icon: MediaIcon, en: "Media", ar: "الوسائط" },
  { id: "taxonomy", icon: TaxonomyIcon, en: "Taxonomy", ar: "التصنيفات" },
  { id: "header", icon: HeaderIcon, en: "Header", ar: "الترويسة" },
  { id: "footer", icon: FooterIcon, en: "Footer", ar: "التذييل" },
  { id: "homepage", icon: HomeIcon, en: "Home", ar: "الرئيسية" },
  { id: "about", icon: InfoIcon, en: "About Us", ar: "من نحن" },
  { id: "services", icon: ServicesIcon, en: "Services", ar: "الخدمات" },
  { id: "cases", icon: CasesIcon, en: "Issues", ar: "القضايا" },
  { id: "news", icon: NewsIcon, en: "News", ar: "الأخبار" },
  { id: "contact", icon: MailIcon, en: "Contact", ar: "تواصل معنا" },
  { id: "legal", icon: LegalIcon, en: "Legal", ar: "سياسات الموقع" },
  { id: "settings", icon: SettingsIcon, en: "Settings", ar: "الإعدادات" },
] as const;

export default function AdminShell({ lang }: Props) {
  const isAr = lang === "ar";
  const router = useRouter();
  const sp = useSearchParams();
  const [greet, setGreet] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupBody, setPopupBody] = useState("");
  const active = sp.get("section") || "users";
  const { setLang } = useLanguage();

  useEffect(() => {
    setLang(lang);
  }, [lang, setLang]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ok = localStorage.getItem("auth") === "true";
    if (!ok) {
      router.replace(`/${isAr ? "ar" : "en"}/login`);
      return;
    }
    if (!sessionStorage.getItem("adminGreeted")) {
      setTimeout(() => {
        setGreet(true);
        sessionStorage.setItem("adminGreeted", "1");
      }, 350);
    }
  }, [router, isAr]);

  const role = useMemo<"admin" | "editor" | "viewer">(() => {
    if (typeof window === "undefined") return "admin";
    return (localStorage.getItem("role") as any) || "admin";
  }, []);

  const changeSection = (id: string) => {
    const base = `/${isAr ? "ar" : "en"}/admin`;
    const qs = id ? `?section=${id}` : "";
    router.push(`${base}${qs}`);
  };
  const logout = () => {
    try {
      localStorage.removeItem("auth");
      localStorage.removeItem("role");
      sessionStorage.removeItem("adminGreeted");
      sessionStorage.removeItem("loginAttempts");
      sessionStorage.removeItem("loginLockUntil");
    } catch {}
    router.replace(`/${isAr ? "ar" : "en"}/login`);
  };

  const notifySaved = (kind: "settings" | "about" | "legal") => {
    if (kind === "settings") {
      setPopupTitle(isAr ? "تم حفظ الإعدادات" : "Settings Saved");
      setPopupBody(
        isAr
          ? "تم تطبيق التغييرات على الموقع بالكامل. تم تحديث الميزات المفعّلة."
          : "Changes are now applied across the entire website. Feature flags updated."
      );
    } else if (kind === "about") {
      setPopupTitle(isAr ? "تم حفظ صفحة من نحن" : "About Page Saved");
      setPopupBody(
        isAr
          ? "المحتوى أصبح محدثًا على الموقع. يُرجى معاينة التغييرات."
          : "Content is updated across the site. Please preview the changes."
      );
    } else if (kind === "legal") {
      setPopupTitle(isAr ? "تم تحديث السياسات" : "Legal Policies Updated");
      setPopupBody(
        isAr
          ? "تم نشر سياسة الخصوصية والشروط وإخلاء المسؤولية عبر الموقع."
          : "Privacy, terms, and disclaimer have been published sitewide."
      );
    }
    setPopupOpen(true);
  };

  return (
    <div className={"admin-ui min-h-screen grid grid-cols-1 md:grid-cols-[260px_1fr] bg-[var(--panel-bg)]" + (isAr ? " rtl" : "")}>
      <aside className="border-e border-[var(--panel-border)] bg-[color-mix(in_oklab,var(--brand-primary),white_6%)]">
        <div className="p-4 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full brand-gradient" />
          <div className="text-sm font-semibold text-white/90">
            {isAr ? "لوحة تحكم الإدارة" : "Admin Dashboard"}
          </div>
        </div>
        <nav className="px-2 pb-4 space-y-1">
          {sections.map((s) => {
            const Icon = s.icon;
            const activeCls = active === s.id ? "bg-[var(--brand-accent)] text-black" : "text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5";
            return (
              <button
                key={s.id}
                onClick={() => changeSection(s.id)}
                className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${activeCls}`}
              >
                <Icon className="h-4 w-4" />
                <span>{isAr ? s.ar : s.en}</span>
              </button>
            );
          })}
        </nav>
      </aside>
      <main className="p-4 md:p-6">
        <header className="flex items-center gap-3 mb-4">
          <h1 className="text-lg md:text-xl font-semibold text-white/90">
            {isAr ? "مرحبًا أيها المسؤول" : "Welcome, Administrator"}
          </h1>
          <div className="flex-1" />
          
          <button onClick={logout} className="btn-secondary">
            {isAr ? "تسجيل الخروج" : "Log out"}
          </button>
        </header>
        <SectionRenderer section={active} isAr={isAr} role={role} notifySaved={notifySaved} />
      </main>

      {greet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setGreet(false)} />
          <div className="relative z-10 w-[92%] max-w-md rounded-2xl surface p-6 md:p-8 text-center overflow-hidden">
            <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(225,188,137,0.22),transparent_60%)] blur-2xl" />
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-accent)]/15 ring-1 ring-[var(--brand-accent)]/30 text-[var(--brand-accent)]">
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                <path fill="currentColor" d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm-1 6h2v4h-2V8Zm1 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"/>
              </svg>
            </div>
            <div className="mt-3 text-2xl font-extrabold text-[var(--brand-accent)]">
              {isAr ? "أهلًا بعودتك!" : "Welcome back!"}
            </div>
            <div className="mx-auto mt-2 h-px w-24 bg-gradient-to-r from-transparent via-[var(--brand-accent)]/70 to-transparent" />
            <div className="mt-2 text-sm text-white/90">
              {isAr
                ? "تم تسجيل الدخول بنجاح. يمكنك إدارة محتوى الموقع من هنا."
                : "You are signed in. Manage site content from this dashboard."}
            </div>
            <button
              onClick={() => setGreet(false)}
              className="mt-5 inline-flex items-center rounded-lg bg-[var(--brand-accent)] text-black px-5 py-2.5 font-semibold"
            >
              {isAr ? "ابدأ" : "Get started"}
            </button>
          </div>
        </div>
      )}
      {popupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setPopupOpen(false)} />
          <div className="relative z-10 w-[92%] max-w-md rounded-2xl surface p-6 md:p-8 text-center overflow-hidden">
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-accent)]/15 ring-1 ring-[var(--brand-accent)]/30 text-[var(--brand-accent)]">
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                <path fill="currentColor" d="M9 16.2 4.8 12l1.4-1.4L9 13.4l8.8-8.8L19.2 6 9 16.2Z" />
              </svg>
            </div>
            <div className="mt-3 text-2xl font-extrabold text-[var(--brand-accent)]">{popupTitle}</div>
            <div className="mx-auto mt-2 h-px w-24 bg-gradient-to-r from-transparent via-[var(--brand-accent)]/70 to-transparent" />
            <div className="mt-2 text-sm text-white/90">{popupBody}</div>
            <button onClick={() => setPopupOpen(false)} className="mt-5 inline-flex items-center rounded-lg bg-[var(--brand-accent)] text-black px-5 py-2.5 font-semibold">
              {isAr ? "حسنًا" : "OK"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionRenderer({
  section,
  isAr,
  role,
  notifySaved,
}: {
  section: string;
  isAr: boolean;
  role: "admin" | "editor" | "viewer";
  notifySaved: (kind: "settings" | "about" | "legal") => void;
}) {
  switch (section) {
    case "users":
      return <UsersPanel isAr={isAr} role={role} />;
    case "stats":
      return <StatsPanel isAr={isAr} />;
    case "workflow":
      return <WorkflowPanel isAr={isAr} role={role} />;
    case "schedule":
      return <SchedulePanel isAr={isAr} role={role} />;
    case "revisions":
      return <RevisionsPanel isAr={isAr} role={role} />;
    case "seo":
      return <SeoPanel isAr={isAr} role={role} />;
    case "scripts":
      return <ScriptsPanel isAr={isAr} role={role} />;
    case "robots":
      return <RobotsPanel isAr={isAr} role={role} />;
    case "redirects":
      return <RedirectsPanel isAr={isAr} role={role} />;
    case "media":
      return <MediaPanel isAr={isAr} role={role} />;
    case "taxonomy":
      return <TaxonomyPanel isAr={isAr} role={role} />;
    case "colors":
      return <ColorsPanel isAr={isAr} role={role} />;
    case "header":
      return <HeaderPanel isAr={isAr} role={role} />;
    case "footer":
      return <FooterPanel isAr={isAr} role={role} />;
    case "homepage":
      return <HomepagePanel isAr={isAr} role={role} />;
    case "about":
      return <AboutPanel isAr={isAr} role={role} notifySaved={notifySaved} />;
    case "services":
      return <ServicesPanel isAr={isAr} role={role} />;
    case "cases":
      return <CasesPanel isAr={isAr} role={role} />;
    case "news":
      return <NewsPanel isAr={isAr} role={role} />;
    case "contact":
      return <ContactPanel isAr={isAr} role={role} />;
    case "legal":
      return <LegalPanel isAr={isAr} role={role} notifySaved={notifySaved} />;
    case "settings":
      return <SettingsPanel isAr={isAr} role={role} notifySaved={notifySaved} />;
    default:
      return <div className="text-[var(--text-secondary)]">{isAr ? "القسم غير موجود" : "Section not found"}</div>;
  }
}

function WorkflowPanel({ isAr, role }: { isAr: boolean; role: "admin" | "editor" | "viewer" }) {
  const canEdit = role !== "viewer";
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState("home");
  const [states, setStates] = useState<any>(null);
  const [assignedTo, setAssignedTo] = useState("");
  const [approvals, setApprovals] = useState<string[]>([]);
  const [status, setStatus] = useState<"draft" | "review" | "published">("draft");
  const load = async () => {
    const ps = await fetch("/api/admin/page-states", { cache: "no-store" }).then((r) => r.json());
    setStates(ps);
    const wf = ps?.[page]?.workflow || { status: "draft", assignedTo: "", approvals: [] };
    setStatus(wf.status); setAssignedTo(wf.assignedTo); setApprovals(wf.approvals || []);
  };
  const save = async () => {
    setSaving(true);
    try {
      const next = { ...(states || {}), [page]: { ...(states?.[page] || {}), workflow: { status, assignedTo, approvals } } };
      await fetch("/api/admin/page-states", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
    } finally { setSaving(false); }
  };
  useEffect(() => { load(); }, [page]);
  return (
    <div className="space-y-4">
      <Card title={isAr ? "إدارة سير العمل" : "Manage Workflow"}>
        <div className="grid md:grid-cols-2 gap-3">
          <select className="input" value={page} onChange={(e) => setPage(e.target.value)}>
            <option value="home">{isAr ? "الرئيسية" : "Home"}</option>
            <option value="about">{isAr ? "من نحن" : "About"}</option>
            <option value="services">{isAr ? "الخدمات" : "Services"}</option>
            <option value="cases">{isAr ? "القضايا" : "Cases"}</option>
            <option value="news">{isAr ? "الأخبار" : "News"}</option>
            <option value="header">{isAr ? "الترويسة" : "Header"}</option>
            <option value="footer">{isAr ? "التذييل" : "Footer"}</option>
          </select>
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value as any)}>
            <option value="draft">{isAr ? "مسودة" : "Draft"}</option>
            <option value="review">{isAr ? "مراجعة" : "Review"}</option>
            <option value="published">{isAr ? "منشور" : "Published"}</option>
          </select>
          <input className="input" placeholder={isAr ? "مكلّف بالمراجعة" : "Assigned Reviewer"} value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} />
          <input className="input" placeholder={isAr ? "الموافقات (أسماء مفصولة بفواصل)" : "Approvals (comma-separated names)"} value={approvals.join(",")} onChange={(e) => setApprovals(e.target.value.split(",").map((x) => x.trim()).filter(Boolean))} />
        </div>
        <div className="mt-2">
          <button className="btn-primary" onClick={save} disabled={!canEdit || saving}>{isAr ? "حفظ" : "Save"}</button>
        </div>
      </Card>
    </div>
  );
}

function SchedulePanel({ isAr, role }: { isAr: boolean; role: "admin" | "editor" | "viewer" }) {
  const canEdit = role !== "viewer";
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState("news");
  const [states, setStates] = useState<any>(null);
  const [publishAt, setPublishAt] = useState<string>("");
  const [unpublishAt, setUnpublishAt] = useState<string>("");
  const load = async () => {
    const ps = await fetch("/api/admin/page-states", { cache: "no-store" }).then((r) => r.json());
    setStates(ps);
    const sch = ps?.[page]?.schedule || { publishAt: 0, unpublishAt: 0 };
    setPublishAt(sch.publishAt ? new Date(sch.publishAt).toISOString().slice(0, 16) : "");
    setUnpublishAt(sch.unpublishAt ? new Date(sch.unpublishAt).toISOString().slice(0, 16) : "");
  };
  const save = async () => {
    setSaving(true);
    try {
      const next = { ...(states || {}), [page]: { ...(states?.[page] || {}), schedule: { publishAt: publishAt ? Date.parse(publishAt) : 0, unpublishAt: unpublishAt ? Date.parse(unpublishAt) : 0 } } };
      await fetch("/api/admin/page-states", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
    } finally { setSaving(false); }
  };
  useEffect(() => { load(); }, [page]);
  return (
    <div className="space-y-4">
      <Card title={isAr ? "جدولة النشر/الإلغاء" : "Publish/Unpublish Scheduling"}>
        <div className="grid md:grid-cols-2 gap-3">
          <select className="input" value={page} onChange={(e) => setPage(e.target.value)}>
            <option value="home">{isAr ? "الرئيسية" : "Home"}</option>
            <option value="about">{isAr ? "من نحن" : "About"}</option>
            <option value="services">{isAr ? "الخدمات" : "Services"}</option>
            <option value="cases">{isAr ? "القضايا" : "Cases"}</option>
            <option value="news">{isAr ? "الأخبار" : "News"}</option>
          </select>
          <input className="input" type="datetime-local" value={publishAt} onChange={(e) => setPublishAt(e.target.value)} />
          <input className="input" type="datetime-local" value={unpublishAt} onChange={(e) => setUnpublishAt(e.target.value)} />
        </div>
        <div className="mt-2">
          <button className="btn-primary" onClick={save} disabled={!canEdit || saving}>{isAr ? "حفظ" : "Save"}</button>
        </div>
      </Card>
    </div>
  );
}

function RevisionsPanel({ isAr, role }: { isAr: boolean; role: "admin" | "editor" | "viewer" }) {
  const canEdit = role !== "viewer";
  const [states, setStates] = useState<any>(null);
  const [diffA, setDiffA] = useState(""); const [diffB, setDiffB] = useState("");
  const load = async () => {
    const ps = await fetch("/api/admin/page-states", { cache: "no-store" }).then((r) => r.json());
    setStates(ps);
  };
  const restoreHeader = async (r: any) => {
    await fetch("/api/admin/header", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ siteName_en: r.siteName_en ?? "", siteName_ar: r.siteName_ar ?? "", logo: r.logo ?? "", published_siteName_en: r.siteName_en ?? "", published_siteName_ar: r.siteName_ar ?? "", published_logo: r.logo ?? "" }) });
  };
  const restoreFooter = async (r: any) => {
    await fetch("/api/admin/footer", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ siteName_en: r.siteName_en ?? "", siteName_ar: r.siteName_ar ?? "", logo: r.logo ?? "", published_siteName_en: r.siteName_en ?? "", published_siteName_ar: r.siteName_ar ?? "", published_logo: r.logo ?? "" }) });
  };
  const restoreService = async (r: any) => {
    if (r?.payload?.id) {
      await fetch("/api/admin/services", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(r.payload) });
    } else if (r?.payload) {
      await fetch("/api/admin/services", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(r.payload) });
    }
  };
  const restoreNews = async (r: any) => {
    if (r?.payload?.id) {
      await fetch("/api/admin/news", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(r.payload) });
    } else if (r?.payload) {
      await fetch("/api/admin/news", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(r.payload) });
    }
  };
  useEffect(() => { load(); }, []);
  const makeDiff = (a: string, b: string) => {
    const al = a.split("\n"); const bl = b.split("\n");
    const max = Math.max(al.length, bl.length);
    const out: string[] = [];
    for (let i = 0; i < max; i++) {
      const L = al[i] ?? ""; const R = bl[i] ?? "";
      if (L === R) out.push(`  ${L}`);
      else { if (L) out.push(`- ${L}`); if (R) out.push(`+ ${R}`); }
    }
    return out.join("\n");
  };
  return (
    <div className="space-y-4">
      <Card title={isAr ? "سجل المراجعات (الترويسة)" : "Revision History (Header)"}>
        <div className="space-y-2">
          {Array.isArray(states?.header?.revisions) && states.header.revisions.length > 0 ? states.header.revisions.slice().reverse().map((r: any, i: number) => (
            <div key={i} className="flex items-center gap-3">
              <div className="text-xs text-white/90">{new Date(r.at).toLocaleString()}</div>
              <div className="flex-1" />
              <button className="btn-secondary" onClick={() => restoreHeader(r)} disabled={!canEdit}>{isAr ? "استعادة" : "Restore"}</button>
            </div>
          )) : <div className="text-sm text-[var(--text-secondary)]">{isAr ? "لا توجد مراجعات." : "No revisions."}</div>}
        </div>
      </Card>
      <Card title={isAr ? "سجل المراجعات (التذييل)" : "Revision History (Footer)"}>
        <div className="space-y-2">
          {Array.isArray(states?.footer?.revisions) && states.footer.revisions.length > 0 ? states.footer.revisions.slice().reverse().map((r: any, i: number) => (
            <div key={i} className="flex items-center gap-3">
              <div className="text-xs text-white/90">{new Date(r.at).toLocaleString()}</div>
              <div className="flex-1" />
              <button className="btn-secondary" onClick={() => restoreFooter(r)} disabled={!canEdit}>{isAr ? "استعادة" : "Restore"}</button>
            </div>
          )) : <div className="text-sm text-[var(--text-secondary)]">{isAr ? "لا توجد مراجعات." : "No revisions."}</div>}
        </div>
      </Card>
      <Card title={isAr ? "سجل المراجعات (الخدمات)" : "Revision History (Services)"}>
        <div className="space-y-2">
          {Array.isArray(states?.services?.revisions) && states.services.revisions.length > 0 ? states.services.revisions.slice().reverse().map((r: any, i: number) => (
            <div key={i} className="flex items-center gap-3">
              <div className="text-xs text-white/90">{new Date(r.at).toLocaleString()}</div>
              <div className="flex-1" />
              <button className="btn-secondary" onClick={() => restoreService(r)} disabled={!canEdit}>{isAr ? "استعادة" : "Restore"}</button>
            </div>
          )) : <div className="text-sm text-[var(--text-secondary)]">{isAr ? "لا توجد مراجعات." : "No revisions."}</div>}
        </div>
      </Card>
      <Card title={isAr ? "سجل المراجعات (الأخبار)" : "Revision History (News)"}>
        <div className="space-y-2">
          {Array.isArray(states?.news?.revisions) && states.news.revisions.length > 0 ? states.news.revisions.slice().reverse().map((r: any, i: number) => (
            <div key={i} className="flex items-center gap-3">
              <div className="text-xs text-white/90">{new Date(r.at).toLocaleString()}</div>
              <div className="flex-1" />
              <button className="btn-secondary" onClick={() => restoreNews(r)} disabled={!canEdit}>{isAr ? "استعادة" : "Restore"}</button>
            </div>
          )) : <div className="text-sm text-[var(--text-secondary)]">{isAr ? "لا توجد مراجعات." : "No revisions."}</div>}
        </div>
      </Card>
      <Card title={isAr ? "عارض الفروقات" : "Diff Viewer"}>
        <div className="grid md:grid-cols-2 gap-3">
          <textarea className="input h-40" placeholder={isAr ? "النص أ" : "Text A"} value={diffA} onChange={(e) => setDiffA(e.target.value)} />
          <textarea className="input h-40" placeholder={isAr ? "النص ب" : "Text B"} value={diffB} onChange={(e) => setDiffB(e.target.value)} />
        </div>
        <pre className="mt-2 text-xs whitespace-pre-wrap rounded-lg border border-[var(--panel-border)] bg-white/5 p-3">{makeDiff(diffA, diffB)}</pre>
      </Card>
    </div>
  );
}

function TaxonomyPanel({ isAr, role }: { isAr: boolean; role: "admin" | "editor" | "viewer" }) {
  const canEdit = role !== "viewer";
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tax, setTax] = useState<any>(null);
  const [newTag, setNewTag] = useState("");
  const [newCatNews, setNewCatNews] = useState("");
  const [newCatCases, setNewCatCases] = useState("");
  const load = async () => {
    setLoading(true);
    const t = await fetch("/api/admin/taxonomy", { cache: "no-store" }).then((r) => r.json());
    setTax(t || { tags: [], categories: { news: [], cases: [] } });
    setLoading(false);
  };
  const save = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/taxonomy", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(tax) });
    } finally { setSaving(false); }
  };
  const addTag = () => setTax({ ...tax, tags: [...(tax.tags || []), newTag] }) as any;
  const addCatNews = () => setTax({ ...tax, categories: { ...(tax.categories || {}), news: [...(tax.categories?.news || []), newCatNews] } }) as any;
  const addCatCases = () => setTax({ ...tax, categories: { ...(tax.categories || {}), cases: [...(tax.categories?.cases || []), newCatCases] } }) as any;
  useEffect(() => { load(); }, []);
  return (
    <div className="space-y-4">
      <Card title={isAr ? "إدارة التصنيفات" : "Manage Taxonomy"}>
        {loading ? <div className="text-[var(--text-secondary)]">{isAr ? "جارِ التحميل..." : "Loading..."}</div> : (
          <div className="space-y-3">
            <div className="grid md:grid-cols-3 gap-3">
              <input className="input" placeholder={isAr ? "وسم جديد" : "New Tag"} value={newTag} onChange={(e) => setNewTag(e.target.value)} />
              <button className="btn-secondary" onClick={addTag} disabled={!canEdit || !newTag.trim()}>{isAr ? "إضافة وسم" : "Add Tag"}</button>
              <div />
              <input className="input" placeholder={isAr ? "تصنيف أخبار جديد" : "New News Category"} value={newCatNews} onChange={(e) => setNewCatNews(e.target.value)} />
              <button className="btn-secondary" onClick={addCatNews} disabled={!canEdit || !newCatNews.trim()}>{isAr ? "إضافة تصنيف أخبار" : "Add News Category"}</button>
              <div />
              <input className="input" placeholder={isAr ? "تصنيف قضايا جديد" : "New Cases Category"} value={newCatCases} onChange={(e) => setNewCatCases(e.target.value)} />
              <button className="btn-secondary" onClick={addCatCases} disabled={!canEdit || !newCatCases.trim()}>{isAr ? "إضافة تصنيف قضايا" : "Add Cases Category"}</button>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <div className="text-xs text-white/70">{isAr ? "الوسوم" : "Tags"}</div>
                <div className="mt-2 space-y-1">{(tax.tags || []).map((t: string, i: number) => (<div key={i} className="text-xs text-white/90">{t}</div>))}</div>
              </div>
              <div>
                <div className="text-xs text-white/70">{isAr ? "تصنيفات الأخبار" : "News Categories"}</div>
                <div className="mt-2 space-y-1">{(tax.categories?.news || []).map((t: string, i: number) => (<div key={i} className="text-xs text-white/90">{t}</div>))}</div>
              </div>
              <div>
                <div className="text-xs text-white/70">{isAr ? "تصنيفات القضايا" : "Cases Categories"}</div>
                <div className="mt-2 space-y-1">{(tax.categories?.cases || []).map((t: string, i: number) => (<div key={i} className="text-xs text-white/90">{t}</div>))}</div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-1" />
              <button className="btn-primary" onClick={save} disabled={!canEdit || saving}>{isAr ? "حفظ" : "Save"}</button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function SeoPanel({ isAr, role }: { isAr: boolean; role: "admin" | "editor" | "viewer" }) {
  const canEdit = role !== "viewer";
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [defaults, setDefaults] = useState<any>(null);
  const [pageList, setPageList] = useState<any[]>([]);
  const [newPageSeo, setNewPageSeo] = useState<any>({ pageId: "home", title_en: "", title_ar: "", description_en: "", description_ar: "", keywords_en: "", keywords_ar: "", canonical: "", og_image: "", index: true, follow: true });
  const load = async () => {
    setLoading(true);
    const d = await fetch("/api/admin/seo", { cache: "no-store" }).then((r) => r.json());
    setDefaults(d?.defaults || { title_en: "", title_ar: "", description_en: "", description_ar: "", keywords_en: "", keywords_ar: "", canonical: "", og_image: "", index: true, follow: true });
    const pages = await fetch("/api/admin/seo-pages", { cache: "no-store" }).then((r) => r.json());
    setPageList(Array.isArray(pages) ? pages : []);
    setLoading(false);
  };
  const saveDefaults = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/seo", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ defaults }) });
    } finally {
      setSaving(false);
    }
  };
  const addPageSeo = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/seo-pages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newPageSeo) });
      await load();
      setNewPageSeo({ pageId: "home", title_en: "", title_ar: "", description_en: "", description_ar: "", keywords_en: "", keywords_ar: "", canonical: "", og_image: "", index: true, follow: true });
    } finally {
      setSaving(false);
    }
  };
  const delPageSeo = async (id: string) => {
    setSaving(true);
    try {
      await fetch(`/api/admin/seo-pages?id=${id}`, { method: "DELETE" });
      await load();
    } finally {
      setSaving(false);
    }
  };
  useEffect(() => { load(); }, []);
  return (
    <div className="space-y-4">
      <Card title={isAr ? "إعدادات السيو الافتراضية" : "Default SEO Settings"}>
        {loading ? <div className="text-[var(--text-secondary)]">{isAr ? "جارِ التحميل..." : "Loading..."}</div> : (
          <div className="space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <input className="input" placeholder={isAr ? "العنوان (EN)" : "Title (EN)"} value={defaults.title_en} onChange={(e) => setDefaults({ ...defaults, title_en: e.target.value })} />
              <input className="input" placeholder={isAr ? "العنوان (AR)" : "Title (AR)"} value={defaults.title_ar} onChange={(e) => setDefaults({ ...defaults, title_ar: e.target.value })} />
              <input className="input" placeholder={isAr ? "الوصف (EN)" : "Description (EN)"} value={defaults.description_en} onChange={(e) => setDefaults({ ...defaults, description_en: e.target.value })} />
              <input className="input" placeholder={isAr ? "الوصف (AR)" : "Description (AR)"} value={defaults.description_ar} onChange={(e) => setDefaults({ ...defaults, description_ar: e.target.value })} />
              <input className="input" placeholder={isAr ? "الكلمات المفتاحية (EN)" : "Keywords (EN)"} value={defaults.keywords_en} onChange={(e) => setDefaults({ ...defaults, keywords_en: e.target.value })} />
              <input className="input" placeholder={isAr ? "الكلمات المفتاحية (AR)" : "Keywords (AR)"} value={defaults.keywords_ar} onChange={(e) => setDefaults({ ...defaults, keywords_ar: e.target.value })} />
              <input className="input" placeholder={isAr ? "Canonical" : "Canonical"} value={defaults.canonical} onChange={(e) => setDefaults({ ...defaults, canonical: e.target.value })} />
              <input className="input" placeholder={isAr ? "صورة OG" : "OG Image"} value={defaults.og_image} onChange={(e) => setDefaults({ ...defaults, og_image: e.target.value })} />
            </div>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 text-sm text-white/90"><input type="checkbox" checked={!!defaults.index} onChange={(e) => setDefaults({ ...defaults, index: e.target.checked })} />{isAr ? "الفهرسة" : "Index"}</label>
              <label className="inline-flex items-center gap-2 text-sm text-white/90"><input type="checkbox" checked={!!defaults.follow} onChange={(e) => setDefaults({ ...defaults, follow: e.target.checked })} />{isAr ? "تتبع الروابط" : "Follow"}</label>
              <div className="flex-1" />
              <button className="btn-primary" onClick={saveDefaults} disabled={!canEdit || saving}>{isAr ? "حفظ" : "Save"}</button>
            </div>
          </div>
        )}
      </Card>
      <Card title={isAr ? "سيو الصفحات" : "Page SEO Overrides"}>
        <div className="grid md:grid-cols-3 gap-3">
          <select className="input" value={newPageSeo.pageId} onChange={(e) => setNewPageSeo({ ...newPageSeo, pageId: e.target.value })}>
            <option value="home">{isAr ? "الرئيسية" : "Home"}</option>
            <option value="about">{isAr ? "من نحن" : "About"}</option>
            <option value="services">{isAr ? "الخدمات" : "Services"}</option>
            <option value="cases">{isAr ? "القضايا" : "Cases"}</option>
            <option value="news">{isAr ? "الأخبار" : "News"}</option>
            <option value="contact">{isAr ? "تواصل" : "Contact"}</option>
          </select>
          <input className="input" placeholder={isAr ? "العنوان (EN)" : "Title (EN)"} value={newPageSeo.title_en} onChange={(e) => setNewPageSeo({ ...newPageSeo, title_en: e.target.value })} />
          <input className="input" placeholder={isAr ? "العنوان (AR)" : "Title (AR)"} value={newPageSeo.title_ar} onChange={(e) => setNewPageSeo({ ...newPageSeo, title_ar: e.target.value })} />
          <input className="input" placeholder={isAr ? "الوصف (EN)" : "Description (EN)"} value={newPageSeo.description_en} onChange={(e) => setNewPageSeo({ ...newPageSeo, description_en: e.target.value })} />
          <input className="input" placeholder={isAr ? "الوصف (AR)" : "Description (AR)"} value={newPageSeo.description_ar} onChange={(e) => setNewPageSeo({ ...newPageSeo, description_ar: e.target.value })} />
          <input className="input" placeholder={isAr ? "الكلمات المفتاحية (EN)" : "Keywords (EN)"} value={newPageSeo.keywords_en} onChange={(e) => setNewPageSeo({ ...newPageSeo, keywords_en: e.target.value })} />
          <input className="input" placeholder={isAr ? "الكلمات المفتاحية (AR)" : "Keywords (AR)"} value={newPageSeo.keywords_ar} onChange={(e) => setNewPageSeo({ ...newPageSeo, keywords_ar: e.target.value })} />
          <input className="input" placeholder="Canonical" value={newPageSeo.canonical} onChange={(e) => setNewPageSeo({ ...newPageSeo, canonical: e.target.value })} />
          <input className="input" placeholder={isAr ? "صورة OG" : "OG Image"} value={newPageSeo.og_image} onChange={(e) => setNewPageSeo({ ...newPageSeo, og_image: e.target.value })} />
          <label className="inline-flex items-center gap-2 text-sm text-white/90"><input type="checkbox" checked={!!newPageSeo.index} onChange={(e) => setNewPageSeo({ ...newPageSeo, index: e.target.checked })} />{isAr ? "الفهرسة" : "Index"}</label>
          <label className="inline-flex items-center gap-2 text-sm text-white/90"><input type="checkbox" checked={!!newPageSeo.follow} onChange={(e) => setNewPageSeo({ ...newPageSeo, follow: e.target.checked })} />{isAr ? "تتبع الروابط" : "Follow"}</label>
        </div>
        <div className="mt-2">
          <button className="btn-primary" onClick={addPageSeo} disabled={!canEdit || saving}>{isAr ? "إضافة" : "Add"}</button>
        </div>
        <div className="mt-3 space-y-2">
          {pageList.length === 0 ? <div className="text-sm text-[var(--text-secondary)]">{isAr ? "لا توجد عناصر." : "No items."}</div> : pageList.map((p) => (
            <div key={p.id} className="flex items-center gap-3">
              <div className="text-sm text-white/90">{p.pageId}</div>
              <div className="flex-1" />
              <button className="btn-secondary" onClick={() => delPageSeo(p.id)} disabled={!canEdit || saving}>{isAr ? "حذف" : "Delete"}</button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ScriptsPanel({ isAr, role }: { isAr: boolean; role: "admin" | "editor" | "viewer" }) {
  const canEdit = role === "admin";
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [scripts, setScripts] = useState<any>(null);
  const load = async () => {
    setLoading(true);
    const d = await fetch("/api/admin/scripts", { cache: "no-store" }).then((r) => r.json());
    setScripts(d || { analyticsProvider: "", gtagId: "", customHead: "", customBody: "", consentRequired: false });
    setLoading(false);
  };
  const save = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/scripts", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(scripts) });
    } finally {
      setSaving(false);
    }
  };
  useEffect(() => { load(); }, []);
  return (
    <div className="space-y-4">
      <Card title={isAr ? "تحليلات وأكواد" : "Analytics & Custom Scripts"}>
        {loading ? <div className="text-[var(--text-secondary)]">{isAr ? "جارِ التحميل..." : "Loading..."}</div> : (
          <div className="space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <input className="input" placeholder={isAr ? "مزود التحليلات" : "Analytics Provider"} value={scripts.analyticsProvider} onChange={(e) => setScripts({ ...scripts, analyticsProvider: e.target.value })} />
              <input className="input" placeholder={isAr ? "معرّف Google Tag" : "Google Tag ID"} value={scripts.gtagId} onChange={(e) => setScripts({ ...scripts, gtagId: e.target.value })} />
            </div>
            <textarea className="input h-32" placeholder={isAr ? "Head Code" : "Head Code"} value={scripts.customHead} onChange={(e) => setScripts({ ...scripts, customHead: e.target.value })} />
            <textarea className="input h-32" placeholder={isAr ? "Body Code" : "Body Code"} value={scripts.customBody} onChange={(e) => setScripts({ ...scripts, customBody: e.target.value })} />
            <label className="inline-flex items-center gap-2 text-sm text-white/90"><input type="checkbox" checked={!!scripts.consentRequired} onChange={(e) => setScripts({ ...scripts, consentRequired: e.target.checked })} />{isAr ? "يتطلب موافقة ملفات تعريف الارتباط" : "Requires cookie consent"}</label>
            <div className="flex items-center">
              <div className="flex-1" />
              <button className="btn-primary" onClick={save} disabled={!canEdit || saving}>{isAr ? "حفظ" : "Save"}</button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function RobotsPanel({ isAr, role }: { isAr: boolean; role: "admin" | "editor" | "viewer" }) {
  const canEdit = role === "admin";
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [robots, setRobots] = useState<any>(null);
  const [sitemap, setSitemap] = useState<any>(null);
  const load = async () => {
    setLoading(true);
    const r = await fetch("/api/admin/robots", { cache: "no-store" }).then((x) => x.json());
    setRobots(r || { text: "User-agent: *\nAllow: /\n", indexSite: true });
    const s = await fetch("/api/admin/sitemap", { cache: "no-store" }).then((x) => x.json());
    setSitemap(s || { extraUrls: [] });
    setLoading(false);
  };
  const save = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/robots", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(robots) });
      await fetch("/api/admin/sitemap", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(sitemap) });
    } finally {
      setSaving(false);
    }
  };
  useEffect(() => { load(); }, []);
  return (
    <div className="space-y-4">
      <Card title={isAr ? "Robots.txt" : "Robots.txt"}>
        {loading ? <div className="text-[var(--text-secondary)]">{isAr ? "جارِ التحميل..." : "Loading..."}</div> : (
          <div className="space-y-3">
            <textarea className="input h-40" value={robots.text} onChange={(e) => setRobots({ ...robots, text: e.target.value })} />
            <label className="inline-flex items-center gap-2 text-sm text-white/90"><input type="checkbox" checked={!!robots.indexSite} onChange={(e) => setRobots({ ...robots, indexSite: e.target.checked })} />{isAr ? "السماح بفهرسة الموقع" : "Allow site indexing"}</label>
          </div>
        )}
      </Card>
      <Card title={isAr ? "خريطة الموقع" : "Sitemap"}>
        <div className="space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <input className="input" placeholder={isAr ? "إضافة رابط" : "Add URL"} value={""} onChange={() => {}} />
          </div>
          <div className="space-y-2">
            {Array.isArray(sitemap?.extraUrls) && sitemap.extraUrls.length > 0 ? sitemap.extraUrls.map((u: string, i: number) => (
              <div key={i} className="flex items-center gap-3">
                <div className="text-sm text-white/90">{u}</div>
              </div>
            )) : <div className="text-sm text-[var(--text-secondary)]">{isAr ? "لا توجد عناوين." : "No URLs."}</div>}
          </div>
          <div className="flex items-center">
            <div className="flex-1" />
            <button className="btn-primary" onClick={save} disabled={!canEdit || saving}>{isAr ? "حفظ" : "Save"}</button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function RedirectsPanel({ isAr, role }: { isAr: boolean; role: "admin" | "editor" | "viewer" }) {
  const canEdit = role === "admin";
  const [list, setList] = useState<any[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [type, setType] = useState<"301" | "302">("301");
  const load = async () => {
    const res = await fetch("/api/admin/redirects", { cache: "no-store" });
    setList(await res.json());
  };
  const add = async () => {
    const res = await fetch("/api/admin/redirects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ from, to, type }) });
    if (res.ok) {
      setFrom(""); setTo(""); setType("301");
      load();
    }
  };
  const del = async (id: string) => {
    const res = await fetch(`/api/admin/redirects?id=${id}`, { method: "DELETE" });
    if (res.ok) load();
  };
  useEffect(() => { load(); }, []);
  return (
    <div className="space-y-4">
      <Card title={isAr ? "إضافة إعادة توجيه" : "Add Redirect"}>
        <div className="grid md:grid-cols-3 gap-3">
          <input className="input" placeholder={isAr ? "من" : "From"} value={from} onChange={(e) => setFrom(e.target.value)} />
          <input className="input" placeholder={isAr ? "إلى" : "To"} value={to} onChange={(e) => setTo(e.target.value)} />
          <select className="input" value={type} onChange={(e) => setType(e.target.value as any)}>
            <option value="301">301</option>
            <option value="302">302</option>
          </select>
        </div>
        <div className="mt-2">
          <button className="btn-primary" onClick={add} disabled={!canEdit}>{isAr ? "إضافة" : "Add"}</button>
        </div>
      </Card>
      <Card title={isAr ? "إعادة التوجيهات" : "Redirect Rules"}>
        {list.length === 0 ? <div className="text-sm text-[var(--text-secondary)]">{isAr ? "لا توجد عناصر." : "No items."}</div> : (
          <div className="space-y-2">
            {list.map((r) => (
              <div key={r.id} className="flex items-center gap-3">
                <div className="text-sm text-white/90">{r.type} {r.from} → {r.to}</div>
                <div className="flex-1" />
                <button className="btn-secondary" onClick={() => del(r.id)} disabled={!canEdit}>{isAr ? "حذف" : "Delete"}</button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function MediaPanel({ isAr, role }: { isAr: boolean; role: "admin" | "editor" | "viewer" }) {
  const canEdit = role !== "viewer";
  const [list, setList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const load = async () => {
    const res = await fetch("/api/admin/media", { cache: "no-store" });
    const data = await res.json();
    setList(Array.isArray(data) ? data : []);
  };
  const del = async (id: string) => {
    const res = await fetch(`/api/admin/media?id=${id}`, { method: "DELETE" });
    if (res.ok) load();
  };
  const upload = async () => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const form = new FormData();
      Array.from(files).forEach((f) => form.append("files", f));
      const upRes = await fetch("/api/upload", { method: "POST", body: form });
      const { urls } = await upRes.json();
      for (const url of urls) {
        await fetch("/api/admin/media", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
      }
      await load();
    } finally {
      setUploading(false);
      setFiles(null);
    }
  };
  useEffect(() => { load(); }, []);
  return (
    <div className="space-y-4">
      <Card title={isAr ? "رفع ملفات" : "Upload Files"}>
        <div className="flex items-center gap-3">
          <input type="file" multiple onChange={(e) => setFiles(e.target.files)} className="input" />
          <button className="btn-primary" onClick={upload} disabled={!canEdit || uploading}>{isAr ? "رفع" : "Upload"}</button>
        </div>
      </Card>
      <Card title={isAr ? "مكتبة الوسائط" : "Media Library"}>
        {list.length === 0 ? <div className="text-sm text-[var(--text-secondary)]">{isAr ? "لا توجد ملفات." : "No files."}</div> : (
          <div className="space-y-2">
            {list.map((m) => (
              <div key={m.id} className="flex items-center gap-3">
                <div className="text-xs text-white/90">{m.url}</div>
                <div className="flex-1" />
                <button className="btn-secondary" onClick={() => del(m.id)} disabled={!canEdit}>{isAr ? "حذف" : "Delete"}</button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function ColorsPanel({ isAr, role }: { isAr: boolean; role: "admin" | "editor" | "viewer" }) {
  const canEdit = role !== "viewer";
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [theme, setTheme] = useState<{ colors: { primary: string; secondary: string } } | null>(null);
  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/theme", { cache: "no-store" });
    const d = await res.json();
    setTheme({ colors: d?.colors || { primary: "#0F1E2E", secondary: "#E1BC89" } });
    setLoading(false);
  };
  const save = async () => {
    if (!theme) return;
    setSaving(true);
    const res = await fetch("/api/admin/theme", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ colors: theme.colors }),
    });
    if (res.ok) load();
    setSaving(false);
  };
  useEffect(() => { load(); }, []);
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white/90">{isAr ? "لوحة الألوان" : "Color Palette"}</h2>
      <Card title={isAr ? "الألوان الرئيسية" : "Primary & Secondary"}>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-[var(--text-secondary)]">{isAr ? "اللون الأساسي" : "Primary color"}</label>
            <input type="color" className="input h-10 p-1" value={theme?.colors.primary || "#0F1E2E"} onChange={(e) => setTheme((t) => t ? { colors: { ...t.colors, primary: e.target.value } } : t)} disabled={!canEdit} />
            <div className="mt-1 text-xs text-[var(--text-secondary)]">{isAr ? "يستخدم للعناوين والقوائم والروابط." : "Used for menus, links, section headings, highlights."}</div>
          </div>
          <div>
            <label className="text-xs text-[var(--text-secondary)]">{isAr ? "اللون الثانوي" : "Secondary color"}</label>
            <input type="color" className="input h-10 p-1" value={theme?.colors.secondary || "#E1BC89"} onChange={(e) => setTheme((t) => t ? { colors: { ...t.colors, secondary: e.target.value } } : t)} disabled={!canEdit} />
            <div className="mt-1 text-xs text-[var(--text-secondary)]">{isAr ? "يستخدم للأزرار والأيقونات والتأثيرات." : "Used for buttons, icons, logos, hover effects, accents."}</div>
          </div>
        </div>
        <div className="mt-3 text-xs text-[var(--text-secondary)]">{isAr ? "التغييرات تُطبَّق عالميًا وتظهر مباشرة في المعاينة." : "Changes apply globally and update live preview."}</div>
      </Card>
      <div className="pt-2 flex items-center gap-3">
        <button onClick={save} disabled={!canEdit || saving} className="btn-primary">{saving ? (isAr ? "جارٍ الحفظ..." : "Saving...") : (isAr ? "حفظ" : "Save")}</button>
        <button onClick={load} disabled={loading} className="btn-secondary">{isAr ? "إعادة التحميل" : "Reload"}</button>
      </div>
    </div>
  );
}

function UsersPanel({ isAr, role }: { isAr: boolean; role: "admin" | "editor" | "viewer" }) {
  const canManage = role === "admin";
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users", { cache: "no-store" });
    const data = await res.json();
    setList(Array.isArray(data) ? data : []);
    setLoading(false);
  };
  const addUser = async () => {
    const name = prompt(isAr ? "اسم المستخدم" : "User name") || "New User";
    const email = prompt(isAr ? "البريد الإلكتروني" : "Email") || `user${Date.now()}@example.com`;
    const role = "editor";
    const res = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, role, active: true }) });
    if (res.ok) load();
  };
  const del = async (id: string) => {
    const res = await fetch(`/api/admin/users?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (res.ok) load();
  };
  useEffect(() => { load(); }, []);
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white/90">{isAr ? "إدارة المستخدمين" : "Users Management"}</h2>
      <div className="flex items-center gap-2">
        <button className="btn-primary" disabled={!canManage} onClick={addUser}>{isAr ? "إضافة مستخدم" : "Add User"}</button>
        <button className="btn-secondary" onClick={load}>{isAr ? "تحديث" : "Refresh"}</button>
      </div>
      <div className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel-bg)]">
        <div className="grid grid-cols-[2fr_2fr_1fr_80px] gap-2 p-2 text-xs text-[var(--text-secondary)]">
          <div>{isAr ? "الاسم" : "Name"}</div>
          <div>{isAr ? "البريد" : "Email"}</div>
          <div>{isAr ? "الدور" : "Role"}</div>
          <div />
        </div>
        <div className="divide-y divide-[var(--panel-border)]">
          {loading ? (
            <div className="p-3 text-sm text-[var(--text-secondary)]">{isAr ? "جاري التحميل..." : "Loading..."}</div>
          ) : list.length === 0 ? (
            <div className="p-3 text-sm text-[var(--text-secondary)]">{isAr ? "لا يوجد مستخدمون بعد." : "No users yet."}</div>
          ) : (
            list.map((u) => (
              <div className="grid grid-cols-[2fr_2fr_1fr_80px] gap-2 p-2 items-center" key={u.id}>
                <div className="text-sm text-white/90">{u.name}</div>
                <div className="text-sm text-[var(--text-secondary)]">{u.email}</div>
                <div className="text-sm text-[var(--text-secondary)]">{u.role}</div>
                <div className="flex justify-end">
                  <button className="btn-secondary" onClick={() => del(u.id)} disabled={!canManage}>{isAr ? "حذف" : "Delete"}</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatsPanel({ isAr }: { isAr: boolean }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white/90">{isAr ? "الإحصائيات والتحليلات" : "Statistics & Analytics"}</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {[
          isAr ? "زيارات اليوم" : "Visits Today",
          isAr ? "زيارات الأسبوع" : "Weekly Visits",
          isAr ? "زيارات الشهر" : "Monthly Visits",
        ].map((t) => (
          <Card key={t} title={t}>
            <div className="h-24 flex items-center justify-center text-3xl font-extrabold text-white/90">—</div>
          </Card>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Card title={isAr ? "مشاهدات الصفحات" : "Page Views"}>
          <div className="h-40 rounded-lg border border-[var(--panel-border)] bg-white/5" />
        </Card>
        <Card title={isAr ? "الرسائل الواردة" : "Contact Submissions"}>
          <div className="h-40 rounded-lg border border-[var(--panel-border)] bg-white/5" />
        </Card>
      </div>
      <button className="btn-secondary">{isAr ? "تصدير التقارير" : "Export Reports"}</button>
    </div>
  );
}

function HeaderPanel({ isAr, role }: { isAr: boolean; role: "admin" | "editor" | "viewer" }) {
  const canEdit = role !== "viewer";
  const canManageState = role === "admin";
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [logo, setLogo] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [revisions, setRevisions] = useState<Array<{ at: number; siteName_en?: string; siteName_ar?: string; logo?: string; published?: boolean }>>([]);
  const [draft, setDraft] = useState<boolean>(false);
  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/header", { cache: "no-store" });
      const d = await res.json();
      setNameEn(d?.siteName_en ?? "");
      setNameAr(d?.siteName_ar ?? "");
      setLogo(d?.logo ?? "");
      const ps = await fetch("/api/admin/page-states", { cache: "no-store" }).then((r) => r.json());
      setRevisions(Array.isArray(ps?.header?.revisions) ? ps.header.revisions.reverse().slice(0, 10) : []);
      setDraft(!!ps?.header?.draft);
    } finally {
      setLoading(false);
    }
  };
  const uploadLogo = async (file: File) => {
    const fd = new FormData();
    fd.append("files", file, file.name);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    const url = Array.isArray(data?.urls) ? data.urls[0] : "";
    if (url) setLogo(url);
  };
  const saveDraft = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/header", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteName_en: nameEn, siteName_ar: nameAr, logo }),
      });
      const ps = await fetch("/api/admin/page-states", { cache: "no-store" }).then((r) => r.json());
      const revs = Array.isArray(ps?.header?.revisions) ? ps.header.revisions : [];
      const next = {
        ...ps,
        header: {
          active: true,
          draft: true,
          maintenanceMessage: ps?.header?.maintenanceMessage || "",
          revisions: [...revs, { at: Date.now(), siteName_en: nameEn, siteName_ar: nameAr, logo }],
        },
      };
      await fetch("/api/admin/page-states", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("site-header-updated", { detail: { siteName_en: nameEn, siteName_ar: nameAr, logo } }));
      }
    } finally {
      setSaving(false);
      setConfirmOpen(false);
    }
  };
  const publishNow = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/header", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteName_en: nameEn,
          siteName_ar: nameAr,
          logo,
          published_siteName_en: nameEn,
          published_siteName_ar: nameAr,
          published_logo: logo,
        }),
      });
      const ps = await fetch("/api/admin/page-states", { cache: "no-store" }).then((r) => r.json());
      const revs = Array.isArray(ps?.header?.revisions) ? ps.header.revisions : [];
      const next = {
        ...ps,
        header: {
          active: true,
          draft: false,
          maintenanceMessage: ps?.header?.maintenanceMessage || "",
          revisions: [...revs, { at: Date.now(), siteName_en: nameEn, siteName_ar: nameAr, logo, published: true }],
        },
      };
      await fetch("/api/admin/page-states", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      if (res.ok && typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("site-header-updated", { detail: { published_siteName_en: nameEn, published_siteName_ar: nameAr, published_logo: logo } }));
      }
    } finally {
      setSaving(false);
      setConfirmOpen(false);
    }
  };
  useEffect(() => { load(); }, []);
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white/90">{isAr ? "إدارة الترويسة" : "Header Management"}</h2>
      <Card title={isAr ? "اسم الموقع والشعار" : "Site Name & Logo"}>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-[var(--text-secondary)]">{isAr ? "اسم (EN)" : "Name (EN)"}</label>
            <input className="input" value={nameEn} onChange={(e) => setNameEn(e.target.value)} disabled={!canEdit} />
          </div>
          <div>
            <label className="text-xs text-[var(--text-secondary)]">{isAr ? "اسم (AR)" : "Name (AR)"}</label>
            <input className="input" value={nameAr} onChange={(e) => setNameAr(e.target.value)} disabled={!canEdit} />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-[var(--text-secondary)]">{isAr ? "الشعار" : "Logo"}</label>
            <div className="flex items-center gap-3">
              <input className="input flex-1" value={logo} onChange={(e) => setLogo(e.target.value)} disabled={!canEdit} placeholder="/uploads/logo.png" />
              <label className="btn-secondary cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadLogo(f); }} />
                {isAr ? "رفع" : "Upload"}
              </label>
            </div>
          </div>
        </div>
        <div className="pt-3 flex items-center gap-3">
          <button className="btn-primary" onClick={() => setConfirmOpen(true)} disabled={!canEdit || saving}>{saving ? (isAr ? "جارٍ الحفظ..." : "Saving...") : (isAr ? "حفظ" : "Save")}</button>
          <button className="btn-secondary" onClick={load} disabled={loading}>{isAr ? "تحديث" : "Reload"}</button>
        </div>
      </Card>
      <Card title={isAr ? "وضع التحرير والصيانة" : "Editing & Maintenance"}>
        <div className="mt-2 flex items-center gap-3">
          <button
            className="btn-secondary"
            onClick={async () => {
              try {
                const ps = await fetch("/api/admin/page-states", { cache: "no-store" }).then((r) => r.json());
                const next = { ...ps, header: { ...(ps?.header || {}), active: false, draft: true } };
                await fetch("/api/admin/page-states", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
              } catch {}
              const base = typeof window !== "undefined" ? window.location.origin : "";
              const url = `${base}/${isAr ? "ar" : "en"}/editor/header?editor=1`;
              window.open(url, "_blank", "noopener,noreferrer");
            }}
          >
            {isAr ? "تعطيل وفتح المحرر" : "Deactivate & Open Editor"}
          </button>
          <button
            className="btn-secondary"
            onClick={async () => {
              try {
                const ps = await fetch("/api/admin/page-states", { cache: "no-store" }).then((r) => r.json());
                const next = { ...ps, header: { ...(ps?.header || {}), active: true, draft: false } };
                await fetch("/api/admin/page-states", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
              } catch {}
            }}
          >
            {isAr ? "تفعيل الترويسة" : "Reactivate Header"}
          </button>
        </div>
      </Card>
      <Card title={isAr ? "القائمة الرئيسية" : "Navigation Menu"}>
        <p className="text-sm text-white/80">{isAr ? "تحرير التسميات وإعادة الترتيب وتفعيل/تعطيل." : "Edit labels, reorder, enable/disable."}</p>
        <div className="mt-3 h-28 rounded-lg border border-[var(--panel-border)] bg-white/5 flex items-center justify-center text-xs text-[var(--text-secondary)]">{isAr ? "قائمة افتراضية" : "Menu placeholder"}</div>
      </Card>
      <Card title={isAr ? "سجل المراجعات" : "Revision History"}>
        <div className="text-xs text-[var(--text-secondary)] mb-2">
          {isAr ? (draft ? "الحالة: مسودة" : "الحالة: منشور") : (draft ? "State: Draft" : "State: Published")}
        </div>
        {revisions.length === 0 ? (
          <div className="text-sm text-[var(--text-secondary)]">{isAr ? "لا توجد مراجعات بعد." : "No revisions yet."}</div>
        ) : (
          <div className="space-y-2">
            {revisions.map((r, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="text-xs text-white/90">
                  {new Date(r.at).toLocaleString()} — {isAr ? (r.published ? "منشور" : "مسودة") : (r.published ? "Published" : "Draft")}
                </div>
                <div className="flex-1" />
                <button
                  className="btn-secondary"
                  disabled={!canEdit || saving}
                  onClick={async () => {
                    setSaving(true);
                    try {
                      await fetch("/api/admin/header", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ siteName_en: r.siteName_en ?? "", siteName_ar: r.siteName_ar ?? "", logo: r.logo ?? "" }),
                      });
                      if (typeof window !== "undefined") {
                        window.dispatchEvent(new CustomEvent("site-header-updated", { detail: { siteName_en: r.siteName_en ?? "", siteName_ar: r.siteName_ar ?? "", logo: r.logo ?? "" } }));
                      }
                      await load();
                    } finally {
                      setSaving(false);
                    }
                  }}
                >
                  {isAr ? "استعادة كمسودة" : "Restore as draft"}
                </button>
                <button
                  className="btn-secondary"
                  disabled={!canManageState || saving}
                  onClick={async () => {
                    setSaving(true);
                    try {
                      await fetch("/api/admin/header", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          siteName_en: r.siteName_en ?? "",
                          siteName_ar: r.siteName_ar ?? "",
                          logo: r.logo ?? "",
                          published_siteName_en: r.siteName_en ?? "",
                          published_siteName_ar: r.siteName_ar ?? "",
                          published_logo: r.logo ?? "",
                        }),
                      });
                      await load();
                    } finally {
                      setSaving(false);
                    }
                  }}
                >
                  {isAr ? "نشر هذه المراجعة" : "Publish this revision"}
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmOpen(false)} />
          <div className="relative z-10 w-[92%] max-w-md rounded-2xl surface p-6 md:p-8 text-center overflow-hidden">
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-accent)]/15 ring-1 ring-[var(--brand-accent)]/30 text-[var(--brand-accent)]">
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                <path fill="currentColor" d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm-1 6h2v4h-2V8Zm1 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"/>
              </svg>
            </div>
            <div className="mt-3 text-2xl font-extrabold text-[var(--brand-accent)]">{isAr ? "تأكيد الحفظ" : "Confirm Save"}</div>
            <div className="mx-auto mt-2 h-px w-24 bg-gradient-to-r from-transparent via-[var(--brand-accent)]/70 to-transparent" />
            <div className="mt-2 text-sm text-white/90">
              {isAr ? "هل تريد النشر الآن أم الحفظ كمسودة؟" : "Do you want to publish now or save as draft?"}
            </div>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button onClick={publishNow} disabled={!canManageState || saving} className="inline-flex items-center rounded-lg bg-[var(--brand-accent)] text-black px-4 py-2 font-semibold">
                {isAr ? "تفعيل الآن" : "Reactivate now"}
              </button>
              <button onClick={saveDraft} disabled={!canEdit || saving} className="inline-flex items-center rounded-lg border border-[var(--panel-border)] px-4 py-2 font-semibold">
                {isAr ? "حفظ فقط" : "Save only"}
              </button>
              <button
                onClick={async () => {
                  try {
                    const ps = await fetch("/api/admin/page-states", { cache: "no-store" }).then((r) => r.json());
                    const next = { ...ps, header: { ...(ps?.header || {}), workflow: { ...(ps?.header?.workflow || {}), status: "review" } } };
                    await fetch("/api/admin/page-states", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
                  } catch {}
                  setConfirmOpen(false);
                }}
                disabled={!canEdit || saving}
                className="inline-flex items-center rounded-lg border border-[var(--panel-border)] px-4 py-2 font-semibold"
              >
                {isAr ? "نقل إلى المراجعة" : "Move to Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FooterPanel({ isAr, role }: { isAr: boolean; role: "admin" | "editor" | "viewer" }) {
  const canEdit = role !== "viewer";
  const canManageState = role === "admin";
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [logo, setLogo] = useState("");
  const [links, setLinks] = useState<{ label_en: string; label_ar: string; href: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [revisions, setRevisions] = useState<Array<{ at: number; siteName_en?: string; siteName_ar?: string; logo?: string; links?: any[]; published?: boolean }>>([]);
  const [draft, setDraft] = useState<boolean>(false);
  const uploadLogo = async (file: File) => {
    const fd = new FormData();
    fd.append("files", file, file.name);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    const url = Array.isArray(data?.urls) ? data.urls[0] : "";
    if (url) setLogo(url);
  };
  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/footer", { cache: "no-store" });
      const d = await res.json();
      setNameEn(d?.siteName_en ?? "");
      setNameAr(d?.siteName_ar ?? "");
      setLogo(d?.logo ?? "");
      setLinks(Array.isArray(d?.links) ? d.links : []);
      const ps = await fetch("/api/admin/page-states", { cache: "no-store" }).then((r) => r.json());
      setRevisions(Array.isArray(ps?.footer?.revisions) ? ps.footer.revisions.reverse().slice(0, 10) : []);
      setDraft(!!ps?.footer?.draft);
    } finally {
      setLoading(false);
    }
  };
  const saveDraft = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteName_en: nameEn, siteName_ar: nameAr, logo, links }),
      });
      const ps = await fetch("/api/admin/page-states", { cache: "no-store" }).then((r) => r.json());
      const revs = Array.isArray(ps?.footer?.revisions) ? ps.footer.revisions : [];
      const next = {
        ...ps,
        footer: {
          active: true,
          draft: true,
          maintenanceMessage: ps?.footer?.maintenanceMessage || "",
          revisions: [...revs, { at: Date.now(), siteName_en: nameEn, siteName_ar: nameAr, logo, links }],
        },
      };
      await fetch("/api/admin/page-states", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("site-footer-updated", { detail: { siteName_en: nameEn, siteName_ar: nameAr, logo, links } }));
      }
    } finally {
      setSaving(false);
      setConfirmOpen(false);
    }
  };
  const publishNow = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteName_en: nameEn,
          siteName_ar: nameAr,
          logo,
          links,
          published_siteName_en: nameEn,
          published_siteName_ar: nameAr,
          published_logo: logo,
        }),
      });
      const ps = await fetch("/api/admin/page-states", { cache: "no-store" }).then((r) => r.json());
      const revs = Array.isArray(ps?.footer?.revisions) ? ps.footer.revisions : [];
      const next = {
        ...ps,
        footer: {
          active: true,
          draft: false,
          maintenanceMessage: ps?.footer?.maintenanceMessage || "",
          revisions: [...revs, { at: Date.now(), siteName_en: nameEn, siteName_ar: nameAr, logo, links, published: true }],
        },
      };
      await fetch("/api/admin/page-states", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      if (res.ok && typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("site-footer-updated", { detail: { published_siteName_en: nameEn, published_siteName_ar: nameAr, published_logo: logo, links } }));
      }
    } finally {
      setSaving(false);
      setConfirmOpen(false);
    }
  };
  useEffect(() => { load(); }, []);
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white/90">{isAr ? "إدارة التذييل" : "Footer Management"}</h2>
      <Card title={isAr ? "اسم وشعار التذييل" : "Footer Name & Logo"}>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <input className="input" placeholder={isAr ? "اسم (EN)" : "Name (EN)"} value={nameEn} onChange={(e) => setNameEn(e.target.value)} disabled={!canEdit} />
          </div>
          <div>
            <input className="input" placeholder={isAr ? "اسم (AR)" : "Name (AR)"} value={nameAr} onChange={(e) => setNameAr(e.target.value)} disabled={!canEdit} />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-[var(--text-secondary)]">{isAr ? "الشعار" : "Logo"}</label>
            <div className="flex items-center gap-3">
              <input className="input flex-1" value={logo} onChange={(e) => setLogo(e.target.value)} disabled={!canEdit} placeholder="/uploads/footer-logo.png" />
              <label className="btn-secondary cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadLogo(f); }} />
                {isAr ? "رفع" : "Upload"}
              </label>
            </div>
          </div>
        </div>
        <div className="pt-3 flex items-center gap-3">
          <button className="btn-primary" onClick={() => setConfirmOpen(true)} disabled={!canEdit || saving}>{saving ? (isAr ? "جارٍ الحفظ..." : "Saving...") : (isAr ? "حفظ" : "Save")}</button>
          <button className="btn-secondary" onClick={load} disabled={loading}>{isAr ? "تحديث" : "Reload"}</button>
        </div>
      </Card>
      <Card title={isAr ? "وضع التحرير والصيانة" : "Editing & Maintenance"}>
        <div className="mt-2 flex items-center gap-3">
          <button
            className="btn-secondary"
            onClick={async () => {
              try {
                const ps = await fetch("/api/admin/page-states", { cache: "no-store" }).then((r) => r.json());
                const next = { ...ps, footer: { ...(ps?.footer || {}), active: false, draft: true } };
                await fetch("/api/admin/page-states", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
              } catch {}
              const base = typeof window !== "undefined" ? window.location.origin : "";
              const url = `${base}/${isAr ? "ar" : "en"}/editor/footer?editor=1`;
              window.open(url, "_blank", "noopener,noreferrer");
            }}
          >
            {isAr ? "تعطيل وفتح المحرر" : "Deactivate & Open Editor"}
          </button>
          <button
            className="btn-secondary"
            onClick={async () => {
              try {
                const ps = await fetch("/api/admin/page-states", { cache: "no-store" }).then((r) => r.json());
                const next = { ...ps, footer: { ...(ps?.footer || {}), active: true, draft: false } };
                await fetch("/api/admin/page-states", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
              } catch {}
            }}
          >
            {isAr ? "تفعيل التذييل" : "Reactivate Footer"}
          </button>
        </div>
      </Card>
      <Card title={isAr ? "روابط التذييل" : "Footer Links"}>
        <div className="space-y-2">
          {links.map((lk, idx) => (
            <div key={idx} className="grid md:grid-cols-[2fr_2fr_2fr_80px] gap-2">
              <input className="input" placeholder={isAr ? "التسمية (EN)" : "Label (EN)"} value={lk.label_en} onChange={(e) => setLinks((L) => { const c = [...L]; c[idx] = { ...c[idx], label_en: e.target.value }; return c; })} disabled={!canEdit} />
              <input className="input" placeholder={isAr ? "التسمية (AR)" : "Label (AR)"} value={lk.label_ar} onChange={(e) => setLinks((L) => { const c = [...L]; c[idx] = { ...c[idx], label_ar: e.target.value }; return c; })} disabled={!canEdit} />
              <input className="input" placeholder="https://..." value={lk.href} onChange={(e) => setLinks((L) => { const c = [...L]; c[idx] = { ...c[idx], href: e.target.value }; return c; })} disabled={!canEdit} />
              <div className="flex items-center justify-end">
                <button className="btn-secondary" onClick={() => setLinks((L) => L.filter((_, i) => i !== idx))} disabled={!canEdit}>{isAr ? "حذف" : "Delete"}</button>
              </div>
            </div>
          ))}
          <button className="btn-secondary" onClick={() => setLinks((L) => [...L, { label_en: "", label_ar: "", href: "" }])} disabled={!canEdit}>{isAr ? "إضافة رابط" : "Add Link"}</button>
        </div>
      </Card>
      <Card title={isAr ? "سجل المراجعات" : "Revision History"}>
        <div className="text-xs text-[var(--text-secondary)] mb-2">
          {isAr ? (draft ? "الحالة: مسودة" : "الحالة: منشور") : (draft ? "State: Draft" : "State: Published")}
        </div>
        {revisions.length === 0 ? (
          <div className="text-sm text-[var(--text-secondary)]">{isAr ? "لا توجد مراجعات بعد." : "No revisions yet."}</div>
        ) : (
          <div className="space-y-2">
            {revisions.map((r, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="text-xs text-white/90">
                  {new Date(r.at).toLocaleString()} — {isAr ? (r.published ? "منشور" : "مسودة") : (r.published ? "Published" : "Draft")}
                </div>
                <div className="flex-1" />
                <button
                  className="btn-secondary"
                  disabled={!canEdit || saving}
                  onClick={async () => {
                    setSaving(true);
                    try {
                      await fetch("/api/admin/footer", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ siteName_en: r.siteName_en ?? "", siteName_ar: r.siteName_ar ?? "", logo: r.logo ?? "", links: r.links ?? [] }),
                      });
                      if (typeof window !== "undefined") {
                        window.dispatchEvent(new CustomEvent("site-footer-updated", { detail: { siteName_en: r.siteName_en ?? "", siteName_ar: r.siteName_ar ?? "", logo: r.logo ?? "", links: r.links ?? [] } }));
                      }
                      await load();
                    } finally {
                      setSaving(false);
                    }
                  }}
                >
                  {isAr ? "استعادة كمسودة" : "Restore as draft"}
                </button>
                <button
                  className="btn-secondary"
                  disabled={!canManageState || saving}
                  onClick={async () => {
                    setSaving(true);
                    try {
                      await fetch("/api/admin/footer", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          siteName_en: r.siteName_en ?? "",
                          siteName_ar: r.siteName_ar ?? "",
                          logo: r.logo ?? "",
                          links: r.links ?? [],
                          published_siteName_en: r.siteName_en ?? "",
                          published_siteName_ar: r.siteName_ar ?? "",
                          published_logo: r.logo ?? "",
                        }),
                      });
                      await load();
                    } finally {
                      setSaving(false);
                    }
                  }}
                >
                  {isAr ? "نشر هذه المراجعة" : "Publish this revision"}
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmOpen(false)} />
          <div className="relative z-10 w-[92%] max-w-md rounded-2xl surface p-6 md:p-8 text-center overflow-hidden">
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-accent)]/15 ring-1 ring-[var(--brand-accent)]/30 text-[var(--brand-accent)]">
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                <path fill="currentColor" d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm-1 6h2v4h-2V8Zm1 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"/>
              </svg>
            </div>
            <div className="mt-3 text-2xl font-extrabold text-[var(--brand-accent)]">{isAr ? "تأكيد الحفظ" : "Confirm Save"}</div>
            <div className="mx-auto mt-2 h-px w-24 bg-gradient-to-r from-transparent via-[var(--brand-accent)]/70 to-transparent" />
            <div className="mt-2 text-sm text-white/90">
              {isAr ? "هل تريد النشر الآن أم الحفظ كمسودة؟" : "Do you want to publish now or save as draft?"}
            </div>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button onClick={publishNow} disabled={!canManageState || saving} className="inline-flex items-center rounded-lg bg-[var(--brand-accent)] text-black px-4 py-2 font-semibold">
                {isAr ? "تفعيل الآن" : "Reactivate now"}
              </button>
              <button onClick={saveDraft} disabled={saving} className="inline-flex items-center rounded-lg border border-[var(--panel-border)] px-4 py-2 font-semibold">
                {isAr ? "حفظ فقط" : "Save only"}
              </button>
              <button
                onClick={async () => {
                  try {
                    const ps = await fetch("/api/admin/page-states", { cache: "no-store" }).then((r) => r.json());
                    const next = { ...ps, footer: { ...(ps?.footer || {}), workflow: { ...(ps?.footer?.workflow || {}), status: "review" } } };
                    await fetch("/api/admin/page-states", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
                  } catch {}
                  setConfirmOpen(false);
                }}
                disabled={!canEdit || saving}
                className="inline-flex items-center rounded-lg border border-[var(--panel-border)] px-4 py-2 font-semibold"
              >
                {isAr ? "نقل إلى المراجعة" : "Move to Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HomepagePanel({ isAr, role }: { isAr: boolean; role: "admin" | "editor" | "viewer" }) {
  const canEdit = role !== "viewer";
  const [pageActive, setPageActive] = useState(true);
  const [msg, setMsg] = useState("");
  const [info, setInfo] = useState("");
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [activateOpen, setActivateOpen] = useState(false);
  const [tempMsg, setTempMsg] = useState("");
  const [tempMinutes, setTempMinutes] = useState<number>(30);
  const loadState = async () => {
    const res = await fetch("/api/admin/page-states", { cache: "no-store" });
    const d = await res.json();
    setPageActive(Boolean(d?.home?.active));
    setMsg(String(d?.home?.maintenanceMessage || ""));
  };
  const saveState = async (nextActive?: boolean) => {
    const res = await fetch("/api/admin/page-states", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ home: { active: typeof nextActive === "boolean" ? nextActive : pageActive, maintenanceMessage: msg } }),
    });
    if (res.ok) loadState();
  };
  useEffect(() => { loadState(); }, []);
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white/90">{isAr ? "إدارة الصفحة الرئيسية" : "Homepage Management"}</h2>
      <div className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel-bg)] p-4">
        <div className="flex items-center gap-3">
          <button
            className="btn-primary"
            onClick={async () => {
              if (pageActive) {
                setInfo(isAr ? "الصفحة نشطة حاليًا." : "The page is currently active.");
                return;
              }
              await saveState(true);
              setInfo(isAr ? "تم تفعيل الصفحة." : "Page activated.");
            }}
            disabled={!canEdit}
          >
            {isAr ? "تفعيل الصفحة" : "Activate Page"}
          </button>
          <button
            className="btn-secondary"
            onClick={async () => {
              const def = isAr
                ? "الموقع قيد الصيانة وقد تستغرق حتى 30 دقيقة. شكرًا لتفهمكم."
                : "Maintenance is underway and may take up to 30 minutes. Thank you for your patience.";
              setTempMsg(msg || def);
              setTempMinutes(30);
              setDeactivateOpen(true);
            }}
            disabled={!canEdit}
          >
            {isAr ? "تعطيل الصفحة" : "Deactivate Page"}
          </button>
          <div className="flex-1" />
          {info ? <div className="text-xs text-[var(--text-secondary)]">{info}</div> : null}
        </div>
      </div>
      <div className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel-bg)] p-4">
        <div className="text-sm font-semibold text-white/90">{isAr ? "أقسام الصفحة الرئيسية" : "Homepage Sections"}</div>
        <div className="mt-3 grid md:grid-cols-2 gap-3">
          {[
            { id: "hero", title: isAr ? "قسم البطل" : "Hero Section", Icon: StarIcon },
            { id: "trusted", title: isAr ? "جهات موثوقة" : "Trusted Clients", Icon: ShieldIcon },
            { id: "services", title: isAr ? "جزء من خدماتنا" : "Part of Our Services", Icon: ServicesIcon },
            { id: "cases", title: isAr ? "دراسة حالة" : "Case Study", Icon: CasesIcon },
            { id: "team", title: isAr ? "فريقنا القانوني" : "Our Legal Team", Icon: UsersIcon },
            { id: "news", title: isAr ? "تحديثات قانونية" : "Legal Updates", Icon: NewsIcon },
            { id: "partners", title: isAr ? "شركاؤنا" : "Partners", Icon: HandshakeIcon },
          ].map((s: any) => (
            <div key={s.id} className="rounded-lg border border-[var(--panel-border)] p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <s.Icon className="h-4 w-4 text-[var(--brand-accent)]" />
                <div className="text-sm text-white/90">{s.title}</div>
              </div>
              <button
                className="btn-secondary"
                onClick={() => {
                  const base = typeof window !== "undefined" ? window.location.origin : "";
                  const url = `${base}/${isAr ? "ar" : "en"}/editor/home?editor=1#${s.id}`;
                  window.open(url, "_blank", "noopener,noreferrer");
                }}
                disabled={!canEdit}
              >
                {isAr ? "تحرير القسم" : "Edit Section"}
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 rounded-xl border border-[var(--panel-border)] bg-[var(--panel-bg)] p-4">
        <div className="flex items-center gap-2 text-[15px] text-white/90">
          <InfoIcon className="h-5 w-5 text-[var(--brand-accent)]" />
          <span>{isAr ? "بعد الانتهاء من التحرير، اضغط حفظ وخروج من نافذة المحرر للعودة إلى لوحة التحكم ثم قم بتفعيل الصفحة." : "After editing, click Save and Exit in the editor window to return here, then activate the page."}</span>
        </div>
      </div>
      {deactivateOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeactivateOpen(false)} />
          <div className="relative z-10 w-[92%] max-w-md rounded-2xl surface p-6 md:p-8 overflow-hidden">
            <div className="text-lg font-semibold text-white/90">{isAr ? "تعطيل الصفحة" : "Deactivate Page"}</div>
            <div className="mt-3">
              <label className="text-xs text-[var(--text-secondary)]">{isAr ? "رسالة الصيانة" : "Maintenance message"}</label>
              <textarea className="input min-h-[90px]" value={tempMsg} onChange={(e) => setTempMsg(e.target.value)} />
            </div>
            <div className="mt-3">
              <label className="text-xs text-[var(--text-secondary)]">{isAr ? "المدة بالدقائق" : "Duration (minutes)"}</label>
              <input type="number" className="input" min={1} max={240} value={tempMinutes} onChange={(e) => setTempMinutes(parseInt(e.target.value || "0", 10) || 1)} />
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button className="btn-secondary" onClick={() => setDeactivateOpen(false)}>{isAr ? "إلغاء" : "Cancel"}</button>
              <button
                className="btn-primary"
                onClick={async () => {
                  const m = tempMsg && tempMsg.trim().length ? tempMsg : (isAr ? "الموقع قيد الصيانة." : "The site is under maintenance.");
                  setMsg(m);
                  await fetch("/api/admin/page-states", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ home: { active: false, draft: true, maintenanceMessage: m } }),
                  });
                  setDeactivateOpen(false);
                  loadState();
                  setInfo(isAr ? "تم تعطيل الصفحة وتفعيل وضع الصيانة." : "The Page deactivated and maintenance mode enabled");
                }}
              >
                {isAr ? "تأكيد" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {activateOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActivateOpen(false)} />
          <div className="relative z-10 w-[92%] max-w-md rounded-2xl surface p-6 md:p-8 overflow-hidden">
            <div className="text-lg font-semibold text-white/90">{isAr ? "تفعيل الصفحة" : "Activate Page"}</div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button className="btn-secondary" onClick={() => setActivateOpen(false)}>{isAr ? "إلغاء" : "Cancel"}</button>
              <button
                className="btn-primary"
                onClick={async () => {
                  await saveState(true);
                  setActivateOpen(false);
                  setInfo(isAr ? "تم تفعيل الصفحة." : "Page activated.");
                }}
              >
                {isAr ? "تأكيد" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function AboutPanel({ isAr, role, notifySaved }: { isAr: boolean; role: "admin" | "editor" | "viewer"; notifySaved: (kind: "settings" | "about" | "legal") => void }) {
  const [en, setEn] = useState<string>("");
  const [ar, setAr] = useState<string>("");
  const canEdit = role !== "viewer";
  const [pageActive, setPageActive] = useState(true);
  const [msg, setMsg] = useState("");
  const load = async () => {
    const res = await fetch("/api/admin/about", { cache: "no-store" });
    const data = await res.json();
    setEn(data?.content_en_html || "");
    setAr(data?.content_ar_html || "");
    const psRes = await fetch("/api/admin/page-states", { cache: "no-store" });
    const ps = await psRes.json();
    setPageActive(Boolean(ps?.about?.active));
    setMsg(String(ps?.about?.maintenanceMessage || ""));
  };
  const save = async () => {
    const res = await fetch("/api/admin/about", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content_en_html: en, content_ar_html: ar }) });
    if (res.ok) {
      try {
        const ps = await fetch("/api/admin/page-states", { cache: "no-store" }).then((r) => r.json());
        const revs = Array.isArray(ps?.about?.revisions) ? ps.about.revisions : [];
        const next = { ...ps, about: { ...(ps?.about || {}), revisions: [...revs, { at: Date.now(), content_en_html: en, content_ar_html: ar }] } };
        await fetch("/api/admin/page-states", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
      } catch {}
      load();
      setTimeout(() => notifySaved("about"), 1000);
    }
  };
  const saveState = async (nextActive?: boolean) => {
    const res = await fetch("/api/admin/page-states", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ about: { active: typeof nextActive === "boolean" ? nextActive : pageActive, maintenanceMessage: msg } }),
    });
    if (res.ok) load();
  };
  useEffect(() => { load(); }, []);
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white/90">{isAr ? "صفحة من نحن" : "About Us Page"}</h2>
      <Card title={isAr ? "وضع التحرير والصيانة" : "Editing & Maintenance"}>
        <div className="flex items-center gap-3">
          <label className="text-xs text-[var(--text-secondary)]">{isAr ? "حالة الصفحة:" : "Page state:"}</label>
          <select className="input" value={pageActive ? "active" : "inactive"} onChange={(e) => setPageActive(e.target.value === "active")} disabled={!canEdit}>
            <option value="active">{isAr ? "نشطة للمستخدمين" : "Active for users"}</option>
            <option value="inactive">{isAr ? "غير نشطة (صيانة)" : "Inactive (maintenance)"}</option>
          </select>
          <button className="btn-primary" onClick={() => saveState()} disabled={!canEdit}>{isAr ? "حفظ الحالة" : "Save state"}</button>
        </div>
        <div className="mt-3">
          <label className="text-xs text-[var(--text-secondary)]">{isAr ? "رسالة الصيانة" : "Maintenance message"}</label>
          <textarea className="input min-h-[90px]" value={msg} onChange={(e) => setMsg(e.target.value)} disabled={!canEdit} />
          <div className="mt-2 flex items-center gap-3">
            <button className="btn-secondary" onClick={() => { saveState(false); const base = typeof window !== "undefined" ? window.location.origin : ""; const url = `${base}/${isAr ? "ar" : "en"}/editor/about?editor=1`; window.open(url, "_blank", "noopener,noreferrer"); }} disabled={!canEdit}>{isAr ? "تعطيل وفتح المحرر" : "Deactivate & Open Editor"}</button>
            <button className="btn-secondary" onClick={() => saveState(true)} disabled={!canEdit}>{isAr ? "تفعيل الصفحة" : "Reactivate page"}</button>
          </div>
        </div>
      </Card>
      <Card title={isAr ? "المحتوى (العربية)" : "Content (Arabic)"}>
        <RichTextEditor value={ar} onChange={setAr} dir="rtl" placeholder={isAr ? "اكتب المحتوى هنا..." : "Write Arabic content..."} />
      </Card>
      <Card title={isAr ? "المحتوى (الإنجليزية)" : "Content (English)"}>
        <RichTextEditor value={en} onChange={setEn} dir="ltr" placeholder={isAr ? "اكتب المحتوى هنا..." : "Write English content..."} />
      </Card>
      <button className="btn-primary" onClick={save} disabled={!canEdit}>{isAr ? "حفظ" : "Save"}</button>
    </div>
  );
}

function ServicesPanel({ isAr, role }: { isAr: boolean; role: "admin" | "editor" | "viewer" }) {
  const canEdit = role !== "viewer";
  const [list, setList] = useState<any[]>([]);
  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [descEn, setDescEn] = useState("");
  const [descAr, setDescAr] = useState("");
  const [pageActive, setPageActive] = useState(true);
  const [msg, setMsg] = useState("");
  const load = async () => {
    const res = await fetch("/api/admin/services", { cache: "no-store" });
    setList(await res.json());
    const psRes = await fetch("/api/admin/page-states", { cache: "no-store" });
    const ps = await psRes.json();
    setPageActive(Boolean(ps?.services?.active));
    setMsg(String(ps?.services?.maintenanceMessage || ""));
  };
  const add = async () => {
    const res = await fetch("/api/admin/services", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title_en: titleEn, title_ar: titleAr, desc_en: descEn, desc_ar: descAr }) });
    if (res.ok) {
      const created = await res.json().catch(() => null);
      try {
        const ps = await fetch("/api/admin/page-states", { cache: "no-store" }).then((r) => r.json());
        const revs = Array.isArray(ps?.services?.revisions) ? ps.services.revisions : [];
        const next = { ...ps, services: { ...(ps?.services || {}), revisions: [...revs, { at: Date.now(), kind: "add", id: created?.id, payload: created }] } };
        await fetch("/api/admin/page-states", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
      } catch {}
      setTitleEn(""); setTitleAr(""); setDescEn(""); setDescAr("");
      load();
    }
  };
  const del = async (id: string) => {
    const list = await fetch("/api/admin/services", { cache: "no-store" }).then((r) => r.json()).catch(() => []);
    const existing = Array.isArray(list) ? list.find((x: any) => x.id === id) : null;
    const res = await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      try {
        const ps = await fetch("/api/admin/page-states", { cache: "no-store" }).then((r) => r.json());
        const revs = Array.isArray(ps?.services?.revisions) ? ps.services.revisions : [];
        const next = { ...ps, services: { ...(ps?.services || {}), revisions: [...revs, { at: Date.now(), kind: "delete", id, payload: existing }] } };
        await fetch("/api/admin/page-states", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
      } catch {}
      load();
    }
  };
  const saveState = async (nextActive?: boolean) => {
    const res = await fetch("/api/admin/page-states", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ services: { active: typeof nextActive === "boolean" ? nextActive : pageActive, maintenanceMessage: msg } }),
    });
    if (res.ok) load();
  };
  useEffect(() => { load(); }, []);
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white/90">{isAr ? "الخدمات" : "Services Management"}</h2>
      <Card title={isAr ? "وضع التحرير والصيانة" : "Editing & Maintenance"}>
        <div className="flex items-center gap-3">
          <label className="text-xs text-[var(--text-secondary)]">{isAr ? "حالة الصفحة:" : "Page state:"}</label>
          <select className="input" value={pageActive ? "active" : "inactive"} onChange={(e) => setPageActive(e.target.value === "active")} disabled={!canEdit}>
            <option value="active">{isAr ? "نشطة للمستخدمين" : "Active for users"}</option>
            <option value="inactive">{isAr ? "غير نشطة (صيانة)" : "Inactive (maintenance)"}</option>
          </select>
          <button className="btn-primary" onClick={() => saveState()} disabled={!canEdit}>{isAr ? "حفظ الحالة" : "Save state"}</button>
        </div>
        <div className="mt-3">
          <label className="text-xs text-[var(--text-secondary)]">{isAr ? "رسالة الصيانة" : "Maintenance message"}</label>
          <textarea className="input min-h-[90px]" value={msg} onChange={(e) => setMsg(e.target.value)} disabled={!canEdit} />
          <div className="mt-2 flex items-center gap-3">
            <button className="btn-secondary" onClick={() => { saveState(false); const base = typeof window !== "undefined" ? window.location.origin : ""; const url = `${base}/${isAr ? "ar" : "en"}/editor/services?editor=1`; window.open(url, "_blank", "noopener,noreferrer"); }} disabled={!canEdit}>{isAr ? "تعطيل وفتح المحرر" : "Deactivate & Open Editor"}</button>
            <button className="btn-secondary" onClick={() => saveState(true)} disabled={!canEdit}>{isAr ? "تفعيل الصفحة" : "Reactivate page"}</button>
            <button
              className="btn-secondary"
              onClick={async () => {
                try {
                  const ps = await fetch("/api/admin/page-states", { cache: "no-store" }).then((r) => r.json());
                  const next = { ...ps, services: { ...(ps?.services || {}), workflow: { ...(ps?.services?.workflow || {}), status: "review" } } };
                  await fetch("/api/admin/page-states", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
                } catch {}
              }}
              disabled={!canEdit}
            >
              {isAr ? "نقل إلى المراجعة" : "Move to Review"}
            </button>
          </div>
        </div>
      </Card>
      <Card title={isAr ? "إضافة خدمة" : "Add Service"}>
        <div className="grid md:grid-cols-2 gap-2">
          <input className="input" placeholder={isAr ? "العنوان (EN)" : "Title (EN)"} value={titleEn} onChange={(e) => setTitleEn(e.target.value)} disabled={!canEdit} />
          <input className="input" placeholder={isAr ? "العنوان (AR)" : "Title (AR)"} value={titleAr} onChange={(e) => setTitleAr(e.target.value)} disabled={!canEdit} />
          <input className="input" placeholder={isAr ? "الوصف (EN)" : "Description (EN)"} value={descEn} onChange={(e) => setDescEn(e.target.value)} disabled={!canEdit} />
          <input className="input" placeholder={isAr ? "الوصف (AR)" : "Description (AR)"} value={descAr} onChange={(e) => setDescAr(e.target.value)} disabled={!canEdit} />
        </div>
        <button className="btn-primary mt-3" onClick={add} disabled={!canEdit}>{isAr ? "إضافة" : "Add"}</button>
      </Card>
      <Card title={isAr ? "قائمة الخدمات" : "Services List"}>
        {list.length === 0 ? (
          <div className="text-sm text-[var(--text-secondary)]">{isAr ? "لا توجد خدمات." : "No services."}</div>
        ) : (
          <div className="space-y-2">
            {list.map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                <div className="text-sm text-white/90">{isAr ? s.title_ar : s.title_en}</div>
                <div className="flex-1" />
                <button className="btn-secondary" onClick={() => del(s.id)} disabled={!canEdit}>{isAr ? "حذف" : "Delete"}</button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function CasesPanel({ isAr, role }: { isAr: boolean; role: "admin" | "editor" | "viewer" }) {
  const canEdit = role !== "viewer";
  const [pageActive, setPageActive] = useState(true);
  const [msg, setMsg] = useState("");
  const load = async () => {
    const res = await fetch("/api/admin/page-states", { cache: "no-store" });
    const ps = await res.json();
    setPageActive(Boolean(ps?.cases?.active));
    setMsg(String(ps?.cases?.maintenanceMessage || ""));
  };
  const saveState = async (nextActive?: boolean) => {
    const res = await fetch("/api/admin/page-states", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cases: { active: typeof nextActive === "boolean" ? nextActive : pageActive, maintenanceMessage: msg } }),
    });
    if (res.ok) load();
  };
  useEffect(() => { load(); }, []);
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white/90">{isAr ? "القضايا" : "Cases Management"}</h2>
      <Card title={isAr ? "وضع التحرير والصيانة" : "Editing & Maintenance"}>
        <div className="flex items-center gap-3">
          <label className="text-xs text-[var(--text-secondary)]">{isAr ? "حالة الصفحة:" : "Page state:"}</label>
          <select className="input" value={pageActive ? "active" : "inactive"} onChange={(e) => setPageActive(e.target.value === "active")} disabled={!canEdit}>
            <option value="active">{isAr ? "نشطة للمستخدمين" : "Active for users"}</option>
            <option value="inactive">{isAr ? "غير نشطة (صيانة)" : "Inactive (maintenance)"}</option>
          </select>
          <button className="btn-primary" onClick={() => saveState()} disabled={!canEdit}>{isAr ? "حفظ الحالة" : "Save state"}</button>
        </div>
        <div className="mt-3">
          <label className="text-xs text-[var(--text-secondary)]">{isAr ? "رسالة الصيانة" : "Maintenance message"}</label>
          <textarea className="input min-h-[90px]" value={msg} onChange={(e) => setMsg(e.target.value)} disabled={!canEdit} />
          <div className="mt-2 flex items-center gap-3">
            <button className="btn-secondary" onClick={() => { saveState(false); const base = typeof window !== "undefined" ? window.location.origin : ""; const url = `${base}/${isAr ? "ar" : "en"}/editor/cases?editor=1`; window.open(url, "_blank", "noopener,noreferrer"); }} disabled={!canEdit}>{isAr ? "تعطيل وفتح المحرر" : "Deactivate & Open Editor"}</button>
            <button className="btn-secondary" onClick={() => saveState(true)} disabled={!canEdit}>{isAr ? "تفعيل الصفحة" : "Reactivate page"}</button>
          </div>
        </div>
      </Card>
      <div className="grid md:grid-cols-2 gap-4">
        <Card title={isAr ? "إضافة قضية" : "Add Case"}>
          <button className="btn-primary" disabled={!canEdit}>{isAr ? "إضافة" : "Add"}</button>
        </Card>
        <Card title={isAr ? "الملفات والمستندات" : "Files & Documents"}>
          <button className="btn-secondary" disabled={!canEdit}>{isAr ? "رفع" : "Upload"}</button>
        </Card>
      </div>
    </div>
  );
}

function NewsPanel({ isAr, role }: { isAr: boolean; role: "admin" | "editor" | "viewer" }) {
  const canEdit = role !== "viewer";
  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [contentAr, setContentAr] = useState("");
  const [list, setList] = useState<any[]>([]);
  const [pageActive, setPageActive] = useState(true);
  const [msg, setMsg] = useState("");
  const load = async () => {
    const res = await fetch("/api/admin/news", { cache: "no-store" });
    setList(await res.json());
    const psRes = await fetch("/api/admin/page-states", { cache: "no-store" });
    const ps = await psRes.json();
    setPageActive(Boolean(ps?.news?.active));
    setMsg(String(ps?.news?.maintenanceMessage || ""));
  };
  const add = async () => {
    const res = await fetch("/api/admin/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title_en: titleEn, title_ar: titleAr, content_en_html: contentEn, content_ar_html: contentAr, publishedAt: new Date().toISOString() })
    });
    if (res.ok) {
      const created = await res.json().catch(() => null);
      try {
        const ps = await fetch("/api/admin/page-states", { cache: "no-store" }).then((r) => r.json());
        const revs = Array.isArray(ps?.news?.revisions) ? ps.news.revisions : [];
        const next = { ...ps, news: { ...(ps?.news || {}), revisions: [...revs, { at: Date.now(), kind: "add", id: created?.id, payload: created }] } };
        await fetch("/api/admin/page-states", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
      } catch {}
      setTitleEn(""); setTitleAr(""); setContentEn(""); setContentAr("");
      load();
    }
  };
  const del = async (id: string) => {
    const list = await fetch("/api/admin/news", { cache: "no-store" }).then((r) => r.json()).catch(() => []);
    const existing = Array.isArray(list) ? list.find((x: any) => x.id === id) : null;
    const res = await fetch(`/api/admin/news?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      try {
        const ps = await fetch("/api/admin/page-states", { cache: "no-store" }).then((r) => r.json());
        const revs = Array.isArray(ps?.news?.revisions) ? ps.news.revisions : [];
        const next = { ...ps, news: { ...(ps?.news || {}), revisions: [...revs, { at: Date.now(), kind: "delete", id, payload: existing }] } };
        await fetch("/api/admin/page-states", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
      } catch {}
      load();
    }
  };
  const saveState = async (nextActive?: boolean) => {
    const res = await fetch("/api/admin/page-states", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ news: { active: typeof nextActive === "boolean" ? nextActive : pageActive, maintenanceMessage: msg } }),
    });
    if (res.ok) load();
  };
  useEffect(() => { load(); }, []);
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white/90">{isAr ? "الأخبار" : "News Management"}</h2>
      <Card title={isAr ? "وضع التحرير والصيانة" : "Editing & Maintenance"}>
        <div className="flex items-center gap-3">
          <label className="text-xs text-[var(--text-secondary)]">{isAr ? "حالة الصفحة:" : "Page state:"}</label>
          <select className="input" value={pageActive ? "active" : "inactive"} onChange={(e) => setPageActive(e.target.value === "active")} disabled={!canEdit}>
            <option value="active">{isAr ? "نشطة للمستخدمين" : "Active for users"}</option>
            <option value="inactive">{isAr ? "غير نشطة (صيانة)" : "Inactive (maintenance)"}</option>
          </select>
          <button className="btn-primary" onClick={() => saveState()} disabled={!canEdit}>{isAr ? "حفظ الحالة" : "Save state"}</button>
        </div>
        <div className="mt-3">
          <label className="text-xs text-[var(--text-secondary)]">{isAr ? "رسالة الصيانة" : "Maintenance message"}</label>
          <textarea className="input min-h-[90px]" value={msg} onChange={(e) => setMsg(e.target.value)} disabled={!canEdit} />
          <div className="mt-2 flex items-center gap-3">
            <button className="btn-secondary" onClick={() => { saveState(false); const base = typeof window !== "undefined" ? window.location.origin : ""; const url = `${base}/${isAr ? "ar" : "en"}/editor/news?editor=1`; window.open(url, "_blank", "noopener,noreferrer"); }} disabled={!canEdit}>{isAr ? "تعطيل وفتح المحرر" : "Deactivate & Open Editor"}</button>
            <button className="btn-secondary" onClick={() => saveState(true)} disabled={!canEdit}>{isAr ? "تفعيل الصفحة" : "Reactivate page"}</button>
            <button
              className="btn-secondary"
              onClick={async () => {
                try {
                  const ps = await fetch("/api/admin/page-states", { cache: "no-store" }).then((r) => r.json());
                  const next = { ...ps, news: { ...(ps?.news || {}), workflow: { ...(ps?.news?.workflow || {}), status: "review" } } };
                  await fetch("/api/admin/page-states", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
                } catch {}
              }}
              disabled={!canEdit}
            >
              {isAr ? "نقل إلى المراجعة" : "Move to Review"}
            </button>
          </div>
        </div>
      </Card>
      <Card title={isAr ? "مقال جديد" : "New Article"}>
        <input className="input mb-2" placeholder={isAr ? "العنوان (EN)" : "Title (EN)"} value={titleEn} onChange={(e) => setTitleEn(e.target.value)} disabled={!canEdit} />
        <input className="input mb-2" placeholder={isAr ? "العنوان (AR)" : "Title (AR)"} value={titleAr} onChange={(e) => setTitleAr(e.target.value)} disabled={!canEdit} />
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-[var(--text-secondary)] mb-1">{isAr ? "المحتوى (EN)" : "Content (EN)"}</div>
            <RichTextEditor value={contentEn} onChange={setContentEn} dir="ltr" />
          </div>
          <div>
            <div className="text-xs text-[var(--text-secondary)] mb-1">{isAr ? "المحتوى (AR)" : "Content (AR)"}</div>
            <RichTextEditor value={contentAr} onChange={setContentAr} dir="rtl" />
          </div>
        </div>
        <button className="btn-primary mt-3" onClick={add} disabled={!canEdit}>{isAr ? "إنشاء" : "Create"}</button>
      </Card>
      <Card title={isAr ? "قائمة الأخبار" : "Articles"}>
        {list.length === 0 ? (
          <div className="text-sm text-[var(--text-secondary)]">{isAr ? "لا توجد مقالات." : "No articles."}</div>
        ) : (
          <div className="space-y-2">
            {list.map((n) => (
              <div key={n.id} className="flex items-center gap-3">
                <div className="text-sm text-white/90">{isAr ? n.title_ar : n.title_en}</div>
                <div className="flex-1" />
                <button className="btn-secondary" onClick={() => del(n.id)} disabled={!canEdit}>{isAr ? "حذف" : "Delete"}</button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function LegalPanel({ isAr, role, notifySaved }: { isAr: boolean; role: "admin" | "editor" | "viewer"; notifySaved: (kind: "settings" | "about" | "legal") => void }) {
  const canEdit = role !== "viewer";
  const [privacyEn, setPrivacyEn] = useState("");
  const [privacyAr, setPrivacyAr] = useState("");
  const [termsEn, setTermsEn] = useState("");
  const [termsAr, setTermsAr] = useState("");
  const [discEn, setDiscEn] = useState("");
  const [discAr, setDiscAr] = useState("");
  const load = async () => {
    const res = await fetch("/api/admin/legal", { cache: "no-store" });
    const data = await res.json();
    setPrivacyEn(data?.privacy_en_html || "");
    setPrivacyAr(data?.privacy_ar_html || "");
    setTermsEn(data?.terms_en_html || "");
    setTermsAr(data?.terms_ar_html || "");
    setDiscEn(data?.disclaimer_en_html || "");
    setDiscAr(data?.disclaimer_ar_html || "");
  };
  const save = async () => {
    const res = await fetch("/api/admin/legal", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        privacy_en_html: privacyEn,
        privacy_ar_html: privacyAr,
        terms_en_html: termsEn,
        terms_ar_html: termsAr,
        disclaimer_en_html: discEn,
        disclaimer_ar_html: discAr,
      }),
    });
    if (res.ok) {
      load();
      setTimeout(() => notifySaved("legal"), 1000);
    }
  };
  useEffect(() => { load(); }, []);
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white/90">{isAr ? "الوثائق القانونية" : "Legal Documents"}</h2>
      <Card title={isAr ? "سياسة الخصوصية (AR)" : "Privacy Policy (AR)"}>
        <RichTextEditor value={privacyAr} onChange={setPrivacyAr} dir="rtl" />
      </Card>
      <Card title={isAr ? "Privacy Policy (EN)" : "Privacy Policy (EN)"}>
        <RichTextEditor value={privacyEn} onChange={setPrivacyEn} dir="ltr" />
      </Card>
      <Card title={isAr ? "الشروط والأحكام (AR)" : "Terms of Service (AR)"}>
        <RichTextEditor value={termsAr} onChange={setTermsAr} dir="rtl" />
      </Card>
      <Card title={isAr ? "Terms of Service (EN)" : "Terms of Service (EN)"}>
        <RichTextEditor value={termsEn} onChange={setTermsEn} dir="ltr" />
      </Card>
      <Card title={isAr ? "إخلاء المسؤولية (AR)" : "Legal Disclaimer (AR)"}>
        <RichTextEditor value={discAr} onChange={setDiscAr} dir="rtl" />
      </Card>
      <Card title={isAr ? "Legal Disclaimer (EN)" : "Legal Disclaimer (EN)"}>
        <RichTextEditor value={discEn} onChange={setDiscEn} dir="ltr" />
      </Card>
      <button className="btn-primary" onClick={save} disabled={!canEdit}>{isAr ? "حفظ" : "Save"}</button>
    </div>
  );
}

function ContactPanel({ isAr, role }: { isAr: boolean; role: "admin" | "editor" | "viewer" }) {
  const canEdit = role !== "viewer";
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white/90">{isAr ? "تواصل معنا" : "Contact Us Page"}</h2>
      <Card title={isAr ? "حقول النموذج" : "Form Fields"}>
        <div className="grid md:grid-cols-2 gap-2">
          <input className="input" placeholder={isAr ? "الاسم" : "Name"} disabled={!canEdit} />
          <input className="input" placeholder={isAr ? "البريد" : "Email"} disabled={!canEdit} />
          <input className="input" placeholder={isAr ? "الموضوع" : "Subject"} disabled={!canEdit} />
          <input className="input" placeholder={isAr ? "المستلم" : "Recipient Email"} disabled={!canEdit} />
        </div>
      </Card>
      <Card title={isAr ? "الرسائل الواردة" : "Inbox"}>
        <div className="h-40 rounded-lg border border-[var(--panel-border)] bg-white/5" />
        <div className="mt-3 flex gap-2">
          <button className="btn-secondary">{isAr ? "تصدير CSV" : "Export CSV"}</button>
          <button className="btn-secondary">{isAr ? "تصدير PDF" : "Export PDF"}</button>
        </div>
      </Card>
    </div>
  );
}

function SettingsPanel({ isAr, role, notifySaved }: { isAr: boolean; role: "admin" | "editor" | "viewer"; notifySaved: (kind: "settings" | "about" | "legal") => void }) {
  const canEdit = role === "admin";
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [settings, setSettings] = useState<{
    languageToggle: boolean;
    themeToggle: boolean;
    cookiesEnabled: boolean;
    pageLoadingCursor: boolean;
    whatsapp: { enabled: boolean; number: string; message: string };
    aiAssistant: { enabled: boolean; provider: string; widgetCode: string; show: "all" | "home" };
  } | null>(null);
  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", { cache: "no-store" });
      const data = await res.json();
      setSettings({
        languageToggle: !!data?.languageToggle,
        themeToggle: !!data?.themeToggle,
        cookiesEnabled: data?.cookiesEnabled !== false,
        pageLoadingCursor: !!data?.pageLoadingCursor,
        whatsapp: {
          enabled: !!data?.whatsapp?.enabled,
          number: data?.whatsapp?.number ?? "",
          message: data?.whatsapp?.message ?? "",
        },
        aiAssistant: {
          enabled: !!data?.aiAssistant?.enabled,
          provider: data?.aiAssistant?.provider ?? "",
          widgetCode: data?.aiAssistant?.widgetCode ?? "",
          show: (data?.aiAssistant?.show === "home" ? "home" : "all"),
        },
      });
    } finally {
      setLoading(false);
    }
  };
  const save = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok && typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("site-settings-updated", { detail: settings }));
        setTimeout(() => notifySaved("settings"), 1000);
      }
    } finally {
      setSaving(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const Row = ({
    labelEn,
    labelAr,
    enabled,
    onToggle,
    children,
  }: {
    labelEn: string;
    labelAr: string;
    enabled: boolean;
    onToggle: () => void;
    children?: React.ReactNode;
  }) => {
    return (
      <div className="flex items-center justify-between gap-4 py-2">
        <div className="flex-1">
          <div className="text-sm font-medium">{isAr ? labelAr : labelEn}</div>
          {children ? <div className="mt-2">{children}</div> : null}
        </div>
        <button
          onClick={onToggle}
          disabled={!canEdit}
          aria-pressed={enabled}
          className={[
            "relative inline-flex h-9 w-16 items-center rounded-full border border-[var(--panel-border)] px-1 transition",
            enabled ? "bg-[var(--brand-accent)] text-black" : "bg-[var(--panel-bg)] text-[var(--text-secondary)]",
            !canEdit ? "opacity-50 cursor-not-allowed" : "hover:opacity-90",
          ].join(" ")}
          title={enabled ? (isAr ? "تعطيل" : "Disable") : (isAr ? "تمكين" : "Enable")}
        >
          <span
            className={[
              "inline-flex h-7 w-7 items-center justify-center rounded-full bg-white shadow transform transition",
              enabled ? "translate-x-7" : "translate-x-0",
            ].join(" ")}
          >
            {enabled ? (
              <svg viewBox="0 0 20 20" className="h-4 w-4 text-[var(--brand-accent)]" aria-hidden="true">
                <path fill="currentColor" d="M7.6 14.2 3.4 10l1.1-1.1 3.1 3.1 7-7 1.1 1.1-8.1 8.1Z" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" className="h-4 w-4 text-[var(--text-secondary)]" aria-hidden="true">
                <path fill="currentColor" d="M10 3a7 7 0 1 0 .001 14.001A7 7 0 0 0 10 3Zm0 2a5 5 0 1 1-.001 10.001A5 5 0 0 1 10 5Z" />
              </svg>
            )}
          </span>
        </button>
      </div>
    );
  };
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white/90">{isAr ? "الإعدادات" : "System Settings"}</h2>
      <Card title={isAr ? "الميزات" : "Features"}>
        {!settings || loading ? (
          <div className="text-sm text-[var(--text-secondary)]">{isAr ? "جاري التحميل..." : "Loading..."}</div>
        ) : (
          <div className="space-y-3">
            <Row
              labelEn="Language Toggle"
              labelAr="مبدّل اللغة"
              enabled={settings.languageToggle}
              onToggle={() => setSettings({ ...settings, languageToggle: !settings.languageToggle })}
            />
            <Row
              labelEn="Theme Toggle"
              labelAr="مبدّل السمة"
              enabled={settings.themeToggle}
              onToggle={() => setSettings({ ...settings, themeToggle: !settings.themeToggle })}
            />
            <Row
              labelEn="Cookies Banner"
              labelAr="شريط ملفات الارتباط"
              enabled={settings.cookiesEnabled}
              onToggle={() => setSettings({ ...settings, cookiesEnabled: !settings.cookiesEnabled })}
            />
            <Row
              labelEn="Page Loading Cursor"
              labelAr="مؤشر انتظار أثناء التحميل"
              enabled={settings.pageLoadingCursor}
              onToggle={() => setSettings({ ...settings, pageLoadingCursor: !settings.pageLoadingCursor })}
            />
            <Row
              labelEn="WhatsApp Plugin"
              labelAr="إضافة واتساب"
              enabled={settings.whatsapp.enabled}
              onToggle={() => setSettings({ ...settings, whatsapp: { ...settings.whatsapp, enabled: !settings.whatsapp.enabled } })}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  type="tel"
                  value={settings.whatsapp.number}
                  onChange={(e) => setSettings({ ...settings, whatsapp: { ...settings.whatsapp, number: e.target.value } })}
                  placeholder={isAr ? "رقم واتساب" : "WhatsApp Number"}
                  className="h-9 rounded-lg px-3 text-sm bg-[var(--panel-bg)] border border-[var(--panel-border)] w-full"
                  disabled={!canEdit}
                />
                <input
                  type="text"
                  value={settings.whatsapp.message}
                  onChange={(e) => setSettings({ ...settings, whatsapp: { ...settings.whatsapp, message: e.target.value } })}
                  placeholder={isAr ? "رسالة افتراضية" : "Default Message"}
                  className="h-9 rounded-lg px-3 text-sm bg-[var(--panel-bg)] border border-[var(--panel-border)] w-full"
                  disabled={!canEdit}
                />
              </div>
            </Row>
            <Row
              labelEn="AI Assistance Plugin"
              labelAr="إضافة مساعد الذكاء الاصطناعي"
              enabled={settings.aiAssistant.enabled}
              onToggle={() => setSettings({ ...settings, aiAssistant: { ...settings.aiAssistant, enabled: !settings.aiAssistant.enabled } })}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={settings.aiAssistant.provider}
                  onChange={(e) => setSettings({ ...settings, aiAssistant: { ...settings.aiAssistant, provider: e.target.value } })}
                  placeholder={isAr ? "المزوّد" : "Provider"}
                  className="h-9 rounded-lg px-3 text-sm bg-[var(--panel-bg)] border border-[var(--panel-border)] w-full md:col-span-1"
                  disabled={!canEdit}
                />
                <select
                  value={settings.aiAssistant.show}
                  onChange={(e) => setSettings({ ...settings, aiAssistant: { ...settings.aiAssistant, show: e.target.value as any } })}
                  className="h-9 rounded-lg px-3 text-sm bg-[var(--panel-bg)] border border-[var(--panel-border)] w-full md:col-span-1"
                  disabled={!canEdit}
                >
                  <option value="all">{isAr ? "كل الصفحات" : "All pages"}</option>
                  <option value="home">{isAr ? "الصفحة الرئيسية فقط" : "Home only"}</option>
                </select>
                <textarea
                  value={settings.aiAssistant.widgetCode}
                  onChange={(e) => setSettings({ ...settings, aiAssistant: { ...settings.aiAssistant, widgetCode: e.target.value } })}
                  placeholder={isAr ? "شيفرة الودجت أو السكربت" : "Widget or script code"}
                  className="min-h-20 rounded-lg px-3 py-2 text-sm bg-[var(--panel-bg)] border border-[var(--panel-border)] w-full md:col-span-1 md:col-start-3"
                  disabled={!canEdit}
                />
              </div>
            </Row>
            <div className="pt-2 flex items-center gap-3">
              <button onClick={save} disabled={!canEdit || saving} className="btn-primary">
                {saving ? (isAr ? "جارٍ الحفظ..." : "Saving...") : (isAr ? "حفظ" : "Save")}
              </button>
              <button onClick={load} disabled={loading} className="btn-secondary">
                {isAr ? "إعادة التحميل" : "Reload"}
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel-bg)] p-4">
      <div className="text-sm font-semibold text-white/90">{title}</div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function UsersIcon(props: any) { return (<svg viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0Zm-9 6a5 5 0 0 1 10 0v1H7v-1Z"/></svg>); }
function ChartIcon(props: any) { return (<svg viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M3 3h2v18H3V3Zm4 8h2v10H7V11Zm4-6h2v16h-2V5Zm4 10h2v6h-2v-6Zm4-12h2v18h-2V3Z"/></svg>); }
function HeaderIcon(props: any) { return (<svg viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M4 4h16v4H4V4Zm0 6h10v2H4v-2Zm0 4h8v2H4v-2Z"/></svg>); }
function FooterIcon(props: any) { return (<svg viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M4 16h16v4H4v-4Zm0-12h16v2H4V4Zm0 4h10v2H4V8Z"/></svg>); }
function HomeIcon(props: any) { return (<svg viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12 3 2 12h3v9h6v-6h2v6h6v-9h3L12 3Z"/></svg>); }
function InfoIcon(props: any) { return (<svg viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M11 7h2v2h-2V7Zm0 4h2v6h-2v-6Zm1-9a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z"/></svg>); }
function ServicesIcon(props: any) { return (<svg viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M7 3h10v4H7V3Zm-2 6h14v4H5V9Zm2 6h10v4H7v-4Z"/></svg>); }
function CasesIcon(props: any) { return (<svg viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M9 3h6l2 3h3v14H4V6h3l2-3Zm3 2h-2l-1 1h4l-1-1Z"/></svg>); }
function NewsIcon(props: any) { return (<svg viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M4 5h14v14H4V5Zm2 2v2h10V7H6Zm0 4v6h6v-6H6Zm8 0v6h2v-6h-2Z"/></svg>); }
function WorkflowIcon(props: any) { return (<svg viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M5 4h6v4H5V4Zm8 0h6v4h-6V4ZM5 10h6v4H5v-4Zm8 0h6v4h-6v-4ZM5 16h6v4H5v-4Zm8 6v-4h6v4h-6Z"/></svg>); }
function ScheduleIcon(props: any) { return (<svg viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M7 3h2v2h6V3h2v2h3v16H4V5h3V3Zm12 6H5v10h14V9Zm-6 2h2v4h-2v-4Z"/></svg>); }
function RevisionsIcon(props: any) { return (<svg viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12 5v2H8v10h8V7h-4V5h6v14H6V5h6Zm0 3 3 3-3 3-1.5-1.5L11 12l-0.5-0.5L12 8Z"/></svg>); }
function TaxonomyIcon(props: any) { return (<svg viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M3 5h18v2H3V5Zm0 4h12v2H3V9Zm0 4h8v2H3v-2Zm14-2h4v2h-4v-2Zm-2 4h6v2h-6v-2Z"/></svg>); }
function SeoIcon(props: any) { return (<svg viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M3 6h18v2H3V6Zm0 4h12v2H3v-2Zm0 4h8v2H3v-2Zm14 .5 2.5-2.5L21 11l-4 4-2-2 1.5-1.5 1.5 1.5Z"/></svg>); }
function ScriptIcon(props: any) { return (<svg viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M7 7h10v2H7V7Zm0 4h10v2H7v-2Zm0 4h6v2H7v-2Zm12-7V5h2v12h-2v-2h-2v-2h2v-2h-2V9h2Z"/></svg>); }
function RobotIcon(props: any) { return (<svg viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M10 2h4v2h3a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h3V2Zm-3 7h2v2H7V9Zm8 0h2v2h-2V9Zm-8 6h10v2H7v-2Z"/></svg>); }
function RedirectIcon(props: any) { return (<svg viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M7 7h7V4l5 5-5 5v-3H7V7Zm0 10h10v2H7v-2Z"/></svg>); }
function MediaIcon(props: any) { return (<svg viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M4 5h16v14H4V5Zm2 2v10h12V7H6Zm6 2 4 3-4 3V9Z"/></svg>); }
function StarIcon(props: any) { return (<svg viewBox="0 0 24 24" {...props}><path fill="currentColor" d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6Z"/></svg>); }
function ShieldIcon(props: any) { return (<svg viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12 2 4 5v6c0 5 3.4 9 8 11 4.6-2 8-6 8-11V5l-8-3Z"/></svg>); }
function HandshakeIcon(props: any) { return (<svg viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M2 7h5l3 3 3-3h9v6h-3l-4 4-4-4-2 2-3-3H2V7Z"/></svg>); }
function MailIcon(props: any) { return (<svg viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M20 4H4v16h16V4Zm-2 4-6 4-6-4V6l6 4 6-4v2Z"/></svg>); }
function SettingsIcon(props: any) { return (<svg viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm9 3h-2.1a7.96 7.96 0 0 0-.6-1.45l1.5-1.5L18 5.05l-1.5 1.5c-.47-.25-.97-.46-1.5-.6V4h-4v1.95c-.53.14-1.03.35-1.5.6L8 5.05 5.2 7.05l1.5 1.5c-.25.47-.46.97-.6 1.5H4v4h2.1c.14.53.35 1.03.6 1.5l-1.5 1.5L8 18.95l1.5-1.5c.47.25.97.46 1.5.6V22h4v-1.95c.53-.14 1.03-.35 1.5-.6l1.5 1.5 2.8-2-1.5-1.5c.25-.47.46-.97.6-1.5H22v-4Z"/></svg>); }
function LegalIcon(props: any) { return (<svg viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M6 2h9l3 3v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm0 2v16h10V6h-3V4H6Zm2 4h6v2H8V8Zm0 4h8v2H8v-2Zm0 4h8v2H8v-2Z"/></svg>); }
function PaletteIcon(props: any) { return (<svg viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12 3a9 9 0 0 0-9 9c0 4.97 4.03 9 9 9h2a3 3 0 0 0 3-3c0-.83-.67-1.5-1.5-1.5H13a2 2 0 1 1 0-4h2.5A5.5 5.5 0 0 0 21 6.5C21 4.02 18.98 3 16.5 3H12Zm-5 8a1.5 1.5 0 1 1 3.001.001A1.5 1.5 0 0 1 7 11Zm5-4a1.5 1.5 0 1 1 3.001.001A1.5 1.5 0 0 1 12 7Zm5 4a1.5 1.5 0 1 1 3.001.001A1.5 1.5 0 0 1 17 11Z"/></svg>); }
