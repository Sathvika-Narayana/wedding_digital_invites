"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

interface EventData {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  mapLink: string;
  image: string;
}

const events: EventData[] = [
  {
    id: "haldi",
    title: "Haldi Ceremony",
    date: "Friday, Aug 14, 2026",
    time: "06:00 AM",
    venue: "Khajipet, Kadapa",
    mapLink: "https://maps.app.goo.gl/8J1RKM4A9bJWD25K8",
    image: "/images/event_haldi_anime.jpeg",
  },
  {
    id: "pelli-kuthuru",
    title: "Pelli Kuthuru",
    date: "Friday, Aug 14, 2026",
    time: "10:00 AM",
    venue: "Khajipet, Kadapa",
    mapLink: "https://maps.app.goo.gl/8J1RKM4A9bJWD25K8",
    image: "/images/event_pellikuthuru_anime.jpeg",
  },
  {
    id: "welcome",
    title: "Welcome Party",
    date: "Saturday, Aug 15, 2026",
    time: "11:00 AM",
    venue: "KSC Convention, Mydukur",
    mapLink: "https://maps.app.goo.gl/8J1RKM4A9bJWD25K8",
    image: "/images/event_welcome_anime.jpeg",
  },
  {
    id: "reception",
    title: "Grand Reception",
    date: "Saturday, Aug 15, 2026",
    time: "07:00 PM",
    venue: "KSC Convention, Mydukur",
    mapLink: "https://maps.app.goo.gl/8J1RKM4A9bJWD25K8",
    image: "/images/event_reception_anime.jpeg",
  },
  {
    id: "muhurtham",
    title: "Muhurtham",
    date: "Sunday, Aug 16, 2026",
    time: "11:58 AM",
    venue: "KSC Convention, Mydukur",
    mapLink: "https://maps.app.goo.gl/8J1RKM4A9bJWD25K8",
    image: "/images/event_muhurtham_anime.jpeg",
  },
];

export function EventCards() {
  return (
    <section className="py-20 px-4" style={{ background: "#7a0e22" }} id="events">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-sans text-[#e8d49a]/60 text-xs uppercase tracking-[0.35em] mb-3">The Celebration Schedule</p>
          <h2 className="font-playfair text-3xl md:text-4xl text-[#e8d49a] font-normal">The Festivities</h2>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c8a84b]" />
            <span className="text-[#e8d49a] text-sm">✦</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c8a84b]" />
          </div>
        </motion.div>

        {/* Festivities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <FlipEventCard event={event} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FlipEventCard({ event }: { event: EventData }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="relative w-full h-[380px] select-none cursor-pointer"
      style={{ perspective: 1000 }}
      onClick={() => setIsFlipped(!isFlipped)}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Front Side */}
        <div 
          className="absolute inset-0 rounded-2xl overflow-hidden border border-[#c8a84b] flex flex-col"
          style={{ 
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            boxShadow: "0 12px 40px rgba(0,0,0,0.5)"
          }}
        >
          {/* Color image */}
          <div className="relative w-full h-[58%]">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className={`object-cover ${event.id !== 'welcome' ? 'object-top' : 'object-center'}`}
              sizes="320px"
            />
          </div>
          {/* Details Box */}
          <EventInfoBox event={event} />
        </div>

        {/* Back Side */}
        <div 
          className="absolute inset-0 rounded-2xl overflow-hidden border border-[#c8a84b] flex flex-col bg-[#f5edd8]"
          style={{ 
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.5)"
          }}
        >
          {/* Color image */}
          <div className="relative w-full h-[58%]">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className={`object-cover ${event.id !== 'welcome' ? 'object-top' : 'object-center'}`}
              sizes="320px"
            />
          </div>
          {/* Details Box */}
          <EventInfoBox event={event} />
        </div>
      </motion.div>
    </div>
  );
}

function EventInfoBox({ event }: { event: EventData }) {
  return (
    <div className="h-[42%] bg-[#f5edd8] px-4 py-4 flex flex-col justify-center text-center">
      <h3 className="mb-3 leading-tight" style={{ fontFamily: "'Cormorant Garamond', 'Libre Baskerville', serif", fontSize: "30px", fontWeight: 600, color: "#7A1F2B" }}>
        {event.title}
      </h3>
      
      {/* Detail grid (2 columns with separator line) */}
      <div className="relative grid grid-cols-2 gap-4 text-left">
        {/* Center vertical line */}
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-[#7a0e22]/20 to-transparent" />

        {/* Left: DateTime */}
        <div className="flex items-start gap-1.5 min-w-0">
          <div className="w-6 h-6 rounded-full border border-[#7a0e22] flex items-center justify-center text-[#7a0e22] shrink-0 mt-0.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
          </div>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: "15px", fontWeight: 500, letterSpacing: "0.8px", color: "#555" }}>
            {event.date} <br />
            {event.time}
          </div>
        </div>

        {/* Right: Venue & Navigation */}
        <div className="flex items-start gap-1.5 min-w-0 pl-2">
          <div className="w-6 h-6 rounded-full border border-[#7a0e22] flex items-center justify-center text-[#7a0e22] shrink-0 mt-0.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
              <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: "15px", fontWeight: 500, letterSpacing: "0.8px", color: "#555" }} className="break-words">
            <a 
              href={event.mapLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:underline text-[#7A1F2B]"
              onClick={(e) => e.stopPropagation()} // Stop flip trigger when maps is clicked
            >
              {event.venue.split(",")[0]} <br />
              <span className="opacity-85">{event.venue.split(",").slice(1).join(",")}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
