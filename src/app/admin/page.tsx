"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, Lock, Eye, Download, Search, Check, X, Film, Image as ImageIcon, 
  Trash2, ChevronLeft, LogOut, RefreshCw, Layers, Users, BarChart2, Star
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface MediaItem {
  id: string;
  url: string;
  category: string;
  uploader: string;
  type: string;
  status: string;
  timestamp: string;
}

interface RSVPItem {
  id: string;
  name: string;
  wishes: string;
  contact: string;
  queries: string;
  timestamp: string;
}

const albums = ["Pelli Kuthuru", "Haldi", "Reception", "Wedding", "Family Moments"];

export default function AdminPage() {
  const [passcode, setPasscode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"gallery" | "rsvp">("gallery");

  // Data states
  const [gallery, setGallery] = useState<MediaItem[]>([]);
  const [rsvps, setRsvps] = useState<RSVPItem[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Filter/Search states
  const [rsvpSearch, setRsvpSearch] = useState("");
  const [galleryFilter, setGalleryFilter] = useState("All");

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Auto-login from localStorage if passcode was saved
  useEffect(() => {
    const saved = localStorage.getItem("host_admin_passcode");
    if (saved) {
      verifyPasscode(saved);
    }
  }, []);

  const verifyPasscode = async (code: string) => {
    setIsSubmitting(true);
    setAuthError("");
    try {
      // Test secret against gallery API first
      const res = await fetch(`/api/gallery?secret=${encodeURIComponent(code)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.isAdmin) {
          setIsAuthorized(true);
          localStorage.setItem("host_admin_passcode", code);
          fetchData(code);
        } else {
          setAuthError("Incorrect passcode. Access denied.");
        }
      } else {
        setAuthError("Invalid access token.");
      }
    } catch (err) {
      setAuthError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) return;
    verifyPasscode(passcode);
  };

  const handleLogout = () => {
    localStorage.removeItem("host_admin_passcode");
    setIsAuthorized(false);
    setPasscode("");
    setGallery([]);
    setRsvps([]);
  };

  const fetchData = async (code: string) => {
    setIsLoadingData(true);
    const secretCode = code || passcode || localStorage.getItem("host_admin_passcode") || "";
    try {
      // 1. Fetch gallery
      const galRes = await fetch(`/api/gallery?secret=${encodeURIComponent(secretCode)}`);
      if (galRes.ok) {
        const galData = await galRes.json();
        setGallery(galData.gallery || []);
      }
      
      // 2. Fetch RSVPs
      const rsvpRes = await fetch(`/api/rsvp?secret=${encodeURIComponent(secretCode)}`);
      if (rsvpRes.ok) {
        const rsvpData = await rsvpRes.json();
        setRsvps(rsvpData || []);
      }
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Gallery moderation actions
  const handleApprove = async (mediaId: string, category: string) => {
    const code = passcode || localStorage.getItem("host_admin_passcode") || "";
    try {
      const res = await fetch("/api/gallery/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "approve",
          mediaId,
          category,
          secret: code
        })
      });
      if (res.ok) {
        setGallery(prev => prev.map(item => item.id === mediaId ? { ...item, status: "approved", category } : item));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMedia = async (mediaId: string) => {
    if (!confirm("Are you sure you want to delete this media permanently?")) return;
    const code = passcode || localStorage.getItem("host_admin_passcode") || "";
    try {
      const res = await fetch(`/api/gallery/admin?mediaId=${mediaId}&secret=${encodeURIComponent(code)}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setGallery(prev => prev.filter(item => item.id !== mediaId));
        if (lightboxIndex !== null) setLightboxIndex(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCategorize = async (mediaId: string, category: string) => {
    const code = passcode || localStorage.getItem("host_admin_passcode") || "";
    try {
      await fetch("/api/gallery/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "categorize",
          mediaId,
          category,
          secret: code
        })
      });
      setGallery(prev => prev.map(item => item.id === mediaId ? { ...item, category } : item));
    } catch (err) {
      console.error(err);
    }
  };

  // RSVP actions
  const handleDeleteRsvp = async (rsvpId: string) => {
    if (!confirm("Are you sure you want to remove this RSVP entry?")) return;
    const code = passcode || localStorage.getItem("host_admin_passcode") || "";
    try {
      const res = await fetch(`/api/rsvp?rsvpId=${rsvpId}&secret=${encodeURIComponent(code)}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setRsvps(prev => prev.filter(item => item.id !== rsvpId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (rsvps.length === 0) return;
    const headers = ["Name", "Blessings/Wishes", "Contact Info", "Queries", "Date/Time"];
    const rows = rsvps.map(item => [
      item.name,
      item.wishes.replace(/\n/g, " "),
      item.contact,
      item.queries.replace(/\n/g, " "),
      new Date(item.timestamp).toLocaleString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `wedding_rsvps_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Compute statistics
  const pendingCount = gallery.filter(item => item.status === "pending").length;
  const approvedCount = gallery.filter(item => item.status === "approved").length;
  const totalUploads = gallery.length;
  const totalRsvps = rsvps.length;

  // Filter lists
  const filteredGallery = gallery.filter(item => {
    if (galleryFilter === "Pending") return item.status === "pending";
    if (galleryFilter === "Approved") return item.status === "approved";
    if (galleryFilter === "All") return true;
    return item.category === galleryFilter && item.status === "approved";
  });

  const filteredRsvps = rsvps.filter(item => 
    item.name.toLowerCase().includes(rsvpSearch.toLowerCase()) ||
    item.wishes.toLowerCase().includes(rsvpSearch.toLowerCase())
  );

  if (!isAuthorized) {
    return (
      <main className="min-h-screen relative flex items-center justify-center py-12 px-4"
        style={{ background: "linear-gradient(135deg, #1c0008 0%, #120005 50%, #1c0008 100%)" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(184,134,11,0.15),rgba(0,0,0,0))]" />
        
        {/* Login Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-md w-full p-px rounded-3xl"
          style={{ background: "linear-gradient(135deg, #b8860b, #ffd700, #4a0404, #ffd700, #b8860b)" }}
        >
          <div className="rounded-3xl p-8 md:p-10 bg-black/90 backdrop-blur-2xl text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-gold-primary/10 flex items-center justify-center border border-gold-primary/20 text-gold-light">
              <Lock className="w-6 h-6 animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <p className="font-sans text-gold-light/60 text-[10px] uppercase tracking-[0.35em]">Wedding Administrator</p>
              <h2 className="font-calligraphy text-4xl md:text-5xl text-white">Host Dashboard</h2>
              <p className="font-serif italic text-white/50 text-xs max-w-xs mx-auto">
                Secure access for Sudeepthi &amp; Nayanadeep&apos;s digital guestbook and media gallery.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="password"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter Admin Passcode"
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-center text-xs text-white placeholder-white/20 focus:outline-none focus:border-gold-primary transition-all font-sans"
                />
              </div>

              {authError && (
                <p className="text-rose-400 text-xs font-sans">{authError}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !passcode}
                className="w-full py-3.5 rounded-xl font-sans font-bold uppercase tracking-widest text-xs transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-yellow-500 via-amber-500 to-amber-600 text-white"
              >
                {isSubmitting ? "Verifying Access..." : "Unlock Host Controls ✦"}
              </button>
            </form>

            <Link href="/" className="inline-block text-[11px] font-sans text-gold-light/50 hover:text-gold-light transition-colors uppercase tracking-wider">
              ← Return to Main Invitation
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-12 px-4 md:px-8 relative"
      style={{ background: "linear-gradient(160deg, #120005 0%, #1c0008 50%, #120005 100%)" }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_-10%,rgba(184,134,11,0.08),rgba(0,0,0,0))]" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-white/10 pb-6">
          <div className="text-center md:text-left space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2 text-gold-light">
              <Shield className="w-4 h-4" />
              <p className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold">Royal Palace Host Suite</p>
            </div>
            <h1 className="font-calligraphy text-4xl md:text-5xl text-white">Sudeepthi & Nayanadeep</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchData("")}
              disabled={isLoadingData}
              className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingData ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 rounded-full bg-rose-600/15 border border-rose-500/20 text-rose-300 font-sans font-semibold text-xs uppercase tracking-wider hover:bg-rose-600/35 transition-all flex items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total RSVPs", val: totalRsvps, icon: Users, color: "from-blue-500 to-indigo-600" },
            { label: "Pending Uploads", val: pendingCount, icon: Eye, color: "from-amber-500 to-yellow-600", pulse: pendingCount > 0 },
            { label: "Approved Media", val: approvedCount, icon: ImageIcon, color: "from-emerald-500 to-teal-600" },
            { label: "Total Uploads", val: totalUploads, icon: BarChart2, color: "from-purple-500 to-pink-600" },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-5 relative overflow-hidden backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-sans text-[10px] text-white/40 uppercase tracking-widest">{stat.label}</p>
                  <p className="font-sans text-3xl font-bold text-white mt-1">{stat.val}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-white shrink-0`}>
                  <stat.icon className={`w-5 h-5 ${stat.pulse ? "animate-bounce" : ""}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab("gallery")}
            className={`px-8 py-4 font-sans font-bold text-xs uppercase tracking-wider transition-all border-b-2 ${
              activeTab === "gallery"
                ? "border-gold-primary text-gold-light bg-gold-primary/5"
                : "border-transparent text-white/55 hover:text-white"
            }`}
          >
            Gallery Moderation ({gallery.length})
          </button>
          <button
            onClick={() => setActiveTab("rsvp")}
            className={`px-8 py-4 font-sans font-bold text-xs uppercase tracking-wider transition-all border-b-2 ${
              activeTab === "rsvp"
                ? "border-gold-primary text-gold-light bg-gold-primary/5"
                : "border-transparent text-white/55 hover:text-white"
            }`}
          >
            Blessings &amp; RSVPs ({rsvps.length})
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="min-h-[400px]">
          {isLoadingData ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-3">
              <RefreshCw className="w-8 h-8 text-gold-light animate-spin" />
              <p className="font-serif italic text-white/40 text-xs">Fetching palace registers...</p>
            </div>
          ) : activeTab === "gallery" ? (
            <div className="space-y-6">
              {/* Gallery Filter Toolbar */}
              <div className="flex flex-wrap gap-2 pb-2 items-center justify-between border-b border-white/5">
                <div className="flex flex-wrap gap-1.5">
                  {["All", "Pending", "Approved", ...albums].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setGalleryFilter(filter)}
                      className={`px-4 py-2 rounded-full font-sans text-[10px] uppercase font-bold tracking-widest border transition-all ${
                        galleryFilter === filter
                          ? "bg-white text-deep-maroon border-white shadow-md"
                          : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gallery Grid */}
              {filteredGallery.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                  <p className="font-serif italic text-white/40 text-sm">No items matching this filter.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredGallery.map((item, idx) => (
                    <div key={item.id} className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg relative group">
                      
                      {/* Status indicator badge */}
                      <div className={`absolute top-3 left-3 z-10 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider font-sans ${
                        item.status === "pending"
                          ? "bg-amber-500/80 text-white"
                          : "bg-emerald-500/80 text-white"
                      }`}>
                        {item.status}
                      </div>

                      {/* File Preview */}
                      <div 
                        onClick={() => setLightboxIndex(gallery.findIndex(g => g.id === item.id))}
                        className="relative aspect-[4/3] bg-gray-900 border-b border-white/5 cursor-pointer overflow-hidden"
                      >
                        {item.type === "video" ? (
                          <div className="relative w-full h-full flex items-center justify-center">
                            <video src={item.url} className="object-cover w-full h-full" muted />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white">
                              <Film className="w-8 h-8 opacity-75" />
                            </div>
                          </div>
                        ) : (
                          <Image
                            src={item.url}
                            alt="Media"
                            fill
                            sizes="250px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                      </div>

                      {/* Information & Action details */}
                      <div className="p-4 space-y-3.5">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-sans text-[9px] text-white/40 uppercase">Uploaded by</p>
                            <p className="font-sans text-xs text-white font-bold truncate max-w-[120px]">{item.uploader}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-sans text-[9px] text-white/40 uppercase">Date</p>
                            <p className="font-sans text-[9px] text-white/60">
                              {new Date(item.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Category Config */}
                        <div>
                          <label className="font-sans text-[9px] text-white/40 uppercase tracking-widest block mb-1">Album Category</label>
                          <select
                            value={item.category}
                            onChange={(e) => handleCategorize(item.id, e.target.value)}
                            className="w-full bg-[#120005] border border-white/15 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none"
                          >
                            {albums.map((album) => (
                              <option key={album} value={album}>{album}</option>
                            ))}
                          </select>
                        </div>

                        {/* Actions block */}
                        <div className="flex gap-2 pt-1">
                          {item.status === "pending" ? (
                            <button
                              onClick={() => handleApprove(item.id, item.category)}
                              className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-[9px] uppercase tracking-wider flex items-center justify-center gap-1 shadow"
                            >
                              <Check className="w-3 h-3" /> Approve
                            </button>
                          ) : (
                            <div className="flex-1 py-1.5 rounded-lg border border-white/10 text-white/40 font-sans font-bold text-[9px] uppercase tracking-wider text-center flex items-center justify-center gap-1">
                              <Check className="w-3 h-3 text-emerald-400" /> Approved
                            </div>
                          )}
                          <button
                            onClick={() => handleDeleteMedia(item.id)}
                            className="py-2 px-3 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* RSVP Toolbar */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-white/5 pb-4">
                <div className="relative max-w-md w-full">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search guests or wishes..."
                    value={rsvpSearch}
                    onChange={(e) => setRsvpSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold-primary transition-all font-sans"
                  />
                </div>
                
                <button
                  onClick={handleExportCSV}
                  disabled={rsvps.length === 0}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-sans font-bold text-xs uppercase tracking-widest shadow-md hover:scale-[1.02] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" /> Export CSV Register
                </button>
              </div>

              {/* RSVPs Table / Cards */}
              {filteredRsvps.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                  <p className="font-serif italic text-white/40 text-sm">No blessings found matching search terms.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRsvps.map((item) => (
                    <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 backdrop-blur-md flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gold-primary/10 border border-gold-primary/30 flex items-center justify-center text-gold-light shrink-0">
                            <Star className="w-3.5 h-3.5 fill-gold-primary text-gold-primary" />
                          </div>
                          <div>
                            <h3 className="font-calligraphy text-2xl text-white">{item.name}</h3>
                            <p className="font-sans text-[8px] text-white/30 uppercase tracking-widest">
                              {new Date(item.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="bg-black/30 border border-white/5 rounded-xl p-4">
                          <p className="font-sans text-xs text-white/80 italic leading-relaxed whitespace-pre-wrap">
                            &ldquo;{item.wishes}&rdquo;
                          </p>
                        </div>

                        {/* Extra Admin Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                          {item.contact && (
                            <div className="bg-black/20 rounded-lg p-2 border border-white/5">
                              <span className="text-white/40 block text-[9px] uppercase tracking-wider">Contact Info</span>
                              <span className="text-white/80">{item.contact}</span>
                            </div>
                          )}
                          {item.queries && (
                            <div className="bg-black/20 rounded-lg p-2 border border-white/5">
                              <span className="text-white/40 block text-[9px] uppercase tracking-wider">Queries / Special Requests</span>
                              <span className="text-white/80">{item.queries}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 flex md:self-center">
                        <button
                          onClick={() => handleDeleteRsvp(item.id)}
                          className="px-4 py-2.5 rounded-xl bg-rose-600/10 border border-rose-500/20 text-rose-300 hover:bg-rose-600 hover:text-white transition-all flex items-center gap-1.5 font-sans font-bold text-[10px] uppercase tracking-wider"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete Entry
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* ── LIGHTBOX VIEWER ── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-8"
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 z-55 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Media Box */}
            <div className="relative max-w-4xl w-full h-[70vh] flex items-center justify-center">
              {gallery[lightboxIndex]?.type === "video" ? (
                <video 
                  src={gallery[lightboxIndex].url} 
                  className="max-h-full max-w-full rounded-lg" 
                  controls 
                  autoPlay
                />
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={gallery[lightboxIndex].url}
                    alt="Lightbox media"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>

            {/* Lightbox details & deletion */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-md w-full bg-black/80 border border-white/10 rounded-2xl p-4 flex justify-between items-center gap-4 z-55">
              <div className="overflow-hidden">
                <p className="font-sans text-[9px] text-white/40 uppercase">Uploaded by</p>
                <p className="font-calligraphy text-xl text-white truncate">{gallery[lightboxIndex]?.uploader}</p>
                <p className="font-sans text-[10px] text-gold-light mt-0.5">{gallery[lightboxIndex]?.category}</p>
              </div>
              <button
                onClick={() => handleDeleteMedia(gallery[lightboxIndex].id)}
                className="px-4 py-2.5 rounded-xl bg-rose-600 text-white font-sans font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 shadow"
              >
                <Trash2 className="w-4 h-4" /> Delete Media
              </button>
            </div>

            {/* Navigation arrows */}
            {lightboxIndex > 0 && (
              <button
                onClick={() => setLightboxIndex(lightboxIndex - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            {lightboxIndex < gallery.length - 1 && (
              <button
                onClick={() => setLightboxIndex(lightboxIndex + 1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
              >
                {/* Reusing ChevronLeft rotated as right arrow */}
                <ChevronLeft className="w-6 h-6 rotate-180" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
