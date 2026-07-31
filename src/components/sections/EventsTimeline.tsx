"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Droplet, Music } from "lucide-react";

interface Event {
  title: string;
  date: string;
  time: string;
  dressCode?: string;
  icon: React.ElementType;
  accent: string;
  bg: string;
}

const events: Event[] = [
  {
    title: "Haldi",
    date: "14th August 2026",
    time: "6:00 AM",
    dressCode: "Blue Color",
    icon: Droplet,
    accent: "#ca8a04",
    bg: "rgba(254,249,195,0.6)",
  },
  {
    title: "Pellikuthuru",
    date: "14th August 2026",
    time: "10:00 AM",
    icon: Calendar,
    accent: "#1d4ed8",
    bg: "rgba(219,234,254,0.6)",
  },
  {
    title: "Welcome Party",
    date: "15th August 2026",
    time: "3:00 PM",
    icon: Music,
    accent: "#7c3aed",
    bg: "rgba(237,233,254,0.6)",
  },
  {
    title: "Reception",
    date: "15th August 2026",
    time: "7:00 PM",
    icon: Music,
    accent: "#059669",
    bg: "rgba(209,250,229,0.6)",
  },
  {
    title: "Muhurtham",
    date: "16th August 2026",
    time: "11:00 AM",
    icon: Calendar,
    accent: "#d6336c",
    bg: "rgba(252,231,243,0.6)",
  },
];

export function EventsTimeline() {
  return (
    <section className="py-24 px-4 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #fdf7f0 0%, #fdebd0 50%, #fdf7f0 100%)" }}
    >
      {/* Decorative ornament */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 h-1 w-32 bg-gradient-to-r from-transparent via-gold-primary to-transparent" />

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-sans text-royal-pink/60 text-xs uppercase tracking-[0.35em] mb-3">Mark Your Calendar</p>
          <h2 className="font-calligraphy text-5xl md:text-6xl text-deep-maroon mb-4">Wedding Events</h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold-primary/50" />
            <span className="text-gold-primary">✦</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold-primary/50" />
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px"
            style={{ background: "linear-gradient(to bottom, transparent, #f59e0b 10%, #f59e0b 90%, transparent)" }}
          />

          <div className="space-y-8">
            {events.map((event, index) => {
              const Icon = event.icon;
              return (
                <motion.div
                  key={event.title}
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  className="relative pl-16"
                >
                  {/* Timeline node */}
                  <div className="absolute left-0 top-5 w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                    style={{ background: event.accent }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  {/* Card */}
                  <div className="rounded-2xl p-5 md:p-6 border border-white/80 shadow-md hover:shadow-xl transition-shadow duration-300 backdrop-blur-sm"
                    style={{ background: event.bg, borderLeft: `3px solid ${event.accent}` }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="mb-2" style={{ fontFamily: "'Cormorant Garamond', 'Libre Baskerville', serif", fontSize: "30px", fontWeight: 600, color: "#7A1F2B" }}>{event.title}</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1" style={{ fontFamily: "'Cinzel', serif", fontSize: "15px", fontWeight: 500, letterSpacing: "0.8px", color: "#555" }}>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" style={{ color: event.accent }} />
                            {event.date}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" style={{ color: event.accent }} />
                            {event.time}
                          </span>
                        </div>
                      </div>

                      {event.dressCode && (
                        <div className="shrink-0 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border"
                          style={{ borderColor: event.accent, color: event.accent, background: "white" }}
                        >
                          👗 {event.dressCode}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
