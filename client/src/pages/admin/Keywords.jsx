import { useEffect, useState } from 'react';
import api, { errMsg } from '../../services/api';
export default function Keywords() {
  const [list, setList] = useState([]);
  const [word, setWord] = useState('');
  const [error, setError] = useState('');
  const load = () => api.get('/keywords').then((r) => setList(r.data));
  useEffect(() => { load(); }, []);
  const add = async (e) => {
    e.preventDefault(); setError('');
    try { await api.post('/keywords', { word }); setWord(''); load(); } catch (err) { setError(errMsg(err)); }
  };
  return (
    <>
      <div className="page-head"><h1>Prohibited keywords</h1><p>Responses containing these words are blocked before publishing.</p></div>
      <form className="row" style={{ maxWidth: 480, marginBottom: 12 }} onSubmit={add}>
        <input style={{ flex: 1 }} placeholder="Add a keyword" value={word} onChange={(e) => setWord(e.target.value)} required />
        <button className="btn">Add</button>
      </form>
      {error && <div className="alert error" style={{ maxWidth: 480 }}>{error}</div>}
      {list.length === 0 ? <div className="empty">No keywords yet. Add words you want blocked.</div> :
        <div className="row">{list.map((k) => (
          <span className="chip" key={k._id}>{k.word}<button aria-label={`Remove ${k.word}`} onClick={async () => { await api.delete(`/keywords/${k._id}`); load(); }}>×</button></span>))}</div>}
    </>
  );
}
