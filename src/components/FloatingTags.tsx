import { useMemo } from 'react';

interface FloatingTagsProps {
  tags: string[];
}

// Warm white / amber tones for dark cinema theme
const TAG_COLORS = [
  'rgba(245,240,232,VAL)',
  'rgba(200,160,80,VAL)',
  'rgba(220,205,175,VAL)',
  'rgba(180,150,100,VAL)',
  'rgba(240,228,210,VAL)',
  'rgba(160,138,98,VAL)',
];

export function FloatingTags({ tags }: FloatingTagsProps) {
  const items = useMemo(
    () =>
      tags.map((tag, i) => {
        const op = 0.18 + Math.random() * 0.28;
        const bl = (Math.random() * 1.5).toFixed(1);
        const colorTemplate = TAG_COLORS[i % TAG_COLORS.length];
        return {
          tag,
          top: `${4 + Math.random() * 88}%`,
          left: `${3 + Math.random() * 88}%`,
          duration: `${9 + Math.random() * 14}s`,
          delay: `${-(Math.random() * 12).toFixed(1)}s`,
          animClass: `float-${(i % 6) + 1}`,
          fontSize: `${0.68 + Math.random() * 0.5}rem`,
          color: colorTemplate.replace('VAL', String(op)),
          op,
          bl,
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tags.join(',')],
  );

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        pointerEvents: 'none', overflow: 'hidden',
        zIndex: 4,
      }}
    >
      {items.map(({ tag, top, left, duration, delay, animClass, fontSize, color, op, bl }) => (
        <span
          key={tag}
          className={animClass}
          style={
            {
              position: 'absolute',
              top, left,
              animationDuration: duration,
              animationDelay: delay,
              fontSize,
              fontFamily: '"Noto Serif SC", serif',
              color,
              letterSpacing: '0.12em',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              textShadow: '0 0 14px rgba(200,160,80,0.25)',
              '--op': op,
              '--bl': `${bl}px`,
            } as React.CSSProperties
          }
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
