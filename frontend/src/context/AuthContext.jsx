import { createContext, useContext, useState } from 'react';
import api from '../services/api';
const Ctx = createContext();
export const useAuth = () => useContext(Ctx);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('talkwise_user') || 'null'));
  const save = (u) => { localStorage.setItem('talkwise_user', JSON.stringify(u)); setUser(u); };
  const login = async (email, password) => {
    const loggedIn = (await api.post('/auth/login', { email, password })).data;
    save(loggedIn);
    return loggedIn;
  };
  const register = async (name, email, password) => {
    const registered = (await api.post('/auth/register', { name, email, password })).data;
    save(registered);
    return registered;
  };
  const logout = () => { localStorage.removeItem('talkwise_user'); setUser(null); };
  const isSuperAdmin = user?.role === 'superadmin';
  return <Ctx.Provider value={{ user, login, register, logout, isAdmin: user?.role === 'admin' || isSuperAdmin, isSuperAdmin }}>{children}</Ctx.Provider>;
}
