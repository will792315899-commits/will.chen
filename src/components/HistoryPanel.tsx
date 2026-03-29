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

  const gold = (a: number) => `rgba(201,168,76,${a})`;

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
    /* Backdrop */
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.88)',
        backdropFilter: 'blur(12px)',
        display: 'flex', flexDirection: 'column',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      onClick={() => { setSwipedId(null); setLongPressId(null); }}
    >
      {/* ── Header ───────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.25rem 1.25rem 1rem',
        borderBottom: `1px solid ${gold(0.15)}`,
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Clock icon */}
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ color: '#c9a84c' }}>
            <circle cx="7.5" cy="7.5" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M7.5 4v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span style={{
            fontFamily: '"Noto Serif SC", serif',
            color: '#c9a84c', fontSize: '0.95rem', letterSpacing: '0.2em',
          }}>
            历史记录
          </span>
          <span style={{
            color: gold(0.35), fontSize: '0.72rem',
            fontFamily: '"Noto Serif SC", serif', letterSpacing: '0.05em',
          }}>
            ({items.length}/20)
          </span>
        </div>
        <button
          className="btn-ghost"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          style={{ fontSize: '1.1rem', lineHeight: 1 }}
        >
          ✕
        </button>
      </div>

      {/* ── List ─────────────────────────────────── */}
      <div
        style={{ flex: 1, overflowY: 'auto', padding: '0.75rem' }}
        onClick={() => { setSwipedId(null); setLongPressId(null); }}
      >
        {items.length === 0 ? (
          <div style={{
            textAlign: 'center', marginTop: '5rem',
            color: gold(0.3),
            fontFamily: '"Noto Serif SC", serif',
            fontSize: '0.9rem', letterSpacing: '0.12em',
          }}>
            暂无历史记录
          </div>
        ) : (
          <>
            {/* Mobile hint */}
            <p style={{
              textAlign: 'center', marginBottom: '0.75rem',
              color: gold(0.28), fontSize: '0.7rem',
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
                  {/* Delete button behind the row */}
                  <div
                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                    style={{
                      position: 'absolute', right: 0, top: 0, bottom: 0, width: '76px',
                      background: 'rgba(200,50,50,0.85)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: '0.8rem',
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
                    /* ── Touch swipe ── */
                    onTouchStart={(e) => {
                      touchStartX.current = e.touches[0].clientX;
                      // Long-press detection
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
                    /* ── Desktop hover reveals delete ── */
                    onMouseEnter={() => { if (isDesktop()) setSwipedId(item.id); }}
                    onMouseLeave={() => { if (isDesktop()) setSwipedId(null); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.85rem',
                      padding: '0.65rem 0.85rem',
                      background: revealed ? gold(0.08) : gold(0.035),
                      border: `1px solid ${gold(revealed ? 0.2 : 0.1)}`,
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
                        border: `1px solid ${gold(0.22)}`,
                      }}
                    />

                    {/* Text info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: '"DM Serif Display", serif',
                        color: '#e8d5a3', fontSize: '0.95rem',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        marginBottom: '3px',
                      }}>
                        {item.result.song}
                      </div>
                      <div style={{
                        color: gold(0.55), fontSize: '0.73rem', letterSpacing: '0.05em',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
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
                        color: gold(0.3), fontSize: '0.68rem',
                        fontFamily: '"Noto Serif SC", serif',
                      }}>
                        {formatDate(item.timestamp)}
                      </span>
                      <span style={{
                        padding: '1px 7px', borderRadius: '9999px',
                        background: gold(0.1), border: `1px solid ${gold(0.25)}`,
                        color: gold(0.7), fontSize: '0.65rem',
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
