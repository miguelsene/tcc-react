import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { defaultBazares, categorias } from '../../data/bazares';
import { useScrollAnimationMultiple } from '../../hooks/useScrollAnimation';
import BazarPreview from '../../components/BazarPreview/BazarPreview';
import './Favorites.css';

const Favorites = () => {
  const [favoritos, setFavoritos] = useState([]);
  const [bazaresFavoritos, setBazaresFavoritos] = useState([]);
  const [previewBazar, setPreviewBazar] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  
  useScrollAnimationMultiple();

  useEffect(() => {
    const loadFavorites = () => {
      const savedFavoritos = JSON.parse(localStorage.getItem('fashionspace_favoritos') || '[]');
      const userBazares = JSON.parse(localStorage.getItem('fashionspace_bazares') || '[]');
      const allBazares = [...defaultBazares, ...userBazares];
      
      const bazaresFavs = allBazares.filter(bazar => savedFavoritos.includes(bazar.id));
      
      setFavoritos(savedFavoritos);
      setBazaresFavoritos(bazaresFavs);
    };

    loadFavorites();
    
    const handleFavoritesUpdate = () => {
      loadFavorites();
    };
    
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    window.addEventListener('storage', handleFavoritesUpdate);
    
    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
      window.removeEventListener('storage', handleFavoritesUpdate);
    };
  }, []);

  const removeFavorito = (bazarId) => {
    if (window.confirm('Deseja remover este bazar dos favoritos?')) {
      const newFavoritos = favoritos.filter(id => id !== bazarId);
      
      setFavoritos(newFavoritos);
      localStorage.setItem('fashionspace_favoritos', JSON.stringify(newFavoritos));
      
      window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: newFavoritos }));
    }
  };

  const getCategoriaInfo = (categoria) => {
    return categorias.find(cat => cat.nome.toLowerCase() === categoria.toLowerCase()) || 
           { cor: '#5f81a5', nome: categoria };
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
    <div className="favorites">
      <div className="page-header">
        <h1>
          <i className="bi bi-heart-fill"></i>
          Meus Favoritos
        </h1>
        <p>
          {bazaresFavoritos.length === 0 
            ? 'Você ainda não tem bazares favoritos' 
            : `${bazaresFavoritos.length} ${bazaresFavoritos.length === 1 ? 'bazar favoritado' : 'bazares favoritados'}`
          }
        </p>
      </div>

      {bazaresFavoritos.length === 0 ? (
        <div className="empty-favorites">
          <i className="bi bi-heart empty-icon"></i>
          <h3>Nenhum favorito ainda</h3>
          <p>Explore os bazares e adicione seus favoritos para vê-los aqui!</p>
          <Link to="/" className="btn btn-primary">
            <i className="bi bi-search"></i>
            Explorar Bazares
          </Link>
        </div>
      ) : (
        <div className="favorites-grid">
          {bazaresFavoritos.map(bazar => {
            const categoriaInfo = getCategoriaInfo(bazar.categoria);
            
            return (
              <div key={bazar.id} className="favorite-card scroll-animate-scale" onMouseEnter={() => handleCardHover(bazar)} onMouseLeave={handleCardLeave}>
                <div className="card-image">
                  <img src={bazar.imagem} alt={bazar.nome} />
                  <button 
                    className="remove-favorite"
                    onClick={() => removeFavorito(bazar.id)}
                    title="Remover dos favoritos"
                  >
                    <i className="bi bi-x-circle-fill"></i>
                  </button>
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
                      <i className="bi bi-telephone-fill"></i>
                      <span>{bazar.telefone}</span>
                    </div>
                    <div className="info-item">
                      <i className="bi bi-clock-fill"></i>
                      <span>{bazar.horario}</span>
                    </div>
                  </div>
                  
                  <div className="card-actions">
                    <Link 
                      to={`/bazar-detalhes/${bazar.id}`} 
                      className="btn btn-primary"
                    >
                      <i className="bi bi-eye-fill"></i>
                      Ver Detalhes
                    </Link>
                    <Link 
                      to={`/chat-bazar/${bazar.id}`} 
                      className="btn btn-secondary"
                    >
                      <i className="bi bi-chat-dots-fill"></i>
                      Chat
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {bazaresFavoritos.length > 0 && (
        <div className="favorites-footer scroll-animate">
          <p className="footer-text">
            <i className="bi bi-lightbulb-fill"></i>
            Dica: Clique no <i className="bi bi-x-circle-fill"></i> para remover um bazar dos favoritos
          </p>
          <Link to="/" className="btn btn-secondary">
            <i className="bi bi-search"></i>
            Explorar Mais Bazares
          </Link>
        </div>
      )}
      
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

export default Favorites;