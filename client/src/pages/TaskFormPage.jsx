import React, { useState, useEffect } from 'react';
const API = 'http://localhost:5000';

export default function TaskFormPage({ token, taskId, onSaved }) {
  const [form, setForm] = useState({ title: '', description: '', priority: 2, status: 1, assignedUserId: '' });
  const [msg, setMsg] = useState('');
  const idParam = window.location.pathname.split('/').pop();
  const isEdit = idParam && idParam !== 'new' && !isNaN(idParam);
  const editId = isEdit ? parseInt(idParam) : null;

  useEffect(() => {
    const id = taskId || editId;
    if (id) fetch(`${API}/api/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null).then(data => { if (data) setForm({ title: data.title, description: data.description||'', priority: data.priority, status: data.status, assignedUserId: data.assignedUserId || '' }); });
  }, [taskId, editId]);

  async function save() {
    const method = (taskId || editId) ? 'PUT' : 'POST';
    const url = (taskId || editId) ? `${API}/api/tasks/${taskId || editId}` : `${API}/api/tasks`;
    const res = await fetch(url, {
      method, headers: { ...headers(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: form.title, description: form.description, priority: form.priority, status: form.status, assignedUserId: form.assignedUserId ? parseInt(form.assignedUserId) : null }),
    });
    if (res.ok) { setMsg((taskId || editId) ? 'Updated' : 'Created'); onSaved && onSaved(); }
    else setMsg('Save failed (need Admin?)');
  }

  function headers() { return { Authorization: `Bearer ${token}` }; }

  return (
    <div className="card">
      <h2>{taskId ? 'Edit Task' : 'Create Task'}</h2>
      <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
      <input placeholder="Description" value={form.description||''} onChange={e => setForm({...form, description: e.target.value})} />
      <input type="number" placeholder="Priority (1-4)" value={form.priority} onChange={e => setForm({...form, priority: parseInt(e.target.value)})} />
      <input type="number" placeholder="Status (1-4)" value={form.status} onChange={e => setForm({...form, status: parseInt(e.target.value)})} />
      <input placeholder="Assigned User Id (optional)" value={form.assignedUserId||''} onChange={e => setForm({...form, assignedUserId: e.target.value})} />
      <button onClick={save}>{taskId ? 'Save' : 'Create'}</button>
      {msg && <p style={{ color: msg.includes('failed') ? '#f87171' : '#4ade80' }}>{msg}</p>}
    </div>
  );
}
