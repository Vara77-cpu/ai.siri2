import Groq from "groq-sdk"

export async function POST(req: Request) {
  try {

    const body = await req.json()
    const { topic } = body

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    })

    const prompt = `
Create simple educational notes for students.

Topic: ${topic}

Return:
1. Definition
2. Explanation
3. Key Points
4. Example
5. Summary
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
      notes: completion.choices[0].message.content
    })

  } catch (error) {

    return Response.json(
      { error: "Notes generation failed" },
      { status: 500 }
    )

  }
}