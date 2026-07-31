import Image from "next/image";

export function WelcomeScreen() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-16 px-4" 
      style={{ background: "#7a0e22" }}
    >
      {/* Background radial gradient glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{ background: "radial-gradient(ellipse at center, rgba(200,168,75,0.2) 0%, transparent 70%)" }}
      />

      {/* Ornate glass panel container */}
      <div className="relative z-10 w-full max-w-[420px] flex flex-col items-center py-8 px-6 border border-[#e8d49a]/30 rounded-[28px] shadow-2xl"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 100%), linear-gradient(180deg, rgba(142,18,38,0.28) 0%, rgba(84,8,20,0.18) 100%)",
          boxShadow: "inset 0 0 0 1px rgba(200,168,75,0.14), 0 22px 60px rgba(0,0,0,0.4)"
        }}
      >
        {/* Inner border trim */}
        <div className="absolute inset-[12px] border border-[#e8d49a]/10 rounded-[22px] pointer-events-none" />
        
        {/* Bottom traditional greeting */}
        <div className="relative text-center mb-6">
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#e8d49a]/50" />
            <span className="text-[#e8d49a] text-xs font-semibold tracking-widest font-sans uppercase">శ్రీరస్తు శుభమస్తు</span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#e8d49a]/50" />
          </div>
          <p className="text-[#e8d49a]/70 font-sans text-[8px] uppercase tracking-[0.25em] mt-1">Together with their families</p>
        </div>

        {/* Static Couple Image Card */}
        <div 
          className="relative w-60 h-[320px] mb-6 select-none rounded-2xl overflow-hidden border-2 border-[#c8a84b] shadow-2xl"
          style={{ 
            boxShadow: "0 0 30px rgba(200,168,75,0.25), 0 15px 35px rgba(0,0,0,0.5)"
          }}
        >
          <Image
            src="/images/couple.JPG"
            alt="Sudeepthi & Nayanadeep"
            fill
            priority
            quality={95}
            className="object-cover object-center"
            sizes="240px"
          />
        </div>

        {/* Names Section */}
        <div className="text-center font-calligraphy select-none leading-none mb-6">
          <div className="text-[#e8d49a] text-5xl md:text-6xl font-normal tracking-wide">Sudeepthi</div>
          <div className="text-[#c8a84b] italic text-2xl my-2">weds</div>
          <div className="text-[#e8d49a] text-5xl md:text-6xl font-normal tracking-wide">Nayanadeep</div>
        </div>

        {/* Action Button & Details Grid */}
        <div className="w-full text-center flex flex-col items-center">
          {/* Decorative Divider */}
          <div className="relative w-40 h-[12px] mb-4">
            <div className="absolute top-1/2 left-0 w-full h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-[#c8a84b]/40 to-transparent" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 text-[#e8d49a] text-[10px] bg-[#540814]">✦</span>
          </div>

          <a 
            href="#events" 
            className="watch-live-link inline-flex items-center gap-2 min-h-[40px] px-6 py-2 border border-[#e8d49a] rounded-full text-[#7a0e22] bg-gradient-to-r from-[#fff8e8] to-[#ead394] font-bold text-xs uppercase tracking-wider shadow-lg hover:-translate-y-0.5 transition-transform duration-300"
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4 text-red-700">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m10 9 5 3-5 3Z" />
            </svg>
            Watch Celebration
          </a>

          {/* Details Grid */}
          <div className="w-full border-t border-[#c8a84b]/15 mt-6 pt-5 grid grid-cols-2 gap-4 relative">
            {/* Center Vertical Separator */}
            <div className="absolute top-5 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-[#c8a84b]/30 to-transparent" />

            {/* Left Column: Date & Time */}
            <div className="flex items-start gap-2 text-left">
              <div className="w-7 h-7 rounded-full border border-[#c8a84b] flex items-center justify-center text-[#e8d49a] shrink-0 mt-0.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              </div>
              <div className="font-playfair text-[9px] md:text-[10px] text-[#e8d49a] uppercase tracking-wider leading-relaxed">
                Sunday <br />
                August 16, 2026 <br />
                11:58 AM
              </div>
            </div>

            {/* Right Column: Venue & Navigation */}
            <div className="flex items-start gap-2 text-left pl-3">
              <div className="w-7 h-7 rounded-full border border-[#c8a84b] flex items-center justify-center text-[#e8d49a] shrink-0 mt-0.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                  <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="font-playfair text-[9px] md:text-[10px] text-[#e8d49a] uppercase tracking-wider leading-relaxed">
                <a href="https://maps.app.goo.gl/8J1RKM4A9bJWD25K8" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  KSC Convention <br />
                  Hall, <br />
                  Mydukur
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bouncing Scroll Hint */}
      <button
        onClick={() => document.getElementById("celebration")?.scrollIntoView({ behavior: "smooth" })}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity animate-bounce cursor-pointer z-10"
        aria-label="Scroll down"
      >
        <svg width="16" height="20" viewBox="0 0 16 20" fill="none" className="text-[#e8d49a]">
          <path d="M8 1v18M1 13l7 7 7-7" stroke="currentColor" stroke-width="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </section>
  );
}
