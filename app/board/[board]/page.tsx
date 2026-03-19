import Link from "next/link"
import { syllabus } from "@/app/data/syllabus"

export default function ClassPage(){

  const classes = Object.keys(syllabus)   // 🔥 THIS FIX

  return (
    <div style={{ padding: "30px", color: "white" }}>
      
      <h1>Select Class (cbse)</h1>

      <div style={{ marginTop: "20px" }}>
        {classes.map((cls) => (
          <div key={cls} style={{ marginBottom: "10px" }}>
            <Link href={`/board/cbse/class/${cls}`}>
              {cls.toUpperCase()}
            </Link>
          </div>
        ))}
      </div>

    </div>
  )
}