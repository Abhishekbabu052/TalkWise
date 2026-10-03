import { createContext, useContext, useState } from 'react';
import api from '../services/api';
const Ctx = createContext();
export const useAuth = () => useContext(Ctx);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('talkwise_user') || 'null'));
  const save = (u) => { localStorage.setItem('talkwise_user', JSON.stringify(u)); setUser(u); };
  const login = async (email, password) => save((await api.post('/auth/login', { email, password })).data);
  const register = async (name, email, password) => save((await api.post('/auth/register', { name, email, password })).data);
  const logout = () => { localStorage.removeItem('talkwise_user'); setUser(null); };
  return <Ctx.Provider value={{ user, login, register, logout, isAdmin: user?.role === 'admin' }}>{children}</Ctx.Provider>;
}
