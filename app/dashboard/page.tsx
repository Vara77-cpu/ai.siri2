"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import VantaBackground from "@/app/components/VantaBackground";
import AuroraGlow from "@/app/components/AuroraGlow";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [text, setText] = useState("");
  const [typingStarted, setTypingStarted] = useState(false);
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/login");
  }, [session, status, router]);

  const hour = new Date().getHours();
  let greeting = "Hello";
  if (hour < 12) greeting = "Good morning ☀️";
  else if (hour < 18) greeting = "Good afternoon 🚀";
  else greeting = "Good evening 🌙";

  const message = `${greeting} ${session?.user?.name || "Student"}.\nYour AI assistant is ready.\nContinue your learning journey.`;

  useEffect(() => {
    async function fetchProgress() {
      if (!session?.user?.email) return;
      try {
        const res = await fetch(`/api/progress?email=${session.user.email}`);
        const data = await res.json();
        if (data) setProgress(data);
      } catch {}
    }
    fetchProgress();
  }, [session]);

  useEffect(() => {
    if (!session || typingStarted) return;
    setTypingStarted(true);
    let i = 0;
    const typing = setInterval(() => {
      setText(message.slice(0, i));
      i++;
      if (i > message.length) clearInterval(typing);
    }, 35);
    return () => clearInterval(typing);
  }, [session, message, typingStarted]);

  function handleContinue() {
    if (progress) {
      router.push(
        `/board/${progress.board}/class/${progress.class}/subject/${progress.subject}/unit/${progress.unit}/lesson/${progress.lesson}`
      );
    } else {
      router.push("/board");
    }
  }

  if (status === "loading") return null;
  if (!session) return null;

  return (
    <div className="page">
      <VantaBackground />
      <AuroraGlow />
      <GlowParticles />

      <div className="content">
        <style jsx>{`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes pulseGlow {
            0%, 100% { box-shadow: 0 0 40px rgba(147,51,234,0.4), 0 0 80px rgba(147,51,234,0.2), 0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1); }
            50% { box-shadow: 0 0 60px rgba(168,85,247,0.7), 0 0 120px rgba(147,51,234,0.4), 0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15); }
          }
          @keyframes borderGlow {
            0%, 100% { border-color: rgba(147,51,234,0.3); }
            50% { border-color: rgba(168,85,247,0.6); }
          }
          @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          @keyframes blink {
            0%, 100% { opacity: 1; } 50% { opacity: 0; }
          }
          @keyframes scanline {
            0% { top: -10%; } 100% { top: 110%; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes cardEntrance {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes avatarPulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(147,51,234,0.6), 0 0 20px rgba(147,51,234,0.5); }
            50% { box-shadow: 0 0 0 8px rgba(147,51,234,0), 0 0 40px rgba(147,51,234,0.8); }
          }

          .page {
            min-height: 100vh;
            padding: 2rem;
            position: relative;
            overflow-x: hidden;
            background: #060010;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          /* Ambient blobs */
          .page::before {
            content: '';
            position: fixed;
            width: 600px; height: 600px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(147,51,234,0.15) 0%, transparent 70%);
            top: -100px; left: -100px;
            pointer-events: none;
            animation: float 8s ease-in-out infinite;
          }
          .page::after {
            content: '';
            position: fixed;
            width: 500px; height: 500px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(192,38,211,0.12) 0%, transparent 70%);
            bottom: -100px; right: -100px;
            pointer-events: none;
            animation: float 10s ease-in-out infinite reverse;
          }

          .content {
            position: relative;
            z-index: 2;
            max-width: 1000px;
            width: 100%;
            margin: 0 auto;
            animation: fadeUp 0.8s ease forwards;
          }

          .mainCard {
            background: rgba(8, 2, 20, 0.75);
            backdrop-filter: blur(40px);
            -webkit-backdrop-filter: blur(40px);
            border-radius: 48px;
            border: 1px solid rgba(147, 51, 234, 0.35);
            padding: 2.5rem;
            animation: pulseGlow 4s ease-in-out infinite, borderGlow 4s ease-in-out infinite;
            position: relative;
            overflow: hidden;
          }
          .mainCard::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(168,85,247,0.8), rgba(192,38,211,0.8), transparent);
            background-size: 200% auto;
            animation: shimmer 3s linear infinite;
          }
          .mainCard::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 48px;
            background: radial-gradient(ellipse at 50% 0%, rgba(147,51,234,0.08) 0%, transparent 60%);
            pointer-events: none;
          }

          .scanline {
            position: absolute; left: 0;
            width: 100%; height: 2px;
            background: linear-gradient(transparent, rgba(147,51,234,0.15), transparent);
            animation: scanline 4s linear infinite;
            pointer-events: none; z-index: 1;
          }

          .greetingSection { text-align: center; margin-bottom: 2rem; position: relative; z-index: 2; }
          .greetingText {
            font-size: 2.8rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            background: linear-gradient(135deg, #e879f9, #a855f7, #818cf8, #e879f9);
            background-size: 300% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: gradientShift 4s ease infinite;
            filter: drop-shadow(0 0 20px rgba(168,85,247,0.6));
          }
          .subheading {
            color: #a78bfa;
            font-size: 1rem;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            font-weight: 500;
            text-shadow: 0 0 20px rgba(167,139,250,0.5);
          }

          .aiPanel {
            background: rgba(0,0,0,0.5);
            border-radius: 28px;
            padding: 1.5rem 2rem;
            margin-bottom: 2rem;
            border: 1px solid rgba(147,51,234,0.25);
            position: relative; overflow: hidden; z-index: 2;
            box-shadow: 0 0 40px rgba(147,51,234,0.15), inset 0 0 30px rgba(147,51,234,0.05);
          }
          .aiPanel::after {
            content: '▋';
            position: absolute; right: 1.5rem; top: 50%;
            transform: translateY(-50%);
            color: #a855f7; font-size: 1.2rem;
            animation: blink 1s step-end infinite; opacity: 0.7;
          }
          .aiLabel {
            font-size: 0.7rem; letter-spacing: 0.2em; color: #7c3aed;
            text-transform: uppercase; margin-bottom: 0.5rem; font-weight: 600;
          }
          .aiText {
            font-size: 1.2rem; color: #e2e8ff;
            white-space: pre-wrap; font-family: 'Courier New', monospace;
            text-shadow: 0 0 15px rgba(147,51,234,0.7), 0 0 30px rgba(147,51,234,0.3);
            line-height: 1.6;
          }

          .statsRow {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem; margin-bottom: 2rem; position: relative; z-index: 2;
          }
          .statCard {
            background: rgba(0,0,0,0.4);
            border-radius: 20px; padding: 1rem 1.2rem;
            border: 1px solid rgba(147,51,234,0.15);
            text-align: center; position: relative; overflow: hidden;
          }
          .statCard::after {
            content: '';
            position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
            background: linear-gradient(90deg, transparent, rgba(147,51,234,0.7), transparent);
          }
          .statNum {
            font-size: 1.6rem; font-weight: 700; color: #e879f9;
            text-shadow: 0 0 20px rgba(232,121,249,0.6); display: block;
          }
          .statLbl {
            font-size: 0.7rem; color: #7c3aed;
            letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600;
          }

          .actions {
            display: flex; justify-content: center;
            gap: 1rem; margin-bottom: 2.5rem;
            flex-wrap: wrap; z-index: 2; position: relative;
          }
          .btn {
            padding: 1rem 2rem; border-radius: 50px; border: none;
            font-weight: 700; cursor: pointer; color: white;
            transition: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.2);
            font-size: 1rem; letter-spacing: 0.05em;
            position: relative; overflow: hidden;
          }
          .btn::after {
            content: '';
            position: absolute; top: -50%; left: -50%;
            width: 200%; height: 200%;
            background: linear-gradient(transparent, rgba(255,255,255,0.1), transparent);
            transform: rotate(45deg) translateY(-100%);
            transition: transform 0.5s;
          }
          .btn:hover::after { transform: rotate(45deg) translateY(100%); }
          .learnBtn {
            background: linear-gradient(135deg, #9333ea, #c026d3, #9333ea);
            background-size: 200% auto;
            box-shadow: 0 8px 25px rgba(147,51,234,0.6), 0 0 50px rgba(147,51,234,0.3), 0 0 80px rgba(147,51,234,0.1);
            animation: gradientShift 3s ease infinite;
          }
          .learnBtn:hover {
            transform: translateY(-4px) scale(1.05);
            box-shadow: 0 15px 40px rgba(147,51,234,0.8), 0 0 80px rgba(147,51,234,0.5), 0 0 120px rgba(147,51,234,0.2);
          }
          .aiBtn {
            background: linear-gradient(135deg, #4f46e5, #6366f1, #4f46e5);
            background-size: 200% auto;
            box-shadow: 0 8px 25px rgba(79,70,229,0.6), 0 0 50px rgba(79,70,229,0.3);
            animation: gradientShift 3s ease infinite reverse;
          }
          .aiBtn:hover {
            transform: translateY(-4px) scale(1.05);
            box-shadow: 0 15px 40px rgba(99,102,241,0.8), 0 0 80px rgba(79,70,229,0.5);
          }

          .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 1rem; margin-bottom: 2.5rem; position: relative; z-index: 2;
          }
          .featureCard {
            background: rgba(10, 4, 25, 0.7);
            border-radius: 28px; padding: 1.5rem 0.5rem;
            text-align: center; cursor: pointer;
            transition: all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.2);
            border: 1px solid rgba(147, 51, 234, 0.2);
            position: relative; overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(147,51,234,0.1);
            animation: cardEntrance 0.6s ease forwards; opacity: 0;
          }
          .featureCard:nth-child(1) { animation-delay: 0.1s; }
          .featureCard:nth-child(2) { animation-delay: 0.2s; }
          .featureCard:nth-child(3) { animation-delay: 0.3s; }
          .featureCard:nth-child(4) { animation-delay: 0.4s; }
          .featureCard:nth-child(5) { animation-delay: 0.5s; }
          .featureCard::before {
            content: '';
            position: absolute; inset: 0;
            background: radial-gradient(circle at 50% 0%, rgba(147,51,234,0.15), transparent 70%);
            opacity: 0; transition: opacity 0.3s;
          }
          .featureCard:hover {
            transform: translateY(-8px) scale(1.04);
            border-color: rgba(168,85,247,0.6);
            box-shadow: 0 20px 40px rgba(147,51,234,0.4), 0 0 60px rgba(147,51,234,0.2), 0 0 0 1px rgba(168,85,247,0.5);
          }
          .featureCard:hover::before { opacity: 1; }
          .icon {
            font-size: 2.2rem; margin-bottom: 0.7rem; display: block;
            filter: drop-shadow(0 0 10px rgba(147,51,234,0.9)) drop-shadow(0 0 20px rgba(147,51,234,0.6)) drop-shadow(0 0 40px rgba(147,51,234,0.3));
            transition: filter 0.3s;
          }
          .featureCard:hover .icon {
            filter: drop-shadow(0 0 15px rgba(168,85,247,1)) drop-shadow(0 0 30px rgba(147,51,234,0.8)) drop-shadow(0 0 60px rgba(147,51,234,0.5));
          }
          .featureLabel {
            font-size: 0.85rem; font-weight: 600; color: #c4b5fd;
            letter-spacing: 0.05em; text-shadow: 0 0 10px rgba(147,51,234,0.5);
          }

          .userFooter {
            display: flex; align-items: center;
            justify-content: space-between; flex-wrap: wrap;
            gap: 1rem; padding-top: 1.5rem;
            border-top: 1px solid rgba(147,51,234,0.2);
            position: relative; z-index: 2;
          }
          .userInfo { display: flex; align-items: center; gap: 1rem; }
          .avatar {
            width: 52px; height: 52px; border-radius: 50%;
            border: 2px solid #9333ea; object-fit: cover;
            animation: avatarPulse 3s ease-in-out infinite;
          }
          .userName { font-weight: 700; font-size: 1rem; text-shadow: 0 0 10px rgba(147,51,234,0.4); }
          .userEmail { font-size: 0.78rem; color: #7c3aed; }
          .logoutBtn {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.15);
            padding: 0.6rem 1.4rem; border-radius: 40px;
            color: #a78bfa; cursor: pointer;
            transition: all 0.2s; font-weight: 500; letter-spacing: 0.05em;
          }
          .logoutBtn:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.3); transform: scale(0.97); }
          .adminBtn {
            background: linear-gradient(135deg, #9333ea, #7c3aed);
            border: none; padding: 0.6rem 1.4rem; border-radius: 40px;
            color: white; cursor: pointer; font-weight: 600; transition: all 0.2s;
            box-shadow: 0 4px 15px rgba(147,51,234,0.5), 0 0 30px rgba(147,51,234,0.2);
          }
          .adminBtn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(147,51,234,0.7), 0 0 50px rgba(147,51,234,0.3); }

          @media (max-width: 640px) {
            .page { padding: 1rem; }
            .mainCard { padding: 1.5rem; border-radius: 32px; }
            .greetingText { font-size: 1.8rem; }
            .aiText { font-size: 1rem; }
            .btn { padding: 0.7rem 1.4rem; }
            .statsRow { grid-template-columns: repeat(3, 1fr); }
            .userFooter { flex-direction: column; align-items: stretch; text-align: center; }
            .userInfo { justify-content: center; }
          }
        `}</style>

        <div className="mainCard">
          <div className="scanline" />

          <div className="greetingSection">
            <div className="greetingText">{greeting} 👋, {session.user?.name}</div>
            <div className="subheading">AI Learning Control Center</div>
          </div>

          <div className="aiPanel">
            <div className="aiLabel">⬡ AI Assistant</div>
            <pre className="aiText">{text}</pre>
          </div>

          <div className="statsRow">
            <div className="statCard">
              <span className="statNum">12</span>
              <span className="statLbl">Lessons Done</span>
            </div>
            <div className="statCard">
              <span className="statNum">84%</span>
              <span className="statLbl">Progress</span>
            </div>
            <div className="statCard">
              <span className="statNum">🔥 5</span>
              <span className="statLbl">Day Streak</span>
            </div>
          </div>

          <div className="actions">
            <button className="btn learnBtn" onClick={handleContinue}>▶ Continue Learning</button>
            <button className="btn aiBtn" onClick={() => router.push("/ai-tutor")}>✦ Ask AI Tutor</button>
          </div>

          <div className="features">
            <div className="featureCard" onClick={() => router.push("/board")}>
              <div className="icon">📚</div>
              <div className="featureLabel">Start Learning</div>
            </div>
            <div className="featureCard" onClick={() => router.push("/resources")}>
              <div className="icon">📖</div>
              <div className="featureLabel">Resources</div>
            </div>
            <div className="featureCard" onClick={() => router.push("/competitive")}>
              <div className="icon">🎯</div>
              <div className="featureLabel">Competitive</div>
            </div>
            <div className="featureCard" onClick={() => router.push("/skills")}>
              <div className="icon">💻</div>
              <div className="featureLabel">Skills</div>
            </div>
            <div className="featureCard" onClick={() => router.push("/explore")}>
              <div className="icon">🎓</div>
              <div className="featureLabel">Explore</div>
            </div>
          </div>

          <div className="userFooter">
            <div className="userInfo">
              <img src={session.user?.image || "/user.png"} className="avatar" alt="avatar" />
              <div>
                <div className="userName">{session.user?.name}</div>
                <div className="userEmail">{session.user?.email}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              {session.user?.role === "admin" && (
                <button className="adminBtn" onClick={() => router.push("/admin")}>⚡ Admin</button>
              )}
              <button className="logoutBtn" onClick={() => signOut()}>Logout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========== Netflix-Grade Glow Particles (Canvas) ========== */
function GlowParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: any[] = [];
    let time = 0;

    function initParticles(W: number, H: number) {
      particles = [];
      const count = Math.min(120, Math.floor((W * H) / 7000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          size: Math.random() * 3 + 1.5,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.25,
          alpha: Math.random() * 0.5 + 0.2,
          phase: Math.random() * Math.PI * 2,
          speed: 0.008 + Math.random() * 0.015,
          color: Math.random() > 0.5 ? [147, 51, 234] : [192, 38, 211],
        });
      }
    }

    function animate() {
      if (!canvas || !ctx) return;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      time += 0.016;

      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -20) p.x = W + 20;
        if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20;
        if (p.y > H + 20) p.y = -20;

        const pulse = Math.sin(time * p.speed * 60 + p.phase) * 0.25 + 0.75;
        const a = p.alpha * pulse;
        const [r, g, b] = p.color;

        ctx.save();
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        grad.addColorStop(0, `rgba(${r},${g},${b},${a * 0.9})`);
        grad.addColorStop(0.4, `rgba(${r},${g},${b},${a * 0.4})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,180,255,${a * 0.9})`;
        ctx.fill();
        ctx.restore();
      }
      animationId = requestAnimationFrame(animate);
    }

    function resizeCanvas() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "none" }}
    />
  );
}