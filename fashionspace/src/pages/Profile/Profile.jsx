import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categorias } from '../../data/bazares';
import './Profile.css';

const Profile = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [userBazares, setUserBazares] = useState([]);
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    const bazares = JSON.parse(localStorage.getItem('fashionspace_bazares') || '[]');
    const userCreatedBazares = bazares.filter(bazar => bazar.criadoPor === user.id);
    const savedFavoritos = JSON.parse(localStorage.getItem('fashionspace_favoritos') || '[]');
    
    setUserBazares(userCreatedBazares);
    setFavoritos(savedFavoritos);
  }, [user.id]);

  const handleLogout = () => {
    if (window.confirm('Deseja realmente sair da sua conta?')) {
      localStorage.removeItem('fashionspace_user');
      setUser(null);
    }
  };

  const deleteBazar = (bazarId) => {
    if (window.confirm('Deseja realmente excluir este bazar? Esta ação não pode ser desfeita.')) {
      const bazares = JSON.parse(localStorage.getItem('fashionspace_bazares') || '[]');
      const updatedBazares = bazares.filter(bazar => bazar.id !== bazarId);
      
      localStorage.setItem('fashionspace_bazares', JSON.stringify(updatedBazares));
      setUserBazares(updatedBazares.filter(bazar => bazar.criadoPor === user.id));
      
      // Remover dos favoritos também
      const updatedFavoritos = favoritos.filter(id => id !== bazarId);
      localStorage.setItem('fashionspace_favoritos', JSON.stringify(updatedFavoritos));
      setFavoritos(updatedFavoritos);
    }
  };

  const getCategoriaInfo = (categoria) => {
    return categorias.find(cat => cat.nome.toLowerCase() === categoria.toLowerCase()) || 
           { cor: '#6c757d', nome: categoria };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="user-info">
          <img 
            src={`https://ui-avatars.com/api/?name=${user.nome}&background=007bff&color=fff&size=80`}
            alt="Avatar"
            className="user-avatar-large"
          />
          <div className="user-details">
            <h1>{user.nome}</h1>
            <p className="user-email">{user.email}</p>
            <span className="member-badge">👑 Membro desde {formatDate(user.dataCadastro)}</span>
          </div>
        </div>
        
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Sair da Conta
        </button>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <div className="stat-number">{userBazares.length}</div>
          <div className="stat-label">Bazares Criados</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{favoritos.length}</div>
          <div className="stat-label">Favoritos</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">⭐</div>
          <div className="stat-label">Membro Ativo</div>
        </div>
      </div>

      <div className="profile-section">
        <div className="section-header">
          <h2>🏪 Meus Bazares</h2>
          <Link to="/adicionar-bazar" className="btn btn-primary">
            ➕ Criar Novo Bazar
          </Link>
        </div>

        {userBazares.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏪</div>
            <h3>Você ainda não criou nenhum bazar</h3>
            <p>Que tal compartilhar seu primeiro bazar com a comunidade?</p>
            <Link to="/adicionar-bazar" className="btn btn-primary">
              ➕ Criar Primeiro Bazar
            </Link>
          </div>
        ) : (
          <div className="bazares-grid">
            {userBazares.map(bazar => {
              const categoriaInfo = getCategoriaInfo(bazar.categoria);
              
              return (
                <div key={bazar.id} className="bazar-card">
                  <div className="card-image">
                    <img src={bazar.imagem} alt={bazar.nome} />
                    <div className="card-overlay">
                      <Link 
                        to={`/editar-bazar/${bazar.id}`}
                        className="overlay-btn edit-btn"
                      >
                        ✏️ Editar
                      </Link>
                      <button 
                        onClick={() => deleteBazar(bazar.id)}
                        className="overlay-btn delete-btn"
                      >
                        🗑️ Excluir
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
                        <span className="icon">📍</span>
                        <span>{bazar.endereco.cidade}</span>
                      </div>
                      <div className="info-item">
                        <span className="icon">📅</span>
                        <span>Criado em {formatDate(bazar.dataCriacao)}</span>
                      </div>
                    </div>
                    
                    <div className="card-actions">
                      <Link 
                        to={`/bazar-detalhes/${bazar.id}`} 
                        className="btn btn-secondary"
                      >
                        👁️ Visualizar
                      </Link>
                      <Link 
                        to={`/editar-bazar/${bazar.id}`} 
                        className="btn btn-primary"
                      >
                        ✏️ Editar
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="profile-actions">
        <Link to="/favoritos" className="action-card">
          <div className="action-icon">❤️</div>
          <div className="action-content">
            <h3>Meus Favoritos</h3>
            <p>{favoritos.length} bazares favoritados</p>
          </div>
          <div className="action-arrow">→</div>
        </Link>
        
        <Link to="/" className="action-card">
          <div className="action-icon">🔍</div>
          <div className="action-content">
            <h3>Explorar Bazares</h3>
            <p>Descubra novos bazares</p>
          </div>
          <div className="action-arrow">→</div>
        </Link>
      </div>
    </div>
  );
};

export default Profile;