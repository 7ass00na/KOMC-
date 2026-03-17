'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function ScrollToTopButton() {
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

  const onClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-top"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          whileHover={reduce ? undefined : { scale: 1.06 }}
          whileTap={reduce ? undefined : { scale: 0.96 }}
          aria-label="Scroll to top"
          onClick={onClick}
          className={`fixed bottom-6 ${sideClass} z-50 h-9 w-9 md:h-11 md:w-11 rounded-lg bg-[var(--brand-accent)] text-black shadow-[0_8px_30px_rgba(0,0,0,0.25)] ring-1 ring-[var(--brand-accent)]/40 hover:bg-[color-mix(in oklab,var(--brand-accent),black_12%)] active:bg-[color-mix(in oklab,var(--brand-accent),black_22%)] active:translate-y-[1px] flex items-center justify-center transition`}
        >
          <svg className="h-4 w-4 md:h-[18px] md:w-[18px]" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 13l6-6 6 6M12 7v10" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
