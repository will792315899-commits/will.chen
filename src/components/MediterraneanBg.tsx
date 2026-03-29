export function MediterraneanBg() {
  return (
    <>
      {/* Sky gradient */}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: 'linear-gradient(180deg, #1b4f72 0%, #2471a3 22%, #5dade2 52%, #a9cce3 80%, #d4e6f1 100%)',
        }}
      />

      {/* Drifting clouds */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
        <div className="med-cloud med-cloud-1" />
        <div className="med-cloud med-cloud-2" />
        <div className="med-cloud med-cloud-3" />
        <div className="med-cloud med-cloud-4" />
      </div>

      {/* Ocean waves at bottom */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 2,
        pointerEvents: 'none', overflow: 'hidden', height: '90px',
      }}>
        {/* Wave layer 1 */}
        <div className="med-wave-1" style={{ position: 'absolute', bottom: 0, left: 0, display: 'flex', width: '200vw' }}>
          {[0, 1].map(i => (
            <svg key={i} style={{ width: '100vw', height: '90px', flexShrink: 0 }} viewBox="0 0 1440 90" preserveAspectRatio="none">
              <path
                d="M0,45 C120,70 240,22 360,48 C480,74 600,28 720,45 C840,62 960,30 1080,46 C1200,62 1320,38 1440,45 L1440,90 L0,90 Z"
                fill="rgba(72,201,176,0.4)"
              />
            </svg>
          ))}
        </div>
        {/* Wave layer 2 */}
        <div className="med-wave-2" style={{ position: 'absolute', bottom: 0, left: 0, display: 'flex', width: '200vw' }}>
          {[0, 1].map(i => (
            <svg key={i} style={{ width: '100vw', height: '90px', flexShrink: 0 }} viewBox="0 0 1440 90" preserveAspectRatio="none">
              <path
                d="M0,58 C180,32 360,72 540,50 C720,28 900,64 1080,52 C1260,40 1350,58 1440,55 L1440,90 L0,90 Z"
                fill="rgba(52,152,219,0.3)"
              />
            </svg>
          ))}
        </div>
        {/* Wave layer 3 — opaque base */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30px', background: 'rgba(41,128,185,0.45)' }} />
      </div>

      {/* Plant decoration — bottom-left */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, zIndex: 3, pointerEvents: 'none' }}>
        <svg width="110" height="160" viewBox="0 0 110 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M55 160 Q52 125 42 95 Q36 75 24 55" stroke="#3a6644" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M42 95 Q18 85 13 66 Q32 70 42 95 Z" fill="#4a7c59" opacity="0.9"/>
          <path d="M46 112 Q20 100 16 80 Q38 88 46 112 Z" fill="#5a9a6a" opacity="0.82"/>
          <path d="M50 130 Q26 118 22 100 Q44 110 50 130 Z" fill="#4a7c59" opacity="0.88"/>
          <path d="M40 80 Q56 58 74 52 Q65 68 40 80 Z" fill="#5a9a6a" opacity="0.78"/>
          <path d="M35 62 Q48 42 66 38 Q57 55 35 62 Z" fill="#4a7c59" opacity="0.72"/>
          <ellipse cx="55" cy="158" rx="16" ry="6" fill="#3a6644" opacity="0.4"/>
        </svg>
      </div>

      {/* Plant decoration — bottom-right (mirrored) */}
      <div style={{ position: 'fixed', bottom: 0, right: 0, zIndex: 3, pointerEvents: 'none' }}>
        <svg width="110" height="160" viewBox="0 0 110 160" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'scaleX(-1)' }}>
          <path d="M55 160 Q52 125 42 95 Q36 75 24 55" stroke="#3a6644" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M42 95 Q18 85 13 66 Q32 70 42 95 Z" fill="#4a7c59" opacity="0.9"/>
          <path d="M46 112 Q20 100 16 80 Q38 88 46 112 Z" fill="#5a9a6a" opacity="0.82"/>
          <path d="M50 130 Q26 118 22 100 Q44 110 50 130 Z" fill="#4a7c59" opacity="0.88"/>
          <path d="M40 80 Q56 58 74 52 Q65 68 40 80 Z" fill="#5a9a6a" opacity="0.78"/>
          <path d="M35 62 Q48 42 66 38 Q57 55 35 62 Z" fill="#4a7c59" opacity="0.72"/>
          <ellipse cx="55" cy="158" rx="16" ry="6" fill="#3a6644" opacity="0.4"/>
        </svg>
      </div>
    </>
  );
}
