import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errMsg } from '../services/api';
export const features = [
  ['💬', 'Live discussions', 'Responses appear instantly, no refresh needed.'],
  ['🛡️', 'Moderated by design', 'Prohibited keywords are blocked before publishing.'],
  ['🚩', 'Report anything', 'Flag a response or user for admin review.'],
  ['🔐', 'Verified participation', 'Only signed-in members can respond.'],
];
export function AuthInfo() {
  return (
    <section className="auth-info">
      <Link to="/" className="brand">Talk<span>Wise</span></Link>
      <h1>Public discussion,<br />kept respectful.</h1>
      <p className="muted" style={{ maxWidth: 380 }}>Read topics openly, respond when you sign in, and trust the moderation to keep it civil.</p>
      {features.map(([i, t, d]) => (
        <div className="feature" key={t}><span className="ico">{i}</span><div><strong>{t}</strong><span>{d}</span></div></div>
      ))}
    </section>
  );
}
export default function Login() {
  const { login, user } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const submit = async (e) => {
    e.preventDefault(); setError('');
    try {
      const loggedIn = await login(f.email, f.password);
      nav(loggedIn.role === 'superadmin' ? '/super-admin' : loggedIn.role === 'admin' ? '/admin' : '/');
    } catch (err) { setError(errMsg(err)); }
  };
  return (
    <div className="auth">
      <AuthInfo />
      <div className="auth-form-wrap">
        <form className="auth-form" onSubmit={submit}>
          <h2>Welcome back 👋</h2>
          <p className="sub">Sign in to your TalkWise account</p>
          {error && <div className="alert error">{error}</div>}
          <div className="field"><label>Email address</label><input type="email" placeholder="you@example.com" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required /></div>
          <div className="field"><label>Password</label>
            <div className="pw"><input type={show ? 'text' : 'password'} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} required />
              <button type="button" onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'}</button></div></div>
          <button className="btn block">Sign in</button>
          <p className="auth-foot">Don't have an account? <Link to="/register">Create one free</Link></p>
        </form>
      </div>
    </div>
  );
}
