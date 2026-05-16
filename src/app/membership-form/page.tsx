"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  Upload, 
  User, 
  Mail, 
  Building2, 
  GraduationCap, 
  Phone, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Globe
} from "lucide-react";
import Footer from "@/components/Footer";

const MEMBERSHIP_TYPES = [
  {
    id: "life-individual",
    name: "Life Member (Individual)",
    price: "8,000",
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "life-org",
    name: "Life Member (Organization)",
    price: "24,000",
    color: "from-blue-600 to-indigo-700",
  },
  {
    id: "general-individual",
    name: "General Member (Individual)",
    price: "5,000",
    color: "from-brs-600 to-brs-800",
  },
  {
    id: "general-org",
    name: "General Member (Organization)",
    price: "15,000",
    color: "from-teal-600 to-emerald-700",
  },
  {
    id: "student",
    name: "Student/Post-Doctoral Researcher",
    price: "2,000",
    color: "from-amber-500 to-orange-600",
  }
];

export default function MembershipFormPage() {
  const [selectedType, setSelectedType] = useState("");
  const [formData, setFormData] = useState({
    // Step 1
    prefix: "Mr.",
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    streetAddress: "",
    addressLine2: "",
    city: "",
    stateRegion: "",
    zipCode: "",
    country: "India",
    membershipTypeDropdown: "",
    // Step 2
    academicDegree: "",
    presentAffiliation: "",
    pastAffiliations: "",
    publications: "",
    statement: "",
    photograph: null as File | null,
    signature: null as File | null,
    receipt: null as File | null
  });

  // Captcha State
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, result: 0 });
  const [captchaInput, setCaptchaInput] = useState("");

  const generateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 10) + 1;
    const n2 = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ num1: n1, num2: n2, result: n1 + n2 });
    setCaptchaInput("");
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    }
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (currentStep > 1 || isSuccess) {
      const formElement = document.getElementById("application-form");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [currentStep, isSuccess]);

  const getSelectedPrice = () => {
    // 1. Check card selection first
    const selectedTier = MEMBERSHIP_TYPES.find(t => t.id === selectedType);
    if (selectedTier) return selectedTier.price;

    // 2. Fallback to dropdown selection
    if (formData.membershipTypeDropdown) {
      // Extract from: "Life Member (Individual) - Rs. 8,000"
      const match = formData.membershipTypeDropdown.match(/Rs\.\s*([\d,]+)/);
      return match ? match[1] : "0";
    }
    return "0";
  };

  const handleNext = () => {
    if (currentStep === 1) {
      const requiredStep1 = [
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.contactNumber,
        formData.streetAddress,
        formData.city,
        formData.stateRegion,
        formData.zipCode,
        formData.membershipTypeDropdown
      ];
      if (requiredStep1.some(field => !field || typeof field === 'string' && field.trim() === '')) {
        alert("Please fill in all mandatory fields (marked with *) before proceeding.");
        return;
      }
    } else if (currentStep === 2) {
      const requiredTextStep2 = [
        formData.academicDegree,
        formData.presentAffiliation,
        formData.pastAffiliations,
        formData.publications,
        formData.statement
      ];
      if (requiredTextStep2.some(field => !field || typeof field === 'string' && field.trim() === '')) {
        alert("Please fill in all mandatory text fields (marked with *) before proceeding to payment.");
        return;
      }
      
      const requiredFilesStep2 = [
        formData.photograph,
        formData.signature
      ];
      if (requiredFilesStep2.some(file => !file)) {
        alert("Please upload all required documents before proceeding to payment.");
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handlePaymentSubmit = async () => {
    // Captcha Validation
    if (parseInt(captchaInput) !== captcha.result) {
      alert("Incorrect captcha answer. Please try again.");
      generateCaptcha();
      return;
    }

    // Receipt Validation
    if (!formData.receipt) {
      alert("Please upload the payment receipt (screenshot of UPI payment) before submitting.");
      return;
    }

    setIsProcessing(true);
    
    // Simulate Submission Process
    setTimeout(async () => {
      try {
        const selectedTier = MEMBERSHIP_TYPES.find(t => t.id === selectedType);
        
        // Call our backend API to send the emails
        const response = await fetch('/api/submit-application', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            membershipType: selectedTier?.name || "Unknown Tier",
            amount: selectedTier?.price || "0"
          }),
        });

        if (response.ok) {
          setIsProcessing(false);
          setIsSuccess(true);
        } else {
          console.error("Failed to submit application");
          setIsProcessing(false);
          // In a real app, we'd show an error toast here
        }
      } catch (error) {
        console.error("Error connecting to server:", error);
        setIsProcessing(false);
      }
    }, 2500); // 2.5s mock payment delay
  };

  const steps = [
    { id: 1, title: "Personal Details" },
    { id: 2, title: "Uploads & Info" },
    { id: 3, title: "Payment Details" }
  ];

  return (
    <div className="bg-[#F8FAFC]">
      {/* ─── Hero Section ─── */}
      <section className="relative pt-32 pb-20 bg-brs-900 overflow-hidden text-center">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#8EB69B 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl uppercase">
              Join the <span className="text-brs-400">Society</span>
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-lg text-brs-100/70 font-medium">
              Choose your membership tier and start your journey in advancing next-generation battery technologies.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Membership Selection Cards ─── */}
      <section className="py-20 relative -mt-10 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {MEMBERSHIP_TYPES.map((tier, idx) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedType(tier.id)}
                className={`group relative p-6 rounded-2xl bg-white border cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
                  selectedType === tier.id ? "border-brs-600 ring-2 ring-brs-600/20" : "border-slate-100"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`h-3 w-3 rounded-full bg-gradient-to-r ${tier.color} ${selectedType === tier.id ? "animate-pulse" : ""}`} />
                    <h3 className="text-[15px] font-black text-brs-900 tracking-tight">{tier.name}</h3>
                  </div>
                  <div className={`flex items-baseline gap-1 px-4 py-2 rounded-xl border transition-all duration-500 ${
                    selectedType === tier.id ? "bg-brs-900 text-white border-brs-900" : "bg-slate-50 border-slate-100 group-hover:bg-brs-900 group-hover:text-white"
                  }`}>
                    <span className="text-sm font-black tracking-tight">₹{tier.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <Link href="/membership-rules" className="inline-flex items-center gap-2 px-8 py-3 bg-white border-2 border-slate-100 text-brs-900 hover:text-brs-600 hover:border-brs-200 rounded-xl font-bold shadow-sm transition-all hover:shadow-md group">
               Rules
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Application Form Wizard ─── */}
      <section className="pb-32 relative overflow-hidden" id="application-form">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden"
          >
            {/* Form Header */}
            <div className="bg-brs-900 p-8 sm:p-12 text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-brs-600/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
               <h2 className="text-3xl font-black text-white uppercase tracking-tight">Application Form</h2>
               <p className="mt-2 text-brs-100/60 font-medium">Complete the 3-step process to secure your membership.</p>
               
               {/* Progress Bar */}
               {!isSuccess && (
                 <div className="mt-10 max-w-2xl mx-auto">
                   <div className="flex justify-between items-center relative">
                     <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 rounded-full" />
                     <div 
                       className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brs-400 rounded-full transition-all duration-500"
                       style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                     />
                     {steps.map((step) => (
                       <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${
                           currentStep >= step.id ? "bg-brs-400 text-brs-900 shadow-[0_0_15px_rgba(142,182,155,0.5)]" : "bg-brs-800 text-white/50 border border-white/10"
                         }`}>
                           {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                         </div>
                         <span className={`text-[10px] uppercase tracking-widest font-bold absolute -bottom-6 w-32 text-center ${
                           currentStep >= step.id ? "text-brs-400" : "text-white/40"
                         }`}>
                           {step.title}
                         </span>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
            </div>

            {/* Success State */}
            {isSuccess ? (
              <div className="p-16 text-center space-y-6">
                <div className="mx-auto w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                  <Check className="h-12 w-12 text-emerald-600" />
                </div>
                <h3 className="text-3xl font-black text-brs-900">Application Submitted!</h3>
                <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                  Your payment was successful. We have sent a confirmation email to <span className="font-bold text-brs-600">{formData.email || "your email address"}</span>. The administration will review your application shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={(e) => e.preventDefault()} className="p-8 sm:p-12 mt-4 space-y-10">
                <AnimatePresence mode="wait">
                  
                  {/* STEP 1: Personal Details */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-10"
                    >
                      {/* Name Fields */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-bold text-brs-900">Name <span className="text-red-500">*</span></h3>
                        <div className="grid sm:grid-cols-12 gap-4">
                          <div className="sm:col-span-3 space-y-1">
                            <label className="text-xs text-slate-500">Prefix</label>
                            <select 
                              name="prefix"
                              value={formData.prefix}
                              onChange={handleInputChange}
                              className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brs-600 outline-none"
                            >
                              <option value="Mr.">Mr.</option>
                              <option value="Ms.">Ms.</option>
                              <option value="Mrs.">Mrs.</option>
                              <option value="Dr.">Dr.</option>
                              <option value="Prof.">Prof.</option>
                            </select>
                          </div>
                          <div className="sm:col-span-4 space-y-1">
                            <label className="text-xs text-slate-500">First</label>
                            <input 
                              type="text" 
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brs-600 outline-none"
                            />
                          </div>
                          <div className="sm:col-span-5 space-y-1">
                            <label className="text-xs text-slate-500">Last</label>
                            <input 
                              type="text" 
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brs-600 outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Email Field */}
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-brs-900">Email <span className="text-red-500">*</span></h3>
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brs-600 outline-none"
                        />
                      </div>

                      {/* Contact Number Field */}
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-brs-900">Contact Number <span className="text-red-500">*</span></h3>
                        <div className="flex bg-white border border-slate-300 rounded-md overflow-hidden">
                          <div className="flex items-center px-3 bg-slate-50 border-r border-slate-300">
                             <img src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg" alt="India" className="h-3 w-4 mr-1" />
                             <span className="text-xs">▾</span>
                          </div>
                          <input 
                            type="tel" 
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleInputChange}
                            placeholder="+91 81234 56789"
                            className="w-full px-3 py-2 text-sm focus:ring-1 focus:ring-brs-600 outline-none"
                          />
                        </div>
                      </div>

                      {/* Present Address Fields */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-bold text-brs-900">Present Address <span className="text-red-500">*</span></h3>
                        
                        <div className="space-y-1">
                          <input 
                            type="text" 
                            name="streetAddress"
                            value={formData.streetAddress}
                            onChange={handleInputChange}
                            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brs-600 outline-none"
                          />
                          <label className="text-xs text-slate-500">Street Address</label>
                        </div>
                        
                        <div className="space-y-1">
                          <input 
                            type="text" 
                            name="addressLine2"
                            value={formData.addressLine2}
                            onChange={handleInputChange}
                            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brs-600 outline-none"
                          />
                          <label className="text-xs text-slate-500">Address Line 2</label>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <input 
                              type="text" 
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brs-600 outline-none"
                            />
                            <label className="text-xs text-slate-500">City</label>
                          </div>
                          <div className="space-y-1">
                            <input 
                              type="text" 
                              name="stateRegion"
                              value={formData.stateRegion}
                              onChange={handleInputChange}
                              className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brs-600 outline-none"
                            />
                            <label className="text-xs text-slate-500">State / Province / Region</label>
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <input 
                              type="text" 
                              name="zipCode"
                              value={formData.zipCode}
                              onChange={handleInputChange}
                              className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brs-600 outline-none"
                            />
                            <label className="text-xs text-slate-500">ZIP / Postal Code</label>
                          </div>
                          <div className="space-y-1">
                            <select 
                              name="country"
                              value={formData.country}
                              onChange={handleInputChange}
                              className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brs-600 outline-none"
                            >
                              <option value="India">India</option>
                              <option value="USA">USA</option>
                              <option value="UK">UK</option>
                            </select>
                            <label className="text-xs text-slate-500">Country</label>
                          </div>
                        </div>
                      </div>

                      {/* Membership Type Field */}
                      <div className="space-y-6">
                        <div className="space-y-1">
                          <h3 className="text-sm font-bold text-brs-900">Membership Type <span className="text-red-500">*</span></h3>
                          <select 
                            name="membershipTypeDropdown"
                            value={formData.membershipTypeDropdown}
                            onChange={handleInputChange}
                            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brs-600 outline-none"
                          >
                            <option value="">Select an option</option>
                            <option value="Life Member (Individual) - Rs. 8,000">Life Member (Individual) - Rs. 8,000</option>
                            <option value="Life Member (Organization) - Rs. 24,000">Life Member (Organization) - Rs. 24,000</option>
                            <option value="General Member (Individual) - Rs. 5,000">General Member (Individual) - Rs. 5,000</option>
                            <option value="General Member (Organization) - Rs. 15,000">General Member (Organization) - Rs. 15,000</option>
                            <option value="Student/Post-Doctoral Researcher - Rs. 2,000">Student/Post-Doctoral Researcher - Rs. 2,000</option>
                          </select>
                        </div>

                        {/* Membership Fees Field */}
                        <div className="space-y-1">
                          <h3 className="text-sm font-bold text-brs-900">Membership Fees <span className="text-red-500">*</span></h3>
                          <select 
                            disabled
                            className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-500 cursor-not-allowed outline-none"
                          >
                            <option value="">{formData.membershipTypeDropdown || "Please select a membership type above"}</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: Uploads & Text Fields */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-10"
                    >
                      {/* Last Academic Degree Field */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-bold text-brs-900">Last Academic Degree <span className="text-red-500">*</span></h3>
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                            <input type="radio" name="academicDegree" value="Ph.D" onChange={handleInputChange} checked={formData.academicDegree === 'Ph.D'} className="accent-brs-600" />
                            Ph.D
                          </label>
                          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                            <input type="radio" name="academicDegree" value="Masters" onChange={handleInputChange} checked={formData.academicDegree === 'Masters'} className="accent-brs-600" />
                            Masters
                          </label>
                          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                            <input type="radio" name="academicDegree" value="Undergraduate" onChange={handleInputChange} checked={formData.academicDegree === 'Undergraduate'} className="accent-brs-600" />
                            Undergraduate
                          </label>
                        </div>
                      </div>

                      {/* Present Affiliation Field */}
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-brs-900">Present Affiliation <span className="text-red-500">*</span></h3>
                        <input 
                          type="text" 
                          name="presentAffiliation"
                          value={formData.presentAffiliation}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brs-600 outline-none"
                        />
                      </div>

                      {/* Past Affiliations Field */}
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-brs-900">Past Affiliation(s) and role(s) (maximum 200 words) <span className="text-red-500">*</span></h3>
                        <textarea 
                          rows={6}
                          name="pastAffiliations"
                          value={formData.pastAffiliations}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brs-600 outline-none resize-y"
                        />
                      </div>

                      {/* Selected publications Field */}
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-brs-900">Selected publications/patents/technology transfer (if applicable) <span className="text-red-500">*</span></h3>
                        <textarea 
                          rows={6}
                          name="publications"
                          value={formData.publications}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brs-600 outline-none resize-y"
                        />
                      </div>

                      {/* Statement Field */}
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-brs-900">Statement why intending to be member of BRS, including expected benefits and contributions (maximum 200 words) <span className="text-red-500">*</span></h3>
                        <textarea 
                          rows={6}
                          name="statement"
                          value={formData.statement}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-brs-600 outline-none resize-y"
                        />
                      </div>

                      {/* File Uploads (Photograph) */}
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-brs-900">Please upload recent photograph (in .png, .jpg, .pdf, .jpeg format only) <span className="text-red-500">*</span></h3>
                        <input 
                          type="file" 
                          name="photograph"
                          accept=".png,.jpg,.jpeg,.pdf"
                          onChange={handleFileChange}
                          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-brs-700 hover:file:bg-slate-200 border border-slate-300 rounded-md bg-white cursor-pointer" 
                        />
                        <p className="text-xs text-slate-500 mt-1">Accepted file types: png, jpg, pdf, jpeg, Max. file size: 20 MB.</p>
                      </div>


                      {/* File Uploads (Signature) */}
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-brs-900">Signature <span className="text-red-500">*</span></h3>
                        <input 
                          type="file" 
                          name="signature"
                          accept=".png,.jpg,.jpeg,.pdf"
                          onChange={handleFileChange}
                          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-brs-700 hover:file:bg-slate-200 border border-slate-300 rounded-md bg-white cursor-pointer" 
                        />
                        <p className="text-xs text-slate-500 mt-1">Max. file size: 1 MB.</p>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: Manual Payment & Submission */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-6 sm:p-10 relative overflow-hidden">
                        <div className="relative z-10">
                          <div className="text-center mb-10">
                            <h3 className="text-3xl font-black text-brs-900 mb-2 tracking-tight">Final Step: Payment Verification</h3>
                            <p className="text-slate-500 font-medium">Please complete your payment and upload the verification details below.</p>
                          </div>

                          <div className="max-w-3xl mx-auto space-y-10">
                            
                            {/* 1. Instructions */}
                            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                              <h4 className="text-sm font-black text-brs-900 mb-6 uppercase tracking-[0.2em] flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-brs-900 text-white flex items-center justify-center text-[10px]">01</span>
                                Payment Instructions
                              </h4>
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <li className="flex gap-4 items-start">
                                  <div className="h-6 w-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                                  </div>
                                  <p className="text-xs text-slate-600 font-medium leading-relaxed">Select mode of payment (UPI, Card, etc.) and pay using the details below.</p>
                                </li>
                                <li className="flex gap-4 items-start">
                                  <div className="h-6 w-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                                  </div>
                                  <p className="text-xs text-slate-600 font-medium leading-relaxed">Save or download the transaction receipt/screenshot after payment.</p>
                                </li>
                                <li className="flex gap-4 items-start">
                                  <div className="h-6 w-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                                  </div>
                                  <p className="text-xs text-slate-600 font-medium leading-relaxed">Ensure all mandatory fields in previous steps are correctly filled.</p>
                                </li>
                                <li className="flex gap-4 items-start">
                                  <div className="h-6 w-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                                  </div>
                                  <p className="text-xs text-slate-600 font-medium leading-relaxed">Upload the receipt screenshot and complete the security check.</p>
                                </li>
                              </ul>
                            </div>

                            {/* 2. Bank Details & 3. QR Code */}
                            <div className="flex flex-col gap-8">
                              {/* Bank Details Card */}
                              <div className="bg-brs-900 text-white p-8 rounded-[2.5rem] shadow-xl flex flex-col justify-center relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brs-600/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                                <h4 className="text-xs font-black mb-8 uppercase tracking-[0.3em] text-brs-400 flex items-center gap-3">
                                  <span className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center text-[8px]">02</span>
                                  Bank Details
                                </h4>
                                <div className="space-y-6 text-xs font-bold relative z-10">
                                  <div className="border-b border-white/10 pb-2">
                                    <span className="opacity-40 block uppercase text-[8px] mb-1 tracking-widest">Account Name</span>
                                    <span className="text-sm">BATTERY RESEARCH SOCIETY</span>
                                  </div>
                                  <div className="border-b border-white/10 pb-2">
                                    <span className="opacity-40 block uppercase text-[8px] mb-1 tracking-widest">Account Number</span>
                                    <span className="text-sm tracking-widest">43139416491</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="border-b border-white/10 pb-2">
                                      <span className="opacity-40 block uppercase text-[8px] mb-1 tracking-widest">IFSC Code</span>
                                      <span className="text-sm text-brs-400">SBIN0001069</span>
                                    </div>
                                    <div className="border-b border-white/10 pb-2">
                                      <span className="opacity-40 block uppercase text-[8px] mb-1 tracking-widest">MICR Code</span>
                                      <span className="text-sm">247002094</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* QR Code Card - MUCH LARGER */}
                              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-8 group hover:border-brs-600 transition-colors duration-500">
                                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3">
                                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[8px]">03</span>
                                  Scan to Pay
                                </h4>
                                <div className="w-full max-w-[450px] aspect-square bg-slate-50 rounded-[3rem] flex items-center justify-center relative overflow-hidden border border-slate-100 p-8 group-hover:scale-105 transition-transform duration-500 shadow-inner">
                                  <img 
                                    src="/batteryresearchqrsbiqrcode.jpg" 
                                    alt="UPI QR Code" 
                                    className="w-full h-full object-contain drop-shadow-md"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* 4. Upload & 5. Captcha */}
                            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-10">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                  <h4 className="text-xs font-black text-brs-900 uppercase tracking-[0.2em] flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full bg-brs-900 text-white flex items-center justify-center text-[8px]">04</span>
                                    Upload Receipt <span className="text-red-500 ml-1">*</span>
                                  </h4>
                                  <div className="relative">
                                    <input 
                                      type="file" 
                                      name="receipt"
                                      id="receipt-upload"
                                      accept=".png,.jpg,.jpeg,.pdf"
                                      onChange={handleFileChange}
                                      className="hidden" 
                                    />
                                    <label 
                                      htmlFor="receipt-upload"
                                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 hover:border-brs-600 transition-all group"
                                    >
                                      {formData.receipt ? (
                                        <div className="flex items-center gap-3 text-emerald-600 font-bold text-sm">
                                          <Check className="h-5 w-5" />
                                          {formData.receipt.name}
                                        </div>
                                      ) : (
                                        <div className="flex flex-col items-center gap-2">
                                          <Upload className="h-6 w-6 text-slate-400 group-hover:text-brs-600 transition-colors" />
                                          <span className="text-xs font-bold text-slate-500">Click to upload receipt</span>
                                          <span className="text-[10px] text-slate-400 uppercase tracking-widest">JPG, PNG or PDF (Max 20MB)</span>
                                        </div>
                                      )}
                                    </label>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <h4 className="text-xs font-black text-brs-900 uppercase tracking-[0.2em] flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full bg-brs-900 text-white flex items-center justify-center text-[8px]">05</span>
                                    Security Check <span className="text-red-500 ml-1">*</span>
                                  </h4>
                                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex items-center justify-between shadow-inner">
                                    <span className="text-xl font-black text-brs-900 tracking-tighter">
                                      {captcha.num1} + {captcha.num2} =
                                    </span>
                                    <input 
                                      type="number"
                                      placeholder="?"
                                      value={captchaInput}
                                      onChange={(e) => setCaptchaInput(e.target.value)}
                                      className="w-24 bg-white border border-slate-200 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-brs-600 outline-none font-black text-center shadow-sm"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="pt-8 border-t border-slate-100 flex flex-col items-center gap-2">
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">Total Membership Fee</p>
                                <p className="text-5xl font-black text-brs-900 tracking-tight">₹{getSelectedPrice()}</p>
                              </div>
                            </div>
                          </div>
                        </div>


                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-brs-600/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-8 py-4 text-slate-500 font-bold text-sm uppercase tracking-widest hover:text-brs-900 transition-colors"
                    >
                      Back
                    </button>
                  ) : <div></div>}

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center gap-3 px-10 py-4 bg-brs-900 text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-brs-800 transition-all shadow-[0_10px_20px_-10px_rgba(5,31,32,0.5)]"
                    >
                      Next Step
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                        type="button"
                        onClick={handlePaymentSubmit}
                        disabled={isProcessing}
                        className="group relative flex items-center gap-3 bg-brs-900 hover:bg-[#0A2F30] text-white px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        <span className="relative flex items-center gap-2">
                          {isProcessing ? "Submitting..." : `Submit & Pay ₹${getSelectedPrice()}`}
                          <ShieldCheck className={`h-4 w-4 ${isProcessing ? "hidden" : "block"}`} />
                        </span>
                      </button>
                  )}
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

