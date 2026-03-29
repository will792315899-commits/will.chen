import { useRef, useState } from 'react';

interface PhotoUploaderProps {
  onUpload: (file: File) => void;
}

export function PhotoUploader({ onUpload }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) onUpload(file);
  };

  const deep = (a: number) => `rgba(26,82,118,${a})`;

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
      style={{
        border: `1.5px dashed ${dragging ? deep(0.8) : deep(0.32)}`,
        borderRadius: '18px',
        padding: '3rem 2rem',
        textAlign: 'center',
        cursor: 'pointer',
        background: dragging
          ? 'rgba(255,252,245,0.88)'
          : 'rgba(255,252,245,0.72)',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(12px)',
        boxShadow: dragging
          ? `0 8px 32px ${deep(0.2)}, inset 0 1px 0 rgba(255,255,255,0.6)`
          : `0 4px 20px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)`,
        /* Subtle wall-plaster texture via layered gradients */
        backgroundImage: dragging ? undefined : [
          'radial-gradient(ellipse at 20% 30%, rgba(255,255,255,0.18) 0%, transparent 60%)',
          'radial-gradient(ellipse at 80% 70%, rgba(200,220,240,0.12) 0%, transparent 50%)',
        ].join(', '),
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />

      {/* Icon */}
      <div style={{ fontSize: '2.6rem', marginBottom: '1rem', opacity: 0.6, color: '#1a5276' }}>
        ◈
      </div>

      <p style={{
        fontFamily: '"Noto Serif SC", serif',
        color: '#1a5276',
        fontSize: '1rem',
        letterSpacing: '0.08em',
        marginBottom: '0.5rem',
        fontWeight: 500,
      }}>
        上传一张照片，聆听它的旋律
      </p>

      <p style={{ color: deep(0.45), fontSize: '0.78rem', letterSpacing: '0.1em' }}>
        拖放或点击选择 · JPEG / PNG / WEBP
      </p>
    </div>
  );
}
