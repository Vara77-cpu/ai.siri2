"use client"

type LessonTabsProps = {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function LessonTabs({ activeTab, setActiveTab }: LessonTabsProps) {

  const tabs = [
    { id: "lesson", label: "Lessons" },
    { id: "ai", label: "AI Tutor" },
    { id: "quiz", label: "Quiz" },
    { id: "notes", label: "Notes" },
    { id: "leaderboard", label: "Leaderboard" },
    { id: "progress", label: "Progress" },
  ]

  return (

    <div className="flex gap-4 flex-wrap">

      {tabs.map((tab) => (

        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 rounded-lg transition
          ${
            activeTab === tab.id
              ? "bg-blue-600 text-white"
              : "bg-white/10 text-white"
          }`}
        >

          {tab.label}

        </button>

      ))}

    </div>

  )
}