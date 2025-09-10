import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { defaultBazares, categorias } from '../../data/bazares';
import './Favorites.css';

const Favorites = () => {
  const [favoritos, setFavoritos] = useState([]);
  const [bazaresFavoritos, setBazaresFavoritos] = useState([]);

  useEffect(() => {
    const savedFavoritos = JSON.parse(localStorage.getItem('fashionspace_favoritos') || '[]');
    const userBazares = JSON.parse(localStorage.getItem('fashionspace_bazares') || '[]');
    const allBazares = [...defaultBazares, ...userBazares];
    
    const bazaresFavs = allBazares.filter(bazar => savedFavoritos.includes(bazar.id));
    
    setFavoritos(savedFavoritos);
    setBazaresFavoritos(bazaresFavs);
  }, []);

  const removeFavorito = (bazarId) => {
    if (window.confirm('Deseja remover este bazar dos favoritos?')) {
      const newFavoritos = favoritos.filter(id => id !== bazarId);
      const newBazaresFavoritos = bazaresFavoritos.filter(bazar => bazar.id !== bazarId);
      
      setFavoritos(newFavoritos);
      setBazaresFavoritos(newBazaresFavoritos);
      localStorage.setItem('fashionspace_favoritos', JSON.stringify(newFavoritos));
    }
  };

  const getCategoriaInfo = (categoria) => {
    return categorias.find(cat => cat.nome.toLowerCase() === categoria.toLowerCase()) || 
           { cor: '#6c757d', nome: categoria };
  };

  return (
    <div className="favorites">
      <div className="page-header">
        <h1>❤️ Meus Favoritos</h1>
        <p>
          {bazaresFavoritos.length === 0 
            ? 'Você ainda não tem bazares favoritos' 
            : `${bazaresFavoritos.length} ${bazaresFavoritos.length === 1 ? 'bazar favoritado' : 'bazares favoritados'}`
          }
        </p>
      </div>

      {bazaresFavoritos.length === 0 ? (
        <div className="empty-favorites">
          <div className="empty-icon">💔</div>
          <h3>Nenhum favorito ainda</h3>
          <p>Explore os bazares e adicione seus favoritos para vê-los aqui!</p>
          <Link to="/" className="btn btn-primary">
            🔍 Explorar Bazares
          </Link>
        </div>
      ) : (
        <div className="favorites-grid">
          {bazaresFavoritos.map(bazar => {
            const categoriaInfo = getCategoriaInfo(bazar.categoria);
            
            return (
              <div key={bazar.id} className="favorite-card">
                <div className="card-image">
                  <img src={bazar.imagem} alt={bazar.nome} />
                  <button 
                    className="remove-favorite"
                    onClick={() => removeFavorito(bazar.id)}
                    title="Remover dos favoritos"
                  >
                    ❌
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
                      <span className="icon">📍</span>
                      <span>{bazar.endereco.cidade}</span>
                    </div>
                    <div className="info-item">
                      <span className="icon">📞</span>
                      <span>{bazar.telefone}</span>
                    </div>
                    <div className="info-item">
                      <span className="icon">🕒</span>
                      <span>{bazar.horario}</span>
                    </div>
                  </div>
                  
                  <div className="card-actions">
                    <Link 
                      to={`/bazar-detalhes/${bazar.id}`} 
                      className="btn btn-primary"
                    >
                      Ver Detalhes
                    </Link>
                    <Link 
                      to={`/chat-bazar/${bazar.id}`} 
                      className="btn btn-secondary"
                    >
                      💬 Chat
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {bazaresFavoritos.length > 0 && (
        <div className="favorites-footer">
          <p className="footer-text">
            💡 Dica: Clique no ❌ para remover um bazar dos favoritos
          </p>
          <Link to="/" className="btn btn-secondary">
            🔍 Explorar Mais Bazares
          </Link>
        </div>
      )}
    </div>
  );
};

export default Favorites;