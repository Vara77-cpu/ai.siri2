"use client"

export default function ProgressPanel() {

  const progress = 40

  return (

    <div>

      <h2 className="text-xl font-bold mb-4">
        Progress
      </h2>

      <div className="w-full bg-gray-700 h-4 rounded">

        <div
          className="bg-green-500 h-4 rounded"
          style={{ width: `${progress}%` }}
        />

      </div>

      <p className="mt-2">
        {progress}% Completed
      </p>

    </div>

  )
}