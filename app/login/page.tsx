"use client"

import { signIn } from "next-auth/react"

export default function LoginPage() {

  return (
    <div style={{
      height:"100vh",
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      background:"radial-gradient(circle at center,#020617,#000)",
      overflow:"hidden",
      position:"relative"
    }}>

      {/* 🌌 GLOW BLOBS */}
      <div style={{
        position:"absolute",
        width:"500px",
        height:"500px",
        background:"#9333ea",
        filter:"blur(200px)",
        top:"-120px",
        left:"-120px",
        animation:"float 8s ease-in-out infinite"
      }}/>

      <div style={{
        position:"absolute",
        width:"400px",
        height:"400px",
        background:"#6366f1",
        filter:"blur(180px)",
        bottom:"-120px",
        right:"-120px",
        animation:"float 10s ease-in-out infinite"
      }}/>

      {/* ✨ GLOW DUST PARTICLES */}
      <div className="dustContainer">
        {Array.from({ length: 30 }).map((_, i) => (
          <span
            key={i}
            className="dust"
            style={{
              left: `${Math.random()*100}%`,
              animationDuration: `${6 + Math.random()*6}s`,
              animationDelay: `${Math.random()*5}s`
            }}
          />
        ))}
      </div>

      {/* 🌍 HERO 3D GLOBE */}
      <div className="hero3d"/>

      {/* 💎 MAIN CARD */}
      <div
        className="liquidGlass shimmerPro bloom"
        style={{
          width:"420px",
          padding:"50px",
          borderRadius:"24px",
          textAlign:"center",
          transition:"0.4s",
          transform:"perspective(1000px)"
        }}

        onMouseMove={(e)=>{
          const card = e.currentTarget
          const rect = card.getBoundingClientRect()

          const x = e.clientX - rect.left
          const y = e.clientY - rect.top

          const rotateY = (x/rect.width - 0.5) * 15
          const rotateX = (y/rect.height - 0.5) * -15

          card.style.transform =
            `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
        }}

        onMouseLeave={(e)=>{
          e.currentTarget.style.transform =
            "perspective(1000px) rotateX(0deg) rotateY(0deg)"
        }}
      >

        <h1 style={{
          fontSize:"42px",
          marginBottom:"10px",
          fontWeight:"800",
          background:"linear-gradient(90deg,#9333ea,#c026d3)",
          WebkitBackgroundClip:"text",
          WebkitTextFillColor:"transparent"
        }}>
          AI.Siri
        </h1>

        <p style={{
          color:"#aaa",
          marginBottom:"40px"
        }}>
          Continue your learning journey
        </p>

        <button
          onClick={()=>signIn("google",{callbackUrl:"/welcome"})}
          style={{
            width:"100%",
            padding:"15px",
            borderRadius:"14px",
            border:"none",
            background:"linear-gradient(90deg,#9333ea,#c026d3)",
            color:"white",
            fontSize:"17px",
            fontWeight:"bold",
            cursor:"pointer",
            boxShadow:"0 10px 30px rgba(147,51,234,0.6)",
            transition:"0.3s",
            position:"relative",
            overflow:"hidden"
          }}

          onMouseEnter={(e)=>{
            e.currentTarget.style.transform="scale(1.08)"
          }}

          onMouseLeave={(e)=>{
            e.currentTarget.style.transform="scale(1)"
          }}
        >
          Sign in with Google
        </button>

      </div>

      {/* 🎨 STYLES */}
      <style>{`

        /* FLOAT */
        @keyframes float{
          0%{transform:translateY(0)}
          50%{transform:translateY(40px)}
          100%{transform:translateY(0)}
        }

        /* 💎 LIQUID GLASS */
        .liquidGlass{
          background: linear-gradient(
            135deg,
            rgba(255,255,255,0.08),
            rgba(255,255,255,0.02)
          );
          backdrop-filter: blur(40px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.15);
          box-shadow:
            inset 0 1px 1px rgba(255,255,255,0.2),
            0 20px 60px rgba(0,0,0,0.6);
        }

        /* ✨ SHIMMER */
        .shimmerPro::after{
          content:"";
          position:absolute;
          top:0;
          left:-120%;
          width:120%;
          height:100%;
          background:linear-gradient(
            120deg,
            transparent,
            rgba(255,255,255,0.25),
            transparent
          );
          animation: shimmer 3s infinite;
        }

        @keyframes shimmer{
          100%{ left:120%; }
        }

        /* 🌈 BLOOM */
        .bloom{
          box-shadow:
            0 0 20px rgba(168,85,247,0.5),
            0 0 60px rgba(168,85,247,0.3),
            0 0 120px rgba(168,85,247,0.2);
        }

        /* 🌍 HERO GLOBE */
        .hero3d{
          position:absolute;
          top:10%;
          right:10%;
          width:160px;
          height:160px;
          border-radius:50%;
          background: radial-gradient(circle at 30% 30%, #a855f7, #4c1d95, #020617);
          box-shadow:0 0 40px #9333ea;
          animation: float 6s ease-in-out infinite;
        }

        /* ✨ DUST */
        .dustContainer{
          position:absolute;
          width:100%;
          height:100%;
          pointer-events:none;
        }

        .dust{
          position:absolute;
          width:6px;
          height:6px;
          background: radial-gradient(circle,#c084fc,transparent);
          border-radius:50%;
          animation: dustFloat linear infinite;
        }

        @keyframes dustFloat{
          0%{transform:translateY(100vh);opacity:0}
          50%{opacity:1}
          100%{transform:translateY(-10vh);opacity:0}
        }

      `}</style>

    </div>
  )
}