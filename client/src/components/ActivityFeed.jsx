import React, { useState, useEffect } from 'react';

export default function ActivityFeed({ token }) {
  const [activities, setActivities] = useState([]);

  async function load() {
    try {
      const res = await fetch('http://localhost:5000/api/tasks', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const tasks = await res.json();
        const feed = tasks.map((t, i) => ({
          id: t.id,
          text: `Task "${t.title}" updated • P${t.priority} • ${t.status === 2 ? 'Completed' : 'In progress'}`,
          time: new Date(t.updatedAt || Date.now()).toLocaleTimeString(),
          color: t.status === 2 ? '#4ade80' : '#818cf8',
        }));
        setActivities(feed.slice(0, 8));
      }
    } catch (e) { console.error('Activity feed error', e); }
  }
  useEffect(() => { load(); }, [token]);

  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <h2 style={{ color: '#f0abfc', fontWeight: 700, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>Recent Activity</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {activities.length === 0 && <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No recent actions.</div>}
        {activities.map(a => (
          <div key={a.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.6rem', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color, boxShadow: `0 0 8px ${a.color}66`, flexShrink: 0, marginTop: 5 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.35 }}>{a.text}</div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 2 }}>{a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
