Rebuild Documentation — AI Legal Chat and Site Enhancements

توثيق إعادة البناء — دردشة قانونية بالذكاء الاصطناعي وتحسينات الموقع


Architecture Modifications
- Next.js App Router used across pages with deterministic SSR for language and intro logic.
- React 19 with Context for language and theme; RTL/dir propagation via LanguageContext.
- Framer Motion for micro-interactions and parallax hero; reduced-motion respected.
- AI legal chat added: floating FAB, modal, streaming API routes, and consent/audit layers.
- Analytics wiring added under api/analytics; no client PII stored without consent.

التعديلات المعمارية
- استخدام Next.js App Router عبر الصفحات مع منطق لغة/مقدمة حتمي في SSR.
- React 19 مع سياق للغة/الثيم؛ تمرير اتجاه RTL عبر LanguageContext.
- Framer Motion للحركات الدقيقة وبارالاكس الهيرو؛ مراعاة reduced-motion.
- إضافة دردشة قانونية: زر عائم، نافذة محادثة، مسارات بث، وموافقة/تدقيقات.
- توصيل التحليلات تحت api/analytics؛ لا يتم تخزين معلومات شخصية بدون موافقة.


Dependencies Updated
- Vercel AI SDK used for streamText in legal chat route.
- Ollama provider configured via src/lib/ollama.ts with selectable models.
- Vitest added for jsdom tests and coverage; config at vitest.config.ts.

التبعيات
- استخدام Vercel AI SDK للبث streamText في مسار الدردشة القانونية.
- إعداد مزود Ollama عبر src/lib/ollama.ts مع نماذج قابلة للاختيار.
- إضافة Vitest لاختبارات jsdom والتغطية؛ الإعداد في vitest.config.ts.


AI Legal Chat
- UI: src/components/AIChatFab.tsx with bilingual/RTL support, consent gating, export, clear-history modal.
- Server: 
  - src/app/api/legal-chat/route.ts using AI SDK + Ollama when enabled.
  - src/app/api/legal-chat/stream/route.ts edge streaming with greeting templates and fallback.
- Compliance: Encrypted audit endpoint at src/app/api/analytics/audit/route.ts.

الدردشة القانونية
- الواجهة: src/components/AIChatFab.tsx مع دعم ثنائي اللغة/RTL، موافقة، تصدير، ومسح السجل.
- الخادم:
  - src/app/api/legal-chat/route.ts باستخدام AI SDK + Ollama عند التفعيل.
  - src/app/api/legal-chat/stream/route.ts بث edge مع تحية ونمط تراجع.
- الامتثال: تدقيقات مشفرة عبر src/app/api/analytics/audit/route.ts.


UI/UX and Accessibility
- Chat FAB icon uses public/AI_Chat.png; sizes aligned to WhatsApp FAB and adjusted for EN/AR.
- Backdrop click-to-close, ESC handling, focus management, aria labels for dialog.
- Sticky, draggable chat header; keyboard nudging supported.
- Intro overlay video adjusted to 0.75x, autoplay reliability improved on mobile.
- Team card flip now full-card, mobile image coverage fixed, heights unified without scrollbars.

واجهة المستخدم وإمكانية الوصول
- أيقونة الدردشة من public/AI_Chat.png؛ محاذاة المقاسات مع واتساب ولغات EN/AR.
- إغلاق عبر الخلفية، تعامل ESC، إدارة تركيز، ووسوم aria للحوارات.
- رأس محادثة لاصق وقابل للسحب؛ دعم أسهم لوحة المفاتيح.
- تحسين تشغيل فيديو المقدمة بسرعة 0.75x واعتمادية أعلى على الهواتف.
- قلب بطاقة الفريق بالكامل وتغطية الصور على الجوال وتوحيد الارتفاع بدون تمرير.


Performance and Cleanup
- Moved browser-only logic to effects to prevent hydration mismatches.
- Removed unused icons and build scripts under public/icons and scripts/ where replaced.
- Ensured hero images use object-fit cover and eliminated layout shifts.
- Added deterministic greeting handling to reduce token usage on trivial salutations.

الأداء والتنظيف
- نقل منطق المتصفح إلى useEffect لتجنب تعارضات الهيدرشن.
- إزالة أيقونات وسكربتات غير مستخدمة ضمن public/icons وscripts/ بعد الاستبدال.
- ضمان تغطية صور الهيرو وإزالة اهتزازات التخطيط.
- تحكم تحياتي حتمي لتقليل الاستهلاك على التحيات البسيطة.


Testing
- src/__tests__/aiChatFab.modal.spec.tsx validates modal open/close, ESC, and confirmation.
- src/__tests__/legalStream.spec.ts validates streaming and greeting templates.

الاختبارات
- src/__tests__/aiChatFab.modal.spec.tsx يختبر فتح/إغلاق النافذة، ESC، والتأكيد.
- src/__tests__/legalStream.spec.ts يختبر البث وقوالب التحية.


Notable File Map
- src/components/AIChatFab.tsx
- src/components/WhatsAppFloatingButton.tsx
- src/app/api/legal-chat/route.ts
- src/app/api/legal-chat/stream/route.ts
- src/app/api/analytics/audit/route.ts
- src/lib/ollama.ts
- public/AI_Chat.png

خريطة الملفات البارزة
- src/components/AIChatFab.tsx
- src/components/WhatsAppFloatingButton.tsx
- src/app/api/legal-chat/route.ts
- src/app/api/legal-chat/stream/route.ts
- src/app/api/analytics/audit/route.ts
- src/lib/ollama.ts
- public/AI_Chat.png


Operational Notes
- Configure OLLAMA_BASE_URL and ENABLE_LEGAL_STREAMING to use live streaming with Ollama.
- Provide AUDIT_WEBHOOK_URL and AUDIT_ENC_KEY (base64) to enable encrypted audit logs.

ملاحظات تشغيلية
- ضبط OLLAMA_BASE_URL وENABLE_LEGAL_STREAMING لاستخدام البث المباشر مع Ollama.
- توفير AUDIT_WEBHOOK_URL وAUDIT_ENC_KEY (Base64) لتفعيل سجلات التدقيق المشفرة.
