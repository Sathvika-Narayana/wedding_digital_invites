"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";

interface MediaItem {
  id: string;
  url: string;
  category: string;
  uploader: string;
  type: string;
  timestamp?: string;
}

// Fallback anime photos for each book section
const albumFallbacks: Record<string, MediaItem[]> = {
  "Before Wedding": [
    { id: "fb1-1", url: "/images/event_pellikuthuru_anime.jpeg", category: "Before Wedding", uploader: "Sathvika", type: "image" },
    { id: "fb1-2", url: "/images/event_haldi_anime.jpeg", category: "Before Wedding", uploader: "Nayan", type: "image" }
  ],
  "Wedding Day": [
    { id: "fb2-1", url: "/images/event_muhurtham_anime.jpeg", category: "Wedding Day", uploader: "Family", type: "image" }
  ],
  "Reception": [
    { id: "fb3-1", url: "/images/event_reception_anime.jpeg", category: "Reception", uploader: "Sudeepthi", type: "image" }
  ],
  "Family Photos": [
    { id: "fb4-1", url: "/images/event_welcome_anime.jpeg", category: "Family Photos", uploader: "Friend", type: "image" }
  ],
  "Guest Photos": [
    { id: "fb5-1", url: "/images/event_welcome.jpeg", category: "Guest Photos", uploader: "Guest", type: "image" }
  ]
};

const tabs = ["Before Wedding", "Wedding Day", "Reception", "Family Photos", "Guest Photos"];

export function MemoryBook() {
  const [activeTab, setActiveTab] = useState<string>("Before Wedding");
  const [galleryItems, setGalleryItems] = useState<MediaItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next");

  // Load photos
  useEffect(() => {
    async function loadMedia() {
      try {
        const res = await fetch("/api/gallery");
        if (res.ok) {
          const data = await res.json();
          if (data.gallery) {
            setGalleryItems(data.gallery);
          }
        }
      } catch (err) {
        console.error("Failed to load media for book", err);
      }
    }
    loadMedia();
  }, []);

  // Filter media for the active tab
  const getTabMedia = (): MediaItem[] => {
    // Map gallery categories to Book tabs
    const filtered = galleryItems.filter((item) => {
      const cat = item.category.toLowerCase();
      if (activeTab === "Before Wedding") return cat.includes("pasupu") || cat.includes("pellikuturu") || cat.includes("pelli kuthuru") || cat.includes("haldi") || cat.includes("before");
      if (activeTab === "Wedding Day") return cat.includes("muhurtham") || cat.includes("wedding") || cat.includes("day");
      if (activeTab === "Reception") return cat.includes("reception");
      if (activeTab === "Family Photos") return cat.includes("family");
      return cat.includes("guest"); // Guest Photos
    });

    return filtered.length > 0 ? filtered : (albumFallbacks[activeTab] || []);
  };

  const activeMedia = getTabMedia();

  // Reset page when tab changes
  useEffect(() => {
    setCurrentPage(0);
  }, [activeTab]);

  const handleNext = () => {
    if (currentPage < activeMedia.length - 1) {
      setFlipDirection("next");
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setFlipDirection("prev");
      setCurrentPage((prev) => prev - 1);
    }
  };

  const pageItem = activeMedia[currentPage] || null;

  // Book flipping animation definition
  const pageVariants = {
    initial: (direction: "next" | "prev") => ({
      rotateY: direction === "next" ? 90 : -90,
      opacity: 0,
      transformOrigin: "left center",
    }),
    animate: {
      rotateY: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    exit: (direction: "next" | "prev") => ({
      rotateY: direction === "next" ? -90 : 90,
      opacity: 0,
      transformOrigin: "left center",
      transition: {
        duration: 0.6,
        ease: "easeIn",
      },
    }),
  };

  return (
    <section className="py-24 px-4 relative overflow-hidden" 
      style={{ background: "linear-gradient(160deg, #fffcf8 0%, #fdf5e6 50%, #fffcf8 100%)" }}
    >
      {/* Background Mandala overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center">
        <div className="w-[600px] h-[600px] rounded-full border-2 border-dashed border-deep-maroon animate-spin-slow" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-sans text-royal-pink/60 text-xs uppercase tracking-[0.35em] mb-3">Our Love Story</p>
          <h2 className="font-calligraphy text-5xl md:text-6xl text-deep-maroon mb-4">Memory Book</h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-royal-pink/40" />
            <BookOpen className="w-5 h-5 text-royal-pink" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-royal-pink/40" />
          </div>
        </div>

        {/* Leather-bound Tab binders */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs uppercase tracking-widest font-sans font-bold border transition-all duration-300 ${
                activeTab === tab
                  ? "bg-deep-maroon text-gold-light border-deep-maroon shadow-md"
                  : "bg-white/60 text-deep-maroon border-gold-primary/20 hover:bg-gold-primary/5 hover:border-gold-primary/40"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── THE INTERACTIVE DIGITAL BOOK ── */}
        <div className="relative max-w-4xl mx-auto" style={{ perspective: 1500 }}>
          {/* Main Book Frame */}
          <div 
            className="w-full bg-[#3d0d19] p-2 md:p-4 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.4)] border-4 border-gold-dark relative flex flex-col md:flex-row min-h-[460px] md:min-h-[500px]"
            style={{
              backgroundImage: "radial-gradient(circle at center, #521626 0%, #310813 100%)",
            }}
          >
            {/* Center seam binder rings */}
            <div className="hidden md:flex absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-6 flex-col justify-around py-8 z-30 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-6 h-3 bg-gradient-to-r from-gray-400 via-gray-200 to-gray-500 rounded-full border border-black/40 shadow-md shadow-black/80" />
              ))}
            </div>

            {/* LEFT PAGE - Text description / Details */}
            <div className="flex-1 bg-[#fffdfa] rounded-2xl md:rounded-r-none p-6 md:p-8 flex flex-col justify-between relative shadow-[inset_-10px_0_30px_rgba(0,0,0,0.05)] border-b-2 md:border-b-0 md:border-r border-gold-primary/10">
              {/* Corner decor */}
              <div className="absolute top-3 left-3 text-gold-dark/15 font-calligraphy text-2xl select-none">❧</div>
              <div className="absolute bottom-3 left-3 text-gold-dark/15 font-calligraphy text-2xl select-none rotate-90">❧</div>

              <div className="relative z-10 flex-1 flex flex-col justify-center text-center px-4 mt-4">
                <p className="font-sans text-gold-dark text-[9px] uppercase tracking-[0.25em] mb-2">Album Chapter</p>
                <h3 className="font-calligraphy text-3xl md:text-4xl text-deep-maroon mb-4">{activeTab}</h3>
                
                <div className="w-12 h-px bg-gold-primary/30 mx-auto mb-6" />

                <p className="font-serif italic text-gray-600 text-sm leading-relaxed mb-6">
                  {activeTab === "Before Wedding" && "The prelude to our union — traditional Telugu ceremonies filled with marigold flowers, turmeric paste, and joyful anticipations."}
                  {activeTab === "Wedding Day" && "Two paths unite under the sacred mandapam. Bound by rituals, blessed by elders, stepping into a lifetime of togetherness."}
                  {activeTab === "Reception" && "A glittering evening of celebrations, music, and love. Welcoming our friends and family to join in our new beginning."}
                  {activeTab === "Family Photos" && "The pillars of our lives. Capturing key moments with the parents, siblings, and loved ones who made us who we are."}
                  {activeTab === "Guest Photos" && "Moments captured through the lens of our lovely guests. A living collection of memories, laughter, and greetings."}
                </p>

                {pageItem && (
                  <div className="text-center font-sans mt-2">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Uploaded by</p>
                    <p className="text-xs text-deep-maroon font-bold">{pageItem.uploader}</p>
                  </div>
                )}
              </div>

              {/* Page Number */}
              <div className="text-center text-[10px] text-gray-400 font-mono select-none mt-4 md:mt-0">
                Page {currentPage * 2 + 1}
              </div>
            </div>

            {/* RIGHT PAGE - Visuals with Flip Animation */}
            <div className="flex-1 bg-[#fffdfa] rounded-2xl md:rounded-l-none p-6 md:p-8 flex flex-col justify-between relative shadow-[inset_10px_0_30px_rgba(0,0,0,0.05)] overflow-hidden">
              {/* Corner decor */}
              <div className="absolute top-3 right-3 text-gold-dark/15 font-calligraphy text-2xl select-none rotate-270">❧</div>
              <div className="absolute bottom-3 right-3 text-gold-dark/15 font-calligraphy text-2xl select-none rotate-180">❧</div>

              <div className="flex-1 flex items-center justify-center relative w-full h-full min-h-[280px]">
                <AnimatePresence mode="wait" custom={flipDirection}>
                  {pageItem && (
                    <motion.div
                      key={pageItem.id}
                      custom={flipDirection}
                      variants={pageVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="absolute inset-0 flex flex-col items-center justify-center"
                    >
                      {/* Image frame */}
                      <div className="w-full h-full max-h-[280px] aspect-[4/3] relative rounded-xl overflow-hidden shadow-lg border border-gold-primary/10 bg-gray-950">
                        {pageItem.type === "video" ? (
                          <video
                            src={pageItem.url}
                            className="object-cover w-full h-full"
                            controls
                            playsInline
                          />
                        ) : (
                          <Image
                            src={pageItem.url}
                            alt={`Photo for ${activeTab}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 300px, 400px"
                          />
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Book Controls & Page Number */}
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 0}
                  className={`w-9 h-9 rounded-full bg-deep-maroon text-gold-light flex items-center justify-center transition-all ${
                    currentPage === 0 ? "opacity-30 cursor-not-allowed" : "hover:scale-105 active:scale-95"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="text-center text-[10px] text-gray-400 font-mono select-none">
                  Page {currentPage * 2 + 2} of {activeMedia.length * 2}
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentPage === activeMedia.length - 1}
                  className={`w-9 h-9 rounded-full bg-deep-maroon text-gold-light flex items-center justify-center transition-all ${
                    currentPage === activeMedia.length - 1 ? "opacity-30 cursor-not-allowed" : "hover:scale-105 active:scale-95"
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
