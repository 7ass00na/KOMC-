export type WelcomeType = "new_visitor" | "returning" | "referral" | "campaign";
export type UserRole = "consumer" | "business" | "partner" | "student" | "other";
export type ActionRequired = "cta_home" | "cta_consult" | "cta_subscribe" | "none";

export type WelcomeLabels = {
  welcomeType: WelcomeType;
  userRole: UserRole;
  actionRequired: ActionRequired;
  campaign?: string;
  refDomain?: string;
  variant: "A" | "B";
  lang: "ar" | "en";
};

export function deriveLabels(lang: "ar" | "en"): WelcomeLabels {
  const now = Date.now();
  let ts = 0;
  try {
    ts = Number(localStorage.getItem("komc_intro_ts") || 0);
  } catch {}
  const returning = ts && now - ts < 7 * 24 * 60 * 60 * 1000;
  let ref = "";
  try {
    ref = document.referrer || "";
  } catch {}
  const params = new URLSearchParams(typeof location !== "undefined" ? location.search : "");
  const utmCampaign = params.get("utm_campaign") || undefined;
  let refDomain: string | undefined = undefined;
  try {
    if (ref) refDomain = new URL(ref).hostname;
  } catch {}
  let welcomeType: WelcomeType = "new_visitor";
  if (utmCampaign) welcomeType = "campaign";
  else if (refDomain && (typeof location === "undefined" || !location.hostname.includes(refDomain))) welcomeType = "referral";
  else if (returning) welcomeType = "returning";
  let userRole: UserRole = "consumer";
  try {
    const roleStored = localStorage.getItem("komc_role") as UserRole | null;
    if (roleStored) userRole = roleStored;
  } catch {}
  const actionRequired: ActionRequired = "cta_home";
  let variant: "A" | "B" = "A";
  try {
    const seed = localStorage.getItem("komc_ab") as "A" | "B" | null;
    if (seed) {
      variant = seed;
    } else {
      variant = Math.random() < 0.5 ? "A" : "B";
      localStorage.setItem("komc_ab", variant);
    }
  } catch {}
  return { welcomeType, userRole, actionRequired, campaign: utmCampaign, refDomain, variant, lang };
}

export function track(event: string, payload: Record<string, any>) {
  try {
    if (typeof window === "undefined") return;
    // Skip during vitest runs to avoid network errors in jsdom
    // @ts-ignore
    if (typeof process !== "undefined" && (process.env?.VITEST || process.env?.VITEST_WORKER_ID)) return;
    fetch("/api/analytics/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, payload, ts: Date.now() }),
      keepalive: true,
    });
  } catch {}
}
