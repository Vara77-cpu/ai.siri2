"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Lessons() {

const router = useRouter()

const [subject,setSubject] = useState("")

useEffect(()=>{

const sub = localStorage.getItem("selectedSubject")

if(sub){
  setSubject(sub)
}

},[])

const lessons = [
"Introduction",
"Basic Concepts",
"Examples",
"Practice",
"Advanced Topics"
]

const openLesson = (lesson:string)=>{

localStorage.setItem("selectedLesson", lesson)

router.push("/ai-tutor")

}

return(

<div className="min-h-screen bg-black text-white flex flex-col items-center pt-20">

  <h1 className="text-4xl font-bold mb-4">
    {subject} Lessons
  </h1>

  <p className="text-gray-400 mb-10">
    Select a lesson
  </p>

  <div className="grid grid-cols-2 gap-6">

    {lessons.map((lesson,index)=> (

      <button
        key={index}
        onClick={()=>openLesson(lesson)}
        className="bg-purple-600 hover:bg-purple-700 px-8 py-6 rounded-lg"
      >
        {lesson}
      </button>

    ))}

  </div>

</div>

)

}
