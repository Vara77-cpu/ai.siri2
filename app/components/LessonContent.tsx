"use client"

type LessonContentProps = {
  lesson: string
}

export default function LessonContent({ lesson }: LessonContentProps) {

  return (

    <div className="space-y-4">

      <h1 className="text-2xl font-bold">
        Lesson: {lesson}
      </h1>

      <p>
        This is the learning material for the lesson.

        Here you can render:

        • videos  
        • explanations  
        • diagrams  
        • coding examples  
      </p>

    </div>

  )
}