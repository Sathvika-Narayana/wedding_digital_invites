"use client";

import { useEffect, useRef } from "react";

interface Firefly {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  radius: number;
  opacity: number;
  opacityDir: number;
  speed: number;
  glowSize: number;
  hue: number;
}

export function Fireflies({ count = 14 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const flies: Firefly[] = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      targetX: Math.random() * window.innerWidth,
      targetY: Math.random() * window.innerHeight,
      radius: Math.random() * 2 + 1.5,
      opacity: Math.random(),
      opacityDir: Math.random() > 0.5 ? 1 : -1,
      speed: Math.random() * 0.4 + 0.15,
      glowSize: Math.random() * 20 + 12,
      hue: Math.random() > 0.6 ? 50 : 45, // gold / warm white
    }));

    let frame: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      flies.forEach((f) => {
        // Drift toward target
        const dx = f.targetX - f.x;
        const dy = f.targetY - f.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 8) {
          f.targetX = Math.random() * canvas.width;
          f.targetY = Math.random() * canvas.height * 0.85 + canvas.height * 0.05;
        }
        f.x += (dx / dist) * f.speed;
        f.y += (dy / dist) * f.speed;

        // Pulse opacity
        f.opacity += f.opacityDir * 0.008;
        if (f.opacity >= 0.9) f.opacityDir = -1;
        if (f.opacity <= 0.05) f.opacityDir = 1;

        // Draw glow
        const grd = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.glowSize);
        grd.addColorStop(0, `hsla(${f.hue}, 100%, 90%, ${f.opacity})`);
        grd.addColorStop(0.35, `hsla(${f.hue}, 80%, 70%, ${f.opacity * 0.4})`);
        grd.addColorStop(1, `hsla(${f.hue}, 60%, 50%, 0)`);
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.glowSize, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Draw core dot
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${f.hue}, 100%, 95%, ${f.opacity * 1.1})`;
        ctx.fill();
      });

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[4]"
      aria-hidden="true"
    />
  );
}
