import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AdminSidebar from './components/AdminSidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostDetails from './pages/PostDetails';
import Responses from './pages/Responses';
import Profile from './pages/Profile';
import Dashboard from './pages/admin/Dashboard';
import AdminPosts from './pages/admin/Posts';
import CreatePost from './pages/admin/CreatePost';
import EditPost from './pages/admin/EditPost';
import Users from './pages/admin/Users';
import Reports from './pages/admin/Reports';
import Keywords from './pages/admin/Keywords';
import Notifications from './pages/admin/Notifications';

function Private({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}
function AdminOnly() {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return (
    <div className="admin-shell">
      <AdminSidebar />
      <main className="admin-main"><Outlet /></main>
    </div>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const authPage = pathname === '/login' || pathname === '/register';
  return (
    <>
      {!authPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posts/:id" element={<PostDetails />} />
        <Route path="/responses" element={<Private><Responses /></Private>} />
        <Route path="/profile" element={<Private><Profile /></Private>} />
        <Route path="/admin" element={<AdminOnly />}>
          <Route index element={<Dashboard />} />
          <Route path="posts" element={<AdminPosts />} />
          <Route path="posts/new" element={<CreatePost />} />
          <Route path="posts/:id/edit" element={<EditPost />} />
          <Route path="users" element={<Users />} />
          <Route path="reports" element={<Reports />} />
          <Route path="keywords" element={<Keywords />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
