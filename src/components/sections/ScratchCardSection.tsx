"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ScratchCardSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Gold gradient cover
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#b8860b");
    gradient.addColorStop(0.3, "#ffd700");
    gradient.addColorStop(0.5, "#fffacd");
    gradient.addColorStop(0.7, "#ffd700");
    gradient.addColorStop(1, "#b8860b");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative mandala-style concentric circles
    for (let r = 20; r < 120; r += 18) {
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(139, 90, 0, ${0.3 - r * 0.001})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Ornamental border lines
    ctx.strokeStyle = "rgba(139, 90, 0, 0.5)";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    ctx.strokeRect(16, 16, canvas.width - 32, canvas.height - 32);

    // Corner ornaments
    const corners = [[20, 20], [canvas.width - 20, 20], [20, canvas.height - 20], [canvas.width - 20, canvas.height - 20]];
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(139, 90, 0, 0.6)";
      ctx.fill();
    });

    // Instructional text in the center
    ctx.font = "bold 16px 'Playfair Display', serif";
    ctx.fillStyle = "rgba(80, 40, 0, 0.8)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✦ Scratch to Reveal ✦", canvas.width / 2, canvas.height / 2 - 14);
    ctx.font = "12px serif";
    ctx.fillStyle = "rgba(80, 40, 0, 0.6)";
    ctx.fillText("the wedding date", canvas.width / 2, canvas.height / 2 + 10);

    const getPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
    };

    const scratch = (e: MouseEvent | TouchEvent) => {
      if (!isDrawingRef.current) return;
      e.preventDefault();
      const { x, y } = getPos(e);
      ctx.globalCompositeOperation = "destination-out";
      // Soft eraser with radial gradient
      const radGrad = ctx.createRadialGradient(x, y, 0, x, y, 28);
      radGrad.addColorStop(0, "rgba(0,0,0,1)");
      radGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = radGrad;
      ctx.beginPath();
      ctx.arc(x, y, 28, 0, Math.PI * 2);
      ctx.fill();
      checkReveal();
    };

    const checkReveal = () => {
      if (isRevealed) return;
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let transparent = 0;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] === 0) transparent++;
      }
      const pct = Math.round((transparent / (data.length / 4)) * 100);
      setScratchPercent(pct);
      if (pct > 40) {
        setIsRevealed(true);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    const start = (e: MouseEvent | TouchEvent) => { isDrawingRef.current = true; scratch(e); };
    const stop = () => { isDrawingRef.current = false; };

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", scratch);
    canvas.addEventListener("mouseup", stop);
    canvas.addEventListener("mouseleave", stop);
    canvas.addEventListener("touchstart", start, { passive: false });
    canvas.addEventListener("touchmove", scratch, { passive: false });
    canvas.addEventListener("touchend", stop);

    return () => {
      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("mousemove", scratch);
      canvas.removeEventListener("mouseup", stop);
      canvas.removeEventListener("mouseleave", stop);
      canvas.removeEventListener("touchstart", start);
      canvas.removeEventListener("touchmove", scratch);
      canvas.removeEventListener("touchend", stop);
    };
  }, [isRevealed]);

  return (
    <section className="py-24 px-4 relative overflow-hidden" style={{
      background: "linear-gradient(160deg, #fdf7f0 0%, #fdebd0 50%, #fdf7f0 100%)"
    }}>
      {/* Background ornaments */}
      <div className="absolute top-8 left-8 text-gold-primary/10 text-[120px] font-calligraphy pointer-events-none select-none">✦</div>
      <div className="absolute bottom-8 right-8 text-gold-primary/10 text-[120px] font-calligraphy pointer-events-none select-none">✦</div>

      <div className="max-w-lg mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="font-sans text-royal-pink/70 uppercase tracking-[0.3em] text-xs mb-3">An Auspicious Date</p>
          <h2 className="font-calligraphy text-5xl md:text-6xl text-deep-maroon mb-4">Save the Date</h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-primary" />
            <span className="text-gold-primary text-xl">❧</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-primary" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {/* Outer ornamental frame */}
          <div className="relative p-1 rounded-2xl" style={{
            background: "linear-gradient(135deg, #b8860b, #ffd700, #fffacd, #ffd700, #b8860b)"
          }}>
            <div className="relative rounded-xl overflow-hidden bg-white" style={{ minHeight: 220 }}>

              {/* Revealed content underneath */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                style={{ background: "linear-gradient(135deg, #fff9f0, #fdebd0)" }}
              >
                {/* Decorative petals */}
                <p className="text-2xl mb-3">🌸</p>
                <p className="font-sans text-xs uppercase tracking-[0.25em] text-royal-pink/60 mb-2">Wedding Day</p>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={isRevealed ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="font-calligraphy text-5xl text-deep-maroon mb-1"
                >
                  16th August
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={isRevealed ? { opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="font-serif text-2xl text-gold-dark font-bold mb-2"
                >
                  2026
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={isRevealed ? { opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="font-sans text-xs text-gray-500 tracking-widest uppercase"
                >
                  Muhurtham at 11:00 AM
                </motion.p>
              </div>

              {/* Scratch canvas */}
              {!isRevealed && (
                <canvas
                  ref={canvasRef}
                  width={480}
                  height={220}
                  className="absolute inset-0 w-full h-full cursor-crosshair touch-none z-10"
                />
              )}
            </div>
          </div>
        </motion.div>

        {/* Progress indicator */}
        {!isRevealed && scratchPercent > 0 && (
          <div className="mt-4">
            <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #d97706, #fbbf24)" }}
                initial={{ width: "0%" }}
                animate={{ width: `${scratchPercent}%` }}
              />
            </div>
            <p className="text-center text-xs text-gray-400 mt-1 font-sans">{scratchPercent}% revealed</p>
          </div>
        )}

        {/* Celebration */}
        <AnimatePresence>
          {isRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-8"
            >
              <p className="font-calligraphy text-3xl text-royal-pink mb-2">We can&apos;t wait to see you!</p>
              <p className="text-2xl tracking-widest">✨ 🌸 ✨</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
