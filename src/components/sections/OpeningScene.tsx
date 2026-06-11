"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useCallback, useMemo } from "react";
import "./OpeningScene.css";

/* ═══════════════════════════════════════════════════════════
   SVG Path Definitions for Curtain Morphing
   ViewBox: 0 0 100 100
   ═══════════════════════════════════════════════════════════ */

// Left curtain — closed: covers full left half with realistic drape curves
const LEFT_CLOSED =
  "M 0 0 " +
  "C 25 0, 50 0, 100 0 " +       // top edge
  "C 98 15, 95 25, 97 35 " +     // right edge fold 1
  "C 99 45, 96 55, 98 65 " +     // right edge fold 2
  "C 100 75, 97 85, 100 100 " +  // right edge fold 3
  "L 0 100 Z";

// Left curtain — opened: gathers to left with draped folds
const LEFT_OPEN =
  "M 0 0 " +
  "C 5 0, 10 0, 18 0 " +         // narrow top
  "C 22 15, 12 25, 16 35 " +     // folded edge
  "C 20 45, 8 55, 14 65 " +      // middle fold
  "C 18 75, 10 85, 20 100 " +    // bottom fold
  "L 0 100 Z";

// Right curtain — closed: covers full right half with realistic drape curves
const RIGHT_CLOSED =
  "M 100 0 " +
  "C 75 0, 50 0, 0 0 " +         // top edge
  "C 2 15, 5 25, 3 35 " +        // left edge fold 1
  "C 1 45, 4 55, 2 65 " +        // left edge fold 2
  "C 0 75, 3 85, 0 100 " +       // left edge fold 3
  "L 100 100 Z";

// Right curtain — opened: gathers to right with draped folds
const RIGHT_OPEN =
  "M 100 0 " +
  "C 95 0, 90 0, 82 0 " +        // narrow top
  "C 78 15, 88 25, 84 35 " +     // folded edge
  "C 80 45, 92 55, 86 65 " +     // middle fold
  "C 82 75, 90 85, 80 100 " +    // bottom fold
  "L 100 100 Z";

/* ═══════════════════════════════════════════════════════════ */

interface OpeningSceneProps {
  onOpen: () => void;
}

export function OpeningScene({ onOpen }: OpeningSceneProps) {
  const [isOpen, setIsOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleOpen = useCallback(() => {
    if (isOpen) return;
    setIsOpen(true);

    // Start background music
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(() => {});
    }

    // Transition out after curtains fully part
    setTimeout(() => onOpen(), 2800);
  }, [isOpen, onOpen]);

  // Pre-generate sparkle particles for the reveal
  const sparkles = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: 50 + (Math.random() - 0.5) * 80,    // cluster around center
        y: 50 + (Math.random() - 0.5) * 80,
        dx: (Math.random() - 0.5) * 300,
        dy: (Math.random() - 0.5) * 300,
        delay: Math.random() * 0.8,
        size: 2 + Math.random() * 4,
      })),
    []
  );

  // Ambient floating particles (always visible)
  const ambientParticles = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        duration: 8 + Math.random() * 12,
        delay: Math.random() * 10,
        drift: (Math.random() - 0.5) * 60,
      })),
    []
  );

  // Curtain opening animation config
  const curtainTransition = {
    duration: 2.2,
    ease: [0.65, 0, 0.35, 1] as [number, number, number, number],
  };

  return (
    <motion.div
      className="opening-scene"
      onClick={handleOpen}
      animate={isOpen ? { scale: 1.1 } : { scale: 1 }}
      transition={{ duration: 1.2, ease: "easeInOut", delay: isOpen ? 0.8 : 0 }}
    >
      {/* Background music */}
      <audio ref={audioRef} loop src="/audio/wedding-music.mp3" preload="auto" />

      {/* SVG Gradient Definitions */}
      <svg className="opening-scene__svg-defs" aria-hidden="true">
        <defs>
          {/* Left curtain — deep maroon velvet gradient */}
          <linearGradient id="velvet-left" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#3d0012" />
            <stop offset="15%"  stopColor="#5c001a" />
            <stop offset="30%"  stopColor="#7a0022" />
            <stop offset="45%"  stopColor="#8b0028" />
            <stop offset="55%"  stopColor="#6b001e" />
            <stop offset="70%"  stopColor="#8b0028" />
            <stop offset="85%"  stopColor="#5c001a" />
            <stop offset="100%" stopColor="#4a0014" />
          </linearGradient>

          {/* Right curtain — mirrored maroon velvet */}
          <linearGradient id="velvet-right" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%"   stopColor="#3d0012" />
            <stop offset="15%"  stopColor="#5c001a" />
            <stop offset="30%"  stopColor="#7a0022" />
            <stop offset="45%"  stopColor="#8b0028" />
            <stop offset="55%"  stopColor="#6b001e" />
            <stop offset="70%"  stopColor="#8b0028" />
            <stop offset="85%"  stopColor="#5c001a" />
            <stop offset="100%" stopColor="#4a0014" />
          </linearGradient>

          {/* Soft shadow filter */}
          <filter id="curtain-shadow" x="-10%" y="-5%" width="120%" height="110%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#000" floodOpacity="0.7" />
          </filter>

          {/* Inner glow for depth */}
          <filter id="inner-glow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
            <feComponentTransfer in="blur" result="glow">
              <feFuncA type="linear" slope="0.4" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* ── Vignette overlay ── */}
      <div className="vignette" />

      {/* ── Spotlight from top ── */}
      <div className="spotlight" />

      {/* ── Top Valance (Pelmet) ── */}
      <div className="valance">
        <div className="valance__trim" />
      </div>

      {/* ── Gold Ornamental Corner Frames ── */}
      {(["tl", "tr", "bl", "br"] as const).map((pos) => (
        <div key={pos} className={`corner-frame corner-frame--${pos}`}>
          <div className="corner-frame__ornament" />
          <div className="corner-frame__dot" />
        </div>
      ))}

      {/* ═══════════════════════════════════════════════════════════
         LEFT CURTAIN
         ═══════════════════════════════════════════════════════════ */}
      <div className={`curtain curtain--left ${isOpen ? "curtain--opened" : ""}`}>
        <div className="curtain__fabric-wrap">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="curtain__svg"
          >
            <motion.path
              initial={{ d: LEFT_CLOSED }}
              animate={{ d: isOpen ? LEFT_OPEN : LEFT_CLOSED }}
              transition={curtainTransition}
              fill="url(#velvet-left)"
              filter="url(#curtain-shadow)"
            />
          </svg>

          {/* Velvet texture grain */}
          <div className="curtain__texture" />

          {/* Satin sheen light sweep */}
          <div className="curtain__sheen" />

          {/* Fold highlight/shadow lines */}
          <div className="curtain__folds">
            <div className="curtain__fold-line" />
            <div className="curtain__fold-line" />
            <div className="curtain__fold-line" />
            <div className="curtain__fold-line" />
          </div>

          {/* Inner shadow at center seam */}
          <div className="curtain__inner-shadow" />
        </div>

        {/* Gold tie-back cord */}
        <div className="curtain__tieback" />
        <div className="curtain__tassel">
          <div className="curtain__tassel-inner" />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
         RIGHT CURTAIN
         ═══════════════════════════════════════════════════════════ */}
      <div className={`curtain curtain--right ${isOpen ? "curtain--opened" : ""}`}>
        <div className="curtain__fabric-wrap">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="curtain__svg"
          >
            <motion.path
              initial={{ d: RIGHT_CLOSED }}
              animate={{ d: isOpen ? RIGHT_OPEN : RIGHT_CLOSED }}
              transition={curtainTransition}
              fill="url(#velvet-right)"
              filter="url(#curtain-shadow)"
            />
          </svg>

          <div className="curtain__texture" />
          <div className="curtain__sheen" />

          <div className="curtain__folds">
            <div className="curtain__fold-line" />
            <div className="curtain__fold-line" />
            <div className="curtain__fold-line" />
            <div className="curtain__fold-line" />
          </div>

          <div className="curtain__inner-shadow" />
        </div>

        <div className="curtain__tieback" />
        <div className="curtain__tassel">
          <div className="curtain__tassel-inner" />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
         CENTER — Seal Button + Instruction
         ═══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            className="center-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6 }}
          >
            {/* Royal seal / button */}
            <motion.button
              className="seal-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleOpen();
              }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                scale: [1, 1.03, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="seal-btn__text">Open<br />Invitation</span>
              <span className="seal-btn__sub">✦ tap ✦</span>
            </motion.button>

            {/* Decorative divider */}
            <div className="center-content__divider">
              <div className="center-content__line" />
              <div className="center-content__diamond" />
              <div className="center-content__line" />
            </div>

            {/* Instruction */}
            <div className="seal-instruction" style={{ position: "relative", bottom: "auto" }}>
              <p className="seal-instruction__text">
                ✦ Tap the seal to unveil ✦
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Ambient floating particles (always visible) ── */}
      {ambientParticles.map((p) => (
        <div
          key={`ambient-${p.id}`}
          className="ambient-particle"
          style={{
            left: `${p.left}%`,
            bottom: "-5%",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            ["--drift" as string]: `${p.drift}px`,
          }}
        />
      ))}

      {/* ── Golden sparkle burst on curtain open ── */}
      {isOpen && (
        <div className="sparkles-container">
          {sparkles.map((s) => (
            <div
              key={`sparkle-${s.id}`}
              className="sparkle-particle"
              style={{
                top: `${s.y}%`,
                left: `${s.x}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                animationDelay: `${s.delay}s`,
                ["--dx" as string]: `${s.dx}px`,
                ["--dy" as string]: `${s.dy}px`,
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
