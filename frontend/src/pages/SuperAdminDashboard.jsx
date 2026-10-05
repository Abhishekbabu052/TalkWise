import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../services/api';

const actions = [
  ['Manage users', 'Promote users by email and block accounts.', '/admin/users'],
  ['Manage admins', 'Review admin accounts and demote access.', '/admin/admins'],
  ['Moderate content', 'Edit or delete any post or comment.', '/admin/posts'],
  ['Prohibited keywords', 'Control the words blocked by moderation.', '/admin/keywords'],
];

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { api.get('/users/stats').then((r) => setStats(r.data)); }, []);

  const promote = async (event) => {
    event.preventDefault(); setMessage(''); setError('');
    try {
      const result = await api.put('/users/promote', { email });
      setMessage(result.data.message); setEmail('');
    } catch (e) { setError(errMsg(e)); }
  };

  return (
    <div className="super-admin-page">
      <div className="page-head">
        <span className="badge">SUPERADMIN CONTROL CENTER</span>
        <h1>Platform control</h1>
        <p>Manage staff access, members, and all community content from one place.</p>
      </div>
      {stats && <div className="stats">
        {Object.entries({ Users: stats.users, Posts: stats.posts, Comments: stats.responses, 'Pending reports': stats.pendingReports, 'Blocked keywords': stats.keywords }).map(([label, value]) => (
          <div className="card stat" key={label}><strong>{value}</strong><span>{label}</span></div>
        ))}
      </div>}
      <section className="card super-admin-promote">
        <div><h2>Make a user an admin</h2><p className="muted">Search by email. The user keeps their account and receives admin access.</p></div>
        <form className="row" onSubmit={promote}>
          <input type="email" placeholder="user@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button className="btn">Make admin</button>
        </form>
        {message && <div className="alert ok">{message}</div>}
        {error && <div className="alert error">{error}</div>}
      </section>
      <div className="super-admin-grid">
        {actions.map(([title, description, to]) => <Link className="card super-admin-action" to={to} key={title}>
          <h3>{title} <span>→</span></h3><p className="muted">{description}</p>
        </Link>)}
      </div>
    </div>
  );
}
