"use client"

import { useState } from "react"

export default function NotesPanel() {

  const [notes, setNotes] = useState<string>("")

  return (

    <div className="space-y-4">

      <h2 className="text-xl font-bold">
        Notes
      </h2>

      <textarea
        className="w-full h-40 p-4 bg-black/30 rounded"
        placeholder="Write your notes..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

    </div>

  )
}