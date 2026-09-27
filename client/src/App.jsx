import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import TodoList from './components/TodoList.jsx';
import TaskFormPage from './pages/TaskFormPage.jsx';

const API = 'http://localhost:5000';

function EditPage({ token, onSaved }) {
  const { id } = useParams();
  return <TaskFormPage token={token} taskId={parseInt(id)} onSaved={onSaved}/>;
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('jwt') || '');
  const [refresh, setRefresh] = useState(0);
  const navigate = useNavigate();

  function handleLogin(t) {
    setToken(t);
    navigate('/tasks');
  }
  function onSaved() {
    setRefresh(r => r + 1);
    navigate('/tasks');
  }
  function handleLogout() {
    localStorage.removeItem('jwt');
    setToken('');
    navigate('/');
  }

  return (
    <div className="app">
      <div className="glass-nav" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #818cf8, #c084fc)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#0f0f1a', fontSize: '0.9rem' }}>T</div>
          <h1 style={{ fontSize: '1.4rem', margin: 0 }}>Task Management</h1>
        </div>
        <nav>
          {!token && <Link to="/">Login</Link>}
          {token && (
            <>
              <Link to="/tasks">Dashboard</Link>
              <Link to="/task/new">New Task</Link>
              <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.8rem', padding: '0.2rem 0.5rem', borderRadius: 6, background: 'rgba(255,255,255,0.08)' }}>Role: {localStorage.getItem('role') || 'User'}</span>
            </>
          )}
          {token && <button className="small" onClick={handleLogout} style={{ background: '#f87171', color: '#0f0f1a', marginLeft: '0.5rem' }}>Logout</button>}
        </nav>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <Routes>
          <Route path="/" element={<LoginPage onLogin={handleLogin}/>} />
          <Route path="/tasks" element={token ? <TodoList token={token} refresh={refresh}/> : <p style={{ color: '#94a3b8' }}>Login required. <Link to="/">Go to Login</Link></p>} />
          <Route path="/task/new" element={token ? <TaskFormPage token={token} onSaved={onSaved}/> : <p style={{ color: '#94a3b8' }}>Login required.</p>} />
          <Route path="/task/edit/:id" element={token ? <EditPage token={token} onSaved={onSaved}/> : <p style={{ color: '#94a3b8' }}>Login required.</p>} />
        </Routes>
      </div>
    </div>
  );
}
