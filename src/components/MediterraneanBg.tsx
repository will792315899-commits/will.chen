export function MediterraneanBg() {
  return (
    <>
      {/* Deep dark base */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: '#0d0d0d' }} />

      {/* Warm orange ambient glow — bottom-left (sunset through window) */}
      <div className="amb-orb amb-orb-warm" />

      {/* Cool blue ambient glow — top-right */}
      <div className="amb-orb amb-orb-cool" />

      {/* Film-grain / noise texture overlay */}
      <svg
        style={{ position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none', width: '100%', height: '100%' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="film-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" result="noise" />
          <feColorMatrix type="saturate" values="0" in="noise" result="grey" />
          <feBlend in="SourceGraphic" in2="grey" mode="overlay" />
        </filter>
        <rect width="100%" height="100%" filter="url(#film-grain)" opacity="0.042" />
      </svg>

      {/* Bottom thin warm gradient line */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10, pointerEvents: 'none',
        height: '1px',
        background: 'linear-gradient(to right, transparent 0%, rgba(200,160,80,0.35) 25%, rgba(200,160,80,0.6) 50%, rgba(200,160,80,0.35) 75%, transparent 100%)',
      }} />
    </>
  );
}
