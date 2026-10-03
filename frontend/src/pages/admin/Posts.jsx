import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
export default function Posts() {
  const [posts, setPosts] = useState([]);
  const load = () => api.get('/posts').then((r) => setPosts(r.data));
  useEffect(() => { load(); }, []);
  const del = async (id) => { if (confirm('Delete this post and all its responses?')) { await api.delete(`/posts/${id}`); load(); } };
  return (
    <>
      <div className="row between page-head"><h1>Posts</h1><Link to="/admin/posts/new" className="btn">New post</Link></div>
      {posts.length === 0 ? <div className="empty">No posts yet. Create the first discussion.</div> :
        <div className="table-wrap"><table>
          <thead><tr><th>Title</th><th>Responses</th><th>Created</th><th /></tr></thead>
          <tbody>{posts.map((p) => (
            <tr key={p._id}>
              <td><Link to={`/posts/${p._id}`}>{p.title || (p.image ? 'Image post' : 'Untitled post')}</Link></td><td>{p.responseCount}</td>
              <td className="muted">{new Date(p.createdAt).toLocaleDateString()}</td>
              <td><div className="row" style={{ justifyContent: 'flex-end' }}>
                <Link className="btn ghost sm" to={`/admin/posts/${p._id}/edit`}>Edit</Link>
                <button className="btn danger sm" onClick={() => del(p._id)}>Delete</button></div></td>
            </tr>))}</tbody></table></div>}
    </>
  );
}
