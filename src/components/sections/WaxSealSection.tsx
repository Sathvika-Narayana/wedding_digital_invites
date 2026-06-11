"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

function ConfettiShower() {
  const [particles, setParticles] = useState<{ id: number; left: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: Math.random() * 2 + 2,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-[-5%] w-3 h-3 rounded-full"
          style={{
            left: `${p.left}%`,
            background: p.id % 2 === 0 ? "#ffd700" : "#d6336c",
            boxShadow: "0 0 6px rgba(255,215,0,0.6)",
          }}
          initial={{ y: "-10vh", opacity: 1, rotate: 0 }}
          animate={{ y: "110vh", opacity: 0, rotate: 360 }}
          transition={{ duration: p.duration, delay: p.delay, ease: "linear" }}
        />
      ))}
    </div>
  );
}

export function WaxSealSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    // Wait for envelope to open before showing full content
    setTimeout(() => setShowContent(true), 1200);
  };

  return (
    <section
      className="py-24 px-4 relative overflow-hidden flex flex-col items-center justify-center min-h-[80vh]"
      style={{ background: "linear-gradient(160deg, #fdf7f0 0%, #fdebd0 50%, #fdf7f0 100%)" }}
    >
      {/* Background ornaments with safe opacity styles */}
      <div className="absolute top-8 left-8 text-[140px] font-calligraphy pointer-events-none select-none leading-none" style={{ color: "rgba(245, 158, 11, 0.08)" }}>✦</div>
      <div className="absolute bottom-8 right-8 text-[140px] font-calligraphy pointer-events-none select-none leading-none" style={{ color: "rgba(245, 158, 11, 0.08)" }}>✦</div>

      {showContent && <ConfettiShower />}

      {/* Header (fades out when opened) */}
      <AnimatePresence>
        {!showContent && (
          <motion.div
            className="absolute top-12 left-0 right-0 text-center z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isOpen ? 0 : 1, y: isOpen ? -20 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-sans text-royal-pink/60 uppercase tracking-[0.3em] text-xs mb-3">An Auspicious Date</p>
            <h2 className="font-calligraphy text-5xl md:text-6xl text-deep-maroon mb-4">Save the Date</h2>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-primary" />
              <span className="text-gold-primary text-xl">❧</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-primary" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full max-w-md mx-auto mt-20 perspective-1000 h-[380px] sm:h-[480px]">
        
        {/* THE INVITATION CARD (Initially hidden inside envelope, then slides up) */}
        <motion.div
          className="absolute left-4 right-4 z-10 p-1 rounded-2xl"
          style={{
            background: "linear-gradient(135deg, #b8860b, #ffd700, #fffacd, #ffd700, #b8860b)",
            bottom: "10%",
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={isOpen ? { y: -140, opacity: 1, zIndex: 40 } : { y: 0, opacity: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
        >
          <div
            className="rounded-xl relative overflow-hidden"
            style={{ background: "linear-gradient(160deg, #fff9f0 0%, #fdebd0 100%)", minHeight: 280 }}
          >
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(0deg, #4a0404, #4a0404 1px, transparent 1px, transparent 28px)" }} />
            
            <div className="flex flex-col items-center justify-center p-8 text-center h-full min-h-[280px]">
              <p className="font-sans text-xs uppercase tracking-[0.25em] text-royal-pink/60 mb-2">Wedding Day</p>
              <h3 className="font-calligraphy text-5xl text-deep-maroon mb-1">16th August</h3>
              <p className="font-serif text-2xl text-gold-dark font-bold mb-3">2026</p>
              <div className="h-px w-16 mx-auto bg-gradient-to-r from-transparent via-gold-primary to-transparent mb-3" />
              <p className="font-sans text-xs text-gray-500 tracking-widest uppercase mb-1">Muhurtham · 11:00 AM</p>
              <p className="font-serif italic text-royal-pink/80 text-xs">KSC Convention, Mydukur</p>
            </div>
          </div>
        </motion.div>

        {/* THE ENVELOPE (Stays visible as a beautiful background element) */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 aspect-[4/3] rounded-lg shadow-2xl cursor-pointer"
          style={{ background: "#8b0000" }} // Dark red base envelope back
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={handleOpen}
        >
          {/* Envelope inner texture */}
          <div className="absolute inset-0 rounded-lg opacity-20" style={{ background: "repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 8px)" }} />
          
          {/* Left Flap */}
          <div
            className="absolute top-0 bottom-0 left-0 w-1/2 z-20"
            style={{
              clipPath: "polygon(0 0, 100% 50%, 0 100%)",
              background: "linear-gradient(to right, #9b111e, #7a0a18)",
              filter: "drop-shadow(2px 0 4px rgba(0,0,0,0.4))",
            }}
          />
          
          {/* Right Flap */}
          <div
            className="absolute top-0 bottom-0 right-0 w-1/2 z-20"
            style={{
              clipPath: "polygon(100% 0, 0 50%, 100% 100%)",
              background: "linear-gradient(to left, #9b111e, #7a0a18)",
              filter: "drop-shadow(-2px 0 4px rgba(0,0,0,0.4))",
            }}
          />
          
          {/* Bottom Flap */}
          <div
            className="absolute bottom-0 left-0 right-0 h-2/3 z-30"
            style={{
              clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
              background: "linear-gradient(to top, #7a0a18, #9b111e)",
              filter: "drop-shadow(0 -2px 6px rgba(0,0,0,0.5))",
            }}
          />

          {/* Top Flap (Opens) */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-[65%] z-50 origin-top"
            style={{
              clipPath: "polygon(0 0, 50% 100%, 100% 0)",
              background: "linear-gradient(to bottom, #a51c30, #8b0000)",
            }}
            initial={{ rotateX: 0 }}
            animate={isOpen ? { rotateX: 180, zIndex: 0 } : { rotateX: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {/* Wax Seal on the tip of the top flap */}
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
              style={{
                background: "radial-gradient(circle at 35% 35%, #ffd700, #b8860b, #8b6508)",
                border: "2px solid rgba(255,255,255,0.2)",
              }}
              animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <p className="font-calligraphy text-white text-xl drop-shadow-md">S&N</p>
            </motion.div>
          </motion.div>

          {/* Tap to open text */}
          {!isOpen && (
            <motion.p
              className="absolute -bottom-10 left-0 right-0 text-center font-serif italic text-deep-maroon/50 text-sm tracking-widest"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✦ Tap to Open ✦
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Celebration message that appears after reveal */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-8 absolute bottom-4"
          >
            <p className="font-calligraphy text-3xl text-royal-pink mb-2">We can&apos;t wait to see you!</p>
            <p className="text-2xl tracking-widest">✨ 🌸 ✨</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
