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

            {/* 2. Wax seal – "Save the Date" reveal */}
            <WaxSealSection />

            {/* 3. Bride & groom profiles */}
            <CoupleSection />

            {/* 4. Countdown to wedding day */}
            <CountdownTimer />

            {/* 5. Full-screen event cards */}
            <EventCards />

            {/* 6. Venue & navigation */}
            <VenueSection />

            {/* 7. RSVP & blessings */}
            <RSVPForm />

            {/* Footer */}
            <footer
              className="relative overflow-hidden py-14 px-4 text-center"
              style={{ background: "linear-gradient(160deg, #1a0008 0%, #2d000e 50%, #1a0008 100%)" }}
            >
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-primary/40 to-transparent" />

              {/* Ornamental corner glyphs */}
              <div className="absolute top-4 left-6 text-gold-primary/10 font-calligraphy text-5xl select-none">❧</div>
              <div className="absolute top-4 right-6 text-gold-primary/10 font-calligraphy text-5xl select-none rotate-180">❧</div>

              <div className="relative z-10 max-w-sm mx-auto">
                <p
                  className="font-calligraphy text-4xl mb-1"
                  style={{
                    background: "linear-gradient(135deg, #fde68a, #fbbf24, #fff9c4, #d97706)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Sudeepthi ❤️ Nayanadeep
                </p>
                <p className="font-sans text-white/25 text-xs uppercase tracking-widest mt-2 mb-5">
                  16th August 2026 · KSC Convention, Mydukur
                </p>
                <div className="flex items-center justify-center gap-3 mb-5">
                  <div className="h-px w-10 bg-gold-primary/15" />
                  <span className="text-gold-primary/30 text-sm">✦</span>
                  <div className="h-px w-10 bg-gold-primary/15" />
                </div>
                <p className="font-serif italic text-white/20 text-xs mt-2 mb-2">
                  Made with ❤️ for a new beginning
                </p>
                <p className="font-sans font-bold text-white/40 text-xs tracking-widest mt-4">
                  తప్పక విచ్చేయగలరు,<br />
                  With best wishes,<br />
                  Sathvika Narayana
                </p>
              </div>

              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-primary/20 to-transparent" />
            </footer>
          </motion.div>
        </>
      )}
    </main>
  );
}
