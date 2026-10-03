import { useEffect, useState } from 'react';
import api, { errMsg } from '../../services/api';
export default function Users() {
  const [users, setUsers] = useState([]);
  const load = () => api.get('/users').then((r) => setUsers(r.data));
  useEffect(() => { load(); }, []);
  const act = async (fn) => { try { await fn(); load(); } catch (e) { alert(errMsg(e)); } };
  return (
    <>
      <div className="page-head"><h1>Users</h1><p>Block or remove accounts that break the rules.</p></div>
      <div className="table-wrap"><table>
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Warnings</th><th>Status</th><th /></tr></thead>
        <tbody>{users.map((u) => (
          <tr key={u._id}>
            <td>{u.name}</td><td className="muted">{u.email}</td>
            <td><span className={`badge ${u.role === 'admin' ? '' : 'grey'}`}>{u.role}</span></td>
            <td>{u.warnings}</td>
            <td>{u.isBlocked ? <span className="badge red">Blocked</span> : <span className="badge">Active</span>}</td>
            <td>{u.role !== 'admin' && <div className="row" style={{ justifyContent: 'flex-end' }}>
              <button className="btn ghost sm" onClick={() => act(() => api.put(`/users/${u._id}/block`))}>{u.isBlocked ? 'Unblock' : 'Block'}</button>
              <button className="btn danger sm" onClick={() => confirm(`Remove ${u.name} and their responses?`) && act(() => api.delete(`/users/${u._id}`))}>Remove</button>
            </div>}</td>
          </tr>))}</tbody></table></div>
    </>
  );
}
