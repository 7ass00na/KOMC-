"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function IntroOverlay() {
  const [show, setShow] = useState(true);
  const [muted, setMuted] = useState(true);
  const vidRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {}, []);

  useEffect(() => {
    const v = vidRef.current;
    if (!show || !v) return;
    const timer = setTimeout(() => {
      if (v.readyState < 2) {
        // video not ready → fail safe to skip
        endIntro();
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [show]);

  const endIntro = () => {
    setShow(false);
  };

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-black"
    >
      <div className="absolute inset-0">
        <video
          ref={vidRef}
          className="h-full w-full object-cover"
          autoPlay
          loop={false}
          muted={muted}
          playsInline
          onEnded={endIntro}
          poster="/images/about-hero-poster.jpg"
        >
          <source src="/videos/komc.mp4" type="video/mp4" />
          <source src="/videos/komc-intro.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70 pointer-events-none" />
      </div>
      <div className="absolute inset-0 flex items-end justify-between p-4 md:p-6">
        <div className="inline-flex items-center gap-2">
          <div className="relative h-8 w-8">
            <Image src="/favicon.ico" alt="KOMC" fill sizes="32px" className="object-contain" />
          </div>
          <span className="text-xs md:text-sm font-semibold text-white/80">Khaled Omer Maritime Consultancy</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMuted((m) => !m)}
            className="rounded-lg border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/15"
          >
            {muted ? "Unmute" : "Mute"}
          </button>
          <button
            onClick={endIntro}
            className="rounded-lg bg-[var(--brand-accent)] px-3 py-1.5 text-xs font-semibold text-black hover:opacity-90"
          >
            Skip Intro
          </button>
        </div>
      </div>
    </motion.div>
  );
}
