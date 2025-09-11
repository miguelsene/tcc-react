import { useState } from 'react';
import './BazarPreview.css';

const BazarPreview = ({ bazar, isVisible, onClose, categoriaInfo }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const images = [bazar.imagem, bazar.imagem, bazar.imagem];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!isVisible) return null;

  return (
    <div className="bazar-preview-overlay" onClick={onClose}>
      <div className="bazar-preview" onClick={(e) => e.stopPropagation()}>
        <button className="preview-close" onClick={onClose}>
          <i className="bi bi-x-lg"></i>
        </button>
        
        <div className="preview-content">
          <div className="preview-images">
            <div className="image-carousel">
              <img src={images[currentImageIndex]} alt={bazar.nome} />
              <button className="carousel-nav prev" onClick={prevImage}>
                <i className="bi bi-chevron-left"></i>
              </button>
              <button className="carousel-nav next" onClick={nextImage}>
                <i className="bi bi-chevron-right"></i>
              </button>
              <div className="image-indicators">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="preview-info">
            <div className="preview-header">
              <h2>{bazar.nome}</h2>
              <span 
                className="categoria-badge"
                style={{ backgroundColor: categoriaInfo.cor }}
              >
                <i className={categoriaInfo.icon}></i>
                {categoriaInfo.nome}
              </span>
            </div>
            
            <div className="preview-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <i 
                    key={i} 
                    className={`bi ${i < Math.floor(bazar.avaliacao) ? 'bi-star-fill' : 'bi-star'}`}
                  ></i>
                ))}
              </div>
              <span className="rating-text">{bazar.avaliacao} ({bazar.totalAvaliacoes} avaliações)</span>
            </div>
            
            <p className="preview-description">{bazar.descricao}</p>
            
            <div className="preview-details">
              <div className="detail-item">
                <i className="bi bi-geo-alt-fill"></i>
                <span>{bazar.endereco.rua}, {bazar.endereco.cidade}</span>
              </div>
              <div className="detail-item">
                <i className="bi bi-telephone-fill"></i>
                <span>{bazar.telefone}</span>
              </div>
              <div className="detail-item">
                <i className="bi bi-clock-fill"></i>
                <span>{bazar.horarioFuncionamento}</span>
              </div>
            </div>
            
            <div className="preview-actions">
              <button className="btn btn-primary">
                <i className="bi bi-eye-fill"></i>
                Ver Detalhes
              </button>
              <button className="btn btn-secondary">
                <i className="bi bi-chat-dots-fill"></i>
                Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BazarPreview;