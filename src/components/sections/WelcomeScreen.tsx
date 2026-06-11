"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function WelcomeScreen() {
  return (
    <section className="relative overflow-hidden" style={{ background: "linear-gradient(160deg, #1a0008 0%, #2d000e 60%, #1a0008 100%)" }}>
      {/* ── COUPLE PHOTO HERO ── */}
      <div className="relative w-full aspect-[3/4] sm:h-[80vh] sm:aspect-auto overflow-hidden">
        <Image
          src="/images/couple.JPG"
          alt="Sudeepthi and Nayanadeep"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Bottom gradient scrim for text */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(26,0,8,0.1) 0%, rgba(26,0,8,0.0) 40%, rgba(26,0,8,0.6) 70%, rgba(26,0,8,0.98) 100%)",
          }}
        />
        {/* Side vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, transparent 50%, rgba(26,0,8,0.5) 100%)",
          }}
        />

        {/* Names OVER the photo */}
        <div className="absolute bottom-0 left-0 right-0 pb-10 px-6 flex flex-col items-center text-center">
          {/* Gold divider */}
          <motion.div
            className="flex items-center gap-3 mb-4"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <div className="h-px w-14 bg-gradient-to-r from-transparent to-yellow-400/70" />
            <span className="text-yellow-400 text-base">✦</span>
            <div className="h-px w-14 bg-gradient-to-l from-transparent to-yellow-400/70" />
          </motion.div>

          <motion.h2
            className="font-sans font-bold text-yellow-400 text-sm tracking-widest mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.1 }}
            viewport={{ once: true }}
          >
            శ్రీరస్తు శుభమస్తు
          </motion.h2>

          <motion.p
            className="font-sans text-yellow-300/70 text-[10px] uppercase tracking-[0.35em] mb-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Together with their families
          </motion.p>

          {/* Names */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h1
              className="font-calligraphy leading-tight drop-shadow-2xl text-center"
              style={{
                fontSize: "clamp(2.2rem, 9vw, 4rem)",
                background: "linear-gradient(135deg, #fde68a 0%, #fbbf24 40%, #fff9c4 60%, #d97706 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "none",
                filter: "drop-shadow(0 2px 12px rgba(251,191,36,0.4))",
              }}
            >
              Sudeepthi ❤️ Nayanadeep
            </h1>
          </motion.div>

          {/* Bottom divider */}
          <motion.div
            className="flex items-center gap-3 mt-4"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-yellow-400/50" />
            <span className="text-yellow-400/60 text-sm">❧</span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-yellow-400/50" />
          </motion.div>
        </div>
      </div>

      {/* ── LOWER WELCOME CONTENT ── */}
      <div
        className="relative z-10 px-6 pb-20 pt-8 text-center max-w-2xl mx-auto"
        style={{ background: "linear-gradient(to bottom, #1a0008, #2d000e)" }}
      >
        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="font-serif text-base md:text-lg text-white/60 max-w-md mx-auto leading-relaxed italic mb-10"
        >
          &ldquo;Two souls, one destiny — embarking on a journey of love, laughter, and forever.&rdquo;
        </motion.p>

        {/* Families */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-4 max-w-sm mx-auto"
        >
          {[
            { role: "Bride's Family", name: "Narayana Family" },
            { role: "Groom's Family", name: "Vankadari Family" },
          ].map((f) => (
            <div
              key={f.role}
              className="text-center p-4 rounded-xl border border-yellow-400/15"
              style={{ background: "rgba(255,215,0,0.04)" }}
            >
              <p className="font-sans text-[10px] text-yellow-400/50 uppercase tracking-widest mb-1">{f.role}</p>
              <p className="font-serif text-sm text-white/60 italic">{f.name}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
