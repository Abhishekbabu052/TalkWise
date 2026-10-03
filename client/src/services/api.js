import axios from 'axios';
export const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const api = axios.create({ baseURL: `${BASE}/api` });
export const clientId = () => {
  let id = localStorage.getItem('talkwise_cid');
  if (!id) { id = (crypto.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now().toString(36)); localStorage.setItem('talkwise_cid', id); }
  return id;
};
api.interceptors.request.use((cfg) => {
  cfg.headers['x-client-id'] = clientId();
  const u = JSON.parse(localStorage.getItem('talkwise_user') || 'null');
  if (u?.token) cfg.headers.Authorization = `Bearer ${u.token}`;
  return cfg;
});
export const imgUrl = (p) => (p ? (/^https?:\/\//i.test(p) ? p : `${BASE}${p}`) : '');
export const errMsg = (e) => e.response?.data?.message || 'Something went wrong. Try again.';
export default api;
