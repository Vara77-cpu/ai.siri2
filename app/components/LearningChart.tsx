"use client"

import {
LineChart,
Line,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer
} from "recharts"

const data = [
{day:"Mon", lessons:1},
{day:"Tue", lessons:2},
{day:"Wed", lessons:1},
{day:"Thu", lessons:3},
{day:"Fri", lessons:2},
{day:"Sat", lessons:4},
{day:"Sun", lessons:1}
]

export default function LearningChart(){

return(

<div className="chartCard">

<h3>Learning Activity</h3>

<div className="chart">

<ResponsiveContainer width="100%" height={220}>

<LineChart data={data}>

<XAxis dataKey="day" stroke="#94a3b8"/>

<YAxis stroke="#94a3b8"/>

<Tooltip/>

<Line
type="monotone"
dataKey="lessons"
stroke="#9333ea"
strokeWidth={3}
/>

</LineChart>

</ResponsiveContainer>

</div>

<style jsx>{`

.chartCard{
margin-top:40px;
background:rgba(255,255,255,.06);
border:1px solid rgba(255,255,255,.18);
backdrop-filter:blur(35px);
border-radius:24px;
padding:28px;
}

.chart{
margin-top:20px;
}

`}</style>

</div>

)

}
