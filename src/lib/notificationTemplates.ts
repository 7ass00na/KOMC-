export type SupportedLang = "ar" | "en";

export const PRIMARY_WHATSAPP_NUMBER = "971543456591";
export const DEVOPS_WHATSAPP_NUMBER = "971509559088";
export const DEVOPS_EMAIL = "ahmedhussan068@gmail.com";

type NotificationCopy = {
  whatsappMessage: string;
  emailSubject: string;
  emailBody: string;
};

function resolveLang(lang: string | null | undefined): SupportedLang {
  return lang === "ar" ? "ar" : "en";
}

export function getConsultationNotificationCopy(lang: string | null | undefined): NotificationCopy {
  const locale = resolveLang(lang);
  if (locale === "ar") {
    return {
      whatsappMessage:
        "مرحبًا فريق خالد عمر، أنا أزور الموقع وأبحث عن تمثيل قانوني.\nيرجى التواصل معي بخصوص استشارة. شكرًا لكم.\n\n• الموضوع: استفسار بخصوص قضية قانونية\n• الاختصاص: الإمارات\n• وسيلة التواصل المفضلة: الهاتف/واتساب",
      emailSubject: "طلب تواصل جديد عبر موقع KOMC",
      emailBody:
        "مرحبًا فريق خالد عمر،\n\nأزور الموقع وأرغب في الحصول على استشارة قانونية. يرجى التواصل معي في أقرب وقت ممكن.\n\nمع الشكر.\n\n• الموضوع: استفسار بخصوص قضية قانونية\n• الاختصاص: الإمارات\n• وسيلة التواصل المفضلة: الهاتف/واتساب",
    };
  }

  return {
    whatsappMessage:
      "Hello, KOMC Team, I'm visiting the website and seeking legal representation.\nPlease contact me regarding a consultation.\nThank you.\n\n• Matter: Legal case inquiry\n• Jurisdiction: UAE\n• Preferred contact: Phone/WhatsApp",
    emailSubject: "New inquiry from the KOMC website",
    emailBody:
      "Hello, KOMC Team,\n\nI'm visiting the website and would like to request a legal consultation. Please contact me at your earliest convenience.\n\nThank you.\n\n• Matter: Legal case inquiry\n• Jurisdiction: UAE\n• Preferred contact: Phone/WhatsApp",
  };
}

export function getDevOpsNotificationCopy(lang: string | null | undefined): NotificationCopy {
  const locale = resolveLang(lang);
  if (locale === "ar") {
    return {
      whatsappMessage:
        "مرحبًا، شاهدت هذا الموقع وأرغب في إنشاء موقع إلكتروني مشابه لشركتي أو نشاطي التجاري. يرجى التواصل معي لمناقشة التفاصيل.",
      emailSubject: "عميل مهتم بإنشاء موقع إلكتروني جديد",
      emailBody:
        "مرحبًا،\n\nشاهدت هذا الموقع وأرغب في إنشاء موقع إلكتروني مشابه لشركتي أو نشاطي التجاري. يرجى التواصل معي لمناقشة المتطلبات والتفاصيل.\n\nمع الشكر.",
    };
  }

  return {
    whatsappMessage:
      "Hello, I have seen your website and would like to create a similar website for myself or my company. Please contact me to discuss the details.",
    emailSubject: "A website visitor is interested in building a new website",
    emailBody:
      "Hello,\n\nI have seen your website and would like to create a similar website for myself or my company. Please contact me so we can discuss the requirements and next steps.\n\nThank you.",
  };
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const normalizedPhone = phone.replace(/\D/g, "");
  const trimmedMessage = message.trim();
  if (!trimmedMessage) {
    return `https://wa.me/${normalizedPhone}`;
  }
  const encodedMessage = encodeURIComponent(trimmedMessage);
  return `https://wa.me/${normalizedPhone}?text=${encodedMessage}`;
}

export function buildMailtoUrl(email: string, subject: string, body: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
