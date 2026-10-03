import { useEffect, useState } from 'react';
import api from '../../services/api';
import socket from '../../services/socket';
export default function Notifications() {
  const [list, setList] = useState([]);
  const load = () => api.get('/notifications').then((r) => setList(r.data));
  useEffect(() => {
    load(); socket.emit('joinAdmin');
    const on = (n) => setList((p) => [n, ...p]);
    socket.on('notification', on);
    return () => socket.off('notification', on);
  }, []);
  return (
    <>
      <div className="row between page-head">
        <h1>Notifications</h1>
        <button className="btn ghost sm" onClick={async () => { await api.put('/notifications/read-all'); load(); }}>Mark all read</button>
      </div>
      {list.length === 0 ? <div className="empty">You're all caught up.</div> :
        <div className="stack">{list.map((n) => (
          <div key={n._id} className={`card notif ${n.isRead ? '' : 'unread'}`}>
            <div><span className={`badge ${n.type === 'report' ? 'amber' : 'red'}`}>{n.type}</span>
              <p style={{ margin: '6px 0 2px' }}>{n.message}</p><span className="small muted">{new Date(n.createdAt).toLocaleString()}</span></div>
            <div className="row">
              {!n.isRead && <button className="btn ghost sm" onClick={async () => { await api.put(`/notifications/${n._id}/read`); load(); }}>Mark read</button>}
              <button className="btn danger sm" onClick={async () => { await api.delete(`/notifications/${n._id}`); load(); }}>Delete</button>
            </div>
          </div>))}</div>}
    </>
  );
}
