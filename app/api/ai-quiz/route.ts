import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content:
                "You are an AI teacher generating quizzes for students. Always respond ONLY in valid JSON."
            },
            {
              role: "user",
              content: `Generate 5 quiz questions about ${topic}.
Return JSON in this format:

[
 {
  "question": "What is a linear equation?",
  "options": ["Equation with power 1","Quadratic equation","Logarithmic equation","Exponential equation"],
  "answer": "Equation with power 1"
 }
]`
            }
          ],
        }),
      }
    );

    const data = await response.json();

    const quiz =
      data?.choices?.[0]?.message?.content || "[]";

    return NextResponse.json({
      quiz
    });

  } catch (error) {

    return NextResponse.json({
      quiz: "[]"
    });

  }
}