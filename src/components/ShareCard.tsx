import { forwardRef } from 'react';
import type { AnalysisResult } from '../types';

interface ShareCardProps {
  result: AnalysisResult;
  imageUrl: string;
}

/**
 * A visually designed card intended for html2canvas capture.
 * Rendered off-screen; captured on demand.
 * Avoid backdrop-filter / box-shadow (html2canvas support is limited).
 */
export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(({ result, imageUrl }, ref) => {
  const gold = (a: number) => `rgba(201,168,76,${a})`;

  return (
    <div
      ref={ref}
      style={{
        width: '375px',
        background: '#0a0a0f',
        overflow: 'hidden',
        fontFamily: '"Noto Serif SC", serif',
      }}
    >
      {/* ── Photo section ─────────────────────────────────── */}
      <div style={{ position: 'relative', width: '375px', height: '375px', overflow: 'hidden' }}>
        <img
          src={imageUrl}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {/* Bottom gradient fade */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent 55%, rgba(10,10,15,0.97) 100%)',
        }} />
        {/* Mood badge overlaid on photo */}
        <div style={{
          position: 'absolute', top: '14px', left: '14px',
          padding: '4px 12px',
          borderRadius: '9999px',
          background: 'rgba(10,10,15,0.7)',
          border: `1px solid ${gold(0.45)}`,
          color: '#c9a84c',
          fontSize: '12px',
          letterSpacing: '0.12em',
        }}>
          {result.mood}
        </div>
      </div>

      {/* ── Content section ───────────────────────────────── */}
      <div style={{ padding: '20px 24px 0' }}>
        {/* Song title */}
        <div style={{
          fontFamily: '"DM Serif Display", serif',
          fontSize: '30px',
          color: '#e8d5a3',
          letterSpacing: '-0.02em',
          lineHeight: 1.15,
          marginBottom: '6px',
        }}>
          {result.song}
        </div>

        {/* Artist */}
        <div style={{
          color: gold(0.62),
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
            background: gold(0.07),
            border: `1px solid ${gold(0.2)}`,
            color: gold(0.55),
            fontSize: '11px',
            letterSpacing: '0.08em',
          }}>
            {result.atmosphere}
          </span>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: `linear-gradient(to right, transparent, ${gold(0.3)}, transparent)`,
          marginBottom: '18px',
        }} />

        {/* Reason */}
        <div style={{
          fontStyle: 'italic',
          color: 'rgba(232,213,163,0.82)',
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
              background: gold(0.06),
              border: `1px solid ${gold(0.17)}`,
              color: gold(0.55),
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
          background: `linear-gradient(to right, transparent, ${gold(0.18)}, transparent)`,
          marginBottom: '16px',
        }} />
      </div>

      {/* ── Watermark ─────────────────────────────────────── */}
      <div style={{
        padding: '0 24px 20px',
        textAlign: 'center',
        color: gold(0.3),
        fontSize: '11px',
        letterSpacing: '0.35em',
        fontFamily: '"Noto Serif SC", serif',
      }}>
        聆·境 — 照片调音师
      </div>
    </div>
  );
});

ShareCard.displayName = 'ShareCard';
