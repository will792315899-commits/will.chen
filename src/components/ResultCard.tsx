import type { AnalysisResult } from '../types';
import { AudioWave } from './AudioWave';

interface ResultCardProps {
  result: AnalysisResult;
  imageUrl: string;
  onReset: () => void;
}

export function ResultCard({ result, imageUrl, onReset }: ResultCardProps) {
  return (
    <div
      style={{
        background: 'rgba(8, 8, 12, 0.88)',
        border: '1px solid rgba(201,168,76,0.28)',
        borderRadius: '20px',
        padding: '2rem',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 0 80px rgba(201,168,76,0.08), 0 0 160px rgba(0,0,0,0.6)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Corner glow */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: '200px', height: '200px',
        background: 'radial-gradient(circle at top right, rgba(201,168,76,0.07), transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Top: image + song info */}
      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        {/* Photo */}
        <div style={{ flexShrink: 0 }}>
          <img
            src={imageUrl}
            alt="uploaded"
            style={{
              width: '108px', height: '108px',
              objectFit: 'cover',
              borderRadius: '10px',
              border: '1px solid rgba(201,168,76,0.25)',
            }}
          />
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Mood + atmosphere pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            <span style={{
              padding: '0.2rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              background: 'rgba(201,168,76,0.14)',
              border: '1px solid rgba(201,168,76,0.4)',
              color: '#c9a84c',
              fontFamily: '"Noto Serif SC", serif',
              letterSpacing: '0.08em',
            }}>
              {result.mood}
            </span>
            <span style={{
              padding: '0.2rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              background: 'rgba(201,168,76,0.06)',
              border: '1px solid rgba(201,168,76,0.2)',
              color: 'rgba(201,168,76,0.65)',
              fontFamily: '"Noto Serif SC", serif',
              letterSpacing: '0.05em',
            }}>
              {result.atmosphere}
            </span>
          </div>

          {/* Song title */}
          <h2 style={{
            fontFamily: '"DM Serif Display", serif',
            fontSize: 'clamp(1.3rem, 4vw, 1.75rem)',
            color: '#e8d5a3',
            letterSpacing: '-0.01em',
            lineHeight: 1.2,
            marginBottom: '0.4rem',
          }}>
            {result.song}
          </h2>

          {/* Artist */}
          <p style={{
            fontFamily: '"Noto Serif SC", serif',
            color: 'rgba(201,168,76,0.65)',
            fontSize: '0.85rem',
            letterSpacing: '0.12em',
          }}>
            {result.artist}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div style={{
        height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.25), transparent)',
        marginBottom: '1.5rem',
      }} />

      {/* Poetic reason */}
      <blockquote style={{
        fontFamily: '"Noto Serif SC", serif',
        fontStyle: 'italic',
        color: 'rgba(232,213,163,0.82)',
        fontSize: '0.95rem',
        lineHeight: 1.9,
        letterSpacing: '0.06em',
        textAlign: 'center',
        marginBottom: '1.5rem',
        padding: '0 0.5rem',
      }}>
        「{result.reason}」
      </blockquote>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
        {result.tags.map((tag) => (
          <span key={tag} style={{
            padding: '0.22rem 0.7rem',
            borderRadius: '6px',
            fontSize: '0.72rem',
            background: 'rgba(201,168,76,0.06)',
            border: '1px solid rgba(201,168,76,0.18)',
            color: 'rgba(201,168,76,0.6)',
            fontFamily: '"Noto Serif SC", serif',
            letterSpacing: '0.08em',
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Wave */}
      <AudioWave active={true} height={50} />

      {/* Streaming buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
        <a
          href={`https://open.spotify.com/search/${encodeURIComponent(`${result.song} ${result.artist}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            padding: '0.6rem 0',
            borderRadius: '9999px',
            background: 'rgba(30,215,96,0.08)',
            border: '1px solid rgba(30,215,96,0.35)',
            color: 'rgba(30,215,96,0.85)',
            fontFamily: '"Noto Serif SC", serif',
            fontSize: '0.78rem',
            letterSpacing: '0.08em',
            textDecoration: 'none',
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(30,215,96,0.15)';
            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(30,215,96,0.7)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(30,215,96,0.08)';
            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(30,215,96,0.35)';
          }}
        >
          {/* Spotify icon */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          在 Spotify 收听
        </a>

        <a
          href={`https://music.apple.com/search?term=${encodeURIComponent(`${result.song} ${result.artist}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            padding: '0.6rem 0',
            borderRadius: '9999px',
            background: 'rgba(252,60,68,0.08)',
            border: '1px solid rgba(252,60,68,0.32)',
            color: 'rgba(252,100,100,0.85)',
            fontFamily: '"Noto Serif SC", serif',
            fontSize: '0.78rem',
            letterSpacing: '0.08em',
            textDecoration: 'none',
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(252,60,68,0.15)';
            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(252,60,68,0.65)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(252,60,68,0.08)';
            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(252,60,68,0.32)';
          }}
        >
          {/* Apple Music icon */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026C4.786.07 4.043.15 3.34.428 2.004.958 1.04 1.88.475 3.208c-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.726.172 1.439.487 2.112.48 1.021 1.258 1.75 2.276 2.252.6.293 1.246.403 1.903.454a16.146 16.146 0 001.562.15c.04.003.083.01.124.013H18.01c.14-.01.282-.017.423-.027.76-.05 1.497-.176 2.188-.487 1.293-.57 2.159-1.504 2.64-2.835.16-.448.25-.912.296-1.382.044-.43.065-.862.065-1.293V6.124zm-8.06 1.128l-5.07 2.99v5.78c0 .642-.52 1.162-1.162 1.162s-1.163-.52-1.163-1.163V8.138c0-.414.22-.798.578-1.007l6.234-3.675c.643-.379 1.46-.165 1.839.478.38.643.165 1.46-.479 1.839l-.777.479z"/>
          </svg>
          在 Apple Music 收听
        </a>
      </div>

      {/* Reset */}
      <div style={{ textAlign: 'center', marginTop: '1.2rem' }}>
        <button className="btn-ghost" onClick={onReset}>
          ↩ 换一张照片
        </button>
      </div>
    </div>
  );
}
