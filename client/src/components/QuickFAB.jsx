import React, { useState } from 'react';
export default function QuickActionFAB({ onNew }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 40 }}>
      <button onClick={() => setOpen(!open)} style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #818cf8, #c084fc)', color: '#0f0f1a', fontSize: '1.5rem', border: 'none', boxShadow: '0 15px 30px rgba(129,140,248,0.35)', cursor: 'pointer' }}>+</button>
      {open && (
        <div style={{ position: 'absolute', bottom: 70, right: 0, background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '0.75rem', minWidth: 160, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
          <button onClick={() => { onNew(); setOpen(false); }} style={{ display: 'block', width: '100%', marginBottom: 6, background: '#38bdf8', color: '#0f172a' }}>New Task</button>
          <button onClick={() => setOpen(false)} style={{ display: 'block', width: '100%', background: 'rgba(255,255,255,0.08)' }}>Cancel</button>
        </div>
      )}
    </div>
  );
}
