import { useState, useRef } from 'react';
import { getHistory, deleteHistoryItem, type HistoryItem } from '../utils/history';

interface HistoryPanelProps {
  onClose: () => void;
  onSelect: (item: HistoryItem) => void;
}

export function HistoryPanel({ onClose, onSelect }: HistoryPanelProps) {
  const [items, setItems] = useState(getHistory);
  const [swipedId, setSwipedId] = useState<string | null>(null);
  const [longPressId, setLongPressId] = useState<string | null>(null);
  const touchStartX = useRef(0);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDelete = (id: string) => {
    deleteHistoryItem(id);
    setItems(getHistory());
    setSwipedId(null);
    setLongPressId(null);
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return `${d.getFullYear() === new Date().getFullYear() ? '' : d.getFullYear() + '/'}${d.getMonth() + 1}/${d.getDate()}`;
  };

  const isDesktop = () => window.matchMedia('(pointer: fine)').matches;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(5,4,3,0.82)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        display: 'flex', flexDirection: 'column',
      }}
      onClick={() => { setSwipedId(null); setLongPressId(null); }}
    >
      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.25rem 1.25rem 1rem',
        borderBottom: '1px solid rgba(245,240,232,0.08)',
        background: 'rgba(18,15,12,0.95)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ color: 'rgba(200,160,80,0.7)' }}>
            <circle cx="7.5" cy="7.5" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M7.5 4v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span style={{
            fontFamily: '"Noto Serif SC", serif',
            color: 'rgba(245,240,232,0.85)', fontSize: '0.95rem', letterSpacing: '0.2em',
          }}>
            历史记录
          </span>
          <span style={{
            color: 'rgba(245,240,232,0.3)', fontSize: '0.72rem',
            fontFamily: '"Noto Serif SC", serif', letterSpacing: '0.05em',
          }}>
            ({items.length}/20)
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(245,240,232,0.35)', fontSize: '1.1rem', lineHeight: 1,
            fontFamily: '"Noto Serif SC", serif', transition: 'color 0.2s',
            padding: '0.2rem 0.4rem',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(245,240,232,0.75)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(245,240,232,0.35)'; }}
        >
          ✕
        </button>
      </div>

      {/* ── List ── */}
      <div
        style={{
          flex: 1, overflowY: 'auto', padding: '0.75rem',
          background: 'rgba(12,10,8,0.92)',
        }}
        onClick={() => { setSwipedId(null); setLongPressId(null); }}
      >
        {items.length === 0 ? (
          <div style={{
            textAlign: 'center', marginTop: '5rem',
            color: 'rgba(245,240,232,0.25)',
            fontFamily: '"Noto Serif SC", serif',
            fontSize: '0.9rem', letterSpacing: '0.12em',
          }}>
            暂无历史记录
          </div>
        ) : (
          <>
            <p style={{
              textAlign: 'center', marginBottom: '0.75rem',
              color: 'rgba(245,240,232,0.2)', fontSize: '0.7rem',
              fontFamily: '"Noto Serif SC", serif', letterSpacing: '0.08em',
            }}>
              左滑或长按条目可删除
            </p>

            {items.map(item => {
              const revealed = swipedId === item.id || longPressId === item.id;
              return (
                <div
                  key={item.id}
                  style={{ position: 'relative', marginBottom: '0.55rem', borderRadius: '10px', overflow: 'hidden' }}
                >
                  {/* Delete button */}
                  <div
                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                    style={{
                      position: 'absolute', right: 0, top: 0, bottom: 0, width: '76px',
                      background: 'rgba(180,50,40,0.75)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'rgba(245,240,232,0.9)', fontSize: '0.8rem',
                      fontFamily: '"Noto Serif SC", serif', cursor: 'pointer',
                      borderRadius: '0 10px 10px 0',
                      letterSpacing: '0.05em',
                    }}
                  >
                    删除
                  </div>

                  {/* Item row */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      if (revealed) { setSwipedId(null); setLongPressId(null); return; }
                      onSelect(item);
                    }}
                    onTouchStart={(e) => {
                      touchStartX.current = e.touches[0].clientX;
                      longPressTimer.current = setTimeout(() => setLongPressId(item.id), 500);
                    }}
                    onTouchMove={(e) => {
                      if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; }
                      const dx = e.touches[0].clientX - touchStartX.current;
                      if (dx < -60) setSwipedId(item.id);
                      else if (dx > 20) setSwipedId(null);
                    }}
                    onTouchEnd={() => {
                      if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; }
                    }}
                    onMouseEnter={() => { if (isDesktop()) setSwipedId(item.id); }}
                    onMouseLeave={() => { if (isDesktop()) setSwipedId(null); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.85rem',
                      padding: '0.65rem 0.85rem',
                      background: revealed ? 'rgba(245,240,232,0.04)' : 'rgba(28,22,16,0.85)',
                      border: `1px solid ${revealed ? 'rgba(200,160,80,0.22)' : 'rgba(245,240,232,0.07)'}`,
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transform: revealed ? 'translateX(-76px)' : 'translateX(0)',
                      transition: 'transform 0.22s ease, background 0.2s',
                      userSelect: 'none',
                    }}
                  >
                    {/* Thumbnail */}
                    <img
                      src={item.thumbnail}
                      alt=""
                      style={{
                        width: '50px', height: '50px', flexShrink: 0,
                        borderRadius: '7px', objectFit: 'cover',
                        border: '1px solid rgba(245,240,232,0.12)',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
                      }}
                    />

                    {/* Text info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: '"Playfair Display", "Cormorant Garamond", serif',
                        color: 'rgba(245,240,232,0.85)', fontSize: '0.95rem',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        marginBottom: '3px',
                      }}>
                        {item.result.song}
                      </div>
                      <div style={{
                        color: 'rgba(245,240,232,0.4)', fontSize: '0.73rem', letterSpacing: '0.05em',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        fontFamily: '"Noto Serif SC", serif',
                      }}>
                        {item.result.artist}
                      </div>
                    </div>

                    {/* Date + mood */}
                    <div style={{
                      flexShrink: 0, textAlign: 'right', display: 'flex', flexDirection: 'column',
                      alignItems: 'flex-end', gap: '4px',
                    }}>
                      <span style={{
                        color: 'rgba(245,240,232,0.25)', fontSize: '0.68rem',
                        fontFamily: '"Noto Serif SC", serif',
                      }}>
                        {formatDate(item.timestamp)}
                      </span>
                      <span style={{
                        padding: '1px 7px', borderRadius: '9999px',
                        background: 'rgba(200,160,80,0.1)',
                        border: '1px solid rgba(200,160,80,0.25)',
                        color: 'rgba(200,160,80,0.75)', fontSize: '0.65rem',
                        fontFamily: '"Noto Serif SC", serif', letterSpacing: '0.06em',
                      }}>
                        {item.result.mood}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
