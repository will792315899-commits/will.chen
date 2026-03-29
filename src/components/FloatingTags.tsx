import { useMemo } from 'react';

interface FloatingTagsProps {
  tags: string[];
}

// Mediterranean tag colors — blue, teal, terracotta, sage, lavender
const TAG_COLORS = [
  'rgba(26,82,118,VAL)',
  'rgba(72,201,176,VAL)',
  'rgba(192,132,109,VAL)',
  'rgba(74,124,89,VAL)',
  'rgba(150,123,182,VAL)',
  'rgba(52,152,219,VAL)',
];

export function FloatingTags({ tags }: FloatingTagsProps) {
  const items = useMemo(
    () =>
      tags.map((tag, i) => {
        const op = 0.28 + Math.random() * 0.42;
        const bl = (Math.random() * 1.5).toFixed(1);
        const colorTemplate = TAG_COLORS[i % TAG_COLORS.length];
        return {
          tag,
          top: `${4 + Math.random() * 88}%`,
          left: `${3 + Math.random() * 88}%`,
          duration: `${9 + Math.random() * 14}s`,
          delay: `${-(Math.random() * 12).toFixed(1)}s`,
          animClass: `float-${(i % 6) + 1}`,
          fontSize: `${0.68 + Math.random() * 0.55}rem`,
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
              textShadow: '0 1px 4px rgba(255,255,255,0.4)',
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
