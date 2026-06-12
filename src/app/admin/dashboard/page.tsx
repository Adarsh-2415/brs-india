"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogOut, 
  Calendar, 
  Mail, 
  Users, 
  Upload, 
  Download, 
  Search, 
  Eye, 
  ExternalLink,
  ChevronRight,
  User,
  ShieldCheck,
  Check,
  Building,
  GraduationCap
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"conferences" | "contacts" | "members">("conferences");
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Conferences Tab State
  const [confTitle, setConfTitle] = useState("");
  const [confDesc, setConfDesc] = useState("");
  const [confLink, setConfLink] = useState("");
  const [confFlyerUrl, setConfFlyerUrl] = useState("");
  const [confFlyerFile, setConfFlyerFile] = useState<File | null>(null);
  const [confSaving, setConfSaving] = useState(false);

  // Contacts Tab State
  const [contacts, setContacts] = useState<any[]>([]);
  const [contactSearch, setContactSearch] = useState("");
  const [selectedContact, setSelectedContact] = useState<any | null>(null);

  // Members Tab State
  const [members, setMembers] = useState<any[]>([]);
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState<any | null>(null);

  // Check auth session
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
      } else {
        setSessionToken(session.access_token);
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  // Fetch initial data when authenticated
  useEffect(() => {
    if (sessionToken) {
      fetchConferenceData();
      fetchContacts();
      fetchMembers();
    }
  }, [sessionToken]);

  // ─── Fetch Helpers ───
  const fetchConferenceData = async () => {
    try {
      const res = await fetch("/api/conferences");
      const data = await res.json();
      if (res.ok && data.id) {
        setConfTitle(data.title || "");
        setConfDesc(data.description || "");
        setConfLink(data.link_url || "");
        setConfFlyerUrl(data.flyer_url || "");
      }
    } catch (err) {
      console.error("Error loading conference:", err);
    }
  };

  const fetchContacts = async () => {
    if (!sessionToken) return;
    try {
      const res = await fetch("/api/admin/contacts", {
        headers: { "Authorization": `Bearer ${sessionToken}` }
      });
      const data = await res.json();
      if (res.ok) {
        setContacts(data);
      }
    } catch (err) {
      console.error("Error loading contacts:", err);
    }
  };

  const fetchMembers = async () => {
    if (!sessionToken) return;
    try {
      const res = await fetch("/api/admin/members", {
        headers: { "Authorization": `Bearer ${sessionToken}` }
      });
      const data = await res.json();
      if (res.ok) {
        setMembers(data);
      }
    } catch (err) {
      console.error("Error loading members:", err);
    }
  };

  // ─── Conference Actions ───
  const handleSaveConference = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionToken) return;
    setConfSaving(true);

    try {
      const submitData = new FormData();
      submitData.append("title", confTitle);
      submitData.append("description", confDesc);
      submitData.append("linkUrl", confLink);
      submitData.append("existingFlyerUrl", confFlyerUrl);
      if (confFlyerFile) {
        submitData.append("flyer", confFlyerFile);
      }

      const res = await fetch("/api/conferences", {
        method: "POST",
        headers: { "Authorization": `Bearer ${sessionToken}` },
        body: submitData
      });

      const result = await res.json();
      if (res.ok) {
        alert("Conference details saved successfully!");
        fetchConferenceData();
        setConfFlyerFile(null);
      } else {
        alert(`Failed to save: ${result.error || "Unknown error"}`);
      }
    } catch (err: any) {
      console.error("Save Conference Error:", err);
      alert("An error occurred while saving.");
    } finally {
      setConfSaving(false);
    }
  };

  // ─── Export CSV Helper ───
  const exportToCSV = () => {
    if (members.length === 0) return;

    // Headers
    const headers = [
      "Application Date", "Prefix", "First Name", "Last Name", "Email", "Phone", 
      "Street Address", "Address Line 2", "City", "State", "Zip Code", "Country", 
      "Membership Type", "Amount Paid", "Academic Degree", "Present Affiliation", 
      "Past Affiliations", "Publications", "Statement of Intent", "Photograph URL", 
      "Signature URL", "Receipt URL"
    ];

    // Rows
    const rows = members.map(m => [
      new Date(m.created_at).toLocaleString(), m.prefix, m.first_name, m.last_name, m.email, m.contact_number,
      m.street_address, m.address_line2, m.city, m.state_region, m.zip_code, m.country,
      m.membership_type, `INR ${m.amount}`, m.academic_degree, m.present_affiliation,
      m.past_affiliations?.replace(/\n/g, " "), m.publications?.replace(/\n/g, " "), m.statement?.replace(/\n/g, " "),
      m.photograph_signed_url, m.signature_signed_url, m.receipt_signed_url
    ]);

    // Construct CSV String
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${(val || "").toString().replace(/"/g, '""')}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BRS_India_Members_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ─── Sign Out ───
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  // ─── Filters ───
  const filteredContacts = contacts.filter(c => 
    c.name?.toLowerCase().includes(contactSearch.toLowerCase()) ||
    c.email?.toLowerCase().includes(contactSearch.toLowerCase()) ||
    c.enquiry_type?.toLowerCase().includes(contactSearch.toLowerCase())
  );

  const filteredMembers = members.filter(m => 
    `${m.first_name} ${m.last_name}`.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.email?.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.membership_type?.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.present_affiliation?.toLowerCase().includes(memberSearch.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0F19] text-white">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 border-4 border-brs-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col md:flex-row">
      {/* ─── Sidebar Navigation ─── */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/5 bg-[#0B0F19] flex flex-col shrink-0">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-full border border-white/10 p-0.5 bg-white/5 flex items-center justify-center">
              <Image 
                src="/logo_high_res_v4.png"
                alt="BRS India Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <h2 className="text-xs font-black text-white uppercase tracking-wider leading-none">BRS India</h2>
              <span className="text-[9px] text-brs-400 font-bold uppercase tracking-widest mt-1 block">Admin Control</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab("conferences")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "conferences" ? "bg-brs-600 text-white shadow-md shadow-brs-600/15" : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Calendar className="h-4.5 w-4.5" />
            Conferences
          </button>
          
          <button
            onClick={() => setActiveTab("contacts")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "contacts" ? "bg-brs-600 text-white shadow-md shadow-brs-600/15" : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Mail className="h-4.5 w-4.5" />
            Contact Queries
          </button>

          <button
            onClick={() => setActiveTab("members")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "members" ? "bg-brs-600 text-white shadow-md shadow-brs-600/15" : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Users className="h-4.5 w-4.5" />
            Membership DB
          </button>
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <LogOut className="h-4.5 w-4.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ─── Main Content Area ─── */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-full">
        {/* TAB 1: Conferences */}
        {activeTab === "conferences" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-wide">Manage Conferences</h1>
              <p className="text-slate-400 text-sm mt-1">Upload the main flyer poster and specify portal link settings.</p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
              {/* Form Card */}
              <div className="lg:col-span-7 bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-2xl">
                <form onSubmit={handleSaveConference} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Conference Title</label>
                    <input 
                      type="text" 
                      value={confTitle}
                      onChange={(e) => setConfTitle(e.target.value)}
                      placeholder="e.g., National Meeting on Battery Research & Storage 2026"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-brs-600/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Conference Description</label>
                    <textarea 
                      value={confDesc}
                      onChange={(e) => setConfDesc(e.target.value)}
                      rows={3}
                      placeholder="Enter description summary..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-brs-600/50 resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Portal Link URL</label>
                    <input 
                      type="url" 
                      value={confLink}
                      onChange={(e) => setConfLink(e.target.value)}
                      placeholder="https://www.nmbrs26.com/"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-brs-600/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Upload Poster Flyer (Image)</label>
                    <div className="flex bg-white/5 border border-white/10 rounded-2xl p-4 items-center justify-between gap-4">
                      <input 
                        type="file" 
                        accept="image/*"
                        id="flyer-upload"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setConfFlyerFile(e.target.files[0]);
                          }
                        }}
                        className="hidden" 
                      />
                      <label 
                        htmlFor="flyer-upload"
                        className="flex items-center gap-2 cursor-pointer bg-white/5 border border-white/15 px-4 py-2 rounded-xl text-xs font-bold hover:bg-white/10 text-white transition-all select-none"
                      >
                        <Upload className="h-4 w-4" />
                        Select File
                      </label>
                      <span className="text-xs text-slate-400 truncate max-w-[200px]">
                        {confFlyerFile ? confFlyerFile.name : "No file selected"}
                      </span>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={confSaving}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-brs-600 hover:bg-brs-500 rounded-full text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {confSaving ? "Saving details..." : "Update Conference Page"}
                  </button>
                </form>
              </div>

              {/* Preview Card */}
              <div className="lg:col-span-5 flex flex-col justify-start space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Live Flyer Preview</h3>
                <div className="border border-white/10 rounded-3xl p-4 bg-white/5 overflow-hidden flex items-center justify-center aspect-[4/3] relative">
                  {confFlyerFile ? (
                    <img 
                      src={URL.createObjectURL(confFlyerFile)} 
                      alt="Local Poster Preview" 
                      className="w-full h-full object-contain"
                    />
                  ) : confFlyerUrl ? (
                    <img 
                      src={confFlyerUrl} 
                      alt="Remote Poster" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center text-slate-500 text-xs font-semibold">No Poster Image Available</div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: Contact Queries */}
        {activeTab === "contacts" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-white uppercase tracking-wide">Contact Queries</h1>
                <p className="text-slate-400 text-sm mt-1">View queries and messages sent from the Contact Us page.</p>
              </div>
              <div className="relative flex items-center max-w-xs w-full">
                <Search className="absolute left-4 h-4.5 w-4.5 text-slate-500" />
                <input 
                  type="text" 
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                  placeholder="Search queries..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-2.5 text-white text-xs placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-brs-600"
                />
              </div>
            </div>

            {/* List */}
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02] text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Email</th>
                    <th className="py-4 px-6">Type</th>
                    <th className="py-4 px-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {filteredContacts.length > 0 ? (
                    filteredContacts.map((c) => (
                      <tr key={c.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="py-4 px-6 text-slate-400 font-medium">{new Date(c.created_at).toLocaleDateString()}</td>
                        <td className="py-4 px-6 font-bold text-white">{c.name}</td>
                        <td className="py-4 px-6 text-slate-300 font-medium">{c.email}</td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center rounded-full bg-brs-600/10 border border-brs-600/20 px-2.5 py-0.5 text-[10px] font-black text-brs-400 uppercase">
                            {c.enquiry_type || "Inquiry"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => setSelectedContact(c)}
                            className="inline-flex items-center gap-1 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/15 px-3 py-1.5 rounded-xl text-[10px] font-bold text-white transition-all cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View Message
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500 font-semibold">No queries found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* View Modal */}
            <AnimatePresence>
              {selectedContact && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-xl bg-[#0F1420] border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                      <span className="text-[10px] font-black text-brs-400 uppercase tracking-widest">Inquiry Message Details</span>
                      <button 
                        onClick={() => setSelectedContact(null)}
                        className="text-slate-400 hover:text-white font-bold text-sm bg-white/5 hover:bg-white/10 h-8 w-8 rounded-full flex items-center justify-center transition-all cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-6 text-xs leading-relaxed">
                      <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-4">
                        <div>
                          <span className="opacity-45 uppercase text-[9px] font-bold block mb-1">Name</span>
                          <span className="font-extrabold text-white text-sm">{selectedContact.name}</span>
                        </div>
                        <div>
                          <span className="opacity-45 uppercase text-[9px] font-bold block mb-1">Enquiry Type</span>
                          <span className="font-extrabold text-white text-sm">{selectedContact.enquiry_type}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-4">
                        <div>
                          <span className="opacity-45 uppercase text-[9px] font-bold block mb-1">Email Address</span>
                          <a href={`mailto:${selectedContact.email}`} className="font-bold text-brs-400 hover:underline">{selectedContact.email}</a>
                        </div>
                        <div>
                          <span className="opacity-45 uppercase text-[9px] font-bold block mb-1">Phone Number</span>
                          <span className="font-bold text-white">{selectedContact.phone || "N/A"}</span>
                        </div>
                      </div>

                      <div>
                        <span className="opacity-45 uppercase text-[9px] font-bold block mb-2">Message Body</span>
                        <div className="bg-white/5 rounded-2xl p-4 text-slate-200 border border-white/5 text-[13px] leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                          {selectedContact.message}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* TAB 3: Membership DB */}
        {activeTab === "members" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-white uppercase tracking-wide">Membership Database</h1>
                <p className="text-slate-400 text-sm mt-1">Export, search, and view applicant details, uploaded photos, and payment receipts.</p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={exportToCSV}
                  disabled={members.length === 0}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-emerald-600/10 cursor-pointer shrink-0"
                >
                  <Download className="h-4 w-4" />
                  Export to Excel
                </button>

                <div className="relative flex items-center max-w-xs w-full">
                  <Search className="absolute left-4 h-4.5 w-4.5 text-slate-500" />
                  <input 
                    type="text" 
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    placeholder="Search members..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-2.5 text-white text-xs placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-brs-600"
                  />
                </div>
              </div>
            </div>

            {/* List */}
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02] text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Email</th>
                    <th className="py-4 px-6">Phone</th>
                    <th className="py-4 px-6">Tier Selected</th>
                    <th className="py-4 px-6">Institution</th>
                    <th className="py-4 px-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((m) => (
                      <tr key={m.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="py-4 px-6 font-bold text-white">{`${m.prefix || ""} ${m.first_name} ${m.last_name}`}</td>
                        <td className="py-4 px-6 text-slate-300 font-medium">{m.email}</td>
                        <td className="py-4 px-6 text-slate-400 font-semibold">{m.contact_number}</td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center rounded-full bg-brs-600/10 border border-brs-600/20 px-2.5 py-0.5 text-[10px] font-black text-brs-400 uppercase tracking-wide">
                            {m.membership_type.split(" - ")[0]}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-300 font-bold truncate max-w-[150px]">{m.present_affiliation}</td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => setSelectedMember(m)}
                            className="inline-flex items-center gap-1 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/15 px-3 py-1.5 rounded-xl text-[10px] font-bold text-white transition-all cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View Application
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500 font-semibold">No members found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* View Member Modal */}
            <AnimatePresence>
              {selectedMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-4xl bg-[#0F1420] border border-white/10 rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative overflow-hidden my-8"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                      <span className="text-[10px] font-black text-brs-400 uppercase tracking-widest">Membership Application Form Details</span>
                      <button 
                        onClick={() => setSelectedMember(null)}
                        className="text-slate-400 hover:text-white font-bold text-sm bg-white/5 hover:bg-white/10 h-8 w-8 rounded-full flex items-center justify-center transition-all cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="grid md:grid-cols-12 gap-8 max-h-[70vh] overflow-y-auto pr-2">
                      {/* Left: Applicant personal & address info */}
                      <div className="md:col-span-8 space-y-6 text-xs">
                        {/* Name Block */}
                        <div className="flex gap-4 items-center border-b border-white/5 pb-4">
                          <div className="h-12 w-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-slate-400 shrink-0">
                            <User className="h-6 w-6" />
                          </div>
                          <div>
                            <span className="opacity-45 uppercase text-[8px] font-bold block">Full Name</span>
                            <span className="text-lg font-black text-white">{`${selectedMember.prefix || ""} ${selectedMember.first_name} ${selectedMember.last_name}`}</span>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid sm:grid-cols-2 gap-6 border-b border-white/5 pb-6">
                          <div>
                            <span className="opacity-45 uppercase text-[9px] font-bold block mb-1">Email Address</span>
                            <a href={`mailto:${selectedMember.email}`} className="font-extrabold text-brs-400 hover:underline">{selectedMember.email}</a>
                          </div>
                          <div>
                            <span className="opacity-45 uppercase text-[9px] font-bold block mb-1">Contact Number</span>
                            <span className="font-extrabold text-white">{selectedMember.contact_number}</span>
                          </div>
                          <div>
                            <span className="opacity-45 uppercase text-[9px] font-bold block mb-1">Membership Tier</span>
                            <span className="font-extrabold text-white">{selectedMember.membership_type}</span>
                          </div>
                          <div>
                            <span className="opacity-45 uppercase text-[9px] font-bold block mb-1">Amount Paid</span>
                            <span className="font-extrabold text-white text-emerald-400">INR {selectedMember.amount}</span>
                          </div>
                        </div>

                        {/* Academic Block */}
                        <div className="grid sm:grid-cols-2 gap-6 border-b border-white/5 pb-6">
                          <div>
                            <span className="opacity-45 uppercase text-[9px] font-bold block mb-1">Academic Degree</span>
                            <span className="font-bold text-white flex items-center gap-1.5">
                              <GraduationCap className="h-4 w-4 text-brs-400" />
                              {selectedMember.academic_degree}
                            </span>
                          </div>
                          <div>
                            <span className="opacity-45 uppercase text-[9px] font-bold block mb-1">Present Affiliation</span>
                            <span className="font-bold text-white flex items-center gap-1.5">
                              <Building className="h-4 w-4 text-brs-400" />
                              {selectedMember.present_affiliation}
                            </span>
                          </div>
                        </div>

                        {/* Address */}
                        <div className="border-b border-white/5 pb-6">
                          <span className="opacity-45 uppercase text-[9px] font-bold block mb-1.5">Present Address</span>
                          <p className="font-medium text-slate-300 leading-relaxed">
                            {selectedMember.street_address}
                            {selectedMember.address_line2 && `, ${selectedMember.address_line2}`}
                            {`, ${selectedMember.city}, ${selectedMember.state_region} - ${selectedMember.zip_code}, ${selectedMember.country}`}
                          </p>
                        </div>

                        {/* Past Affiliation */}
                        <div>
                          <span className="opacity-45 uppercase text-[9px] font-bold block mb-1.5">Past Affiliations & Roles</span>
                          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-slate-300 whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto">
                            {selectedMember.past_affiliations || "N/A"}
                          </div>
                        </div>

                        {/* Publications */}
                        <div>
                          <span className="opacity-45 uppercase text-[9px] font-bold block mb-1.5">Selected Publications / Patents</span>
                          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-slate-300 whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto">
                            {selectedMember.publications || "N/A"}
                          </div>
                        </div>

                        {/* Statement */}
                        <div>
                          <span className="opacity-45 uppercase text-[9px] font-bold block mb-1.5">Statement of Intent</span>
                          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-slate-300 whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto">
                            {selectedMember.statement}
                          </div>
                        </div>
                      </div>

                      {/* Right: Uploaded files preview cards */}
                      <div className="md:col-span-4 space-y-6 text-xs">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Uploaded Documents</h3>

                        {/* Photograph Card */}
                        <div className="border border-white/10 rounded-2xl p-4 bg-white/5 flex flex-col items-center gap-3">
                          <span className="font-bold text-white text-[11px]">Photograph</span>
                          <div className="h-32 w-28 border border-white/10 rounded-xl overflow-hidden relative bg-black/30 flex items-center justify-center">
                            {selectedMember.photograph_signed_url ? (
                              <img 
                                src={selectedMember.photograph_signed_url} 
                                alt="Photograph" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-[10px] text-slate-500 font-semibold">No Image</span>
                            )}
                          </div>
                          {selectedMember.photograph_signed_url && (
                            <a 
                              href={selectedMember.photograph_signed_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-bold text-brs-400 hover:underline inline-flex items-center gap-1"
                            >
                              Open Fullscreen
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>

                        {/* Signature Card */}
                        <div className="border border-white/10 rounded-2xl p-4 bg-white/5 flex flex-col items-center gap-3">
                          <span className="font-bold text-white text-[11px]">Signature</span>
                          <div className="h-20 w-32 border border-white/10 rounded-xl overflow-hidden relative bg-black/30 flex items-center justify-center p-1">
                            {selectedMember.signature_signed_url ? (
                              <img 
                                src={selectedMember.signature_signed_url} 
                                alt="Signature" 
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <span className="text-[10px] text-slate-500 font-semibold">No Image</span>
                            )}
                          </div>
                          {selectedMember.signature_signed_url && (
                            <a 
                              href={selectedMember.signature_signed_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-bold text-brs-400 hover:underline inline-flex items-center gap-1"
                            >
                              Open Fullscreen
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>

                        {/* UPI Payment Receipt Card */}
                        <div className="border border-white/10 rounded-2xl p-4 bg-white/5 flex flex-col items-center gap-3">
                          <span className="font-bold text-white text-[11px] text-emerald-400 flex items-center gap-1.5">
                            <ShieldCheck className="h-4 w-4" />
                            Payment Receipt
                          </span>
                          <div className="h-32 w-28 border border-white/10 rounded-xl overflow-hidden relative bg-black/30 flex items-center justify-center p-1">
                            {selectedMember.receipt_signed_url ? (
                              <img 
                                src={selectedMember.receipt_signed_url} 
                                alt="Receipt" 
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <span className="text-[10px] text-slate-500 font-semibold">No Receipt File</span>
                            )}
                          </div>
                          {selectedMember.receipt_signed_url && (
                            <a 
                              href={selectedMember.receipt_signed_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-bold text-brs-400 hover:underline inline-flex items-center gap-1"
                            >
                              Open Fullscreen
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  );
}
