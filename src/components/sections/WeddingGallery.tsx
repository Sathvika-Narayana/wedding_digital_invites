"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Shield, Download, Share2, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Film
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

const albums = ["Pelli Kuthuru", "Haldi", "Reception", "Wedding", "Family Moments"];

export function WeddingGallery() {
  const [gallery, setGallery] = useState<MediaItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("All");

  // Lightbox states
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Fetch approved gallery
  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/gallery");
      if (res.ok) {
        const data = await res.json();
        if (data.gallery) {
          setGallery(data.gallery);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);



  // Filter gallery items
  const filteredGallery = gallery.filter(item => {
    if (activeFilter === "All") return true;
    return item.category === activeFilter;
  });

  // Share link handler
  const handleShare = async (item: MediaItem) => {
    const absoluteUrl = window.location.origin + item.url;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Sudeepthi & Nayan's Wedding Memory",
          text: `Check out this wedding moment shared by ${item.uploader}!`,
          url: absoluteUrl
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      navigator.clipboard.writeText(absoluteUrl);
      alert("Link copied to clipboard!");
    }
  };

  // Zoom controls
  const zoomIn = () => setZoomScale(prev => Math.min(prev + 0.5, 4));
  const zoomOut = () => {
    setZoomScale(prev => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  };

  // Pan controls
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomScale <= 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch controls
  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoomScale <= 1 || e.touches.length !== 1) return;
    setIsDragging(true);
    const touch = e.touches[0];
    dragStart.current = { x: touch.clientX - panOffset.x, y: touch.clientY - panOffset.y };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPanOffset({
      x: touch.clientX - dragStart.current.x,
      y: touch.clientY - dragStart.current.y
    });
  };

  return (
    <section className="py-24 px-4 relative" id="gallery"
      style={{ background: "linear-gradient(160deg, #1c0008 0%, #120005 50%, #1c0008 100%)" }}
    >
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-primary/30 to-transparent" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-sans text-gold-light/60 text-xs uppercase tracking-[0.35em] mb-3">Wedding Memories</p>
          <h2 className="font-calligraphy text-5xl md:text-6xl text-white mb-4">Celebration Gallery</h2>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-primary/40" />
            <span className="text-gold-primary text-xl">✦</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-primary/40" />
          </div>
          {/* Link to Host Admin */}
          <div className="flex justify-center">
            <Link
              href="/admin"
              className="px-6 py-2 rounded-full font-sans font-bold text-xs uppercase tracking-widest transition-all bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 flex items-center gap-2"
            >
              <Shield className="w-3.5 h-3.5" /> Host Admin
            </Link>
          </div>
        </div>

        {/* ── APPROVED GALLERY ── */}
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 pb-2">
            {["All", ...albums].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full font-sans text-[10px] uppercase font-bold tracking-widest border transition-all ${
                  activeFilter === filter
                    ? "bg-white text-deep-maroon border-white shadow-md shadow-white/10"
                    : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Masonry layout column layout */}
          {filteredGallery.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
              <p className="font-serif italic text-white/40 text-sm">No approved photos in this album yet.</p>
            </div>
          ) : (
            <div className="columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4">
              {filteredGallery.map((item, idx) => {
                const actualIdx = gallery.findIndex(g => g.id === item.id);
                
                return (
                  <motion.div
                    key={item.id}
                    onClick={() => {
                      setLightboxIndex(actualIdx);
                      setZoomScale(1);
                      setPanOffset({ x: 0, y: 0 });
                    }}
                    className="relative group rounded-2xl overflow-hidden cursor-pointer border border-white/10 bg-black/40 break-inside-avoid shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.type === "video" ? (
                      <div className="relative aspect-[3/4]">
                        <video src={item.url} className="object-cover w-full h-full" muted />
                        <div className="absolute top-3 right-3 bg-black/60 w-8 h-8 rounded-full flex items-center justify-center text-white border border-white/10">
                          <Film className="w-4 h-4" />
                        </div>
                      </div>
                    ) : item.type === "document" ? (
                      <div className="relative aspect-[3/4] bg-black/60 flex flex-col items-center justify-center p-4">
                        <Download className="w-8 h-8 text-gold-light mb-2" />
                        <p className="text-white text-xs text-center break-all">{item.url.split('/').pop()}</p>
                      </div>
                    ) : (
                      <Image
                        src={item.url}
                        alt={`Photo by ${item.uploader}`}
                        width={350}
                        height={450}
                        className="w-full h-auto object-cover"
                        sizes="(max-width: 768px) 150px, 300px"
                      />
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <p className="font-sans text-[9px] text-gold-light uppercase tracking-widest">{item.category}</p>
                      <p className="font-calligraphy text-2xl text-white leading-tight">By {item.uploader}</p>
                    </div>
                  </motion.div>
                );
              })}
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
            className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between py-6 px-4 select-none touch-none"
          >
            {/* Top Toolbar */}
            <div className="relative z-10 flex justify-between items-center max-w-5xl mx-auto w-full">
              <div>
                <p className="font-sans text-[10px] text-gold-light uppercase tracking-widest">
                  {gallery[lightboxIndex]?.category}
                </p>
                <p className="font-calligraphy text-2xl text-white">
                  By {gallery[lightboxIndex]?.uploader}
                </p>
              </div>

              {/* Close and Actions */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={zoomIn} 
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button 
                  onClick={zoomOut}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <a
                  href={gallery[lightboxIndex]?.url}
                  download={`wedding_${gallery[lightboxIndex]?.id}`}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  onClick={() => handleShare(gallery[lightboxIndex])}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setLightboxIndex(null)}
                  className="w-9 h-9 rounded-full bg-gold-primary text-deep-maroon flex items-center justify-center font-bold shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Lightbox Canvas */}
            <div 
              className="flex-1 flex items-center justify-center relative w-full overflow-hidden"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
            >
              {lightboxIndex > 0 && (
                <button
                  onClick={() => { 
                    setLightboxIndex(lightboxIndex - 1); 
                    setZoomScale(1); 
                    setPanOffset({ x: 0, y: 0 }); 
                  }}
                  className="absolute left-4 z-10 w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Media Element with Zoom and Pan styling */}
              <div 
                className="relative max-w-4xl max-h-[70vh] aspect-auto w-full h-full flex items-center justify-center transition-transform duration-100 ease-out cursor-grab active:cursor-grabbing"
                style={{
                  transform: `scale(${zoomScale}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                }}
              >
                {gallery[lightboxIndex]?.type === "video" ? (
                  <video
                    src={gallery[lightboxIndex]?.url}
                    className="max-w-full max-h-full object-contain rounded-xl"
                    controls
                    autoPlay
                    playsInline
                  />
                ) : gallery[lightboxIndex]?.type === "document" ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-black/50 rounded-xl p-8">
                    <Download className="w-16 h-16 text-gold-light mb-4" />
                    <p className="text-white text-lg text-center mb-4">{gallery[lightboxIndex]?.url.split('/').pop()}</p>
                    <a href={gallery[lightboxIndex]?.url} download className="px-6 py-2 bg-gold-primary text-deep-maroon rounded-full font-bold">Download Document</a>
                  </div>
                ) : (
                  <Image
                    src={gallery[lightboxIndex]?.url}
                    alt="Enlarged view"
                    fill
                    className="object-contain rounded-xl"
                    sizes="100vw"
                  />
                )}
              </div>

              {lightboxIndex < gallery.length - 1 && (
                <button
                  onClick={() => { 
                    setLightboxIndex(lightboxIndex + 1); 
                    setZoomScale(1); 
                    setPanOffset({ x: 0, y: 0 }); 
                  }}
                  className="absolute right-4 z-10 w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Bottom info indicator */}
            <div className="text-center font-sans text-white/40 text-xs select-none">
              Photo {lightboxIndex + 1} of {gallery.length} · Double-touch to pan if zoomed
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
