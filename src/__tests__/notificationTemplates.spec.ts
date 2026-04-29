import { describe, expect, it } from "vitest";
import {
  buildMailtoUrl,
  buildWhatsAppUrl,
  DEVOPS_EMAIL,
  DEVOPS_WHATSAPP_NUMBER,
  getConsultationNotificationCopy,
  getDevOpsNotificationCopy,
  PRIMARY_WHATSAPP_NUMBER,
} from "@/lib/notificationTemplates";

describe("notificationTemplates", () => {
  it("builds the site-wide WhatsApp link with the updated phone number and English template", () => {
    const copy = getConsultationNotificationCopy("en");
    const href = buildWhatsAppUrl(PRIMARY_WHATSAPP_NUMBER, copy.whatsappMessage);

    expect(href.startsWith("https://wa.me/971543456591?text=")).toBe(true);
    expect(decodeURIComponent(href.split("?text=")[1] || "")).toContain("Hello, KOMC Team");
  });

  it("builds the site-wide WhatsApp link with Arabic content", () => {
    const copy = getConsultationNotificationCopy("ar");
    const href = buildWhatsAppUrl("+971 543 456 591", copy.whatsappMessage);

    expect(href.startsWith("https://wa.me/971543456591?text=")).toBe(true);
    expect(decodeURIComponent(href.split("?text=")[1] || "")).toContain("مرحبًا فريق خالد عمر");
  });

  it("builds localized DevOps contact links for Arabic email and WhatsApp", () => {
    const copy = getDevOpsNotificationCopy("ar");
    const whatsappHref = buildWhatsAppUrl(DEVOPS_WHATSAPP_NUMBER, copy.whatsappMessage);
    const emailHref = buildMailtoUrl(DEVOPS_EMAIL, copy.emailSubject, copy.emailBody);

    expect(whatsappHref.startsWith("https://wa.me/971509559088?text=")).toBe(true);
    expect(decodeURIComponent(whatsappHref.split("?text=")[1] || "")).toContain("شاهدت هذا الموقع");
    expect(emailHref.startsWith(`mailto:${DEVOPS_EMAIL}?subject=`)).toBe(true);
    expect(decodeURIComponent(emailHref.split("subject=")[1].split("&body=")[0])).toBe("عميل مهتم بإنشاء موقع إلكتروني جديد");
    expect(decodeURIComponent(emailHref.split("&body=")[1] || "")).toContain("يرجى التواصل معي");
  });

  it("omits the text query when the WhatsApp message is blank", () => {
    expect(buildWhatsAppUrl("+971 543 456 591", "   ")).toBe("https://wa.me/971543456591");
  });
});
