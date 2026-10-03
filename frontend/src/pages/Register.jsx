import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errMsg } from '../services/api';
import { AuthInfo } from './Login';
export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault(); setError('');
    try { await register(f.name, f.email, f.password); nav('/'); } catch (err) { setError(errMsg(err)); }
  };
  return (
    <div className="auth">
      <AuthInfo />
      <div className="auth-form-wrap">
        <form className="auth-form" onSubmit={submit}>
          <h2>Create your account</h2>
          <p className="sub">Join the discussion in a minute</p>
          {error && <div className="alert error">{error}</div>}
          <div className="field"><label>Name</label><input placeholder="Your name" value={f.name} onChange={set('name')} required /></div>
          <div className="field"><label>Email address</label><input type="email" placeholder="you@example.com" value={f.email} onChange={set('email')} required /></div>
          <div className="field"><label>Password</label><input type="password" minLength={6} placeholder="At least 6 characters" value={f.password} onChange={set('password')} required /></div>
          <button className="btn block">Create account</button>
          <p className="auth-foot">Already a member? <Link to="/login">Sign in</Link></p>
        </form>
      </div>
    </div>
  );
}
