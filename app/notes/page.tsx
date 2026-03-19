import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white">

      {/* TITLE */}
      <h1 className="text-6xl font-bold mb-4">
        AI.Siri
      </h1>

      {/* DESCRIPTION */}
      <p className="text-center max-w-xl mb-10 text-lg">
        AI Powered Learning Platform providing free education from Nursery to M.Tech
        with AI tutor, curriculum generator, notes generator and quizzes.
      </p>

      {/* EDUCATION MODES */}
      <div className="flex gap-4 mb-10">

        <Link href="/kids">
          <button className="bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded-lg font-semibold">
            Kids Mode
          </button>
        </Link>

        <Link href="/upperprimary">
          <button className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-semibold">
            Upper Primary
          </button>
        </Link>

        <Link href="/secondary">
          <button className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-lg font-semibold text-black">
            Secondary
          </button>
        </Link>

        <Link href="/dashboard">
          <button className="bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-lg font-semibold">
            College
          </button>
        </Link>

      </div>

      {/* AI FEATURES */}
      <div className="flex gap-4">

        <Link href="/ai-tutor">
          <button className="bg-black hover:bg-gray-800 px-6 py-3 rounded-lg font-semibold">
            Open AI Tutor
          </button>
        </Link>

        <Link href="/curriculum">
          <button className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold">
            AI Curriculum Generator
          </button>
        </Link>

        <Link href="/notes">
          <button className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-semibold">
            AI Notes Generator
          </button>
        </Link>

        <Link href="/dashboard">
          <button className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-lg font-semibold">
            Check Results
          </button>
        </Link>

      </div>

      {/* FOOTER */}
      <p className="mt-16 text-sm opacity-80">
        © 2026 AI.Siri Learning Platform
      </p>

    </main>
  )
}