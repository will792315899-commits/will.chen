interface ElectricWaveProps {
  vertical?: boolean;
}

export function ElectricWave({ vertical = false }: ElectricWaveProps) {
  if (vertical) {
    return (
      <svg width="40" height="90" viewBox="0 0 40 90" style={{ overflow: 'visible', display: 'block', margin: '0 auto' }}>
        <defs>
          <linearGradient id="ewv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a8d8ea" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#7ec8e3" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#a8d8ea" stopOpacity="0.4" />
          </linearGradient>
          <filter id="glow-v">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <path
          d="M20,0 Q5,15 20,22 T20,45 T20,67 T20,90"
          fill="none" stroke="url(#ewv)" strokeWidth="2" strokeLinecap="round"
        >
          <animate attributeName="stroke-dasharray" values="4,6;8,4;4,6" dur="1.5s" repeatCount="indefinite" />
        </path>
        <circle r="3.5" fill="#7ec8e3" filter="url(#glow-v)" opacity="0.85">
          <animateMotion path="M20,0 Q5,15 20,22 T20,45 T20,67 T20,90" dur="1.2s" repeatCount="indefinite" />
        </circle>
        <circle r="2" fill="#a8d8ea" opacity="0.45">
          <animateMotion path="M20,0 Q35,15 20,22 T20,45 T20,67 T20,90" dur="1.2s" begin="0.4s" repeatCount="indefinite" />
        </circle>
      </svg>
    );
  }

  return (
    <svg width="100" height="50" viewBox="0 0 100 50" style={{ overflow: 'visible', display: 'block' }}>
      <defs>
        <linearGradient id="ewh" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a8d8ea" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#7ec8e3" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#a8d8ea" stopOpacity="0.4" />
        </linearGradient>
        <filter id="glow-h">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path
        d="M0,25 Q12,8 25,25 T50,25 T75,25 T100,25"
        fill="none" stroke="url(#ewh)" strokeWidth="2" strokeLinecap="round"
      >
        <animate attributeName="stroke-dasharray" values="4,6;8,4;4,6" dur="1.5s" repeatCount="indefinite" />
      </path>
      <circle r="3.5" fill="#7ec8e3" filter="url(#glow-h)" opacity="0.85">
        <animateMotion path="M0,25 Q12,8 25,25 T50,25 T75,25 T100,25" dur="1.2s" repeatCount="indefinite" />
      </circle>
      <circle r="2" fill="#a8d8ea" opacity="0.45">
        <animateMotion path="M0,25 Q12,42 25,25 T50,25 T75,25 T100,25" dur="1.2s" begin="0.4s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
