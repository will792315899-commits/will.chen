export function MediterraneanBg() {
  return (
    <>
      {/* Sky gradient — realistic Mediterranean afternoon */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'linear-gradient(180deg, #1a5276 0%, #5dade2 55%, #fdf6e3 100%)',
      }} />

      {/* Noise / plaster texture overlay */}
      <svg
        style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', width: '100%', height: '100%' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="med-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="4" stitchTiles="stitch" result="noise" />
          <feColorMatrix type="saturate" values="0" in="noise" result="grey" />
          <feBlend in="SourceGraphic" in2="grey" mode="overlay" />
        </filter>
        <rect width="100%" height="100%" filter="url(#med-noise)" opacity="0.055" />
      </svg>

      {/* Floating sunlight orbs — warm afternoon light through windows */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none', overflow: 'hidden' }}>
        <div className="sun-orb sun-orb-1" />
        <div className="sun-orb sun-orb-2" />
        <div className="sun-orb sun-orb-3" />
        <div className="sun-orb sun-orb-4" />
      </div>

      {/* Sea horizon — simple teal line at bottom */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 3, pointerEvents: 'none',
        height: '5px',
        background: 'linear-gradient(to right, transparent 0%, #48c9b0 20%, #1abc9c 50%, #48c9b0 80%, transparent 100%)',
        opacity: 0.75,
        boxShadow: '0 0 18px rgba(72,201,176,0.45)',
      }} />
    </>
  );
}
