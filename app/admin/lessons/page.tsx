"use client"

import { useEffect, useState } from "react"

export default function AdminLessons(){

const [lessons,setLessons] = useState<any[]>([])

const [form,setForm] = useState({
  id:null,
  title:"",
  subject:"",
  unit:"",
  video_url:""
})

/* LOAD */
async function load(){
  const res = await fetch("/api/admin/lessons")
  const data = await res.json()
  setLessons(data)
}

useEffect(()=>{ load() },[])

/* SAVE (CREATE OR UPDATE) */
async function save(){

  if(!form.title || !form.subject || !form.unit) return

  const method = form.id ? "PUT" : "POST"

  await fetch("/api/admin/lessons",{
    method,
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(form)
  })

  setForm({
    id:null,
    title:"",
    subject:"",
    unit:"",
    video_url:""
  })

  load()
}

/* EDIT */
function edit(l:any){
  setForm(l)
}

/* DELETE */
async function remove(id:number){

  if(!confirm("Delete this lesson?")) return

  await fetch("/api/admin/lessons",{
    method:"DELETE",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({ id })
  })

  load()
}

return(

<div className="page">

<h1>Manage Lessons</h1>

{/* FORM */}
<div className="form">

  <input
    placeholder="Title"
    value={form.title}
    onChange={e=>setForm({...form,title:e.target.value})}
  />

  <input
    placeholder="Subject"
    value={form.subject}
    onChange={e=>setForm({...form,subject:e.target.value})}
  />

  <input
    placeholder="Unit"
    value={form.unit}
    onChange={e=>setForm({...form,unit:e.target.value})}
  />

  <input
    placeholder="Video URL / ID"
    value={form.video_url}
    onChange={e=>setForm({...form,video_url:e.target.value})}
  />

  <button onClick={save}>
    {form.id ? "Update Lesson" : "Add Lesson"}
  </button>

</div>

{/* LIST */}
<div className="list">

  {lessons.map(l=>(
    <div key={l.id} className="card">

      <h3>{l.title}</h3>
      <p>{l.subject} • {l.unit}</p>

      <div className="actions">
        <button onClick={()=>edit(l)}>Edit</button>
        <button onClick={()=>remove(l.id)}>Delete</button>
      </div>

    </div>
  ))}

</div>

<style jsx>{`

.page{
  padding:30px;
  color:white;
}

.form{
  display:grid;
  gap:10px;
  margin-bottom:30px;
}

input{
  padding:10px;
  background:#111;
  border:none;
  color:white;
}

button{
  padding:10px;
  background:#9333ea;
  border:none;
  color:white;
  cursor:pointer;
}

.list{
  display:grid;
  gap:15px;
}

.card{
  background:rgba(255,255,255,0.05);
  padding:15px;
  border-radius:12px;
}

.actions{
  display:flex;
  gap:10px;
  margin-top:10px;
}

.actions button{
  flex:1;
}

`}</style>

</div>
)
}