"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ExternalLink,
  Award,
  ChevronRight,
  Globe
} from "lucide-react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

export default function ConferencesClient() {
  const [confData, setConfData] = useState<any>({
    title: "National Meeting on Battery Research & Storage 2026",
    description: "Access the portal for registrations, abstract submissions, and technical agendas.",
    flyer_url: "/conferences/confrence_2026.jpeg", // Default local asset
    link_url: "https://www.nmbrs26.com/"
  });

  useEffect(() => {
    const fetchConf = async () => {
      try {
        const res = await fetch('/api/conferences');
        if (res.ok) {
          const data = await res.json();
          if (data.id) {
            setConfData(data);
          }
        }
      } catch (err) {
        console.error("Error fetching dynamic conference data:", err);
      }
    };
    fetchConf();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ─── Hero Section ─── */}
      <section className="relative pt-32 pb-20 bg-brs-900 overflow-hidden mb-12">
        {/* Decorative Grid Backdrop */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#D97757 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.3em] text-brs-600 border border-white/10">
              <Sparkles className="h-3 w-3" />
              Scientific Gatherings
            </span>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-6xl uppercase">
              BRS India <span className="text-brs-600">Conferences</span>
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-lg text-brs-100/70 font-medium">
              Explore national and international platforms showcasing breakthroughs in battery research, electrochemical energy storage, and sustainable technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Main Content Container ─── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12">

        {/* ─── Section 1: Featured Conference Image (Conference 2026) ─── */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-10 w-10 rounded-xl bg-brs-600/10 flex items-center justify-center">
              <Award className="h-5 w-5 text-brs-600" />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-brs-900">Upcoming Conference</h2>
          </div>

          {/* Conference 2026 Image Frame */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative w-full rounded-3xl overflow-hidden border border-brs-900/10 shadow-[0_20px_50px_rgba(10,25,47,0.08)] bg-white group flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-brs-900/0 group-hover:bg-brs-900/5 transition-colors duration-500 z-10 pointer-events-none" />
            {confData.flyer_url ? (
              <img
                src={confData.flyer_url}
                alt="BRS India Conference Presentation Banner"
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-[1.01]"
              />
            ) : (
              <div className="py-24 text-center text-slate-400 font-semibold">No Poster Image Available</div>
            )}
          </motion.div>
        </section>

        {/* ─── Section 2: Conference Web Portals (Links) ─── */}
        <section className="pb-32 lg:pb-40">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-brs-600/10 flex items-center justify-center">
              <Globe className="h-5 w-5 text-brs-600" />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-brs-900">Official Conference Web Portals</h2>
          </div>

          <div className="grid gap-6 max-w-4xl mx-auto mt-10">
            {/* First Link: Dynamic Current Conference */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <a
                href={confData.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-brs-400/20 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] transition-all duration-500 hover:-translate-y-1.5 hover:border-brs-600/35 hover:shadow-[0_20px_45px_rgba(217,119,87,0.12)]"
              >
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brs-600/10 px-3 py-1 text-xs font-bold text-brs-600 mb-3">
                    Active Conference Portal
                  </span>
                  <h3 className="text-xl font-black text-brs-900 group-hover:text-brs-600 transition-colors duration-300">
                    {confData.title}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-brs-400/80">
                    {confData.description || "Access the portal for registrations, abstract submissions, and agendas."}
                  </p>
                </div>
                <div className="mt-4 sm:mt-0 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brs-50 text-brs-400 transition-all duration-500 group-hover:bg-brs-600 group-hover:text-white group-hover:scale-110">
                  <ExternalLink className="h-5 w-5" />
                </div>
              </a>
            </motion.div>

            {/* Second Link: IMBRS 2025 (Archive) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <a
                href="https://www.imbrs25.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-brs-400/20 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] transition-all duration-500 hover:-translate-y-1.5 hover:border-brs-600/35 hover:shadow-[0_20px_45px_rgba(217,119,87,0.12)]"
              >
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brs-600/10 px-3 py-1 text-xs font-bold text-brs-600 mb-3">
                    IMBRS-25 (Archived)
                  </span>
                  <h3 className="text-xl font-black text-brs-900 group-hover:text-brs-600 transition-colors duration-300">
                    International Meeting on Battery Research & Storage 2025
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-brs-400/80">
                    Access the archived symposium archives, keynotes speaker directory, and scientific proceedings.
                  </p>
                </div>
                <div className="mt-4 sm:mt-0 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brs-50 text-brs-400 transition-all duration-500 group-hover:bg-brs-600 group-hover:text-white group-hover:scale-110">
                  <ExternalLink className="h-5 w-5" />
                </div>
              </a>
            </motion.div>
          </div>

        </section>

      </div>
      <Footer />
    </div>
  );
}
