"use client"

export default function XPProgress(){

const progress = 0 // later connect to database

const radius = 70
const stroke = 10
const normalizedRadius = radius - stroke * 2
const circumference = normalizedRadius * 2 * Math.PI
const strokeDashoffset = circumference - progress / 100 * circumference

return(

<div className="xpCard">

<svg
height={radius * 2}
width={radius * 2}

>

<circle
stroke="rgba(255,255,255,0.15)"
fill="transparent"
strokeWidth={stroke}
r={normalizedRadius}
cx={radius}
cy={radius}
/>

<circle
stroke="url(#grad)"
fill="transparent"
strokeWidth={stroke}
strokeDasharray={circumference + " " + circumference}
style={{strokeDashoffset}}
strokeLinecap="round"
r={normalizedRadius}
cx={radius}
cy={radius}
/>

<defs>
<linearGradient id="grad">
<stop offset="0%" stopColor="#9333ea"/>
<stop offset="100%" stopColor="#6366f1"/>
</linearGradient>
</defs>

</svg>

<div className="centerText">

<div className="xpNumber">0</div>
<div className="xpLabel">XP</div>

</div>

<style jsx>{`

.xpCard{
display:flex;
align-items:center;
justify-content:center;
position:relative;
}

svg{
transform:rotate(-90deg);
}

.centerText{
position:absolute;
text-align:center;
}

.xpNumber{
font-size:28px;
font-weight:700;
}

.xpLabel{
font-size:12px;
color:#94a3b8;
}

`}</style>

</div>

)

}
