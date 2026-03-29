import { forwardRef } from 'react';
import type { AnalysisResult } from '../types';

interface ShareCardProps {
  result: AnalysisResult;
  imageUrl: string;
}

/**
 * Mediterranean-styled share card for html2canvas capture.
 * Rendered off-screen; captured on demand.
 * Avoid backdrop-filter / box-shadow (html2canvas support is limited).
 */
export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(({ result, imageUrl }, ref) => {
  const deep = (a: number) => `rgba(26,82,118,${a})`;
  const teal = (a: number) => `rgba(72,201,176,${a})`;

  return (
    <div
      ref={ref}
      style={{
        width: '375px',
        background: '#f5f0e8',
        overflow: 'hidden',
        fontFamily: '"Noto Serif SC", serif',
      }}
    >
      {/* ── Photo section ── */}
      <div style={{ position: 'relative', width: '375px', height: '375px', overflow: 'hidden' }}>
        <img
          src={imageUrl}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {/* Subtle gradient fade at bottom */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent 55%, rgba(245,240,232,0.97) 100%)',
        }} />
        {/* Mood badge */}
        <div style={{
          position: 'absolute', top: '14px', left: '14px',
          padding: '4px 12px',
          borderRadius: '9999px',
          background: 'rgba(255,252,245,0.88)',
          border: `1px solid ${deep(0.4)}`,
          color: '#1a5276',
          fontSize: '12px',
          letterSpacing: '0.12em',
        }}>
          {result.mood}
        </div>
      </div>

      {/* ── Content section ── */}
      <div style={{ padding: '20px 24px 0', background: '#f5f0e8' }}>
        {/* Song title */}
        <div style={{
          fontFamily: '"Playfair Display", "Cormorant Garamond", serif',
          fontSize: '28px',
          color: '#1a3a52',
          letterSpacing: '-0.01em',
          lineHeight: 1.2,
          marginBottom: '6px',
        }}>
          {result.song}
        </div>

        {/* Artist */}
        <div style={{
          color: deep(0.62),
          fontSize: '13px',
          letterSpacing: '0.14em',
          marginBottom: '18px',
        }}>
          {result.artist}
        </div>

        {/* Atmosphere pill */}
        <div style={{ marginBottom: '18px' }}>
          <span style={{
            padding: '3px 10px',
            borderRadius: '9999px',
            background: teal(0.1),
            border: `1px solid ${teal(0.35)}`,
            color: 'rgba(40,150,130,0.85)',
            fontSize: '11px',
            letterSpacing: '0.08em',
          }}>
            {result.atmosphere}
          </span>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: `linear-gradient(to right, transparent, ${deep(0.25)}, transparent)`,
          marginBottom: '18px',
        }} />

        {/* Reason */}
        <div style={{
          fontStyle: 'italic',
          color: 'rgba(44,62,80,0.8)',
          fontSize: '14px',
          lineHeight: 1.9,
          letterSpacing: '0.06em',
          textAlign: 'center',
          marginBottom: '18px',
          padding: '0 4px',
        }}>
          「{result.reason}」
        </div>

        {/* Tags */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '6px',
          justifyContent: 'center', marginBottom: '20px',
        }}>
          {result.tags.map(tag => (
            <span key={tag} style={{
              padding: '3px 9px',
              borderRadius: '4px',
              background: deep(0.07),
              border: `1px solid ${deep(0.18)}`,
              color: deep(0.6),
              fontSize: '11px',
              letterSpacing: '0.08em',
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: `linear-gradient(to right, transparent, ${deep(0.15)}, transparent)`,
          marginBottom: '16px',
        }} />
      </div>

      {/* ── Watermark ── */}
      <div style={{
        padding: '0 24px 20px',
        textAlign: 'center',
        color: deep(0.32),
        fontSize: '11px',
        letterSpacing: '0.35em',
        fontFamily: '"Noto Serif SC", serif',
        background: '#f5f0e8',
      }}>
        聆·境 — 照片调音师
      </div>
    </div>
  );
});

ShareCard.displayName = 'ShareCard';
