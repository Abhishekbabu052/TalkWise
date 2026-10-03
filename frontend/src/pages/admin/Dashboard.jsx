import { useEffect, useState } from 'react';
import api from '../../services/api';
export default function Dashboard() {
  const [s, setS] = useState(null);
  useEffect(() => { api.get('/users/stats').then((r) => setS(r.data)); }, []);
  const items = s && [['Users', s.users], ['Posts', s.posts], ['Responses', s.responses], ['Pending reports', s.pendingReports], ['Blocked keywords', s.keywords]];
  return (
    <>
      <div className="page-head"><h1>Dashboard</h1><p>A snapshot of the platform.</p></div>
      {!s ? <p className="muted">Loading…</p> : <div className="stats">{items.map(([l, v]) => <div className="card stat" key={l}><strong>{v}</strong><span>{l}</span></div>)}</div>}
    </>
  );
}
