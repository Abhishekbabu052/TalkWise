import { Link } from 'react-router-dom';
import { imgUrl } from '../services/api';
export default function PostCard({ post }) {
  return (
    <article className="card post-card">
      <div className="thumb" style={post.image ? { backgroundImage: `url(${imgUrl(post.image)})` } : {}} />
      <div className="body">
        <h3><Link to={`/posts/${post._id}`}>{post.title || (post.image ? 'Image post' : 'Untitled post')}</Link></h3>
        <p>{post.description}</p>
        <div className="row small muted">
          <span className="badge">{post.responseCount ?? 0} responses</span>
          {post.reactionTotal > 0 && <span className="badge grey">{post.reactionTotal} reactions</span>}
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <Link className="btn sm" to={`/posts/${post._id}`}>Respond</Link>
      </div>
    </article>
  );
}
