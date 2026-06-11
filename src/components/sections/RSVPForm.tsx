"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

export function RSVPForm() {
  const [name, setName] = useState("");
  const [wishes, setWishes] = useState("");
  const [contact, setContact] = useState("");
  const [queries, setQueries] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, wishes, contact, queries }),
      });
      if (response.ok) {
        setStatus("success");
        setName("");
        setWishes("");
        setContact("");
        setQueries("");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      setStatus("error");
    }
  };

  return (
    <section className="py-24 px-4 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #fdf7f0 0%, #fdebd0 50%, #fdf7f0 100%)" }}
    >
      {/* Ornamental corners */}
      <div className="absolute top-6 left-6 text-gold-primary/15 font-calligraphy text-8xl select-none pointer-events-none">❧</div>
      <div className="absolute bottom-6 right-6 text-gold-primary/15 font-calligraphy text-8xl select-none pointer-events-none rotate-180">❧</div>

      <div className="max-w-xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-sans text-royal-pink/60 text-xs uppercase tracking-[0.35em] mb-3">You&apos;re Invited</p>
          <h2 className="font-calligraphy text-6xl text-deep-maroon mb-4">RSVP</h2>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold-primary/50" />
            <span className="text-gold-primary">✦</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold-primary/50" />
          </div>
          <p className="font-serif text-gray-500 italic text-sm max-w-sm mx-auto mb-3">
            Please make sure to come and bless Sudeepthi &amp; Nayanadeep as they start their new chapter together.
          </p>
          <p className="font-sans text-royal-pink font-bold text-sm">
            మీ ఆశీస్సులు మాకు శ్రీరామరక్ష
          </p>
        </motion.div>

        {/* Gold-framed form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="p-px rounded-3xl"
            style={{ background: "linear-gradient(135deg, #b8860b, #ffd700, #d6336c, #ffd700, #b8860b)" }}
          >
            <div className="rounded-3xl p-8 md:p-10 bg-white/90 backdrop-blur-md">
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10"
                  >
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #ffd700, #d6336c)" }}
                    >
                      <Sparkles className="w-9 h-9 text-white" />
                    </div>
                    <h3 className="font-calligraphy text-4xl text-deep-maroon mb-2">Thank You!</h3>
                    <p className="font-serif text-gray-500 italic">Your blessings mean the world to us. ✨</p>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} className="space-y-6">
                    {status === "error" && (
                      <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-sans text-center">
                        Something went wrong. Please try sending your wishes again.
                      </div>
                    )}

                    <div>
                      <label className="block font-sans text-xs font-bold text-deep-maroon/70 mb-2 uppercase tracking-widest">
                        Your Name
                      </label>
                      <input
                        required
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-ivory-bg border border-gold-light/40 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-gold-primary/40 focus:border-gold-primary transition-all font-sans text-deep-maroon placeholder:text-gray-300"
                        placeholder="Enter your name"
                      />
                    </div>

                    <div>
                      <label className="block font-sans text-xs font-bold text-deep-maroon/70 mb-2 uppercase tracking-widest">
                        Warm Greetings &amp; Blessings
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={wishes}
                        onChange={(e) => setWishes(e.target.value)}
                        className="w-full bg-ivory-bg border border-gold-light/40 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-gold-primary/40 focus:border-gold-primary transition-all resize-none font-sans text-deep-maroon placeholder:text-gray-300"
                        placeholder="Share your warm wishes as they begin this beautiful journey..."
                      />
                    </div>

                    <div>
                      <label className="block font-sans text-xs font-bold text-deep-maroon/70 mb-2 uppercase tracking-widest">
                        Your Contact Info (Optional)
                      </label>
                      <input
                        type="text"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        className="w-full bg-ivory-bg border border-gold-light/40 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-gold-primary/40 focus:border-gold-primary transition-all font-sans text-deep-maroon placeholder:text-gray-300"
                        placeholder="Email or phone (needed only if you have questions)"
                      />
                    </div>

                    <div>
                      <label className="block font-sans text-xs font-bold text-deep-maroon/70 mb-2 uppercase tracking-widest">
                        Any Queries? (Optional)
                      </label>
                      <input
                        type="text"
                        value={queries}
                        onChange={(e) => setQueries(e.target.value)}
                        className="w-full bg-ivory-bg border border-gold-light/40 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-gold-primary/40 focus:border-gold-primary transition-all font-sans text-deep-maroon placeholder:text-gray-300"
                        placeholder="Questions or special requests"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="w-full py-4 rounded-xl font-sans font-bold uppercase tracking-widest text-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                      style={{ background: "linear-gradient(135deg, #4a0404, #7a0a2e)", color: "white" }}
                    >
                      {status === "submitting" ? "Sending Blessings..." : "Send Your Wishes ✦"}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Direct contact info */}
        <div className="text-center mt-8 font-serif italic text-gray-500 text-xs">
          Have an urgent question? Email us directly at{" "}
          <a href="mailto:sathvikanarayana27@gmail.com" className="text-royal-pink font-sans font-semibold underline not-italic hover:text-deep-maroon transition-colors ml-1">
            sathvikanarayana27@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
}
