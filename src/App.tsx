import { useState, useEffect, useRef, useCallback } from 'react';
import { ThreeFrame } from './components/ThreeFrame';
import { ElectricWave } from './components/ElectricWave';
import { MusicToggle } from './components/MusicToggle';
import { HistoryPanel } from './components/HistoryPanel';
import { ResultCard } from './components/ResultCard';
import { FloatingTags } from './components/FloatingTags';
import { analyzePhoto } from './api/anthropic';
import { addHistoryItem, makeThumbnail, type HistoryItem } from './utils/history';
import type { AnalysisResult } from './types';

const SPLINE_URL = 'https://my.spline.design/playmusicapp-B5JO0fIsJbYLi2ezYvB8i9wQ/';

type Phase = 'home' | 'analyzing' | 'result';

const LOAD_TEXTS = ['正在感知画面...', '解读色彩与情绪...', '寻找契合的旋律...', '即将呈现...'];

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
      canvas.width = width; canvas.height = height;
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve({ base64: canvas.toDataURL('image/jpeg', 0.85).split(',')[1], mimeType: 'image/jpeg' });
    };
    img.src = url;
  });
}

export default function App() {
  const [phase, setPhase]             = useState<Phase>('home');
  const [imageFile, setImageFile]     = useState<File | null>(null);
  const [imageUrl, setImageUrl]       = useState<string | null>(null);
  const [result, setResult]           = useState<AnalysisResult | null>(null);
  const [error, setError]             = useState<string | null>(null);
  const [loadText, setLoadText]       = useState(LOAD_TEXTS[0]);
  const [showHistory, setShowHistory] = useState(false);
  const [isMobile, setIsMobile]       = useState(false);
  const [entered, setEntered]         = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setTimeout(() => setEntered(true), 150); }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (phase !== 'analyzing') return;
    let i = 0;
    const iv = setInterval(() => { i = (i + 1) % LOAD_TEXTS.length; setLoadText(LOAD_TEXTS[i]); }, 2200);
    return () => clearInterval(iv);
  }, [phase]);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    setImageUrl(URL.createObjectURL(file));
    setImageFile(file);
    setResult(null);
    setError(null);
  }, []);

  const handleAnalyze = async () => {
    if (!imageFile || !imageUrl) return;
    setPhase('analyzing');
    setError(null);
    try {
      const { base64, mimeType } = await resizeImage(imageFile);
      const res = await analyzePhoto(base64, mimeType);
      setResult(res);
      const thumb = await makeThumbnail(imageUrl);
      addHistoryItem(thumb, res);
      setPhase('result');
    } catch (e) {
      setError(e instanceof Error ? e.message : '分析失败，请重试');
      setPhase('home');
    }
  };

  const handleReset = () => {
    setPhase('home');
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
    setPhase('result');
  };

  return (
    <div style={{
      position: 'relative', width: '100%', minHeight: '100vh',
      background: 'linear-gradient(180deg, #cce8f4 0%, #dff0f7 10%, #f5fbff 28%, #ffffff 50%, #f5fbff 72%, #dff0f7 90%, #cce8f4 100%)',
      fontFamily: "'Quicksand', 'Noto Serif SC', sans-serif",
      color: '#3a6b7c', overflow: 'hidden',
    }}>

      {/* Fixed controls */}
      <MusicToggle />

      {/* History button */}
      <button
        onClick={() => setShowHistory(true)}
        title="历史记录"
        style={{
          position: 'fixed', top: '1.1rem', left: '1.1rem', zIndex: 50,
          width: '38px', height: '38px', borderRadius: '50%',
          background: 'rgba(126,200,227,0.12)',
          border: '1px solid rgba(126,200,227,0.3)',
          color: 'rgba(58,107,124,0.6)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease', padding: 0,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(126,200,227,0.22)';
          (e.currentTarget as HTMLButtonElement).style.color = '#3a6b7c';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(126,200,227,0.12)';
          (e.currentTarget as HTMLButtonElement).style.color = 'rgba(58,107,124,0.6)';
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
          <circle cx="7" cy="7" r="5.5" />
          <path d="M7 4v3.2l2 1.3" />
        </svg>
      </button>

      {showHistory && (
        <HistoryPanel onClose={() => setShowHistory(false)} onSelect={handleSelectHistory} />
      )}

      {result && <FloatingTags tags={result.tags} />}

      {/* ── Header ── */}
      <div style={{
        textAlign: 'center',
        paddingTop: phase === 'result' ? '20px' : 'clamp(36px, 6vh, 64px)',
        transition: 'padding 0.5s',
        opacity: entered ? 1 : 0,
        transform: entered ? 'translateY(0)' : 'translateY(18px)',
      }}>
        <h1 style={{
          fontFamily: "'Noto Serif SC', serif", fontWeight: 700,
          fontSize: phase === 'result' ? '22px' : 'clamp(32px, 5vw, 48px)',
          color: '#7ec8e3', letterSpacing: '8px', margin: 0,
          transition: 'font-size 0.5s',
        }}>
          聆 · 境
        </h1>
        <p style={{
          fontSize: '11px', color: 'rgba(126,200,227,0.55)', letterSpacing: '8px',
          margin: '6px 0 0', fontWeight: 300,
        }}>
          照 片 调 音 师
        </p>
      </div>

      {/* ═══ HOME ═══ */}
      {phase === 'home' && (
        <>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isMobile ? 'clamp(16px,3vh,32px) 24px' : 'clamp(20px,3vh,40px) 24px',
            gap: isMobile ? '12px' : '0',
            opacity: entered ? 1 : 0,
            transition: 'opacity 1s 0.3s',
          }}>
            {/* Left — Three.js 3D frame */}
            <div style={{
              width: isMobile ? '280px' : '320px',
              height: isMobile ? '340px' : '400px',
              flexShrink: 0,
            }}>
              <ThreeFrame
                imageUrl={imageUrl ?? undefined}
                onClick={() => fileRef.current?.click()}
              />
            </div>

            {/* Middle — electric wave */}
            <div style={{
              padding: isMobile ? '4px 0' : '0 12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <ElectricWave vertical={isMobile} />
            </div>

            {/* Right — Spline embed */}
            <div style={{
              width: isMobile ? '280px' : '340px',
              height: isMobile ? '380px' : '440px',
              borderRadius: '20px', overflow: 'hidden',
              boxShadow: '0 8px 40px rgba(126,200,227,0.12)',
              flexShrink: 0,
            }}>
              <iframe
                src={SPLINE_URL}
                style={{ width: '100%', height: '100%', border: 'none', borderRadius: '20px' }}
                title="3D Music Player"
                allow="autoplay"
              />
            </div>
          </div>

          {/* Upload hint (before photo) */}
          {!imageUrl && (
            <p style={{
              textAlign: 'center', fontSize: '12px',
              color: 'rgba(126,200,227,0.45)', letterSpacing: '3px',
              marginTop: isMobile ? '4px' : '0',
              animation: 'lj-breathe 2.5s ease-in-out infinite',
            }}>
              点击左侧相框上传照片
            </p>
          )}

          {/* Analyze buttons (after photo selected) */}
          {imageUrl && (
            <div style={{
              textAlign: 'center', padding: '8px 0 32px',
              animation: 'lj-fadeUp 0.5s ease-out',
            }}>
              <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
                <button
                  onClick={handleReset}
                  style={{
                    padding: '11px 26px', background: 'transparent',
                    border: '1px solid rgba(126,200,227,0.35)', color: '#7ec8e3',
                    borderRadius: '50px', cursor: 'pointer', fontSize: '13px',
                    fontFamily: "'Quicksand', sans-serif", fontWeight: 500, letterSpacing: '2px',
                    transition: 'all 0.25s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(126,200,227,0.08)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                >
                  重选
                </button>
                <button
                  onClick={handleAnalyze}
                  style={{
                    padding: '11px 34px',
                    background: 'linear-gradient(135deg, #7ec8e3, #a8d8ea)',
                    border: 'none', color: '#fff', borderRadius: '50px', cursor: 'pointer',
                    fontSize: '13px', fontFamily: "'Quicksand', sans-serif",
                    fontWeight: 600, letterSpacing: '3px',
                    boxShadow: '0 4px 18px rgba(126,200,227,0.3)',
                    transition: 'all 0.25s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 24px rgba(126,200,227,0.45)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 18px rgba(126,200,227,0.3)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
                >
                  聆 听 此 境
                </button>
              </div>
              {error && (
                <p style={{ color: '#c97070', fontSize: '12px', marginTop: '10px', letterSpacing: '1px' }}>
                  {error}
                </p>
              )}
            </div>
          )}
        </>
      )}

      {/* ═══ ANALYZING ═══ */}
      {phase === 'analyzing' && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: '60vh',
          animation: 'lj-fadeUp 0.6s ease-out',
        }}>
          {imageUrl && (
            <div style={{
              width: '130px', height: '130px', borderRadius: '50%', overflow: 'hidden',
              border: '2px solid rgba(126,200,227,0.25)', marginBottom: '28px',
              boxShadow: '0 0 30px rgba(126,200,227,0.12)',
            }}>
              <img src={imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <div style={{
            width: '26px', height: '26px',
            border: '2px solid rgba(126,200,227,0.15)',
            borderTopColor: '#7ec8e3', borderRadius: '50%',
            animation: 'lj-spin 0.9s linear infinite', marginBottom: '18px',
          }} />
          <p style={{
            color: 'rgba(126,200,227,0.55)', fontSize: '13px', letterSpacing: '3px',
            animation: 'lj-breathe 2.5s ease-in-out infinite',
          }}>
            {loadText}
          </p>
        </div>
      )}

      {/* ═══ RESULT ═══ */}
      {phase === 'result' && result && imageUrl && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: 'clamp(16px,2.5vh,32px) 20px 48px',
          animation: 'lj-slideUp 0.8s cubic-bezier(0.22,1,0.36,1)',
        }}>
          {/* Spline — enlarged */}
          <div style={{
            width: isMobile ? '320px' : '460px',
            height: isMobile ? '440px' : '520px',
            borderRadius: '24px', overflow: 'hidden',
            boxShadow: '0 12px 50px rgba(126,200,227,0.18)',
            marginBottom: '28px', flexShrink: 0,
          }}>
            <iframe
              src={SPLINE_URL}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="3D Music Player"
              allow="autoplay"
            />
          </div>

          {/* Result info + save/streaming (preserved from ResultCard) */}
          <div style={{ width: '100%', maxWidth: '460px' }}>
            <ResultCard result={result} imageUrl={imageUrl} onReset={handleReset} />
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); e.target.value = ''; }}
      />

      {/* Keyframes */}
      <style>{`
        @keyframes lj-fadeUp  { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes lj-spin    { to { transform:rotate(360deg); } }
        @keyframes lj-breathe { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
        @keyframes lj-slideUp { from { opacity:0; transform:translateY(30px) scale(0.96); } to { opacity:1; transform:translateY(0) scale(1); } }
      `}</style>

      {/* Footer */}
      <p style={{
        position: 'fixed', bottom: '10px', left: 0, right: 0,
        textAlign: 'center', fontSize: '9px',
        color: 'rgba(126,200,227,0.25)', letterSpacing: '2px',
        fontFamily: "'Quicksand', sans-serif", pointerEvents: 'none',
      }}>
        Powered by Claude Vision
      </p>
    </div>
  );
}
