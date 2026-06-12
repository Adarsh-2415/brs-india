"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, ShieldAlert } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check if already logged in and redirect to dashboard
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
        // Successful login
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
    <div className="relative flex min-h-screen items-center justify-center bg-[#0B0F19] px-4 overflow-hidden">
      {/* Background Animated Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brs-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-600/5 blur-[120px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(white 1px, transparent 1px)', 
          backgroundSize: '24px 24px' 
        }} 
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-8 sm:p-10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] backdrop-blur-3xl">
          {/* Logo Presentation */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative h-20 w-20 rounded-full border border-white/10 p-1 bg-white/5 backdrop-blur-xl mb-4 flex items-center justify-center">
              <Image 
                src="/logo_high_res_v4.png"
                alt="BRS India Logo"
                width={80}
                height={80}
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-wide uppercase">
              BRS India <span className="text-brs-400">Admin Portal</span>
            </h1>
            <p className="text-xs text-slate-400/80 mt-1 font-semibold">
              Sign in to manage portal settings and view submissions.
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-xs font-semibold text-red-400 mb-6"
            >
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 h-5 w-5 text-slate-500" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@brsindia.org.in"
                  required
                  disabled={isLoading}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-brs-600/50 focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 h-5 w-5 text-slate-500" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  disabled={isLoading}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-brs-600/50 focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            {/* Login button */}
            <button 
              type="submit"
              disabled={isLoading}
              className="group relative w-full inline-flex items-center justify-center gap-3 py-4 bg-brs-600 hover:bg-brs-500 rounded-full text-white font-bold text-sm shadow-[0_0_30px_rgba(217,119,87,0.3)] hover:shadow-[0_0_40px_rgba(217,119,87,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>{isLoading ? "Signing In..." : "Access Dashboard"}</span>
              {!isLoading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
