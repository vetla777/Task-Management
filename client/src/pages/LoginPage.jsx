import React, { useState } from 'react';
const API = 'http://localhost:5000';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('admin@taskmanagement.com');
  const [password, setPassword] = useState('Admin123!');
  const [msg, setMsg] = useState('');

  async function handleLogin() {
    const res = await fetch(`${API}/api/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem('jwt', data.token);
      localStorage.setItem('role', data.role || 'User');
      onLogin(data.token);
    } else {
      setMsg(data.message || 'Login failed');
    }
  }
  function onLoginFull() { handleLogin(); }
  return (
    <div style={{ maxWidth: 420, margin: '4rem auto', padding: '2rem', borderRadius: 24, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '0.25rem', background: 'linear-gradient(135deg, #f0abfc 0%, #818cf8 60%, #38bdf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Sign In</h2>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Access your task workspace with a single click.</p>
      <p style={{ color: msg.includes('failed') ? '#f87171' : '#a78bfa', fontSize: '0.85rem', marginBottom: '1rem', minHeight: '1.2rem' }}>{msg}</p>
      <label style={{ display: 'block', marginBottom: '0.35rem', color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@company.com" style={{ marginBottom: '1rem' }} />
      <label style={{ display: 'block', marginBottom: '0.35rem', color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password" />
      <button onClick={handleLogin} style={{ width: '100%', marginTop: '1.25rem', padding: '0.8rem', borderRadius: '14px', fontSize: '1rem' }}>Continue</button>
    </div>
  );
}
