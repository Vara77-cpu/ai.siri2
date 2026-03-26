import { NextResponse } from "next/server"
import { syllabus } from "@/app/data/syllabus"

export async function GET(){

  let totalSubjects = 0
  let totalUnits = 0
  let totalLessons = 0

  Object.values(syllabus).forEach((cls:any)=>{
    const subjects = cls.subjects

    totalSubjects += Object.keys(subjects).length

    Object.values(subjects).forEach((sub:any)=>{
      totalUnits += sub.units.length

      sub.units.forEach((u:any)=>{
        totalLessons += u.lessons.length
      })
    })
  })

  return NextResponse.json({
    totalSubjects,
    totalUnits,
    totalLessons,
    totalUsers: 0 // later from DB
  })
}