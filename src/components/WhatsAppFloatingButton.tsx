'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

export default function WhatsAppFloatingButton() {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();
  const { lang } = useLanguage();
  const sideClass = lang === 'ar' ? 'left-6' : 'right-6';

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 160);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const message =
    lang === 'ar'
      ? 'مرحبًا فريق خالد عمر، أنا أزور الموقع وأبحث عن تمثيل قانوني.\nيرجى التواصل معي بخصوص استشارة. شكرًا لكم.\n\n• الموضوع: استفسار بخصوص قضية قانونية\n• الاختصاص: الإمارات\n• وسيلة التواصل المفضلة: الهاتف/واتساب'
      : "Hello, KOMC Team, I'm visiting the website and seeking legal representation.\nPlease contact me regarding a consultation.\nThank you.\n\n• Matter: Legal case inquiry\n• Jurisdiction: UAE\n• Preferred contact: Phone/WhatsApp";
  const href = `https://wa.me/971551949881?text=${encodeURIComponent(message)}`;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="whatsapp-fab"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          whileHover={reduce ? undefined : { scale: 1.06 }}
          whileTap={reduce ? undefined : { scale: 0.96 }}
          className={`fixed bottom-6 md:bottom-20 ${sideClass} z-50 flex`}
        >
          <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={lang === 'ar' ? 'الدردشة عبر واتساب' : 'Chat on WhatsApp'}
            className="h-9 w-9 md:h-11 md:w-11 rounded-lg bg-[var(--brand-accent)] text-white dark:text-black shadow-[0_8px_30px_rgba(0,0,0,0.25)] ring-1 ring-[var(--brand-accent)]/40 grid place-items-center transition hover:bg-[color-mix(in oklab,var(--brand-accent),black_12%)] active:bg-[color-mix(in oklab,var(--brand-accent),black_22%)] active:translate-y-[1px]"
          >
            <svg className="h-5 w-5 md:h-6 md:w-6" viewBox="0 0 32 32" aria-hidden="true">
              <path
                fill="currentColor"
                d="M16 3C9.37 3 4 8.37 4 15c0 2.65.86 5.1 2.33 7.09L4.67 29l7.09-1.66A11.92 11.92 0 0 0 16 27c6.63 0 12-5.37 12-12S22.63 3 16 3zm0 22.5c-2.22 0-4.26-.72-5.93-1.94l-.42-.3-4.17.98.99-4.06-.32-.44A9.44 9.44 0 1 1 16 25.5z"
              />
              <path
                fill="currentColor"
                d="M19.11 17.53c-.27-.13-1.57-.77-1.82-.86-.24-.09-.42-.13-.6.13-.18.27-.69.86-.85 1.03-.16.18-.31.2-.58.07-.27-.13-1.15-.42-2.19-1.34-.81-.72-1.36-1.6-1.52-1.86-.16-.27-.02-.41.12-.54.12-.12.27-.31.4-.47.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.47-.07-.13-.6-1.45-.82-1.99-.22-.53-.44-.45-.6-.45h-.5c-.18 0-.47.07-.71.34-.24.27-.93.9-.93 2.21s.95 2.57 1.09 2.75c.13.18 1.86 2.84 4.51 3.99.63.27 1.13.43 1.52.55.64.2 1.22.17 1.68.1.51-.08 1.57-.64 1.8-1.26.22-.62.22-1.15.16-1.26-.07-.11-.24-.18-.51-.31z"
              />
            </svg>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
