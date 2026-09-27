import React, { useState, useEffect } from 'react';

export default function TimelineView({ token }) {
  const [tasks, setTasks] = useState([]);
  const [hoverId, setHoverId] = useState(null);

  async function load() {
    try {
      const res = await fetch('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setTasks(await res.json());
    } catch (e) { console.error('Timeline load failed', e); }
  }
  useEffect(() => { load(); }, [token]);

  const now = new Date();
  const earliest = tasks.length ? new Date(Math.min(...tasks.map(t => new Date(t.createdAt || now)))) : now;
  const latest = tasks.length ? new Date(Math.max(...tasks.map(t => new Date(t.updatedAt || now)))) : now;
  const rangeMs = Math.max(1, latest - earliest);

  const getLeft = (t) => {
    const d = new Date(t.createdAt || t.updatedAt || now);
    return Math.max(0, ((d - earliest) / rangeMs) * 100);
  };
  const getWidth = (t) => {
    const d1 = new Date(t.createdAt || t.updatedAt || now);
    const d2 = new Date(t.updatedAt || d1);
    const w = ((d2 - d1) / rangeMs) * 100;
    return Math.max(3, Math.min(30, w));
  };

  return (
    <div className="card" style={{ overflowX: 'auto', padding: '1.5rem' }}>
      <h2 style={{ color: '#f0abfc', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.02em' }}>Timeline / Gantt</h2>
      <div style={{ position: 'relative', height: 220, minWidth: 640, borderLeft: '2px solid rgba(255,255,255,0.08)', paddingLeft: 12 }}>
        {/* Time axis ticks */}
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.75rem', marginBottom: 8, paddingLeft: 4 }}>
          <span>{earliest.toLocaleDateString()}</span>
          <span>{new Date(earliest.getTime() + rangeMs / 2).toLocaleDateString()}</span>
          <span>{latest.toLocaleDateString()}</span>
        </div>

        {tasks.map((t, i) => {
          const left = getLeft(t);
          const width = getWidth(t);
          const isDone = t.status === 2;
          return (
            <div
              key={t.id}
              onMouseEnter={() => setHoverId(t.id)}
              onMouseLeave={() => setHoverId(null)}
              style={{
                position: 'absolute',
                left: `${left}%`,
                top: `${i * 36 + 28}px`,
                width: `${width}%`,
                minWidth: 100,
                background: isDone ? 'linear-gradient(90deg, rgba(74,222,128,0.25), rgba(74,222,128,0.05))' : 'linear-gradient(90deg, rgba(129,140,248,0.25), rgba(129,140,248,0.05))',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10,
                padding: '0.5rem 0.75rem',
                backdropFilter: 'blur(6px)',
                boxShadow: hoverId === t.id ? '0 0 20px rgba(129,140,248,0.25)' : 'none',
                transition: 'box-shadow 0.2s',
                fontSize: '0.78rem',
                color: '#e2e8f0',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={`${t.title} • ${isDone ? 'Completed' : 'Open'} • P${t.priority}`}
            >
              <strong style={{ color: isDone ? '#4ade80' : '#818cf8' }}>{t.title}</strong>
              <div style={{ color: '#94a3b8', fontSize: '0.7rem', marginTop: 2 }}>{new Date(t.createdAt || t.updatedAt).toLocaleDateString()}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', color: '#94a3b8', fontSize: '0.78rem' }}>
        <span style={{ color: '#818cf8' }}>● Open</span>
        <span style={{ color: '#4ade80' }}>● Completed</span>
      </div>
    </div>
  );
}
