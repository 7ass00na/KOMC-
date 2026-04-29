"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import WelcomingMessage from "@/components/WelcomingMessage";
import { deriveLabels, type WelcomeLabels } from "@/lib/welcomeLabels";
import { useLanguage } from "@/context/LanguageContext";

export default function WelcomeCardDemo() {
  const { lang, setLang } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<"ar" | "en">(lang);
  const [labels, setLabels] = useState<WelcomeLabels | null>(null);

  useEffect(() => {
    try {
      const l = deriveLabels(selectedLang);
      setLabels(l);
    } catch {
      setLabels({
        welcomeType: "new_visitor",
        userRole: "consumer",
        actionRequired: "cta_home",
        variant: "A",
        lang: selectedLang,
      });
    }
  }, [selectedLang]);

  return (
    <section className="section mx-auto max-w-6xl px-5 py-10">
      <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--brand-accent)]">
        Welcome Message Card
      </h2>
      <p className="mt-2 text-[var(--text-secondary)]">
        Toggle language to preview RTL/LTR layout and copy. This is a demo section only.
      </p>
      <div className="mt-6 rounded-2xl surface p-6 md:p-8 ring-1 ring-[var(--panel-border)]">
        <div className="flex items-center gap-6 lg:gap-8 max-[1024px]:flex-col">
          <div className="md:basis-[36%] lg:basis-[38%] max-[1024px]:basis-full grid place-items-center self-stretch">
            <div className="relative w-full max-[1024px]:aspect-[4/3] md:h-full rounded-xl overflow-hidden ring-1 ring-[var(--panel-border)] shadow-sm">
              <Image
                src="/images/team/khaled-omer.png"
                alt={selectedLang === "ar" ? "المدير التنفيذي" : "CEO"}
                fill
                sizes="(max-width: 480px) 100vw, (max-width: 1024px) 90vw, 480px"
                className="object-cover"
                priority
              />
            </div>
          </div>
          <div className="md:basis-[64%] lg:basis-[62%] max-[1024px]:basis-full">
            {labels && (
              <WelcomingMessage
                lang={selectedLang}
                labels={labels}
                labelsReady={true}
                onPrimary={() => {}}
                onChangeLang={(next) => {
                  setSelectedLang(next);
                  try {
                    setLang(next);
                  } catch {}
                }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
