import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Navbar() {
  const { user, isAdmin, isSuperAdmin, logout } = useAuth();
  const nav = useNavigate();
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">Talk<span>Wise</span></Link>
        <nav className="nav-links">
          <NavLink to="/" end>Discussions</NavLink>
          {user && <NavLink to="/responses">My responses</NavLink>}
          {isAdmin && <NavLink to={isSuperAdmin ? '/super-admin' : '/admin'}>{isSuperAdmin ? 'Super Admin Dashboard' : 'Admin'}</NavLink>}
          {user ? (
            <>
              <NavLink to="/profile">{user.name}</NavLink>
              <button className="btn ghost sm" onClick={() => { logout(); nav('/'); }}>Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login">Sign in</Link>
              <Link to="/register" className="btn sm">Join free</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
