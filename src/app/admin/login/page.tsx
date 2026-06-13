"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, ShieldAlert, Check, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

// Canvas Particle Network Animation
const NetworkCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    const particleCount = 50;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2 + 1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = "rgba(142, 182, 155, 0.08)";
      ctx.fillStyle = "rgba(142, 182, 155, 0.35)";

      // Draw and update
      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineWidth = (1 - dist / 120) * 0.7;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-60" />;
};

// Animated Battery SVG Illustration
const BatteryIllustration = () => {
  return (
    <div className="relative w-full max-w-[320px] aspect-[4/3] mx-auto flex items-center justify-center">
      <div className="absolute w-64 h-32 rounded-full bg-[#8EB69B]/5 blur-[60px] animate-pulse duration-[6000ms]" />
      
      <svg width="280" height="140" viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
        {/* Outer Casing */}
        <rect x="10" y="10" width="240" height="120" rx="16" stroke="#8EB69B" strokeWidth="2.5" fill="rgba(11, 43, 38, 0.3)" strokeDasharray="5 5" />
        {/* Terminal/Cap */}
        <path d="M250 50C253.314 50 256 52.6863 256 56V84C256 87.3137 253.314 90 250 90V50Z" fill="#8EB69B" />
        
        {/* Anode Layer (Left) */}
        <rect x="25" y="25" width="18" height="90" rx="4" fill="rgba(35, 83, 71, 0.4)" stroke="#8EB69B" strokeWidth="1.5" />
        {/* Cathode Layer (Right) */}
        <rect x="217" y="25" width="18" height="90" rx="4" fill="rgba(142, 182, 155, 0.25)" stroke="#8EB69B" strokeWidth="1.5" />
        
        {/* Electrolyte separator */}
        <line x1="130" y1="20" x2="130" y2="120" stroke="rgba(142, 182, 155, 0.15)" strokeWidth="2" strokeDasharray="4 4" />
        
        {/* Lithium Ions drifting */}
        <motion.circle
          cx="60"
          cy="45"
          r="4"
          fill="#DAF1DE"
          animate={{
            x: [0, 140, 0],
            y: [0, 10, 0]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ filter: "drop-shadow(0 0 4px #DAF1DE)" }}
        />
        
        <motion.circle
          cx="190"
          cy="95"
          r="4"
          fill="#DAF1DE"
          animate={{
            x: [0, -140, 0],
            y: [0, -15, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
          style={{ filter: "drop-shadow(0 0 4px #DAF1DE)" }}
        />

        <motion.circle
          cx="80"
          cy="100"
          r="4.5"
          fill="#8EB69B"
          animate={{
            x: [0, 110, 0],
            y: [0, -10, 0]
          }}
          transition={{
            duration: 6.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
          style={{ filter: "drop-shadow(0 0 4px #8EB69B)" }}
        />

        <motion.circle
          cx="170"
          cy="35"
          r="3.5"
          fill="#8EB69B"
          animate={{
            x: [0, -100, 0],
            y: [0, 15, 0]
          }}
          transition={{
            duration: 7.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
      </svg>
    </div>
  );
};

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/admin/dashboard");
      }
    };
    checkUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      if (data.session) {
        router.push("/admin/dashboard");
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(err.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen bg-[#051F20] text-slate-100 font-sans select-none overflow-hidden relative">
      
      {/* ─── LEFT SIDE: Society Branding & Animation (Desktop only) ─── */}
      <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 relative bg-gradient-to-br from-[#051F20] via-[#0B2B26] to-[#163832] p-12 flex-col justify-between overflow-hidden border-r border-[#163832]/60">
        
        {/* Canvas Network Background */}
        <NetworkCanvas />

        {/* Top Header */}
        <div className="flex items-center gap-4 z-10">
          <div className="relative h-12 w-12 rounded-[16px] border border-white/10 p-1 bg-white/5 flex items-center justify-center shadow-lg">
            <Image 
              src="/logo_high_res_v4.png"
              alt="BRS India Logo"
              width={48}
              height={48}
              className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.08)]"
            />
          </div>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-wider leading-none">BRS India</h2>
            <span className="text-[10px] text-[#8EB69B] font-bold uppercase tracking-widest mt-1 block">Battery Research Society</span>
          </div>
        </div>

        {/* Center Presentation (Illustration + Taglines) */}
        <div className="z-10 my-auto py-12 flex flex-col items-center text-center max-w-lg mx-auto">
          {/* Battery Anim */}
          <BatteryIllustration />

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-8 space-y-4"
          >
            <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight uppercase">
              Advancing Electrochemical Energy Science
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Connecting researchers, engineers, and industrial pioneers to accelerate battery innovation, safety standards, and sustainable storage technologies across India.
            </p>
          </motion.div>
        </div>

        {/* Bottom copyright */}
        <div className="z-10 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          © {new Date().getFullYear()} Battery Research Society of India.
        </div>
      </div>

      {/* ─── RIGHT SIDE: Glassmorphism Login Form Card ─── */}
      <div className="col-span-12 lg:col-span-6 xl:col-span-5 relative flex items-center justify-center p-6 sm:p-12 md:p-16 bg-[#051F20] overflow-y-auto">
        
        {/* Glow auroras for mobile background */}
        <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-[#235347]/10 blur-[120px] pointer-events-none lg:hidden" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-[#8EB69B]/5 blur-[120px] pointer-events-none lg:hidden" />

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[420px] relative z-10"
        >
          {/* Glass Card Container */}
          <div className="relative bg-[#0B2B26]/60 border border-[#8EB69B]/15 rounded-[2rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl overflow-hidden">
            
            {/* Top green gradient light bar */}
            <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#8EB69B]/40 to-transparent" />

            {/* Mobile Header Logo Presentation */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="lg:hidden relative h-16 w-16 rounded-[18px] border border-white/10 p-1.5 bg-white/5 flex items-center justify-center mb-4">
                <Image 
                  src="/logo_high_res_v4.png"
                  alt="BRS India Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#235347]/30 border border-[#8EB69B]/20 rounded-full mb-3 shadow-inner">
                <span className="h-1.5 w-1.5 rounded-full bg-[#8EB69B] animate-ping" />
                <span className="text-[9px] font-black text-[#DAF1DE] uppercase tracking-widest leading-none">BRS Portal</span>
              </div>

              <h2 className="text-xl font-black text-white tracking-wide uppercase leading-tight">
                Admin Login
              </h2>
              <p className="text-[11px] text-[#8EB69B]/90 mt-2 font-medium max-w-[280px] leading-relaxed">
                Provide secure administrative credentials to access the BRS India console.
              </p>
            </div>

            {/* Alert on Authentication Error */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-400 mb-6 font-medium shadow-inner"
              >
                <ShieldAlert className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold uppercase tracking-wider text-[10px] block">Authentication Failed</span>
                  <span className="opacity-90">{error}</span>
                </div>
              </motion.div>
            )}

            {/* Login form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Address */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#8EB69B] uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative flex items-center group">
                  <div className="absolute left-4 pointer-events-none z-10">
                    <Mail className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-[#8EB69B] transition-colors" />
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@brsindia.org.in"
                    required
                    disabled={isLoading}
                    className="w-full bg-[#051F20]/75 border border-[#8EB69B]/15 rounded-2xl pl-11 pr-4 py-3.5 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#8EB69B]/20 focus:border-[#8EB69B] transition-all font-medium"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#8EB69B] uppercase tracking-widest ml-1">Password</label>
                <div className="relative flex items-center group">
                  <div className="absolute left-4 pointer-events-none z-10">
                    <Lock className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-[#8EB69B] transition-colors" />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    disabled={isLoading}
                    className="w-full bg-[#051F20]/75 border border-[#8EB69B]/15 rounded-2xl pl-11 pr-12 py-3.5 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#8EB69B]/20 focus:border-[#8EB69B] transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-4 text-slate-400 hover:text-white transition-colors cursor-pointer select-none z-10"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Toggle */}
              <div className="flex items-center justify-between pt-1 select-none">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={isLoading}
                      className="peer sr-only"
                    />
                    <div className="h-5 w-5 bg-[#051F20]/70 border border-[#8EB69B]/20 rounded-lg transition-all peer-checked:bg-[#235347] peer-checked:border-[#8EB69B] flex items-center justify-center shadow-inner">
                      <Check className="h-3.5 w-3.5 text-[#DAF1DE] scale-0 peer-checked:scale-100 transition-transform font-bold" />
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 hover:text-slate-300 transition-colors">Remember session</span>
                </label>
              </div>

              {/* Login Button */}
              <motion.button 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isLoading}
                className="group relative w-full inline-flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#235347] to-[#163832] hover:from-[#235347] hover:to-[#235347] border border-[#8EB69B]/20 rounded-2xl text-white font-black text-xs uppercase tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-4 shadow-lg shadow-black/35"
              >
                <span>{isLoading ? "Validating Session..." : "Secure Sign In"}</span>
                {!isLoading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
