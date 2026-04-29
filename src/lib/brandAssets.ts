export const BRAND_LOGO_PATH = "/brand/komc-logo-128.png";
export const BRAND_LOGO_OG_PATH = "/brand/komc-logo-512.png";
export const BRAND_LOGO_SVG_PATH = "/main_logo.svg";
export const BRAND_APPLE_TOUCH_ICON_PATH = "/apple-touch-icon.png";
export const BRAND_FAVICON_16_PATH = "/favicon-16x16.png";
export const BRAND_FAVICON_32_PATH = "/favicon-32x32.png";
export const BRAND_FAVICON_ICO_PATH = "/favicon.ico";

export function getBrandLogoAlt(lang: "ar" | "en") {
  return lang === "ar"
    ? "شعار خالد عمر للاستشارات البحرية والقانونية"
    : "Khaled Omer Maritime & Legal Consultancy logo";
}
