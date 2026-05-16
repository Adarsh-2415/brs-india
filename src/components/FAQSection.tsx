"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";
import Image from "next/image";

const FAQ_ITEMS = [
  {
    question: "What is the Battery Research Society of India (BRS)?",
    answer: "The Battery Research Society of India (BRS), founded in 2024, is a collective of researchers, engineers, scholars, industry professionals, policymakers, and community members. BRS aims to drive the discussion, development, assessment, and adoption of next-generation battery technologies to benefit society.",
  },
  {
    question: "Is there any membership program available?",
    answer: "Yes, BRS offers three membership types:\n• Life Membership: For individuals with a one-time fee.\n• Organization Membership: For institutions and organizations.\n• General Membership: For professionals and students, with category-specific requirements.\nAll memberships include a payment gateway and receipt generation.",
  },
  {
    question: "What activities does BRS organize?",
    answer: "BRS regularly organizes national and international conferences, meetings, workshops, webinars, and publishes white papers focused on battery science and technology. The society also facilitates training and education in battery-related fields for both students and professionals.",
  },
  {
    question: "Who can benefit from BRS’s activities and initiatives?",
    answer: "BRS’s initiatives are aimed at researchers, engineers, developers, students, industry professionals, and policymakers involved in battery technologies. The society also supports start-ups and industries by offering advice and facilitating the development of battery-related innovations.",
  },
  {
    question: "How does BRS support the battery industry and start-ups?",
    answer: "BRS offers techno-economic advice, promotes innovation, and provides educational opportunities for battery researchers, start-ups, and industries. Additionally, BRS offers grants, scholarships, and awards to support members dedicated to advancing battery technologies.",
  },
];

const FAQItem = ({ item, isOpen, onClick, index }: { item: typeof FAQ_ITEMS[0], isOpen: boolean, onClick: () => void, index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`mb-4 overflow-hidden rounded-2xl border transition-all duration-300 ${
        isOpen 
          ? "border-brs-600/30 bg-white shadow-xl shadow-brs-600/5" 
          : "border-brs-100 bg-white/50 hover:border-brs-600/20 hover:bg-white shadow-sm"
      }`}
    >
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between p-5 text-left transition-colors sm:p-6"
      >
        <div className="flex items-start gap-4">
          <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors ${
            isOpen ? "bg-brs-600 text-white" : "bg-brs-100 text-brs-600"
          }`}>
            <HelpCircle className="h-3.5 w-3.5" />
          </div>
          <span className={`text-base font-bold sm:text-lg ${
            isOpen ? "text-brs-900" : "text-brs-700"
          }`}>
            {item.question}
          </span>
        </div>
        <div className={`ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
          isOpen ? "rotate-180 border-brs-600 bg-brs-600 text-white" : "border-brs-200 text-brs-400"
        }`}>
          {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="border-t border-brs-50 px-5 pb-6 pt-2 sm:px-6 sm:pb-8">
              <p className="whitespace-pre-line text-[15px] leading-relaxed text-slate-600 sm:text-base">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative overflow-hidden bg-slate-50 py-24 sm:py-32">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 h-96 w-96 bg-brs-600/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-96 w-96 bg-brs-600/5 blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-12 lg:items-start">
          
          {/* Left Column: Visual & Header */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center rounded-full bg-brs-600/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brs-700">
                Support & Info
              </span>
              <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-brs-900 sm:text-5xl">
                Common <br />
                <span className="text-brs-600">Queries</span>
              </h2>
              <p className="mt-6 text-lg font-medium leading-relaxed text-slate-600">
                Find answers to the most frequent questions about our society, membership programs, and industrial initiatives.
              </p>
            </motion.div>
          </div>

          {/* Right Column: FAQ Accordion */}
          <div className="lg:col-span-7">
            <div className="space-y-4">
              {FAQ_ITEMS.map((item, index) => (
                <FAQItem
                  key={index}
                  item={item}
                  index={index}
                  isOpen={openIndex === index}
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
