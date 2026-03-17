"use client";
import AboutHero from "./AboutHero";

type Source = { src: string; type: string };

export default function CasesHero({
  title = "Case Studies & Legal Outcomes",
  subtitle = "Selected matters across admiralty, charter disputes, enforcement, and arbitration.",
  kicker = "Case Results",
  overlay = "none",
  sources = [
    { src: "/videos/about-hero.webm", type: "video/webm" },
    { src: "/videos/about-hero.mp4", type: "video/mp4" },
  ],
  poster = "/images/about-hero-poster.jpg",
  isRTL = false,
}: {
  title?: string;
  subtitle?: string;
  kicker?: string;
  overlay?: "none" | "soft" | "medium" | "strong";
  sources?: Source[];
  poster?: string;
  isRTL?: boolean;
}) {
  return (
    <AboutHero
      title={title}
      subtitle={subtitle}
      kicker={kicker}
      overlay={overlay}
      kickerVariant="filled"
      sources={sources}
      poster={poster}
      isRTL={isRTL}
    />
  );
}
