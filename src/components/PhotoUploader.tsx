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
        border: dragging
          ? '1.5px solid #c0846d'
          : '1.5px dashed #c0846d',
        /* Slightly irregular corners for aged-wall feel */
        borderRadius: '20px 17px 19px 18px / 18px 20px 17px 21px',
        padding: '3rem 2rem',
        textAlign: 'center',
        cursor: 'pointer',
        background: dragging
          ? 'rgba(253,246,227,0.95)'
          : 'rgba(253,246,227,0.85)',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(14px)',
        boxShadow: dragging
          ? '0 12px 40px rgba(0,0,0,0.28), 0 4px 12px rgba(192,132,109,0.35), inset 0 1px 0 rgba(255,255,255,0.5)'
          : '0 8px 30px rgba(0,0,0,0.22), 0 3px 10px rgba(192,132,109,0.25), inset 0 1px 0 rgba(255,255,255,0.5)',
        backgroundImage: [
          'radial-gradient(ellipse at 18% 25%, rgba(255,255,255,0.22) 0%, transparent 55%)',
          'radial-gradient(ellipse at 82% 75%, rgba(220,180,150,0.10) 0%, transparent 50%)',
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
