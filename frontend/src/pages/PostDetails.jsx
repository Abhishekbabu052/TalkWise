import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { imgUrl, errMsg } from '../services/api';
import socket from '../services/socket';
import ResponseCard from '../components/ResponseCard';
import ResponseForm from '../components/ResponseForm';
import ReactionBar from '../components/ReactionBar';
import ReportModal from '../components/ReportModal';
export default function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [responses, setResponses] = useState([]);
  const [reporting, setReporting] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [notFound, setNotFound] = useState(false);
  useEffect(() => {
    api.get(`/posts/${id}`).then((r) => setPost(r.data)).catch(() => setNotFound(true));
    api.get(`/responses/post/${id}`).then((r) => setResponses(r.data));
    socket.emit('joinPost', id);
    const onNew = (r) => setResponses((p) => (p.some((x) => x._id === r._id) ? p : [...p, r]));
    const onDel = (rid) => setResponses((p) => p.filter((x) => x._id !== rid));
    socket.on('newResponse', onNew); socket.on('responseDeleted', onDel);
    return () => { socket.emit('leavePost', id); socket.off('newResponse', onNew); socket.off('responseDeleted', onDel); };
  }, [id]);
  const del = async (r) => {
    if (!confirm('Delete this response?')) return;
    try { await api.delete(`/responses/${r._id}`); } catch (e) { alert(errMsg(e)); }
  };
  if (notFound) return <div className="container"><div className="empty">This discussion doesn't exist. <Link to="/">Back to discussions</Link></div></div>;
  if (!post) return <div className="container muted">Loading…</div>;
  return (
    <div className="container" style={{ maxWidth: 760 }}>
      <Link to="/" className="small">← All discussions</Link>
      <h1 style={{ marginTop: 10 }}>{post.title || (post.image ? 'Image post' : 'Untitled post')}</h1>
      <p className="small muted" style={{ marginTop: 6 }}>{new Date(post.createdAt).toLocaleDateString()}</p>
      {post.image && <img className="hero-img" src={imgUrl(post.image)} alt="" />}
      <p className="post-desc">{post.description}</p>
      <ReactionBar postId={id} initial={post.reactions} />
      <div className="row" style={{ margin: '36px 0 8px' }}>
        <h2>Responses ({responses.length})</h2><span className="live-dot" title="Live" />
      </div>
      <div className="card" style={{ marginBottom: 20 }}>
        {responses.length === 0 ? <p className="muted">No responses yet. Be the first to share a view.</p>
            : responses.map((r) => <ResponseCard key={r._id} response={r} onReport={setReporting} onDelete={del} onReply={setReplyingTo} />)}
      </div>
          <ResponseForm postId={id} replyTo={replyingTo} onCancelReply={() => setReplyingTo(null)} />
      {reporting && <ReportModal response={reporting} onClose={() => setReporting(null)} />}
    </div>
  );
}
