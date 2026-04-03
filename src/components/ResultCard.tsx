import { useRef, useState } from 'react';
import type { AnalysisResult } from '../types';
import { AudioWave } from './AudioWave';
import { ShareCard } from './ShareCard';
import { captureAndDownload, toSafeFilename, dateTag } from '../utils/saveImage';

interface ResultCardProps {
  result: AnalysisResult;
  imageUrl: string;
  onReset: () => void;
}

export function ResultCard({ result, imageUrl, onReset }: ResultCardProps) {
  const shareCardRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async (type: 'share' | 'album') => {
    if (!shareCardRef.current || saving) return;
    setSaving(true);
    try {
      const filename =
        type === 'album'
          ? `聆境_${toSafeFilename(result.song)}_${dateTag()}.png`
          : `聆境分享卡_${dateTag()}.png`;
      await captureAndDownload(shareCardRef.current, filename);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* ── Hidden ShareCard (off-screen for html2canvas) ── */}
      <div style={{ position: 'fixed', top: '-10000px', left: 0, zIndex: -1, pointerEvents: 'none' }}>
        <ShareCard ref={shareCardRef} result={result} imageUrl={imageUrl} />
      </div>

      {/* ── Visible result card ── */}
      <div
        style={{
          background: 'rgba(14,11,8,0.88)',
          border: '1px solid rgba(245,240,232,0.08)',
          borderRadius: '20px',
          padding: '2rem',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.65), 0 0 0 0.5px rgba(245,240,232,0.05) inset',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Warm glow corner */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, width: '250px', height: '250px',
          background: 'radial-gradient(circle at bottom left, rgba(180,120,50,0.08), transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Top: image + song info */}
        <div style={{ display: 'flex', gap: '1.4rem', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
          <div style={{ flexShrink: 0 }}>
            <img
              src={imageUrl}
              alt="uploaded"
              style={{
                width: '120px', height: '120px', objectFit: 'cover',
                borderRadius: '14px',
                border: '1px solid rgba(245,240,232,0.1)',
                boxShadow: '0 8px 60px rgba(180,120,50,0.25), 0 4px 20px rgba(0,0,0,0.5)',
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Mood + atmosphere tags */}
            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
              <span style={{
                padding: '0.18rem 0.7rem', borderRadius: '9999px', fontSize: '0.7rem',
                background: 'rgba(200,160,80,0.1)', border: '1px solid rgba(200,160,80,0.25)',
                color: 'rgba(200,160,80,0.8)', fontFamily: '"Noto Serif SC", serif', letterSpacing: '0.08em',
              }}>{result.mood}</span>
              <span style={{
                padding: '0.18rem 0.7rem', borderRadius: '9999px', fontSize: '0.7rem',
                background: 'rgba(245,240,232,0.05)', border: '1px solid rgba(245,240,232,0.15)',
                color: 'rgba(245,240,232,0.5)', fontFamily: '"Noto Serif SC", serif', letterSpacing: '0.05em',
              }}>{result.atmosphere}</span>
            </div>
            {/* Song name */}
            <h2 style={{
              fontFamily: '"Playfair Display", "Cormorant Garamond", serif',
              fontSize: 'clamp(1.5rem, 4.5vw, 2.1rem)',
              color: '#f5f0e8',
              letterSpacing: '-0.01em', lineHeight: 1.15, marginBottom: '0.45rem',
              textShadow: '0 2px 20px rgba(200,160,80,0.15)',
            }}>{result.song}</h2>
            {/* Artist */}
            <p style={{
              fontFamily: '"Noto Serif SC", serif',
              color: 'rgba(245,240,232,0.45)',
              fontSize: '0.85rem', letterSpacing: '0.12em',
            }}>{result.artist}</p>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(245,240,232,0.1), transparent)',
          marginBottom: '1.5rem',
        }} />

        {/* Poetic reason */}
        <blockquote style={{
          fontFamily: '"Playfair Display", "Noto Serif SC", serif',
          fontStyle: 'italic',
          color: 'rgba(245,240,232,0.65)',
          fontSize: '0.95rem',
          lineHeight: 1.8, letterSpacing: '0.05em',
          textAlign: 'center', marginBottom: '1.5rem', padding: '0 0.5rem',
        }}>
          「{result.reason}」
        </blockquote>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
          {result.tags.map((tag) => (
            <span key={tag} style={{
              padding: '0.2rem 0.65rem', borderRadius: '6px', fontSize: '0.7rem',
              background: 'transparent', border: '1px solid rgba(245,240,232,0.15)',
              color: 'rgba(245,240,232,0.45)', fontFamily: '"Noto Serif SC", serif', letterSpacing: '0.08em',
            }}>{tag}</span>
          ))}
        </div>

        {/* Wave */}
        <AudioWave active={true} height={44} />

        {/* ── Save buttons ── */}
        <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.25rem' }}>
          <button
            onClick={() => handleSave('share')}
            disabled={saving}
            className="btn-gold"
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
              padding: '0.58rem 0', fontSize: '0.76rem', letterSpacing: '0.08em',
              opacity: saving ? 0.5 : 1, cursor: saving ? 'not-allowed' : 'pointer',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6.5 1v7M4 6l2.5 2.5L9 6"/>
              <path d="M1 10v1.5a.5.5 0 00.5.5h10a.5.5 0 00.5-.5V10"/>
            </svg>
            {saving ? '生成中…' : '保存为图片'}
          </button>

          <button
            onClick={() => handleSave('album')}
            disabled={saving}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
              padding: '0.58rem 0',
              borderRadius: '9999px',
              background: 'transparent',
              border: '1px solid rgba(245,240,232,0.25)',
              color: saving ? 'rgba(245,240,232,0.25)' : 'rgba(245,240,232,0.65)',
              fontFamily: '"Noto Serif SC", serif',
              fontSize: '0.76rem', letterSpacing: '0.08em',
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'all 0.25s',
            }}
            onMouseEnter={(e) => { if (!saving) { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(245,240,232,0.55)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(245,240,232,0.9)'; } }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(245,240,232,0.25)'; (e.currentTarget as HTMLButtonElement).style.color = saving ? 'rgba(245,240,232,0.25)' : 'rgba(245,240,232,0.65)'; }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="1" width="11" height="11" rx="2"/>
              <circle cx="4.5" cy="4.5" r="1.2"/>
              <path d="M1 8.5l3-3 2.5 2.5 2-2 2.5 2.5"/>
            </svg>
            {saving ? '生成中…' : '保存到相册'}
          </button>
        </div>

        {/* ── Streaming buttons ── */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.65rem' }}>
          <a
            href={`https://open.spotify.com/search/${encodeURIComponent(`${result.song} ${result.artist}`)}`}
            target="_blank" rel="noopener noreferrer"
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              padding: '0.6rem 0', borderRadius: '9999px',
              background: 'rgba(30,215,96,0.06)', border: '1px solid rgba(30,215,96,0.22)',
              color: 'rgba(30,200,90,0.75)', fontFamily: '"Noto Serif SC", serif',
              fontSize: '0.78rem', letterSpacing: '0.08em', textDecoration: 'none', transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(30,215,96,0.12)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(30,215,96,0.45)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(30,215,96,0.06)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(30,215,96,0.22)'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            在 Spotify 收听
          </a>
          <a
            href={`https://music.apple.com/search?term=${encodeURIComponent(`${result.song} ${result.artist}`)}`}
            target="_blank" rel="noopener noreferrer"
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              padding: '0.6rem 0', borderRadius: '9999px',
              background: 'rgba(252,60,68,0.05)', border: '1px solid rgba(252,60,68,0.2)',
              color: 'rgba(220,60,70,0.72)', fontFamily: '"Noto Serif SC", serif',
              fontSize: '0.78rem', letterSpacing: '0.08em', textDecoration: 'none', transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(252,60,68,0.1)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(252,60,68,0.42)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(252,60,68,0.05)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(252,60,68,0.2)'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026C4.786.07 4.043.15 3.34.428 2.004.958 1.04 1.88.475 3.208c-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.726.172 1.439.487 2.112.48 1.021 1.258 1.75 2.276 2.252.6.293 1.246.403 1.903.454a16.146 16.146 0 001.562.15c.04.003.083.01.124.013H18.01c.14-.01.282-.017.423-.027.76-.05 1.497-.176 2.188-.487 1.293-.57 2.159-1.504 2.64-2.835.16-.448.25-.912.296-1.382.044-.43.065-.862.065-1.293V6.124zm-8.06 1.128l-5.07 2.99v5.78c0 .642-.52 1.162-1.162 1.162s-1.163-.52-1.163-1.163V8.138c0-.414.22-.798.578-1.007l6.234-3.675c.643-.379 1.46-.165 1.839.478.38.643.165 1.46-.479 1.839l-.777.479z"/>
            </svg>
            在 Apple Music 收听
          </a>
        </div>

        {/* Reset */}
        <div style={{ textAlign: 'center', marginTop: '1.1rem' }}>
          <button className="btn-ghost" onClick={onReset}>↩ 换一张照片</button>
        </div>
      </div>
    </>
  );
}
