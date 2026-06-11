"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation, Building2 } from "lucide-react";

export function VenueSection() {
  const mapLink = "https://maps.app.goo.gl/8J1RKM4A9bJWD25K8";

  return (
    <section className="py-24 px-4 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #2d0a14 0%, #4a0404 60%, #2d0a14 100%)" }}
    >
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, #ffd700 0, #ffd700 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #ffd700 0, #ffd700 1px, transparent 1px, transparent 60px)" }}
      />

      {/* Top border accent */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-primary/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-primary/50 to-transparent" />

      <div className="max-w-2xl mx-auto relative z-10 text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="font-sans text-gold-primary/50 text-xs uppercase tracking-[0.35em] mb-3">Where to Find Us</p>
          <h2 className="font-calligraphy text-5xl md:text-6xl text-gold-primary mb-4">Venue</h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold-primary/40" />
            <span className="text-gold-primary/50">✦</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold-primary/40" />
          </div>
        </motion.div>

        {/* Venue card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {/* Gold frame */}
          <div className="p-px rounded-3xl"
            style={{ background: "linear-gradient(135deg, #b8860b, #ffd700, #fffacd, #ffd700, #b8860b)" }}
          >
            <div className="rounded-3xl p-8 md:p-12"
              style={{ background: "linear-gradient(160deg, #3d0a18, #5c0808)" }}
            >
              {/* Icon */}
              <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6 border border-gold-primary/30"
                style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(214,51,108,0.1))" }}
              >
                <Building2 className="w-8 h-8 text-gold-primary" />
              </div>

              {/* Dates */}
              <p className="font-sans text-gold-primary/60 text-xs uppercase tracking-[0.3em] mb-3">August 15th &amp; 16th, 2026</p>

              {/* Venue name */}
              <h3 className="font-calligraphy text-4xl md:text-5xl text-white mb-2">KSC Convention</h3>
              <p className="font-sans text-white/50 text-sm mb-8">Mydukur, Kadapa, Andhra Pradesh</p>

              {/* Divider */}
              <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-gold-primary/40 to-transparent mb-8" />

              {/* Map pin info */}
              <p className="flex items-center justify-center gap-2 text-white/50 font-sans text-xs mb-8">
                <MapPin className="w-3.5 h-3.5 text-gold-primary" />
                Click below to open navigation
              </p>

              {/* CTA Button */}
              <a
                href={mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-sans font-semibold text-deep-maroon uppercase tracking-widest text-sm shadow-xl hover:shadow-gold-primary/20 transition-all duration-300 hover:scale-105"
                style={{ background: "linear-gradient(135deg, #ffd700, #fbbf24, #ffd700)" }}
              >
                <Navigation className="w-4 h-4" />
                Get Directions
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
