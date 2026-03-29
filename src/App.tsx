import { useState, useCallback } from 'react';
import { StarField } from './components/StarField';
import { FloatingTags } from './components/FloatingTags';
import { AudioWave } from './components/AudioWave';
import { PhotoUploader } from './components/PhotoUploader';
import { ResultCard } from './components/ResultCard';
import { MusicToggle } from './components/MusicToggle';
import { analyzePhoto } from './api/anthropic';
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback((file: File) => {
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  }, []);

  const handleAnalyze = async () => {
    if (!imageFile) return;
    setLoading(true);
    setError(null);
    try {
      const { base64, mimeType } = await resizeImage(imageFile);
      const res = await analyzePhoto(base64, mimeType);
      setResult(res);
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

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', position: 'relative' }}>
      {/* Layer 0: stars */}
      <StarField />

      {/* Music toggle button (top-right) */}
      <MusicToggle />

      {/* Layer 1: floating tags */}
      {result && <FloatingTags tags={result.tags} />}

      {/* Layer 10: main UI */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* Header */}
        <header style={{ textAlign: 'center', paddingTop: '4rem', paddingBottom: '2rem' }}>
          <h1 style={{
            fontFamily: '"DM Serif Display", serif',
            fontSize: 'clamp(2.2rem, 6vw, 4rem)',
            color: '#c9a84c',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            marginBottom: '0.4rem',
          }}>
            聆·境
          </h1>
          <p style={{
            fontFamily: '"Noto Serif SC", serif',
            color: 'rgba(201,168,76,0.48)',
            fontSize: '0.8rem',
            letterSpacing: '0.5em',
            fontWeight: 300,
          }}>
            照片调音师
          </p>
        </header>

        {/* Main content */}
        <main style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 1rem 5rem',
        }}>
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
                        borderRadius: '12px', objectFit: 'cover',
                        border: '1px solid rgba(201,168,76,0.25)',
                        marginBottom: '1.25rem',
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
                      color: 'rgba(201,168,76,0.7)',
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
                    color: 'rgba(255,100,80,0.8)',
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
