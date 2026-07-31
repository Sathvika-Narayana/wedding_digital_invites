"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OpeningScene } from "@/components/sections/OpeningScene";
import { WelcomeScreen } from "@/components/sections/WelcomeScreen";
import { WaxSealSection } from "@/components/sections/WaxSealSection";
import { CoupleSection } from "@/components/sections/CoupleSection";
import { CountdownTimer } from "@/components/sections/CountdownTimer";
import { EventCards } from "@/components/sections/EventCards";
import { VenueSection } from "@/components/sections/VenueSection";


import Link from "next/link";
import { RSVPForm } from "@/components/sections/RSVPForm";
import { FloatingJasmine } from "@/components/effects/FloatingJasmine";
import { GoldenSparkles } from "@/components/effects/GoldenSparkles";
import { Fireflies } from "@/components/effects/Fireflies";
import { FallingPetals } from "@/components/effects/FallingPetals";

export default function Home() {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <main className="min-h-screen relative selection:bg-royal-pink/30 selection:text-deep-maroon">
      {/* ── Opening curtain scene ── */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            key="opening"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <OpeningScene onOpen={() => setIsOpened(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main invitation content ── */}
      {isOpened && (
        <>
          {/* Global ambient effects */}
          <FloatingJasmine />
          <GoldenSparkles density={0.00003} />
          <Fireflies count={12} />
          <FallingPetals />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            {/* 1. Hero – couple photo + names */}
            <WelcomeScreen />
            
            <div className="strip" />

            {/* 2. Celebration description */}
            <WaxSealSection />

            <div className="strip" />

            {/* 3. Bride & groom profiles */}
            <CoupleSection />

            <div className="strip" />

            {/* 4. Countdown to wedding day */}
            <CountdownTimer />

            <div className="strip" />

            {/* 5. Event cards (Festivities) */}
            <EventCards />

            <div className="strip" />

            {/* 6. Venue & navigation */}
            <VenueSection />

            <div className="strip" />



            {/* 9. Media upload & filters - Wedding Gallery link */}
            <section className="py-24 px-4 text-center relative" style={{ background: "linear-gradient(160deg, #1c0008 0%, #120005 50%, #1c0008 100%)" }}>
               <div className="max-w-2xl mx-auto">
                 <h2 className="font-calligraphy text-4xl md:text-5xl text-gold-light mb-6">Capture the Magic</h2>
                 <p className="font-serif text-white/70 mb-10">We would love to see our special day through your eyes. View the moments captured by our loved ones and add your own.</p>
                 <Link href="/gallery" className="inline-flex items-center justify-center px-8 py-3 rounded-full font-sans font-bold uppercase tracking-widest transition-all bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg hover:scale-105">
                   View & Add Memories
                 </Link>
               </div>
            </section>

            <div className="strip" />

            {/* 10. RSVP & blessings */}
            <RSVPForm />

            <div className="strip" />

            {/* Footer */}
            <footer className="bg-[#0d0508] text-center py-14 px-4 relative">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#c8a84b]/30 to-transparent" />
              <div className="font-playfair text-xl md:text-2xl text-[#c8a84b] mb-2 font-normal">
                Sudeepthi ♡ Nayanadeep
              </div>
              <p className="font-cormorant italic text-[#f5edd8]/60 text-sm">
                August 16, 2026 · Mydukur
              </p>
              <br />
              <p className="font-cormorant italic text-[#f5edd8]/35 text-xs">
                With love & joy · #SudeepthiNayan2026
              </p>
            </footer>
          </motion.div>
        </>
      )}
    </main>
  );
}
