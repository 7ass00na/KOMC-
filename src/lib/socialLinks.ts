export type SocialLinkKind = "facebook" | "instagram" | "tiktok" | "email";

export type SocialLink = {
  kind: SocialLinkKind;
  href: string;
  label: string;
  hoverClassName: string;
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    kind: "facebook",
    href: "https://www.facebook.com/share/1GpGDQHDdL/",
    label: "Facebook",
    hoverClassName: "hover:bg-[#1877F2]/90 hover:text-white",
  },
  {
    kind: "instagram",
    href: "https://www.instagram.com/komc.23?igsh=MTNtZDF3NXdtdWdoMA==",
    label: "Instagram",
    hoverClassName: "hover:bg-[#E1306C]/90 hover:text-white",
  },
  {
    kind: "tiktok",
    href: "https://tiktok.com/@komc.23",
    label: "TikTok",
    hoverClassName: "hover:bg-[#000000]/90 hover:text-white",
  },
  {
    kind: "email",
    href: "mailto:info@khaledomer.ae",
    label: "Email",
    hoverClassName: "hover:bg-[#0f766e]/90 hover:text-white",
  },
];
