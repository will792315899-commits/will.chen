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

    const waves = [
      { amp: 18, freq: 0.022, speed: 0.048, color: 'rgba(201,168,76,0.75)', phase: 0 },
      { amp: 12, freq: 0.034, speed: 0.065, color: 'rgba(240,192,64,0.45)', phase: 1.2 },
      { amp: 24, freq: 0.014, speed: 0.036, color: 'rgba(232,213,163,0.28)', phase: 2.5 },
    ];

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w(), h());
      const isActive = activeRef.current;
      const scale = isActive ? 1 : 0.28;

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
        ctx.lineWidth = 1.5;
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
