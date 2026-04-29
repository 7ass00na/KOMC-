'use client';
import { useResponsiveFloatingVisibility } from '@/hooks/useResponsiveFloatingVisibility';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { buildWhatsAppUrl, getConsultationNotificationCopy, PRIMARY_WHATSAPP_NUMBER } from '@/lib/notificationTemplates';
import Link from 'next/link';

export default function WhatsAppFloatingButton() {
  const visible = useResponsiveFloatingVisibility();
  const reduce = useReducedMotion();
  const { lang } = useLanguage();
  const sideClass = lang === 'ar' ? 'left-6' : 'right-6';

  const message = getConsultationNotificationCopy(lang).whatsappMessage;
  const href = buildWhatsAppUrl(PRIMARY_WHATSAPP_NUMBER, message);

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
          className={`fixed bottom-6 md:bottom-20 ${sideClass} z-[54] flex`}
        >
          <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={lang === 'ar' ? 'الدردشة عبر واتساب' : 'Chat on WhatsApp'}
            className="h-14 w-14 md:h-16 md:w-16 grid place-items-center transition active:translate-y-[1px]"
          >
            {reduce ? (
              <svg className="h-12 w-12 md:h-14 md:w-14" viewBox="0 0 512 512" aria-hidden="true" data-wa-icon>
                <path fill="var(--brand-accent)" d="M256 32C132.3 32 32 132.3 32 256c0 43.8 11.3 86.6 32.8 124.3L48 480l102-16.5C186.6 485 221 496 256 496c123.7 0 224-100.3 224-224S379.7 32 256 32z"/>
                <path fill="currentColor" d="M348.1 299.5c-4.8-2.4-28.4-14-32.8-15.6-4.4-1.6-7.6-2.4-10.8 2.4-3.2 4.8-12.4 15.6-15.2 18.8-2.8 3.2-5.6 3.6-10.4 1.2-28.4-14-47-25.2-66.1-57.2-5-8.6 5-8 14.4-26.8 1.6-3.2.8-6-0.4-8.4-1.2-2.4-10.8-26-14.8-35.6-3.9-9.6-7.9-8.3-10.8-8.5-2.8-.2-6-.2-9.2-.2-3.2 0-8.4 1.2-12.8 6-4.4 4.8-16.8 16.4-16.8 40 0 23.6 17.2 46.4 19.6 49.6 2.4 3.2 33.6 51.2 81.4 72 11.4 4.9 20.4 7.8 27.4 10 11.5 3.7 22 3.2 30.3 1.9 9.3-1.4 28.4-11.6 32.4-22.9 4-11.2 4-20.6 2.8-22.9-1.2-2.4-4.4-3.6-9.2-6z"/>
              </svg>
            ) : (
              <motion.div
                animate={{ y: [0, -6, 0, -3, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 4, ease: "easeOut" }}
              >
                <svg className="h-12 w-12 md:h-14 md:w-14" viewBox="0 0 512 512" aria-hidden="true" data-wa-icon>
                  <path fill="var(--brand-accent)" d="M256 32C132.3 32 32 132.3 32 256c0 43.8 11.3 86.6 32.8 124.3L48 480l102-16.5C186.6 485 221 496 256 496c123.7 0 224-100.3 224-224S379.7 32 256 32z"/>
                  <path fill="currentColor" d="M348.1 299.5c-4.8-2.4-28.4-14-32.8-15.6-4.4-1.6-7.6-2.4-10.8 2.4-3.2 4.8-12.4 15.6-15.2 18.8-2.8 3.2-5.6 3.6-10.4 1.2-28.4-14-47-25.2-66.1-57.2-5-8.6 5-8 14.4-26.8 1.6-3.2.8-6-0.4-8.4-1.2-2.4-10.8-26-14.8-35.6-3.9-9.6-7.9-8.3-10.8-8.5-2.8-.2-6-.2-9.2-.2-3.2 0-8.4 1.2-12.8 6-4.4 4.8-16.8 16.4-16.8 40 0 23.6 17.2 46.4 19.6 49.6 2.4 3.2 33.6 51.2 81.4 72 11.4 4.9 20.4 7.8 27.4 10 11.5 3.7 22 3.2 30.3 1.9 9.3-1.4 28.4-11.6 32.4-22.9 4-11.2 4-20.6 2.8-22.9-1.2-2.4-4.4-3.6-9.2-6z"/>
                </svg>
              </motion.div>
            )}
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
