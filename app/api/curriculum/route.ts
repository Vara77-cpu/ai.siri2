import Groq from "groq-sdk"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { topic, duration } = body

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    })

    const prompt = `
Create a structured learning curriculum.

Topic: ${topic}
Duration: ${duration}

Return:
Week wise learning plan.
Each week should contain:
- Topic
- What to learn
- Practice idea
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

    return Response.json({
      curriculum: completion.choices[0].message.content
    })

  } catch (error) {
    console.error(error)

    return Response.json(
      { error: "Failed to generate curriculum" },
      { status: 500 }
    )
  }
}