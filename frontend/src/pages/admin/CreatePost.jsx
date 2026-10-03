import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { errMsg } from '../../services/api';
export function PostForm({ initial = {}, onSubmit, label }) {
  const [title, setTitle] = useState(initial.title || '');
  const [description, setDescription] = useState(initial.description || '');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const submit = async (e) => {
    e.preventDefault(); setError('');
    const fd = new FormData();
    fd.append('title', title); fd.append('description', description);
    if (image) fd.append('image', image);
    try { await onSubmit(fd); } catch (err) { setError(errMsg(err)); }
  };
  return (
    <form className="card" style={{ maxWidth: 640 }} onSubmit={submit}>
      {error && <div className="alert error">{error}</div>}
      <div className="field"><label>Title (optional)</label><input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
      <div className="field"><label>Description</label><textarea style={{ minHeight: 180 }} value={description} onChange={(e) => setDescription(e.target.value)} required /></div>
      <div className="field"><label>Image {initial.image && '(leave empty to keep current)'}</label><input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} /></div>
      <button className="btn">{label}</button>
    </form>
  );
}
export default function CreatePost() {
  const nav = useNavigate();
  return (
    <>
      <div className="page-head"><h1>New post</h1></div>
      <PostForm label="Publish post" onSubmit={async (fd) => { await api.post('/posts', fd); nav('/admin/posts'); }} />
    </>
  );
}
