import { useEffect, useState } from 'react';
import api, { errMsg } from '../../services/api';
const tone = { pending: 'amber', resolved: '', dismissed: 'grey' };
export default function Reports() {
  const [reports, setReports] = useState([]);
  const load = () => api.get('/reports').then((r) => setReports(r.data));
  useEffect(() => { load(); }, []);
  const act = async (fn) => { try { await fn(); load(); } catch (e) { alert(errMsg(e)); } };
  const setStatus = (id, status) => act(() => api.put(`/reports/${id}`, { status }));
  const deleteAll = () => {
    if (confirm(`Permanently delete all ${reports.length} report records? This cannot be undone.`)) {
      act(() => api.delete('/reports'));
    }
  };
  return (
    <>
      <div className="row between page-head">
        <div><h1>Reports</h1><p>Review what members have flagged.</p></div>
        <button className="btn danger sm" onClick={deleteAll} disabled={reports.length === 0}>Delete all reports</button>
      </div>
      {reports.length === 0 ? <div className="empty">No reports. The community is behaving.</div> :
        <div className="stack">{reports.map((r) => (
          <div className="card" key={r._id}>
            <div className="row between">
              <div className="row"><span className={`badge ${tone[r.status]}`}>{r.status}</span><span className="small muted">{r.type} report by {r.reporter?.name}</span></div>
              <span className="small muted">{new Date(r.createdAt).toLocaleString()}</span>
            </div>
            <p style={{ margin: '10px 0' }}><strong>Reason:</strong> {r.reason}</p>
            {r.response && <blockquote className="card" style={{ margin: '0 0 12px', background: '#0a1020' }}>
              <div className="small muted">{r.response.user?.name}</div>{r.response.text}</blockquote>}
            {!r.response && r.type === 'response' && <p className="small muted">The reported response was already removed.</p>}
            {r.status === 'pending' && (
              <div className="row">
                {r.response && <button className="btn danger sm" onClick={() => act(async () => { await api.delete(`/responses/${r.response._id}`); await api.put(`/reports/${r._id}`, { status: 'resolved' }); })}>Remove response</button>}
                {(r.reportedUser?._id || r.response?.user?._id) && <button className="btn danger sm" onClick={() => act(async () => { await api.put(`/users/${r.reportedUser?._id || r.response.user._id}/block`); await api.put(`/reports/${r._id}`, { status: 'resolved' }); })}>Block user</button>}
                <button className="btn ghost sm" onClick={() => setStatus(r._id, 'resolved')}>Mark resolved</button>
                <button className="btn ghost sm" onClick={() => setStatus(r._id, 'dismissed')}>Dismiss</button>
              </div>)}
          </div>))}</div>}
    </>
  );
}
