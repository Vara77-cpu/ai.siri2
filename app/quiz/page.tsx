"use client"

import { useState } from "react"

export default function QuizPage() {

const [topic, setTopic] = useState("")
const [quiz, setQuiz] = useState<any[]>([])
const [answers, setAnswers] = useState<any>({})
const [score, setScore] = useState<number | null>(null)
const [loading, setLoading] = useState(false)

const generateQuiz = async () => {


if (!topic) return

setLoading(true)

const res = await fetch("/api/quiz", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ topic })
})

const data = await res.json()

const text = data.quiz

const questions = text.split("Q").slice(1).map((q:any) => {

  const lines = q.split("\n").filter((l:any)=>l.trim() !== "")

  const question = lines[0].replace(":", "")

  const options = lines.slice(1,5)

  const answer = lines.find((l:any)=>l.startsWith("Answer"))?.split(":")[1].trim()

  return {
    question,
    options,
    answer
  }

})

setQuiz(questions)
setLoading(false)

}

const selectAnswer = (qIndex:number, option:string) => {


setAnswers({
  ...answers,
  [qIndex]: option
})


}

const calculateScore = () => {


let correct = 0

quiz.forEach((q,i)=>{

  const selected = answers[i]?.charAt(0)

  if(selected === q.answer){
    correct++
  }

})

setScore(correct)

// UPDATE USER PROGRESS

const subject = localStorage.getItem("selectedSubject") || "General"

const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")

if(!currentUser.progress){
  currentUser.progress = {}
}

currentUser.progress[subject] = Math.min(
  100,
  (currentUser.progress[subject] || 0) + 10
)

localStorage.setItem("currentUser", JSON.stringify(currentUser))

const users = JSON.parse(localStorage.getItem("users") || "[]")

const updatedUsers = users.map((u:any)=>{

  if(u.email === currentUser.email){
    return currentUser
  }

  return u

})

localStorage.setItem("users", JSON.stringify(updatedUsers))


}

return (


<div className="min-h-screen bg-black text-white flex flex-col items-center pt-20">

  <h1 className="text-4xl font-bold mb-10">
    AI Quiz Generator
  </h1>

  <input
    placeholder="Enter topic (Example: Biology)"
    value={topic}
    onChange={(e)=>setTopic(e.target.value)}
    className="w-[400px] p-3 bg-gray-900 border border-gray-700 rounded-lg mb-4"
  />

  <button
    onClick={generateQuiz}
    className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg mb-10"
  >
    {loading ? "Generating..." : "Generate Quiz"}
  </button>

  {quiz.map((q:any, index:number)=> (

    <div key={index} className="w-[700px] bg-gray-900 p-6 rounded-lg border border-gray-700 mb-6">

      <h2 className="mb-4 font-semibold">
        Q{index+1}. {q.question}
      </h2>

      {q.options.map((opt:any,i:number)=> (

        <button
          key={i}
          onClick={()=>selectAnswer(index,opt)}
          className="block w-full text-left bg-gray-800 hover:bg-gray-700 p-3 rounded mb-2"
        >
          {opt}
        </button>

      ))}

    </div>

  ))}

  {quiz.length > 0 && (

    <button
      onClick={calculateScore}
      className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg"
    >
      Submit Quiz
    </button>

  )}

  {score !== null && (

    <div className="mt-8 text-2xl font-bold text-green-400">
      Score: {score} / {quiz.length}
    </div>

  )}

</div>

)

}
