import { useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../services/api';
import { useAuth } from '../context/AuthContext';
export default function ResponseForm({ postId, replyTo, onCancelReply }) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (!user) return <div className="card muted">Sign in to join this discussion. <Link to="/login">Sign in</Link> or <Link to="/register">create an account</Link>.</div>;
  const submit = async (e) => {
    e.preventDefault(); setError(''); setBusy(true);
    try {
      await api.post(`/responses/post/${postId}`, { text, replyTo: replyTo?._id });
      setText('');
      onCancelReply?.();
    }
    catch (err) { setError(errMsg(err)); }
    setBusy(false);
  };
  return (
    <form onSubmit={submit}>
      {error && <div className="alert error">{error}</div>}
      {replyTo && (
        <div className="reply-composer">
          <div className="row between small">
            <strong>Replying to {replyTo.user?.name || 'Removed user'}</strong>
            <button type="button" className="link-btn" onClick={onCancelReply}>Cancel</button>
          </div>
          <p>{replyTo.text}</p>
        </div>
      )}
      <textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={1000} placeholder={replyTo ? 'Write your reply…' : 'Share your opinion…'} required />
      <div className="row between" style={{ marginTop: 10 }}>
        <span className="small muted">{text.length}/1000</span>
        <button className="btn" disabled={busy || !text.trim()}>Post response</button>
      </div>
    </form>
  );
}
