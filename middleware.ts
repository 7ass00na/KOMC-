import { NextResponse, type NextRequest } from "next/server";

function redirect308(req: NextRequest, pathname: string) {
  return NextResponse.redirect(new URL(pathname, req.url), 301);
}

function detectPreferredLang(req: NextRequest): "ar" | "en" {
  const cookieLang = req.cookies.get("site_lang")?.value;
  if (cookieLang === "ar" || cookieLang === "en") return cookieLang;
  const al = req.headers.get("accept-language") || "";
  const candidates = al
    .split(",")
    .map((p) => p.trim())
    .map((p) => {
      const [tagPart, ...params] = p.split(";").map((x) => x.trim());
      const primary = (tagPart || "").toLowerCase().split("-")[0];
      let q = 1;
      for (const kv of params) {
        const m = kv.match(/^q=(\d(?:\.\d+)?)$/i);
        if (m) q = Number(m[1]);
      }
      return { primary, q };
    })
    .filter((c) => c.primary === "ar" || c.primary === "en");
  if (!candidates.length) return "ar";
  candidates.sort((a, b) => b.q - a.q);
  return candidates[0].primary as "ar" | "en";
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/") {
    const withinDay = !!req.cookies.get("komc_intro_ts")?.value;
    if (withinDay) {
      const raw = req.cookies.get("komc_last_path")?.value || "";
      try {
        const decoded = decodeURIComponent(raw);
        const valid = /^\/(ar|en)(\/|$)/.test(decoded) && !decoded.includes("//") && !decoded.includes("\\");
        if (valid) {
          const res = NextResponse.redirect(new URL(decoded, req.url), 302);
          res.headers.set("Vary", "Cookie");
          return res;
        }
      } catch {}
    }
    const lang = detectPreferredLang(req);
    const res = NextResponse.redirect(new URL(`/${lang}/home`, req.url), 302);
    res.headers.set("Vary", "Accept-Language, Cookie");
    return res;
  }
  if (!(pathname.startsWith("/en/") || pathname.startsWith("/ar/"))) return NextResponse.next();

  const lower = pathname.toLowerCase();
  if (lower !== pathname) return redirect308(req, lower);

  if (lower === "/en/about") return redirect308(req, "/en/about-us");
  if (lower === "/ar/about") return redirect308(req, "/ar/about-us");
  if (lower === "/en/contact") return redirect308(req, "/en/contact-us");
  if (lower === "/ar/contact") return redirect308(req, "/ar/contact-us");

  const lang = lower.startsWith("/ar/") ? "ar" : "en";
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-site-lang", lang);
  const res = NextResponse.next({ request: { headers: requestHeaders } });
  res.headers.set("Content-Language", lang);
  return res;
}

export const config = {
  matcher: ["/", "/en/:path*", "/ar/:path*"],
};
