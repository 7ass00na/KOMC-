import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";

function detectPreferredLang(acceptLanguage: string | null): "ar" | "en" {
  const headerValue = acceptLanguage || "";
  const candidates = headerValue
    .split(",")
    .map((part) => part.trim())
    .map((part) => {
      const [tagPart, ...params] = part.split(";").map((item) => item.trim());
      const primary = (tagPart || "").toLowerCase().split("-")[0];
      let quality = 1;
      for (const param of params) {
        const match = param.match(/^q=(\d(?:\.\d+)?)$/i);
        if (match) quality = Number(match[1]);
      }
      return { primary, quality };
    })
    .filter((candidate) => candidate.primary === "ar" || candidate.primary === "en");

  if (!candidates.length) return "ar";
  candidates.sort((a, b) => b.quality - a.quality);
  return candidates[0].primary as "ar" | "en";
}

export default async function Home() {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const hasRecentIntro = Boolean(cookieStore.get("komc_intro_ts")?.value);
  const lastPath = cookieStore.get("komc_last_path")?.value;

  if (hasRecentIntro && lastPath) {
    try {
      const decoded = decodeURIComponent(lastPath);
      const valid =
        /^\/(ar|en)(\/|$)/.test(decoded) &&
        !decoded.includes("//") &&
        !decoded.includes("\\");
      if (valid) {
        redirect(decoded);
      }
    } catch {}
  }

  const siteLang = cookieStore.get("site_lang")?.value;
  const lang =
    siteLang === "ar" || siteLang === "en"
      ? siteLang
      : detectPreferredLang(headerStore.get("accept-language"));

  redirect(`/${lang}/home`);
}
