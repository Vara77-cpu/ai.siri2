import Groq from "groq-sdk";

export async function POST(req: Request) {

try {
const { question, level } = await req.json();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

let systemPrompt = "You are a helpful teacher.";

if (level === "Kids") {
  systemPrompt = "Explain for kids using very simple words and examples.";
}

if (level === "Primary") {
  systemPrompt = "Explain like a primary school teacher.";
}

if (level === "Secondary") {
  systemPrompt = "Explain like a high school teacher.";
}

if (level === "College") {
  systemPrompt = "Explain with detailed academic concepts.";
}

const completion = await groq.chat.completions.create({
 model: "llama-3.3-70b-versatile",
  messages: [
    {
      role: "system",
      content: systemPrompt
    },
    {
      role: "user",
      content: question
    }
  ]
});

const answer = completion.choices[0].message.content;

return new Response(
  JSON.stringify({ answer }),
  {
    headers: { "Content-Type": "application/json" }
  }
);

} catch (error) {
console.error("AI Error:", error);

return new Response(
  JSON.stringify({
    answer: "AI tutor encountered an error. Please try again."
  }),
  { status: 500 }
);


}

}
