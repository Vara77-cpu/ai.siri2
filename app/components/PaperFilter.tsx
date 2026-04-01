"use client"

interface Props {
  setSubject: (value: string) => void
  setYear: (value: string) => void
}

export default function PaperFilter({ setSubject, setYear }: Props) {
  return (
    <div className="flex gap-4 mb-8">

      <select
        onChange={(e) => setSubject(e.target.value)}
        className="p-3 rounded-lg bg-white/10 backdrop-blur border border-white/20"
      >
        <option value="">All Subjects</option>
        <option value="Data Structures">Data Structures</option>
        <option value="Operating Systems">Operating Systems</option>
        <option value="DBMS">DBMS</option>
        <option value="Computer Networks">Computer Networks</option>
      </select>

      <select
        onChange={(e) => setYear(e.target.value)}
        className="p-3 rounded-lg bg-white/10 backdrop-blur border border-white/20"
      >
        <option value="">All Years</option>
        <option value="2023">2023</option>
        <option value="2022">2022</option>
        <option value="2021">2021</option>
      </select>

    </div>
  )
}