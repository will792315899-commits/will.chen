import { useEffect, useRef } from 'react';

interface Mote {
  x: number; y: number;
  vx: number; vy: number;
  size: number; opacity: number;
  phase: number; phaseSpeed: number;
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

    // Sunlight mote palette — warm whites, cream, pale gold, sky blue
    const palette: [number, number, number][] = [
      [255, 255, 255],
      [255, 252, 220],
      [255, 248, 200],
      [240, 250, 255],
      [220, 240, 255],
      [255, 245, 180],
    ];

    const motes: Mote[] = Array.from({ length: 65 }, () => {
      const [r, g, b] = palette[Math.floor(Math.random() * palette.length)];
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -(Math.random() * 0.22 + 0.04),   // drift upward
        size: Math.random() * 2.8 + 0.6,
        opacity: Math.random() * 0.32 + 0.06,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: Math.random() * 0.012 + 0.004,
        r, g, b,
      };
    });

    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const m of motes) {
        // Drift
        m.x += m.vx;
        m.y += m.vy;

        // Wrap around
        if (m.y < -4) m.y = canvas.height + 4;
        if (m.x < -4) m.x = canvas.width + 4;
        if (m.x > canvas.width + 4) m.x = -4;

        // Pulse opacity
        const pulse = Math.sin(t * m.phaseSpeed + m.phase) * 0.18 + 0.82;
        const alpha = m.opacity * pulse;

        // Draw soft glowing mote
        const grad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.size * 2.2);
        grad.addColorStop(0, `rgba(${m.r},${m.g},${m.b},${alpha})`);
        grad.addColorStop(1, `rgba(${m.r},${m.g},${m.b},0)`);

        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = grad;
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
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 3, pointerEvents: 'none' }}
    />
  );
}
