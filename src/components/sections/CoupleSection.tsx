"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Heart } from "lucide-react";

export function CoupleSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #fff9f5 0%, #fdebd0 50%, #fff9f5 100%)" }}
    >
      {/* Background ornamental text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span className="font-calligraphy text-[20rem] text-royal-pink/5 select-none whitespace-nowrap">Love</span>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-sans text-royal-pink/60 text-xs uppercase tracking-[0.35em] mb-3">The Couple</p>
          <h2 className="font-calligraphy text-5xl md:text-6xl text-deep-maroon mb-4">Two Hearts, One Soul</h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-royal-pink/40" />
            <Heart className="w-4 h-4 text-royal-pink fill-royal-pink" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-royal-pink/40" />
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          {/* Bride Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            {/* Photo frame */}
            <div className="relative mb-8">
              {/* Outer ring glow */}
              <motion.div
                className="absolute inset-[-8px] rounded-full opacity-30"
                style={{ background: "conic-gradient(#ffd700, #d6336c, #ffd700, #d6336c, #ffd700)" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
              {/* Frame border */}
              <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-full p-[3px]"
                style={{ background: "linear-gradient(135deg, #b8860b, #ffd700, #d6336c, #ffd700, #b8860b)" }}
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 relative">
                  <Image
                    src="/images/bride.JPG"
                    alt="Sudeepthi – The Bride"
                    fill
                    className="object-cover object-center hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
              {/* Heart badge */}
              <motion.div
                className="absolute -bottom-3 -right-3 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl border border-royal-pink/20"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Heart className="w-5 h-5 text-royal-pink fill-royal-pink" />
              </motion.div>
            </div>

            {/* Info card */}
            <div className="text-center w-full max-w-xs rounded-2xl p-6 border border-royal-pink/20 bg-white/60 backdrop-blur-md shadow-lg">
              <p className="font-sans text-xs text-royal-pink/60 uppercase tracking-[0.25em] mb-1">The Bride</p>
              <h3 className="font-calligraphy text-4xl text-deep-maroon mb-1">Sudeepthi</h3>
              <p className="font-serif text-sm text-gray-500 italic mb-3">Narayana</p>
              <div className="h-px w-12 mx-auto bg-gradient-to-r from-transparent via-gold-primary to-transparent mb-3" />
              <p className="font-sans text-sm text-gray-600">
                Daughter of<br />
                <span className="font-semibold text-deep-maroon">Mr. Sathyanarayana</span> &amp; <span className="font-semibold text-deep-maroon">Mrs. Lalitha</span>
              </p>
            </div>
          </motion.div>

          {/* Groom Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            {/* Photo frame */}
            <div className="relative mb-8">
              <motion.div
                className="absolute inset-[-8px] rounded-full opacity-30"
                style={{ background: "conic-gradient(#ffd700, #1e40af, #ffd700, #1e40af, #ffd700)" }}
                animate={{ rotate: -360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
              <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-full p-[3px]"
                style={{ background: "linear-gradient(135deg, #b8860b, #ffd700, #1e40af, #ffd700, #b8860b)" }}
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 relative">
                  <Image
                    src="/images/groom.JPG"
                    alt="Nayanadeep – The Groom"
                    fill
                    className="object-cover object-center hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
              <motion.div
                className="absolute -bottom-3 -left-3 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl border border-gold-primary/20"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              >
                <Heart className="w-5 h-5 text-gold-dark fill-gold-dark" />
              </motion.div>
            </div>

            {/* Info card */}
            <div className="text-center w-full max-w-xs rounded-2xl p-6 border border-gold-primary/20 bg-white/60 backdrop-blur-md shadow-lg">
              <p className="font-sans text-xs text-gold-dark/70 uppercase tracking-[0.25em] mb-1">The Groom</p>
              <h3 className="font-calligraphy text-4xl text-deep-maroon mb-1">Nayanadeep</h3>
              <p className="font-serif text-sm text-gray-500 italic mb-3">Vankadari</p>
              <div className="h-px w-12 mx-auto bg-gradient-to-r from-transparent via-gold-primary to-transparent mb-3" />
              <p className="font-sans text-sm text-gray-600">
                Son of<br />
                <span className="font-semibold text-deep-maroon">Mr. Amarnath</span> &amp; <span className="font-semibold text-deep-maroon">Mrs. Manjula</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
