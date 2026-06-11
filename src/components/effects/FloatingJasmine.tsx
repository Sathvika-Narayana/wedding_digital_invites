"use client";

import { useEffect, useRef } from "react";

interface Jasmine {
  x: number;
  vx: number;
  y: number;
  vy: number;
  size: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  sway: number;
  swaySpeed: number;
  swayOffset: number;
}

export function FloatingJasmine() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const flowers: HTMLDivElement[] = [];
    const states: Jasmine[] = [];

    const jasmineShapes = ["✿", "❀", "✾", "🌸", "✦"];

    const createFlower = () => {
      const el = document.createElement("div");
      const shape = jasmineShapes[Math.floor(Math.random() * jasmineShapes.length)];
      el.textContent = shape;
      el.style.cssText = `
        position: fixed;
        pointer-events: none;
        user-select: none;
        z-index: 5;
        will-change: transform, opacity;
        font-size: 14px;
        color: rgba(255, 240, 200, 0.7);
        text-shadow: 0 0 8px rgba(255,215,0,0.3);
      `;
      container.appendChild(el);
      flowers.push(el);

      const state: Jasmine = {
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 20,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.8 + 0.4),
        size: Math.random() * 8 + 10,
        opacity: 0,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.2,
        sway: 0,
        swaySpeed: Math.random() * 0.02 + 0.01,
        swayOffset: Math.random() * Math.PI * 2,
      };
      el.style.fontSize = `${state.size}px`;
      states.push(state);
    };

    // Spawn flowers gradually
    const count = 8;
    for (let i = 0; i < count; i++) {
      setTimeout(() => createFlower(), i * 700);
    }

    let frame: number;
    let t = 0;

    const animate = () => {
      t += 0.016;
      states.forEach((s, i) => {
        const el = flowers[i];
        if (!el) return;

        s.sway = Math.sin(t * s.swaySpeed * 60 + s.swayOffset) * 18;
        s.x += s.vx + s.sway * 0.015;
        s.y += s.vy;
        s.rotation += s.rotationSpeed;

        // fade in near bottom, fade out near top
        const progress = 1 - (s.y / window.innerHeight);
        if (progress < 0.1) s.opacity = Math.min(s.opacity + 0.02, progress * 10);
        else if (progress > 0.85) s.opacity = Math.max(0, 1 - (progress - 0.85) * 6.67);
        else s.opacity = Math.min(s.opacity + 0.02, 0.75);

        el.style.transform = `translate(${s.x}px, ${s.y}px) rotate(${s.rotation}deg)`;
        el.style.opacity = String(s.opacity);

        // Reset when off top
        if (s.y < -30) {
          s.x = Math.random() * window.innerWidth;
          s.y = window.innerHeight + 20;
          s.opacity = 0;
          s.vy = -(Math.random() * 0.8 + 0.4);
          s.vx = (Math.random() - 0.5) * 0.4;
        }
      });
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      flowers.forEach((el) => el.remove());
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[5]" aria-hidden="true" />;
}
