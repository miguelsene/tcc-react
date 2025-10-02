import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useScrollAnimationMultiple } from '../../hooks/useScrollAnimation';
import { categorias } from '../../data/bazares';
import BazarPreview from '../../components/BazarPreview/BazarPreview';
import './Profile.css';

const Profile = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [userBazares, setUserBazares] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [previewBazar, setPreviewBazar] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ nome: user.nome, email: user.email });
  const [stats, setStats] = useState({ views: 0, likes: 0, messages: 0 });
  
  useScrollAnimationMultiple();

  useEffect(() => {
    const loadUserData = () => {
      const bazares = JSON.parse(localStorage.getItem('fashionspace_bazares') || '[]');
      const userCreatedBazares = bazares.filter(bazar => bazar.criadoPor === user.id);
      const savedFavoritos = JSON.parse(localStorage.getItem('fashionspace_favoritos') || '[]');
      const posts = JSON.parse(localStorage.getItem('fashionspace_posts') || '[]');
      const userPosts = posts.filter(post => post.userId === user.id);
      
      // Calcular estatísticas
      const totalLikes = userPosts.reduce((sum, post) => sum + post.likes.length, 0);
      const totalViews = userCreatedBazares.length * 150 + Math.floor(Math.random() * 500);
      const totalMessages = Math.floor(Math.random() * 50) + userCreatedBazares.length * 5;
      
      setUserBazares(userCreatedBazares);
      setFavoritos(savedFavoritos);
      setStats({ views: totalViews, likes: totalLikes, messages: totalMessages });
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

  const handleEditProfile = () => {
    if (isEditing) {
      // Salvar alterações
      const updatedUser = { ...user, ...editData };
      setUser(updatedUser);
      localStorage.setItem('fashionspace_user', JSON.stringify(updatedUser));
      
      // Atualizar na lista de usuários
      const users = JSON.parse(localStorage.getItem('fashionspace_users') || '[]');
      const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
      localStorage.setItem('fashionspace_users', JSON.stringify(updatedUsers));
    }
    setIsEditing(!isEditing);
  };

  const deleteBazar = (bazarId) => {
    if (window.confirm('Deseja realmente excluir este bazar? Esta ação não pode ser desfeita.')) {
      const bazares = JSON.parse(localStorage.getItem('fashionspace_bazares') || '[]');
      const updatedBazares = bazares.filter(bazar => bazar.id !== bazarId);
      
      localStorage.setItem('fashionspace_bazares', JSON.stringify(updatedBazares));
      setUserBazares(updatedBazares.filter(bazar => bazar.criadoPor === user.id));
      
      const updatedFavoritos = favoritos.filter(id => id !== bazarId);
      localStorage.setItem('fashionspace_favoritos', JSON.stringify(updatedFavoritos));
      setFavoritos(updatedFavoritos);
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
          <img 
            src={`https://ui-avatars.com/api/?name=${user.nome}&background=5f81a5&color=fff&size=80`}
            alt="Avatar"
            className="user-avatar-large"
          />
          <div className="user-details">
            {isEditing ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editData.nome}
                  onChange={(e) => setEditData({...editData, nome: e.target.value})}
                  className="form-control"
                  placeholder="Nome"
                />
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                  className="form-control"
                  placeholder="Email"
                />
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

      <div className="profile-section scroll-animate">
        <div className="section-header scroll-animate-left">
          <h2>
            <i className="bi bi-shop"></i>
            Meus Bazares
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
          <div className="bazares-grid">
            {userBazares.map((bazar, index) => {
              const categoriaInfo = getCategoriaInfo(bazar.categoria);
              
              return (
                <div key={bazar.id} className="bazar-card scroll-animate-scale" style={{ animationDelay: `${index * 0.1}s` }} onMouseEnter={() => handleCardHover(bazar)} onMouseLeave={handleCardLeave}>
                  <div className="card-image">
                    <img src={bazar.imagem} alt={bazar.nome} />
                    <div className="card-overlay">
                      <Link 
                        to={`/editar-bazar/${bazar.id}`}
                        className="overlay-btn edit-btn"
                      >
                        <i className="bi bi-pencil-fill"></i>
                        Editar
                      </Link>
                      <button 
                        onClick={() => deleteBazar(bazar.id)}
                        className="overlay-btn delete-btn"
                      >
                        <i className="bi bi-trash-fill"></i>
                        Excluir
                      </button>
                    </div>
                  </div>
                  
                  <div className="card-content">
                    <div className="card-header">
                      <h3>{bazar.nome}</h3>
                      <span 
                        className="categoria-badge"
                        style={{ backgroundColor: categoriaInfo.cor }}
                      >
                        {categoriaInfo.nome}
                      </span>
                    </div>
                    
                    <p className="card-description">{bazar.descricao}</p>
                    
                    <div className="card-info">
                      <div className="info-item">
                        <i className="bi bi-geo-alt-fill"></i>
                        <span>{bazar.endereco.cidade}</span>
                      </div>
                      <div className="info-item">
                        <i className="bi bi-calendar-fill"></i>
                        <span>Criado em {formatDate(bazar.dataCriacao)}</span>
                      </div>
                    </div>
                    
                    <div className="card-actions">
                      <Link 
                        to={`/bazar-detalhes/${bazar.id}`} 
                        className="btn btn-secondary"
                      >
                        <i className="bi bi-eye-fill"></i>
                        Visualizar
                      </Link>
                      <Link 
                        to={`/editar-bazar/${bazar.id}`} 
                        className="btn btn-primary"
                      >
                        <i className="bi bi-pencil-fill"></i>
                        Editar
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="profile-quick-actions">
        {user.tipoUsuario !== 'dono' && (
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