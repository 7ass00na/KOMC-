'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const ENABLE_OVERLAY = true;
const FORCE_CURSOR = true;

export default function GlobalLoadingOverlay() {
  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState<'default' | 'welcome'>('default');
  const [eventLang, setEventLang] = useState<'en' | 'ar' | null>(null);
  const [enabled, setEnabled] = useState<boolean>(false);
  const reduce = useReducedMotion();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { lang } = useLanguage();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('/api/admin/settings', { cache: 'no-store' });
        const d = await res.json();
        if (!cancelled) setEnabled(!!d?.pageLoadingCursor);
      } catch {
        if (!cancelled) setEnabled(false);
      }
    }
    load();
    function onUpdated(e: any) {
      const d = e?.detail;
      setEnabled(!!d?.pageLoadingCursor);
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('site-settings-updated' as any, onUpdated);
    }
    return () => {
      cancelled = true;
      if (typeof window !== 'undefined') {
        window.removeEventListener('site-settings-updated' as any, onUpdated);
      }
    };
  }, []);

  useEffect(() => {
    if (!FORCE_CURSOR && !enabled) return;
    const prevCursor = document.body.style.cursor;

    const showFor = (ms: number) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (ENABLE_OVERLAY) setVisible(true);
      document.body.style.cursor = 'progress';
      const t = setTimeout(() => {
        if (ENABLE_OVERLAY) setVisible(false);
        setVariant('default');
        setEventLang(null);
        document.body.style.cursor = prevCursor || '';
      }, ms);
      timerRef.current = t;
    };
    const showShort = () => showFor(2000);

    const isInternal = (href: string) => {
      try {
        const url = new URL(href, window.location.href);
        return url.origin === window.location.origin && !url.hash && !href.startsWith('mailto:') && !href.startsWith('tel:');
      } catch {
        return false;
      }
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target) return;
      const a = target.closest('a[href]') as HTMLAnchorElement | null;
      if (!a) return;
      if (a.target === '_blank' || a.rel?.includes('external') || a.hasAttribute('download')) return;
      const href = a.getAttribute('href') || '';
      if (isInternal(href)) showShort();
    };

    const onPopState = () => {
      showShort();
    };

    const onCustomShort = () => {
      showShort();
    };
    const onCustomTimed = (e: Event) => {
      // @ts-ignore
      const ms = Math.max(0, Number(e?.detail?.duration ?? 2500));
      // @ts-ignore
      const welcome = !!e?.detail?.welcome;
      // @ts-ignore
      const l = e?.detail?.lang === 'ar' ? 'ar' : e?.detail?.lang === 'en' ? 'en' : null;
      if (welcome) {
        setVariant('welcome');
        if (l) setEventLang(l);
      } else {
        setVariant('default');
        setEventLang(null);
      }
      showFor(ms || 2500);
    };

    document.addEventListener('click', onClick, true);
    window.addEventListener('popstate', onPopState);
    window.addEventListener('site-loading-short' as any, onCustomShort as any);
    window.addEventListener('site-loading' as any, onCustomTimed as any);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('site-loading-short' as any, onCustomShort as any);
      window.removeEventListener('site-loading' as any, onCustomTimed as any);
      document.body.style.cursor = prevCursor || '';
    };
  }, [enabled, reduce]);

  return (
    <AnimatePresence>
      {ENABLE_OVERLAY && visible && (
        <motion.div
          key="global-loading"
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.5 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(4,10,20,0.9)] backdrop-blur-sm"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="relative flex flex-col items-center">
            <div className="absolute -inset-16 -z-10 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),transparent_60%)]" />
            <motion.div
              className="relative h-20 w-20 rounded-full border-2 border-white/10"
              animate={reduce ? {} : { rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2.8, ease: 'linear' }}
            >
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-[var(--brand-accent)] border-t-transparent"
                data-global-cursor-line
                animate={reduce ? {} : { rotate: -360 }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
              />
              {variant === 'welcome' ? (
                <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                  <img src="/icon.svg" alt="" className="h-9 w-9" />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[var(--brand-accent)]" data-global-cursor-icon>
                  <ScalesIcon />
                </div>
              )}
            </motion.div>
            {variant === 'welcome' && (
              <div
                className="mt-5 text-center text-sm md:text-base text-white max-w-[80ch] px-6"
                aria-label="Welcome message"
                dir={(eventLang || lang) === 'ar' ? 'rtl' : 'ltr'}
              >
                {(eventLang || lang) === 'ar'
                  ? 'مرحبًا بكم في مكتب خالد عمر للمحاماة والاستشارات البحرية. يسعدنا دائمًا خدمتكم ونأمل أن نحظى برضاكم. 😊'
                  : 'Welcome to Khaled Omar Law and Maritime Consulting Office. We are always happy to serve you and hope to earn your satisfaction. 😊'}
              </div>
            )}
            {variant !== 'welcome' && (<div
              className="mt-5 text-sm:3xl tracking-widest uppercase text-white flex items-center flex-wrap gap-2"
              data-global-cursor-text
              aria-live="polite"
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
            >
              {(() => {
                const iconEl = (
                  <motion.span
                    className="inline-flex items-center"
                    animate={reduce ? undefined : { y: [0, -3, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 text-white dark:text-[var(--brand-accent)]">
                      <circle cx="12" cy="12" r="10" fill="currentColor" />
                      <circle cx="9" cy="10" r="1.2" fill="black" />
                      <circle cx="15" cy="10" r="1.2" fill="black" />
                      <path d="M8 15c1 .8 2.2 1.2 4 1.2s3-.4 4-1.2" stroke="black" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    </svg>
                  </motion.span>
                );
                const msg = lang === 'ar' ? 'جارٍ تهيئة تجربتك' : 'Preparing your experience';
                const parts = msg.split(' ');
                const wordsEl = (
                  <span className="inline-flex flex-wrap gap-x-1">
                    {parts.map((w, i) =>
                      <motion.span
                        key={i}
                        initial={{ y: 0 }}
                        animate={reduce ? undefined : { y: [0, -5, 0] }}
                        transition={reduce ? undefined : { duration: 0.9, ease: 'easeOut', repeat: Infinity, repeatDelay: 0.6, delay: i * 0.08 }}
                        className="inline-block"
                      >
                        {w}
                      </motion.span>
                    )}
                  </span>
                );
                return (
                  <>
                    {wordsEl}
                    {iconEl}
                  </>
                );
              })()}
            </div>)}
            {variant !== 'welcome' && (<div className="mt-2 text-sm md:text-base tracking-wide text-[var(--brand-accent)] flex flex-wrap gap-x-1">
              {(() => {
                const s = lang === 'ar' ? '# اتصل بنا ودع قضيتك لنا' : '# Call us & leave your case to us';
                const w = s.split(' ');
                return w.map((t, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: 0 }}
                    animate={reduce ? undefined : { y: [0, -4, 0] }}
                    transition={reduce ? undefined : { duration: 0.9, ease: 'easeOut', repeat: Infinity, repeatDelay: 0.6, delay: i * 0.07 }}
                    className="inline-block"
                  >
                    {t}
                  </motion.span>
                ));
              })()}
            </div>)}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ScalesIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3v3m-6 4l4 7a4 4 0 11-8 0l4-7zm12 0l4 7a4 4 0 11-8 0l4-7zM6 10h12M12 6c0 3-2 4-2 6v6m2-6c0 2-2 3-2 6m2-6c0 2 2 3 2 6"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
