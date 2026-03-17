 'use client';
 import { useEffect, useState } from "react";
 
 export default function PageStateGate({ pageId, children }: { pageId: "home" | "about" | "services" | "cases" | "news"; children: React.ReactNode }) {
   const [inactive, setInactive] = useState<boolean>(false);
   const [msg, setMsg] = useState<string>("");
   useEffect(() => {
     let cancelled = false;
     async function load() {
       try {
         const res = await fetch("/api/admin/page-states", { cache: "no-store" });
         const ps = await res.json();
         const state = ps?.[pageId];
         const active = state?.active !== false;
         if (!cancelled) {
           setInactive(!active);
           setMsg(state?.maintenanceMessage || "");
         }
       } catch {}
     }
     load();
     const id = setInterval(load, 4000);
     return () => { cancelled = true; clearInterval(id); };
   }, [pageId]);
   if (!inactive) return <>{children}</>;
   return (
     <div className="min-h-screen hero-bg grid place-items-center px-5">
       <div className="max-w-2xl text-center space-y-3">
         <div className="text-2xl font-bold text-white">Sorry, the website is currently undergoing maintenance.</div>
         <div className="text-white/80">We are working to improve your experience.</div>
         <div className="text-white/80">The website is expected to be back online within an hour.</div>
         <div className="text-white/80">Thank you for your understanding.</div>
         {msg ? <div className="mt-4 text-sm text-[var(--brand-accent)]">{msg}</div> : null}
       </div>
     </div>
   );
 }
