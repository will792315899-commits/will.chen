import { useEffect, useRef } from 'react';

interface AudioWaveProps {
  active: boolean;
  height?: number;
}

export function AudioWave({ active, height = 60 }: AudioWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();

    const w = () => canvas.offsetWidth;
    const h = () => canvas.offsetHeight;

    // Warm amber / dark-cinema wave palette
    const waves = [
      { amp: 14, freq: 0.022, speed: 0.042, color: 'rgba(200,160,80,0.55)',  phase: 0 },
      { amp: 9,  freq: 0.036, speed: 0.060, color: 'rgba(180,130,60,0.32)',  phase: 1.4 },
      { amp: 19, freq: 0.014, speed: 0.030, color: 'rgba(245,220,150,0.18)', phase: 2.8 },
    ];

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w(), h());
      const scale = activeRef.current ? 1 : 0.22;

      for (const wave of waves) {
        ctx.beginPath();
        const cy = h() / 2;
        for (let x = 0; x <= w(); x++) {
          const y =
            cy +
            Math.sin(x * wave.freq + t * wave.speed + wave.phase) * wave.amp * scale +
            Math.sin(x * wave.freq * 2.1 + t * wave.speed * 1.6 + wave.phase) * wave.amp * 0.4 * scale;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      t++;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: `${height}px`, display: 'block' }}
    />
  );
}
