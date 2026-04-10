"use client";
import { createContext, useContext, useState, useCallback, useEffect } from "react";

type BannerState = {
  visible: boolean;
  message: string;
  role?: "status" | "alert";
};

type Ctx = {
  banner: BannerState;
  showSuccess: (msg: string) => void;
  dismiss: () => void;
};

const NotificationContext = createContext<Ctx | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [banner, setBanner] = useState<BannerState>({ visible: false, message: "", role: "status" });
  const showSuccess = useCallback((msg: string) => {
    setBanner({ visible: true, message: msg, role: "status" });
    if (typeof window !== "undefined") {
      try {
        const ev = new Event("komc-banner-shown");
        window.dispatchEvent(ev);
      } catch {}
    }
  }, []);
  const dismiss = useCallback(() => {
    setBanner((b) => ({ ...b, visible: false }));
  }, []);
  useEffect(() => {
    function handler(e: any) {
      const msg = e?.detail?.message || "Success";
      showSuccess(msg);
    }
    if (typeof window !== "undefined") {
      window.addEventListener("komc-contact-success" as any, handler);
      return () => window.removeEventListener("komc-contact-success" as any, handler);
    }
  }, [showSuccess]);
  return (
    <NotificationContext.Provider value={{ banner, showSuccess, dismiss }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
