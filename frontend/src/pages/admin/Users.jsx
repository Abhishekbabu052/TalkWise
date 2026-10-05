import { useEffect, useState } from 'react';
import api, { errMsg } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
export default function Users() {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const { isSuperAdmin } = useAuth();
  const load = () => api.get('/users').then((r) => setUsers(r.data));
  useEffect(() => { load(); }, []);
  const act = async (fn) => { try { await fn(); await load(); } catch (e) { alert(errMsg(e)); } };
  const promote = (user) => act(() => api.put('/users/promote', { email: user.email }));
  const visibleUsers = users.filter((user) => user.email.includes(email.trim().toLowerCase()));
  return (
    <>
      <div className="page-head"><h1>Users</h1><p>Block or remove accounts that break the rules.</p></div>
      <label className="search-field">Search by email<input type="search" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <div className="table-wrap"><table>
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Warnings</th><th>Status</th><th /></tr></thead>
        <tbody>{visibleUsers.map((u) => (
          <tr key={u._id}>
            <td>{u.name}</td><td className="muted">{u.email}</td>
            <td><span className={`badge ${u.role === 'admin' ? '' : 'grey'}`}>{u.adminLabel || u.role}</span></td>
            <td>{u.warnings}</td>
            <td>{u.isBlocked ? <span className="badge red">Blocked</span> : <span className="badge">Active</span>}</td>
            <td><div className="row" style={{ justifyContent: 'flex-end' }}>
              {isSuperAdmin && u.role === 'user' && <button className="btn sm" onClick={() => promote(u)}>Make admin</button>}
              {u.role === 'user' && <>
              <button className="btn ghost sm" onClick={() => act(() => api.put(`/users/${u._id}/block`))}>{u.isBlocked ? 'Unblock' : 'Block'}</button>
              <button className="btn danger sm" onClick={() => confirm(`Remove ${u.name} and their responses?`) && act(() => api.delete(`/users/${u._id}`))}>Remove</button></>}
            </div></td>
          </tr>))}</tbody></table></div>
      {visibleUsers.length === 0 && <div className="empty">No users match that email.</div>}
    </>
  );
}
