import { useEffect, useState } from 'react';
import api, { errMsg } from '../../services/api';

export default function Responses() {
  const [responses, setResponses] = useState([]);
  const load = () => api.get('/responses').then((r) => setResponses(r.data));
  useEffect(() => { load(); }, []);
  const update = async (response) => {
    const text = prompt('Edit comment', response.text);
    if (text === null || !text.trim() || text === response.text) return;
    try { await api.put(`/responses/${response._id}`, { text }); await load(); }
    catch (error) { alert(errMsg(error)); }
  };
  const remove = async (response) => {
    if (!confirm('Delete this comment?')) return;
    try { await api.delete(`/responses/${response._id}`); await load(); }
    catch (error) { alert(errMsg(error)); }
  };

  return (
    <>
      <div className="page-head"><h1>Comments</h1><p>Review, edit, or remove comments across discussions.</p></div>
      {responses.length === 0 ? <div className="empty">No comments to review.</div> :
        <div className="stack">{responses.map((response) => (
          <article className="card" key={response._id}>
            <div className="row between"><strong>{response.user?.name || 'Removed user'}</strong><span className="small muted">{response.post?.title || 'Post removed'}</span></div>
            <p>{response.text}</p>
            <div className="row"><button className="btn ghost sm" onClick={() => update(response)}>Edit</button><button className="btn danger sm" onClick={() => remove(response)}>Delete</button></div>
          </article>
        ))}</div>}
    </>
  );
}