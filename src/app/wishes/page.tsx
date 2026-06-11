"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface RSVP {
  id: string;
  name: string;
  wishes: string;
  contact?: string;
  queries: string;
  timestamp: string;
}

export default function WishesPage() {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRsvps() {
      try {
        const response = await fetch("/api/rsvp", { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          // Sort newest first
          data.sort((a: RSVP, b: RSVP) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          setRsvps(data);
        }
      } catch (e) {
        console.error("Error fetching RSVPs:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchRsvps();
  }, []);

  const downloadCSV = () => {
    if (rsvps.length === 0) return;
    
    const headers = ["Timestamp", "Name", "Wishes", "Contact Info", "Queries"];
    const rows = rsvps.map(rsvp => [
      rsvp.timestamp ? new Date(rsvp.timestamp).toLocaleString() : "",
      rsvp.name,
      rsvp.wishes,
      rsvp.contact || "",
      rsvp.queries || ""
    ]);
    
    // Construct CSV content
    const csvRows = [
      headers.join(","),
      ...rows.map(row => row.map(val => `"${val.replace(/"/g, '""')}"`).join(","))
    ];
    
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(csvRows.join("\n"));
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", "wedding_wishes_and_rsvps.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen py-16 px-4 md:px-8" style={{ background: "linear-gradient(160deg, #1a0008 0%, #2d000e 60%, #1a0008 100%)" }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-sans text-yellow-400/60 text-xs uppercase tracking-[0.35em] mb-3">Wishes & RSVPs</p>
          <h1 className="font-calligraphy text-5xl md:text-6xl text-white mb-4">Guestbook</h1>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-yellow-400/50" />
            <span className="text-yellow-400">✦</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-yellow-400/50" />
          </div>
          <p className="font-serif text-white/60 italic text-sm mt-3">
            Warm wishes and queries from your family and friends.
          </p>
        </div>

        {/* Download CSV Actions */}
        {!loading && rsvps.length > 0 && (
          <div className="flex justify-end mb-6">
            <button
              onClick={downloadCSV}
              className="px-6 py-2.5 rounded-xl border border-yellow-400/30 text-yellow-400 font-sans font-bold text-xs uppercase tracking-widest hover:bg-yellow-400/10 hover:border-yellow-400 transition-all duration-300 shadow-md flex items-center gap-2"
            >
              📊 Download Spreadsheet (CSV)
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin"></div>
            <p className="font-serif italic text-white/50 text-sm mt-4">Loading guestbook wishes...</p>
          </div>
        ) : rsvps.length === 0 ? (
          <div className="text-center py-16 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 max-w-md mx-auto">
            <p className="font-serif italic text-white/60 text-lg mb-6">No wishes received yet.</p>
            <Link href="/" className="inline-block px-8 py-3.5 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-sans font-bold text-xs tracking-widest hover:scale-105 transition-transform">
              GO TO RSVP FORM
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {rsvps.map((rsvp) => (
              <div key={rsvp.id} className="p-px rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(255,215,0,0.2), rgba(214,51,108,0.2))" }}>
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 h-full flex flex-col justify-between border border-white/5">
                  <div>
                    <div className="flex justify-between items-start mb-4 gap-4">
                      <h3 className="font-calligraphy text-3xl text-yellow-400 leading-tight">{rsvp.name}</h3>
                      <span className="text-[10px] text-white/40 font-mono shrink-0 pt-1.5">
                        {rsvp.timestamp ? new Date(rsvp.timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}
                      </span>
                    </div>
                    <p className="font-serif text-white/80 italic text-sm leading-relaxed mb-4">
                      &ldquo;{rsvp.wishes}&rdquo;
                    </p>
                  </div>
                  
                  {/* Contact and Queries Info */}
                  {(rsvp.contact || rsvp.queries) && (
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                      {rsvp.contact && (
                        <div>
                          <p className="font-sans text-[10px] text-yellow-400/50 uppercase tracking-widest mb-1">Contact Info</p>
                          <p className="font-sans text-xs text-white/70">{rsvp.contact}</p>
                        </div>
                      )}
                      {rsvp.queries && (
                        <div>
                          <p className="font-sans text-[10px] text-yellow-400/50 uppercase tracking-widest mb-1">Query/Request</p>
                          <p className="font-sans text-xs text-white/70">{rsvp.queries}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/" className="inline-block font-sans text-xs font-bold text-yellow-400/60 uppercase tracking-widest hover:text-yellow-400 transition-colors">
            ← Back to Invitation
          </Link>
        </div>
      </div>
    </main>
  );
}
