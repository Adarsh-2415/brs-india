"use client";

import React from "react";
import Image from "next/image";
import { BookOpen, Video, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

export default function LecturesClient() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* ─── Hero Section ─── */}
      <section className="relative pt-32 pb-20 bg-brs-900 overflow-hidden mb-12">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#D97757 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.3em] text-brs-600 border border-white/10">
              <BookOpen className="h-3 w-3" />
              Knowledge Sharing
            </span>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-6xl uppercase">
              BRS India <span className="text-brs-600">Lectures</span>
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-lg text-brs-100/70 font-medium">
              Explore our curated collection of expert presentations, scientific deep-dives, and technical seminars advancing the frontier of battery technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Main Content Container ─── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12">
        
        {/* ─── Section 1: Image Presentations (L1 & L2) ─── */}
        <section className="mb-24 lg:mb-32">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-10 w-10 rounded-xl bg-brs-600/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-brs-600" />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-brs-900">Featured Presentations</h2>
          </div>

          <div className="flex flex-col gap-12 lg:gap-16">
            {/* L1 Image */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="relative w-full rounded-3xl overflow-hidden border border-brs-900/10 shadow-[0_20px_50px_rgba(10,25,47,0.08)] bg-white group"
            >
              <div className="absolute inset-0 bg-brs-900/0 group-hover:bg-brs-900/5 transition-colors duration-500 z-10 pointer-events-none" />
              <Image 
                src="/lectures/L1.jpg" 
                alt="BRS Lecture Presentation Part 1" 
                width={1920} 
                height={1080}
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-[1.01]"
              />
            </motion.div>

            {/* L2 Image */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-full rounded-3xl overflow-hidden border border-brs-900/10 shadow-[0_20px_50px_rgba(10,25,47,0.08)] bg-white group"
            >
              <div className="absolute inset-0 bg-brs-900/0 group-hover:bg-brs-900/5 transition-colors duration-500 z-10 pointer-events-none" />
              <Image 
                src="/lectures/L2.jpg" 
                alt="BRS Lecture Presentation Part 2" 
                width={1920} 
                height={1080}
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-[1.01]"
              />
            </motion.div>
          </div>
        </section>

        {/* ─── Section 2: Video Lectures (YouTube Embed) ─── */}
        <section className="pb-32 lg:pb-48">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-brs-600/10 flex items-center justify-center">
                <Video className="h-5 w-5 text-brs-600" />
              </div>
              <h2 className="text-3xl font-black tracking-tight text-brs-900">Video Seminars</h2>
            </div>
          </div>

          <div className="relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden bg-slate-900 border-4 border-brs-600/30 shadow-[0_0_80px_rgba(217,119,87,0.2)] mt-10 z-20">
            <div className="relative w-full h-[250px] sm:h-[400px] lg:h-[550px]">
              <iframe 
                src="https://www.youtube.com/embed/h5pUi_xHn94?rel=0&modestbranding=1" 
                title="BRS India Lecture" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full border-0"
              />
            </div>
          </div>
          

        </section>

      </div>
      <Footer />
    </div>
  );
}
