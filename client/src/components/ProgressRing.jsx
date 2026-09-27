import React from 'react';
export default function ProgressCard({ tasks }) {
  const pct = tasks.length ? Math.round((tasks.filter(t=>t.status===2).length/tasks.length)*100) : 0;
  return (
    <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
      <h3 style={{ color: '#818cf8', fontWeight: 700, marginBottom: 0.5 }}></h3>
      <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
        <circle cx="60" cy="60" r="50" fill="none" stroke="url(#grad)" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${pct * 3.14}, 314`} />
        <defs><linearGradient id="grad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#818cf8" /><stop offset="100%" stopColor="#f0abfc" /></linearGradient></defs>
      </svg>
      <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginTop: -20 }}>{pct}%</div>
      <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Task Completion</div>
    </div>
  );
}
