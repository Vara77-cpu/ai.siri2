import Groq from "groq-sdk"

export async function POST(req: Request) {

try {

const body = await req.json()
const { topic } = body

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

const prompt = `

Create a 5 question multiple choice quiz.

Topic: ${topic}

Return format exactly like:

Q1: Question text
A) option
B) option
C) option
D) option
Answer: A

Repeat for 5 questions.
`

const completion = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages: [
    {
      role: "user",
      content: prompt
    }
  ]
})

const quiz = completion.choices[0].message.content

return Response.json({ quiz })

} catch (error) {

console.error(error)

return Response.json(
  { error: "Quiz generation failed" },
  { status: 500 }
)

}

}
