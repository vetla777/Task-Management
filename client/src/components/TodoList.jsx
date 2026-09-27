import React, { useState } from 'react';

export default function TodoList({ token }) {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState({ search: '', status: '', priority: '' });
  const [msg, setMsg] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);

  async function load() {
    let url = 'http://localhost:5000/api/tasks';
    const params = new URLSearchParams();
    if (filter.search) params.set('filter', filter.search);
    if (filter.status !== '') params.set('status', filter.status);
    if (filter.priority !== '') params.set('priority', filter.priority);
    const qs = params.toString() ? '?' + params.toString() : '';
    const res = await fetch(url + qs, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setTasks(await res.json());
  }

  const completed = tasks.filter(t => t.status === 2).length;
  const notCompleted = tasks.filter(t => t.status === 1).length;

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ flex: 1, textAlign: 'center', padding: '1.2rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#4ade80' }}>{completed}</div>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Completed</div>
        </div>
        <div className="card" style={{ flex: 1, textAlign: 'center', padding: '1.2rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24' }}>{notCompleted}</div>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Not Completed</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input style={{ flex: 1, minWidth: 180 }} placeholder="Search..." value={filter.search} onChange={e => setFilter({ ...filter, search: e.target.value })} />
        <select value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })} style={{ minWidth: 140 }}>
          <option value="">All Status</option>
          <option value="1">Not Completed</option>
          <option value="2">Completed</option>
        </select>
        <select value={filter.priority} onChange={e => setFilter({ ...filter, priority: e.target.value })} style={{ minWidth: 140 }}>
          <option value="">All Priority</option>
          <option value="1">Low</option>
          <option value="2">Medium</option>
          <option value="3">High</option>
        </select>
        <button onClick={load}>Filter</button>
      </div>

      {/* Toast */}
      {msg && <div style={{ padding: '0.75rem 1rem', borderRadius: 12, background: msg.includes('failed') ? 'rgba(248,113,113,0.15)' : 'rgba(74,222,128,0.15)', color: msg.includes('failed') ? '#f87171' : '#4ade80', marginBottom: '1rem', fontWeight: 600 }}>{msg}</div>}

      {/* Table */}
      <div className="card">
        <h2>Task List <button style={{ float: 'right' }} onClick={load}>Refresh</button></h2>
        <table>
          <thead>
            <tr><th>Id</th><th>Title</th><th>Priority</th><th>Status</th><th>Entered</th><th>Updated</th><th>Assigned</th><th>Overdue</th><th>Action</th></tr>
          </thead>
          <tbody>
            {tasks.map(t => {
              const updated = new Date(t.updatedAt);
              const now = new Date();
              const overdue = (now - updated) > (7 * 24 * 60 * 60 * 1000);
              return (
                <tr key={t.id} onClick={() => setSelectedTask(t)} style={{ cursor: 'pointer' }}>
                  <td>{t.id}</td><td>{t.title}</td><td>{t.priority}</td><td>{t.status === 2 ? 'Completed' : 'Not Completed'}</td>
                  <td>{new Date(t.createdAt).toLocaleString()}</td>
                  <td>{new Date(t.updatedAt).toLocaleString()}</td>
                  <td>{t.assignedUserName || '-'}</td>
                  <td>{overdue ? <span style={{ background: '#f87171', color: '#fff', padding: '0.15rem 0.4rem', borderRadius: 9999, fontSize: '0.7rem', fontWeight: 700 }}>Overdue</span> : '-'}</td>
                  <td onClick={e => e.stopPropagation()}><a href={`/task/edit/${t.id}`}>Edit</a></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedTask && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }} onClick={() => setSelectedTask(null)}>
          <div className="card" style={{ maxWidth: 520, width: '90%', padding: '2rem', borderRadius: 20 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#f0abfc' }}>{selectedTask.title}</h3>
            <p style={{ color: '#e2e8f0', marginBottom: '0.75rem' }}><strong>Description:</strong> {selectedTask.description || '—'}</p>
            <p style={{ color: '#e2e8f0', marginBottom: '0.3rem' }}><strong>Priority:</strong> {selectedTask.priority}</p>
            <p style={{ color: '#e2e8f0', marginBottom: '0.3rem' }}><strong>Status:</strong> {selectedTask.status === 2 ? 'Completed' : 'Not Completed'}</p>
            <p style={{ color: '#e2e8f0', marginBottom: '0.3rem' }}><strong>Assigned User:</strong> {selectedTask.assignedUserName || '-'}</p>
            <p style={{ color: '#e2e8f0', marginBottom: '0.3rem' }}><strong>Created:</strong> {new Date(selectedTask.createdAt).toLocaleString()}</p>
            <p style={{ color: '#e2e8f0', marginBottom: '1rem' }}><strong>Updated:</strong> {new Date(selectedTask.updatedAt).toLocaleString()}</p>
            <button onClick={() => setSelectedTask(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
