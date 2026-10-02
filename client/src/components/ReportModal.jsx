import { useState } from 'react';
import api, { errMsg } from '../services/api';
export default function ReportModal({ response, onClose }) {
  const [type, setType] = useState('response');
  const [reason, setReason] = useState('');
  const [msg, setMsg] = useState({ kind: '', text: '' });
  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reports', {
        type, reason, response: response._id,
        reportedUser: type === 'user' ? response.user?._id : undefined,
      });
      setMsg({ kind: 'ok', text: 'Report sent. An admin will review it.' });
      setTimeout(onClose, 1200);
    } catch (err) { setMsg({ kind: 'error', text: errMsg(err) }); }
  };
  return (
    <div className="overlay" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h2 style={{ marginBottom: 16 }}>Report</h2>
        {msg.text && <div className={`alert ${msg.kind}`}>{msg.text}</div>}
        <div className="field">
          <label>What are you reporting?</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="response">This response</option>
            <option value="user">This user's behavior</option>
          </select>
        </div>
        <div className="field">
          <label>Reason</label>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Tell us what's wrong" required />
        </div>
        <div className="row" style={{ justifyContent: 'flex-end' }}>
          <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn">Send report</button>
        </div>
      </form>
    </div>
  );
}
