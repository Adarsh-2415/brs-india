"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  Upload, 
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  XCircle,
  X
} from "lucide-react";
import Footer from "@/components/Footer";

const MEMBERSHIP_TYPES = [
  {
    id: "life-individual",
    name: "Life Member (Individual)",
    basePrice: "8,000",
    gstAmount: "1,440",
    price: "9,440",
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "life-org",
    name: "Life Member (Organization)",
    basePrice: "24,000",
    gstAmount: "4,320",
    price: "28,320",
    color: "from-blue-600 to-indigo-700",
  },
  {
    id: "general-individual",
    name: "General Member (Individual)",
    basePrice: "5,000",
    gstAmount: "900",
    price: "5,900",
    color: "from-brs-600 to-brs-800",
  },
  {
    id: "general-org",
    name: "General Member (Organization)",
    basePrice: "15,000",
    gstAmount: "2,700",
    price: "17,700",
    color: "from-teal-600 to-emerald-700",
  },
  {
    id: "student",
    name: "Student/Post-Doctoral Researcher",
    basePrice: "2,000",
    gstAmount: "360",
    price: "2,360",
    color: "from-amber-500 to-orange-600",
  }
];

export default function MembershipFormClient() {
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
    councilRef1: null as File | null,
    councilRef2: null as File | null,
    phdYear: "",
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

  const [errors, setErrors] = useState<Record<string, string>>({});

  const getWordCount = (str: string): number => {
    return str ? str.trim().split(/\s+/).filter(Boolean).length : 0;
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    // First Name
    if (!formData.firstName || formData.firstName.trim() === "") {
      newErrors.firstName = "First name is required.";
    } else if (!/^[a-zA-Z\s'.\-\u00C0-\u017F]+$/.test(formData.firstName)) {
      newErrors.firstName = "First name should contain only letters, spaces, hyphens, apostrophes, or periods.";
    }

    // Last Name
    if (!formData.lastName || formData.lastName.trim() === "") {
      newErrors.lastName = "Last name is required.";
    } else if (!/^[a-zA-Z\s'.\-\u00C0-\u017F]+$/.test(formData.lastName)) {
      newErrors.lastName = "Last name should contain only letters, spaces, hyphens, apostrophes, or periods.";
    }

    // Email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email || formData.email.trim() === "") {
      newErrors.email = "Email address is required.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Contact Number
    const contactClean = (formData.contactNumber || "").replace(/\s/g, "").replace(/\-/g, "").replace(/\+/g, "");
    if (!formData.contactNumber || formData.contactNumber.trim() === "") {
      newErrors.contactNumber = "Contact number is required.";
    } else if (!/^\+?[0-9\s\-()]{7,20}$/.test(formData.contactNumber) || contactClean.length < 7 || contactClean.length > 15) {
      newErrors.contactNumber = "Please enter a valid contact number (7 to 15 digits).";
    }

    // Street Address
    if (!formData.streetAddress || formData.streetAddress.trim() === "") {
      newErrors.streetAddress = "Street address is required.";
    }

    // City
    if (!formData.city || formData.city.trim() === "") {
      newErrors.city = "City is required.";
    } else if (!/^[a-zA-Z\s.\-]+$/.test(formData.city)) {
      newErrors.city = "City should contain only letters, spaces, hyphens, or periods.";
    }

    // State / Region
    if (!formData.stateRegion || formData.stateRegion.trim() === "") {
      newErrors.stateRegion = "State / Region is required.";
    } else if (!/^[a-zA-Z\s.\-]+$/.test(formData.stateRegion)) {
      newErrors.stateRegion = "State / Region should contain only letters, spaces, hyphens, or periods.";
    }

    // Zip Code
    if (!formData.zipCode || formData.zipCode.trim() === "") {
      newErrors.zipCode = "ZIP / Postal Code is required.";
    } else if (!/^[a-zA-Z0-9\s\-]{3,10}$/.test(formData.zipCode)) {
      newErrors.zipCode = "Please enter a valid ZIP / Postal Code (3 to 10 alphanumeric characters).";
    }

    // Membership Type
    if (!formData.membershipTypeDropdown || formData.membershipTypeDropdown.trim() === "") {
      newErrors.membershipTypeDropdown = "Membership type is required.";
    }

    // Council Reference Documents for Life Memberships
    const isLifeMember = selectedType === "life-individual" || selectedType === "life-org";
    if (isLifeMember) {
      if (!formData.councilRef1) {
        newErrors.councilRef1 = "Council Reference Document 1 is required for Life Membership.";
      }
      if (!formData.councilRef2) {
        newErrors.councilRef2 = "Council Reference Document 2 is required for Life Membership.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    const isLifeMember = selectedType === "life-individual" || selectedType === "life-org";

    // Academic Degree
    if (!formData.academicDegree || formData.academicDegree.trim() === "") {
      newErrors.academicDegree = "Academic degree is required.";
    } else if (isLifeMember && !formData.academicDegree.toLowerCase().includes("ph")) {
      newErrors.academicDegree = "Only Ph.D holders are eligible for Life Membership.";
    }

    // PhD Award Year & Experience Validation (ONLY for Life Membership + Ph.D Degree)
    const isPhdSelected = (formData.academicDegree || '').toLowerCase().includes('ph');
    if (isLifeMember && isPhdSelected) {
      if (!formData.phdYear || formData.phdYear.trim() === "") {
        newErrors.phdYear = "Year PhD Awarded / Completion Year is required.";
      } else {
        const phdYearNum = parseInt(formData.phdYear.trim(), 10);
        const currentYear = new Date().getFullYear();
        if (isNaN(phdYearNum) || phdYearNum < 1950 || phdYearNum > currentYear) {
          newErrors.phdYear = `Please enter a valid 4-digit year (1950 to ${currentYear}).`;
        } else if ((currentYear - phdYearNum) < 10) {
          newErrors.phdYear = `Minimum 10+ years of post-PhD experience (PhD awarded on or before ${currentYear - 10}) is required for Life Membership eligibility.`;
        }
      }
    }

    // Present Affiliation
    if (!formData.presentAffiliation || formData.presentAffiliation.trim() === "") {
      newErrors.presentAffiliation = "Present affiliation is required.";
    }

    // Past Affiliations
    if (!formData.pastAffiliations || formData.pastAffiliations.trim() === "") {
      newErrors.pastAffiliations = "Past affiliations are required.";
    } else if (getWordCount(formData.pastAffiliations) > 200) {
      newErrors.pastAffiliations = "Maximum 200 words allowed.";
    }

    // Publications
    if (!formData.publications || formData.publications.trim() === "") {
      newErrors.publications = "Selected publications/patents/technology transfer are required.";
    }

    // Statement
    if (!formData.statement || formData.statement.trim() === "") {
      newErrors.statement = "Statement is required.";
    } else if (getWordCount(formData.statement) > 200) {
      newErrors.statement = "Maximum 200 words allowed.";
    }

    // Photograph
    if (!formData.photograph) {
      newErrors.photograph = "Please upload your recent photograph.";
    }

    // Signature
    if (!formData.signature) {
      newErrors.signature = "Please upload your signature specimen.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }

    if (name === "membershipTypeDropdown") {
      if (value.includes("Life Member (Individual)")) setSelectedType("life-individual");
      else if (value.includes("Life Member (Organization)")) setSelectedType("life-org");
      else if (value.includes("General Member (Individual)")) setSelectedType("general-individual");
      else if (value.includes("General Member (Organization)")) setSelectedType("general-org");
      else if (value.includes("Student/Post-Doctoral Researcher")) setSelectedType("student");
      else setSelectedType("");
    }
  };

  useEffect(() => {
    if (selectedType) {
      let dropdownValue = "";
      if (selectedType === "life-individual") dropdownValue = "Life Member (Individual) - Rs. 9,440 (Rs. 8,000 + 18% GST)";
      else if (selectedType === "life-org") dropdownValue = "Life Member (Organization) - Rs. 28,320 (Rs. 24,000 + 18% GST)";
      else if (selectedType === "general-individual") dropdownValue = "General Member (Individual) - Rs. 5,900 (Rs. 5,000 + 18% GST)";
      else if (selectedType === "general-org") dropdownValue = "General Member (Organization) - Rs. 17,700 (Rs. 15,000 + 18% GST)";
      else if (selectedType === "student") dropdownValue = "Student/Post-Doctoral Researcher - Rs. 2,360 (Rs. 2,000 + 18% GST)";
      
      setFormData(prev => ({ ...prev, membershipTypeDropdown: dropdownValue }));
      setErrors(prev => {
        if (prev.membershipTypeDropdown) {
          const copy = { ...prev };
          delete copy.membershipTypeDropdown;
          return copy;
        }
        return prev;
      });
    }
  }, [selectedType]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fieldName = e.target.name;
    const file = e.target.files?.[0];

    // Clear any previous error
    setErrors(prev => {
      const copy = { ...prev };
      delete copy[fieldName];
      return copy;
    });

    if (!file) {
      setFormData(prev => ({ ...prev, [fieldName]: null }));
      return;
    }

    let allowedExts: string[] = [];
    let allowedMimes: string[] = [];
    let maxSizeMB = 0;

    if (fieldName === "photograph") {
      allowedExts = ["jpg", "jpeg", "png", "webp"];
      allowedMimes = ["image/jpeg", "image/png", "image/webp"];
      maxSizeMB = 2;
    } else if (fieldName === "signature") {
      allowedExts = ["jpg", "jpeg", "png", "webp"];
      allowedMimes = ["image/jpeg", "image/png", "image/webp"];
      maxSizeMB = 1;
    } else if (fieldName === "receipt") {
      allowedExts = ["jpg", "jpeg", "png", "webp", "pdf"];
      allowedMimes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
      maxSizeMB = 3;
    } else if (fieldName === "councilRef1" || fieldName === "councilRef2") {
      allowedExts = ["pdf"];
      allowedMimes = ["application/pdf"];
      maxSizeMB = 2; // 2MB max as required
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase() || "";
    const fileMime = file.type.toLowerCase();
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    const dangerousExts = ["exe", "bat", "js", "php", "zip", "rar"];
    if (dangerousExts.includes(fileExt)) {
      triggerNotification("error", "Security block: Invalid file format.");
      setErrors(prev => ({ ...prev, [fieldName]: "Invalid file format." }));
      e.target.value = "";
      setFormData(prev => ({ ...prev, [fieldName]: null }));
      return;
    }

    if (file.size > maxSizeBytes) {
      const errMessage = `File size exceeds the maximum limit of ${maxSizeMB} MB.`;
      triggerNotification("error", errMessage);
      setErrors(prev => ({ ...prev, [fieldName]: errMessage }));
      e.target.value = "";
      setFormData(prev => ({ ...prev, [fieldName]: null }));
      return;
    }

    if (!allowedExts.includes(fileExt) || !allowedMimes.includes(fileMime)) {
      const allowedText = (fieldName === "councilRef1" || fieldName === "councilRef2") ? "PDF" : fieldName === "receipt" ? "JPG, JPEG, PNG, WEBP, and PDF" : "JPG, JPEG, PNG, and WEBP";
      const errMessage = `Only ${allowedText} files are allowed.`;
      triggerNotification("error", errMessage);
      setErrors(prev => ({ ...prev, [fieldName]: errMessage }));
      e.target.value = "";
      setFormData(prev => ({ ...prev, [fieldName]: null }));
      return;
    }

    setFormData(prev => ({ ...prev, [fieldName]: file }));
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [notification, setNotification] = useState<{
    show: boolean;
    type: "success" | "error" | "warning";
    message: string;
  }>({ show: false, type: "success", message: "" });

  const triggerNotification = (type: "success" | "error" | "warning", message: string) => {
    setNotification({ show: true, type, message });
  };

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  useEffect(() => {
    if (currentStep > 1 || isSuccess) {
      const formElement = document.getElementById("application-form");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [currentStep, isSuccess]);

  const getSelectedPrice = () => {
    const selectedTier = MEMBERSHIP_TYPES.find(t => t.id === selectedType);
    if (selectedTier) return selectedTier.price;

    if (formData.membershipTypeDropdown) {
      const match = formData.membershipTypeDropdown.match(/Rs\.\s*([\d,]+)/);
      return match ? match[1] : "0";
    }
    return "0";
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateStep1()) {
        triggerNotification("warning", "Please correct the errors in the form before proceeding.");
        return;
      }
      const isLife = selectedType === "life-individual" || selectedType === "life-org";
      if (isLife && (!formData.academicDegree || formData.academicDegree !== "Ph.D")) {
        setFormData((prev) => ({ ...prev, academicDegree: "Ph.D" }));
      }
    } else if (currentStep === 2) {
      if (!validateStep2()) {
        triggerNotification("warning", "Please correct the errors and ensure all required files are uploaded before proceeding.");
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handlePaymentSubmit = async () => {
    if (parseInt(captchaInput) !== captcha.result) {
      triggerNotification("error", "Incorrect captcha answer. Please try again.");
      generateCaptcha();
      return;
    }

    if (!formData.receipt) {
      setErrors(prev => ({ ...prev, receipt: "Please upload the payment receipt." }));
      triggerNotification("warning", "Please upload the payment receipt (screenshot of UPI payment) before submitting.");
      return;
    }

    if (!validateStep1() || !validateStep2()) {
      triggerNotification("error", "There are errors in your application form. Please check previous steps.");
      return;
    }

    setIsProcessing(true);
    
    setTimeout(async () => {
      try {
        const selectedTier = MEMBERSHIP_TYPES.find(t => t.id === selectedType);
        const finalAmount = selectedTier?.price || getSelectedPrice();
        const finalTierName = selectedTier?.name || formData.membershipTypeDropdown.split(" - ")[0] || "Unknown Tier";
        
        const submitData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (value instanceof File) {
            submitData.append(key, value);
          } else if (value !== null && value !== undefined) {
            submitData.append(key, String(value));
          }
        });
        submitData.append("membershipType", finalTierName);
        submitData.append("amount", finalAmount);

        const response = await fetch('/api/submit-application', {
          method: 'POST',
          body: submitData,
        });

        const result = await response.json().catch(() => ({}));

        if (response.ok) {
          setIsProcessing(false);
          setIsSuccess(true);
        } else {
          console.error("Failed to submit application:", result.error);
          const errMsg = typeof result.error === 'object' && result.error !== null
            ? (result.error.message || JSON.stringify(result.error))
            : (result.error || 'Unknown error');
          triggerNotification("error", `Failed to submit application: ${errMsg}`);
          setIsProcessing(false);
        }
      } catch (error) {
        console.error("Error connecting to server:", error);
        triggerNotification("error", "An error occurred connecting to the server.");
        setIsProcessing(false);
      }
    }, 2500);
  };

  const steps = [
    { id: 1, title: "Personal Details" },
    { id: 2, title: "Uploads & Info" },
    { id: 3, title: "Payment Details" }
  ];

  return (
    <div className="bg-[#F8FAFC] overflow-x-hidden max-w-full">
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
                className="relative p-6 rounded-2xl bg-white border border-slate-100 shadow-sm select-none transition-all duration-300"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`h-3 w-3 rounded-full bg-gradient-to-r ${tier.color}`} />
                    <h3 className="text-[15px] font-black text-brs-900 tracking-tight">{tier.name}</h3>
                  </div>
                  <div className="flex flex-col items-end px-3 py-1.5 rounded-xl border border-slate-100 bg-slate-50 shrink-0">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-black text-brs-900 tracking-tight">₹{tier.price}</span>
                    </div>
                    <span className="text-[9px] font-semibold leading-tight text-slate-500">
                      ₹{tier.basePrice} + 18% GST
                    </span>
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
        <div className="mx-auto max-w-4xl px-3 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden overflow-x-hidden max-w-full"
          >
            {/* Form Header */}
            <div className="bg-brs-900 p-6 sm:p-12 text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-brs-600/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
               <h2 className="text-3xl font-black text-white uppercase tracking-tight">Application Form</h2>
               <p className="mt-2 text-brs-100/60 font-medium text-sm">Complete the 3-step process to secure your membership.</p>
               
               {/* Sticky-ready Progress Bar Container */}
               {!isSuccess && (
                 <div className="mt-10 max-w-2xl mx-auto bg-brs-900/90 py-4 backdrop-blur-md rounded-2xl">
                   <div className="flex justify-between items-center relative px-4 sm:px-0">
                     <div className="absolute left-4 right-4 sm:left-0 sm:right-0 top-1/2 -translate-y-1/2 h-1 bg-white/10 rounded-full" />
                     <div 
                       className="absolute left-4 sm:left-0 top-1/2 -translate-y-1/2 h-1 bg-brs-400 rounded-full transition-all duration-500"
                       style={{ width: `calc(${((currentStep - 1) / 2) * 100}% - ${currentStep === 1 ? '0px' : currentStep === 2 ? '8px' : '16px'})` }}
                     />
                     {steps.map((step) => (
                       <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 bg-brs-900 ${
                           currentStep >= step.id ? "bg-brs-400 text-brs-900 shadow-[0_0_15px_rgba(142,182,155,0.5)]" : "bg-brs-800 text-white/50 border border-white/10"
                         }`}>
                           {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                         </div>
                         <span className={`hidden sm:block text-[10px] uppercase tracking-widest font-bold absolute -bottom-6 w-32 text-center ${
                           currentStep >= step.id ? "text-brs-400" : "text-white/40"
                         }`}>
                           {step.title}
                         </span>
                       </div>
                     ))}
                   </div>
                   {/* Mobile step details indicator */}
                   <p className="sm:hidden text-center text-xs font-bold text-brs-400 mt-6 uppercase tracking-widest">
                     Step {currentStep} of {steps.length} • {steps[currentStep - 1].title}
                   </p>
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
              <form onSubmit={(e) => e.preventDefault()} className="px-3 py-6 sm:p-12 mt-4 space-y-10 overflow-x-hidden max-w-full">
                <AnimatePresence mode="wait">
                  
                  {/* STEP 1: Personal Details */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
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
                              className="w-full bg-white border border-slate-300 rounded-xl px-4 h-12 sm:h-14 text-sm sm:text-base focus:ring-2 focus:ring-brs-600 focus:border-brs-600 outline-none transition-all duration-200"
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
                              className={`w-full bg-white border rounded-xl px-4 h-12 sm:h-14 text-sm sm:text-base focus:ring-2 focus:ring-brs-600 focus:border-brs-600 outline-none transition-all duration-200 ${errors.firstName ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'}`}
                            />
                            {errors.firstName && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.firstName}</p>}
                          </div>
                          <div className="sm:col-span-5 space-y-1">
                            <label className="text-xs text-slate-500">Last</label>
                            <input 
                              type="text" 
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              className={`w-full bg-white border rounded-xl px-4 h-12 sm:h-14 text-sm sm:text-base focus:ring-2 focus:ring-brs-600 focus:border-brs-600 outline-none transition-all duration-200 ${errors.lastName ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'}`}
                            />
                            {errors.lastName && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.lastName}</p>}
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
                          className={`w-full bg-white border rounded-xl px-4 h-12 sm:h-14 text-sm sm:text-base focus:ring-2 focus:ring-brs-600 focus:border-brs-600 outline-none transition-all duration-200 ${errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'}`}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.email}</p>}
                      </div>

                      {/* Contact Number Field */}
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-brs-900">Contact Number <span className="text-red-500">*</span></h3>
                        <div className={`flex bg-white border rounded-xl h-12 sm:h-14 overflow-hidden focus-within:ring-2 focus-within:ring-brs-600 focus-within:border-brs-600 transition-all duration-200 ${errors.contactNumber ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'}`}>
                          <div className="flex items-center px-3 bg-slate-50 border-r border-slate-300 shrink-0">
                             <Image src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg" alt="India" className="h-3 w-4 mr-1" width={16} height={12} unoptimized />
                             <span className="text-xs text-slate-400">▾</span>
                          </div>
                          <input 
                            type="tel" 
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleInputChange}
                            placeholder="+91 81234 56789"
                            className="w-full px-4 text-sm sm:text-base outline-none bg-white"
                          />
                        </div>
                        {errors.contactNumber && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.contactNumber}</p>}
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
                            className={`w-full bg-white border rounded-xl px-4 h-12 sm:h-14 text-sm sm:text-base focus:ring-2 focus:ring-brs-600 focus:border-brs-600 outline-none transition-all duration-200 ${errors.streetAddress ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'}`}
                          />
                          <label className="text-xs text-slate-500">Street Address</label>
                          {errors.streetAddress && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.streetAddress}</p>}
                        </div>
                        
                        <div className="space-y-1">
                          <input 
                            type="text" 
                            name="addressLine2"
                            value={formData.addressLine2}
                            onChange={handleInputChange}
                            className="w-full bg-white border border-slate-300 rounded-xl px-4 h-12 sm:h-14 text-sm sm:text-base focus:ring-2 focus:ring-brs-600 focus:border-brs-600 outline-none transition-all duration-200"
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
                              className={`w-full bg-white border rounded-xl px-4 h-12 sm:h-14 text-sm sm:text-base focus:ring-2 focus:ring-brs-600 focus:border-brs-600 outline-none transition-all duration-200 ${errors.city ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'}`}
                            />
                            <label className="text-xs text-slate-500">City</label>
                            {errors.city && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.city}</p>}
                          </div>
                          <div className="space-y-1">
                            <input 
                              type="text" 
                              name="stateRegion"
                              value={formData.stateRegion}
                              onChange={handleInputChange}
                              className={`w-full bg-white border rounded-xl px-4 h-12 sm:h-14 text-sm sm:text-base focus:ring-2 focus:ring-brs-600 focus:border-brs-600 outline-none transition-all duration-200 ${errors.stateRegion ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'}`}
                            />
                            <label className="text-xs text-slate-500">State / Province / Region</label>
                            {errors.stateRegion && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.stateRegion}</p>}
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <input 
                              type="text" 
                              name="zipCode"
                              value={formData.zipCode}
                              onChange={handleInputChange}
                              className={`w-full bg-white border rounded-xl px-4 h-12 sm:h-14 text-sm sm:text-base focus:ring-2 focus:ring-brs-600 focus:border-brs-600 outline-none transition-all duration-200 ${errors.zipCode ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'}`}
                            />
                            <label className="text-xs text-slate-500">ZIP / Postal Code</label>
                            {errors.zipCode && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.zipCode}</p>}
                          </div>
                          <div className="space-y-1">
                            <select 
                              name="country"
                              value={formData.country}
                              onChange={handleInputChange}
                              className="w-full bg-white border border-slate-300 rounded-xl px-4 h-12 sm:h-14 text-sm sm:text-base focus:ring-2 focus:ring-brs-600 focus:border-brs-600 outline-none transition-all duration-200"
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
                            className={`w-full bg-white border rounded-xl px-4 h-12 sm:h-14 text-sm sm:text-base focus:ring-2 focus:ring-brs-600 focus:border-brs-600 outline-none transition-all duration-200 ${errors.membershipTypeDropdown ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'}`}
                          >
                            <option value="">Select an option</option>
                            <option value="Life Member (Individual) - Rs. 9,440 (Rs. 8,000 + 18% GST)">Life Member (Individual) - Rs. 9,440 (Rs. 8,000 + 18% GST)</option>
                            <option value="Life Member (Organization) - Rs. 28,320 (Rs. 24,000 + 18% GST)">Life Member (Organization) - Rs. 28,320 (Rs. 24,000 + 18% GST)</option>
                            <option value="General Member (Individual) - Rs. 5,900 (Rs. 5,000 + 18% GST)">General Member (Individual) - Rs. 5,900 (Rs. 5,000 + 18% GST)</option>
                            <option value="General Member (Organization) - Rs. 17,700 (Rs. 15,000 + 18% GST)">General Member (Organization) - Rs. 17,700 (Rs. 15,000 + 18% GST)</option>
                            <option value="Student/Post-Doctoral Researcher - Rs. 2,360 (Rs. 2,000 + 18% GST)">Student/Post-Doctoral Researcher - Rs. 2,360 (Rs. 2,000 + 18% GST)</option>
                          </select>
                          {errors.membershipTypeDropdown && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.membershipTypeDropdown}</p>}
                        </div>

                        {/* Membership Fees Field */}
                        <div className="space-y-1">
                          <h3 className="text-sm font-bold text-brs-900">Membership Fees <span className="text-red-500">*</span></h3>
                          <select 
                            disabled
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 h-12 sm:h-14 text-sm text-slate-500 cursor-not-allowed outline-none"
                          >
                            <option value="">{formData.membershipTypeDropdown || "Please select a membership type above"}</option>
                          </select>
                        </div>

                        {/* Council Reference Documents Uploads for Life Memberships */}
                        {(selectedType === "life-individual" || selectedType === "life-org") && (
                          <div className="space-y-6 pt-4 border-t border-slate-100 mt-6">
                            <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl flex items-start gap-3">
                              <AlertCircle className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                              <p className="text-xs sm:text-sm text-teal-800 font-medium leading-relaxed">
                                <strong>Note:</strong> Applicants selecting <strong>Life Member (Individual)</strong> or <strong>Life Member (Organization)</strong> must submit reference documents from 2 Council Members (PDF format only, Max 2MB each).
                              </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              {/* Council Reference 1 Upload */}
                              <div className="space-y-2">
                                <h4 className="text-xs font-bold text-brs-900 uppercase tracking-wider">
                                  Council Reference Document 1 <span className="text-red-500">*</span>
                                </h4>
                                <div className="relative border-2 border-dashed rounded-xl p-4 text-center hover:border-brs-600 transition-colors bg-white">
                                  <input 
                                    type="file" 
                                    name="councilRef1"
                                    accept=".pdf,application/pdf"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                  />
                                  <div className="flex flex-col items-center gap-1">
                                    <Upload className="h-5 w-5 text-slate-400" />
                                    <span className="text-xs font-semibold text-slate-600">
                                      {formData.councilRef1 ? formData.councilRef1.name : "Upload PDF (Max 2MB)"}
                                    </span>
                                    <span className="text-[10px] text-slate-400">PDF format only</span>
                                  </div>
                                </div>
                                {errors.councilRef1 && <p className="text-red-500 text-xs font-semibold">{errors.councilRef1}</p>}
                              </div>

                              {/* Council Reference 2 Upload */}
                              <div className="space-y-2">
                                <h4 className="text-xs font-bold text-brs-900 uppercase tracking-wider">
                                  Council Reference Document 2 <span className="text-red-500">*</span>
                                </h4>
                                <div className="relative border-2 border-dashed rounded-xl p-4 text-center hover:border-brs-600 transition-colors bg-white">
                                  <input 
                                    type="file" 
                                    name="councilRef2"
                                    accept=".pdf,application/pdf"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                  />
                                  <div className="flex flex-col items-center gap-1">
                                    <Upload className="h-5 w-5 text-slate-400" />
                                    <span className="text-xs font-semibold text-slate-600">
                                      {formData.councilRef2 ? formData.councilRef2.name : "Upload PDF (Max 2MB)"}
                                    </span>
                                    <span className="text-[10px] text-slate-400">PDF format only</span>
                                  </div>
                                </div>
                                {errors.councilRef2 && <p className="text-red-500 text-xs font-semibold">{errors.councilRef2}</p>}
                              </div>
                            </div>
                          </div>
                        )}
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
                      transition={{ duration: 0.25 }}
                      className="space-y-10"
                    >
                      {/* Last Academic Degree Field */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-brs-900">Last Academic Degree <span className="text-red-500">*</span></h3>
                          {(selectedType === "life-individual" || selectedType === "life-org") && (
                            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                              Ph.D Mandatory for Life Membership
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                            <input 
                              type="radio" 
                              name="academicDegree" 
                              value="Ph.D" 
                              onChange={handleInputChange} 
                              checked={formData.academicDegree === 'Ph.D'} 
                              className="accent-brs-600" 
                            />
                            <span className="font-medium text-slate-900">Ph.D</span>
                          </label>
                          <label className={`flex items-center gap-2 text-sm ${(selectedType === "life-individual" || selectedType === "life-org") ? 'text-slate-400 opacity-60 cursor-not-allowed select-none' : 'text-slate-700 cursor-pointer'}`}>
                            <input 
                              type="radio" 
                              name="academicDegree" 
                              value="Masters" 
                              onChange={handleInputChange} 
                              checked={formData.academicDegree === 'Masters'} 
                              disabled={selectedType === "life-individual" || selectedType === "life-org"}
                              className="accent-brs-600 disabled:opacity-50" 
                            />
                            <span>Masters</span>
                            {(selectedType === "life-individual" || selectedType === "life-org") && (
                              <span className="text-[10px] text-slate-400 italic">(Unavailable for Life Members)</span>
                            )}
                          </label>
                          <label className={`flex items-center gap-2 text-sm ${(selectedType === "life-individual" || selectedType === "life-org") ? 'text-slate-400 opacity-60 cursor-not-allowed select-none' : 'text-slate-700 cursor-pointer'}`}>
                            <input 
                              type="radio" 
                              name="academicDegree" 
                              value="Undergraduate" 
                              onChange={handleInputChange} 
                              checked={formData.academicDegree === 'Undergraduate'} 
                              disabled={selectedType === "life-individual" || selectedType === "life-org"}
                              className="accent-brs-600 disabled:opacity-50" 
                            />
                            <span>Undergraduate</span>
                            {(selectedType === "life-individual" || selectedType === "life-org") && (
                              <span className="text-[10px] text-slate-400 italic">(Unavailable for Life Members)</span>
                            )}
                          </label>
                        </div>
                        {errors.academicDegree && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.academicDegree}</p>}

                        {/* Year PhD Awarded Field & Eligibility Guidance Box (Shown ONLY for Life Membership when Ph.D is selected) */}
                        {((formData.academicDegree || '').toLowerCase().includes('ph')) && (selectedType === "life-individual" || selectedType === "life-org") && (
                          <div className="space-y-3 pt-2">
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                              <p className="text-xs sm:text-sm text-amber-900 font-medium leading-relaxed">
                                <strong>Eligibility Guidance:</strong> Kindly note that a minimum of 10+ years of experience post-PhD completion is required for Life Membership eligibility.
                              </p>
                            </div>

                            <div className="space-y-1">
                              <h3 className="text-sm font-bold text-brs-900">
                                Year PhD Awarded (YYYY) <span className="text-red-500">*</span>
                              </h3>
                              <input 
                                type="number" 
                                name="phdYear"
                                placeholder="e.g. 2012"
                                value={formData.phdYear}
                                onChange={handleInputChange}
                                className={`w-full sm:w-1/2 bg-white border rounded-xl px-4 h-12 sm:h-14 text-sm sm:text-base focus:ring-2 focus:ring-brs-600 focus:border-brs-600 outline-none transition-all duration-200 ${errors.phdYear ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'}`}
                              />
                              {errors.phdYear && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.phdYear}</p>}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Present Affiliation Field */}
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-brs-900">Present Affiliation <span className="text-red-500">*</span></h3>
                        <input 
                          type="text" 
                          name="presentAffiliation"
                          value={formData.presentAffiliation}
                          onChange={handleInputChange}
                          className={`w-full bg-white border rounded-xl px-4 h-12 sm:h-14 text-sm sm:text-base focus:ring-2 focus:ring-brs-600 focus:border-brs-600 outline-none transition-all duration-200 ${errors.presentAffiliation ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'}`}
                        />
                        {errors.presentAffiliation && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.presentAffiliation}</p>}
                      </div>

                      {/* Past Affiliations Field */}
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-brs-900">Past Affiliation(s) and role(s) (maximum 200 words) <span className="text-red-500">*</span></h3>
                        <textarea 
                          rows={6}
                          name="pastAffiliations"
                          value={formData.pastAffiliations}
                          onChange={handleInputChange}
                          className={`w-full bg-white border rounded-xl px-4 py-3.5 text-sm sm:text-base focus:ring-2 focus:ring-brs-600 focus:border-brs-600 outline-none transition-all duration-200 resize-y ${errors.pastAffiliations ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'}`}
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                          <span>Max: 200 words</span>
                          <span className={getWordCount(formData.pastAffiliations) > 200 ? "text-red-500 font-bold" : ""}>
                            {getWordCount(formData.pastAffiliations)} / 200 words
                          </span>
                        </div>
                        {errors.pastAffiliations && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.pastAffiliations}</p>}
                      </div>

                      {/* Selected publications Field */}
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-brs-900">Selected publications/patents/technology transfer (if applicable) <span className="text-red-500">*</span></h3>
                        <textarea 
                          rows={6}
                          name="publications"
                          value={formData.publications}
                          onChange={handleInputChange}
                          className={`w-full bg-white border rounded-xl px-4 py-3.5 text-sm sm:text-base focus:ring-2 focus:ring-brs-600 focus:border-brs-600 outline-none transition-all duration-200 resize-y ${errors.publications ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'}`}
                        />
                        {errors.publications && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.publications}</p>}
                      </div>

                      {/* Statement Field */}
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-brs-900">Statement why intending to be member of BRS, including expected benefits and contributions (maximum 200 words) <span className="text-red-500">*</span></h3>
                        <textarea 
                          rows={6}
                          name="statement"
                          value={formData.statement}
                          onChange={handleInputChange}
                          className={`w-full bg-white border rounded-xl px-4 py-3.5 text-sm sm:text-base focus:ring-2 focus:ring-brs-600 focus:border-brs-600 outline-none transition-all duration-200 resize-y ${errors.statement ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'}`}
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                          <span>Max: 200 words</span>
                          <span className={getWordCount(formData.statement) > 200 ? "text-red-500 font-bold" : ""}>
                            {getWordCount(formData.statement)} / 200 words
                          </span>
                        </div>
                        {errors.statement && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.statement}</p>}
                      </div>

                      {/* Responsive Grid for Photograph & Signature Uploads */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* File Uploads (Photograph) */}
                        <div className="space-y-2">
                          <h3 className="text-sm font-bold text-brs-900">Recent photograph (.png, .jpg, .jpeg, .webp) <span className="text-red-500">*</span></h3>
                          <input 
                            type="file" 
                            name="photograph"
                            accept=".png,.jpg,.jpeg,.webp"
                            onChange={handleFileChange}
                            className={`block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-brs-700 hover:file:bg-slate-200 border rounded-xl bg-white cursor-pointer transition-all duration-200 ${errors.photograph ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'}`} 
                          />
                          <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                            <div><strong>Accepted Formats:</strong> JPG, JPEG, PNG, WEBP</div>
                            <div><strong>Maximum File Size:</strong> 2 MB</div>
                          </div>
                          {errors.photograph && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.photograph}</p>}
                          {formData.photograph && formData.photograph instanceof File && formData.photograph.type.startsWith("image/") && (
                            <div className="mt-3 relative w-full max-h-48 overflow-hidden rounded-xl border border-slate-200 p-2 bg-slate-50 flex items-center justify-center">
                              <Image 
                                src={URL.createObjectURL(formData.photograph)} 
                                alt="Photograph Preview" 
                                className="w-full max-h-48 object-contain"
                                width={200}
                                height={200}
                                unoptimized
                              />
                            </div>
                          )}
                        </div>

                        {/* File Uploads (Signature) */}
                        <div className="space-y-2">
                          <h3 className="text-sm font-bold text-brs-900">Signature (.png, .jpg, .jpeg, .webp) <span className="text-red-500">*</span></h3>
                          <input 
                            type="file" 
                            name="signature"
                            accept=".png,.jpg,.jpeg,.webp"
                            onChange={handleFileChange}
                            className={`block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-brs-700 hover:file:bg-slate-200 border rounded-xl bg-white cursor-pointer transition-all duration-200 ${errors.signature ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'}`} 
                          />
                          <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                            <div><strong>Accepted Formats:</strong> JPG, JPEG, PNG, WEBP</div>
                            <div><strong>Maximum File Size:</strong> 1 MB</div>
                          </div>
                          {errors.signature && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.signature}</p>}
                          {formData.signature && formData.signature instanceof File && formData.signature.type.startsWith("image/") && (
                            <div className="mt-3 relative w-full max-h-48 overflow-hidden rounded-xl border border-slate-200 p-2 bg-slate-50 flex items-center justify-center">
                              <Image 
                                src={URL.createObjectURL(formData.signature)} 
                                alt="Signature Preview" 
                                className="w-full max-h-48 object-contain"
                                width={200}
                                height={200}
                                unoptimized
                              />
                            </div>
                          )}
                        </div>
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
                      transition={{ duration: 0.25 }}
                      className="space-y-8"
                    >
                      <div className="bg-slate-50 border border-slate-200 rounded-[1.5rem] sm:rounded-[2.5rem] p-4 sm:p-10 relative overflow-hidden">
                        <div className="relative z-10">
                          <div className="text-center mb-8 sm:mb-10">
                            <h3 className="text-2xl sm:text-3xl font-black text-brs-900 mb-2 tracking-tight">Final Step: Payment Verification</h3>
                            <p className="text-slate-500 text-sm font-medium">Please complete your payment and upload the verification details below.</p>
                          </div>

                          <div className="max-w-3xl mx-auto space-y-8 sm:space-y-10">
                            
                            {/* 0. Fee & 18% GST Breakdown Card */}
                            {(() => {
                              const activeTier = MEMBERSHIP_TYPES.find(t => t.id === selectedType);
                              const bPrice = activeTier?.basePrice || "0";
                              const gPrice = activeTier?.gstAmount || "0";
                              const tPrice = activeTier?.price || getSelectedPrice();
                              const tierDisplayName = activeTier?.name || formData.membershipTypeDropdown || "Membership Fee";

                              return (
                                <div className="bg-gradient-to-br from-brs-900 via-brs-800 to-[#163832] p-6 sm:p-8 rounded-[1.5rem] sm:rounded-3xl border border-emerald-500/30 text-white shadow-xl relative overflow-hidden">
                                  <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-5">
                                    <div>
                                      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400 block mb-1">Fee Summary & Tax Invoice</span>
                                      <h4 className="text-lg sm:text-xl font-black text-white tracking-tight">{tierDisplayName}</h4>
                                    </div>
                                    <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                      <span className="text-xs font-bold text-emerald-300">18% GST Applicable</span>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                    <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                                      <span className="text-[10px] text-white/60 font-bold uppercase tracking-wider block mb-1">Base Membership Fee</span>
                                      <span className="text-base font-bold text-white">₹{bPrice}</span>
                                    </div>
                                    <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                                      <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block mb-1">Applicable GST (18%)</span>
                                      <span className="text-base font-bold text-emerald-400">+ ₹{gPrice}</span>
                                    </div>
                                    <div className="bg-emerald-600/30 rounded-xl p-3 border border-emerald-400/40">
                                      <span className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider block mb-1">Total Payable Amount</span>
                                      <span className="text-xl font-black text-white">₹{tPrice}</span>
                                    </div>
                                  </div>

                                  <p className="text-[11px] text-white/70 mt-4 italic text-center sm:text-left">
                                    ⚠️ Kindly ensure the exact payment amount of <strong className="text-emerald-300">₹{tPrice}</strong> (inclusive of 18% GST) is transferred via UPI or Bank Transfer.
                                  </p>
                                </div>
                              );
                            })()}

                            {/* 1. Instructions */}
                            <div className="bg-white p-5 sm:p-8 rounded-[1.5rem] sm:rounded-3xl border border-slate-200 shadow-sm">
                              <h4 className="text-sm font-black text-brs-900 mb-6 uppercase tracking-[0.2em] flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-brs-900 text-white flex items-center justify-center text-[10px]">01</span>
                                Payment Instructions
                              </h4>
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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
                              {/* Bank Details Card - Fully Responsive & Non-Overlapping */}
                              <div className="bg-brs-900 text-white p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-xl flex flex-col justify-center relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brs-600/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                                <h4 className="text-xs font-black mb-6 sm:mb-8 uppercase tracking-[0.3em] text-brs-400 flex items-center gap-3">
                                  <span className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center text-[8px]">02</span>
                                  Bank Details
                                </h4>
                                <div className="space-y-6 text-xs font-bold relative z-10 break-all">
                                  <div className="border-b border-white/10 pb-2">
                                    <span className="opacity-40 block uppercase text-[8px] mb-1 tracking-widest">Account Name</span>
                                    <span className="text-sm">BATTERY RESEARCH SOCIETY</span>
                                  </div>
                                  <div className="border-b border-white/10 pb-2">
                                    <span className="opacity-40 block uppercase text-[8px] mb-1 tracking-widest">Account Number</span>
                                    <span className="text-sm tracking-widest select-all">43139416491</span>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="border-b border-white/10 pb-2">
                                      <span className="opacity-40 block uppercase text-[8px] mb-1 tracking-widest">IFSC Code</span>
                                      <span className="text-sm text-brs-400 select-all">SBIN0001069</span>
                                    </div>
                                    <div className="border-b border-white/10 pb-2">
                                      <span className="opacity-40 block uppercase text-[8px] mb-1 tracking-widest">MICR Code</span>
                                      <span className="text-sm select-all">247002094</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* QR Code Card - MUCH LARGER & FULLY RESPONSIVE */}
                              <div className="bg-white p-5 sm:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-6 group hover:border-brs-600 transition-colors duration-500">
                                <div className="text-center">
                                  <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 flex items-center justify-center gap-2 mb-1">
                                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[8px]">03</span>
                                    Scan to Pay
                                  </h4>
                                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-block">
                                    Transfer ₹{MEMBERSHIP_TYPES.find(t => t.id === selectedType)?.price || getSelectedPrice()} (Includes 18% GST)
                                  </span>
                                </div>
                                <div className="w-full max-w-[320px] mx-auto aspect-square bg-slate-50 rounded-[1.5rem] sm:rounded-[3rem] flex items-center justify-center relative overflow-hidden border border-slate-100 p-4 sm:p-8 group-hover:scale-105 transition-transform duration-500 shadow-inner">
                                  <Image 
                                    src="/batteryresearchqrsbiqrcode.jpg" 
                                    alt="UPI QR Code" 
                                    className="w-full h-full object-contain drop-shadow-md"
                                    width={320}
                                    height={320}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* 4. Upload & 5. Captcha */}
                            <div className="bg-white p-5 sm:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8 sm:space-y-10">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
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
                                      accept=".png,.jpg,.jpeg,.webp,.pdf"
                                      onChange={handleFileChange}
                                      className="hidden" 
                                    />
                                    <label 
                                      htmlFor="receipt-upload"
                                      className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer hover:bg-slate-50 hover:border-brs-600 transition-all group ${errors.receipt ? 'border-red-500 bg-red-50/10' : 'border-slate-200'}`}
                                    >
                                      {formData.receipt ? (
                                        <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm max-w-full px-4 overflow-hidden">
                                          <Check className="h-5 w-5 shrink-0" />
                                          <span className="truncate min-w-0">{formData.receipt.name}</span>
                                        </div>
                                      ) : (
                                        <div className="flex flex-col items-center gap-2 px-2 text-center">
                                          <Upload className="h-6 w-6 text-slate-400 group-hover:text-brs-600 transition-colors" />
                                          <span className="text-xs font-bold text-slate-500">Click to upload receipt</span>
                                          <span className="text-[10px] text-slate-400 uppercase tracking-widest">JPG, JPEG, PNG, WEBP, or PDF</span>
                                        </div>
                                      )}
                                    </label>
                                  </div>
                                  <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                                    <div><strong>Accepted Formats:</strong> JPG, JPEG, PNG, WEBP, PDF</div>
                                    <div><strong>Maximum File Size:</strong> 3 MB</div>
                                  </div>
                                  {errors.receipt && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.receipt}</p>}
                                  {formData.receipt && formData.receipt instanceof File && formData.receipt.type.startsWith("image/") && (
                                    <div className="mt-3 relative w-full max-h-48 overflow-hidden rounded-xl border border-slate-200 p-2 bg-slate-50 flex items-center justify-center">
                                      <Image 
                                        src={URL.createObjectURL(formData.receipt)} 
                                        alt="Receipt Preview" 
                                        className="w-full max-h-48 object-contain"
                                        width={200}
                                        height={200}
                                        unoptimized
                                      />
                                    </div>
                                  )}
                                </div>

                                <div className="space-y-4">
                                  <h4 className="text-xs font-black text-brs-900 uppercase tracking-[0.2em] flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full bg-brs-900 text-white flex items-center justify-center text-[8px]">05</span>
                                    Security Check <span className="text-red-500 ml-1">*</span>
                                  </h4>
                                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-center gap-6 shadow-inner h-24 sm:h-32">
                                    <span className="text-xl sm:text-2xl font-black text-brs-900 tracking-tighter whitespace-nowrap shrink-0">
                                      {captcha.num1} + {captcha.num2} =
                                    </span>
                                    <input 
                                      type="number"
                                      placeholder="?"
                                      value={captchaInput}
                                      onChange={(e) => setCaptchaInput(e.target.value)}
                                      className="shrink-0 bg-white border border-slate-200 rounded-xl px-2 py-3 text-lg focus:ring-2 focus:ring-brs-600 outline-none font-black text-center shadow-sm h-12 sm:h-14"
                                      style={{ width: "80px", minWidth: "80px", maxWidth: "80px" }}
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

                {/* Navigation Buttons - Mobile-First Thumb & Safe Area Optimizations */}
                <div className="pt-8 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pb-[env(safe-area-inset-bottom)]">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="w-full sm:w-auto px-8 py-4 text-slate-500 font-bold text-sm uppercase tracking-widest hover:text-brs-900 transition-colors text-center"
                    >
                      Back
                    </button>
                  ) : <div className="hidden sm:block"></div>}

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 bg-brs-900 text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-brs-800 transition-all shadow-[0_10px_20px_-10px_rgba(5,31,32,0.5)]"
                    >
                      Next Step
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                        type="button"
                        onClick={handlePaymentSubmit}
                        disabled={isProcessing}
                        className="w-full sm:w-auto group relative flex items-center justify-center gap-3 bg-brs-900 hover:bg-[#0A2F30] text-white px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        <span className="relative flex items-center justify-center gap-2">
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

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-24 right-6 z-50 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-slate-100 max-w-sm"
          >
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
              notification.type === "success" 
                ? "bg-emerald-500/10 text-emerald-500" 
                : notification.type === "warning"
                  ? "bg-amber-500/10 text-amber-500"
                  : "bg-red-500/10 text-red-500"
            }`}>
              {notification.type === "success" && <CheckCircle className="h-5 w-5" />}
              {notification.type === "warning" && <AlertCircle className="h-5 w-5" />}
              {notification.type === "error" && <XCircle className="h-5 w-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className={`text-xs font-black uppercase tracking-wider ${
                notification.type === "success" 
                  ? "text-emerald-600" 
                  : notification.type === "warning"
                    ? "text-amber-600"
                    : "text-red-600"
              }`}>
                {notification.type === "success" ? "Success" : notification.type === "warning" ? "Warning" : "Error"}
              </h4>
              <p className="text-[11px] font-bold text-slate-500 mt-0.5 leading-tight select-text">
                {notification.message}
              </p>
            </div>
            <button 
              onClick={() => setNotification(prev => ({ ...prev, show: false }))}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
