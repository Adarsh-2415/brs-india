"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Target, 
  Eye, 
  BookOpen, 
  Users, 
  Globe, 
  ShieldCheck, 
  ChevronDown,
  Microscope,
  GraduationCap,
  Zap,
  Building2,
  Handshake
} from "lucide-react";
import Footer from "@/components/Footer";

const AIMS_OBJECTIVES = [
  {
    icon: Users,
    title: "Researcher Collaboration",
    text: "Bringing together Battery researchers across Educational Institutes, National and Private R&D Laboratories, and Industries."
  },
  {
    icon: Globe,
    title: "Global Discourse",
    text: "Organizing and facilitating National and International papers focused on battery science, technology, and policy."
  },
  {
    icon: GraduationCap,
    title: "Education & Training",
    text: "Facilitating education and training related to battery science/technology for students and professionals."
  },
  {
    icon: Zap,
    title: "Startup Advisory",
    text: "Providing techno-economic advice to start-ups and industries related to battery development."
  },
  {
    icon: ShieldCheck,
    title: "Tech Promotion",
    text: "Promoting activities on Battery Related Technologies, innovation, and research in our country."
  },
  {
    icon: Building2,
    title: "Infrastructure",
    text: "Constructing or leasing buildings for institutions run by the Society."
  },
  {
    icon: BookOpen,
    title: "Educational Schemes",
    text: "Formulating and implementing plans for battery materials, technologies, and supply chain."
  },
  {
    icon: Handshake,
    title: "Partnerships",
    text: "Working in coordination with other non-profit organizations in India and abroad with similar objects."
  }
];

const INCIDENTAL_OBJECTS = [
  "Issue appeals and collect money/funds for the furtherance of the objects of the Society.",
  "Generate income by charging appropriate fees for teaching, training, learning, advice, and applied research.",
  "Accept grants of money, securities, and receive properties for the purpose of the Society.",
  "Draw, make, accept, endorse, and negotiate monetary documents like cheques, drafts, and receipts.",
  "Deposit and invest the money of the Society in securities or other schemes for the best interest.",
  "Enter into agreements with government authorities, municipal, or local bodies for rights and privileges.",
  "Create, accept, and undertake the management of any endowment or society/trust fund.",
  "Apply for and take out patents, trademarks, and licenses for inventions or intellectual property.",
  "Print, publish, and sell books and research documents for propagating the objects of the Society.",
  "Send, sponsor, and participate in study missions through members and nominees to institutions in India and abroad.",
  "Identify like-minded institutions/organizations in India and foreign countries to achieve society aims.",
  "Organize, undertake, promote, and facilitate all activities like research, investigations, and surveys.",
  "To promote ideas, concepts, models, and interactions aimed at achieving a clean human environment.",
  "Provide consultancy, information, advice, and expertise guidance to facilitate innovations and experiments.",
  "Promote reuse of renewable resources of energy and recycling of industrial and commercial wastes.",
  "Carry out any other activity which is conducive to the attainment of the aims and objectives."
];

export default function AboutClient() {
  const [showIncidental, setShowIncidental] = useState(false);

  return (
    <div className="bg-[#F8FAFC]">
      {/* ─── Hero Section ─── */}
      <section className="relative pt-32 pb-20 bg-brs-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#8EB69B 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center rounded-full bg-brs-600/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brs-400">
              Established 2024
            </span>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
              About <span className="text-brs-400">Us</span>
            </h1>
            <p className="mt-6 mx-auto max-w-3xl text-lg text-brs-100/70 font-medium leading-relaxed">
              Advancing the discussion, development, and adoption of next-generation battery technologies for the benefit of society.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Introduction ─── */}
      <section className="py-20 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-extrabold text-brs-900 sm:text-4xl">
                Battery Research Society
              </h2>
              <p className="mt-6 text-lg text-slate-600 leading-relaxed">
                The Battery Research Society (of India) (BRS) is a collective of researchers, engineers, scholars, industry professionals, policymakers, and community members. 
              </p>
              <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                Founded in 2024, our society serves as a catalyst to accelerate the assessment and adoption of battery science and technologies aimed at next-generation applications.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative p-8 rounded-3xl bg-white shadow-2xl border border-brs-50 overflow-hidden group"
            >
              <div className="absolute top-0 right-0 h-32 w-32 bg-brs-600/5 rounded-bl-full transition-all duration-500 group-hover:scale-150" />
              <Microscope className="h-12 w-12 text-brs-600 mb-6" />
              <h3 className="text-xl font-bold text-brs-900 mb-4">Driving Innovation</h3>
              <p className="text-slate-500">We are dedicated to fostering an ecosystem where fundamental and applied research flourish hand-in-hand.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Mission & Vision ─── */}
      <section className="py-20 bg-white relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission Card */}
            <motion.div
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative p-8 sm:p-10 rounded-[2rem] border border-brs-100 bg-[#F8FAFC] shadow-sm overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8">
                <Target className="h-10 w-10 text-brs-600/20 group-hover:text-brs-600 group-hover:scale-110 transition-all duration-500" />
              </div>
              <h2 className="text-2xl font-black text-brs-900 uppercase tracking-tight">Our Mission</h2>
              <p className="mt-6 text-slate-600 leading-relaxed font-medium">
                To bring together battery researchers, engineers and developers as a hub, facilitating regular discussions, meetings, training, and knowledge sharing in the societal interest.
              </p>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative p-8 sm:p-10 rounded-[2rem] border border-brs-100 bg-[#F8FAFC] shadow-sm overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8">
                <Eye className="h-10 w-10 text-brs-600/20 group-hover:text-brs-600 group-hover:scale-110 transition-all duration-500" />
              </div>
              <h2 className="text-2xl font-black text-brs-900 uppercase tracking-tight">Our Vision</h2>
              <p className="mt-6 text-slate-600 leading-relaxed font-medium">
                To build a strong and vibrant battery community across the value chain, supporting globally competitive battery development and industrial sectors.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Aims & Objectives ─── */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-brs-900 sm:text-4xl uppercase tracking-tight">
              Aims & <span className="text-brs-600">Objectives</span>
            </h2>
            <div className="mt-4 h-1.5 w-24 bg-brs-600 mx-auto rounded-full" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {AIMS_OBJECTIVES.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="p-6 rounded-2xl bg-white border border-brs-50 shadow-sm hover:shadow-xl hover:border-brs-200 transition-all duration-300 group"
              >
                <div className="h-12 w-12 rounded-xl bg-brs-50 flex items-center justify-center text-brs-600 mb-5 group-hover:bg-brs-600 group-hover:text-white transition-colors duration-300">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-brs-900 mb-3">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Incidental Objects ─── */}
      <section className="py-24 bg-white relative">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-black text-brs-900 sm:text-3xl uppercase tracking-tight">
              Incidental <span className="text-brs-600">Objects</span>
            </h2>
            <p className="mt-4 text-slate-500">Legal and administrative functions for achieving society goals.</p>
          </div>

          <div className="space-y-3">
            {INCIDENTAL_OBJECTS.slice(0, showIncidental ? undefined : 6).map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-brs-200 transition-colors"
              >
                <div className="mt-1 h-5 w-5 rounded-full bg-brs-100 flex items-center justify-center shrink-0">
                  <div className="h-1.5 w-1.5 rounded-full bg-brs-600" />
                </div>
                <p className="text-[15px] text-slate-600 font-medium group-hover:text-brs-900 transition-colors">
                  {item}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div className="mt-10 text-center">
            <button
              onClick={() => setShowIncidental(!showIncidental)}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-brs-900 text-white font-bold text-sm hover:bg-brs-800 transition-all shadow-lg hover:shadow-brs-900/20"
            >
              {showIncidental ? "Show Less" : "View All Objects"}
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showIncidental ? "rotate-180" : ""}`} />
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
