import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categorias } from '../../data/bazares';
import FavoriteButton from '../FavoriteButton/FavoriteButton';
import './BazarCarousel.css';

const BazarCarousel = ({ bazares }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isDono, setIsDono] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1200) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('fashionspace_user') || 'null');
      setIsDono(user?.tipoUsuario === 'dono');
    } catch {}
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + itemsPerView >= bazares.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, bazares.length - itemsPerView) : prev - 1
    );
  };

  const getCategoriaInfo = (categoria) => {
    return categorias.find(cat => cat.nome.toLowerCase() === categoria.toLowerCase()) || 
           { cor: '#5f81a5', nome: categoria };
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

  return (
    <div className="bazar-carousel scroll-animate">
      <div className="carousel-header">
        <h2>Bazares em Destaque</h2>
        <div className="carousel-controls">
          <button className="carousel-btn prev" onClick={prevSlide}>
            <i className="bi bi-chevron-left"></i>
          </button>
          <button className="carousel-btn next" onClick={nextSlide}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>

      <div className="carousel-container">
        <button className="carousel-arrow prev" onClick={prevSlide}>
          <i className="bi bi-chevron-left"></i>
        </button>
        <button className="carousel-arrow next" onClick={nextSlide}>
          <i className="bi bi-chevron-right"></i>
        </button>
        <div 
          className="carousel-track"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            width: `${(bazares.length / itemsPerView) * 100}%`
          }}
        >
          {bazares.map((bazar, index) => {
            const categoriaInfo = getCategoriaInfo(bazar.categoria);

            
            return (
              <div 
                key={bazar.id} 
                className="carousel-item"
                style={{ width: `${100 / bazares.length}%` }}
              >
                <div className="bazar-card">
                  <div className="bazar-image">
                    <img src={bazar.imagem} alt={bazar.nome} />
                    {!isDono && (
                      <div className="favorite-btn-container">
                        <FavoriteButton bazarId={bazar.id} size="medium" />
                      </div>
                    )}
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
              </div>
            );
          })}
        </div>
      </div>

      <div className="carousel-indicators">
        {Array.from({ length: Math.ceil(bazares.length / itemsPerView) }).map((_, index) => (
          <button
            key={index}
            className={`indicator ${Math.floor(currentIndex / itemsPerView) === index ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index * itemsPerView)}
          />
        ))}
      </div>
    </div>
  );
};

export default BazarCarousel;