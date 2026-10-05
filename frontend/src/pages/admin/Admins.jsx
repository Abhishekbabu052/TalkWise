import { useEffect, useState } from 'react';
import api, { errMsg } from '../../services/api';

export default function Admins() {
  const [admins, setAdmins] = useState([]);
  const load = () => api.get('/users').then((r) => setAdmins(r.data.filter((user) => user.role === 'admin')));
  useEffect(() => { load(); }, []);
  const demote = async (user) => {
    if (!confirm(`Demote ${user.adminLabel || user.name} to a regular user?`)) return;
    try {
      await api.put(`/users/${user._id}/role`, { role: 'user' });
      await load();
    } catch (error) { alert(errMsg(error)); }
  };

  return (
    <>
      <div className="page-head"><h1>Manage admins</h1><p>Admin labels are unique and assigned in order.</p></div>
      <div className="table-wrap"><table>
        <thead><tr><th>Admin</th><th>Name</th><th>Email</th><th>Joined</th><th /></tr></thead>
        <tbody>{admins.map((user) => (
          <tr key={user._id}>
            <td><strong>{user.adminLabel}</strong></td><td>{user.name}</td><td className="muted">{user.email}</td>
            <td className="muted">{new Date(user.createdAt).toLocaleDateString()}</td>
            <td><button className="btn danger sm" onClick={() => demote(user)}>Demote</button></td>
          </tr>
        ))}</tbody>
      </table></div>
      {admins.length === 0 && <div className="empty">There are no admin accounts.</div>}
    </>
  );
}