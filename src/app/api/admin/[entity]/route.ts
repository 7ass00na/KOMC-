import { NextResponse, NextRequest } from "next/server";
import { readEntity, writeEntity, makeId } from "@/lib/store";

const SINGLETONS = new Set(["about", "header", "footer", "legal", "settings", "theme", "page-states", "seo", "scripts", "robots", "sitemap", "taxonomy"]);

async function initFor(entity: string) {
  if (SINGLETONS.has(entity)) {
    if (entity === "about") {
      return await readEntity(entity, { id: "about", content_en_html: "", content_ar_html: "", team: [], timeline: [] });
    }
    if (entity === "header") {
      return await readEntity(entity, {
        id: "header",
        siteName_en: "KOMC",
        siteName_ar: "كومك",
        logo: "",
        published_siteName_en: "KOMC",
        published_siteName_ar: "كومك",
        published_logo: "",
        menu: [],
      });
    }
    if (entity === "footer") {
      return await readEntity(entity, {
        id: "footer",
        siteName_en: "KOMC",
        siteName_ar: "كومك",
        logo: "",
        published_siteName_en: "KOMC",
        published_siteName_ar: "كومك",
        published_logo: "",
        links: [],
        socials: [],
        copyright: "",
      });
    }
    if (entity === "legal") {
      return await readEntity(entity, {
        id: "legal",
        privacy_en_html: "",
        privacy_ar_html: "",
        terms_en_html: "",
        terms_ar_html: "",
        disclaimer_en_html: "",
        disclaimer_ar_html: "",
      });
    }
    if (entity === "settings") {
      return await readEntity(entity, {
        id: "settings",
        languageToggle: true,
        themeToggle: true,
        cookiesEnabled: true,
        pageLoadingCursor: false,
        whatsapp: { enabled: false, number: "", message: "" },
        aiAssistant: { enabled: false, provider: "", widgetCode: "", show: "all" },
      });
    }
    if (entity === "theme") {
      return await readEntity(entity, {
        id: "theme",
        defaultLang: "en",
        fonts: { en: "", ar: "" },
        sizes: { heading: "2.25rem", subheading: "1.25rem" },
        colors: { primary: "#0F1E2E", secondary: "#E1BC89" },
      });
    }
    if (entity === "page-states") {
      return await readEntity(entity, {
        id: "page-states",
        header: { active: true, maintenanceMessage: "", draft: false, revisions: [], workflow: { status: "published", assignedTo: "", approvals: [] }, schedule: { publishAt: 0, unpublishAt: 0 } },
        footer: { active: true, maintenanceMessage: "", draft: false, revisions: [], workflow: { status: "published", assignedTo: "", approvals: [] }, schedule: { publishAt: 0, unpublishAt: 0 } },
        home: { active: true, maintenanceMessage: "", draft: false, revisions: [], workflow: { status: "published", assignedTo: "", approvals: [] }, schedule: { publishAt: 0, unpublishAt: 0 } },
        about: { active: true, maintenanceMessage: "", draft: false, revisions: [], workflow: { status: "published", assignedTo: "", approvals: [] }, schedule: { publishAt: 0, unpublishAt: 0 } },
        services: { active: true, maintenanceMessage: "", draft: false, revisions: [], workflow: { status: "published", assignedTo: "", approvals: [] }, schedule: { publishAt: 0, unpublishAt: 0 } },
        cases: { active: true, maintenanceMessage: "", draft: false, revisions: [], workflow: { status: "published", assignedTo: "", approvals: [] }, schedule: { publishAt: 0, unpublishAt: 0 } },
        news: { active: true, maintenanceMessage: "", draft: false, revisions: [], workflow: { status: "published", assignedTo: "", approvals: [] }, schedule: { publishAt: 0, unpublishAt: 0 } },
      });
    }
    if (entity === "seo") {
      return await readEntity(entity, {
        id: "seo",
        defaults: {
          title_en: "",
          title_ar: "",
          description_en: "",
          description_ar: "",
          keywords_en: "",
          keywords_ar: "",
          canonical: "",
          og_image: "",
          index: true,
          follow: true,
        },
      });
    }
    if (entity === "scripts") {
      return await readEntity(entity, {
        id: "scripts",
        analyticsProvider: "",
        gtagId: "",
        customHead: "",
        customBody: "",
        consentRequired: false,
      });
    }
    if (entity === "robots") {
      return await readEntity(entity, {
        id: "robots",
        text: "User-agent: *\nAllow: /\n",
        indexSite: true,
      });
    }
    if (entity === "sitemap") {
      return await readEntity(entity, {
        id: "sitemap",
        extraUrls: [],
      });
    }
    if (entity === "taxonomy") {
      return await readEntity(entity, {
        id: "taxonomy",
        tags: [],
        categories: { news: [], cases: [] },
      });
    }
  }
  if (entity === "users") {
    return await readEntity(entity, []);
  }
  if (entity === "services") {
    return await readEntity(entity, []);
  }
  if (entity === "cases") {
    return await readEntity(entity, []);
  }
  if (entity === "news") {
    return await readEntity(entity, []);
  }
  if (entity === "contact-messages") {
    return await readEntity(entity, []);
  }
  return await readEntity(entity, []);
}

export async function GET(_: NextRequest, context: { params: Promise<{ entity: string }> }) {
  const { entity } = await context.params;
  const data = await initFor(entity);
  if (entity === "page-states" && data) {
    try {
      const now = Date.now();
      const pages = ["header", "footer", "home", "about", "services", "cases", "news"] as const;
      for (const p of pages) {
        const sch = (data as any)?.[p]?.schedule;
        if (sch && (sch.publishAt || sch.unpublishAt)) {
          const publishAt = Number(sch.publishAt) || 0;
          const unpublishAt = Number(sch.unpublishAt) || 0;
          let active = (data as any)[p]?.active;
          if (publishAt && now >= publishAt && (!unpublishAt || now < unpublishAt)) active = true;
          if (unpublishAt && now >= unpublishAt) active = false;
          (data as any)[p] = { ...(data as any)[p], active };
        }
      }
    } catch {}
  }
  return NextResponse.json(data, { status: 200 });
}

export async function POST(req: NextRequest, context: { params: Promise<{ entity: string }> }) {
  const { entity } = await context.params;
  try {
    const body = await req.json();
    if (SINGLETONS.has(entity)) {
      const current = await initFor(entity);
      const merged = { ...current, ...body };
      await writeEntity(entity, merged);
      return NextResponse.json(merged, { status: 200 });
    }
    const list = (await initFor(entity)) as any[];
    const item = { id: body.id ?? makeId(entity.slice(0, 2)), ...body };
    list.push(item);
    await writeEntity(entity, list);
    return NextResponse.json(item, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Invalid payload" }, { status: 400 });
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ entity: string }> }) {
  const { entity } = await context.params;
  try {
    const body = await req.json();
    if (SINGLETONS.has(entity)) {
      const merged = { ...(await initFor(entity)), ...body };
      await writeEntity(entity, merged);
      return NextResponse.json(merged, { status: 200 });
    }
    const list = (await initFor(entity)) as any[];
    const idx = list.findIndex((x) => x.id === body.id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    list[idx] = { ...list[idx], ...body };
    await writeEntity(entity, list);
    return NextResponse.json(list[idx], { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Invalid payload" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ entity: string }> }) {
  const { entity } = await context.params;
  if (SINGLETONS.has(entity)) return NextResponse.json({ error: "Not allowed" }, { status: 405 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const list = (await initFor(entity)) as any[];
  const newList = list.filter((x) => x.id !== id);
  await writeEntity(entity, newList);
  return NextResponse.json({ ok: true }, { status: 200 });
}
