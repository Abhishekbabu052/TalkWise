import { useAuth } from '../context/AuthContext';
export default function ResponseCard({ response, onReport, onDelete, onReply }) {
  const { user, isAdmin } = useAuth();
  const mine = user && response.user?._id === user._id;
  return (
    <div className="response">
      <div className="avatar">{response.user?.name?.[0]?.toUpperCase() || '?'}</div>
      <div className="response-body">
        <div className="row small">
          <strong>{response.user?.name || 'Removed user'}</strong>
          <span className="muted">{new Date(response.createdAt).toLocaleString()}</span>
        </div>
        {response.replyTo && (
          <div className="reply-context">
            <strong>Replying to {response.replyTo.user?.name || 'Removed user'}</strong>
            <p>{response.replyTo.text}</p>
          </div>
        )}
        <p>{response.text}</p>
        {user && (
          <div className="row" style={{ marginTop: 6 }}>
            <button className="link-btn reply-btn" onClick={() => onReply(response)}>Reply</button>
            {!mine && <button className="link-btn" onClick={() => onReport(response)}>Report</button>}
            {(mine || isAdmin) && <button className="link-btn" onClick={() => onDelete(response)}>Delete</button>}
          </div>
        )}
      </div>
    </div>
  );
}
