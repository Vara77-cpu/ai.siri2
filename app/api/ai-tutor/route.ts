import { NextResponse } from "next/server"

export async function POST(req: Request) {

try {

const body = await req.json()

const { classId, subject, lesson, question, image } = body

/* VALIDATION */

if (!question && !image) {
return NextResponse.json({
answer: "Please ask a question or upload an image."
})
}

/* BUILD USER MESSAGE */

let userMessage: any

if (image) {

userMessage = {
role: "user",
content: [
{
type: "text",
text: "Solve this problem from the image step by step and give final answer."
},
{
type: "image_url",
image_url: {
url: image
}
}
]
}

} else {

userMessage = {
role: "user",
content: question
}

}

/* API CALL */

const response = await fetch(
"https://api.groq.com/openai/v1/chat/completions",
{
method: "POST",
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${process.env.GROQ_API_KEY}`
},
body: JSON.stringify({
model: "meta-llama/llama-4-scout-17b-16e-instruct",
temperature: 0.4,
messages: [
{
role: "system",
content: `
You are an expert AI tutor.

Context:
Class: ${classId}
Subject: ${subject}
Lesson: ${lesson}

Rules:

* If simple question → give direct answer
* If complex → explain step-by-step
* Always give final answer clearly
* Keep it simple and student friendly
  `
  },
  userMessage
  ]
  })
  }
  )

const data = await response.json()

let answer =
data?.choices?.[0]?.message?.content ||
"AI could not generate a response."

/* HANDLE ARRAY RESPONSE */

if (Array.isArray(answer)) {
answer = answer.map((item: any) => item.text || "").join("")
}

/* CLEAN TEXT */

if (typeof answer === "string") {
answer = answer.replace(/\n{3,}/g, "\n\n")
}

return NextResponse.json({ answer })

} catch (error) {

console.error("AI Tutor Error:", error)

return NextResponse.json({
answer: "AI tutor failed. Please try again."
})

}

}
