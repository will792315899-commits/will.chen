import { useMemo } from 'react';

interface FloatingTagsProps {
  tags: string[];
}

export function FloatingTags({ tags }: FloatingTagsProps) {
  const items = useMemo(
    () =>
      tags.map((tag, i) => {
        const op = 0.22 + Math.random() * 0.45;
        const bl = (Math.random() * 2).toFixed(1);
        return {
          tag,
          top: `${4 + Math.random() * 88}%`,
          left: `${3 + Math.random() * 88}%`,
          duration: `${9 + Math.random() * 14}s`,
          delay: `${-(Math.random() * 12).toFixed(1)}s`,
          animClass: `float-${(i % 6) + 1}`,
          fontSize: `${0.68 + Math.random() * 0.55}rem`,
          // CSS custom properties passed via style
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
        zIndex: 1,
      }}
    >
      {items.map(({ tag, top, left, duration, delay, animClass, fontSize, op, bl }) => (
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
              color: '#c9a84c',
              letterSpacing: '0.12em',
              userSelect: 'none',
              whiteSpace: 'nowrap',
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
