"use client";
import { useLanguage } from "@/context/LanguageContext";
import { useNotifications } from "@/context/NotificationContext";

export default function SuccessBanner() {
  const { banner, dismiss } = useNotifications();
  const { lang } = useLanguage();
  if (!banner.visible) return null;
  const isAr = lang === "ar";
  return (
    <div
      role={banner.role || "status"}
      aria-live="polite"
      className="sticky top-0 z-[100] w-full"
    >
      <div className={"mx-auto max-w-7xl px-5 pt-3 " + (isAr ? "text-right" : "text-left")}>
        <div className="rounded-xl ring-1 ring-[var(--panel-border)] bg-[color-mix(in_oklab,var(--brand-accent),white_88%)] dark:bg-[color-mix(in_oklab,var(--brand-accent),black_75%)] text-[var(--brand-primary)] px-4 py-3 shadow">
          <div className="flex items-start gap-3">
            <div className="mt-0.5" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="h-5 w-5">
                <path fill="currentColor" d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm-1 11 6-6 1.4 1.4-7.4 7.4-4-4L8.4 10 11 12Z"/>
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-semibold">{banner.message}</div>
            </div>
            <button
              onClick={dismiss}
              aria-label={isAr ? "إغلاق الإشعار" : "Close notification"}
              className="inline-flex items-center rounded-md px-2 py-1 text-sm ring-1 ring-[var(--panel-border)] hover:bg-[var(--panel-muted-bg)]"
            >
              {isAr ? "إغلاق" : "Close"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
