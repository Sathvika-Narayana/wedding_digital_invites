"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface EventData {
  id: string;
  title: string;
  telugu?: string;
  date: string;
  time: string;
  caption: string;
  image: string;
  accentFrom: string;
  accentTo: string;
  overlayFrom: string;
  overlayTo: string;
  icon: string;
}

const events: EventData[] = [
  {
    id: "haldi",
    title: "Haldi",
    telugu: "పసుపు",
    date: "14th August 2026",
    time: "6:00 AM",
    caption: "Golden turmeric, golden memories",
    image: "/images/event_haldi.jpeg",
    accentFrom: "#ca8a04",
    accentTo: "#fbbf24",
    overlayFrom: "rgba(60,35,0,0.5)",
    overlayTo: "rgba(20,12,0,0.92)",
    icon: "🌼",
  },
  {
    id: "pelli-kuthuru",
    title: "Pelli Kuthuru",
    telugu: "పెళ్ళి కూతురు",
    date: "14th August 2026",
    time: "10:00 AM",
    caption: "Where every daughter becomes a bride",
    image: "/images/event_pellkuthuru.jpeg",
    accentFrom: "#d6336c",
    accentTo: "#f06595",
    overlayFrom: "rgba(90,0,30,0.55)",
    overlayTo: "rgba(20,0,8,0.92)",
    icon: "🌸",
  },
  {
    id: "welcome",
    title: "Welcome",
    telugu: "స్వాగతం",
    date: "15th August 2026",
    time: "3:00 PM",
    caption: "A grand welcome to our joyous occasion",
    image: "/images/event_welcome.jpeg",
    accentFrom: "#db2777",
    accentTo: "#ec4899",
    overlayFrom: "rgba(50,5,30,0.5)",
    overlayTo: "rgba(20,0,10,0.92)",
    icon: "🙏",
  },
  {
    id: "reception",
    title: "Reception",
    telugu: "రిసెప్షన్",
    date: "15th August 2026",
    time: "7:00 PM",
    caption: "An evening of joy, glitter & grace",
    image: "/images/event_reception.jpeg",
    accentFrom: "#7c3aed",
    accentTo: "#a855f7",
    overlayFrom: "rgba(20,5,50,0.5)",
    overlayTo: "rgba(10,0,20,0.92)",
    icon: "✨",
  },
  {
    id: "muhurtham",
    title: "Wedding Muhurtham",
    telugu: "వివాహ ముహూర్తం",
    date: "16th August 2026",
    time: "11:00 AM",
    caption: "Two souls, one eternal bond",
    image: "/images/event_muhurtham.jpeg",
    accentFrom: "#b8860b",
    accentTo: "#ffd700",
    overlayFrom: "rgba(40,15,0,0.5)",
    overlayTo: "rgba(26,0,8,0.93)",
    icon: "🔥",
  },
];

export function EventCards() {
  return (
    <section className="relative" id="events">
      {/* Section header */}
      <div
        className="py-16 px-4 text-center relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #fdf7f0 0%, #fdebd0 100%)" }}
      >
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-primary/40 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="font-sans text-royal-pink/60 text-xs uppercase tracking-[0.35em] mb-3">Mark Your Calendar</p>
          <h2 className="font-calligraphy text-5xl md:text-6xl text-deep-maroon mb-4">Wedding Events</h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold-primary/50" />
            <span className="text-gold-primary text-xl">✦</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold-primary/50" />
          </div>
          <p className="font-serif italic text-gray-400 text-sm mt-4">Scroll to explore each celebration</p>
        </motion.div>
      </div>

      {/* Full-screen event cards */}
      {events.map((event, index) => (
        <EventCard key={event.id} event={event} index={index} />
      ))}
    </section>
  );
}

function EventCard({ event, index }: { event: EventData; index: number }) {
  return (
    <motion.div
      className="relative flex items-end justify-center overflow-hidden"
      style={{ minHeight: "100svh" }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true, margin: "-60px" }}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority={index === 0}
        />
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, ${event.overlayFrom} 0%, rgba(0,0,0,0) 40%, ${event.overlayTo} 75%, ${event.overlayTo} 100%)`,
        }}
      />

      {/* Side vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* Top corner event number */}
      <div className="absolute top-6 left-6 z-10">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-sans font-bold text-sm border border-white/20"
          style={{ background: `linear-gradient(135deg, ${event.accentFrom}, ${event.accentTo})` }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>

      {/* Event icon top-right */}
      <motion.div
        className="absolute top-6 right-6 z-10 text-3xl"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
      >
        {event.icon}
      </motion.div>

      {/* Content card at bottom */}
      <motion.div
        className="relative z-10 w-full max-w-lg mx-auto px-5 pb-10 pt-6"
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true, margin: "-60px" }}
      >
        {/* Glass card */}
        <div
          className="rounded-3xl p-6 md:p-8"
          style={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
          }}
        >
          {/* Telugu subtitle */}
          {event.telugu && (
            <p className="font-sans text-white/40 text-xs tracking-widest mb-2 text-center">{event.telugu}</p>
          )}

          {/* Gold divider */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div
              className="h-px flex-1"
              style={{ background: `linear-gradient(to right, transparent, ${event.accentTo})` }}
            />
            <span style={{ color: event.accentTo }} className="text-sm">✦</span>
            <div
              className="h-px flex-1"
              style={{ background: `linear-gradient(to left, transparent, ${event.accentTo})` }}
            />
          </div>

          {/* Title */}
          <h3
            className="font-calligraphy text-center mb-3 drop-shadow-lg leading-tight"
            style={{
              fontSize: "clamp(2rem, 8vw, 3rem)",
              background: `linear-gradient(135deg, #fde68a, ${event.accentTo}, #fff9c4)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {event.title}
          </h3>

          {/* Date & Time */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
            <div className="flex items-center gap-2 text-white/75 font-sans text-sm">
              <span style={{ color: event.accentTo }}>📅</span>
              <span>{event.date}</span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-white/20" />
            <div className="flex items-center gap-2 text-white/75 font-sans text-sm">
              <span style={{ color: event.accentTo }}>🕐</span>
              <span>{event.time}</span>
            </div>
          </div>

          {/* Bottom divider */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div
              className="h-px flex-1"
              style={{ background: `linear-gradient(to right, transparent, ${event.accentFrom}60)` }}
            />
            <span className="text-white/20 text-xs">❧</span>
            <div
              className="h-px flex-1"
              style={{ background: `linear-gradient(to left, transparent, ${event.accentFrom}60)` }}
            />
          </div>

          {/* Caption */}
          <p className="font-serif italic text-white/60 text-center text-sm leading-relaxed">
            &ldquo;{event.caption}&rdquo;
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
