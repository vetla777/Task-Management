import React, { useState, useEffect, useRef } from 'react';

export default function SearchOverlay({ token, open, onClose, onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = setTimeout(async () => {
      try {
        const url = query.trim()
          ? `http://localhost:5000/api/tasks?filter=${encodeURIComponent(query.trim())}`
          : 'http://localhost:5000/api/tasks';
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) setResults(await res.json());
      } catch (e) { console.error('Search overlay error', e); }
    }, 250);
    return () => clearTimeout(handler);
  }, [open, query, token]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(11,12,21,0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '10vh',
      }}
    >
      <div
        className="card"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: 640,
          width: '90%',
          borderRadius: 24,
          padding: '2rem',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      >
        <h2 style={{ color: '#f0abfc', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.02em' }}>Search Tasks</h2>
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by title, description, or priority..."
          style={{ fontSize: '1rem', padding: '0.9rem 1.2rem', borderRadius: 14 }}
        />
        <div style={{ marginTop: '1rem', maxHeight: 420, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {results.length === 0 && <div style={{ color: '#94a3b8', fontSize: '0.85rem', padding: '0.5rem' }}>No results found.</div>}
          {results.map(t => (
            <div
              key={t.id}
              onClick={() => { onSelect && onSelect(t); onClose(); }}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.06)',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.09)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
              <strong style={{ color: '#818cf8' }}>{t.title}</strong>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: 2 }}>{t.description || '—'} • P{t.priority} • {t.status === 2 ? 'Completed' : 'Open'}</div>
            </div>
          ))}
        </div>
        <button onClick={onClose} style={{ marginTop: '1.25rem', width: '100%', background: 'rgba(255,255,255,0.05)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.08)' }}>Close</button>
      </div>
    </div>
  );
}
