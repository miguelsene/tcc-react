import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { defaultBazares, categorias } from '../../data/bazares';
import './Home.css';

const Home = () => {
  const [bazares, setBazares] = useState([]);
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    const userBazares = JSON.parse(localStorage.getItem('fashionspace_bazares') || '[]');
    const savedFavoritos = JSON.parse(localStorage.getItem('fashionspace_favoritos') || '[]');
    
    setBazares([...defaultBazares, ...userBazares]);
    setFavoritos(savedFavoritos);
  }, []);

  const toggleFavorito = (bazarId) => {
    const newFavoritos = favoritos.includes(bazarId)
      ? favoritos.filter(id => id !== bazarId)
      : [...favoritos, bazarId];
    
    setFavoritos(newFavoritos);
    localStorage.setItem('fashionspace_favoritos', JSON.stringify(newFavoritos));
  };

  const getCategoriaInfo = (categoria) => {
    return categorias.find(cat => cat.nome.toLowerCase() === categoria.toLowerCase()) || 
           { cor: '#6c757d', nome: categoria };
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Descubra os Melhores Bazares de Moda</h1>
          <p>Conecte-se com bazares únicos, encontre peças especiais e apoie negócios locais</p>
          <div className="hero-actions">
            <Link to="/adicionar-bazar" className="btn btn-primary">
              ➕ Criar Bazar
            </Link>
            <button className="btn btn-secondary" onClick={() => document.getElementById('bazares').scrollIntoView()}>
              🔍 Explorar Agora
            </button>
          </div>
        </div>
      </section>

      <section id="bazares" className="bazares-section">
        <div className="section-header">
          <h2>Bazares Disponíveis</h2>
          <p>Encontre o bazar perfeito para você</p>
        </div>

        {bazares.length === 0 ? (
          <div className="empty-state">
            <h3>Nenhum bazar encontrado</h3>
            <p>Seja o primeiro a criar um bazar!</p>
            <Link to="/adicionar-bazar" className="btn btn-primary">
              ➕ Criar Primeiro Bazar
            </Link>
          </div>
        ) : (
          <div className="bazares-grid">
            {bazares.map(bazar => {
              const categoriaInfo = getCategoriaInfo(bazar.categoria);
              const isFavorito = favoritos.includes(bazar.id);
              
              return (
                <div key={bazar.id} className="bazar-card">
                  <div className="bazar-image">
                    <img src={bazar.imagem} alt={bazar.nome} />
                    <button 
                      className={`favorite-btn ${isFavorito ? 'active' : ''}`}
                      onClick={() => toggleFavorito(bazar.id)}
                    >
                      {isFavorito ? '❤️' : '🤍'}
                    </button>
                  </div>
                  
                  <div className="bazar-content">
                    <div className="bazar-header">
                      <h3>{bazar.nome}</h3>
                      <span 
                        className="categoria-badge"
                        style={{ backgroundColor: categoriaInfo.cor }}
                      >
                        {categoriaInfo.nome}
                      </span>
                    </div>
                    
                    <p className="bazar-description">{bazar.descricao}</p>
                    
                    <div className="bazar-info">
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
                    
                    <div className="bazar-actions">
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
      </section>
    </div>
  );
};

export default Home;