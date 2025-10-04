import { useState, useEffect } from 'react';
import './SocialFeed.css';

const SocialFeed = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [newPost, setNewPost] = useState({ content: '', image: null });

  useEffect(() => {
    loadPosts();
    loadFollowing();
  }, []);

  const loadPosts = () => {
    const savedPosts = JSON.parse(localStorage.getItem('fashionspace_posts') || '[]');
    setPosts(savedPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
  };

  const loadFollowing = () => {
    const savedFollowing = JSON.parse(localStorage.getItem(`fashionspace_following_${user.id}`) || '[]');
    setFollowing(savedFollowing);
  };

  const createPost = () => {
    if (!newPost.content.trim()) return;

    const post = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.nome,
      userAvatar: user.fotoPerfil || `https://ui-avatars.com/api/?name=${user.nome}&background=5f81a5&color=fff&size=40`,
      content: newPost.content,
      image: newPost.image,
      timestamp: new Date().toISOString(),
      likes: [],
      comments: [],
      shares: 0
    };

    const allPosts = JSON.parse(localStorage.getItem('fashionspace_posts') || '[]');
    allPosts.unshift(post);
    localStorage.setItem('fashionspace_posts', JSON.stringify(allPosts));
    
    setPosts(allPosts);
    setNewPost({ content: '', image: null });
  };

  const toggleLike = (postId) => {
    const allPosts = JSON.parse(localStorage.getItem('fashionspace_posts') || '[]');
    const postIndex = allPosts.findIndex(p => p.id === postId);
    
    if (postIndex !== -1) {
      const post = allPosts[postIndex];
      const userLiked = post.likes.includes(user.id);
      
      if (userLiked) {
        post.likes = post.likes.filter(id => id !== user.id);
      } else {
        post.likes.push(user.id);
      }
      
      localStorage.setItem('fashionspace_posts', JSON.stringify(allPosts));
      setPosts([...allPosts]);
    }
  };

  const addComment = (postId, comment) => {
    const allPosts = JSON.parse(localStorage.getItem('fashionspace_posts') || '[]');
    const postIndex = allPosts.findIndex(p => p.id === postId);
    
    if (postIndex !== -1) {
      allPosts[postIndex].comments.push({
        id: Date.now().toString(),
        userId: user.id,
        userName: user.nome,
        content: comment,
        timestamp: new Date().toISOString()
      });
      
      localStorage.setItem('fashionspace_posts', JSON.stringify(allPosts));
      setPosts([...allPosts]);
    }
  };

  const sharePost = (postId) => {
    const allPosts = JSON.parse(localStorage.getItem('fashionspace_posts') || '[]');
    const postIndex = allPosts.findIndex(p => p.id === postId);
    
    if (postIndex !== -1) {
      allPosts[postIndex].shares += 1;
      localStorage.setItem('fashionspace_posts', JSON.stringify(allPosts));
      setPosts([...allPosts]);
      
      // Simular compartilhamento
      if (navigator.share) {
        navigator.share({
          title: 'FashionSpace',
          text: allPosts[postIndex].content,
          url: window.location.href
        });
      }
    }
  };

  return (
    <div className="social-feed">
      <div className="feed-header">
        <h2><i className="bi bi-newspaper"></i> Feed de Novidades</h2>
      </div>

      {user.tipoUsuario === 'dono' && (
        <div className="create-post">
          <div className="post-form">
            <img src={user.fotoPerfil || `https://ui-avatars.com/api/?name=${user.nome}&background=5f81a5&color=fff&size=40`} alt={user.nome} className="user-avatar" />
            <div className="form-content">
              <textarea
                className="post-textarea"
                placeholder="Compartilhe novidades do seu bazar..."
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              />
              <div className="form-actions">
                <button className="btn btn-secondary">
                  <i className="bi bi-image"></i> Foto
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={createPost}
                  disabled={!newPost.content.trim()}
                >
                  Publicar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="posts-container">
        {posts.length === 0 ? (
          <div className="empty-feed">
            <i className="bi bi-newspaper"></i>
            <h3>Nenhuma novidade ainda</h3>
            <p>Siga bazares para ver suas novidades aqui!</p>
          </div>
        ) : (
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={user}
              onLike={toggleLike}
              onComment={addComment}
              onShare={sharePost}
            />
          ))
        )}
      </div>
    </div>
  );
};

const PostCard = ({ post, currentUser, onLike, onComment, onShare }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const isLiked = post.likes.includes(currentUser.id);

  const handleComment = () => {
    if (newComment.trim()) {
      onComment(post.id, newComment);
      setNewComment('');
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <img src={post.userAvatar} alt={post.userName} />
        <div className="user-info">
          <h4>{post.userName}</h4>
          <span className="timestamp">
            {new Date(post.timestamp).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="post-content">
        <p>{post.content}</p>
        {post.image && (
          <img src={post.image} alt="Post" className="post-image" />
        )}
      </div>

      <div className="post-stats">
        <span>{post.likes.length} curtidas</span>
        <span>{post.comments.length} comentários</span>
        <span>{post.shares} compartilhamentos</span>
      </div>

      <div className="post-actions">
        <button 
          className={`action-btn ${isLiked ? 'liked' : ''}`}
          onClick={() => onLike(post.id)}
        >
          <i className={`bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'}`}></i>
          Curtir
        </button>
        <button 
          className="action-btn"
          onClick={() => setShowComments(!showComments)}
        >
          <i className="bi bi-chat"></i>
          Comentar
        </button>
        <button 
          className="action-btn"
          onClick={() => onShare(post.id)}
        >
          <i className="bi bi-share"></i>
          Compartilhar
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          <div className="comment-form">
            <img src={currentUser.fotoPerfil || `https://ui-avatars.com/api/?name=${currentUser.nome}&background=5f81a5&color=fff&size=32`} alt={currentUser.nome} className="comment-avatar" />
            <div className="comment-input">
              <input
                type="text"
                placeholder="Escreva um comentário..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleComment()}
              />
              <button onClick={handleComment}>
                <i className="bi bi-send"></i>
              </button>
            </div>
          </div>

          <div className="comments-list">
            {post.comments.map(comment => (
              <div key={comment.id} className="comment">
                <div className="comment-content">
                  <div className="comment-bubble">
                    <strong>{comment.userName}</strong>
                    <p>{comment.content}</p>
                  </div>
                  <div className="comment-timestamp">
                    {new Date(comment.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialFeed;