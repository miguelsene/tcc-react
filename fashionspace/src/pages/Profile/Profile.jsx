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

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="user-info">
          <img 
            src={`https://ui-avatars.com/api/?name=${user.nome}&background=5f81a5&color=fff&size=80`}
            alt="Avatar"
            className="user-avatar-large"
          />
          <div className="user-details">
            <h1>{user.nome}</h1>
            <p className="user-email">{user.email}</p>
            <span className="member-badge">
              <i className="bi bi-award-fill"></i>
              Membro desde {formatDate(user.dataCadastro)}
            </span>
          </div>
        </div>
        
        <button className="logout-btn" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right"></i>
          Sair da Conta
        </button>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <div className="stat-number">{userBazares.length}</div>
          <div className="stat-label">
            <i className="bi bi-shop"></i>
            Bazares Criados
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{favoritos.length}</div>
          <div className="stat-label">
            <i className="bi bi-heart-fill"></i>
            Favoritos
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            <i className="bi bi-star-fill"></i>
          </div>
          <div className="stat-label">Membro Ativo</div>
        </div>
      </div>

      <div className="profile-section">
        <div className="section-header">
          <h2>
            <i className="bi bi-shop"></i>
            Meus Bazares
          </h2>
          <Link to="/adicionar-bazar" className="btn btn-primary">
            <i className="bi bi-plus-circle-fill"></i>
            Criar Novo Bazar
          </Link>
        </div>

        {userBazares.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-shop empty-icon"></i>
            <h3>Você ainda não criou nenhum bazar</h3>
            <p>Que tal compartilhar seu primeiro bazar com a comunidade?</p>
            <Link to="/adicionar-bazar" className="btn btn-primary">
              <i className="bi bi-plus-circle-fill"></i>
              Criar Primeiro Bazar
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

      <div className="profile-actions">
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
    </div>
  );
};

export default Profile;