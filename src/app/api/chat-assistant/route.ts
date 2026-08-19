import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";

export async function POST(req: Request) {
  try {
    const { topic, category, message, chatHistory = [] } = await req.json();

    const topicName = topic || "General Academic Topic";
    const categoryName = category || "General Education";
    const userPrompt = (message || "").trim();

    if (!userPrompt) {
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 });
    }

    let aiReply = "";

    // 1. Call Groq AI API
    if (process.env.GROQ_API_KEY) {
      try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const systemPrompt = `You are a friendly, highly intelligent AI study tutor for school students.
Topic: "${topicName}" | Level/Category: "${categoryName}"

CRITICAL INSTRUCTIONS FOR CLEAN OUTPUT:
1. ABSOLUTELY NO LaTeX markup or LaTeX commands (DO NOT write \\boxed{}, \\longrightarrow, \\underbrace{}, \\text{}, \\frac{}{}, \\[, \\]).
2. Write chemical equations and math formulas in simple plain readable text using unicode arrows/subscripts (e.g. "6 CO₂ + 6 H₂O + Light Energy ➔ C₆H₁₂O₆ + 6 O₂").
3. Use rich Markdown formatting: **bold key terms**, section headings (##, ###), bullet points (-), numbered lists (1.), and clean tables (| Col 1 | Col 2 |).
4. Be clear, encouraging, and engaging with fun emojis.`;

        const messagesForGroq: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
          { role: "system", content: systemPrompt },
        ];

        // Append recent chat history
        if (Array.isArray(chatHistory)) {
          chatHistory.slice(-6).forEach((msg: { sender: string; text: string }) => {
            if (msg.text && typeof msg.text === "string") {
              messagesForGroq.push({
                role: msg.sender === "user" ? "user" : "assistant",
                content: msg.text,
              });
            }
          });
        }

        messagesForGroq.push({
          role: "user",
          content: userPrompt,
        });

        const modelsToTry = [
          "openai/gpt-oss-120b",
        ];

        for (const modelName of modelsToTry) {
          try {
            const chatCompletion = await groq.chat.completions.create({
              messages: messagesForGroq,
              model: modelName,
              temperature: 0.6,
              max_tokens: 1500,
            });

            const content = chatCompletion.choices[0]?.message?.content;
            if (content && content.trim().length > 0) {
              aiReply = content.trim();
              console.log(`Groq AI Chat Success using model [${modelName}]`);
              break;
            }
          } catch (modelErr: any) {
            console.warn(`Groq model ${modelName} failed:`, modelErr?.message || modelErr);
          }
        }
      } catch (groqErr) {
        console.warn("Groq SDK integration error:", groqErr);
      }
    }



    if (aiReply) {
      return NextResponse.json({
        success: true,
        reply: aiReply,
        topic: topicName,
        category: categoryName,
      });
    }

    return NextResponse.json(
      { success: false, error: "AI service temporarily unavailable. Please try again." },
      { status: 500 }
    );
  } catch (err: any) {
    console.error("Chat Assistant API Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process AI chat" },
      { status: 500 }
    );
  }
}
