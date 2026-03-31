"use client";
import AboutHero from "./AboutHero";

type Source = { src: string; type: string };

export default function ContactHero({
  title = "Start a Confidential Consultation",
  subtitle = "Tell us about your matter. We respond promptly and discreetly.",
  kicker = "Contact KOMC",
  overlay = "medium",
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
      size="section"
      sources={sources}
      poster={poster}
      isRTL={isRTL}
    />
  );
}
