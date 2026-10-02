import { useEffect, useState } from 'react';
import api from '../services/api';
import PostCard from '../components/PostCard';
export default function Home() {
  const [posts, setPosts] = useState(null);
  const [search, setSearch] = useState('');
  useEffect(() => {
    const t = setTimeout(() => api.get('/posts', { params: { search } }).then((r) => setPosts(r.data)).catch(() => setPosts([])), 250);
    return () => clearTimeout(t);
  }, [search]);
  return (
    <div className="container">
      <div className="page-head">
        <h1>Join the conversation</h1>
        <p>Read any topic. Sign in to share your opinion, live.</p>
      </div>
      <div className="field"><input placeholder="Search discussions" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
      <div className="stack">
        {posts === null ? <p className="muted">Loading…</p>
          : posts.length === 0 ? <div className="empty">No discussions found.</div>
          : posts.map((p) => <PostCard key={p._id} post={p} />)}
      </div>
    </div>
  );
}
