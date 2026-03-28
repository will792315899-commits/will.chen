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

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
      style={{
        border: `1px dashed ${dragging ? 'rgba(201,168,76,0.9)' : 'rgba(201,168,76,0.35)'}`,
        borderRadius: '16px',
        padding: '3rem 2rem',
        textAlign: 'center',
        cursor: 'pointer',
        background: dragging ? 'rgba(201,168,76,0.07)' : 'rgba(201,168,76,0.02)',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(4px)',
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
      <div style={{ fontSize: '2.8rem', marginBottom: '1rem', opacity: 0.55, color: '#c9a84c' }}>
        ◈
      </div>

      <p style={{
        fontFamily: '"Noto Serif SC", serif',
        color: '#c9a84c',
        fontSize: '1rem',
        letterSpacing: '0.08em',
        marginBottom: '0.5rem',
      }}>
        上传一张照片，聆听它的旋律
      </p>

      <p style={{ color: 'rgba(201,168,76,0.45)', fontSize: '0.78rem', letterSpacing: '0.1em' }}>
        拖放或点击选择 · JPEG / PNG / WEBP
      </p>
    </div>
  );
}
