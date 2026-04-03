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
    const last = (messages || []).slice(-1)[0]?.content || "";
    const reply =
      (lang === "ar"
        ? `فهمت طلبك حول: «${last.slice(0, 120)}». عمومًا تتطلب القضايا في الإمارات تحديد الاختصاص، المستندات الداعمة، والمواعيد المحددة. سنقترح الخطوات الأساسية، ثم احجز استشارة لتقييم التفاصيل.`
        : `I understand your query: “${last.slice(0, 120)}”. In the UAE, matters generally require jurisdiction checks, supporting documents, and statutory timelines. I’ll outline preliminary steps; please book a consultation for specifics.`) +
      (lang === "ar"
        ? " \n\n• التحقق من الاختصاص\n• تجهيز المستندات\n• تقييم المخاطر والجدول الزمني\n• حجز استشارة تفصيلية"
        : " \n\n• Confirm jurisdiction\n• Prepare documentation\n• Assess risks and timelines\n• Book a detailed consultation");
    return NextResponse.json({ reply });
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

