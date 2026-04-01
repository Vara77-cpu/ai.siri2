"use client"

import { useState } from "react"
import papers from "../data/papers.json"
import PreviousPaperCard from "../components/PreviousPaperCard"
import PaperFilter from "../components/PaperFilter"

export default function PreviousPapersPage() {

  const [subject, setSubject] = useState("")
  const [year, setYear] = useState("")

  const filtered = papers.filter((paper: any) => {
    return (
      (subject === "" || paper.subject === subject) &&
      (year === "" || paper.year === year)
    )
  })

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-black via-gray-900 to-black text-white">

      <h1 className="text-4xl font-bold mb-8">
        Previous Question Papers
      </h1>

      <PaperFilter setSubject={setSubject} setYear={setYear} />

      <div className="grid md:grid-cols-3 gap-6">

        {filtered.map((paper: any) => (
          <PreviousPaperCard key={paper.id} paper={paper} />
        ))}

      </div>

    </div>
  )
}