import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { PostForm } from './CreatePost';
export default function EditPost() {
  const { id } = useParams();
  const nav = useNavigate();
  const [post, setPost] = useState(null);
  useEffect(() => { api.get(`/posts/${id}`).then((r) => setPost(r.data)); }, [id]);
  return (
    <>
      <div className="page-head"><h1>Edit post</h1></div>
      {!post ? <p className="muted">Loading…</p> :
        <PostForm initial={post} label="Save changes" onSubmit={async (fd) => { await api.put(`/posts/${id}`, fd); nav('/admin/posts'); }} />}
    </>
  );
}
