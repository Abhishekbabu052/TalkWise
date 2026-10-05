import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import socket from '../services/socket';
import api from '../services/api';
export default function AdminSidebar() {
  const { isSuperAdmin } = useAuth();
  const links = [
    ['/admin', 'Dashboard', true], ['/admin/posts', 'Posts'], ['/admin/users', 'Users'],
    ['/admin/reports', 'Reports'], ['/admin/notifications', 'Notifications'],
    ...(isSuperAdmin ? [['/admin/admins', 'Manage admins'], ['/admin/responses', 'Comments'], ['/admin/keywords', 'Keywords']] : []),
  ];
  if (isSuperAdmin) links.unshift(['/super-admin', 'Super admin', true]);
  const [unread, setUnread] = useState(0);
  useEffect(() => {
    api.get('/notifications').then((r) => setUnread(r.data.filter((n) => !n.isRead).length)).catch(() => {});
    socket.emit('joinAdmin');
    const on = () => setUnread((u) => u + 1);
    socket.on('notification', on);
    return () => socket.off('notification', on);
  }, []);
  return (
    <aside className="sidebar">
      {links.map(([to, label, end]) => (
        <NavLink key={to} to={to} end={end}>
          {label}{label === 'Notifications' && unread > 0 && <span className="badge red">{unread}</span>}
        </NavLink>
      ))}
    </aside>
  );
}
