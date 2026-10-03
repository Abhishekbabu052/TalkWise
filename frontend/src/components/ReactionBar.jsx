import { useEffect, useState } from 'react';
import api, { errMsg } from '../services/api';
import socket from '../services/socket';
export const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '😡', '🤡', '😭', '💀', '✅', '❌', '💯'];
export default function ReactionBar({ postId, initial }) {
  const [counts, setCounts] = useState(initial?.counts || {});
  const [mine, setMine] = useState(() => Array.isArray(initial?.mine) ? initial.mine : initial?.mine ? [initial.mine] : []);
  const [error, setError] = useState('');
  useEffect(() => {
    const on = (d) => d.postId === postId && setCounts(d.counts);
    socket.on('reactionUpdate', on);
    return () => socket.off('reactionUpdate', on);
  }, [postId]);
  const react = async (emoji) => {
    setError('');
    try {
      const { data } = await api.post(`/posts/${postId}/react`, { emoji });
      setCounts(data.counts); setMine(data.mine);
    } catch (e) { setError(errMsg(e)); }
  };
  return (
    <div style={{ marginTop: 20 }}>
      <div className="reactions" role="group" aria-label="React to this post">
        {EMOJIS.map((e) => (
          <button key={e} className={`reaction ${mine.includes(e) ? 'on' : ''}`} onClick={() => react(e)} aria-pressed={mine.includes(e)}>
            <span>{e}</span><b>{counts[e] || 0}</b>
          </button>
        ))}
      </div>
      {error && <div className="alert error" style={{ marginTop: 10 }}>{error}</div>}
    </div>
  );
}
