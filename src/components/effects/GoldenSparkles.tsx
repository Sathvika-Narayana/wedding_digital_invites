"use client";

import { useEffect, useRef } from "react";

interface Sparkle {
  x: number;
  y: number;
  life: number;
  maxLife: number;
  size: number;
  vx: number;
  vy: number;
  hue: number;
}

export function GoldenSparkles({ density = 0.00012 }: { density?: number }) {
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

    const sparkles: Sparkle[] = [];
    let frame: number;

    const addSparkles = () => {
      const area = canvas.width * canvas.height;
      const n = Math.floor(area * density * (0.5 + Math.random() * 0.5));
      for (let i = 0; i < n; i++) {
        sparkles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          life: 0,
          maxLife: Math.random() * 120 + 60,
          size: Math.random() * 2 + 0.8,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          hue: Math.random() > 0.5 ? 45 : 38,
        });
      }
    };

    addSparkles();
    const spawnInterval = setInterval(addSparkles, 2000);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i];
        s.life++;
        s.x += s.vx;
        s.y += s.vy;

        const progress = s.life / s.maxLife;
        const fadeIn = Math.min(1, progress * 5);
        const fadeOut = Math.max(0, 1 - (progress - 0.7) * 3.33);
        const alpha = fadeIn * fadeOut * 0.85;

        // Draw 4-pointed star sparkle
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(progress * Math.PI);
        ctx.globalAlpha = alpha;

        const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, s.size * 3);
        grd.addColorStop(0, `hsla(${s.hue}, 100%, 95%, 1)`);
        grd.addColorStop(0.5, `hsla(${s.hue}, 90%, 70%, 0.6)`);
        grd.addColorStop(1, `hsla(${s.hue}, 80%, 50%, 0)`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(0, 0, s.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Cross/star lines
        ctx.strokeStyle = `hsla(${s.hue}, 100%, 90%, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(-s.size * 4, 0);
        ctx.lineTo(s.size * 4, 0);
        ctx.moveTo(0, -s.size * 4);
        ctx.lineTo(0, s.size * 4);
        ctx.stroke();

        ctx.restore();

        if (s.life >= s.maxLife) sparkles.splice(i, 1);
      }

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      clearInterval(spawnInterval);
      window.removeEventListener("resize", resize);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[3]"
      aria-hidden="true"
    />
  );
}
