Rebuild Documentation — Site Onboarding, Mobile Header/Menu, AI Chat

توثيق إعادة البناء — شاشة الترحيب، رأس/قائمة الجوال، دردشة الذكاء الاصطناعي


Architecture & Features
- Fixed header on mobile/tablet; stable state with dynamic dropdown positioned below header.
- Mobile dropdown panel uses measured header height (ResizeObserver + resize/orientation) for exact top offset.
- Layering: header z‑index above view; menu beneath header; page beneath menu.
- Onboarding flow: video → global cursor → welcome → “Go to Home” cursor → homepage, with race‑safe timers.
- Welcome overlay: bilingual content with RTL when Arabic is active.
- Cookie consent: deferred 30s, shows once per session after first user activity (mousemove/scroll/click/keydown).
- AI legal chat (Ollama + Vercel AI SDK) with streaming, consent, and encrypted audit endpoint.

البنية والميزات
- رأس ثابت للجوال/اللوحي؛ قائمة منسدلة أسفل الرأس متوافقة مع ارتفاعه.
- قياس ارتفاع الرأس (ResizeObserver) لتحديد موضع القائمة بشكل دقيق.
- الطبقات: الرأس أعلى جميع الطبقات؛ اللوحة أسفل الرأس؛ المحتوى أسفل اللوحة.
- تسلسل الترحيب: فيديو → مؤشر تحميل عالمي → شاشة ترحيب → مؤشر زر “الانتقال للصفحة الرئيسية” → الصفحة الرئيسية.
- شاشة الترحيب ثنائية اللغة مع اتجاه RTL عند اختيار العربية.
- إشعار الكوكيز: تأخير 30 ثانية، لمرة واحدة لكل جلسة بعد رصد تفاعل المستخدم.
- دردشة قانونية بالذكاء الاصطناعي بتدفق نصي، موافقة مسبقة، وتدقيقات مشفرة.


Files of Interest
- src/components/Header.tsx — fixed header; mobile dropdown panel and z‑index fixes.
- src/components/IntroOverlay.tsx — onboarding video, welcome overlay (RTL/EN), sequential loading.
- src/components/GlobalLoadingOverlay.tsx — global cursors with cancel/timed variants.
- src/components/CookieConsent.tsx — 30s deferred, once‑per‑session logic with activity detection.
- src/app/api/legal-chat/route.ts & stream/route.ts — streaming AI endpoints and fallbacks.
- src/lib/ollama.ts — provider config and legal system prompts (EN/AR).


Welcoming Message Update
- Mobile/tablet: image appears first with staggered entrance, then professional copy; ensures clear hierarchy.
- RTL applied on Arabic with dir and text alignment; consistent typography and spacing.
- File: src/components/IntroOverlay.tsx

تحديث رسالة الترحيب
- الجوال/اللوحي: تظهر الصورة أولًا يتبعها المحتوى بتسلسل انسيابي، مع ضبط هرمي واضح.
- دعم RTL عند العربية مع dir ومحاذاة نص؛ اتساق في الطباعة والمسافات.
- الملف: src/components/IntroOverlay.tsx
