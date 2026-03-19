"use client"

export default function AuroraGlow(){

return(

<div className="aurora">

<style jsx>{`

.aurora{
position:fixed;
inset:0;
z-index:1;
pointer-events:none;

background:
radial-gradient(circle at 30% 40%, rgba(139,92,246,.35), transparent 40%),
radial-gradient(circle at 70% 60%, rgba(79,70,229,.35), transparent 40%);

filter:blur(140px);

animation:auroraMove 20s linear infinite;
}

@keyframes auroraMove{

0%{ transform:translate(0,0) }

50%{ transform:translate(-120px,-80px) }

100%{ transform:translate(0,0) }

}

`}</style>

</div>

)

}