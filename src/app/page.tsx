"use client";

import {
  ArrowRight,
  BookOpen,
  Award,
  Mail,
  MapPin,
  GraduationCap,
  Microscope,
  Globe,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import HeroBackground from "@/components/HeroBackground";
import { BorderBeam } from "@/components/BorderBeam";
import CouncilNetwork from "@/components/CouncilNetwork";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative">
      {/* ═══════════════════════════════════════════════════════════════
          HERO SECTION — Premium Animated Background
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative flex min-h-screen items-center justify-center pt-24 pb-16 overflow-hidden">
        <HeroBackground />

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            
            {/* Centered Premium Logo Presentation */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative group mb-8"
            >
              {/* Ambient Glow behind Logo */}
              <div className="absolute inset-0 bg-brs-600/20 blur-[100px] rounded-full group-hover:bg-brs-400/30 transition-colors duration-1000" />
              
              <div className="relative">
                <div className="relative z-10 w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 rounded-full p-2 bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-2xl flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
                  <Image 
                    src="/logo_high_res_v4.png"
                    alt="BRS India Logo"
                    width={320}
                    height={320}
                    className="w-full h-full object-contain rounded-full drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                    priority
                  />
                  
                  {/* Subtle Scanning Effect Animation */}
                  <motion.div 
                    animate={{ 
                      top: ["0%", "100%", "0%"] 
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity, 
                      ease: "linear" 
                    }}
                    className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brs-400/50 to-transparent z-20 pointer-events-none"
                  />
                </div>
                
                {/* Orbital Rings for visual depth */}
                <div className="absolute -inset-4 border border-white/5 rounded-full animate-[spin_20s_linear_infinite]" />
                <div className="absolute -inset-8 border border-white/[0.02] rounded-full animate-[spin_30s_linear_infinite_reverse]" />
              </div>
            </motion.div>

            {/* Hero Content */}
            <div className="space-y-6">
              {/* Glassmorphism Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.06] px-5 py-2 text-xs font-medium text-brs-400 backdrop-blur-xl shadow-[0_0_20px_rgba(142,182,155,0.08)]"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brs-400 opacity-50" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brs-400" />
                </span>
                Established 2024 · Advancing Battery Research
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-2xl font-extrabold tracking-tight text-brs-100 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight"
              >
                <span className="bg-gradient-to-r from-brs-100 via-brs-300 to-brs-100 bg-clip-text text-transparent">
                  <span className="text-[1.15em] font-black">B</span>attery{" "}
                  <span className="text-[1.15em] font-black">R</span>esearch{" "}
                  <span className="text-[1.15em] font-black">S</span>ociety{" "}
                </span>
                <motion.span 
                  animate={{ 
                    filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"],
                    y: [0, -2, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="inline-block ml-2 bg-gradient-to-b from-[#FF9933] via-white to-[#138808] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                >
                  <span className="text-[1.15em] font-black">I</span>ndia
                </motion.span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mx-auto max-w-2xl text-lg leading-relaxed text-brs-400/90 sm:text-xl font-medium !mt-10 opacity-0 hover:opacity-100 transition-opacity duration-700"
              >
                Fostering collaboration among scientists, engineers, and innovators
                to advance electrochemical energy storage research and development
                across India.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex justify-center mt-12"
              >
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-3 rounded-full border border-brs-400/30 bg-brs-400/10 px-10 py-5 text-base font-bold text-white backdrop-blur-md transition-all duration-500 hover:bg-brs-400/20 hover:scale-110 hover:shadow-[0_0_40px_rgba(142,182,155,0.3)] hover:border-brs-400/50"
                >
                  Learn More
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Hero floating glassmorphism stats */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:mt-10"
          >
            {[
              { value: "200+", label: "Members" },
              { value: "50+", label: "Publications" },
              { value: "15+", label: "Institutions" },
              { value: "30+", label: "Lectures" },
            ].map((stat, idx) => (
              <div
                key={stat.label}
                className="relative overflow-hidden rounded-2xl border border-white/[0.12] bg-white/[0.08] px-6 py-8 backdrop-blur-lg transition-all duration-300 hover:bg-white/[0.13] hover:border-white/[0.2] text-center shadow-xl"
              >
                <BorderBeam 
                  duration={6} 
                  delay={idx * 1.5}
                  borderWidth={2.5}
                  pathLength={120}
                />
                <div className="relative z-10 text-2xl font-bold text-brs-100 sm:text-3xl">
                  {stat.value}
                </div>
                <div className="relative z-10 mt-1 text-xs font-semibold text-brs-400/90 tracking-wide uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          ABOUT SECTION — Light off-white background
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative !bg-[#F8FAFC] py-24 sm:py-32 overflow-hidden z-10">
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--color-brs-900) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Text content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-brs-600/20 bg-brs-600/10 px-4 py-2 text-[13px] font-bold uppercase tracking-widest text-brs-700">
                <BookOpen className="h-4 w-4" />
                About BRS India
              </span>
              <h2 className="mt-5 text-3xl font-extrabold tracking-tight !text-brs-900 sm:text-4xl md:text-5xl lg:leading-tight">
                Pioneering Battery Science{" "}
                <span className="text-brs-600 block sm:inline-block">in India</span>
              </h2>
              <p className="mt-5 text-base leading-relaxed !text-brs-700/90 font-medium">
                The Battery Research Society of India (BRS India) is a
                professional scientific body dedicated to promoting fundamental
                and applied research in electrochemical energy storage. Founded
                in 2024, we bring together researchers, academicians, industry
                professionals, and students to accelerate India&apos;s battery
                technology ecosystem.
              </p>
              <p className="mt-4 text-base leading-relaxed !text-brs-700/90 font-medium">
                Our mission is to foster innovation, support skill development,
                and establish India as a global leader in sustainable energy
                storage solutions.
              </p>
              <Link
                href="/about"
                className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brs-600 transition-colors duration-300 hover:text-brs-700"
              >
                Read our full story
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>

            {/* Feature mini-cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
              {[
                {
                  icon: Microscope,
                  title: "Cutting-edge Research",
                  desc: "Advancing lithium-ion, solid-state, and next-gen battery technologies.",
                },
                {
                  icon: GraduationCap,
                  title: "Education & Training",
                  desc: "Online lectures, workshops, and skill development programs.",
                },
                {
                  icon: Globe,
                  title: "Global Collaboration",
                  desc: "Partnerships with leading international research institutions.",
                },
                {
                  icon: Award,
                  title: "Awards & Recognition",
                  desc: "Honoring excellence in battery research and innovation.",
                },
              ].map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: idx * 0.15, ease: "easeOut" }}
                  className="group rounded-3xl border border-brs-400/20 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-2 hover:border-brs-400/40 hover:shadow-[0_20px_50px_rgba(217,119,87,0.1)]"
                >
                  <div className="mb-4 inline-flex rounded-2xl bg-brs-100/80 p-3 text-brs-600 transition-all duration-500 group-hover:bg-brs-600 group-hover:text-white group-hover:scale-110">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-brs-900 leading-tight">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-brs-700/70">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          COUNCIL SECTION — Molecular Network
      ═══════════════════════════════════════════════════════════════ */}
      <CouncilNetwork />

      {/* ═══════════════════════════════════════════════════════════════
          FAQ SECTION — Laboratory Split Layout
      ═══════════════════════════════════════════════════════════════ */}
      <FAQSection />

      {/* ═══════════════════════════════════════════════════════════════
          FOOTER — Reusable Component
      ═══════════════════════════════════════════════════════════════ */}
      <Footer />
    </div>
  );
}
