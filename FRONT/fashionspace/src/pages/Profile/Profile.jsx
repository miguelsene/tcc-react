import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categorias } from '../../data/bazares';
import { bazarService, formatarBazarParaFrontend } from '../../services/api';
import BazarPreview from '../../components/BazarPreview/BazarPreview';
import { chatService } from '../../services/chatService';
import './Profile.css';

const MessagesPreview = ({ user }) => {
  const [conversations, setConversations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadConversations();
  }, [user]);

  const loadConversations = async () => {
    try {
      const [conversas, { count }] = await Promise.all([
        chatService.getAllConversations(user.id, user.tipoUsuario),
        chatService.getUnreadCount(user.id)
      ]);
      
      // Buscar dados dos usuários para as conversas
      const conversasComUsuarios = await Promise.all(
        conversas.slice(0, 3).map(async (conversa) => {
          try {
            const response = await fetch(`http://localhost:8080/api/usuario/${conversa.remetenteId === user.id ? conversa.destinatarioId : conversa.remetenteId}`);
            const usuario = response.ok ? await response.json() : null;
            return {
              ...conversa,
              usuario: usuario || {
                nome: 'Usuário',
                fotoPerfil: `https://ui-avatars.com/api/?name=U&background=5f81a5&color=fff&size=40`
              }
            };
          } catch {
            return {
              ...conversa,
              usuario: {
                nome: 'Usuário',
                fotoPerfil: `https://ui-avatars.com/api/?name=U&background=5f81a5&color=fff&size=40`
              }
            };
          }
        })
      );
      
      setConversations(conversasComUsuarios);
      setUnreadCount(count || 0);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffHours < 1) return 'Agora';
    if (diffHours < 24) return `${diffHours}h`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="messages-section scroll-animate">
      <div className="messages-card">
        <div className="messages-header">
          <div className="messages-icon">
            <i className="bi bi-chat-dots-fill"></i>
          </div>
          <div className="messages-info">
            <h3>Mensagens Recentes</h3>
            <p>{unreadCount} não lidas • {conversations.length} conversas</p>
          </div>
          <Link to="/mensagens" className="messages-btn">
            <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
        
        <div className="conversations-preview">
          {conversations.length > 0 ? (
            conversations.map((conversa) => (
              <Link 
                key={conversa.id} 
                to={`/chat/${conversa.bazarId}`}
                className="conversation-item"
              >
                <img 
                  src={conversa.usuario.fotoPerfil || `https://ui-avatars.com/api/?name=${conversa.usuario.nome}&background=5f81a5&color=fff&size=40`}
                  alt={conversa.usuario.nome}
                  className="user-avatar"
                />
                <div className="conversation-content">
                  <div className="conversation-header">
                    <span className="user-name">{conversa.usuario.nome}</span>
                    <span className="message-time">{formatTime(conversa.dataEnvio)}</span>
                  </div>
                  <p className="last-message">
                    {conversa.conteudo.length > 40 ? 
                      conversa.conteudo.substring(0, 40) + '...' : 
                      conversa.conteudo
                    }
                  </p>
                </div>
                {!conversa.lida && conversa.destinatarioId === user.id && (
                  <div className="unread-indicator"></div>
                )}
              </Link>
            ))
          ) : (
            <div className="no-conversations">
              <i className="bi bi-chat-dots"></i>
              <p>Nenhuma conversa ainda</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Profile = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [userBazares, setUserBazares] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [previewBazar, setPreviewBazar] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ nome: user.nome, email: user.email, fotoPerfil: user.fotoPerfil });
  const [stats, setStats] = useState({ views: 0, likes: 0, messages: 0 });
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const bazaresFromAPI = await bazarService.buscarPorUsuario(user.id);
        const userCreatedBazares = bazaresFromAPI.map(formatarBazarParaFrontend);
        
        const savedFavoritos = JSON.parse(localStorage.getItem('fashionspace_favoritos') || '[]');
        const posts = JSON.parse(localStorage.getItem('fashionspace_posts') || '[]');
        const userPosts = posts.filter(post => post.userId === user.id);
        
        const totalLikes = userPosts.reduce((sum, post) => sum + post.likes.length, 0);
        const totalViews = userCreatedBazares.length * 150 + Math.floor(Math.random() * 500);
        const totalMessages = Math.floor(Math.random() * 50) + userCreatedBazares.length * 5;
        
        setUserBazares(userCreatedBazares);
        setFavoritos(savedFavoritos);
        setStats({ views: totalViews, likes: totalLikes, messages: totalMessages });
      } catch (error) {
        console.error('Erro ao carregar bazares do usuário:', error);
        const bazares = JSON.parse(localStorage.getItem('fashionspace_bazares') || '[]');
        const userCreatedBazares = bazares.filter(bazar => bazar.criadoPor === user.id);
        setUserBazares(userCreatedBazares);
      }
    };

    loadUserData();
    
    const handleBazaresUpdate = () => {
      loadUserData();
    };
    
    window.addEventListener('bazaresUpdated', handleBazaresUpdate);
    
    return () => {
      window.removeEventListener('bazaresUpdated', handleBazaresUpdate);
    };
  }, [user.id]);

  const handleLogout = () => {
    if (window.confirm('Deseja realmente sair da sua conta?')) {
      localStorage.removeItem('fashionspace_user');
      setUser(null);
      window.location.href = '/login';
    }
  };

  const handleEditProfile = async () => {
    if (isEditing) {
      if (!editData.nome || editData.nome.trim().length < 2) {
        alert('Nome deve ter pelo menos 2 caracteres');
        return;
      }
      
      if (!editData.email || !editData.email.includes('@')) {
        alert('Email inválido');
        return;
      }
      
      try {
        const response = await fetch(`http://localhost:8080/api/usuario/${user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nome: editData.nome,
            email: editData.email,
            senha: user.senha,
            tipoUsuario: user.tipoUsuario,
            fotoPerfil: editData.fotoPerfil
          })
        });
        
        if (response.ok) {
          const updatedUser = await response.json();
          setUser(updatedUser);
          localStorage.setItem('fashionspace_user', JSON.stringify(updatedUser));
          
          const users = JSON.parse(localStorage.getItem('fashionspace_users') || '[]');
          const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
          localStorage.setItem('fashionspace_users', JSON.stringify(updatedUsers));
          
          alert('Perfil atualizado com sucesso!');
        } else {
          const error = await response.json();
          alert('Erro ao atualizar perfil: ' + (error.message || 'Tente novamente'));
          return;
        }
      } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        alert('Erro ao conectar com o servidor. Tente novamente.');
        return;
      }
    }
    setIsEditing(!isEditing);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Arquivo muito grande. Máximo 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        setEditData({...editData, fotoPerfil: base64});
        setPhotoPreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteBazar = async (bazarId) => {
    if (window.confirm('Deseja realmente excluir este bazar? Esta ação não pode ser desfeita.')) {
      try {
        await bazarService.deletar(bazarId);
        
        setUserBazares(prev => prev.filter(bazar => bazar.id !== bazarId));
        
        const updatedFavoritos = favoritos.filter(id => id !== bazarId);
        localStorage.setItem('fashionspace_favoritos', JSON.stringify(updatedFavoritos));
        setFavoritos(updatedFavoritos);
        
        window.dispatchEvent(new Event('bazaresUpdated'));
        
        alert('Bazar excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir bazar:', error);
        alert('Erro ao excluir bazar. Tente novamente.');
      }
    }
  };

  const getCategoriaInfo = (categoria) => {
    return categorias.find(cat => cat.nome.toLowerCase() === categoria.toLowerCase()) || 
           { cor: '#5f81a5', nome: categoria };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleCardHover = (bazar) => {
    setPreviewBazar(bazar);
    setShowPreview(true);
  };

  const handleCardLeave = () => {
    setShowPreview(false);
    setPreviewBazar(null);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setPreviewBazar(null);
  };

  return (
    <div className="profile">
      <div className="profile-header scroll-animate">
        <div className="user-info scroll-animate-left">
          <div className="avatar-container">
            <img 
              src={photoPreview || user.fotoPerfil || `https://ui-avatars.com/api/?name=${user.nome}&background=5f81a5&color=fff&size=80`}
              alt="Avatar"
              className="user-avatar-large"
            />
            {isEditing && (
              <div className="avatar-upload">
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{display: 'none'}}
                />
                <label htmlFor="photo-upload" className="upload-btn">
                  <i className="bi bi-camera-fill"></i>
                </label>
              </div>
            )}
          </div>
          <div className="user-details">
            {isEditing ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editData.nome}
                  onChange={(e) => setEditData({...editData, nome: e.target.value})}
                  className="form-control"
                  placeholder="Nome"
                  required
                  minLength="2"
                />
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                  className="form-control"
                  placeholder="Email"
                  required
                />
                <div className="edit-actions">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditData({ nome: user.nome, email: user.email, fotoPerfil: user.fotoPerfil });
                      setPhotoPreview(null);
                      setIsEditing(false);
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1>{user.nome}</h1>
                <p className="user-email">{user.email}</p>
              </>
            )}
            <div className="user-badges">
              <span className="member-badge">
                <i className="bi bi-award-fill"></i>
                Membro desde {formatDate(user.dataCadastro)}
              </span>
              <span className="type-badge">
                <i className="bi bi-person-fill"></i>
                {user.tipoUsuario === 'dono' ? 'Dono de Bazar' : 'Usuário'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="profile-actions scroll-animate-right">
          <button className="edit-btn" onClick={handleEditProfile}>
            <i className={`bi ${isEditing ? 'bi-check-circle-fill' : 'bi-pencil-fill'}`}></i>
            {isEditing ? 'Salvar' : 'Editar'}
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i>
            Sair
          </button>
        </div>
      </div>

      <div className="profile-stats scroll-animate">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="bi bi-shop"></i>
          </div>
          <div className="stat-info">
            <div className="stat-number">{userBazares.length}</div>
            <div className="stat-label">Bazares Criados</div>
          </div>
        </div>
        {user.tipoUsuario !== 'dono' && (
          <div className="stat-card">
            <div className="stat-icon">
              <i className="bi bi-heart-fill"></i>
            </div>
            <div className="stat-info">
              <div className="stat-number">{favoritos.length}</div>
              <div className="stat-label">Favoritos</div>
            </div>
          </div>
        )}
        <div className="stat-card">
          <div className="stat-icon">
            <i className="bi bi-eye-fill"></i>
          </div>
          <div className="stat-info">
            <div className="stat-number">{stats.views}</div>
            <div className="stat-label">Visualizações</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="bi bi-hand-thumbs-up-fill"></i>
          </div>
          <div className="stat-info">
            <div className="stat-number">{stats.likes}</div>
            <div className="stat-label">Curtidas</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="bi bi-chat-dots-fill"></i>
          </div>
          <div className="stat-info">
            <div className="stat-number">{stats.messages}</div>
            <div className="stat-label">Mensagens</div>
          </div>
        </div>
      </div>

      {user.tipoUsuario === 'dono' && (
        <MessagesPreview user={user} />
      )}

      <div className="profile-section scroll-animate">
        <div className="section-header scroll-animate-left">
          <h2>
            <i className="bi bi-shop"></i>
            {user.tipoUsuario === 'dono' ? 'Meus Bazares' : 'Bazares Criados'}
          </h2>
          {user.tipoUsuario === 'dono' && (
            <Link to="/adicionar-bazar" className="btn btn-primary">
              <i className="bi bi-plus-circle-fill"></i>
              Criar Novo Bazar
            </Link>
          )}
        </div>

        {userBazares.length === 0 ? (
          <div className="empty-state scroll-animate-scale">
            <i className="bi bi-shop empty-icon"></i>
            <h3>Você ainda não criou nenhum bazar</h3>
            <p>Que tal compartilhar seu primeiro bazar com a comunidade?</p>
            {user.tipoUsuario === 'dono' && (
              <Link to="/adicionar-bazar" className="btn btn-primary">
                <i className="bi bi-plus-circle-fill"></i>
                Criar Primeiro Bazar
              </Link>
            )}
          </div>
        ) : (
          <div className="bazares-modern-grid">
            {userBazares.map((bazar, index) => {
              const categoriaInfo = getCategoriaInfo(bazar.categoria);
              console.log('Bazar ID para edição:', bazar.id, 'Tipo:', typeof bazar.id);
              
              return (
                <div key={bazar.id} className="modern-bazar-card scroll-animate-scale" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="modern-card-header">
                    <div className="bazar-avatar">
                      <img src={bazar.imagem} alt={bazar.nome} />
                    </div>
                    <div className="bazar-info">
                      <h3>{bazar.nome}</h3>
                      <span className="categoria-tag" style={{ backgroundColor: categoriaInfo.cor }}>
                        {categoriaInfo.nome}
                      </span>
                    </div>
                  </div>
                  
                  <div className="modern-card-content">
                    <p className="bazar-description">{bazar.descricao}</p>
                    
                    <div className="bazar-stats">
                      <div className="stat-item">
                        <i className="bi bi-eye-fill"></i>
                        <span>150 visualizações</span>
                      </div>
                      <div className="stat-item">
                        <i className="bi bi-chat-dots-fill"></i>
                        <span>12 mensagens</span>
                      </div>
                      <div className="stat-item">
                        <i className="bi bi-geo-alt-fill"></i>
                        <span>{bazar.endereco.cidade}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="modern-card-actions">
                    <Link to={`/chat/${bazar.id}`} className="action-btn chat-btn">
                      <i className="bi bi-chat-dots-fill"></i>
                      Mensagens
                    </Link>
                    <Link to={`/editar-bazar/${bazar.id}`} className="action-btn edit-btn">
                      <i className="bi bi-pencil-fill"></i>
                      Editar
                    </Link>
                    <Link to={`/bazar-detalhes/${bazar.id}`} className="action-btn view-btn">
                      <i className="bi bi-eye-fill"></i>
                      Ver
                    </Link>
                    <button 
                      onClick={() => deleteBazar(bazar.id)}
                      className="action-btn delete-btn"
                    >
                      <i className="bi bi-trash-fill"></i>
                      Excluir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="profile-quick-actions">
        {user.tipoUsuario !== 'dono' ? (
          <>
            <Link to="/favoritos" className="action-card">
              <div className="action-icon">
                <i className="bi bi-heart-fill"></i>
              </div>
              <div className="action-content">
                <h3>Meus Favoritos</h3>
                <p>{favoritos.length} bazares favoritados</p>
              </div>
              <div className="action-arrow">
                <i className="bi bi-arrow-right"></i>
              </div>
            </Link>
            <Link to="/mensagens" className="action-card">
              <div className="action-icon">
                <i className="bi bi-chat-dots-fill"></i>
              </div>
              <div className="action-content">
                <h3>Minhas Mensagens</h3>
                <p>Conversas com bazares</p>
              </div>
              <div className="action-arrow">
                <i className="bi bi-arrow-right"></i>
              </div>
            </Link>
          </>
        ) : (
          <Link to="/adicionar-bazar" className="action-card">
            <div className="action-icon">
              <i className="bi bi-plus-circle-fill"></i>
            </div>
            <div className="action-content">
              <h3>Criar Novo Bazar</h3>
              <p>Adicione mais um bazar</p>
            </div>
            <div className="action-arrow">
              <i className="bi bi-arrow-right"></i>
            </div>
          </Link>
        )}
        
        <Link to="/" className="action-card">
          <div className="action-icon">
            <i className="bi bi-search"></i>
          </div>
          <div className="action-content">
            <h3>Explorar Bazares</h3>
            <p>Descubra novos bazares</p>
          </div>
          <div className="action-arrow">
            <i className="bi bi-arrow-right"></i>
          </div>
        </Link>
      </div>
      
      {previewBazar && (
        <BazarPreview
          bazar={previewBazar}
          isVisible={showPreview}
          onClose={handleClosePreview}
          categoriaInfo={getCategoriaInfo(previewBazar.categoria)}
        />
      )}
    </div>
  );
};

export default Profile;