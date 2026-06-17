"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Users } from "lucide-react";

const MEMBERS = [
  // Ordered sequence for alternating timeline (President is handled separately)
  { id: 2, name: "Prof. Amartya Mukhopadhyay", role: "Vice-President", inst: "IIT Bombay", image: "/members-photo/Prof.-Amartya-Mukhopadhyay.jpg", level: 2 },
  { id: 4, name: "Dr. A. S. Prakash", role: "General Secretary", inst: "CSIR-CECRI, Chennai", image: "/members-photo/Dr.-A.-S.-Prakash.jpg", level: 2 },
  { id: 3, name: "Prof. Yogesh K. Sharma", role: "Secretary-cum-Treasurer", inst: "IIT Roorkee", image: "/members-photo/Prof.-Yogesh-K.-Sharma.jpg", level: 2 },
  { id: 9, name: "Shri. S. Loganathan", role: "Member", inst: "RCI Hyderabad", image: "/members-photo/Shri.-S.-Loganathan.jpg", level: 3 },
  { id: 5, name: "Dr. Rosy", role: "Member", inst: "IIT (BHU) Varanasi", image: "/members-photo/Dr-Rosy.jpg", level: 3 },
  { id: 6, name: "Prof. Abhik Banerjee", role: "Member", inst: "RISE, TCG CREST", image: "/members-photo/Prof.-Abhik-Banerjee.jpg", level: 3 },
  { id: 7, name: "Prof. Naga P. B. Aetukuri", role: "Member", inst: "IISc, Bangalore", image: "/members-photo/Prof.-Naga-P.-B.-Aetukuri.png", level: 4 },
  { id: 8, name: "Prof. Amit Gupta", role: "Member", inst: "IIT Delhi", image: "/members-photo/Prof.-Amit-Gupta.jpg", level: 4 },
];

function CouncilTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Cinematic scroll animation for the central spine
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });
  
  const spineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="relative w-full pt-10 pb-20">
      {/* Cinematic Scroll-Triggered Spine */}
      <div className="absolute left-[24px] md:left-1/2 top-0 bottom-0 w-[2px] bg-brs-600/10 -translate-x-1/2 rounded-full overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 w-full bg-brs-500 shadow-[0_0_20px_rgba(217,119,87,0.9)]"
          style={{ height: spineHeight }}
        />
      </div>

      {/* Alternating Members List */}
      <div className="flex flex-col gap-12 md:gap-24 relative z-10">
        {MEMBERS.map((member, idx) => {
          // Determine layout rules
          const isLeft = idx % 2 === 0; // Even index = Left side (starting with VP at idx 0)
          
          // Dynamic sizing logic based on original design
          let sizeClass = "h-32 w-32 sm:h-36 sm:w-36"; 
          let borderClass = "border-brs-600/15";
          let shadowClass = "shadow-lg";
          
          if (member.level === 2) {
            sizeClass = "h-36 w-36 sm:h-40 sm:w-40";
            borderClass = "border-brs-600/25";
            shadowClass = "shadow-xl";
          }

          return (
            <div key={member.id} className={`flex flex-col md:flex-row items-center w-full ${isLeft ? 'md:justify-start' : 'md:justify-end'} relative pl-[64px] md:pl-0`}>
              
              {/* Short Elegant Connector */}
              <motion.div 
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className={`absolute top-1/2 h-[2px] w-[40px] md:w-[48px] bg-brs-600/40 transform -translate-y-1/2 shadow-[0_0_10px_rgba(217,119,87,0.3)] left-[24px] origin-left ${
                  isLeft 
                    ? 'md:origin-right md:left-auto md:right-1/2' 
                    : 'md:origin-left md:left-1/2 md:right-auto'
                }`}
              />

              {/* Card Container with Active Glow & Tilt */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`w-full md:w-1/2 flex ${isLeft ? 'md:justify-end md:pr-12 lg:pr-24' : 'md:justify-start md:pl-12 lg:pl-24'}`}
              >
                {/* Subtle Depth Tilt Wrapper */}
                <div className={`relative flex flex-col items-center group transition-transform duration-500 hover:!rotate-0 hover:scale-105 ${isLeft ? 'md:-rotate-1' : 'md:rotate-1'}`}>
                  {/* Avatar Circle */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`relative ${sizeClass} rounded-full border-2 ${borderClass} bg-white p-1 ${shadowClass} transition-all duration-500 group-hover:border-brs-600 group-hover:shadow-brs-600/40 overflow-hidden`}
                  >
                    <div className="relative h-full w-full rounded-full overflow-hidden bg-brs-50">
                      <Image src={member.image} alt={member.name} fill className="object-cover" />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-brs-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                  </motion.div>

                  {/* Info Badge */}
                  <div className="mt-6 flex flex-col items-center whitespace-nowrap">
                    <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-brs-100 px-5 py-2.5 shadow-md transition-all duration-300 group-hover:shadow-lg text-center">
                      <h3 className="text-[13px] sm:text-base font-extrabold text-brs-900">
                        {member.name}
                      </h3>
                      <p className="text-[11px] sm:text-xs font-bold text-brs-700">
                        {member.inst}
                      </p>
                    </div>
                    <p className="mt-2.5 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.18em] text-brs-600 group-hover:text-brs-500 transition-colors">
                      {member.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CouncilNetwork() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return (
    <section id="council" className="relative pt-24 pb-56 sm:pt-32 sm:pb-64 overflow-hidden bg-white min-h-[800px]">
      <div className="mx-auto max-w-2xl text-center">
        <div className="h-8 w-48 bg-brs-100 animate-pulse mx-auto rounded-full mb-8" />
        <div className="h-12 w-96 bg-brs-50 animate-pulse mx-auto rounded-xl" />
      </div>
    </section>
  );

  const PRESIDENT = { id: 1, name: "Dr. T. N. Rao", role: "President", inst: "IIT Hyderabad", image: "/members-photo/Tata-Narasinga-Rao.jpg", level: 1 };

  return (
    <section id="council" className="relative pt-24 pb-32 sm:pt-32 sm:pb-40 overflow-hidden bg-white">
      {/* Background Subtle Grid/Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--color-brs-900) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16 lg:mb-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-brs-600/20 bg-brs-600/10 px-4 py-2 text-[13px] font-bold uppercase tracking-widest text-brs-700">
            <Users className="h-4 w-4" />
            Leadership
          </span>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight !text-brs-900 sm:text-4xl md:text-5xl">
            The Executive Council
          </h2>
          <p className="mt-4 text-lg font-bold !text-brs-700">
            A network of distinguished scientists and academic leaders steering the future of battery research in India.
          </p>
        </div>

        <div className="relative mx-auto max-w-5xl">
          {/* 1. PRESIDENT HERO NODE (Isolated, Top, Centered) */}
          <div className="relative z-10 flex justify-center mb-20 lg:mb-32">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="group relative flex flex-col items-center"
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="relative h-40 w-40 sm:h-48 sm:w-48 rounded-full border-2 border-brs-600/30 bg-white p-1 shadow-[0_0_40px_rgba(217,119,87,0.2)] transition-all duration-300 group-hover:border-brs-600 group-hover:shadow-[0_0_60px_rgba(217,119,87,0.4)] overflow-hidden"
              >
                <div className="relative h-full w-full rounded-full overflow-hidden bg-brs-50">
                  <Image src={PRESIDENT.image} alt={PRESIDENT.name} fill className="object-cover" />
                </div>
                <div className="absolute inset-0 rounded-full bg-brs-600 opacity-0 group-hover:opacity-10 transition-opacity" />
              </motion.div>

              <div className="mt-6 flex flex-col items-center whitespace-nowrap">
                <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-brs-100 px-6 py-3 shadow-lg transition-all duration-300 group-hover:shadow-xl text-center">
                  <h3 className="text-sm sm:text-lg font-extrabold text-brs-900">
                    {PRESIDENT.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-brs-700">
                    {PRESIDENT.inst}
                  </p>
                </div>
                <p className="mt-3 text-[11px] sm:text-[13px] font-black uppercase tracking-[0.2em] text-brs-600 group-hover:text-brs-500 transition-colors">
                  {PRESIDENT.role}
                </p>
              </div>
            </motion.div>
          </div>

          {/* 2. TIMELINE STRUCTURE */}
          <CouncilTimeline />
        </div>
      </div>
    </section>
  );
}
