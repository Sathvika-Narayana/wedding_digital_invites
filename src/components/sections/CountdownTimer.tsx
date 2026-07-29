"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function CountdownTimer() {
  const targetDate = new Date("2026-08-16T11:00:00").getTime();

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = targetDate - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <section className="py-24 px-4 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #2d0a14 0%, #4a0404 50%, #2d0a14 100%)" }}
    >
      {/* Background shine effect */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "repeating-linear-gradient(45deg, #ffd700 0px, #ffd700 1px, transparent 1px, transparent 60px)" }}
      />

      {/* Glow orbs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-10"
        style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }} />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-10"
        style={{ background: "radial-gradient(circle, #d6336c, transparent)" }} />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <p className="font-sans text-gold-primary/60 text-xs uppercase tracking-[0.35em] mb-3">Until We Say</p>
          <h2 className="font-calligraphy text-5xl md:text-6xl text-gold-primary mb-4">I Do</h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold-primary/50" />
            <span className="text-gold-primary/50 text-lg">✦</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold-primary/50" />
          </div>
        </motion.div>

        {/* Countdown boxes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {units.map(({ label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              {/* Outer gold border */}
              <div className="absolute inset-0 rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity"
                style={{ background: "linear-gradient(135deg, #b8860b, #ffd700, #b8860b)", padding: "1px" }}
              >
                <div className="w-full h-full rounded-2xl" style={{ background: "#2d0a14" }} />
              </div>

              <div className="relative rounded-2xl py-8 px-4 text-center border border-gold-primary/20"
                style={{ background: "linear-gradient(135deg, rgba(255,215,0,0.05), rgba(214,51,108,0.05))" }}
              >
                {/* Value */}
                <motion.span
                  key={value}
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="block font-serif text-5xl md:text-6xl font-bold leading-none mb-2"
                  style={{
                    background: "linear-gradient(135deg, #fbbf24, #fffacd, #fbbf24)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}
                >
                  {String(value).padStart(2, "0")}
                </motion.span>

                {/* Divider */}
                <div className="h-px w-8 mx-auto bg-gold-primary/30 mb-2" />

                {/* Label */}
                <span className="font-sans text-gold-primary/60 text-xs uppercase tracking-[0.2em]">
                  {label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Date reminder */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-10 font-serif text-white/40 italic text-sm"
        >
          16th August 2026 · 11:00 AM Muhurtham · KSC Convention, Mydukur
        </motion.p>
      </div>
    </section>
  );
}
