import { useState, useCallback } from 'react';
import { MediterraneanBg } from './components/MediterraneanBg';
import { StarField } from './components/StarField';
import { FloatingTags } from './components/FloatingTags';
import { AudioWave } from './components/AudioWave';
import { PhotoUploader } from './components/PhotoUploader';
import { ResultCard } from './components/ResultCard';
import { MusicToggle } from './components/MusicToggle';
import { HistoryPanel } from './components/HistoryPanel';
import { analyzePhoto } from './api/anthropic';
import { addHistoryItem, makeThumbnail, type HistoryItem } from './utils/history';
import type { AnalysisResult } from './types';

function resizeImage(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 1024;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round((height * MAX) / width); width = MAX; }
        else { width = Math.round((width * MAX) / height); height = MAX; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve({ base64: canvas.toDataURL('image/jpeg', 0.85).split(',')[1], mimeType: 'image/jpeg' });
    };
    img.src = url;
  });
}

export default function App() {
  const [imageFile, setImageFile]   = useState<File | null>(null);
  const [imageUrl, setImageUrl]     = useState<string | null>(null);
  const [result, setResult]         = useState<AnalysisResult | null>(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const handleUpload = useCallback((file: File) => {
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  }, []);

  const handleAnalyze = async () => {
    if (!imageFile || !imageUrl) return;
    setLoading(true);
    setError(null);
    try {
      const { base64, mimeType } = await resizeImage(imageFile);
      const res = await analyzePhoto(base64, mimeType);
      setResult(res);
      const thumb = await makeThumbnail(imageUrl);
      addHistoryItem(thumb, res);
    } catch (e) {
      setError(e instanceof Error ? e.message : '分析失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImageFile(null);
    setImageUrl(null);
    setResult(null);
    setError(null);
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setImageUrl(item.thumbnail);
    setResult(item.result);
    setImageFile(null);
    setError(null);
    setShowHistory(false);
  };

  const deep = (a: number) => `rgba(26,82,118,${a})`;

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Layer 0-2: sky gradient, clouds, ocean waves */}
      <MediterraneanBg />

      {/* Layer 3: floating sunlight particles */}
      <StarField />

      {/* Music toggle (top-right) */}
      <MusicToggle />

      {/* History button (top-left) */}
      <button
        onClick={() => setShowHistory(true)}
        title="历史记录"
        style={{
          position: 'fixed', top: '1.1rem', left: '1.1rem', zIndex: 50,
          display: 'flex', alignItems: 'center', gap: '0.35rem',
          padding: '0.45rem 0.85rem',
          borderRadius: '9999px',
          background: 'rgba(255,252,245,0.72)',
          border: `1px solid ${deep(0.22)}`,
          color: deep(0.55),
          fontFamily: '"Noto Serif SC", serif',
          fontSize: '0.72rem', letterSpacing: '0.12em',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 10px rgba(26,82,118,0.1)',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = deep(0.55);
          (e.currentTarget as HTMLButtonElement).style.color = '#1a5276';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = deep(0.22);
          (e.currentTarget as HTMLButtonElement).style.color = deep(0.55);
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
          <circle cx="6" cy="6" r="5"/>
          <path d="M6 3v3.5l2 1.2"/>
        </svg>
        历史
      </button>

      {/* Layer 4: floating tags */}
      {result && <FloatingTags tags={result.tags} />}

      {/* History panel */}
      {showHistory && (
        <HistoryPanel
          onClose={() => setShowHistory(false)}
          onSelect={handleSelectHistory}
        />
      )}

      {/* Layer 10: main UI */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* Header */}
        <header style={{ textAlign: 'center', paddingTop: '4rem', paddingBottom: '2rem' }}>
          <h1 style={{
            fontFamily: '"Playfair Display", "Cormorant Garamond", serif',
            fontSize: 'clamp(2.2rem, 6vw, 4rem)',
            color: '#1a5276',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            marginBottom: '0.4rem',
            textShadow: '0 2px 12px rgba(255,255,255,0.5)',
          }}>
            聆·境
          </h1>
          <p style={{
            fontFamily: '"Noto Serif SC", serif',
            color: 'rgba(26,82,118,0.58)',
            fontSize: '0.8rem',
            letterSpacing: '0.5em',
            fontWeight: 300,
          }}>
            照片调音师
          </p>
        </header>

        {/* Main content */}
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 1rem 5rem' }}>
          <div style={{ width: '100%', maxWidth: '440px' }}>

            {/* ── Result state ── */}
            {result && imageUrl && (
              <ResultCard result={result} imageUrl={imageUrl} onReset={handleReset} />
            )}

            {/* ── Upload / Loading state ── */}
            {!result && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <PhotoUploader onUpload={handleUpload} />

                {/* Preview + analyze button */}
                {imageUrl && !loading && (
                  <div style={{ textAlign: 'center' }}>
                    <img
                      src={imageUrl}
                      alt="preview"
                      style={{
                        maxHeight: '220px', maxWidth: '100%',
                        borderRadius: '14px', objectFit: 'cover',
                        border: `1px solid ${deep(0.2)}`,
                        boxShadow: '0 4px 20px rgba(26,82,118,0.18)',
                        display: 'block', margin: '0 auto 1.25rem',
                      }}
                    />
                    <button className="btn-gold" onClick={handleAnalyze}>
                      聆听这张照片
                    </button>
                  </div>
                )}

                {/* Loading */}
                {loading && (
                  <div style={{ textAlign: 'center', padding: '2.5rem 0' }}>
                    <div className="loading-ring" style={{ margin: '0 auto 1.5rem' }} />
                    <p className="pulse-text" style={{
                      fontFamily: '"Noto Serif SC", serif',
                      color: deep(0.75),
                      fontSize: '0.88rem',
                      letterSpacing: '0.22em',
                      marginBottom: '1.5rem',
                    }}>
                      正在聆听光与影的低语…
                    </p>
                    <AudioWave active={false} height={50} />
                  </div>
                )}

                {/* Error */}
                {error && (
                  <p style={{
                    textAlign: 'center',
                    color: 'rgba(180,50,40,0.85)',
                    fontFamily: '"Noto Serif SC", serif',
                    fontSize: '0.88rem',
                    letterSpacing: '0.05em',
                  }}>
                    {error}
                  </p>
                )}
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Fixed bottom wave (result state) */}
      {result && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 5 }}>
          <AudioWave active={true} height={55} />
        </div>
      )}
    </div>
  );
}
