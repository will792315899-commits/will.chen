import { useRef, useState } from 'react';

interface PhotoUploaderProps {
  onUpload: (file: File) => void;
}

export function PhotoUploader({ onUpload }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) onUpload(file);
  };

  const active = dragging || hovered;

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px dashed ${active ? 'rgba(245,240,232,0.45)' : 'rgba(245,240,232,0.15)'}`,
        borderRadius: '20px',
        padding: '3.5rem 2rem',
        textAlign: 'center',
        cursor: 'pointer',
        background: active ? 'rgba(245,240,232,0.03)' : 'transparent',
        transition: 'all 0.35s ease',
        boxShadow: active
          ? '0 0 28px rgba(200,160,80,0.12), inset 0 0 40px rgba(200,160,80,0.04)'
          : 'none',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />

      {/* Music note icon */}
      <div className="note-icon" style={{ marginBottom: '1.4rem', display: 'inline-block' }}>
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M17 33V17L36 12V28"
            stroke="rgba(245,240,232,0.65)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="13.5" cy="33" r="4" stroke="rgba(245,240,232,0.65)" strokeWidth="1.4" />
          <circle cx="32.5" cy="28" r="4" stroke="rgba(245,240,232,0.65)" strokeWidth="1.4" />
        </svg>
      </div>

      <p style={{
        fontFamily: '"Noto Serif SC", serif',
        color: active ? 'rgba(245,240,232,0.75)' : 'rgba(245,240,232,0.5)',
        fontSize: '0.95rem',
        letterSpacing: '0.1em',
        marginBottom: '0.55rem',
        transition: 'color 0.3s',
      }}>
        上传一张照片，聆听它的旋律
      </p>

      <p style={{
        color: 'rgba(245,240,232,0.25)',
        fontSize: '0.75rem',
        letterSpacing: '0.12em',
        fontFamily: '"Noto Serif SC", serif',
      }}>
        拖放或点击选择 · JPEG / PNG / WEBP
      </p>
    </div>
  );
}
