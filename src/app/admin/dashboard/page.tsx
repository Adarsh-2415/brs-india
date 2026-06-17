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
  LayoutDashboard,
  Menu,
  ChevronLeft,
  ChevronsUpDown,
  Filter,
  Trash2,
  Sparkles,
  RefreshCw,
  Clock,
  Plus,
  Globe,
  Sliders,
  FileText,
  Copy
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { sanitizeHtml } from "@/lib/utils";

type ConferenceStatus = "published" | "hidden" | "archived";
type ConferenceType = "flyer_only" | "link_only" | "both";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"dashboard" | "members" | "conferences" | "contacts" | "email-template">("dashboard");
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Fetch Stats data
  const [conferences, setConferences] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);

  // Conferences CRUD State
  const [confId, setConfId] = useState<string | null>(null); // null means create new
  const [confTitle, setConfTitle] = useState("");
  const [confDesc, setConfDesc] = useState("");
  const [confLink, setConfLink] = useState("");
  const [confFlyerUrl, setConfFlyerUrl] = useState("");
  const [confFlyerFile, setConfFlyerFile] = useState<File | null>(null);
  const [confOption, setConfOption] = useState<ConferenceType>("both");
  const [confSaving, setConfSaving] = useState(false);
  const [confTab, setConfTab] = useState<"active" | "archived">("active");

  // Contacts Filtering & Details State
  const [contactSearch, setContactSearch] = useState("");
  const [contactFilter, setContactFilter] = useState<"all" | "read" | "unread">("all");
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  const [contactPage, setContactPage] = useState(1);
  const contactRowsPerPage = 8;

  // Members Filtering, Sorting & Details State
  const [memberSearch, setMemberSearch] = useState("");
  const [memberTierFilter, setMemberTierFilter] = useState("all");
  const [memberSortField, setMemberSortField] = useState("created_at");
  const [memberSortOrder, setMemberSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [memberPage, setMemberPage] = useState(1);
  const memberRowsPerPage = 8;

  // Zoom view for documents in side drawer
  const [zoomedDoc, setZoomedDoc] = useState<string | null>(null);

  // PDF state for detailed view drawer
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [pdfViewUrl, setPdfViewUrl] = useState<string | null>(null);
  const [pdfDownloadUrl, setPdfDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedMember) {
      setPdfViewUrl(null);
      setPdfDownloadUrl(null);
      setPdfError(null);
      return;
    }

    const fetchMemberPdf = async (id: string) => {
      if (!sessionToken) return;
      setPdfLoading(true);
      setPdfError(null);
      try {
        const res = await fetch(`/api/admin/members/pdf?id=${id}`, {
          headers: { "Authorization": `Bearer ${sessionToken}` }
        });
        const data = await res.json();
        if (res.ok) {
          setPdfViewUrl(data.viewUrl);
          setPdfDownloadUrl(data.downloadUrl);
        } else {
          setPdfError(data.error || "Failed to load PDF");
        }
      } catch (err: any) {
        console.error("Error loading membership PDF URL:", err);
        setPdfError(err.message || "An error occurred while fetching PDF");
      } finally {
        setPdfLoading(false);
      }
    };

    fetchMemberPdf(selectedMember.id);
  }, [selectedMember, sessionToken]);

  // Email Template Settings State
  const [templateSubject, setTemplateSubject] = useState("");
  const [templateBody, setTemplateBody] = useState("");
  const [templateSaving, setTemplateSaving] = useState(false);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [templateMigrationNeeded, setTemplateMigrationNeeded] = useState(false);
  const [templateError, setTemplateError] = useState<string | null>(null);
  const [templateSavedSuccess, setTemplateSavedSuccess] = useState(false);

  const fetchEmailTemplate = async () => {
    if (!sessionToken) return;
    setTemplateLoading(true);
    setTemplateError(null);
    try {
      const res = await fetch("/api/admin/settings/email-template", {
        headers: { "Authorization": `Bearer ${sessionToken}` }
      });
      const data = await res.json();
      if (res.ok) {
        setTemplateSubject(data.subject || "");
        setTemplateBody(data.body || "");
        setTemplateMigrationNeeded(!!data.migrationNeeded);
      } else {
        setTemplateError(data.error || "Failed to load template");
      }
    } catch (err: any) {
      console.error("Error loading email template:", err);
      setTemplateError(err.message || "An error occurred");
    } finally {
      setTemplateLoading(false);
    }
  };

  const fetchConferences = async () => {
    try {
      const res = await fetch("/api/conferences", {
        headers: { "Authorization": `Bearer ${sessionToken}` }
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setConferences(data);
      }
    } catch (err) {
      console.error("Error loading conferences:", err);
    }
  };

  const fetchContacts = async () => {
    if (!sessionToken) return;
    try {
      const res = await fetch("/api/admin/contacts", {
        headers: { "Authorization": `Bearer ${sessionToken}` }
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
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
      if (res.ok && Array.isArray(data)) {
        setMembers(data);
      }
    } catch (err) {
      console.error("Error loading members:", err);
    }
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionToken) return;
    setTemplateSaving(true);
    setTemplateError(null);
    setTemplateSavedSuccess(false);

    try {
      const res = await fetch("/api/admin/settings/email-template", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${sessionToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ subject: templateSubject, body: templateBody })
      });
      const result = await res.json();
      if (res.ok) {
        setTemplateSavedSuccess(true);
        setTimeout(() => setTemplateSavedSuccess(false), 3000);
      } else {
        setTemplateError(result.error || "Failed to save template");
        if (result.migrationNeeded) {
          setTemplateMigrationNeeded(true);
        }
      }
    } catch (err: any) {
      console.error("Error saving template:", err);
      setTemplateError(err.message || "An error occurred");
    } finally {
      setTemplateSaving(false);
    }
  };

  const handleResetTemplate = () => {
    if (confirm("Are you sure you want to reset the template to the default professional BRS template? Any unsaved edits will be lost.")) {
      setTemplateSubject("Application Received - Battery Research Society of India");
      setTemplateBody(`<h2>Thank you for applying, {{fullName}}!</h2>
<p>We have received your application for the <strong>{{membershipType}}</strong> tier and your payment of <strong>₹{{amount}}</strong> was successful.</p>
<p>Our executive council is currently reviewing your application. You will receive an official confirmation and your Membership ID shortly.</p>
<br />
<p>For any queries, please feel free to reach out to us directly at <a href="mailto:brsoffice.india@gmail.com">brsoffice.india@gmail.com</a>.</p>
<br />
<p>Best Regards,</p>
<p><strong>Battery Research Society of India</strong></p>`);
    }
  };

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
      fetchConferences();
      fetchContacts();
      fetchMembers();
      fetchEmailTemplate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionToken]);

  // ─── Conference Actions ───
  const handleSaveConference = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionToken) return;
    setConfSaving(true);

    try {
      const submitData = new FormData();
      if (confId) {
        submitData.append("id", confId);
      }
      submitData.append("title", confTitle);
      submitData.append("description", confDesc);
      
      // Enforce option logic
      if (confOption === "flyer_only" || confOption === "both") {
        submitData.append("existingFlyerUrl", confFlyerUrl);
        if (confFlyerFile) {
          submitData.append("flyer", confFlyerFile);
        }
      }
      if (confOption === "link_only" || confOption === "both") {
        submitData.append("linkUrl", confLink);
      }

      const res = await fetch("/api/conferences", {
        method: "POST",
        headers: { "Authorization": `Bearer ${sessionToken}` },
        body: submitData
      });

      const result = await res.json();
      if (res.ok) {
        alert(confId ? "Conference updated successfully!" : "Conference created successfully!");
        fetchConferences();
        resetConfForm();
      } else {
        alert(`Failed to save: ${result.message || result.error || "Unknown error"}`);
      }
    } catch (err: any) {
      console.error("Save Conference Error:", err);
      alert("An error occurred while saving.");
    } finally {
      setConfSaving(false);
    }
  };

  const handleToggleConferenceStatus = async (id: string, status: ConferenceStatus) => {
    if (!sessionToken) return;
    try {
      const res = await fetch("/api/conferences", {
        method: "PATCH",
        headers: { 
          "Authorization": `Bearer ${sessionToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        fetchConferences();
      } else {
        const err = await res.json();
        alert(`Failed to update status: ${err.message || err.error}`);
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const handleDeleteConference = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this conference? This cannot be undone.")) return;
    if (!sessionToken) return;
    try {
      const res = await fetch(`/api/conferences?id=${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${sessionToken}` }
      });
      if (res.ok) {
        fetchConferences();
      } else {
        const err = await res.json();
        alert(`Failed to delete: ${err.message || err.error}`);
      }
    } catch (err) {
      console.error("Delete conference error:", err);
    }
  };

  const resetConfForm = () => {
    setConfId(null);
    setConfTitle("");
    setConfDesc("");
    setConfLink("");
    setConfFlyerUrl("");
    setConfFlyerFile(null);
    setConfOption("both");
  };

  const handleEditConference = (c: any) => {
    setConfId(c.id);
    setConfTitle(c.title || "");
    setConfDesc(c.description || "");
    setConfLink(c.link_url || "");
    setConfFlyerUrl(c.flyer_url || "");
    setConfFlyerFile(null);
    setConfOption(c.type || "both");
    setConfTab("active");
  };

  // ─── Contact Actions ───
  const handleToggleContactRead = async (contact: any) => {
    if (!sessionToken) return;
    const newReadState = !contact.is_read;
    try {
      const res = await fetch("/api/admin/contacts", {
        method: "PATCH",
        headers: { 
          "Authorization": `Bearer ${sessionToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: contact.id, is_read: newReadState })
      });
      if (res.ok) {
        fetchContacts();
        if (selectedContact && selectedContact.id === contact.id) {
          setSelectedContact({ ...selectedContact, is_read: newReadState });
        }
      } else {
        const err = await res.json();
        if (err.error === "column_missing") {
          alert(err.message);
        }
      }
    } catch (err) {
      console.error("Error toggling read status:", err);
    }
  };

  const handleOpenContact = async (contact: any) => {
    setSelectedContact(contact);
    if (!contact.is_read) {
      // Mark as read when opened
      if (!sessionToken) return;
      try {
        const res = await fetch("/api/admin/contacts", {
          method: "PATCH",
          headers: { 
            "Authorization": `Bearer ${sessionToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ id: contact.id, is_read: true })
        });
        if (res.ok) {
          fetchContacts();
        }
      } catch (err) {
        console.error("Error marking opened message as read:", err);
      }
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message log?")) return;
    if (!sessionToken) return;
    try {
      const res = await fetch(`/api/admin/contacts?id=${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${sessionToken}` }
      });
      if (res.ok) {
        fetchContacts();
        if (selectedContact && selectedContact.id === id) {
          setSelectedContact(null);
        }
      } else {
        const err = await res.json();
        alert(`Failed to delete: ${err.message || err.error}`);
      }
    } catch (err) {
      console.error("Delete contact query error:", err);
    }
  };

  // ─── Styled Excel Export ───
  const handleExportExcel = () => {
    if (members.length === 0) return;

    // Headers list for columns
    const headers = [
      "Submission Date",
      "Prefix",
      "First Name",
      "Last Name",
      "Email",
      "Contact Number",
      "Membership Type",
      "Amount Paid",
      "Academic Degree",
      "Present Affiliation",
      "Past Affiliations",
      "Publications / Patents",
      "Statement of Intent",
      "Street Address",
      "Address Line 2",
      "City",
      "State / Region",
      "Zip Code",
      "Country",
      "Photograph Path Reference",
      "Signature Path Reference",
      "Receipt Path Reference"
    ];

    // Data mapper
    const rows = members.map(m => [
      new Date(m.created_at).toLocaleString(),
      m.prefix || "",
      m.first_name || "",
      m.last_name || "",
      m.email || "",
      m.contact_number || "",
      m.membership_type || "",
      m.amount ? `INR ${m.amount}` : "",
      m.academic_degree || "",
      m.present_affiliation || "",
      m.past_affiliations || "",
      m.publications || "",
      m.statement || "",
      m.street_address || "",
      m.address_line2 || "",
      m.city || "",
      m.state_region || "",
      m.zip_code || "",
      m.country || "",
      m.photograph_url || "",
      m.signature_url || "",
      m.receipt_url || ""
    ]);

    // Build styled XML/HTML document representing an Excel Workbook
    const htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>BRS Members List</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        <meta charset="utf-8">
        <style>
          table { border-collapse: collapse; }
          th { background-color: #235347; color: #FFFFFF; font-family: sans-serif; font-size: 11px; font-weight: bold; border: 1px solid #163832; padding: 10px; text-transform: uppercase; }
          td { font-family: sans-serif; font-size: 10px; border: 1px solid #163832; padding: 8px; vertical-align: top; mso-number-format:"\\@"; }
          tr:nth-child(even) { background-color: #F8FAFC; }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>
              ${headers.map(h => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows.map(row => `
              <tr>
                ${row.map(cell => `<td>${(cell || '').toString().replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: "application/vnd.ms-excel;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `BRS_India_Members_${new Date().toISOString().split("T")[0]}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ─── Sign Out ───
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  // ─── Sort Trigger Helper ───
  const triggerMemberSort = (field: string) => {
    if (memberSortField === field) {
      setMemberSortOrder(memberSortOrder === "asc" ? "desc" : "asc");
    } else {
      setMemberSortField(field);
      setMemberSortOrder("desc");
    }
  };

  // ─── Members Filter, Sort & Pagination ───
  const filteredMembers = members.filter(m => {
    const fullName = `${m.first_name} ${m.last_name}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(memberSearch.toLowerCase()) ||
      (m.email && m.email.toLowerCase().includes(memberSearch.toLowerCase())) ||
      (m.contact_number && m.contact_number.includes(memberSearch)) ||
      (m.present_affiliation && m.present_affiliation.toLowerCase().includes(memberSearch.toLowerCase()));

    const matchesTier = memberTierFilter === "all" || m.membership_type.toLowerCase().includes(memberTierFilter.toLowerCase());

    return matchesSearch && matchesTier;
  }).sort((a, b) => {
    let aVal = a[memberSortField] || "";
    let bVal = b[memberSortField] || "";

    if (memberSortField === "first_name") {
      aVal = `${a.first_name} ${a.last_name}`;
      bVal = `${b.first_name} ${b.last_name}`;
    }

    if (aVal < bVal) return memberSortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return memberSortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const paginatedMembers = filteredMembers.slice(
    (memberPage - 1) * memberRowsPerPage,
    memberPage * memberRowsPerPage
  );
  const totalMemberPages = Math.max(1, Math.ceil(filteredMembers.length / memberRowsPerPage));

  // ─── Contacts Filter & Pagination ───
  const filteredContacts = contacts.filter(c => {
    const matchesSearch = 
      (c.name && c.name.toLowerCase().includes(contactSearch.toLowerCase())) ||
      (c.email && c.email.toLowerCase().includes(contactSearch.toLowerCase())) ||
      (c.message && c.message.toLowerCase().includes(contactSearch.toLowerCase()));

    const matchesRead = 
      contactFilter === "all" ||
      (contactFilter === "read" && c.is_read) ||
      (contactFilter === "unread" && !c.is_read);

    return matchesSearch && matchesRead;
  });

  const paginatedContacts = filteredContacts.slice(
    (contactPage - 1) * contactRowsPerPage,
    contactPage * contactRowsPerPage
  );
  const totalContactPages = Math.max(1, Math.ceil(filteredContacts.length / contactRowsPerPage));

  // ─── Conferences Sorting (Active vs Past/Archived) ───
  const activeConferences = conferences.filter(c => c.status !== "archived");
  const archivedConferences = conferences;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#051F20] text-slate-100">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 border-4 border-[#8EB69B] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Gateway Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#051F20] text-slate-100 flex flex-col md:flex-row font-sans overflow-hidden">
      
      {/* ─── DESKTOP SIDEBAR ─── */}
      <aside className={`hidden md:flex flex-col bg-[#0B2B26] border-r border-[#163832]/60 h-screen sticky top-0 shrink-0 transition-all duration-300 z-30 select-none ${isSidebarCollapsed ? "w-20" : "w-64"}`}>
        {/* Brand Block */}
        <div className="p-5 border-b border-[#163832]/50 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative h-9 w-9 rounded-xl border border-[#8EB69B]/20 p-0.5 bg-white/5 flex items-center justify-center shrink-0">
              <Image 
                src="/logo_high_res_v4.png"
                alt="BRS India Logo"
                width={36}
                height={36}
                className="w-full h-full object-contain"
              />
            </div>
            {!isSidebarCollapsed && (
              <div className="truncate">
                <h2 className="text-xs font-black text-white uppercase tracking-wider leading-none">BRS India</h2>
                <span className="text-[9px] text-[#8EB69B] font-bold uppercase tracking-widest mt-1 block">Admin Control</span>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="text-slate-400 hover:text-white p-1 hover:bg-[#163832]/40 rounded-lg transition-colors cursor-pointer"
          >
            {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Tab Buttons */}
        <nav className="p-4 flex-1 space-y-1.5 flex flex-col">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "dashboard" ? "bg-[#235347] text-white shadow-lg shadow-black/20" : "text-slate-400 hover:bg-[#163832]/35 hover:text-white"
            } ${isSidebarCollapsed ? "justify-center" : ""}`}
            title="Dashboard"
          >
            <LayoutDashboard className="h-4.5 w-4.5 shrink-0" />
            {!isSidebarCollapsed && <span>Dashboard</span>}
          </button>

          <button
            onClick={() => setActiveTab("members")}
            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "members" ? "bg-[#235347] text-white shadow-lg shadow-black/20" : "text-slate-400 hover:bg-[#163832]/35 hover:text-white"
            } ${isSidebarCollapsed ? "justify-center" : ""}`}
            title="Membership database"
          >
            <Users className="h-4.5 w-4.5 shrink-0" />
            {!isSidebarCollapsed && <span>Membership DB</span>}
          </button>

          <button
            onClick={() => setActiveTab("conferences")}
            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "conferences" ? "bg-[#235347] text-white shadow-lg shadow-black/20" : "text-slate-400 hover:bg-[#163832]/35 hover:text-white"
            } ${isSidebarCollapsed ? "justify-center" : ""}`}
            title="Conference system"
          >
            <Calendar className="h-4.5 w-4.5 shrink-0" />
            {!isSidebarCollapsed && <span>Conferences</span>}
          </button>

          <button
            onClick={() => setActiveTab("contacts")}
            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "contacts" ? "bg-[#235347] text-white shadow-lg shadow-black/20" : "text-slate-400 hover:bg-[#163832]/35 hover:text-white"
            } ${isSidebarCollapsed ? "justify-center" : ""}`}
            title="Contact submissions"
          >
            <Mail className="h-4.5 w-4.5 shrink-0" />
            {!isSidebarCollapsed && <span>Contact Queries</span>}
          </button>

          <button
            onClick={() => setActiveTab("email-template")}
            className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "email-template" ? "bg-[#235347] text-white shadow-lg shadow-black/20" : "text-slate-400 hover:bg-[#163832]/35 hover:text-white"
            } ${isSidebarCollapsed ? "justify-center" : ""}`}
            title="Email Template settings"
          >
            <Sliders className="h-4.5 w-4.5 shrink-0" />
            {!isSidebarCollapsed && <span>Email Template</span>}
          </button>
        </nav>

        {/* Footer Block */}
        <div className="p-4 border-t border-[#163832]/50">
          <button 
            onClick={handleSignOut}
            className={`w-full flex items-center gap-3 px-3.5 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${isSidebarCollapsed ? "justify-center" : ""}`}
            title="Sign Out"
          >
            <LogOut className="h-4.5 w-4.5 shrink-0" />
            {!isSidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ─── MOBILE BAR ─── */}
      <header className="md:hidden flex items-center justify-between p-4 bg-[#0B2B26] border-b border-[#163832]/60 select-none z-30">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg border border-white/10 p-0.5 bg-white/5 flex items-center justify-center">
            <Image 
              src="/logo_high_res_v4.png"
              alt="BRS India Logo"
              width={28}
              height={28}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h2 className="text-xs font-black text-white uppercase tracking-wider leading-none">BRS India</h2>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="p-2 text-slate-300 hover:bg-[#163832]/40 rounded-xl transition-colors cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileNavOpen(false)}
              className="absolute inset-0 bg-black/65 backdrop-blur-xs"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="relative w-64 bg-[#0B2B26] border-l border-[#163832] h-full p-6 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#163832]/50">
                  <span className="text-[10px] font-black text-[#8EB69B] uppercase tracking-widest">Navigation Portal</span>
                  <button onClick={() => setIsMobileNavOpen(false)} className="text-slate-400 hover:text-white font-bold text-sm">✕</button>
                </div>

                <nav className="space-y-2 flex flex-col">
                  {[
                    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
                    { id: "members", label: "Membership DB", icon: Users },
                    { id: "conferences", label: "Conferences", icon: Calendar },
                    { id: "contacts", label: "Contact Queries", icon: Mail },
                    { id: "email-template", label: "Email Template", icon: Sliders },
                  ].map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id as any);
                          setIsMobileNavOpen(false);
                        }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-left w-full ${
                          activeTab === tab.id ? "bg-[#235347] text-white shadow-lg" : "text-slate-400 hover:bg-[#163832]/35"
                        }`}
                      >
                        <Icon className="h-4.5 w-4.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-[#163832]/50">
                <button 
                  onClick={() => {
                    setIsMobileNavOpen(false);
                    handleSignOut();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  <LogOut className="h-4.5 w-4.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MAIN CONTENT PANEL ─── */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-full relative h-screen">
        
        {/* Header Block & Connection status */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#163832]/30 pb-5 mb-8">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span>Admin Console</span>
              <ChevronRight className="h-3 w-3 text-[#163832]" />
              <span className="text-[#8EB69B]">{activeTab}</span>
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-wider mt-1 leading-none">
              {activeTab === "dashboard" && "Dashboard Overview"}
              {activeTab === "members" && "Membership DB Management"}
              {activeTab === "conferences" && "Conferences Manager"}
              {activeTab === "contacts" && "Contact Query Logs"}
              {activeTab === "email-template" && "Email Template Customization"}
            </h1>
          </div>
          
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider bg-[#0B2B26]/60 border border-[#163832]/80 rounded-xl px-3.5 py-1.5 flex items-center gap-2 w-fit">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Supabase Active
          </div>
        </div>

        {/* ─── TAB: DASHBOARD (Home Analytics & Timeline) ─── */}
        {activeTab === "dashboard" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            
            {/* Overview Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              {/* Metric 1: Membership applications */}
              <motion.div 
                whileHover={{ y: -4 }}
                onClick={() => setActiveTab("members")}
                className="relative overflow-hidden bg-[#0B2B26]/40 border border-[#163832]/60 rounded-[22px] p-6 backdrop-blur-2xl group transition-all cursor-pointer shadow-lg shadow-black/10"
              >
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#8EB69B] to-[#DAF1DE]" />
                <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-[#8EB69B]/5 blur-xl group-hover:bg-[#8EB69B]/10 transition-all" />
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-[#235347]/30 border border-[#8EB69B]/15 text-[#8EB69B] rounded-2xl">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Total Admissions</span>
                    <p className="text-3xl font-black text-white mt-1.5 leading-none">{members.length}</p>
                    <span className="text-[9px] font-bold text-[#8EB69B] block mt-1">Pending review & verification</span>
                  </div>
                </div>
              </motion.div>

              {/* Metric 2: Conferences */}
              <motion.div 
                whileHover={{ y: -4 }}
                onClick={() => setActiveTab("conferences")}
                className="relative overflow-hidden bg-[#0B2B26]/40 border border-[#163832]/60 rounded-[22px] p-6 backdrop-blur-2xl group transition-all cursor-pointer shadow-lg shadow-black/10"
              >
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-teal-400 to-[#8EB69B]" />
                <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-teal-500/5 blur-xl group-hover:bg-teal-500/10 transition-all" />
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-teal-500/10 border border-teal-500/20 text-[#8EB69B] rounded-2xl">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Conferences Managed</span>
                    <p className="text-3xl font-black text-white mt-1.5 leading-none">{conferences.length}</p>
                    <span className="text-[9px] font-bold text-teal-400 block mt-1">
                      {conferences.filter(c => c.status === "published").length} Published • {conferences.filter(c => c.status === "hidden").length} Hidden
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Metric 3: Contact queries */}
              <motion.div 
                whileHover={{ y: -4 }}
                onClick={() => setActiveTab("contacts")}
                className="relative overflow-hidden bg-[#0B2B26]/40 border border-[#163832]/60 rounded-[22px] p-6 backdrop-blur-2xl group transition-all cursor-pointer shadow-lg shadow-black/10"
              >
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-orange-500 to-[#8EB69B]" />
                <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-orange-500/5 blur-xl group-hover:bg-orange-500/10 transition-all" />
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-2xl">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Contact Queries</span>
                    <p className="text-3xl font-black text-white mt-1.5 leading-none">{contacts.length}</p>
                    <span className="text-[9px] font-bold text-orange-400 block mt-1">
                      {contacts.filter(c => !c.is_read).length} Unread submissions
                    </span>
                  </div>
                </div>
              </motion.div>

            </div>

            {/* Recent Activities Section split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column: Recent Membership & Contacts Timeline */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#8EB69B]" />
                    Recent Activity Timeline
                  </h3>
                  <button 
                    onClick={() => { fetchMembers(); fetchContacts(); fetchConferences(); }} 
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#163832]/40 transition-colors"
                    title="Refresh Feed"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="bg-[#0B2B26]/30 border border-[#163832]/50 rounded-[24px] p-6 space-y-6">
                  {/* Collect recent activities */}
                  {(() => {
                    const activityFeed: Array<{
                      type: "member" | "contact" | "conference";
                      title: string;
                      detail: string;
                      date: Date;
                      raw: any;
                    }> = [];

                    members.slice(0, 3).forEach(m => {
                      activityFeed.push({
                        type: "member",
                        title: "New Membership Application Received",
                        detail: `${m.prefix || ""} ${m.first_name} ${m.last_name} (${m.membership_type.split(" - ")[0]})`,
                        date: new Date(m.created_at),
                        raw: m
                      });
                    });

                    contacts.slice(0, 3).forEach(c => {
                      activityFeed.push({
                        type: "contact",
                        title: "New Contact Message Submission",
                        detail: `From: ${c.name} - "${c.subject || c.enquiry_type || 'General'}"`,
                        date: new Date(c.created_at),
                        raw: c
                      });
                    });

                    conferences.slice(0, 2).forEach(conf => {
                      activityFeed.push({
                        type: "conference",
                        title: `Conference Portal Updated`,
                        detail: `"${conf.title}" - Status: ${conf.status.toUpperCase()}`,
                        date: new Date(conf.created_at || conf.updated_at || new Date()),
                        raw: conf
                      });
                    });

                    // Sort chronologically desc
                    const sortedFeed = activityFeed.sort((a,b) => b.date.getTime() - a.date.getTime()).slice(0, 6);

                    if (sortedFeed.length === 0) {
                      return (
                        <div className="text-center py-10 text-slate-500 text-xs font-semibold">
                          No recent logs recorded in database.
                        </div>
                      );
                    }

                    return (
                      <div className="relative border-l-2 border-[#163832]/60 pl-5 ml-2.5 space-y-6">
                        {sortedFeed.map((item, idx) => (
                          <div key={idx} className="relative group">
                            {/* Glow Dot indicator */}
                            <span className={`absolute -left-[27px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-[#0B2B26] ${
                              item.type === "member" ? "bg-[#8EB69B]" : item.type === "contact" ? "bg-orange-500" : "bg-teal-400"
                            }`} />
                            
                            <div>
                              <span className="text-[10px] text-slate-500 font-bold block">
                                {item.date.toLocaleString()}
                              </span>
                              <h4 className="text-xs font-bold text-white mt-1 group-hover:text-[#8EB69B] transition-colors">
                                {item.title}
                              </h4>
                              <p className="text-xs text-slate-400 font-medium mt-0.5 leading-relaxed">
                                {item.detail}
                              </p>
                              <button 
                                onClick={() => {
                                  if (item.type === "member") {
                                    setSelectedMember(item.raw);
                                    setActiveTab("members");
                                  } else if (item.type === "contact") {
                                    handleOpenContact(item.raw);
                                    setActiveTab("contacts");
                                  } else {
                                    handleEditConference(item.raw);
                                    setActiveTab("conferences");
                                  }
                                }}
                                className="text-[9px] text-[#8EB69B] hover:text-[#DAF1DE] font-bold uppercase tracking-wider mt-1.5 flex items-center gap-0.5"
                              >
                                View Record
                                <ChevronRight className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Right Column: Dynamic System Quick Actions */}
              <div className="space-y-6">
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#8EB69B]" />
                  System Quick Controls
                </h3>

                <div className="bg-[#0B2B26]/30 border border-[#163832]/50 rounded-[24px] p-6 space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Administrative Hub</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                    Quickly launch registration flyer modules, audit incoming contact feedback channels, or download formatted databases.
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <button 
                      onClick={() => { resetConfForm(); setActiveTab("conferences"); }}
                      className="p-4 bg-[#235347]/20 border border-[#8EB69B]/10 hover:border-[#8EB69B]/30 rounded-2xl flex flex-col items-center justify-center text-center gap-2 group transition-all cursor-pointer"
                    >
                      <Plus className="h-5 w-5 text-[#8EB69B] group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-black text-white uppercase tracking-wider">New Conference</span>
                    </button>

                    <button 
                      onClick={handleExportExcel}
                      disabled={members.length === 0}
                      className="p-4 bg-[#235347]/20 border border-[#8EB69B]/10 hover:border-[#8EB69B]/30 rounded-2xl flex flex-col items-center justify-center text-center gap-2 group transition-all cursor-pointer disabled:opacity-40"
                    >
                      <Download className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-black text-white uppercase tracking-wider">Export Excel DB</span>
                    </button>
                  </div>
                </div>

                {/* Database Quick stats summary */}
                <div className="bg-[#0B2B26]/30 border border-[#163832]/50 rounded-[24px] p-6 space-y-4">
                  <h4 className="text-[10px] font-black text-[#8EB69B] uppercase tracking-widest">Active Database Audit</h4>
                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                    <div className="p-3 bg-[#051F20]/50 rounded-xl border border-[#163832]/30">
                      <span className="text-slate-500 uppercase text-[9px] block">Unread Message Logs</span>
                      <span className="text-sm font-extrabold text-orange-400 mt-1 block">
                        {contacts.filter(c => !c.is_read).length} Queries
                      </span>
                    </div>

                    <div className="p-3 bg-[#051F20]/50 rounded-xl border border-[#163832]/30">
                      <span className="text-slate-500 uppercase text-[9px] block">Active Conference Banner</span>
                      <span className="text-sm font-extrabold text-teal-400 mt-1 block truncate" title={conferences.find(c => c.status === 'published')?.title || 'None'}>
                        {conferences.find(c => c.status === 'published')?.title || 'None active'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </motion.div>
        )}

        {/* ─── TAB: MEMBERS (Table DB & Details Drawer) ─── */}
        {activeTab === "members" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* Table Control Filters Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#0B2B26]/30 border border-[#163832]/50 rounded-[20px] p-4">
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:max-w-xl">
                {/* Search input */}
                <div className="relative flex items-center flex-1">
                  <Search className="absolute left-4.5 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
                  <input 
                    type="text" 
                    value={memberSearch}
                    onChange={(e) => { setMemberSearch(e.target.value); setMemberPage(1); }}
                    placeholder="Search name, email, college, phone..."
                    className="w-full bg-[#051F20]/80 border border-[#163832] rounded-xl pl-11 pr-4 py-2.5 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#8EB69B] transition-all font-semibold"
                  />
                </div>

                {/* Membership tier filter dropdown */}
                <div className="relative flex items-center">
                  <Filter className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  <select 
                    value={memberTierFilter}
                    onChange={(e) => { setMemberTierFilter(e.target.value); setMemberPage(1); }}
                    className="bg-[#051F20]/80 border border-[#163832] rounded-xl pl-9 pr-8 py-2.5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#8EB69B] transition-all font-semibold appearance-none cursor-pointer"
                  >
                    <option value="all">All Membership Tiers</option>
                    <option value="Life Member (Individual)">Life Member (Individual)</option>
                    <option value="Life Member (Organization)">Life Member (Organization)</option>
                    <option value="General Member (Individual)">General Member (Individual)</option>
                    <option value="General Member (Organization)">General Member (Organization)</option>
                    <option value="Student/Post-Doctoral Researcher">Student/Post-Doctoral Researcher</option>
                  </select>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportExcel}
                  disabled={members.length === 0}
                  className="inline-flex items-center gap-2 bg-[#235347] border border-[#8EB69B]/20 hover:border-[#8EB69B]/40 hover:bg-[#235347]/80 disabled:opacity-45 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer shrink-0"
                >
                  <Download className="h-4 w-4" />
                  Export to Excel (.xls)
                </button>
              </div>

            </div>

            {/* Table Layout */}
            <div className="bg-[#0B2B26]/30 border border-[#163832]/50 rounded-[24px] overflow-hidden shadow-2xl relative">
              <div className="overflow-x-auto max-h-[550px]">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="sticky top-0 bg-[#0B2B26] border-b border-[#163832] text-[10px] font-black text-slate-400 uppercase tracking-wider z-10 select-none">
                      <th className="py-4.5 px-6 font-black">
                        <button 
                          onClick={() => triggerMemberSort("first_name")}
                          className="flex items-center gap-1.5 hover:text-white uppercase tracking-wider font-black"
                        >
                          Applicant Name
                          <ChevronsUpDown className="h-3.5 w-3.5 text-slate-500" />
                        </button>
                      </th>
                      <th className="py-4.5 px-6">Email Address</th>
                      <th className="py-4.5 px-6">Phone Number</th>
                      <th className="py-4.5 px-6">
                        <button 
                          onClick={() => triggerMemberSort("membership_type")}
                          className="flex items-center gap-1.5 hover:text-white uppercase tracking-wider font-black"
                        >
                          Membership Tier
                          <ChevronsUpDown className="h-3.5 w-3.5 text-slate-500" />
                        </button>
                      </th>
                      <th className="py-4.5 px-6">
                        <button 
                          onClick={() => triggerMemberSort("created_at")}
                          className="flex items-center gap-1.5 hover:text-white uppercase tracking-wider font-black"
                        >
                          Date Submitted
                          <ChevronsUpDown className="h-3.5 w-3.5 text-slate-500" />
                        </button>
                      </th>
                      <th className="py-4.5 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-[#163832]/40 text-xs">
                    {paginatedMembers.length > 0 ? (
                      paginatedMembers.map((m) => (
                        <tr key={m.id} className="hover:bg-[#163832]/10 transition-colors group">
                          <td className="py-4 px-6 font-bold text-white">{`${m.prefix || ""} ${m.first_name} ${m.last_name}`}</td>
                          <td className="py-4 px-6 text-slate-300 font-semibold">{m.email}</td>
                          <td className="py-4 px-6 text-slate-400 font-bold">{m.contact_number}</td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center rounded-full bg-[#235347]/30 border border-[#8EB69B]/30 px-2.5 py-0.5 text-[9px] font-black text-[#8EB69B] uppercase tracking-wide">
                              {m.membership_type.split(" - ")[0]}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-slate-400 font-medium">
                            {new Date(m.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={() => setSelectedMember(m)}
                              className="inline-flex items-center gap-1.5 bg-[#235347]/30 border border-[#8EB69B]/20 hover:bg-[#235347]/65 hover:border-[#8EB69B]/40 px-3.5 py-2 rounded-xl text-[10px] font-bold text-white transition-all cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5 text-[#8EB69B]" />
                              View Profile
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-16 text-center text-slate-500 font-semibold">
                          No matching applicant records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Pagination Footer */}
              <div className="flex items-center justify-between p-5 border-t border-[#163832]/50 bg-[#0B2B26]/10 text-xs text-slate-400 font-bold">
                <div>
                  Showing {(memberPage - 1) * memberRowsPerPage + 1} to {Math.min(memberPage * memberRowsPerPage, filteredMembers.length)} of {filteredMembers.length} records
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    disabled={memberPage === 1}
                    onClick={() => setMemberPage(memberPage - 1)}
                    className="p-2 border border-[#163832] rounded-xl hover:bg-[#163832]/50 text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Prev
                  </button>
                  <span className="px-3.5 py-1.5 bg-[#0B2B26] border border-[#163832] rounded-xl text-white">
                    Page {memberPage} of {totalMemberPages}
                  </span>
                  <button
                    disabled={memberPage === totalMemberPages}
                    onClick={() => setMemberPage(memberPage + 1)}
                    className="p-2 border border-[#163832] rounded-xl hover:bg-[#163832]/50 text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* ─── TAB: CONTACT QUERIES (Inbox Audit & Read toggle) ─── */}
        {activeTab === "contacts" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-[#0B2B26]/30 border border-[#163832]/50 rounded-[20px] p-4">
              
              <div className="relative flex items-center flex-1">
                <Search className="absolute left-4 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
                <input 
                  type="text" 
                  value={contactSearch}
                  onChange={(e) => { setContactSearch(e.target.value); setContactPage(1); }}
                  placeholder="Search name, email, content keywords..."
                  className="w-full bg-[#051F20]/80 border border-[#163832] rounded-xl pl-11 pr-4 py-2.5 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#8EB69B] transition-all font-semibold"
                />
              </div>

              <div className="relative flex items-center">
                <Filter className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <select 
                  value={contactFilter}
                  onChange={(e) => { setContactFilter(e.target.value as any); setContactPage(1); }}
                  className="bg-[#051F20]/80 border border-[#163832] rounded-xl pl-9 pr-8 py-2.5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#8EB69B] transition-all font-semibold appearance-none cursor-pointer"
                >
                  <option value="all">All Queries</option>
                  <option value="read">Read Messages</option>
                  <option value="unread">Unread Messages</option>
                </select>
              </div>

            </div>

            {/* Table */}
            <div className="bg-[#0B2B26]/30 border border-[#163832]/50 rounded-[24px] overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[750px]">
                  <thead>
                    <tr className="bg-[#0B2B26] border-b border-[#163832] text-[10px] font-black text-slate-400 uppercase tracking-wider select-none">
                      <th className="py-4.5 px-6 w-12">Status</th>
                      <th className="py-4.5 px-6">Received Date</th>
                      <th className="py-4.5 px-6">Sender Name</th>
                      <th className="py-4.5 px-6">Email Address</th>
                      <th className="py-4.5 px-6">Category</th>
                      <th className="py-4.5 px-6 text-center">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#163832]/40 text-xs">
                    {paginatedContacts.length > 0 ? (
                      paginatedContacts.map((c) => (
                        <tr key={c.id} className={`hover:bg-[#163832]/10 transition-colors group ${!c.is_read ? "font-bold text-white bg-white/[0.01]" : "text-slate-300"}`}>
                          
                          {/* Read/Unread pulse */}
                          <td className="py-4 px-6 text-center">
                            <span 
                              onClick={() => handleToggleContactRead(c)}
                              className={`h-2.5 w-2.5 rounded-full inline-block cursor-pointer transition-transform hover:scale-125 ${
                                c.is_read ? "bg-slate-700" : "bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.6)]"
                              }`}
                              title={c.is_read ? "Mark as Unread" : "Mark as Read"}
                            />
                          </td>
                          
                          <td className="py-4 px-6 text-slate-400 font-medium">
                            {new Date(c.created_at).toLocaleDateString()}
                          </td>
                          
                          <td className="py-4 px-6 font-bold">{c.name}</td>
                          
                          <td className="py-4 px-6 text-slate-400 font-semibold">{c.email}</td>
                          
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center rounded-full bg-[#235347]/30 border border-[#8EB69B]/30 px-2.5 py-0.5 text-[9px] font-black text-[#8EB69B] uppercase tracking-wider">
                              {c.enquiry_type || "General"}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleOpenContact(c)}
                                className="inline-flex items-center gap-1 bg-[#235347]/30 border border-[#8EB69B]/20 hover:bg-[#235347]/65 px-3 py-1.5 rounded-xl text-[10px] font-bold text-white transition-all cursor-pointer"
                              >
                                <Eye className="h-3.5 w-3.5 text-[#8EB69B]" />
                                Read
                              </button>
                              
                              <button
                                onClick={() => handleDeleteContact(c.id)}
                                className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                                title="Delete Log"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-16 text-center text-slate-500 font-semibold">
                          No messages found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Contacts Pagination Footer */}
              <div className="flex items-center justify-between p-5 border-t border-[#163832]/50 bg-[#0B2B26]/10 text-xs text-slate-400 font-bold">
                <div>
                  Showing {(contactPage - 1) * contactRowsPerPage + 1} to {Math.min(contactPage * contactRowsPerPage, filteredContacts.length)} of {filteredContacts.length} items
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    disabled={contactPage === 1}
                    onClick={() => setContactPage(contactPage - 1)}
                    className="p-2 border border-[#163832] rounded-xl hover:bg-[#163832]/50 text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Prev
                  </button>
                  <span className="px-3.5 py-1.5 bg-[#0B2B26] border border-[#163832] rounded-xl text-white">
                    Page {contactPage} of {totalContactPages}
                  </span>
                  <button
                    disabled={contactPage === totalContactPages}
                    onClick={() => setContactPage(contactPage + 1)}
                    className="p-2 border border-[#163832] rounded-xl hover:bg-[#163832]/50 text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* ─── TAB: CONFERENCES (Management & Archive) ─── */}
        {activeTab === "conferences" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            
            {/* Secondary Tab Switcher (Active Conferences vs Archives) */}
            <div className="flex items-center justify-between border-b border-[#163832]/40 pb-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setConfTab("active")}
                  className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    confTab === "active" ? "border-[#8EB69B] text-white" : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  Active Announcements ({activeConferences.length})
                </button>
                <button
                  onClick={() => setConfTab("archived")}
                  className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    confTab === "archived" ? "border-[#8EB69B] text-white" : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  Past Conferences Archive ({archivedConferences.length})
                </button>
              </div>

              {confId && (
                <button 
                  onClick={resetConfForm}
                  className="bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all"
                >
                  Clear Edit Mode
                </button>
              )}
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Form Editor (Only visible when active tab is selected) */}
              {confTab === "active" && (
                <div className="lg:col-span-6 bg-[#0B2B26]/30 border border-[#163832]/50 rounded-[26px] p-6 md:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-teal-400 to-[#8EB69B]" />
                
                <h3 className="text-sm font-black text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                  {confId ? "Modify Conference Entry" : "Create New Conference Announcement"}
                </h3>

                <form onSubmit={handleSaveConference} className="space-y-5">
                  {/* Select Option */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Conference Layout Mode</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "flyer_only", label: "Option A: Flyer Only" },
                        { id: "link_only", label: "Option B: Link Only" },
                        { id: "both", label: "Option C: Flyer + Link" }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setConfOption(opt.id as any)}
                          className={`p-3 border rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all text-center flex items-center justify-center select-none ${
                            confOption === opt.id 
                              ? "bg-[#235347] border-[#8EB69B]/40 text-white shadow-md"
                              : "bg-[#051F20]/45 border-[#163832] text-slate-400 hover:text-white hover:bg-[#163832]/30"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Conference Title</label>
                    <input 
                      type="text" 
                      value={confTitle}
                      onChange={(e) => setConfTitle(e.target.value)}
                      placeholder="e.g. National Symposium on Battery Electrochemistry 2026"
                      required
                      className="w-full bg-[#051F20]/80 border border-[#163832] rounded-xl px-4 py-3 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#8EB69B] transition-all font-semibold"
                    />
                  </div>

                  {/* Description Summary (Optional if not Flyer Only) */}
                  {confOption !== "flyer_only" && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Description / Summary Info</label>
                      <textarea 
                        value={confDesc}
                        onChange={(e) => setConfDesc(e.target.value)}
                        rows={3}
                        placeholder="Provide brief outline, key dates, or speaker summaries..."
                        className="w-full bg-[#051F20]/80 border border-[#163832] rounded-xl px-4 py-3 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#8EB69B] transition-all font-semibold resize-none"
                      />
                    </div>
                  )}

                  {/* External Portal URL (Enabled on Option B and C) */}
                  {(confOption === "link_only" || confOption === "both") && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Registration Portal Link URL</label>
                      <input 
                        type="url" 
                        value={confLink}
                        onChange={(e) => setConfLink(e.target.value)}
                        placeholder="https://www.brs-symposium2026.com/"
                        required
                        className="w-full bg-[#051F20]/80 border border-[#163832] rounded-xl px-4 py-3 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#8EB69B] transition-all font-semibold"
                      />
                    </div>
                  )}

                  {/* Poster Flyer file (Enabled on Option A and C) */}
                  {(confOption === "flyer_only" || confOption === "both") && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Poster Flyer Upload (Image)</label>
                      
                      <div className="relative border-2 border-dashed border-[#163832] hover:border-[#8EB69B]/40 rounded-xl p-5 bg-[#051F20]/30 transition-all text-center flex flex-col items-center justify-center">
                        <input 
                          type="file" 
                          accept="image/*"
                          id="dash-flyer"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setConfFlyerFile(e.target.files[0]);
                            }
                          }}
                          className="hidden"
                        />
                        <label htmlFor="dash-flyer" className="cursor-pointer flex flex-col items-center gap-2">
                          <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:scale-105 transition-transform duration-300">
                            <Upload className="h-4.5 w-4.5 text-[#8EB69B]" />
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-white block">Choose Flyer Image</span>
                            <span className="text-[9px] text-slate-500 font-bold block mt-1">PNG, JPG or JPEG max 5MB</span>
                          </div>
                        </label>
                      </div>

                      {confFlyerFile && (
                        <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold rounded-lg uppercase tracking-wider flex items-center gap-1.5 w-fit">
                          <Check className="h-3.5 w-3.5" />
                          Selected: {confFlyerFile.name}
                        </div>
                      )}
                      {confFlyerUrl && !confFlyerFile && (
                        <div className="text-[9.5px] text-[#8EB69B] font-bold truncate">
                          Currently using uploaded server banner reference.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={confSaving}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-[#235347] hover:bg-[#235347]/80 border border-[#8EB69B]/20 rounded-xl text-white font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-md mt-4"
                  >
                    <span>{confSaving ? "Saving portal details..." : (confId ? "Update Announcement" : "Publish to Portal")}</span>
                    {!confSaving && <Check className="h-4 w-4" />}
                  </motion.button>
                </form>
              </div>
              )}

              {/* Right Column: Display Grid list of Active/Archived Conferences */}
              <div className={`${confTab === "active" ? "lg:col-span-6" : "col-span-12"} space-y-4`}>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest block ml-1">
                  {confTab === "active" ? "Active Conference Announcements" : "Archived Past Symposia"}
                </h3>

                {confTab === "active" ? (
                  activeConferences.length > 0 ? (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                      {activeConferences.map(c => (
                        <div key={c.id} className="bg-[#0B2B26]/30 border border-[#163832]/50 rounded-2xl p-4 flex gap-4 backdrop-blur-sm relative group hover:border-[#8EB69B]/30 transition-all">
                          {/* Left thumbnail */}
                          {c.flyer_url ? (
                            <div className="h-20 w-16 border border-[#163832] rounded-lg overflow-hidden shrink-0 bg-black flex items-center justify-center relative">
                              <Image 
                                src={c.flyer_url} 
                                alt="Flyer" 
                                className="h-full w-full object-cover" 
                                width={64} 
                                height={80} 
                                unoptimized={!c.flyer_url.startsWith('/')} 
                              />
                            </div>
                          ) : (
                            <div className="h-20 w-16 bg-[#051F20] border border-[#163832] rounded-lg shrink-0 flex items-center justify-center text-slate-600">
                              <Globe className="h-5 w-5" />
                            </div>
                          )}

                          {/* Detail block */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`inline-block h-2 w-2 rounded-full ${c.status === 'published' ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                                  {c.status} • {c.type === 'flyer_only' ? 'Flyer Only' : c.type === 'link_only' ? 'Link Only' : 'Both'}
                                </span>
                              </div>
                              <h4 className="text-xs font-bold text-white mt-1 truncate pr-6">{c.title}</h4>
                              <p className="text-[10px] text-slate-400 font-semibold line-clamp-2 mt-0.5">{c.description || "No description outline provided."}</p>
                            </div>

                            {/* Visibility triggers */}
                            <div className="flex items-center justify-between border-t border-[#163832]/35 pt-2 mt-3 text-[9px] font-black uppercase tracking-wider">
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => handleEditConference(c)}
                                  className="text-[#8EB69B] hover:text-white"
                                >
                                  Edit
                                </button>
                                
                                <span className="text-slate-700">|</span>

                                {c.status === "published" ? (
                                  <button 
                                    onClick={() => handleToggleConferenceStatus(c.id, "hidden")}
                                    className="text-orange-400 hover:text-orange-300"
                                  >
                                    Hide
                                  </button>
                                ) : (
                                  <button 
                                    onClick={() => handleToggleConferenceStatus(c.id, "published")}
                                    className="text-emerald-400 hover:text-emerald-300"
                                  >
                                    Unhide
                                  </button>
                                )}

                                <span className="text-slate-700">|</span>

                                <button 
                                  onClick={() => handleToggleConferenceStatus(c.id, "archived")}
                                  className="text-amber-500 hover:text-amber-400"
                                >
                                  Archive
                                </button>
                              </div>

                              <button 
                                onClick={() => handleDeleteConference(c.id)}
                                className="text-red-400 hover:text-red-300 flex items-center gap-0.5"
                              >
                                <Trash2 className="h-3 w-3" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-[#0B2B26]/10 border border-[#163832]/45 rounded-2xl text-slate-500 text-xs font-semibold">
                      No active announcements found.
                    </div>
                  )
                ) : (
                  archivedConferences.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {archivedConferences.map(c => (
                        <div key={c.id} className="bg-[#0B2B26]/30 border border-[#163832]/50 rounded-[20px] p-5 flex flex-col justify-between hover:border-[#8EB69B]/35 transition-all shadow-lg backdrop-blur-xs min-h-[180px]">
                          <div>
                            <div className="flex gap-4 items-start mb-3">
                              {c.flyer_url ? (
                                <div className="h-16 w-12 border border-[#163832] rounded-lg overflow-hidden shrink-0 bg-black flex items-center justify-center shadow-inner relative">
                                  <Image 
                                    src={c.flyer_url} 
                                    alt="Flyer" 
                                    className="h-full w-full object-cover" 
                                    width={48} 
                                    height={64} 
                                    unoptimized={!c.flyer_url.startsWith('/')} 
                                  />
                                </div>
                              ) : (
                                <div className="h-16 w-12 bg-[#051F20] border border-[#163832] rounded-lg shrink-0 flex items-center justify-center text-slate-600 shadow-inner">
                                  <Globe className="h-4.5 w-4.5" />
                                </div>
                              )}
                              
                              <div className="min-w-0 flex-1">
                                <span className={`text-[9px] font-black uppercase tracking-wider block mb-1 ${
                                  c.status === 'archived' ? 'text-amber-500' : 'text-emerald-500'
                                }`}>
                                  {c.status === 'archived' ? 'Past Conference Portal' : 'Active Announcement Portal'}
                                </span>
                                <h4 className="text-xs font-black text-white truncate pr-2" title={c.title}>{c.title}</h4>
                                {c.link_url && (
                                  <a 
                                    href={c.link_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-[10px] text-[#8EB69B] hover:underline inline-flex items-center gap-1 mt-1 font-semibold"
                                  >
                                    Visit Link
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                              </div>
                            </div>
                            <p className="text-[10.5px] text-slate-400 font-medium line-clamp-3 leading-relaxed mt-2 border-t border-[#163832]/25 pt-2">
                              {c.description || "No description overview provided."}
                            </p>
                          </div>

                          <div className="flex items-center justify-between border-t border-[#163832]/35 pt-3 mt-4 text-[9px] font-black uppercase tracking-wider select-none">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleEditConference(c)}
                                className="text-[#8EB69B] hover:text-white"
                              >
                                Edit
                              </button>
                              
                              <span className="text-slate-700">|</span>

                              {c.status === "archived" ? (
                                <button 
                                  onClick={() => handleToggleConferenceStatus(c.id, "published")}
                                  className="text-emerald-400 hover:text-emerald-300"
                                >
                                  Restore to Active
                                </button>
                              ) : (
                                <button 
                                  onClick={() => handleToggleConferenceStatus(c.id, "archived")}
                                  className="text-amber-500 hover:text-amber-400"
                                >
                                  Archive Entry
                                </button>
                              )}
                            </div>

                            <button 
                              onClick={() => handleDeleteConference(c.id)}
                              className="text-red-400 hover:text-red-300 flex items-center gap-0.5"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-[#0B2B26]/10 border border-[#163832]/45 rounded-[22px] text-slate-500 text-xs font-semibold">
                      Past conferences archive is empty.
                    </div>
                  )
                )}

              </div>

            </div>

          </motion.div>
        )}

        {/* ─── TAB: EMAIL TEMPLATE SETTINGS ─── */}
        {activeTab === "email-template" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* Supabase migration check alert if warning is active */}
            {templateMigrationNeeded && (
              <div className="bg-amber-500/10 border-2 border-amber-500/35 rounded-2xl p-6 text-xs text-amber-200 space-y-3 relative overflow-hidden shadow-lg shadow-black/10">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                  <span className="font-black uppercase tracking-wider text-[11px] text-amber-400">Database Migration Required</span>
                </div>
                <p className="font-semibold leading-relaxed">
                  The settings database table is not present. The system will fall back to the default transactional layout until you run the migration script below in your Supabase SQL editor.
                </p>
                <div className="bg-black/40 border border-amber-500/20 rounded-xl p-4 font-mono text-[10px] text-slate-300 select-text overflow-x-auto relative group">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`CREATE TABLE IF NOT EXISTS email_templates (\n  id text PRIMARY KEY,\n  subject text NOT NULL,\n  body text NOT NULL,\n  updated_at timestamptz DEFAULT now()\n);`);
                      alert("SQL Script Copied to Clipboard!");
                    }}
                    className="absolute right-2 top-2 bg-[#235347] border border-[#8EB69B]/20 hover:bg-[#235347]/80 text-white font-bold px-2 py-1 rounded-md text-[9px] uppercase transition-all select-none cursor-pointer"
                  >
                    Copy
                  </button>
                  <pre>{`CREATE TABLE IF NOT EXISTS email_templates (
  id text PRIMARY KEY,
  subject text NOT NULL,
  body text NOT NULL,
  updated_at timestamptz DEFAULT now()
);`}</pre>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button 
                    onClick={fetchEmailTemplate}
                    disabled={templateLoading}
                    className="bg-amber-500 hover:bg-amber-400 text-[#051F20] font-black uppercase tracking-wider text-[9px] px-3.5 py-2 rounded-lg transition-all cursor-pointer select-none"
                  >
                    {templateLoading ? "Checking..." : "Retry Connection"}
                  </button>
                </div>
              </div>
            )}

            {/* Template Editor Grid */}
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Form Fields */}
              <div className="lg:col-span-7 bg-[#0B2B26]/30 border border-[#163832]/50 rounded-[26px] p-6 md:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl space-y-6">
                <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-teal-400 to-[#8EB69B]" />
                
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Email Template Settings</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Configure confirmation email dispatched to new BRS applicants</p>
                </div>

                <form onSubmit={handleSaveTemplate} className="space-y-5">
                  {/* Subject input */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Email Subject Line</label>
                    <input 
                      type="text" 
                      value={templateSubject}
                      onChange={(e) => setTemplateSubject(e.target.value)}
                      placeholder="e.g. Application Received - Battery Research Society of India"
                      required
                      className="w-full bg-[#051F20]/80 border border-[#163832] rounded-xl px-4 py-3 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#8EB69B] transition-all font-semibold"
                    />
                  </div>

                  {/* Placeholders helper assistant panel */}
                  <div className="space-y-2.5 bg-[#051F20]/45 border border-[#163832]/50 rounded-2xl p-4 shadow-inner">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-0.5">Placeholders Assistant</span>
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                      Click a variable pill below to copy it, then paste it in your Subject or HTML Body. It will automatically swap with applicant data when dispatching.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1 select-none">
                      {[
                        { code: "{{fullName}}", label: "Full Name", desc: "Applicant's title & name" },
                        { code: "{{membershipType}}", label: "Membership Tier", desc: "Selected fee category" },
                        { code: "{{amount}}", label: "Amount Paid", desc: "Paid registration sum" }
                      ].map((item) => (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(item.code);
                            alert(`Copied ${item.code} to clipboard!`);
                          }}
                          className="bg-[#235347]/40 hover:bg-[#235347]/70 border border-[#8EB69B]/20 rounded-xl px-3 py-1.5 flex items-center gap-1.5 transition-all text-left group cursor-pointer"
                          title={`Click to copy: ${item.desc}`}
                        >
                          <span className="font-mono text-emerald-300 font-bold text-[10.5px]">{item.code}</span>
                          <span className="text-[9.5px] text-[#8EB69B] group-hover:text-slate-200 transition-colors">({item.label})</span>
                          <Copy className="h-3 w-3 text-slate-500 group-hover:text-white" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Body Editor textarea */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">HTML Template Body</label>
                      <span className="text-[9px] text-[#8EB69B] font-bold uppercase">Supports Full HTML & Inline Styles</span>
                    </div>
                    <textarea 
                      value={templateBody}
                      onChange={(e) => setTemplateBody(e.target.value)}
                      rows={14}
                      placeholder="Write template HTML layout..."
                      required
                      className="w-full bg-[#051F20]/80 border border-[#163832] rounded-xl px-4 py-3.5 text-slate-200 text-xs placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#8EB69B] transition-all font-mono leading-relaxed"
                    />
                  </div>

                  {/* Form Action triggers */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-3">
                    <button
                      type="submit"
                      disabled={templateSaving || templateLoading}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#235347] hover:bg-[#235347]/80 border border-[#8EB69B]/20 rounded-xl text-white font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-md"
                    >
                      {templateSaving ? "Saving Settings..." : "Save Template"}
                      {!templateSaving && <Check className="h-4 w-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={handleResetTemplate}
                      disabled={templateSaving || templateLoading}
                      className="px-5 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 rounded-xl text-red-400 hover:text-red-300 font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
                    >
                      Reset Default
                    </button>
                  </div>

                  {templateSavedSuccess && (
                    <div className="text-[10px] font-black text-emerald-400 uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5 flex items-center gap-2 animate-bounce">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Settings successfully updated & saved to Supabase!
                    </div>
                  )}

                  {templateError && (
                    <div className="text-[10px] font-black text-red-400 uppercase tracking-wider bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5 leading-relaxed">
                      Error: {templateError}
                    </div>
                  )}

                </form>
              </div>

              {/* Right Column: Live Mockup Preview */}
              <div className="lg:col-span-5 space-y-4 h-full flex flex-col">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest block ml-1 select-none">Live Inbox Preview</h3>
                
                <div className="bg-[#0B2B26]/30 border border-[#163832]/50 rounded-[26px] p-5 backdrop-blur-md shadow-2xl flex-1 flex flex-col space-y-4 max-h-[700px] overflow-hidden">
                  
                  {/* Email header mock */}
                  <div className="bg-[#051F20]/50 border border-[#163832]/35 rounded-2xl p-4 space-y-2.5 text-xs text-slate-300 font-semibold select-text">
                    <div className="flex justify-between items-center text-[9px] text-[#8EB69B] uppercase tracking-widest font-black select-none border-b border-[#163832]/20 pb-2">
                      <span>Recipient Inbox View</span>
                      <span className="text-slate-500">HTML Rendered Mode</span>
                    </div>
                    <div className="grid grid-cols-12 gap-1">
                      <span className="col-span-3 text-slate-500 select-none">From:</span>
                      <span className="col-span-9 font-bold text-white">BRS India &lt;info@brsindia.org.in&gt;</span>
                    </div>
                    <div className="grid grid-cols-12 gap-1 border-t border-[#163832]/10 pt-2">
                      <span className="col-span-3 text-slate-500 select-none">Subject:</span>
                      <span className="col-span-9 font-bold text-white break-words">
                        {(() => {
                          const repl = templateSubject || "Application Received - Battery Research Society of India";
                          return repl
                            .replace(/\{\{fullName\}\}/g, "Prof. John Doe")
                            .replace(/\{\{membershipType\}\}/g, "Life Member (Individual)")
                            .replace(/\{\{amount\}\}/g, "5000");
                        })()}
                      </span>
                    </div>
                  </div>

                  {/* Rendered HTML Area mock */}
                  <div className="bg-white rounded-2xl p-6 text-black overflow-y-auto flex-1 select-text shadow-inner min-h-[350px] max-h-[500px]">
                    <div 
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml((() => {
                          const repl = templateBody || "";
                          return repl
                            .replace(/\{\{fullName\}\}/g, "Prof. John Doe")
                            .replace(/\{\{membershipType\}\}/g, "Life Member (Individual)")
                            .replace(/\{\{amount\}\}/g, "5000");
                        })())
                      }}
                      className="prose prose-xs max-w-none text-slate-800"
                    />
                  </div>

                  <div className="text-center text-[9px] text-slate-500 font-bold uppercase tracking-wider select-none">
                    Preview parses variable placeholders with mock inputs
                  </div>

                </div>
              </div>

            </div>

          </motion.div>
        )}

      </main>

      {/* ─── DETAIL VIEW DRAWER: MEMBERSHIP (Desktop Slide-over, Mobile Full-screen) ─── */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMember(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-xs"
            />
            
            {/* Drawer body */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 300 }}
              className="relative w-full md:max-w-2xl bg-[#0B2B26] border-l border-[#163832]/85 h-full p-6 md:p-8 flex flex-col shadow-2xl overflow-y-auto select-text"
            >
              {/* Highlight header accent */}
              <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#8EB69B] to-[#DAF1DE]" />
              
              {/* Drawer Top Controls */}
              <div className="flex items-center justify-between border-b border-[#163832]/40 pb-4 mb-6 mt-4 select-none">
                <span className="text-[10px] font-black text-[#8EB69B] uppercase tracking-widest">Applicant dossier profiles</span>
                <button 
                  onClick={() => setSelectedMember(null)}
                  className="text-slate-400 hover:text-white font-bold text-sm bg-[#163832]/50 hover:bg-[#163832] h-8 w-8 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Main Profile Info */}
              <div className="space-y-6 flex-1 pr-1">
                {/* Visual Avatar Name header */}
                <div className="flex gap-4 items-center border-b border-[#163832]/30 pb-5">
                  <div className="h-14 w-14 bg-[#235347]/30 border border-[#8EB69B]/30 rounded-2xl flex items-center justify-center text-[#8EB69B] shrink-0 shadow-inner">
                    <User className="h-7 w-7" />
                  </div>
                  <div>
                    <span className="opacity-45 uppercase text-[8px] font-black tracking-widest block text-slate-400">Registered Applicant</span>
                    <span className="text-xl font-black text-white">{`${selectedMember.prefix || ""} ${selectedMember.first_name || ""} ${selectedMember.last_name || ""}`}</span>
                    <span className="inline-block px-2 py-0.5 mt-1 rounded bg-[#235347]/50 text-[#8EB69B] border border-[#8EB69B]/25 text-[9px] font-black uppercase tracking-wider">
                      {selectedMember.membership_type || "Standard Tier"}
                    </span>
                  </div>
                </div>

                {/* DYNAMIC FIELD RENDERING */}
                <div className="space-y-5">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest select-none">Submitted Information Details</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(() => {
                      const systemKeys = [
                        "id", 
                        "created_at", 
                        "updated_at", 
                        "photograph_url", 
                        "signature_url", 
                        "receipt_url", 
                        "photograph_signed_url", 
                        "signature_signed_url", 
                        "receipt_signed_url",
                        "prefix",
                        "first_name",
                        "last_name"
                      ];
                      
                      const formatLabel = (k: string) => {
                        return k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                      };

                      const isLongText = (val: any) => {
                        return typeof val === 'string' && (val.includes('\n') || val.length > 70);
                      };

                      return Object.entries(selectedMember)
                        .filter(([key, val]) => !systemKeys.includes(key) && val !== null && val !== undefined && val !== "")
                        .map(([key, val]: [string, any]) => {
                          const label = formatLabel(key);
                          const valueString = val.toString();

                          if (isLongText(val)) {
                            return (
                              <div key={key} className="col-span-1 sm:col-span-2 bg-[#051F20]/40 border border-[#163832]/40 rounded-2xl p-4 shadow-inner">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1.5 select-none">{label}</span>
                                <p className="text-xs text-slate-300 font-semibold leading-relaxed whitespace-pre-wrap">{valueString}</p>
                              </div>
                            );
                          }

                          return (
                            <div key={key} className="bg-[#051F20]/45 border border-[#163832]/40 rounded-xl p-3 shadow-inner">
                              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1 select-none">{label}</span>
                              <span className="text-xs font-black text-white">{valueString}</span>
                            </div>
                          );
                        });
                    })()}
                  </div>
                </div>

                {/* Uploaded Documents Preview Section */}
                <div className="border-t border-[#163832]/40 pt-5 mt-6">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 select-none">Uploaded Proofs & Documents</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    
                    {/* Photograph */}
                    <div className="border border-[#163832] rounded-2xl p-4 bg-[#051F20]/25 flex flex-col items-center justify-between gap-3 group">
                      <span className="font-black text-[#8EB69B] text-[10px] uppercase tracking-wider select-none">Photograph</span>
                      <div 
                        onClick={() => selectedMember.photograph_signed_url && setZoomedDoc(selectedMember.photograph_signed_url)}
                        className="h-28 w-24 border border-[#163832]/80 rounded-xl overflow-hidden relative bg-black/40 flex items-center justify-center cursor-zoom-in"
                      >
                        {selectedMember.photograph_signed_url ? (
                          <Image 
                            src={selectedMember.photograph_signed_url} 
                            alt="Photograph" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            width={96}
                            height={112}
                            unoptimized
                          />
                        ) : (
                          <span className="text-[9px] text-slate-600 font-bold uppercase">No Image File</span>
                        )}
                      </div>
                      {selectedMember.photograph_signed_url && (
                        <a 
                          href={selectedMember.photograph_signed_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[9px] font-bold text-white/80 hover:text-white inline-flex items-center gap-1 mt-1 bg-[#163832]/45 px-2.5 py-1 rounded-lg border border-[#8EB69B]/10 hover:border-[#8EB69B]/30 transition-all select-none"
                        >
                          View Original
                          <ExternalLink className="h-3 w-3 text-[#8EB69B]" />
                        </a>
                      )}
                    </div>

                    {/* Signature */}
                    <div className="border border-[#163832] rounded-2xl p-4 bg-[#051F20]/25 flex flex-col items-center justify-between gap-3 group">
                      <span className="font-black text-[#8EB69B] text-[10px] uppercase tracking-wider select-none">Signature Specimen</span>
                      <div 
                        onClick={() => selectedMember.signature_signed_url && setZoomedDoc(selectedMember.signature_signed_url)}
                        className="h-28 w-full border border-[#163832]/80 rounded-xl overflow-hidden relative bg-black/40 flex items-center justify-center p-2 cursor-zoom-in"
                      >
                        {selectedMember.signature_signed_url ? (
                          <Image 
                            src={selectedMember.signature_signed_url} 
                            alt="Signature" 
                            className="w-full h-full object-contain filter invert opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                            width={160}
                            height={112}
                            unoptimized
                          />
                        ) : (
                          <span className="text-[9px] text-slate-600 font-bold uppercase">No Signature File</span>
                        )}
                      </div>
                      {selectedMember.signature_signed_url && (
                        <a 
                          href={selectedMember.signature_signed_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[9px] font-bold text-white/80 hover:text-white inline-flex items-center gap-1 mt-1 bg-[#163832]/45 px-2.5 py-1 rounded-lg border border-[#8EB69B]/10 hover:border-[#8EB69B]/30 transition-all select-none"
                        >
                          View Original
                          <ExternalLink className="h-3 w-3 text-[#8EB69B]" />
                        </a>
                      )}
                    </div>

                    {/* Receipt */}
                    <div className="border border-[#163832] rounded-2xl p-4 bg-[#051F20]/25 flex flex-col items-center justify-between gap-3 group">
                      <span className="font-black text-[#8EB69B] text-[10px] uppercase tracking-wider select-none flex items-center gap-1 text-emerald-400">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Fee Receipt
                      </span>
                      <div 
                        onClick={() => selectedMember.receipt_signed_url && setZoomedDoc(selectedMember.receipt_signed_url)}
                        className="h-28 w-24 border border-[#163832]/80 rounded-xl overflow-hidden relative bg-black/40 flex items-center justify-center p-1 cursor-zoom-in"
                      >
                        {selectedMember.receipt_signed_url ? (
                          <Image 
                            src={selectedMember.receipt_signed_url} 
                            alt="Receipt" 
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            width={96}
                            height={112}
                            unoptimized
                          />
                        ) : (
                          <span className="text-[9px] text-slate-600 font-bold uppercase">No Receipt File</span>
                        )}
                      </div>
                      {selectedMember.receipt_signed_url && (
                        <a 
                          href={selectedMember.receipt_signed_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[9px] font-bold text-white/80 hover:text-white inline-flex items-center gap-1 mt-1 bg-[#163832]/45 px-2.5 py-1 rounded-lg border border-[#8EB69B]/10 hover:border-[#8EB69B]/30 transition-all select-none"
                        >
                          View Original
                          <ExternalLink className="h-3 w-3 text-[#8EB69B]" />
                        </a>
                      )}
                    </div>

                  </div>
                </div>

                {/* Application PDF Document Section */}
                <div className="border-t border-[#163832]/40 pt-5 mt-6 mb-6">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 select-none">Application PDF Document</h4>
                  
                  <div className="bg-[#051F20]/30 border border-[#163832]/60 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-inner">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-[#235347]/20 border border-[#8EB69B]/30 rounded-xl flex items-center justify-center text-[#8EB69B] shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-white block">Official Application PDF</span>
                        <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                          {pdfLoading ? "Generating secure signed links..." : "Signed two-page print document ready"}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                      {pdfLoading ? (
                        <div className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-[#8EB69B] w-full sm:w-auto select-none bg-[#163832]/35 border border-[#8EB69B]/10 rounded-xl">
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          Loading...
                        </div>
                      ) : pdfError ? (
                        <div className="text-[10px] font-bold text-red-400 bg-red-950/20 border border-red-900/30 px-3 py-2 rounded-xl w-full sm:w-auto">
                          {pdfError}
                        </div>
                      ) : (
                        <>
                          {pdfViewUrl && (
                            <a
                              href={pdfViewUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-[#8EB69B] hover:text-white bg-[#163832]/40 hover:bg-[#163832] border border-[#8EB69B]/20 hover:border-[#8EB69B]/50 rounded-xl transition-all cursor-pointer w-full sm:w-auto shadow-sm select-none"
                            >
                              <Eye className="h-4 w-4" />
                              View PDF
                            </a>
                          )}
                          {pdfDownloadUrl && (
                            <a
                              href={pdfDownloadUrl}
                              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#235347] hover:bg-[#2d6a5b] border border-[#8EB69B]/40 hover:border-[#8EB69B]/70 rounded-xl transition-all cursor-pointer w-full sm:w-auto shadow-sm select-none"
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </a>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── DETAIL VIEW DRAWER: CONTACT MESSAGE ─── */}
      <AnimatePresence>
        {selectedContact && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedContact(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-xs"
            />
            
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              className="relative w-full md:max-w-xl bg-[#0B2B26] border-l border-[#163832] h-full p-6 md:p-8 flex flex-col shadow-2xl overflow-y-auto select-text"
            >
              <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-orange-400 to-[#8EB69B]" />
              
              <div className="flex items-center justify-between border-b border-[#163832]/50 pb-4 mb-6 mt-4 select-none">
                <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Inquiry feedback records</span>
                <button 
                  onClick={() => setSelectedContact(null)}
                  className="text-slate-400 hover:text-white font-bold text-sm bg-[#163832]/50 hover:bg-[#163832] h-8 w-8 rounded-full flex items-center justify-center transition-all cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6 text-xs leading-relaxed flex-1">
                <div className="grid grid-cols-2 gap-4 border-b border-[#163832]/35 pb-4">
                  <div>
                    <span className="opacity-45 uppercase text-[9px] font-bold block mb-1 text-slate-400">Sender Name</span>
                    <span className="font-extrabold text-white text-sm">{selectedContact.name}</span>
                  </div>
                  <div>
                    <span className="opacity-45 uppercase text-[9px] font-bold block mb-1 text-slate-400">Received At</span>
                    <span className="font-extrabold text-white text-sm">
                      {selectedContact.created_at ? new Date(selectedContact.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : "Not specified"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-b border-[#163832]/35 pb-4">
                  <div>
                    <span className="opacity-45 uppercase text-[9px] font-bold block mb-1 text-slate-400">Email Address</span>
                    <a href={`mailto:${selectedContact.email}`} className="font-bold text-[#8EB69B] hover:underline text-sm">{selectedContact.email}</a>
                  </div>
                  <div>
                    <span className="opacity-45 uppercase text-[9px] font-bold block mb-1 text-slate-400">Phone Number</span>
                    <span className="font-bold text-white text-sm">{selectedContact.phone || "Not specified"}</span>
                  </div>
                </div>

                <div className="border-b border-[#163832]/35 pb-4">
                  <span className="opacity-45 uppercase text-[9px] font-bold block mb-1 text-slate-400">Enquiry Type</span>
                  <span className="font-bold text-white text-sm">{selectedContact.enquiry_type || "General Inquiry"}</span>
                </div>

                <div>
                  <span className="opacity-45 uppercase text-[9px] font-bold block mb-2 text-slate-400">Message Body</span>
                  <div className="bg-[#051F20] rounded-2xl p-5 text-slate-200 border border-[#163832]/60 text-sm leading-relaxed max-h-[300px] overflow-y-auto whitespace-pre-wrap shadow-inner select-text">
                    {selectedContact.message}
                  </div>
                </div>
              </div>

              {/* Action triggers */}
              <div className="pt-4 border-t border-[#163832]/50 flex items-center justify-between select-none">
                <button
                  onClick={() => handleToggleContactRead(selectedContact)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    selectedContact.is_read ? "bg-slate-700 text-slate-300" : "bg-[#235347] text-white"
                  }`}
                >
                  <Check className="h-4 w-4" />
                  {selectedContact.is_read ? "Mark Unread" : "Mark Read"}
                </button>

                <button
                  onClick={() => handleDeleteContact(selectedContact.id)}
                  className="inline-flex items-center gap-1 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/25 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── LIGHTBOX ZOOM PREVIEW FOR UPLOADED DOCS ─── */}
      <AnimatePresence>
        {zoomedDoc && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/90 select-none">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setZoomedDoc(null)}
              className="absolute inset-0"
            />
            
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-4xl max-h-[85vh] w-full flex items-center justify-center z-10"
            >
              <button 
                onClick={() => setZoomedDoc(null)}
                className="absolute -top-12 right-0 text-white font-extrabold hover:text-slate-300 bg-white/10 hover:bg-white/20 h-10 w-10 rounded-full flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
              <Image 
                src={zoomedDoc} 
                alt="Zoomed document" 
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border border-white/10" 
                width={800} 
                height={800} 
                unoptimized 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
