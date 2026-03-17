 'use client';
import { useEffect, useMemo, useRef, useState } from "react";
 
let GLOBAL_FOCUS_EL: HTMLElement | null = null;

 type Change =
   | { selector: string; type: "text"; value: string }
   | { selector: string; type: "button"; label: string; href: string; style: "primary" | "secondary" }
  | { selector: string; type: "image"; src: string; alt: string }
  | { selector: string; type: "style"; style: { fontSize?: string; fontWeight?: string; textAlign?: "left" | "center" | "right"; colorToken?: "primary" | "accent" } }
  | { selector: string; type: "section"; op: "move" | "duplicate" | "hide" | "show" | "delete"; meta?: { from?: number; to?: number } };
 
 function computeSelector(el: HTMLElement) {
   if (el.getAttribute("data-edit-key")) return `[data-edit-key="${el.getAttribute("data-edit-key")}"]`;
   const id = el.id ? `#${el.id}` : "";
   const cls = el.className ? "." + String(el.className).trim().split(/\s+/).slice(0, 2).join(".") : "";
   const tag = el.tagName.toLowerCase();
   return `${tag}${id}${cls}`;
 }
 
export default function EditorShell({ pageId, children, exitHref, lang }: { pageId: "home" | "about" | "services" | "cases" | "news" | "header" | "footer"; children: React.ReactNode; exitHref?: string; lang: "en" | "ar" }) {
   const [status, setStatus] = useState<"editing" | "saved" | "draft">("editing");
   const [changes, setChanges] = useState<Change[]>([]);
   const [panelEl, setPanelEl] = useState<HTMLElement | null>(null);
  const [panelType, setPanelType] = useState<"text" | "button" | "image" | "section" | null>(null);
   const floatingRef = useRef<HTMLDivElement | null>(null);
  const dragInfo = useRef<{ dragging?: HTMLElement | null; over?: HTMLElement | null }>({});
  const focusIdRef = useRef<string | null>(null);
  const focusElRef = useRef<HTMLElement | null>(null);
 
   useEffect(() => {
     let cancelled = false;
     async function init() {
       try {
         const ps = await fetch("/api/admin/page-states", { cache: "no-store" }).then((r) => r.json());
         const state = ps?.[pageId];
         if (!cancelled) setStatus(state?.draft ? "draft" : "editing");
       } catch {}
       try {
         const pc = await fetch("/api/admin/page-content", { cache: "no-store" }).then((r) => r.json());
         const list = Array.isArray(pc?.[pageId]?.changes) ? pc[pageId].changes : [];
         if (!cancelled) setChanges(list);
       } catch {}
     }
     init();
     return () => { cancelled = true; };
   }, [pageId]);
 
   useEffect(() => {
     const onHover = (e: MouseEvent) => {
       const target = e.target as HTMLElement | null;
       if (!target) return;
       let el = target;
       const type = detectType(el);
       if (!type) return;
       el.style.outline = "2px solid #E1BC89";
       const lab = floatingRef.current;
       if (!lab) return;
       lab.style.display = "block";
       const rect = el.getBoundingClientRect();
       lab.style.left = `${rect.left + 6}px`;
       lab.style.top = `${rect.top + 6 + window.scrollY}px`;
       lab.textContent = labelFor(type);
     };
     const clearHover = () => {
       document.querySelectorAll("*").forEach((n) => (n as HTMLElement).style && ((n as HTMLElement).style.outline = ""));
       const lab = floatingRef.current;
       if (lab) lab.style.display = "none";
     };
    const onClick = (e: MouseEvent) => {
       const target = e.target as HTMLElement | null;
       if (!target) return;
       const type = detectType(target);
       if (!type) return;
       setPanelEl(target);
       setPanelType(type);
     };
    const onDragStart = (e: DragEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;
      if (detectType(el) !== "section") return;
      dragInfo.current.dragging = el;
      el.style.opacity = "0.6";
    };
    const onDragOver = (e: DragEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;
      const sec = closestSection(el);
      if (!sec) return;
      e.preventDefault();
      dragInfo.current.over = sec;
      sec.style.outline = "2px dashed var(--brand-accent)";
    };
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      const from = dragInfo.current.dragging;
      const to = dragInfo.current.over;
      if (from && to && from !== to) {
        const parent = to.parentElement;
        if (parent) {
          parent.insertBefore(from, to);
          recordSectionChange(from, setChanges, { op: "move" });
        }
      }
      clearDragStyles();
    };
    const onDragEnd = () => {
      clearDragStyles();
    };
    function clearDragStyles() {
      document.querySelectorAll("section").forEach((s) => { (s as HTMLElement).style.outline = ""; (s as HTMLElement).style.opacity = ""; });
      dragInfo.current = {};
    }
     document.addEventListener("mousemove", onHover);
     document.addEventListener("mouseleave", clearHover);
     document.addEventListener("scroll", clearHover, { passive: true });
     document.addEventListener("click", onClick);
    const onDblClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const sec = closestSection(target);
      if (!sec) return;
      setPanelEl(sec);
      setPanelType("section");
    };
    document.addEventListener("dragstart", onDragStart as any);
    document.addEventListener("dragover", onDragOver as any);
    document.addEventListener("drop", onDrop as any);
    document.addEventListener("dragend", onDragEnd as any);
    document.addEventListener("dblclick", onDblClick as any);
     return () => {
       document.removeEventListener("mousemove", onHover);
       document.removeEventListener("mouseleave", clearHover);
       document.removeEventListener("scroll", clearHover as any);
       document.removeEventListener("click", onClick);
      document.removeEventListener("dragstart", onDragStart as any);
      document.removeEventListener("dragover", onDragOver as any);
      document.removeEventListener("drop", onDrop as any);
      document.removeEventListener("dragend", onDragEnd as any);
      document.removeEventListener("dblclick", onDblClick as any);
     };
   }, []);
 
  useEffect(() => {
    function dimFor(el: HTMLElement | null) {
      try {
        const nodes = Array.from(document.querySelectorAll("section")) as HTMLElement[];
        nodes.forEach((n) => {
          if (!el || n === el) {
            n.style.opacity = "";
            n.style.filter = "";
            n.style.pointerEvents = "";
          } else {
            n.style.opacity = "0.35";
            n.style.filter = "grayscale(0.2)";
            n.style.pointerEvents = "none";
          }
        });
      } catch {}
    }
    function scrollToHashTarget(retries = 12) {
      try {
        if (typeof window === "undefined") return;
        const hash = window.location.hash;
        if (!hash || hash.length < 2) { focusIdRef.current = null; focusElRef.current = null; GLOBAL_FOCUS_EL = null; dimFor(null); return; }
        const id = decodeURIComponent(hash.slice(1));
        const el = document.getElementById(id) as HTMLElement | null;
        if (el) {
          focusIdRef.current = id;
          focusElRef.current = el;
          GLOBAL_FOCUS_EL = el;
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          el.style.outline = "2px solid var(--brand-accent)";
          setTimeout(() => { el.style.outline = ""; }, 2200);
          dimFor(el);
        } else if (retries > 0) {
          setTimeout(() => scrollToHashTarget(retries - 1), 200);
        }
      } catch {}
    }
    scrollToHashTarget();
    const onHash = () => scrollToHashTarget();
    if (typeof window !== "undefined") window.addEventListener("hashchange", onHash);
    return () => {
      if (typeof window !== "undefined") window.removeEventListener("hashchange", onHash);
      try {
        const nodes = Array.from(document.querySelectorAll("section")) as HTMLElement[];
        nodes.forEach((n) => { n.style.opacity = ""; n.style.filter = ""; n.style.pointerEvents = ""; });
      } catch {}
      GLOBAL_FOCUS_EL = null;
    };
  }, []);

  useEffect(() => {
    function scrollToHashTarget(retries = 12) {
      try {
        if (typeof window === "undefined") return;
        const hash = window.location.hash;
        if (!hash || hash.length < 2) return;
        const id = decodeURIComponent(hash.slice(1));
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          el.style.outline = "2px solid var(--brand-accent)";
          setTimeout(() => { el.style.outline = ""; }, 2200);
        } else if (retries > 0) {
          setTimeout(() => scrollToHashTarget(retries - 1), 200);
        }
      } catch {}
    }
    scrollToHashTarget();
    const onHash = () => scrollToHashTarget();
    if (typeof window !== "undefined") window.addEventListener("hashchange", onHash);
    return () => {
      if (typeof window !== "undefined") window.removeEventListener("hashchange", onHash);
    };
  }, []);

   const save = async (reactivate: boolean) => {
     const body: any = {};
     body[pageId] = { changes };
     await fetch("/api/admin/page-content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
     const ps = await fetch("/api/admin/page-states", { cache: "no-store" }).then((r) => r.json());
     const next: any = { ...ps };
     next[pageId] = { ...(ps?.[pageId] || {}), active: reactivate ? true : false, draft: !reactivate };
     await fetch("/api/admin/page-states", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
     setStatus("saved");
     if (reactivate) {
      if (exitHref) {
        window.location.href = exitHref;
      } else {
        setTimeout(() => window.close(), 300);
      }
     }
   };
 
   const toolbar = useMemo(() => {
     return (
       <div className="fixed top-0 left-0 right-0 z-[60] h-12 bg-[var(--brand-primary)]/90 backdrop-blur border-b border-white/10 flex items-center px-3 gap-3">
         <div className="text-xs font-semibold rounded-md px-2 py-1 bg-white/10 text-white">{lang === "ar" ? "وضع المحرر" : "Editor Mode"}</div>
         <div className="text-xs text-white/80">{pageId.toUpperCase()}</div>
        {focusIdRef.current ? <div className="text-xs rounded-md px-2 py-1 bg-[var(--brand-accent)]/20 text-[var(--brand-accent)]">{(lang === "ar" ? "قسم" : "Section") + ": " + focusIdRef.current}</div> : null}
         <div className="flex-1" />
         <div className="text-xs text-white/80">{status.toUpperCase()}</div>
         <button className="h-9 px-3 rounded-md bg-[var(--brand-accent)] text-black font-semibold" onClick={() => setConfirm(true)}>{lang === "ar" ? "حفظ التغييرات" : "Save Changes"}</button>
         <button className="h-9 px-3 rounded-md border border-white/10 text-white" onClick={() => { if (exitHref) window.location.href = exitHref; else window.close(); }}>{lang === "ar" ? "خروج" : "Exit Editor"}</button>
       </div>
     );
   }, [status, pageId, lang]);
 
   const [confirm, setConfirm] = useState(false);
  const [forcedNotice, setForcedNotice] = useState(false);
  useEffect(() => {
    try {
      const qs = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
      const flag = typeof window !== "undefined" ? sessionStorage.getItem("editorForcedInCurrentTab") === "1" : false;
      if ((qs && qs.get("editor") === "1") || flag) {
        setForcedNotice(true);
        if (typeof window !== "undefined") sessionStorage.removeItem("editorForcedInCurrentTab");
      }
    } catch {}
  }, []);
 
  const focusedSplit = Boolean(focusIdRef.current);
  return (
     <div className="min-h-screen">
       {toolbar}
      {forcedNotice ? (
        <div className="fixed top-12 left-0 right-0 z-[59]">
          <div className="mx-auto max-w-3xl rounded-lg border border-[var(--panel-border)] bg-[var(--panel-bg)] px-3 py-2 text-xs text-[var(--ink-primary)] shadow-sm">
            {lang === "ar" ? "تم فتح المحرر في نفس النافذة بسبب قيود المتصفح." : "The editor opened in the current tab due to browser restrictions."}
          </div>
        </div>
      ) : null}
      {focusedSplit ? (
        <div className="pt-12 grid" style={{ gridTemplateColumns: "70% 30%" }}>
          <div className="border-r border-[var(--panel-border)] min-h-[calc(100vh-48px)] overflow-auto">{children}</div>
          <div className="min-h-[calc(100vh-48px)] overflow-auto p-4">
            {panelEl && panelType === "text" ? (
              <>
                <div className="text-xs text-white/80">{lang === "ar" ? "نص" : "Text"}</div>
                <textarea className="input min-h-[120px]" defaultValue={panelEl.innerText} onChange={(e) => {
                  panelEl.innerText = e.target.value;
                  const sel = computeSelector(panelEl);
                  setChanges((C) => {
                    const idx = C.findIndex((c) => c.selector === sel && c.type === "text");
                    const upd = { selector: sel, type: "text", value: e.target.value } as Change;
                    if (idx === -1) return [...C, upd];
                    const copy = [...C]; copy[idx] = upd; return copy;
                  });
                }} />
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-[var(--text-secondary)]">{lang === "ar" ? "حجم الخط" : "Font size"}</label>
                    <input className="input" placeholder={lang === "ar" ? "مثال: 1rem" : "e.g. 1rem"} defaultValue={panelEl.style.fontSize} onChange={(e) => {
                      panelEl.style.fontSize = e.target.value;
                      recordStyle(panelEl, setChanges, { fontSize: e.target.value });
                    }} />
                  </div>
                  <div>
                    <label className="text-xs text-[var(--text-secondary)]">{lang === "ar" ? "سمك الخط" : "Weight"}</label>
                    <select className="input" defaultValue={panelEl.style.fontWeight || "normal"} onChange={(e) => {
                      panelEl.style.fontWeight = e.target.value;
                      recordStyle(panelEl, setChanges, { fontWeight: e.target.value });
                    }}>
                      <option value="300">300</option>
                      <option value="400">400</option>
                      <option value="500">500</option>
                      <option value="600">600</option>
                      <option value="700">700</option>
                    </select>
                  </div>
                </div>
              </>
            ) : null}
            {panelEl && panelType === "button" ? (
              <>
                <div className="text-xs text-white/80">{lang === "ar" ? "زر" : "Button"}</div>
                <input className="input mb-2" defaultValue={panelEl.innerText} onChange={(e) => { panelEl.innerText = e.target.value; recordButton(panelEl, setChanges); }} />
                <input className="input mb-2" defaultValue={(panelEl as HTMLAnchorElement).href} onChange={(e) => { (panelEl as HTMLAnchorElement).href = e.target.value; recordButton(panelEl, setChanges); }} />
              </>
            ) : null}
            {panelEl && panelType === "image" ? (
              <>
                <div className="text-xs text-white/80">{lang === "ar" ? "صورة" : "Image"}</div>
                <input className="input mb-2" defaultValue={(panelEl as HTMLImageElement).src} onChange={(e) => { (panelEl as HTMLImageElement).src = e.target.value; recordImage(panelEl, setChanges); }} />
                <input className="input mb-2" defaultValue={(panelEl as HTMLImageElement).alt} onChange={(e) => { (panelEl as HTMLImageElement).alt = e.target.value; recordImage(panelEl, setChanges); }} />
              </>
            ) : null}
            {(!panelEl || !panelType) ? (
              <div className="text-sm text-[var(--text-secondary)]">{lang === "ar" ? "اختر نصًا أو زرًا أو صورة داخل القسم لتحريره هنا." : "Select text, a button, or an image in the section to edit its content here."}</div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="pt-12">{children}</div>
      )}
       <div ref={floatingRef} className="fixed z-[55] pointer-events-none select-none text-xs font-semibold rounded bg-[var(--brand-accent)] text-black px-2 py-1" style={{ display: "none" }} />
       {!focusedSplit && panelEl && panelType === "text" ? (
         <SidePanel>
           <div className="text-xs text-white/80">{lang === "ar" ? "نص" : "Text"}</div>
           <textarea className="input min-h-[120px]" defaultValue={panelEl.innerText} onChange={(e) => {
             panelEl.innerText = e.target.value;
             const sel = computeSelector(panelEl);
             setChanges((C) => {
               const idx = C.findIndex((c) => c.selector === sel && c.type === "text");
               const upd = { selector: sel, type: "text", value: e.target.value } as Change;
               if (idx === -1) return [...C, upd];
               const copy = [...C]; copy[idx] = upd; return copy;
             });
           }} />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-[var(--text-secondary)]">{lang === "ar" ? "حجم الخط" : "Font size"}</label>
                <input className="input" placeholder="e.g. 1rem" defaultValue={panelEl.style.fontSize} onChange={(e) => {
                  panelEl.style.fontSize = e.target.value;
                  recordStyle(panelEl, setChanges, { fontSize: e.target.value });
                }} />
              </div>
              <div>
                <label className="text-xs text-[var(--text-secondary)]">{lang === "ar" ? "سمك الخط" : "Weight"}</label>
                <select className="input" defaultValue={panelEl.style.fontWeight || "normal"} onChange={(e) => {
                  panelEl.style.fontWeight = e.target.value;
                  recordStyle(panelEl, setChanges, { fontWeight: e.target.value });
                }}>
                  <option value="300">300</option>
                  <option value="400">400</option>
                  <option value="500">500</option>
                  <option value="600">600</option>
                  <option value="700">700</option>
                  <option value="800">800</option>
                </select>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-[var(--text-secondary)]">{lang === "ar" ? "محاذاة" : "Alignment"}</label>
                <div className="flex gap-2">
                  <button className="btn-secondary" onClick={() => { panelEl.style.textAlign = "left"; recordStyle(panelEl, setChanges, { textAlign: "left" }); }}>{lang === "ar" ? "يسار" : "Left"}</button>
                  <button className="btn-secondary" onClick={() => { panelEl.style.textAlign = "center"; recordStyle(panelEl, setChanges, { textAlign: "center" }); }}>{lang === "ar" ? "وسط" : "Center"}</button>
                  <button className="btn-secondary" onClick={() => { panelEl.style.textAlign = "right"; recordStyle(panelEl, setChanges, { textAlign: "right" }); }}>{lang === "ar" ? "يمين" : "Right"}</button>
                </div>
              </div>
              <div>
                <label className="text-xs text-[var(--text-secondary)]">{lang === "ar" ? "اللون" : "Color"}</label>
                <select className="input" defaultValue={inferColorToken(panelEl)} onChange={(e) => {
                  const token = e.target.value as "primary" | "accent";
                  panelEl.style.color = token === "primary" ? "var(--brand-primary)" : "var(--brand-accent)";
                  recordStyle(panelEl, setChanges, { colorToken: token });
                }}>
                  <option value="primary">{lang === "ar" ? "أساسي" : "Primary"}</option>
                  <option value="accent">{lang === "ar" ? "ثانوي" : "Accent"}</option>
                </select>
              </div>
            </div>
         </SidePanel>
       ) : null}
       {!focusedSplit && panelEl && panelType === "button" ? (
         <SidePanel>
           <div className="text-xs text-white/80">{lang === "ar" ? "زر" : "Button"}</div>
           <input className="input mb-2" defaultValue={panelEl.innerText} onChange={(e) => { panelEl.innerText = e.target.value; recordButton(panelEl, setChanges); }} />
           <input className="input mb-2" defaultValue={(panelEl as HTMLAnchorElement).href} onChange={(e) => { (panelEl as HTMLAnchorElement).href = e.target.value; recordButton(panelEl, setChanges); }} />
         </SidePanel>
       ) : null}
       {!focusedSplit && panelEl && panelType === "image" ? (
         <SidePanel>
           <div className="text-xs text-white/80">{lang === "ar" ? "صورة" : "Image"}</div>
           <input className="input mb-2" defaultValue={(panelEl as HTMLImageElement).src} onChange={(e) => { (panelEl as HTMLImageElement).src = e.target.value; recordImage(panelEl, setChanges); }} />
           <input className="input mb-2" defaultValue={(panelEl as HTMLImageElement).alt} onChange={(e) => { (panelEl as HTMLImageElement).alt = e.target.value; recordImage(panelEl, setChanges); }} />
         </SidePanel>
       ) : null}
       {!focusedSplit && panelEl && panelType === "section" ? (
         <SidePanel>
           <div className="text-xs text-white/80">{lang === "ar" ? "قسم" : "Section"}</div>
           <div className="mt-2 grid grid-cols-2 gap-2">
             <button className="btn-secondary" onClick={() => moveSection(panelEl, -1, setChanges)}>{lang === "ar" ? "أعلى" : "Move Up"}</button>
             <button className="btn-secondary" onClick={() => moveSection(panelEl, 1, setChanges)}>{lang === "ar" ? "أسفل" : "Move Down"}</button>
             <button className="btn-secondary" onClick={() => duplicateSection(panelEl, setChanges)}>{lang === "ar" ? "تكرار" : "Duplicate"}</button>
             <button className="btn-secondary" onClick={() => toggleSection(panelEl, true, setChanges)}>{lang === "ar" ? "إخفاء" : "Hide"}</button>
             <button className="btn-secondary" onClick={() => toggleSection(panelEl, false, setChanges)}>{lang === "ar" ? "إظهار" : "Show"}</button>
             <button className="btn-secondary" onClick={() => deleteSection(panelEl, setChanges)}>{lang === "ar" ? "حذف" : "Delete"}</button>
           </div>
           <div className="mt-3 text-xs text-[var(--text-secondary)]">{lang === "ar" ? "اسحب الأقسام لإعادة الترتيب." : "Drag sections to reorder."}</div>
         </SidePanel>
       ) : null}
       {confirm ? (
         <Modal onClose={() => setConfirm(false)}>
           <div className="text-sm font-semibold text-white/90">{lang === "ar" ? "تم حفظ جميع التغييرات بنجاح." : "All changes have been successfully saved."}</div>
           <div className="mt-1 text-xs text-[var(--text-secondary)]">{lang === "ar" ? "هل تريد إعادة تفعيل هذه الصفحة لزوار الموقع؟" : "Do you want to reactivate this page for website visitors?"}</div>
           <div className="mt-4 flex items-center justify-center gap-3">
             <button className="btn-primary" onClick={() => save(true)}>{lang === "ar" ? "نعم" : "Yes"}</button>
             <button className="btn-secondary" onClick={() => save(false)}>{lang === "ar" ? "لا" : "No"}</button>
           </div>
         </Modal>
       ) : null}
     </div>
   );
 }
 
 function detectType(el: HTMLElement): "text" | "button" | "image" | "section" | null {
  if (GLOBAL_FOCUS_EL && !GLOBAL_FOCUS_EL.contains(el)) return null;
   const tag = el.tagName.toLowerCase();
  if (GLOBAL_FOCUS_EL) {
    if (tag === "section") return null;
  }
  if (["h1", "h2", "h3", "p", "span", "div"].includes(tag) && el.innerText?.trim()) return "text";
   if (tag === "a" || tag === "button") return "button";
   if (tag === "img") return "image";
  if (tag === "section") { el.setAttribute("draggable", "true"); return "section"; }
   return null;
 }
 
function labelFor(t: "text" | "button" | "image" | "section") {
   if (t === "text") return "Text";
   if (t === "button") return "Button";
  if (t === "image") return "Image";
  return "Section";
 }
 
 function SidePanel({ children }: { children: React.ReactNode }) {
   return (
    <div className="fixed top-12 right-0 z-[58] w-[420px] h-[calc(100vh-48px)] border-l border-[var(--panel-border)] bg-[var(--panel-bg)] p-4 overflow-y-auto">
       {children}
     </div>
   );
 }
 
 function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
   return (
     <div className="fixed inset-0 z-[70] flex items-center justify-center">
       <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
       <div className="relative z-10 w-[92%] max-w-md rounded-2xl surface p-6 md:p-8 text-center overflow-hidden">
         {children}
       </div>
     </div>
   );
 }
 
 function recordButton(el: HTMLElement, setChanges: React.Dispatch<React.SetStateAction<Change[]>>) {
   const sel = computeSelector(el);
   const a = el as HTMLAnchorElement;
   const label = el.innerText;
   const href = a.href || "";
   setChanges((C) => {
     const idx = C.findIndex((c) => c.selector === sel && c.type === "button");
     const upd = { selector: sel, type: "button", label, href, style: "primary" } as Change;
     if (idx === -1) return [...C, upd];
     const copy = [...C]; copy[idx] = upd; return copy;
   });
 }
 
 function recordImage(el: HTMLElement, setChanges: React.Dispatch<React.SetStateAction<Change[]>>) {
   const sel = computeSelector(el);
   const img = el as HTMLImageElement;
   setChanges((C) => {
     const idx = C.findIndex((c) => c.selector === sel && c.type === "image");
     const upd = { selector: sel, type: "image", src: img.src || "", alt: img.alt || "" } as Change;
     if (idx === -1) return [...C, upd];
     const copy = [...C]; copy[idx] = upd; return copy;
   });
 }

function recordStyle(el: HTMLElement, setChanges: React.Dispatch<React.SetStateAction<Change[]>>, style: { fontSize?: string; fontWeight?: string; textAlign?: "left" | "center" | "right"; colorToken?: "primary" | "accent" }) {
  const sel = computeSelector(el);
  setChanges((C) => {
    const idx = C.findIndex((c) => c.selector === sel && c.type === "style");
    const prev = idx === -1 ? {} : (C[idx] as any).style || {};
    const upd = { selector: sel, type: "style", style: { ...prev, ...style } } as Change;
    if (idx === -1) return [...C, upd];
    const copy = [...C]; copy[idx] = upd; return copy;
  });
}

function inferColorToken(el: HTMLElement): "primary" | "accent" {
  const c = getComputedStyle(el).color;
  // Fallback: default to accent
  if (!c) return "accent";
  const inline = el.style.color || "";
  if (inline.includes("var(--brand-primary)")) return "primary";
  if (inline.includes("var(--brand-accent)")) return "accent";
  return "accent";
}

function closestSection(el: HTMLElement | null): HTMLElement | null {
  let cur: HTMLElement | null = el;
  while (cur) {
    const tag = cur.tagName?.toLowerCase();
    if (tag === "section" || cur.hasAttribute("data-edit-section")) return cur;
    cur = cur.parentElement as HTMLElement | null;
  }
  return null;
}

function moveSection(el: HTMLElement, delta: number, setChanges: React.Dispatch<React.SetStateAction<Change[]>>) {
  const sec = closestSection(el);
  if (!sec || !sec.parentElement) return;
  const parent = sec.parentElement;
  const children = Array.from(parent.children);
  const idx = children.indexOf(sec);
  const to = idx + delta;
  if (to < 0 || to >= children.length) return;
  parent.insertBefore(sec, delta < 0 ? children[to] : children[to].nextSibling);
  recordSectionChange(sec, setChanges, { op: "move" });
}

function duplicateSection(el: HTMLElement, setChanges: React.Dispatch<React.SetStateAction<Change[]>>) {
  const sec = closestSection(el);
  if (!sec || !sec.parentElement) return;
  const clone = sec.cloneNode(true) as HTMLElement;
  clone.style.outline = "";
  sec.parentElement.insertBefore(clone, sec.nextSibling);
  recordSectionChange(sec, setChanges, { op: "duplicate" });
}

function toggleSection(el: HTMLElement, hide: boolean, setChanges: React.Dispatch<React.SetStateAction<Change[]>>) {
  const sec = closestSection(el);
  if (!sec) return;
  sec.style.display = hide ? "none" : "";
  recordSectionChange(sec, setChanges, { op: hide ? "hide" : "show" });
}

function deleteSection(el: HTMLElement, setChanges: React.Dispatch<React.SetStateAction<Change[]>>) {
  const sec = closestSection(el);
  if (!sec || !sec.parentElement) return;
  sec.parentElement.removeChild(sec);
  recordSectionChange(sec, setChanges, { op: "delete" });
}

function recordSectionChange(el: HTMLElement, setChanges: React.Dispatch<React.SetStateAction<Change[]>>, meta: { op: "move" | "duplicate" | "hide" | "show" | "delete"; meta?: { from?: number; to?: number } }) {
  const sel = computeSelector(el);
  setChanges((C) => [...C, { selector: sel, type: "section", op: meta.op, meta: meta.meta } as any]);
}
