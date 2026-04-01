"use client"

interface Paper {
  id: number
  title: string
  file: string
}

export default function PreviousPaperCard({ paper }: { paper: Paper }) {
  return (
    <div className="flex justify-between items-center p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 mb-6">

      <h2 className="text-lg font-semibold text-white">
        {paper.title}
      </h2>

      <div className="flex gap-3">

        <a
          href={paper.file}
          target="_blank"
          className="px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition"
        >
          Preview
        </a>

        <a
          href={paper.file}
          download
          className="px-4 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-700 transition"
        >
          Download
        </a>

      </div>

    </div>
  )
}