import { NextRequest, NextResponse } from "next/server";

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  try {
    const { lang, messages } = (await req.json()) as { lang?: "en" | "ar"; messages?: ChatMessage[] };
    const apiKey = process.env.OPENAI_API_KEY || process.env.AZURE_OPENAI_KEY || "";
    const sysEn =
      "You are a legal intake assistant for a UAE-focused law consultancy (KOMC). Provide high-level guidance about UAE legal processes, jurisdiction, and documentation. Do not provide definitive legal advice—recommend booking a consultation with a licensed attorney. Keep answers concise and professional.";
    const sysAr =
      "أنت مساعد استقبال استشارات قانونية يركز على قوانين دولة الإمارات. قدم إرشادات عامة حول الإجراءات والمتطلبات والاختصاص والوثائق. لا تقدم نصائح قانونية نهائية — وجّه لحجز استشارة مع محامٍ مرخص. اجعل الإجابات مختصرة ومهنية.";
    const finalMessages: ChatMessage[] = [
      { role: "assistant", content: lang === "ar" ? sysAr : sysEn },
      ...(Array.isArray(messages) ? messages : []),
    ];

    const last = (messages || []).slice(-1)[0]?.content || "";

    // Simple intent classifier (EN/AR keywords)
    const classify = (text: string) => {
      const t = (text || "").toLowerCase();
      const ar = (text || "");
      const or = (...arr: string[]) => arr.some((k) => t.includes(k) || ar.includes(k));
      if (or("contract", "agreement", "breach", "clause", "عقد", "بنود", "إخلال")) return "contract";
      if (or("employment", "labour", "labor", "termination", "gratuity", "رواتب", "عمال", "إنهاء", "بدل نهاية خدمة")) return "employment";
      if (or("divorce", "custody", "alimony", "family", "personal status", "طلاق", "حضانة", "نفقة", "أحوال شخصية")) return "family";
      if (or("trademark", "copyright", "patent", "ip", "علامة", "حقوق التأليف", "براءة")) return "ip";
      if (or("injury", "negligence", "damage", "tort", "إصابة", "تعويض", "مسؤولية تقصيرية")) return "injury";
      if (or("real estate", "tenancy", "lease", "property", "DLD", "عقار", "إيجار", "ملكية", "دائرة الأراضي")) return "realestate";
      if (or("business", "company", "license", "incorporation", "LLC", "تأسيس", "رخصة", "شركة", "سجل تجاري")) return "business";
      return "general";
    };

    const domain = classify(last);

    // Structured templates per domain (high-level, non‑advisory)
    const templates = {
      en: {
        contract: (q: string) => [
          "Acknowledgment",
          `We understand your concern regarding: “${q.slice(0, 140)}”.`,
          "Principles",
          "Contract issues in the UAE are governed primarily by the UAE Civil Transactions Law (Federal Law No. 5 of 1985), including provisions on consent, cause, and obligations; specific sectors may have additional regulations.",
          "Next Steps",
          "1) Gather the executed agreement and annexes; 2) Identify the governing law and dispute clause; 3) Preserve correspondence and notices; 4) Seek a formal review to assess remedies (performance, termination, damages, or negotiation).",
          "Disclaimer",
          "This is general guidance, not legal advice. Please book a consultation for tailored counsel.",
        ].join("\n\n"),
        employment: (q: string) => [
          "Acknowledgment",
          `We note your employment query: “${q.slice(0, 140)}”.`,
          "Principles",
          "UAE Labour Law (Federal Decree‑Law No. 33 of 2021) and its Executive Regulations govern employment terms, termination, gratuity, leave, and non‑competition; free zones may add specific rules.",
          "Next Steps",
          "1) Collect the employment contract and recent pay slips; 2) Confirm notice and termination provisions; 3) Calculate gratuity and accrued entitlements; 4) Consider mediation via MOHRE or free‑zone authority before escalation.",
          "Disclaimer",
          "This is general guidance, not legal advice. Book a consultation for precise analysis.",
        ].join("\n\n"),
        family: (q: string) => [
          "Acknowledgment",
          `We understand your family matter: “${q.slice(0, 140)}”.`,
          "Principles",
          "Personal Status matters in the UAE are generally under Federal Law No. 28 of 2005 (as amended). Non‑Muslim family matters may follow updated non‑Muslim personal status frameworks in certain Emirates.",
          "Next Steps",
          "1) Compile marriage/birth certificates and residency details; 2) Determine applicable law/jurisdiction; 3) Prepare financial disclosures if maintenance/custody is involved; 4) Consider amicable settlement before court filings.",
          "Disclaimer",
          "Informational only; please seek tailored advice in a formal consultation.",
        ].join("\n\n"),
        ip: (q: string) => [
          "Acknowledgment",
          `We’ve noted your IP concern: “${q.slice(0, 140)}”.`,
          "Principles",
          "UAE IP is covered by the Trademarks Law (Federal Decree‑Law No. 36/2021), Copyright Law (Federal Decree‑Law No. 38/2021), and Patents (Federal Law No. 11/2021); enforcement may involve administrative and civil channels.",
          "Next Steps",
          "1) Gather proof of ownership/registration; 2) Document infringement (samples, dates); 3) Consider cease‑and‑desist and administrative complaints; 4) Evaluate civil claims and border measures if applicable.",
          "Disclaimer",
          "General information, not legal advice. Book a consultation for specific strategy.",
        ].join("\n\n"),
        injury: (q: string) => [
          "Acknowledgment",
          `We understand the injury claim: “${q.slice(0, 140)}”.`,
          "Principles",
          "Civil liability and damages are primarily under the UAE Civil Transactions Law (tort provisions). Medical negligence has dedicated regulations (e.g., Federal Decree‑Law No. 4/2016).",
          "Next Steps",
          "1) Secure medical reports and receipts; 2) Obtain incident documentation and witness details; 3) Consider police report/authority notices if relevant; 4) Assess causation and quantum before filing claims.",
          "Disclaimer",
          "Preliminary guidance only; schedule a consultation for case‑specific advice.",
        ].join("\n\n"),
        realestate: (q: string) => [
          "Acknowledgment",
          `We’ve noted your real estate issue: “${q.slice(0, 140)}”.`,
          "Principles",
          "Property and tenancy are regulated by the UAE Civil Transactions Law and emirate‑specific rules (e.g., Dubai Land Department/RERA regulations; Abu Dhabi/Dedicated municipal rules).",
          "Next Steps",
          "1) Collect title deeds/tenancy contracts; 2) Verify registration and payments; 3) Review notice requirements and penalty clauses; 4) Consider authority mediation before litigation.",
          "Disclaimer",
          "General guidance only; please book a consultation for tailored analysis.",
        ].join("\n\n"),
        business: (q: string) => [
          "Acknowledgment",
          `We understand your company formation/business query: “${q.slice(0, 140)}”.`,
          "Principles",
          "Company formation and licensing are governed by federal commercial rules and emirate/free‑zone authorities (e.g., DED, various free‑zones). Legal form affects liability, shareholding, and taxation/ESR compliance.",
          "Next Steps",
          "1) Choose legal form (LLC, branch, sole establishment, free‑zone); 2) Verify activity approvals; 3) Prepare MOA/AOA and UBO/KYC; 4) Complete licensing with authority and register for relevant compliance.",
          "Disclaimer",
          "Informational only; book a consultation for a tailored incorporation roadmap.",
        ].join("\n\n"),
        general: (q: string) => [
          "Acknowledgment",
          `Thanks for your question: “${q.slice(0, 140)}”.`,
          "Principles",
          "Legal outcomes in the UAE depend on jurisdiction, documents, and procedural rules. Preliminary guidance is helpful but not a substitute for detailed review.",
          "Next Steps",
          "1) Organize contracts/records; 2) Identify the relevant authority; 3) Consider negotiation/mediation pathways; 4) Book a tailored consultation for risk and remedy mapping.",
          "Disclaimer",
          "This is general information, not legal advice.",
        ].join("\n\n"),
      },
      ar: {
        contract: (q: string) => [
          "التأكيد",
          `نفهم قلقك بشأن: «${q.slice(0, 140)}».`,
          "المبادئ",
          "تنظم مسائل العقود في الإمارات بموجب قانون المعاملات المدنية (القانون الاتحادي رقم 5 لسنة 1985) بما في ذلك الرضا والسبب والالتزامات، مع لوائح خاصة ببعض القطاعات.",
          "الخطوات التالية",
          "1) جمع العقد والملاحق؛ 2) التحقق من القانون الواجب التطبيق وبند تسوية المنازعات؛ 3) حفظ المراسلات والإشعارات؛ 4) تقييم الخيارات (تنفيذ، فسخ، تعويض، تفاوض).",
          "إخلاء المسؤولية",
          "هذه معلومات عامة وليست نصيحة قانونية. يرجى حجز استشارة للحصول على توجيه مخصص.",
        ].join("\n\n"),
        employment: (q: string) => [
          "التأكيد",
          `لاحظنا استفسارك العمالي: «${q.slice(0, 140)}».`,
          "المبادئ",
          "ينظم قانون العمل الإماراتي (المرسوم بقانون اتحادي 33 لسنة 2021) ولوائحه التنفيذية شروط العمل وإنهائه ومكافأة نهاية الخدمة والإجازات وعدم المنافسة، مع قواعد إضافية في المناطق الحرة.",
          "الخطوات التالية",
          "1) جمع عقد العمل وكشوف الرواتب؛ 2) مراجعة الإشعار وبنود الإنهاء؛ 3) احتساب المستحقات؛ 4) بحث التسوية عبر الجهات المختصة (مثل وزارة الموارد البشرية أو سلطة المنطقة الحرة).",
          "إخلاء المسؤولية",
          "إرشاد عام وليس نصيحة قانونية. احجز استشارة لمزيد من الدقة.",
        ].join("\n\n"),
        family: (q: string) => [
          "التأكيد",
          `نفهم مسألتك الأسرية: «${q.slice(0, 140)}».`,
          "المبادئ",
          "تنظم الأحوال الشخصية عمومًا بموجب القانون الاتحادي رقم 28 لسنة 2005 (وتعديلاته). وقد تطبق أطر خاصة لغير المسلمين في بعض الإمارات.",
          "الخطوات التالية",
          "1) تجهيز وثائق الزواج/الميلاد والإقامة؛ 2) تحديد القانون والاختصاص؛ 3) إعداد الإفصاحات المالية عند الحاجة؛ 4) النظر في التسوية الودية قبل الدعاوى.",
          "إخلاء المسؤولية",
          "معلومات عامة وليست نصيحة قانونية. يرجى حجز استشارة للتفاصيل.",
        ].join("\n\n"),
        ip: (q: string) => [
          "التأكيد",
          `تم رصد مسألتك في الملكية الفكرية: «${q.slice(0, 140)}».`,
          "المبادئ",
          "تشمل تشريعات الملكية الفكرية في الإمارات قانون العلامات (36/2021)، حق المؤلف (38/2021)، وبراءات الاختراع (11/2021)، مع مسارات إدارية ومدنية للتنفيذ.",
          "الخطوات التالية",
          "1) إثبات الملكية/التسجيل؛ 2) توثيق التعدي؛ 3) إنذار أو شكوى إدارية؛ 4) تقييم الدعاوى المدنية وإجراءات المنافذ الحدودية عند الاقتضاء.",
          "إخلاء المسؤولية",
          "إرشاد عام وليس بديلاً للاستشارة القانونية المتخصصة.",
        ].join("\n\n"),
        injury: (q: string) => [
          "التأكيد",
          `نفهم مطالبتك بالتعويض: «${q.slice(0, 140)}».`,
          "المبادئ",
          "تنظم المسؤولية المدنية والتعويضات أحكام المسؤولية التقصيرية في قانون المعاملات المدنية؛ وتنظم المسؤولية الطبية بموجب المرسوم بقانون اتحادي رقم 4 لسنة 2016.",
          "الخطوات التالية",
          "1) حفظ التقارير والفواتير الطبية؛ 2) توثيق الواقعة والشهود؛ 3) محاضر الشرطة/الجهات إن لزم؛ 4) تقييم الرابطة السببية وقيمة الضرر قبل رفع الدعوى.",
          "إخلاء المسؤولية",
          "معلومات عامة؛ ننصح بحجز استشارة لتقييم دقيق.",
        ].join("\n\n"),
        realestate: (q: string) => [
          "التأكيد",
          `تمت مراجعة مسألتك العقارية: «${q.slice(0, 140)}».`,
          "المبادئ",
          "تنظم الملكية والإيجارات أحكام قانون المعاملات المدنية ولوائح كل إمارة (مثل تعليمات دائرة الأراضي/ريرا في دبي).",
          "الخطوات التالية",
          "1) جمع سندات الملكية/عقود الإيجار؛ 2) التحقق من التسجيل والمدفوعات؛ 3) مراجعة الإشعارات والعقوبات؛ 4) دراسة التسوية قبل التقاضي.",
          "إخلاء المسؤولية",
          "إرشاد عام وغير بديل عن الاستشارة القانونية.",
        ].join("\n\n"),
        business: (q: string) => [
          "التأكيد",
          `نفهم استفسارك حول تأسيس الأعمال: «${q.slice(0, 140)}».`,
          "المبادئ",
          "تخضع التأسيس والرخصة لأحكام اتحادية وسلطات محلية/مناطق حرة؛ يؤثر الشكل القانوني على المسؤولية والملكية والامتثال.",
          "الخطوات التالية",
          "1) تحديد الشكل القانوني؛ 2) التحقق من الأنشطة والموافقات؛ 3) إعداد عقود التأسيس وملفات المالك المستفيد؛ 4) استكمال الترخيص والالتزامات اللاحقة.",
          "إخلاء المسؤولية",
          "معلومات عامة. للحلول المخصصة يرجى حجز استشارة.",
        ].join("\n\n"),
        general: (q: string) => [
          "التأكيد",
          `شكرًا على سؤالك: «${q.slice(0, 140)}».`,
          "المبادئ",
          "تختلف النتائج بحسب الاختصاص والمستندات والإجراءات. الإرشاد الأولي لا يغني عن مراجعة مفصلة.",
          "الخطوات التالية",
          "1) ترتيب المستندات؛ 2) تحديد الجهة المختصة؛ 3) بحث التسوية الودية؛ 4) حجز استشارة لتقييم المخاطر والخيارات.",
          "إخلاء المسؤولية",
          "معلومة عامة وليست نصيحة قانونية.",
        ].join("\n\n"),
      },
    } as const;

    const templatedReply =
      (lang === "ar" ? templates.ar : templates.en)[domain as keyof typeof templates.en]?.(last) ||
      (lang === "ar" ? templates.ar.general(last) : templates.en.general(last));

    // If we have a clear domain match, prefer deterministic, compliant templates
    if (domain !== "general") {
      return NextResponse.json({ reply: templatedReply });
    }

    // Attempt OpenAI-style chat completion if API key exists
    if (apiKey) {
      try {
        const resp = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: finalMessages.map((m) => ({ role: m.role, content: m.content })),
            temperature: 0.2,
          }),
        });
        const data = await resp.json();
        const reply =
          data?.choices?.[0]?.message?.content ||
          (lang === "ar"
            ? "يرجى توضيح سؤالك، وسأقدم لك خطوات إرشادية وفق إطار القوانين الإماراتية."
            : "Please clarify your question and I will outline guidance under UAE legal frameworks.");
        return NextResponse.json({ reply });
      } catch {}
    }

    // Fallback, rule-based minimal answer
    const reply =
      (lang === "ar"
        ? `فهمت طلبك حول: «${last.slice(0, 120)}». عمومًا تتطلب القضايا في الإمارات تحديد الاختصاص، المستندات الداعمة، والمواعيد المحددة. سنقترح الخطوات الأساسية، ثم احجز استشارة لتقييم التفاصيل.`
        : `I understand your query: “${last.slice(0, 120)}”. In the UAE, matters generally require jurisdiction checks, supporting documents, and statutory timelines. I’ll outline preliminary steps; please book a consultation for specifics.`) +
      (lang === "ar"
        ? " \n\n• التحقق من الاختصاص\n• تجهيز المستندات\n• تقييم المخاطر والجدول الزمني\n• حجز استشارة تفصيلية"
        : " \n\n• Confirm jurisdiction\n• Prepare documentation\n• Assess risks and timelines\n• Book a detailed consultation");
    return NextResponse.json({ reply: templatedReply || reply });
  } catch {
    return NextResponse.json(
      {
        reply:
          "Service is temporarily unavailable. Please try again shortly or use WhatsApp for immediate help.",
      },
      { status: 200 }
    );
  }
}
