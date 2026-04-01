"use client"

import { useEffect, useState } from "react"

export default function AdminDashboard(){

const [lessons,setLessons] = useState<any[]>([])
const [users,setUsers] = useState<any[]>([])
const [loading,setLoading] = useState(true)

/* ✅ MAIN STATS */
const [stats,setStats] = useState({
  totalLessons:0,
  totalSubjects:0,
  totalUnits:0,
  totalUsers:0
})

/* 🔥 LOAD ALL DATA */
async function loadData(){
  try{

    const [statsRes, lessonsRes, usersRes] = await Promise.all([
      fetch("/api/admin/stats"),
      fetch("/api/admin/lessons"),
      fetch("/api/admin/users")
    ])

    const statsData = await statsRes.json()
    const lessonsData = await lessonsRes.json()
    const usersData = await usersRes.json()

    const safeLessons = Array.isArray(lessonsData) ? lessonsData : []
    const safeUsers = Array.isArray(usersData) ? usersData : []

    setLessons(safeLessons)
    setUsers(safeUsers)

    /* ✅ USE API STATS IF AVAILABLE */
    if(statsData){
      setStats({
        totalLessons: statsData.totalLessons ?? safeLessons.length,
        totalSubjects: statsData.totalSubjects ?? [...new Set(safeLessons.map(l=>l.subject))].length,
        totalUnits: statsData.totalUnits ?? [...new Set(safeLessons.map(l=>l.unit))].length,
        totalUsers: statsData.totalUsers ?? safeUsers.length
      })
    }

  }catch(e){
    console.log("Admin load error:", e)
  }

  setLoading(false)
}

/* 🔁 AUTO REFRESH */
useEffect(()=>{
  loadData()

  const interval = setInterval(()=>{
    loadData()
  }, 5000)

  return ()=> clearInterval(interval)
},[])

return(

<div className="layout">

{/* SIDEBAR */}
<div className="sidebar">
  <h2>AI.SIRI</h2>

  <nav>
    <a className="active">Dashboard</a>
    <a href="/admin/lessons">Lessons</a>
    <a>Users</a>
  </nav>
</div>

{/* MAIN */}
<div className="main">

<h1>Admin Dashboard</h1>

{/* STATS */}
<div className="stats">

  <div className="statCard">
    <h3>Total Lessons</h3>
    <p>{loading ? "..." : stats.totalLessons}</p>
  </div>

  <div className="statCard">
    <h3>Total Subjects</h3>
    <p>{loading ? "..." : stats.totalSubjects}</p>
  </div>

  <div className="statCard">
    <h3>Total Units</h3>
    <p>{loading ? "..." : stats.totalUnits}</p>
  </div>

  <div className="statCard">
    <h3>Total Users</h3>
    <p>{loading ? "..." : stats.totalUsers}</p>
  </div>

</div>

{/* RECENT LESSONS */}
<div className="section">

  <h2>Recent Lessons</h2>

  {loading && <p>Loading...</p>}

  <div className="grid">

    {lessons.slice(0,6).map(l=>(
      <div key={l.id} className="card">
        <h3>{l.title}</h3>
        <p>{l.subject} • {l.unit}</p>
      </div>
    ))}

  </div>

</div>

</div>

<style jsx>{`

.layout{
  display:flex;
  min-height:100vh;
  background:linear-gradient(135deg,#020617,#0f172a);
  color:white;
}

/* SIDEBAR */
.sidebar{
  width:220px;
  padding:20px;
  background:rgba(15,23,42,0.9);
  border-right:1px solid rgba(255,255,255,0.1);
}

.sidebar h2{
  color:#9333ea;
}

.sidebar nav{
  margin-top:30px;
  display:flex;
  flex-direction:column;
  gap:15px;
}

.sidebar a{
  color:#aaa;
  text-decoration:none;
}

.sidebar a.active{
  color:white;
}

/* MAIN */
.main{
  flex:1;
  padding:30px;
}

/* STATS */
.stats{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
  gap:20px;
  margin-bottom:30px;
}

.statCard{
  background:rgba(255,255,255,0.05);
  padding:20px;
  border-radius:16px;
  text-align:center;
  transition:0.3s;
}

.statCard:hover{
  transform:scale(1.05);
  background:rgba(255,255,255,0.1);
}

.statCard h3{
  margin:0;
  color:#aaa;
}

.statCard p{
  font-size:28px;
  margin-top:10px;
}

/* SECTION */
.section h2{
  margin-bottom:15px;
}

/* GRID */
.grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(220px,1fr));
  gap:20px;
}

/* CARD */
.card{
  background:rgba(255,255,255,0.05);
  padding:20px;
  border-radius:16px;
  transition:0.3s;
}

.card:hover{
  transform:scale(1.05);
  background:rgba(255,255,255,0.1);
}

.card h3{
  margin:0;
}

.card p{
  color:#aaa;
}

`}</style>

</div>

)
}