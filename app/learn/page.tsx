"use client"

import { Suspense } from "react"
import LearnContent from "./LearnContent"

export default function LearnPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LearnContent />
    </Suspense>
  )
}
