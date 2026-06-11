"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function FallingPetals() {
  const [petals, setPetals] = useState<number[]>([]);

  useEffect(() => {
    // Generate 10 petals
    setPetals(Array.from({ length: 10 }).map((_, i) => i));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {petals.map((id) => {
        const left = Math.random() * 100;
        const animationDuration = 5 + Math.random() * 10;
        const delay = Math.random() * 5;

        return (
          <motion.div
            key={id}
            className="absolute top-[-5%] w-4 h-4 bg-royal-pink-light/60 rounded-full"
            style={{
              left: `${left}%`,
              borderRadius: "50% 0 50% 50%",
            }}
            animate={{
              y: ["0vh", "110vh"],
              x: ["0vw", `${(Math.random() - 0.5) * 20}vw`],
              rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
            }}
            transition={{
              duration: animationDuration,
              delay: delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        );
      })}
    </div>
  );
}
