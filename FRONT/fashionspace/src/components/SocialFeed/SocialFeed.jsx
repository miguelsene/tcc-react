import { useState, useEffect, useCallback } from 'react';
import { postService } from '../../services/api';
import './SocialFeed.css';

const SocialFeed = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ titulo: '', conteudo: '', imagem: '' });
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [liking, setLiking] = useState(false);

  const loadPosts = useCallback(async () => {
    try {
      const data = await postService.listarTodos();
      setPosts(data);
      
      // Carregar curtidas do usuário do localStorage
      const storedLikes = localStorage.getItem(`fashionspace_liked_posts_${user?.id}`);
      if (storedLikes) {
        setLikedPosts(new Set(JSON.parse(storedLikes)));
      }
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { 
    loadPosts(); 
  }, [loadPosts]);

  const createPost = async () => {
    if (!newPost.conteudo.trim()) return;
    try {
      await postService.criar({
        titulo: newPost.titulo || 'Novidade',
        conteudo: newPost.conteudo,
        imagem: newPost.imagem || null,
        usuarioId: user.id,
        nomeUsuario: user.nome,
      });
      setNewPost({ titulo: '', conteudo: '', imagem: '' });
      await loadPosts();
    } catch (error) {
      console.error('Erro ao criar post:', error);
      alert('Erro ao publicar. Tente novamente.');
    }
  };

  const handleLike = async (postId, currentLikes) => {
    if (liking) return; // Previne múltiplos cliques
    
    // Verifica se já curtiu
    const hasLiked = likedPosts.has(postId);
    
    setLiking(true);
    try {
      // Otimistic update - atualiza UI imediatamente
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            curtidas: hasLiked ? Math.max(0, p.curtidas - 1) : p.curtidas + 1
          };
        }
        return p;
      }));

      // Atualiza estado de curtidas
      const newLikedPosts = new Set(likedPosts);
      if (hasLiked) {
        newLikedPosts.delete(postId);
      } else {
        newLikedPosts.add(postId);
      }
      setLikedPosts(newLikedPosts);
      
      // Salva no localStorage
      localStorage.setItem(`fashionspace_liked_posts_${user?.id}`, JSON.stringify([...newLikedPosts]));

      // Chama API para sincronizar com backend
      try {
        const updated = await postService.curtir(postId, user?.id);
        // Atualiza com o valor real do servidor
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, curtidas: updated.curtidas } : p));
      } catch (apiError) {
        console.log('API não disponível, usando localStorage');
        // Reverte para o estado otimista se API falhar
      }
    } catch (error) {
      console.error('Erro ao curtir:', error);
      // Reverte em caso de erro
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return { ...p, curtidas: currentLikes };
        }
        return p;
      }));
    } finally {
      setLiking(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Deseja excluir esta postagem?')) return;
    try {
      await postService.deletar(postId);
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (error) {
      console.error('Erro ao deletar post:', error);
    }
  };

  const formatTime = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return 'agora';
    if (h < 24) return `${h}h atrás`;
    return `${Math.floor(h / 24)}d atrás`;
  };

  return (
    <div className="social-feed">
      <div className="feed-header">
        <h2><i className="bi bi-newspaper"></i> Feed de Novidades</h2>
      </div>

      {user?.tipoUsuario === 'dono' && (
        <div className="create-post">
          <div className="post-form">
            <img
              src={user.fotoPerfil || `https://ui-avatars.com/api/?name=${user.nome}&background=5f81a5&color=fff&size=40`}
              alt={user.nome}
              className="user-avatar"
            />
            <div className="form-content">
              <input
                className="post-textarea"
                placeholder="Título da publicação..."
                value={newPost.titulo}
                onChange={(e) => setNewPost({ ...newPost, titulo: e.target.value })}
                style={{ marginBottom: 8, padding: 8, width: '100%', borderRadius: 8, border: '1px solid #ccc' }}
              />
              <textarea
                className="post-textarea"
                placeholder="Compartilhe novidades do seu bazar..."
                value={newPost.conteudo}
                onChange={(e) => setNewPost({ ...newPost, conteudo: e.target.value })}
              />
              <input
                className="post-textarea"
                placeholder="URL da imagem (opcional)..."
                value={newPost.imagem}
                onChange={(e) => setNewPost({ ...newPost, imagem: e.target.value })}
                style={{ marginTop: 8, padding: 8, width: '100%', borderRadius: 8, border: '1px solid #ccc' }}
              />
              <div className="form-actions">
                <button
                  className="btn btn-primary"
                  onClick={createPost}
                  disabled={!newPost.conteudo.trim()}
                >
                  Publicar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="posts-container">
        {loading ? (
          <div className="empty-feed"><p>Carregando...</p></div>
        ) : posts.length === 0 ? (
          <div className="empty-feed">
            <i className="bi bi-newspaper"></i>
            <h3>Nenhuma novidade ainda</h3>
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <img
                  src={`https://ui-avatars.com/api/?name=${post.nomeUsuario}&background=5f81a5&color=fff&size=40`}
                  alt={post.nomeUsuario}
                />
                <div className="user-info">
                  <h4>{post.nomeUsuario}</h4>
                  <span className="timestamp">{formatTime(post.dataCriacao)}</span>
                </div>
                {post.usuarioId === user?.id && (
                  <button className="delete-post-btn" onClick={() => handleDelete(post.id)}>
                    <i className="bi bi-trash"></i>
                  </button>
                )}
              </div>

              <div className="post-content">
                {post.titulo && <strong><p>{post.titulo}</p></strong>}
                <p>{post.conteudo}</p>
                {post.imagem && (
                  <div className="post-media">
                    <img src={post.imagem} alt="Post" className="post-image" />
                  </div>
                )}
              </div>

              <div className="post-stats">
                <span>{post.curtidas} {post.curtidas === 1 ? 'curtida' : 'curtidas'}</span>
              </div>

              <div className="post-actions">
                <button 
                  className={`action-btn ${likedPosts.has(post.id) ? 'liked' : ''}`} 
                  onClick={() => handleLike(post.id, post.curtidas)}
                  disabled={liking}
                >
                  <i className={`bi ${likedPosts.has(post.id) ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                  {likedPosts.has(post.id) ? 'Curtido' : 'Curtir'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SocialFeed;