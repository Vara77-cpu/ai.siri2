"use client"

import { useEffect, useState } from "react"

export default function Leaderboard() {

const [leaders,setLeaders] = useState<any[]>([])

useEffect(()=>{

const progress = JSON.parse(localStorage.getItem("progress") || "{}")

const data = Object.entries(progress).map(([subject,value]:any)=>{

  return {
    subject,
    score:value
  }

})

data.sort((a:any,b:any)=>b.score-a.score)

setLeaders(data)

},[])

return(

<div className="min-h-screen bg-black text-white flex flex-col items-center pt-20">

  <h1 className="text-4xl font-bold mb-10">
    🏆 Top Learners
  </h1>

  <div className="w-[600px]">

    {leaders.length === 0 && (

      <p className="text-gray-400">
        No leaderboard data yet.
      </p>

    )}

    {leaders.map((item,index)=> (

      <div
        key={index}
        className="bg-gray-900 p-6 rounded-lg border border-gray-700 mb-4 flex justify-between"
      >

        <span>
          {index+1}. {item.subject}
        </span>

        <span className="text-green-400">
          {item.score}%
        </span>

      </div>

    ))}

  </div>

</div>

)

}
