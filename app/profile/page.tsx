"use client"

import { useEffect, useState } from "react"

export default function Profile() {

const [progress,setProgress] = useState<any>({})
const [badges,setBadges] = useState<string[]>([])

useEffect(()=>{


const user = JSON.parse(localStorage.getItem("currentUser") || "{}")

const savedProgress = user.progress || {}

setProgress(savedProgress)

const newBadges:string[] = []

Object.values(savedProgress).forEach((value:any)=>{

  if(value >= 20){
    newBadges.push("⭐ Beginner Learner")
  }

  if(value >= 50){
    newBadges.push("📘 Subject Expert")
  }

  if(value >= 100){
    newBadges.push("🏆 Top Learner")
  }

})

setBadges(newBadges)


},[])

return(


<div className="min-h-screen bg-black text-white flex flex-col items-center pt-20">

  <h1 className="text-4xl font-bold mb-10">
    Student Profile
  </h1>

  <div className="w-[600px] mb-12">

    {Object.keys(progress).length === 0 && (

      <p className="text-gray-400">
        No progress yet. Start learning!
      </p>

    )}

    {Object.entries(progress).map(([subject,value]:any)=> (

      <div
        key={subject}
        className="bg-gray-900 p-6 rounded-lg border border-gray-700 mb-4"
      >

        <h2 className="text-xl font-semibold mb-2">
          {subject}
        </h2>

        <div className="w-full bg-gray-700 rounded-full h-4">

          <div
            className="bg-green-500 h-4 rounded-full"
            style={{width: `${value}%`}}
          />

        </div>

        <p className="mt-2 text-gray-400">
          {value}% completed
        </p>

      </div>

    ))}

  </div>

  <div className="w-[600px]">

    <h2 className="text-2xl font-bold mb-4">
      Rewards & Badges
    </h2>

    {badges.length === 0 && (

      <p className="text-gray-400">
        No badges yet.
      </p>

    )}

    {badges.map((badge,index)=> (

      <div
        key={index}
        className="bg-yellow-600 text-black px-6 py-4 rounded-lg mb-3 font-semibold"
      >
        {badge}
      </div>

    ))}

  </div>

</div>


)

}
