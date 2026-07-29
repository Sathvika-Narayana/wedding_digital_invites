"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface MediaItem {
  id: string;
  url: string;
  category: string;
  uploader: string;
  type: string;
}

const fallbackMedia: MediaItem[] = [
  { id: "m1", url: "/images/event_pellikuthuru_anime.jpeg", category: "Pelli Kuthuru", uploader: "Sathvika", type: "image" },
  { id: "m2", url: "/images/event_haldi_anime.jpeg", category: "Haldi", uploader: "Nayan", type: "image" },
  { id: "m3", url: "/images/event_reception_anime.jpeg", category: "Reception", uploader: "Sudeepthi", type: "image" },
  { id: "m4", url: "/images/event_muhurtham_anime.jpeg", category: "Wedding", uploader: "Family", type: "image" },
  { id: "m5", url: "/images/event_welcome_anime.jpeg", category: "Family Moments", uploader: "Friend", type: "image" },
];

export function PhotoWall() {
  const [items, setItems] = useState<MediaItem[]>([]);

  useEffect(() => {
    async function loadApproved() {
      try {
        const res = await fetch("/api/gallery");
        if (res.ok) {
          const data = await res.json();
          if (data.gallery && data.gallery.length > 0) {
            setItems(data.gallery);
          } else {
            setItems(fallbackMedia);
          }
        } else {
          setItems(fallbackMedia);
        }
      } catch (err) {
        setItems(fallbackMedia);
      }
    }
    loadApproved();

    // Poll every 10 seconds to auto-update new uploads
    const interval = setInterval(loadApproved, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 px-4 overflow-hidden relative" 
      style={{ background: "linear-gradient(180deg, #120005 0%, #1c0008 100%)" }}
    >
      {/* Gold overlay/accents */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-primary/30 to-transparent" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-sans text-gold-light/60 text-xs uppercase tracking-[0.35em] mb-3">Captured Moments</p>
          <h2 className="font-calligraphy text-5xl md:text-6xl text-white mb-4">Our Photo Wall</h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-primary/40" />
            <span className="text-gold-primary text-lg">✦</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-primary/40" />
          </div>
        </div>

        {/* Floating cards container */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 min-h-[400px] items-center justify-center">
          {items.slice(0, 10).map((item, idx) => {
            // Random sways and floats
            const floatY = [0, -12 - (idx % 3) * 6, 0];
            const floatRotate = [0 + (idx % 2 === 0 ? 2 : -2), (idx % 2 === 0 ? -2 : 2), 0 + (idx % 2 === 0 ? 2 : -2)];
            const floatDuration = 6 + (idx % 4) * 2;
            const floatDelay = idx * 0.4;

            return (
              <motion.div
                key={item.id}
                className="relative bg-white p-3 pb-8 rounded-xl shadow-2xl flex flex-col justify-between border border-gold-primary/10 hover:border-gold-primary hover:z-20 transition-all duration-300"
                style={{
                  filter: "drop-shadow(0 15px 12px rgba(0,0,0,0.5))",
                }}
                animate={{
                  y: floatY,
                  rotate: floatRotate,
                }}
                transition={{
                  duration: floatDuration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: floatDelay,
                }}
                whileHover={{ scale: 1.05, y: -20, rotate: 0 }}
              >
                {/* Gold thumbtack top-center */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-gradient-to-tr from-gold-dark via-gold-light to-yellow-100 rounded-full border border-black/30 shadow-md z-10" />

                {/* Photo container */}
                <div className="relative aspect-square w-full rounded overflow-hidden bg-gray-950">
                  {item.type === "video" ? (
                    <video
                      src={item.url}
                      className="object-cover w-full h-full"
                      muted
                      loop
                      playsInline
                      autoPlay
                    />
                  ) : (
                    <Image
                      src={item.url}
                      alt={`Captured by ${item.uploader}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 150px, 200px"
                    />
                  )}
                </div>

                {/* Caption / Polaroid look */}
                <div className="mt-3 text-center">
                  <p className="font-calligraphy text-lg text-deep-maroon leading-none">
                    {item.category}
                  </p>
                  <p className="font-sans text-[8px] text-gray-400 uppercase tracking-widest mt-1">
                    By {item.uploader}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
