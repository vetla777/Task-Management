import React from 'react';

export default function QuickActionFAB({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Create new task"
      style={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        zIndex: 100,
        width: 64,
        height: 64,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 60%, #f0abfc 100%)',
        color: '#0f0f1a',
        border: 'none',
        fontSize: 28,
        fontWeight: 800,
        cursor: 'pointer',
        boxShadow: '0 10px 40px rgba(129,140,248,0.45), 0 0 0 1px rgba(255,255,255,0.15) inset',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.15s, box-shadow 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08) translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 50px rgba(129,140,248,0.55), 0 0 0 1px rgba(255,255,255,0.25) inset'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 40px rgba(129,140,248,0.45), 0 0 0 1px rgba(255,255,255,0.15) inset'; }}
    >
      +
    </button>
  );
}
