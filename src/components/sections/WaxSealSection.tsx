"use client";

import { motion } from "framer-motion";

export function WaxSealSection() {
  return (
    <section className="py-24 px-6 max-w-xl mx-auto text-center" id="celebration">
      {/* Ornate section label */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="flex items-center justify-center gap-4 mb-8"
      >
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c8a84b]" />
        <h2 className="font-serif text-2xl md:text-3xl text-deep-maroon font-normal tracking-wide whitespace-nowrap">
          The Celebration
        </h2>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c8a84b]" />
      </motion.div>

      {/* Description text */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="font-ebgaramond text-lg md:text-xl leading-relaxed text-deep-maroon/90 italic"
      >
        With joyful hearts, Sudeepthi and Nayanadeep warmly invite you to celebrate their wedding
        as they begin a beautiful journey together. Join us on Sunday, August 16, 2026, in Mydukur,
        as family and friends gather in love, tradition, and celebration.
        <br />
        <br />
        Your presence will make this special day even more meaningful, and we look forward
        to sharing these cherished moments with you.
      </motion.p>
    </section>
  );
}
