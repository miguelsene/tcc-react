import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { defaultBazares, categorias } from '../../data/bazares';
import { useScrollAnimationMultiple } from '../../hooks/useScrollAnimation';
import BazarPreview from '../../components/BazarPreview/BazarPreview';
import './Home.css';

const Home = ({ searchTerm: globalSearchTerm, user }) => {
  const [bazares, setBazares] = useState([]);
  const [filteredBazares, setFilteredBazares] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [previewBazar, setPreviewBazar] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useScrollAnimationMultiple();

  useEffect(() => {
    const userBazares = JSON.parse(localStorage.getItem('fashionspace_bazares') || '[]');
    const savedFavoritos = JSON.parse(localStorage.getItem('fashionspace_favoritos') || '[]');
    
    const allBazares = [...defaultBazares, ...userBazares];
    setBazares(allBazares);
    setFilteredBazares(allBazares);
    setFavoritos(savedFavoritos);
  }, []);

  useEffect(() => {
    let filtered = bazares;

    if (selectedCategory) {
      filtered = filtered.filter(bazar => 
        bazar.categoria.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    const currentSearchTerm = globalSearchTerm || searchTerm;
    if (currentSearchTerm) {
      filtered = filtered.filter(bazar =>
        bazar.nome.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
        bazar.descricao.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
        bazar.endereco.cidade.toLowerCase().includes(currentSearchTerm.toLowerCase())
      );
    }

    setFilteredBazares(filtered);
  }, [bazares, selectedCategory, searchTerm, globalSearchTerm]);

  useEffect(() => {
    if (globalSearchTerm !== undefined) {
      setSearchTerm(globalSearchTerm);
    }
  }, [globalSearchTerm]);

  const toggleFavorito = (bazarId) => {
    const newFavoritos = favoritos.includes(bazarId)
      ? favoritos.filter(id => id !== bazarId)
      : [...favoritos, bazarId];
    
    setFavoritos(newFavoritos);
    localStorage.setItem('fashionspace_favoritos', JSON.stringify(newFavoritos));
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

  const getCategoriaInfo = (categoria) => {
    return categorias.find(cat => cat.nome.toLowerCase() === categoria.toLowerCase()) || 
           { cor: '#5f81a5', nome: categoria, icon: 'bi-shop' };
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="bi bi-star-fill star-filled"></i>);
    }
    if (hasHalfStar) {
      stars.push(<i key="half" className="bi bi-star-half star-filled"></i>);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="bi bi-star star-empty"></i>);
    }
    return stars;
  };

  const renderCarousel = (title, items, icon, carouselId) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerView = 3;
    const maxIndex = Math.max(0, items.length - itemsPerView);

    const nextSlide = () => {
      setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1);
    };

    const prevSlide = () => {
      setCurrentIndex(prev => prev <= 0 ? maxIndex : prev - 1);
    };

    return (
      <section className="carousel-section scroll-animate">
        <div className="carousel-header">
          <h2>
            <i className={icon}></i>
            {title}
          </h2>
          <div className="carousel-nav">
            <button className="carousel-btn prev" onClick={prevSlide}>
              <i className="bi bi-chevron-left"></i>
            </button>
            <button className="carousel-btn next" onClick={nextSlide}>
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
        <div className="carousel-container">
          <div 
            className="carousel-track"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
            }}
          >
            {items.map((bazar, index) => {
            const categoriaInfo = getCategoriaInfo(bazar.categoria);
            const isFavorito = favoritos.includes(bazar.id);
            
            return (
              <div key={bazar.id} className="carousel-item">
                <div className="bazar-card" onMouseEnter={() => handleCardHover(bazar)} onMouseLeave={handleCardLeave}>
                  <div className="bazar-image">
                    <img src={bazar.imagem} alt={bazar.nome} />
                    <button 
                      className={`favorite-btn ${isFavorito ? 'active' : ''}`}
                      onClick={() => toggleFavorito(bazar.id)}
                    >
                      <i className={isFavorito ? 'bi bi-heart-fill' : 'bi bi-heart'}></i>
                    </button>
                    <div className="rating-overlay">
                      <div className="stars">
                        {renderStars(bazar.avaliacao)}
                      </div>
                      <span className="rating-text">{bazar.avaliacao}</span>
                    </div>
                  </div>
                  <div className="bazar-content">
                    <div className="bazar-header">
                      <h3>{bazar.nome}</h3>
                      <span 
                        className="categoria-badge"
                        style={{ backgroundColor: categoriaInfo.cor }}
                      >
                        <i className={categoriaInfo.icon}></i>
                      </span>
                    </div>
                    <p className="bazar-description">{bazar.descricao}</p>
                    <div className="bazar-info">
                      <div className="info-item">
                        <i className="bi bi-geo-alt-fill"></i>
                        <span>{bazar.endereco.cidade}</span>
                      </div>
                      <div className="info-item">
                        <i className="bi bi-star-fill"></i>
                        <span>{bazar.totalAvaliacoes} avaliações</span>
                      </div>
                    </div>
                    <div className="bazar-actions">
                      <Link to={`/bazar-detalhes/${bazar.id}`} className="btn btn-primary">
                        <i className="bi bi-eye-fill"></i>
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </section>
    );
  };

  const destaques = bazares.filter(b => b.avaliacao >= 4.7).slice(0, 8);
  const novidades = bazares.slice(-8);
  const populares = bazares.filter(b => b.totalAvaliacoes > 100).slice(0, 8);
  const promocoes = bazares.filter(b => b.categoria === 'Outlet').slice(0, 8);

  return (
    <div className="home">
      <section className="hero scroll-animate-fade">
        <div className="wave-1"></div>
        <div className="wave-2"></div>
        <div className="hero-content">
          <h1>Descubra os Melhores Bazares de Moda</h1>
          <p>Conecte-se com bazares únicos, encontre peças especiais e apoie negócios locais</p>
          <div className="hero-actions">
            {user?.tipoUsuario === 'dono' && (
              <Link to="/adicionar-bazar" className="btn btn-primary">
                <i className="bi bi-plus-circle-fill"></i>
                Criar Bazar
              </Link>
            )}
            <button className="btn btn-secondary" onClick={() => document.getElementById('bazares').scrollIntoView()}>
              <i className="bi bi-search"></i>
              Explorar Agora
            </button>
          </div>
        </div>
        <div className="hero-stats scroll-animate-scale">
          <div className="stat-item">
            <div className="stat-number">{bazares.length}</div>
            <div className="stat-label">Bazares Ativos</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{categorias.length}</div>
            <div className="stat-label">Categorias</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">4.7</div>
            <div className="stat-label">Avaliação Média</div>
          </div>
        </div>
      </section>

      <div className="category-filter scroll-animate">
        <h3>
          <i className="bi bi-funnel-fill"></i>
          Filtrar por Categoria
        </h3>
        <div className="categories-grid">
          <button
            className={`category-btn ${selectedCategory === '' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('')}
          >
            <i className="bi bi-grid-fill"></i>
            <span>Todas</span>
          </button>
          {categorias.map(categoria => (
            <button
              key={categoria.id}
              className={`category-btn ${selectedCategory === categoria.nome ? 'active' : ''}`}
              onClick={() => setSelectedCategory(categoria.nome)}
              style={{ '--category-color': categoria.cor }}
            >
              <i className={categoria.icon}></i>
              <span>{categoria.nome}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="scroll-animate">
        {renderCarousel("Destaques", destaques, "bi-star-fill", "destaques")}
      </div>
      <div className="scroll-animate-left">
        {renderCarousel("Novidades", novidades, "bi-lightning-fill", "novidades")}
      </div>
      <div className="scroll-animate-right">
        {renderCarousel("Mais Populares", populares, "bi-fire", "populares")}
      </div>
      <div className="scroll-animate">
        {renderCarousel("Promoções", promocoes, "bi-tag-fill", "promocoes")}
      </div>

      <section id="bazares" className="bazares-section">
        <div className="section-header scroll-animate">
          <h2>Explore Todos os Bazares</h2>
          <p>Encontre o bazar perfeito para você</p>
        </div>

        <div className="search-and-filter scroll-animate-left">
          <div className="search-container">
            <i className="bi bi-search search-icon"></i>
            <input
              type="text"
              placeholder="Buscar bazares por nome, descrição ou cidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {filteredBazares.length === 0 ? (
          <div className="empty-state scroll-animate">
            <i className="bi bi-shop empty-icon"></i>
            <h3>Nenhum bazar encontrado</h3>
            <p>
              {selectedCategory || searchTerm 
                ? 'Tente ajustar os filtros ou buscar por outros termos.'
                : 'Seja o primeiro a criar um bazar!'
              }
            </p>
            {!selectedCategory && !searchTerm && user?.tipoUsuario === 'dono' && (
              <Link to="/adicionar-bazar" className="btn btn-primary">
                <i className="bi bi-plus-circle-fill"></i>
                Criar Primeiro Bazar
              </Link>
            )}
            {(selectedCategory || searchTerm) && (
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setSelectedCategory('');
                  setSearchTerm('');
                }}
              >
                <i className="bi bi-arrow-clockwise"></i>
                Limpar Filtros
              </button>
            )}
          </div>
        ) : (
          <div className="bazares-grid">
            {filteredBazares.map((bazar, index) => {
              const categoriaInfo = getCategoriaInfo(bazar.categoria);
              const isFavorito = favoritos.includes(bazar.id);
              
              return (
                <div 
                  key={bazar.id} 
                  className="bazar-card scroll-animate-scale"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onMouseEnter={() => handleCardHover(bazar)}
                  onMouseLeave={handleCardLeave}
                >
                  <div className="bazar-image">
                    <img src={bazar.imagem} alt={bazar.nome} />
                    <button 
                      className={`favorite-btn ${isFavorito ? 'active' : ''}`}
                      onClick={() => toggleFavorito(bazar.id)}
                    >
                      <i className={isFavorito ? 'bi bi-heart-fill' : 'bi bi-heart'}></i>
                    </button>
                    <div className="rating-overlay">
                      <div className="stars">
                        {renderStars(bazar.avaliacao)}
                      </div>
                      <span className="rating-text">{bazar.avaliacao}</span>
                    </div>
                  </div>
                  
                  <div className="bazar-content">
                    <div className="bazar-header">
                      <h3>{bazar.nome}</h3>
                      <span 
                        className="categoria-badge"
                        style={{ backgroundColor: categoriaInfo.cor }}
                      >
                        <i className={categoriaInfo.icon}></i>
                        {categoriaInfo.nome}
                      </span>
                    </div>
                    
                    <p className="bazar-description">{bazar.descricao}</p>
                    
                    <div className="bazar-info">
                      <div className="info-item">
                        <i className="bi bi-geo-alt-fill"></i>
                        <span>{bazar.endereco.cidade}</span>
                      </div>
                      <div className="info-item">
                        <i className="bi bi-telephone-fill"></i>
                        <span>{bazar.telefone}</span>
                      </div>
                      <div className="info-item">
                        <i className="bi bi-star-fill"></i>
                        <span>{bazar.totalAvaliacoes} avaliações</span>
                      </div>
                    </div>
                    
                    <div className="bazar-actions">
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
      </section>
      
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

export default Home;