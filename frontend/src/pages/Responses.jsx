import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
export default function Responses() {
  const [list, setList] = useState(null);
  const load = () => api.get('/responses/mine').then((r) => setList(r.data));
  useEffect(() => { load(); }, []);
  const del = async (id) => { if (confirm('Delete this response?')) { await api.delete(`/responses/${id}`); load(); } };
  return (
    <div className="container" style={{ maxWidth: 760 }}>
      <div className="page-head"><h1>My responses</h1><p>Everything you've said across discussions.</p></div>
      {list === null ? <p className="muted">Loading…</p> : list.length === 0
        ? <div className="empty">You haven't responded yet. <Link to="/">Browse discussions</Link></div>
        : <div className="stack">{list.map((r) => (
          <div className="card" key={r._id}>
            <div className="row between small">
              <Link to={`/posts/${r.post?._id}`}>{r.post?.title || 'Deleted post'}</Link>
              <span className="muted">{new Date(r.createdAt).toLocaleString()}</span>
            </div>
            <p style={{ margin: '8px 0', whiteSpace: 'pre-wrap' }}>{r.text}</p>
            <button className="link-btn" onClick={() => del(r._id)}>Delete</button>
          </div>))}</div>}
    </div>
  );
}
