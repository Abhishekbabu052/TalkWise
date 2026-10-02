import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { errMsg } from '../services/api';
import { useAuth } from '../context/AuthContext';
export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const deleteAccount = async () => {
    if (!confirm('Permanently delete your account? Your responses, reactions, and submitted reports will be removed. This cannot be undone.')) return;
    setError('');
    setBusy(true);
    try {
      await api.delete('/users/me');
      logout();
      navigate('/');
    } catch (e) {
      setError(errMsg(e));
      setBusy(false);
    }
  };
  return (
    <div className="container" style={{ maxWidth: 520 }}>
      <div className="page-head"><h1>Profile</h1></div>
      <div className="card stack">
        <div className="row"><div className="avatar">{user.name[0].toUpperCase()}</div><div><strong>{user.name}</strong><div className="muted small">{user.email}</div></div></div>
        <div><span className={`badge ${user.role === 'admin' ? '' : 'grey'}`}>{user.role}</span></div>
      </div>
      <section className="account-danger">
        <h2>Delete account</h2>
        <p className="muted small">Your account and personal activity will be permanently removed.</p>
        {error && <div className="alert error" role="alert">{error}</div>}
        <button className="btn danger" onClick={deleteAccount} disabled={busy}>
          {busy ? 'Deleting…' : 'Delete my account'}
        </button>
      </section>
    </div>
  );
}
