import React, { useState, useEffect } from 'react';

export default function KanbanBoard({ token }) {
  const [tasks, setTasks] = useState([]);
  const [msg, setMsg] = useState('');

  async function load() {
    const res = await fetch('http://localhost:5000/api/tasks', { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setTasks(await res.json());
  }
  useEffect(() => { load(); }, [token]);

  const cols = { 1: 'Not Completed', 2: 'Completed' };
  const colTasks = { 1: tasks.filter(t => t.status === 1), 2: tasks.filter(t => t.status === 2) };

  return (
    <div className="card" style={{ display: 'flex', gap: '1rem', overflowX: 'auto' }}>
      {[1, 2].map(key => (
        <div key={key} style={{ minWidth: 280, flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '1rem' }}>
          <h3 style={{ color: '#818cf8', fontWeight: 700, marginBottom: '0.75rem' }}>{cols[key]}</h3>
          {colTasks[key].map(t => (
            <div key={t.id} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: '0.6rem', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
              <strong>{t.title}</strong><br />
              <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>ID {t.id} • P{t.priority}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
