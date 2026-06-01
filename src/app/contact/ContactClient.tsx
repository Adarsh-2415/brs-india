"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  Clock, 
  MessageSquare,
  ChevronRight
} from "lucide-react";
import Footer from "@/components/Footer";

const CONTACT_INFO = [
  {
    icon: Phone,
    title: "Call Us",
    subtitle: "Mon-Sat from 9am to 6pm",
    value: "+91-1332-284861",
    href: "tel:+911332284861",
    tooltip: "Click to call directly",
    color: "bg-pink-500/10 text-pink-500",
  },
  {
    icon: MapPin,
    title: "Our Office",
    subtitle: "Come say hello at our location",
    value: "Room No: 318, Level 2, Dept. of Physics, IIT Roorkee, Uttarakhand, India",
    href: "https://www.google.com/maps/search/?api=1&query=IIT+Roorkee+Department+of+Physics",
    tooltip: "View on Google Maps",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    icon: Mail,
    title: "Email Us",
    subtitle: "Drop us an email anytime",
    value: "brsoffice.india@gmail.com",
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=brsoffice.india@gmail.com",
    tooltip: "Click to open Gmail & send directly",
    color: "bg-blue-500/10 text-blue-500",
  },
];

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    enquiryType: "General Inquiry",
    message: ""
  });
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, result: 0 });
  const [captchaInput, setCaptchaInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 10) + 1;
    const n2 = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ num1: n1, num2: n2, result: n1 + n2 });
    setCaptchaInput("");
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (parseInt(captchaInput) !== captcha.result) {
      alert("Incorrect captcha answer. Please try again.");
      generateCaptcha();
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Message sent successfully! We will get back to you soon.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          enquiryType: "General Inquiry",
          message: ""
        });
        setCaptchaInput("");
        generateCaptcha();
      } else {
        alert(`Failed to send message: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="bg-white">
      {/* ─── Hero Section ─── */}
      <section className="relative pt-32 pb-20 bg-[#FDFCFF] overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brs-600/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brs-600/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl font-black tracking-tight text-brs-900 sm:text-6xl lg:text-7xl">
                Contact <span className="text-brs-600">Us</span>
              </h1>
              <p className="mt-6 text-xl font-bold text-brs-700 uppercase tracking-wider">
                Let&apos;s Build Something Great Together
              </p>
              <p className="mt-4 text-lg text-slate-500 leading-relaxed max-w-lg">
                Have a project in mind, a question about our research, or need expert guidance? We&apos;re here to help. Reach out to us and let&apos;s discuss how we can advance battery technology.
              </p>
            </motion.div>

            {/* Scientific Phone Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative hidden lg:flex justify-center"
            >
              <div className="relative">
                {/* Orbital Rings */}
                <div className="absolute inset-0 -m-12 border border-slate-200 rounded-full animate-[spin_20s_linear_infinite]" />
                <div className="absolute inset-0 -m-20 border border-slate-100 rounded-full animate-[spin_30s_linear_infinite_reverse]" />
                
                {/* Floating Icons on Rings */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-8 w-8 bg-white shadow-lg rounded-full flex items-center justify-center border border-slate-100">
                  <Mail className="h-4 w-4 text-brs-600" />
                </div>
                <div className="absolute top-1/2 -right-12 -translate-y-1/2 h-8 w-8 bg-white shadow-lg rounded-full flex items-center justify-center border border-slate-100">
                  <Phone className="h-4 w-4 text-brs-600" />
                </div>
                
                {/* Central Visual */}
                <div className="relative h-64 w-48 bg-gradient-to-br from-brs-900 to-brs-700 rounded-[2.5rem] p-4 shadow-2xl flex flex-col items-center justify-center text-white overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-white/20 blur-sm" />
                   <div className="grid grid-cols-3 gap-2 w-full mt-4">
                     {[...Array(9)].map((_, i) => (
                       <div key={i} className="h-2 w-full bg-white/10 rounded-full" />
                     ))}
                   </div>
                   <MessageSquare className="h-16 w-16 my-8 text-brs-400" />
                   <div className="h-10 w-full bg-white/10 rounded-xl" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Contact Form Card ─── */}
      <section className="relative -mt-12 pb-24 z-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative bg-brs-900 rounded-[2.5rem] p-8 sm:p-12 lg:p-16 shadow-[0_40px_80px_-15px_rgba(5,31,32,0.5)] overflow-hidden"
          >
            {/* Background Gradient Orbs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brs-600/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-brs-400/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative text-center mb-12">
              <span className="text-brs-400 text-xs font-black uppercase tracking-[0.3em]">
                • Contact Us
              </span>
              <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
                Get in Touch
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-8 relative">
              <div className="space-y-2">
                <label className="text-xs font-bold text-brs-100/50 uppercase ml-1">Full Name *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-brs-600/50 focus:bg-white/10 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-brs-100/50 uppercase ml-1">Email Address *</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-brs-600/50 focus:bg-white/10 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-brs-100/50 uppercase ml-1">Phone Number *</label>
                <input 
                  type="text" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-brs-600/50 focus:bg-white/10 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-brs-100/50 uppercase ml-1">Enquiry Type *</label>
                <select 
                  name="enquiryType"
                  value={formData.enquiryType}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-brs-600/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                >
                  <option className="bg-brs-900" value="General Inquiry">General Inquiry</option>
                  <option className="bg-brs-900" value="Membership">Membership</option>
                  <option className="bg-brs-900" value="Research Collaboration">Research Collaboration</option>
                </select>
              </div>
              <div className="sm:col-span-2 space-y-2">
                <label className="text-xs font-bold text-brs-100/50 uppercase ml-1">Message *</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Message"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-brs-600/50 focus:bg-white/10 transition-all resize-none"
                />
              </div>
              
              {/* Captcha Section */}
              <div className="sm:col-span-2">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-brs-100/50 uppercase ml-1">Security Question *</label>
                    <p className="text-white font-black text-xl bg-white/10 px-4 py-2 rounded-xl border border-white/10">
                      {captcha.num1} + {captcha.num2} = ?
                    </p>
                  </div>
                  <div className="w-full sm:w-auto flex-1">
                    <label className="text-xs font-bold text-brs-100/50 uppercase ml-1">Your Answer *</label>
                    <input 
                      type="number"
                      placeholder="Enter result"
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-brs-600/50 focus:bg-white/10 transition-all font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2 flex justify-center mt-4">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative inline-flex items-center gap-3 px-10 py-4 bg-transparent border border-white/20 rounded-full text-white font-bold text-sm overflow-hidden transition-all hover:border-brs-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-brs-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative">{isSubmitting ? "Sending..." : "Send Message"}</span>
                  {!isSubmitting && <ChevronRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ─── Contact Info Grid ─── */}
      <section className="pb-32 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {CONTACT_INFO.map((info, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group p-8 rounded-[2rem] bg-slate-50 border border-slate-100 text-center hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
              >
                <div className={`mx-auto h-16 w-16 rounded-2xl ${info.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                  <info.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-extrabold text-brs-900 mb-2 select-text">{info.title}</h3>
                <p className="text-slate-400 text-sm mb-4 select-text">{info.subtitle}</p>
                <div className="relative">
                  <a 
                    href={info.href}
                    target={info.title === "Email Us" || info.title === "Our Office" ? "_blank" : undefined}
                    rel={info.title === "Email Us" || info.title === "Our Office" ? "noopener noreferrer" : undefined}
                    className="text-brs-900 font-bold leading-relaxed select-text hover:text-brs-600 transition-colors"
                  >
                    {info.value}
                  </a>
                  {/* Floating Tooltip */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap">
                    <div className="bg-brs-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg border border-brs-600/30">
                      {info.tooltip}
                    </div>
                    {/* Tooltip Arrow */}
                    <div className="mx-auto w-2 h-2 bg-brs-900 rotate-45 -mt-1 border-r border-b border-brs-600/30" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
