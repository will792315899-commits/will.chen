import { useEffect, useRef } from 'react';

interface Star {
  x: number; y: number;
  size: number; opacity: number;
  speed: number; offset: number;
}

interface Dust {
  x: number; y: number;
  vx: number; vy: number;
  size: number; opacity: number;
  r: number; g: number; b: number;
}

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Stars
    const stars: Star[] = Array.from({ length: 220 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 1.4 + 0.2,
      opacity: Math.random() * 0.65 + 0.25,
      speed: Math.random() * 0.018 + 0.004,
      offset: Math.random() * Math.PI * 2,
    }));

    // Gold/white dust particles
    const palette = [
      [201, 168, 76], [240, 192, 64], [232, 213, 163], [255, 248, 200],
    ];
    const dust: Dust[] = Array.from({ length: 70 }, () => {
      const [r, g, b] = palette[Math.floor(Math.random() * palette.length)];
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.18,
        size: Math.random() * 1.8 + 0.4,
        opacity: Math.random() * 0.25 + 0.04,
        r, g, b,
      };
    });

    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars with twinkling
      for (const s of stars) {
        const tw = Math.sin(t * s.speed + s.offset) * 0.28 + 0.72;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 248, 215, ${s.opacity * tw})`;
        ctx.fill();
      }

      // Draw and drift dust
      for (const d of dust) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < -2) d.x = canvas.width + 2;
        if (d.x > canvas.width + 2) d.x = -2;
        if (d.y < -2) d.y = canvas.height + 2;
        if (d.y > canvas.height + 2) d.y = -2;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${d.r},${d.g},${d.b},${d.opacity})`;
        ctx.fill();
      }

      t++;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
    />
  );
}
