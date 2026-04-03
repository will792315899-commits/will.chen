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

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Background layers */}
      <MediterraneanBg />

      {/* Floating particles */}
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
          padding: '0', width: '38px', height: '38px',
          borderRadius: '50%',
          background: 'rgba(245,240,232,0.08)',
          border: '1px solid rgba(245,240,232,0.18)',
          color: 'rgba(245,240,232,0.5)',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          justifyContent: 'center',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,240,232,0.14)';
          (e.currentTarget as HTMLButtonElement).style.color = 'rgba(245,240,232,0.85)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,240,232,0.08)';
          (e.currentTarget as HTMLButtonElement).style.color = 'rgba(245,240,232,0.5)';
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
          <circle cx="7" cy="7" r="5.5"/>
          <path d="M7 4v3.2l2 1.3"/>
        </svg>
      </button>

      {/* Floating tags */}
      {result && <FloatingTags tags={result.tags} />}

      {/* History panel */}
      {showHistory && (
        <HistoryPanel
          onClose={() => setShowHistory(false)}
          onSelect={handleSelectHistory}
        />
      )}

      {/* Main UI */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* Header */}
        <header style={{ textAlign: 'center', paddingTop: '4.5rem', paddingBottom: '2.5rem' }}>
          <h1
            className="anim-title"
            style={{
              fontFamily: '"Noto Serif SC", serif',
              fontWeight: 700,
              fontSize: 'clamp(72px, 12vw, 96px)',
              color: '#f5f0e8',
              letterSpacing: '-0.02em',
              lineHeight: 1,
              marginBottom: '0.55rem',
              textShadow: '0 0 40px rgba(200,160,80,0.30), 0 2px 0 rgba(0,0,0,0.4)',
            }}
          >
            聆·境
          </h1>
          <p
            className="anim-subtitle"
            style={{
              fontFamily: '"Noto Serif SC", serif',
              color: 'rgba(245,240,232,0.4)',
              fontSize: '0.78rem',
              letterSpacing: '0.75em',
              fontWeight: 300,
              marginBottom: '0.9rem',
            }}
          >
            照片调音师
          </p>
          <p
            className="anim-slogan"
            style={{
              fontFamily: '"Playfair Display", serif',
              fontStyle: 'italic',
              color: 'rgba(245,240,232,0.32)',
              fontSize: '0.92rem',
              letterSpacing: '0.04em',
              lineHeight: 1.5,
            }}
          >
            每一张照片，都藏着一首歌
          </p>
        </header>

        {/* Main content */}
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 1.25rem 6rem' }}>
          <div style={{ width: '100%', maxWidth: '440px' }}>

            {/* ── Result state ── */}
            {result && imageUrl && (
              <ResultCard result={result} imageUrl={imageUrl} onReset={handleReset} />
            )}

            {/* ── Upload / Loading state ── */}
            {!result && (
              <div className="anim-uploader" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
                        border: '1px solid rgba(245,240,232,0.12)',
                        boxShadow: '0 8px 40px rgba(0,0,0,0.55), 0 4px 20px rgba(180,120,50,0.15)',
                        display: 'block', margin: '0 auto 1.4rem',
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
                      color: 'rgba(245,240,232,0.5)',
                      fontSize: '0.88rem',
                      letterSpacing: '0.22em',
                      marginBottom: '1.5rem',
                    }}>
                      正在聆听光与影的低语…
                    </p>
                    <AudioWave active={false} height={44} />
                  </div>
                )}

                {/* Error */}
                {error && (
                  <p style={{
                    textAlign: 'center',
                    color: 'rgba(220,100,90,0.8)',
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
    </div>
  );
}
