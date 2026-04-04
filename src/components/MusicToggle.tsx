import { useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';

// ── Music design ─────────────────────────────────────────────────────────────
// BPM 56, 4/4, 4-bar loop: Am → F → C → G
// Layer 1 (piano):  PolySynth / triangle, slow arpeggio + sparkle notes
// Layer 2 (pad):    PolySynth / FMSynth, long swelling chords
// FX:               Reverb (6 s decay) + subtle FeedbackDelay

type PianoEvent = { time: string; notes: string | string[]; dur: string };
type PadEvent   = { time: string; notes: string[];           dur: string };

const PIANO_EVENTS: PianoEvent[] = [
  { time: '0:0',   notes: 'A3',        dur: '4n' },
  { time: '0:1',   notes: 'C4',        dur: '4n' },
  { time: '0:2',   notes: 'E4',        dur: '4n' },
  { time: '0:2:2', notes: 'A4',        dur: '8n' },
  { time: '0:3',   notes: 'C4',        dur: '4n' },
  { time: '1:0',   notes: 'F3',        dur: '4n' },
  { time: '1:1',   notes: 'A3',        dur: '4n' },
  { time: '1:2',   notes: 'C4',        dur: '4n' },
  { time: '1:3',   notes: 'A3',        dur: '4n' },
  { time: '2:0',   notes: 'C4',        dur: '4n' },
  { time: '2:1',   notes: 'E4',        dur: '4n' },
  { time: '2:2',   notes: 'G4',        dur: '4n' },
  { time: '2:2:2', notes: 'C5',        dur: '8n' },
  { time: '2:3',   notes: 'E4',        dur: '4n' },
  { time: '3:0',   notes: 'G3',        dur: '4n' },
  { time: '3:1',   notes: 'B3',        dur: '4n' },
  { time: '3:2',   notes: 'D4',        dur: '4n' },
  { time: '3:3',   notes: 'B3',        dur: '4n' },
];

const PAD_EVENTS: PadEvent[] = [
  { time: '0:0', notes: ['A2', 'E3', 'A3'], dur: '1m' },
  { time: '1:0', notes: ['F2', 'C3', 'F3'], dur: '1m' },
  { time: '2:0', notes: ['C3', 'G3', 'C4'], dur: '1m' },
  { time: '3:0', notes: ['G2', 'D3', 'G3'], dur: '1m' },
];

export function MusicToggle() {
  const [isPlaying, setIsPlaying]   = useState(false);
  const [isHovered, setIsHovered]   = useState(false);
  const initializedRef = useRef(false);

  const initAudio = async () => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    await Tone.start();

    const reverb = new Tone.Reverb({ decay: 6, wet: 0.6 }).toDestination();
    await reverb.ready;
    const delay = new Tone.FeedbackDelay({ delayTime: '8n', feedback: 0.18, wet: 0.12 }).connect(reverb);

    const piano = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle8' },
      envelope: { attack: 0.35, decay: 1.2, sustain: 0.25, release: 4 },
      volume: -13,
    }).connect(delay);

    const pad = new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 0.5,
      modulationIndex: 1,
      oscillator: { type: 'sine' },
      envelope: { attack: 2.5, decay: 1, sustain: 0.8, release: 6 },
      modulation: { type: 'sine' },
      modulationEnvelope: { attack: 2, decay: 1, sustain: 0.5, release: 5 },
      volume: -22,
    }).connect(reverb);

    const transport = Tone.getTransport();
    transport.bpm.value = 56;
    transport.loop = true;
    transport.loopStart = '0:0';
    transport.loopEnd   = '4:0';

    const pianoPart = new Tone.Part<PianoEvent>((time, ev) => {
      piano.triggerAttackRelease(ev.notes, ev.dur, time);
    }, PIANO_EVENTS);
    pianoPart.start(0);

    const padPart = new Tone.Part<PadEvent>((time, ev) => {
      pad.triggerAttackRelease(ev.notes, ev.dur, time);
    }, PAD_EVENTS);
    padPart.start(0);

    transport.start();
    setIsPlaying(true);
  };

  const toggle = async () => {
    if (!initializedRef.current) {
      await initAudio();
      return;
    }
    const transport = Tone.getTransport();
    if (transport.state === 'started') {
      transport.pause();
      setIsPlaying(false);
    } else {
      await Tone.start();
      transport.start();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const handler = () => { if (!initializedRef.current) initAudio(); };
    document.addEventListener('click',      handler, { once: true });
    document.addEventListener('touchstart', handler, { once: true });
    return () => {
      document.removeEventListener('click',      handler);
      document.removeEventListener('touchstart', handler);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => { try { Tone.getTransport().stop(); } catch { /* ignore */ } };
  }, []);

  return (
    <button
      onClick={(e) => { e.stopPropagation(); toggle(); }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={isPlaying ? '静音' : '播放背景音乐'}
      style={{
        position:       'fixed',
        top:            '1.1rem',
        right:          '1.1rem',
        zIndex:         50,
        width:          '38px',
        height:         '38px',
        borderRadius:   '50%',
        background:     isHovered
          ? 'rgba(126,200,227,0.22)'
          : 'rgba(126,200,227,0.12)',
        border:         `1px solid ${isPlaying ? 'rgba(126,200,227,0.65)' : 'rgba(126,200,227,0.3)'}`,
        color:          isPlaying ? '#7ec8e3' : 'rgba(58,107,124,0.6)',
        cursor:         'pointer',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        transition:     'all 0.3s ease',
        padding:        0,
        lineHeight:     1,
        boxShadow:      isPlaying ? '0 0 14px rgba(126,200,227,0.3)' : 'none',
      }}
    >
      {isPlaying ? (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
          <rect x="2" y="2" width="3.5" height="10" rx="1"/>
          <rect x="8.5" y="2" width="3.5" height="10" rx="1"/>
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
          <path d="M5 10.5V3.5l7-1.5v7"/>
          <circle cx="3.5" cy="10.5" r="1.8"/>
          <circle cx="10.5" cy="9" r="1.8"/>
        </svg>
      )}
    </button>
  );
}
