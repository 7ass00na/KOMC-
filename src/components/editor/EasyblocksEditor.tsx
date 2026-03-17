 'use client';
import { useEffect, useMemo, useRef, useState } from "react";

type Blocks = {
  hero: {
    title: string;
    subtitle: string;
    ctaLabel: string;
    ctaHref: string;
    cta2Label?: string;
    cta2Href?: string;
    imageSrc: string;
  };
  trusted: { title: string; logos: { src: string; alt: string; href?: string }[] };
  services: {
    title: string;
    cards: { title: string; desc?: string; href?: string; icon?: string; image?: string }[];
  };
  cases: {
    title: string;
    cards: { title: string; summary?: string; href?: string; image?: string }[];
  };
  team: { title: string; members: { name: string; role?: string; photo?: string; href?: string }[] };
  news: { title: string; items: { title: string; href?: string; imageSrc?: string }[] };
  partners: { title: string; logos: { src: string; alt: string; href?: string }[] };
};

function defaultBlocks(lang: "en" | "ar"): Blocks {
  return lang === "ar"
    ? {
        hero: {
          title: "عنوان رئيسي",
          subtitle: "وصف موجز للقسم",
          ctaLabel: "اعرف المزيد",
          ctaHref: "/ar/services",
          cta2Label: "تواصل معنا",
          cta2Href: "/ar/contact",
          imageSrc: "/images/hero.jpg",
        },
        trusted: { title: "جهات موثوقة", logos: [] },
        services: { title: "خدماتنا", cards: [] },
        cases: { title: "الدراسات", cards: [] },
        team: { title: "فريقنا", members: [] },
        news: { title: "التحديثات القانونية", items: [] },
        partners: { title: "شركاؤنا", logos: [] },
      }
    : {
        hero: {
          title: "Hero Headline",
          subtitle: "Concise section subheadline",
          ctaLabel: "Learn more",
          ctaHref: "/en/services",
          cta2Label: "Contact us",
          cta2Href: "/en/contact",
          imageSrc: "/images/hero.jpg",
        },
        trusted: { title: "Trusted Clients", logos: [] },
        services: { title: "Our Services", cards: [] },
        cases: { title: "Case Studies", cards: [] },
        team: { title: "Our Legal Team", members: [] },
        news: { title: "Legal Updates", items: [] },
        partners: { title: "Partners", logos: [] },
      };
}

export default function EasyblocksEditor({
  pageId,
  lang,
  children,
  exitHref,
}: {
  pageId: "home";
  lang: "en" | "ar";
  children: React.ReactNode;
  exitHref?: string;
}) {
  const isAr = lang === "ar";
  const [status, setStatus] = useState<"editing" | "saved" | "draft">("editing");
  const [blocks, setBlocks] = useState<Blocks>(defaultBlocks(lang));
  const [section, setSection] = useState<keyof Blocks>("hero");
  const [confirm, setConfirm] = useState(false);
  const floatingRef = useRef<HTMLDivElement | null>(null);
  const [focusMode, setFocusMode] = useState<boolean>(false);

  // Load existing content
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
        const b = pc?.[pageId]?.blocks;
        if (!cancelled && b) setBlocks((prev) => ({ ...prev, ...b }));
      } catch {}
    }
    init();
    return () => {
      cancelled = true;
    };
  }, [pageId]);

  // Apply current blocks state to the live preview DOM
  useEffect(() => {
    function setText(id: string, text: string, selector?: string) {
      try {
        const root = document.getElementById(id);
        if (!root) return;
        const target = selector ? (root.querySelector(selector) as HTMLElement | null) : (root.querySelector("h1, h2, h3, p, span") as HTMLElement | null);
        if (target) target.innerText = text;
      } catch {}
    }
    function setAttr(id: string, selector: string, attr: string, value: string) {
      try {
        const root = document.getElementById(id);
        if (!root) return;
        const el = root.querySelector(selector) as HTMLElement | null;
        if (!el) return;
        (el as any).setAttribute(attr, value);
      } catch {}
    }
    function ensureContainer(id: string, containerId: string) {
      const root = document.getElementById(id);
      if (!root) return null;
      let box = document.getElementById(containerId);
      if (!box) {
        box = document.createElement("div");
        box.id = containerId;
        box.className = "mt-4";
        root.appendChild(box);
      }
      return box;
    }
    setText("hero", blocks.hero.title, "h1");
    setText("hero", blocks.hero.subtitle, "p");
    setText("hero", blocks.hero.ctaLabel, "a,button");
    setAttr("hero", "a", "href", blocks.hero.ctaHref);
    try {
      const heroRoot = document.getElementById("hero");
      if (heroRoot) {
        const ctas = heroRoot.querySelectorAll("a,button");
        if (ctas && ctas.length > 1 && blocks.hero.cta2Label) {
          (ctas[1] as HTMLElement).textContent = blocks.hero.cta2Label;
          (ctas[1] as HTMLAnchorElement).setAttribute("href", blocks.hero.cta2Href || "#");
        }
      }
    } catch {}
    try {
      const heroRoot = document.getElementById("hero");
      if (heroRoot) {
        const img = heroRoot.querySelector("img") as HTMLImageElement | null;
        if (img) img.src = blocks.hero.imageSrc;
        else (heroRoot as HTMLElement).style.backgroundImage = `url('${blocks.hero.imageSrc}')`;
      }
    } catch {}
    setText("trusted", blocks.trusted.title);
    setText("services", blocks.services.title);
    setText("cases", blocks.cases.title);
    setText("team", blocks.team.title);
    setText("news", blocks.news.title);
    setText("partners", blocks.partners.title);
    try {
      const pBox = ensureContainer("partners", "eb-logos-partners");
      if (pBox) {
        pBox.innerHTML = blocks.partners.logos
          .map(
            (l) =>
              `${l.href ? `<a href="${l.href}" target="_blank" rel="noopener">` : ""}` +
              `<img src="${l.src}" alt="${l.alt || ""}" style="max-height:40px;margin:6px;display:inline-block;vertical-align:middle;" />` +
              `${l.href ? `</a>` : ""}`
          )
          .join("");
      }
    } catch {}
    try {
      const tBox = ensureContainer("trusted", "eb-logos-trusted");
      if (tBox) {
        tBox.innerHTML = blocks.trusted.logos
          .map(
            (l) =>
              `${l.href ? `<a href="${l.href}" target="_blank" rel="noopener">` : ""}` +
              `<img src="${l.src}" alt="${l.alt || ""}" style="max-height:34px;margin:6px;display:inline-block;vertical-align:middle;opacity:.85" />` +
              `${l.href ? `</a>` : ""}`
          )
          .join("");
      }
    } catch {}
    try {
      const sBox = ensureContainer("services", "eb-cards-services");
      if (sBox) {
        sBox.innerHTML = blocks.services.cards.length
          ? `<div class="grid md:grid-cols-2 gap-4">${blocks.services.cards
              .map(
                (c) =>
                  `<div class="rounded-xl surface p-4 border border-white/10">
                    ${c.icon ? `<img src="${c.icon}" alt="" style="height:36px;width:36px;object-fit:contain;opacity:.9" />` : ""}
                    <div class="mt-2 font-semibold">${c.title || ""}</div>
                    ${c.desc ? `<div class="text-sm opacity-80 mt-1">${c.desc}</div>` : ""}
                    ${c.image ? `<img src="${c.image}" alt="" style="margin-top:8px;border-radius:12px;max-height:140px;object-fit:cover;width:100%" />` : ""}
                    ${c.href ? `<div class="mt-3"><a href="${c.href}" class="underline">${"Learn more"}</a></div>` : ""}
                   </div>`
              )
              .join("")}</div>`
          : "";
      }
    } catch {}
    try {
      const cBox = ensureContainer("cases", "eb-cards-cases");
      if (cBox) {
        cBox.innerHTML = blocks.cases.cards.length
          ? `<div class="grid md:grid-cols-2 gap-4">${blocks.cases.cards
              .map(
                (c) =>
                  `<div class="rounded-xl surface p-4 border border-white/10">
                    ${c.image ? `<img src="${c.image}" alt="" style="border-radius:12px;max-height:140px;object-fit:cover;width:100%" />` : ""}
                    <div class="mt-2 font-semibold">${c.title || ""}</div>
                    ${c.summary ? `<div class="text-sm opacity-80 mt-1">${c.summary}</div>` : ""}
                    ${c.href ? `<div class="mt-3"><a href="${c.href}" class="underline">${"Read case"}</a></div>` : ""}
                   </div>`
              )
              .join("")}</div>`
          : "";
      }
    } catch {}
    try {
      const nBox = ensureContainer("news", "eb-list-news");
      if (nBox) {
        nBox.innerHTML = blocks.news.items.length
          ? `<div class="grid md:grid-cols-2 gap-4">${blocks.news.items
              .map(
                (i) =>
                  `<div class="rounded-xl surface p-4 border border-white/10">
                    ${i.imageSrc ? `<img src="${i.imageSrc}" alt="" style="border-radius:12px;max-height:120px;object-fit:cover;width:100%" />` : ""}
                    <div class="mt-2">${i.href ? `<a href="${i.href}" class="underline">${i.title}</a>` : i.title}</div>
                   </div>`
              )
              .join("")}</div>`
          : "";
      }
    } catch {}
    try {
      const tmBox = ensureContainer("team", "eb-list-team");
      if (tmBox) {
        tmBox.innerHTML = blocks.team.members.length
          ? blocks.team.members
              .map(
                (m) =>
                  `<div class="inline-flex items-center gap-2 mr-3 mb-2">
                    <img src="${m.photo || "/person.svg"}" alt="${m.name}" style="height:36px;width:36px;border-radius:9999px;object-fit:cover"/>
                    <span>${m.href ? `<a href="${m.href}" class="underline">${m.name}</a>` : m.name}${m.role ? ` — ${m.role}` : ""}</span>
                   </div>`
              )
              .join("")
          : "";
      }
    } catch {}
  }, [blocks]);

  const toolbar = useMemo(() => {
    return (
      <div className="fixed top-0 left-0 right-0 z-[60] h-12 bg-[var(--brand-primary)]/90 backdrop-blur border-b border-white/10 flex items-center px-3 gap-3">
        <div className="text-xs font-semibold rounded-md px-2 py-1 bg-white/10 text-white">{isAr ? "محرر الكتل" : "Blocks Editor"}</div>
        <div className="text-xs text-white/80 uppercase">{pageId}</div>
        <label className="ml-3 inline-flex items-center gap-2 text-xs text-white/80">
          <input type="checkbox" onChange={(e)=>setFocusMode(e.target.checked)} />
          {isAr ? "تركيز على القسم" : "Focus section"}
        </label>
        <div className="flex-1" />
        <div className="text-xs text-white/80">{status.toUpperCase()}</div>
        <button className="h-9 px-3 rounded-md bg-[var(--brand-accent)] text-black font-semibold" onClick={() => setConfirm(true)}>
          {isAr ? "حفظ التغييرات" : "Save Changes"}
        </button>
        <button className="h-9 px-3 rounded-md border border-white/10 text-white" onClick={() => { if (exitHref) window.location.href = exitHref; else window.close(); }}>
          {isAr ? "خروج" : "Exit Editor"}
        </button>
      </div>
    );
  }, [status, pageId, isAr, exitHref]);

  // Optional focus dimming (does not remove other sections)
  useEffect(() => {
    function dimFor(id?: string) {
      try {
        const nodes = Array.from(document.querySelectorAll("section")) as HTMLElement[];
        nodes.forEach((n) => {
          if (!focusMode || !id || n.id === id) {
            n.style.opacity = "";
            n.style.filter = "";
            n.style.pointerEvents = "";
          } else {
            n.style.opacity = "0.4";
            n.style.filter = "grayscale(0.15)";
            n.style.pointerEvents = "auto";
          }
        });
      } catch {}
    }
    const currentId = typeof window !== "undefined" && window.location.hash ? decodeURIComponent(window.location.hash.slice(1)) : undefined;
    dimFor(currentId);
    const onHash = () => {
      const id = typeof window !== "undefined" && window.location.hash ? decodeURIComponent(window.location.hash.slice(1)) : undefined;
      dimFor(id);
    };
    if (typeof window !== "undefined") window.addEventListener("hashchange", onHash);
    return () => {
      if (typeof window !== "undefined") window.removeEventListener("hashchange", onHash);
      dimFor(undefined);
    };
  }, [focusMode]);

  async function save(reactivate: boolean) {
    const body: any = {};
    body[pageId] = { blocks };
    await fetch("/api/admin/page-content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const ps = await fetch("/api/admin/page-states", { cache: "no-store" }).then((r) => r.json());
    const next: any = { ...ps };
    next[pageId] = { ...(ps?.[pageId] || {}), active: reactivate ? true : false, draft: !reactivate };
    await fetch("/api/admin/page-states", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    setStatus("saved");
    if (reactivate) {
      if (exitHref) {
        window.location.href = exitHref;
      } else {
        setTimeout(() => window.close(), 300);
      }
    }
  }

  function SectionFields() {
    const label = (en: string, ar: string) => (isAr ? ar : en);
    if (section === "hero") {
      return (
        <div className="space-y-2">
          <label className="text-xs text-[var(--text-secondary)]">{label("Hero title", "عنوان البطل")}</label>
          <input
            className="input"
            value={blocks.hero.title}
            onChange={(e) => setBlocks((B) => ({ ...B, hero: { ...B.hero, title: e.target.value } }))}
            dir={isAr ? "rtl" : "ltr"}
          />
          <label className="text-xs text-[var(--text-secondary)]">{label("Hero subtitle", "وصف البطل")}</label>
          <textarea
            className="input min-h-[90px]"
            value={blocks.hero.subtitle}
            onChange={(e) => setBlocks((B) => ({ ...B, hero: { ...B.hero, subtitle: e.target.value } }))}
            dir={isAr ? "rtl" : "ltr"}
          />
          <label className="text-xs text-[var(--text-secondary)]">{label("CTA label", "نص الزر")}</label>
          <input
            className="input"
            value={blocks.hero.ctaLabel}
            onChange={(e) => setBlocks((B) => ({ ...B, hero: { ...B.hero, ctaLabel: e.target.value } }))}
            dir={isAr ? "rtl" : "ltr"}
          />
          <label className="text-xs text-[var(--text-secondary)]">{label("CTA link", "رابط الزر")}</label>
          <input
            className="input"
            value={blocks.hero.ctaHref}
            onChange={(e) => setBlocks((B) => ({ ...B, hero: { ...B.hero, ctaHref: e.target.value } }))}
            dir={isAr ? "rtl" : "ltr"}
          />
          <label className="text-xs text-[var(--text-secondary)]">{label("Hero image URL", "رابط صورة البطل")}</label>
          <input
            className="input"
            value={blocks.hero.imageSrc}
            onChange={(e) => setBlocks((B) => ({ ...B, hero: { ...B.hero, imageSrc: e.target.value } }))}
            dir={isAr ? "rtl" : "ltr"}
          />
        </div>
      );
    }
    function simpleField(key: keyof Blocks, en: string, ar: string) {
      const k = key as keyof Blocks;
      const val = (blocks as any)[k]?.title || "";
      return (
        <div className="space-y-2">
          <label className="text-xs text-[var(--text-secondary)]">{isAr ? ar : en}</label>
          <input
            className="input"
            value={val}
            onChange={(e) => setBlocks((B) => ({ ...B, [k]: { ...(B as any)[k], title: e.target.value } }))}
            dir={isAr ? "rtl" : "ltr"}
          />
        </div>
      );
    }
    if (section === "trusted") {
      return (
        <div className="space-y-2">
          {simpleField("trusted", "Trusted title", "عنوان الجهات الموثوقة")}
          <div className="mt-2 text-xs text-[var(--text-secondary)]">{isAr ? "شعارات" : "Logos"}</div>
          {(blocks.trusted.logos).map((l, i) => (
            <div key={i} className="grid grid-cols-5 gap-2 items-center">
              <input className="input col-span-3" placeholder={isAr ? "رابط الصورة" : "Image URL"} value={l.src} onChange={(e)=>setBlocks(B=>{ const arr=[...B.trusted.logos]; arr[i]={...arr[i],src:e.target.value}; return {...B, trusted:{...B.trusted, logos:arr}}; })} />
              <input className="input col-span-2" placeholder={isAr ? "نص بديل" : "Alt"} value={l.alt} onChange={(e)=>setBlocks(B=>{ const arr=[...B.trusted.logos]; arr[i]={...arr[i],alt:e.target.value}; return {...B, trusted:{...B.trusted, logos:arr}}; })} />
              <button className="btn-secondary mt-1" onClick={()=>setBlocks(B=>{ const arr=[...B.trusted.logos]; arr.splice(i,1); return {...B, trusted:{...B.trusted, logos:arr}}; })}>{isAr?"حذف":"Remove"}</button>
            </div>
          ))}
          <button className="btn-secondary" onClick={()=>setBlocks(B=>({...B, trusted:{...B.trusted, logos:[...B.trusted.logos, {src:"/images/logo.png", alt:""}]}}))}>{isAr?"إضافة شعار":"Add logo"}</button>
        </div>
      );
    }
    if (section === "services") {
      return (
        <div className="space-y-2">
          {simpleField("services", "Services title", "عنوان الخدمات")}
          <div className="mt-2 text-xs text-[var(--text-secondary)]">{isAr ? "البطاقات" : "Cards"}</div>
          {blocks.services.cards.map((c, i)=>(
            <div key={i} className="grid grid-cols-6 gap-2 items-start">
              <input className="input col-span-3" placeholder={isAr?"العنوان":"Title"} value={c.title} onChange={(e)=>setBlocks(B=>{ const arr=[...B.services.cards]; arr[i]={...arr[i],title:e.target.value}; return {...B, services:{...B.services, cards:arr}}; })}/>
              <input className="input col-span-3" placeholder={isAr?"الوصف":"Description"} value={c.desc||""} onChange={(e)=>setBlocks(B=>{ const arr=[...B.services.cards]; arr[i]={...arr[i],desc:e.target.value}; return {...B, services:{...B.services, cards:arr}}; })}/>
              <input className="input col-span-3" placeholder={isAr?"الرابط":"Href"} value={c.href||""} onChange={(e)=>setBlocks(B=>{ const arr=[...B.services.cards]; arr[i]={...arr[i],href:e.target.value}; return {...B, services:{...B.services, cards:arr}}; })}/>
              <input className="input col-span-2" placeholder={isAr?"أيقونة":"Icon URL"} value={c.icon||""} onChange={(e)=>setBlocks(B=>{ const arr=[...B.services.cards]; arr[i]={...arr[i],icon:e.target.value}; return {...B, services:{...B.services, cards:arr}}; })}/>
              <input className="input col-span-2" placeholder={isAr?"صورة":"Image URL"} value={c.image||""} onChange={(e)=>setBlocks(B=>{ const arr=[...B.services.cards]; arr[i]={...arr[i],image:e.target.value}; return {...B, services:{...B.services, cards:arr}}; })}/>
              <button className="btn-secondary" onClick={()=>setBlocks(B=>{ const arr=[...B.services.cards]; arr.splice(i,1); return {...B, services:{...B.services, cards:arr}}; })}>{isAr?"حذف":"Remove"}</button>
            </div>
          ))}
          <button className="btn-secondary" onClick={()=>setBlocks(B=>({...B, services:{...B.services, cards:[...B.services.cards, {title:isAr?"عنوان الخدمة":"Service title"}]}}))}>{isAr?"إضافة بطاقة":"Add card"}</button>
        </div>
      );
    }
    if (section === "cases") {
      return (
        <div className="space-y-2">
          {simpleField("cases", "Cases title", "عنوان الدراسات")}
          <div className="mt-2 text-xs text-[var(--text-secondary)]">{isAr ? "البطاقات" : "Cards"}</div>
          {blocks.cases.cards.map((c, i)=>(
            <div key={i} className="grid grid-cols-6 gap-2 items-start">
              <input className="input col-span-3" placeholder={isAr?"العنوان":"Title"} value={c.title} onChange={(e)=>setBlocks(B=>{ const arr=[...B.cases.cards]; arr[i]={...arr[i],title:e.target.value}; return {...B, cases:{...B.cases, cards:arr}}; })}/>
              <input className="input col-span-3" placeholder={isAr?"الملخص":"Summary"} value={c.summary||""} onChange={(e)=>setBlocks(B=>{ const arr=[...B.cases.cards]; arr[i]={...arr[i],summary:e.target.value}; return {...B, cases:{...B.cases, cards:arr}}; })}/>
              <input className="input col-span-3" placeholder={isAr?"الرابط":"Href"} value={c.href||""} onChange={(e)=>setBlocks(B=>{ const arr=[...B.cases.cards]; arr[i]={...arr[i],href:e.target.value}; return {...B, cases:{...B.cases, cards:arr}}; })}/>
              <input className="input col-span-3" placeholder={isAr?"صورة":"Image URL"} value={c.image||""} onChange={(e)=>setBlocks(B=>{ const arr=[...B.cases.cards]; arr[i]={...arr[i],image:e.target.value}; return {...B, cases:{...B.cases, cards:arr}}; })}/>
              <button className="btn-secondary" onClick={()=>setBlocks(B=>{ const arr=[...B.cases.cards]; arr.splice(i,1); return {...B, cases:{...B.cases, cards:arr}}; })}>{isAr?"حذف":"Remove"}</button>
            </div>
          ))}
          <button className="btn-secondary" onClick={()=>setBlocks(B=>({...B, cases:{...B.cases, cards:[...B.cases.cards, {title:isAr?"عنوان دراسة":"Case title"}]}}))}>{isAr?"إضافة بطاقة":"Add card"}</button>
        </div>
      );
    }
    if (section === "team") {
      return (
        <div className="space-y-2">
          {simpleField("team", "Team title", "عنوان الفريق")}
          <div className="mt-2 text-xs text-[var(--text-secondary)]">{isAr ? "الأعضاء" : "Members"}</div>
          {blocks.team.members.map((m, i)=>(
            <div key={i} className="grid grid-cols-5 gap-2 items-center">
              <input className="input col-span-2" placeholder={isAr?"الاسم":"Name"} value={m.name} onChange={(e)=>setBlocks(B=>{ const arr=[...B.team.members]; arr[i]={...arr[i],name:e.target.value}; return {...B, team:{...B.team, members:arr}}; })}/>
              <input className="input col-span-2" placeholder={isAr?"المنصب":"Role"} value={m.role||""} onChange={(e)=>setBlocks(B=>{ const arr=[...B.team.members]; arr[i]={...arr[i],role:e.target.value}; return {...B, team:{...B.team, members:arr}}; })}/>
              <input className="input col-span-3" placeholder={isAr?"صورة":"Photo URL"} value={m.photo||""} onChange={(e)=>setBlocks(B=>{ const arr=[...B.team.members]; arr[i]={...arr[i],photo:e.target.value}; return {...B, team:{...B.team, members:arr}}; })}/>
              <input className="input col-span-3" placeholder={isAr?"رابط":"Profile URL"} value={m.href||""} onChange={(e)=>setBlocks(B=>{ const arr=[...B.team.members]; arr[i]={...arr[i],href:e.target.value}; return {...B, team:{...B.team, members:arr}}; })}/>
              <button className="btn-secondary mt-1" onClick={()=>setBlocks(B=>{ const arr=[...B.team.members]; arr.splice(i,1); return {...B, team:{...B.team, members:arr}}; })}>{isAr?"حذف":"Remove"}</button>
            </div>
          ))}
          <button className="btn-secondary" onClick={()=>setBlocks(B=>({...B, team:{...B.team, members:[...B.team.members, {name:isAr?"عضو جديد":"New member"}]}}))}>{isAr?"إضافة عضو":"Add member"}</button>
        </div>
      );
    }
    if (section === "news") {
      return (
        <div className="space-y-2">
          {simpleField("news", "News title", "عنوان التحديثات")}
          <div className="mt-2 text-xs text-[var(--text-secondary)]">{isAr ? "العناوين" : "Items"}</div>
          {blocks.news.items.map((it, i)=>(
            <div key={i} className="grid grid-cols-5 gap-2 items-center">
              <input className="input col-span-3" placeholder={isAr?"العنوان":"Title"} value={it.title} onChange={(e)=>setBlocks(B=>{ const arr=[...B.news.items]; arr[i]={...arr[i],title:e.target.value}; return {...B, news:{...B.news, items:arr}}; })}/>
              <input className="input col-span-2" placeholder={isAr?"الرابط":"Href"} value={it.href||""} onChange={(e)=>setBlocks(B=>{ const arr=[...B.news.items]; arr[i]={...arr[i],href:e.target.value}; return {...B, news:{...B.news, items:arr}}; })}/>
              <input className="input col-span-3" placeholder={isAr?"صورة":"Image URL"} value={it.imageSrc||""} onChange={(e)=>setBlocks(B=>{ const arr=[...B.news.items]; arr[i]={...arr[i],imageSrc:e.target.value}; return {...B, news:{...B.news, items:arr}}; })}/>
              <button className="btn-secondary mt-1" onClick={()=>setBlocks(B=>{ const arr=[...B.news.items]; arr.splice(i,1); return {...B, news:{...B.news, items:arr}}; })}>{isAr?"حذف":"Remove"}</button>
            </div>
          ))}
          <button className="btn-secondary" onClick={()=>setBlocks(B=>({...B, news:{...B.news, items:[...B.news.items, {title:isAr?"عنوان جديد":"New title"}]}}))}>{isAr?"إضافة عنصر":"Add item"}</button>
        </div>
      );
    }
    if (section === "partners") {
      return (
        <div className="space-y-2">
          {simpleField("partners", "Partners title", "عنوان الشركاء")}
          <div className="mt-2 text-xs text-[var(--text-secondary)]">{isAr ? "شعارات" : "Logos"}</div>
          {blocks.partners.logos.map((l, i)=>(
            <div key={i} className="grid grid-cols-5 gap-2 items-center">
              <input className="input col-span-3" placeholder={isAr?"رابط الصورة":"Image URL"} value={l.src} onChange={(e)=>setBlocks(B=>{ const arr=[...B.partners.logos]; arr[i]={...arr[i],src:e.target.value}; return {...B, partners:{...B.partners, logos:arr}}; })}/>
              <input className="input col-span-2" placeholder={isAr?"نص بديل":"Alt"} value={l.alt} onChange={(e)=>setBlocks(B=>{ const arr=[...B.partners.logos]; arr[i]={...arr[i],alt:e.target.value}; return {...B, partners:{...B.partners, logos:arr}}; })}/>
              <input className="input col-span-2" placeholder={isAr?"الرابط":"Href"} value={l.href||""} onChange={(e)=>setBlocks(B=>{ const arr=[...B.partners.logos]; arr[i]={...arr[i],href:e.target.value}; return {...B, partners:{...B.partners, logos:arr}}; })}/>
              <button className="btn-secondary mt-1" onClick={()=>setBlocks(B=>{ const arr=[...B.partners.logos]; arr.splice(i,1); return {...B, partners:{...B.partners, logos:arr}}; })}>{isAr?"حذف":"Remove"}</button>
            </div>
          ))}
          <button className="btn-secondary" onClick={()=>setBlocks(B=>({...B, partners:{...B.partners, logos:[...B.partners.logos, {src:"/images/logo.png", alt:""}]}}))}>{isAr?"إضافة شعار":"Add logo"}</button>
        </div>
      );
    }
    return null;
  }

  return (
    <div className={"min-h-screen" + (isAr ? " rtl" : "")} dir={isAr ? "rtl" : "ltr"}>
      {toolbar}
      <div className="pt-12 grid" style={{ gridTemplateColumns: "70% 30%" }}>
        <div className="border-r border-[var(--panel-border)] min-h-[calc(100vh-48px)] overflow-auto">{children}</div>
        <div className="min-h-[calc(100vh-48px)] overflow-auto p-4">
          <div className="text-xs text-white/80 mb-2">{isAr ? "القسم" : "Section"}</div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {(["hero", "trusted", "services", "cases", "team", "news", "partners"] as (keyof Blocks)[]).map((k) => (
              <button
                key={k}
                className={"h-8 px-2 rounded border border-[var(--panel-border)] text-xs " + (section === k ? "bg-[var(--brand-accent)] text-black" : "hover:bg-black/10")}
                onClick={() => {
                  setSection(k);
                  if (typeof window !== "undefined") window.location.hash = k;
                }}
              >
                {isAr
                  ? { hero: "البطل", trusted: "الموثوقون", services: "الخدمات", cases: "الدراسات", team: "الفريق", news: "الأخبار", partners: "الشركاء" }[k]
                  : { hero: "Hero", trusted: "Trusted", services: "Services", cases: "Cases", team: "Team", news: "News", partners: "Partners" }[k]}
              </button>
            ))}
          </div>
          <SectionFields />
        </div>
      </div>
      <div
        ref={floatingRef}
        className="fixed z-[55] pointer-events-none select-none text-xs font-semibold rounded bg-[var(--brand-accent)] text-black px-2 py-1"
        style={{ display: "none" }}
      />
      {confirm ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirm(false)} />
          <div className="relative z-10 w-[92%] max-w-md rounded-2xl surface p-6 md:p-8 text-center overflow-hidden">
            <div className="text-sm font-semibold text-white/90">{isAr ? "تم حفظ جميع التغييرات بنجاح." : "All changes have been successfully saved."}</div>
            <div className="mt-1 text-xs text-[var(--text-secondary)]">{isAr ? "هل تريد إعادة تفعيل هذه الصفحة لزوار الموقع؟" : "Do you want to reactivate this page for website visitors?"}</div>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button className="btn-primary" onClick={() => save(true)}>{isAr ? "نعم" : "Yes"}</button>
              <button className="btn-secondary" onClick={() => save(false)}>{isAr ? "لا" : "No"}</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
