export function getBestLesson(data:any, subject:string, unit:string, lesson:string){

  const subjectData = data[subject]
  if(!subjectData) return null

  const unitData = subjectData.units.find(
    (u:any)=>u.name.toLowerCase().includes(unit)
  )

  if(!unitData) return null

  const lessonData = unitData.lessons.find(
    (l:any)=>l.title.toLowerCase().includes(lesson)
  )

  return lessonData || unitData.lessons[0]
}

export function getRelatedLessons(data:any, subject:string, unit:string){

  const subjectData = data[subject]
  if(!subjectData) return []

  const unitData = subjectData.units.find(
    (u:any)=>u.name.toLowerCase().includes(unit)
  )

  return unitData?.lessons.slice(0,5) || []
}