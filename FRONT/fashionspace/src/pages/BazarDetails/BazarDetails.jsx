import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { defaultBazares, categorias } from '../../data/bazares';
import ReviewSystem from '../../components/ReviewSystem/ReviewSystem';
import MapView from '../../components/MapView/MapView';
import './BazarDetails.css';

const BazarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bazar, setBazar] = useState(null);
  const [isFavorito, setIsFavorito] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [ratings, setRatings] = useState([]);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    const userBazares = JSON.parse(localStorage.getItem('fashionspace_bazares') || '[]');
    const allBazares = [...defaultBazares, ...userBazares];
    const foundBazar = allBazares.find(b => b.id === id);
    const savedUser = JSON.parse(localStorage.getItem('fashionspace_user') || 'null');
    
    if (foundBazar) {
      setBazar(foundBazar);
      
      const favoritos = JSON.parse(localStorage.getItem('fashionspace_favoritos') || '[]');
      setIsFavorito(favoritos.includes(id));
      
      const savedRatings = JSON.parse(localStorage.getItem(`fashionspace_ratings_${id}`) || '[]');
      setRatings(savedRatings);
    }
    
    setUser(savedUser);
    setLoading(false);
  }, [id]);

  const toggleFavorito = () => {
    const favoritos = JSON.parse(localStorage.getItem('fashionspace_favoritos') || '[]');
    const newFavoritos = isFavorito
      ? favoritos.filter(fId => fId !== id)
      : [...favoritos, id];
    
    localStorage.setItem('fashionspace_favoritos', JSON.stringify(newFavoritos));
    setIsFavorito(!isFavorito);
    // Notifica outras telas para atualizar favoritos imediatamente
    window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: newFavoritos }));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: bazar.nome,
          text: bazar.descricao,
          url: window.location.href
        });
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  const handleDirections = () => {
    const address = `${bazar.endereco.rua}, ${bazar.endereco.numero}, ${bazar.endereco.bairro}, ${bazar.endereco.cidade}`;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank');
  };

  const getCategoriaInfo = (categoria) => {
    return categorias.find(cat => cat.nome.toLowerCase() === categoria.toLowerCase()) || 
           { cor: '#5f81a5', nome: categoria };
  };

  const handleRatingSubmit = () => {
    if (userRating === 0) {
      alert('Por favor, selecione uma avaliação!');
      return;
    }

    const newRating = {
      id: Date.now(),
      rating: userRating,
      comment: userComment,
      userName: 'Usuário Atual',
      date: new Date().toLocaleDateString()
    };

    const updatedRatings = [...ratings, newRating];
    setRatings(updatedRatings);
    localStorage.setItem(`fashionspace_ratings_${id}`, JSON.stringify(updatedRatings));
    
    setShowRatingModal(false);
    setUserRating(0);
    setUserComment('');
    alert('Avaliação enviada com sucesso!');
  };

  const getAverageRating = () => {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return (sum / ratings.length).toFixed(1);
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i
        key={index}
        className={`bi ${index < rating ? 'bi-star-fill' : 'bi-star'} star ${interactive ? 'interactive' : ''}`}
        onClick={interactive && onStarClick ? () => onStarClick(index + 1) : undefined}
      />
    ));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <i className="bi bi-arrow-clockwise loading-spinner"></i>
        <p>Carregando...</p>
      </div>
    );
  }

  if (!bazar) {
    return (
      <div className="error-container">
        <i className="bi bi-exclamation-triangle error-icon"></i>
        <h2>Bazar não encontrado</h2>
        <p>O bazar que você está procurando não existe ou foi removido.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          <i className="bi bi-house-fill"></i>
          Voltar ao Início
        </button>
      </div>
    );
  }

  const categoriaInfo = getCategoriaInfo(bazar.categoria);
  const imageSrc = bazar.imagem || new URL('../../assets/Image.png', import.meta.url).toString();

  return (
    <div className="bazar-details">
      <div className="details-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i>
          Voltar
        </button>
        
        <div className="header-actions">
          {user?.tipoUsuario !== 'dono' && (
            <button 
              className={`favorite-btn ${isFavorito ? 'active' : ''}`}
              onClick={toggleFavorito}
            >
              <i className={isFavorito ? 'bi bi-heart-fill' : 'bi bi-heart'}></i>
              {isFavorito ? 'Favoritado' : 'Favoritar'}
            </button>
          )}
          <button className="share-btn" onClick={handleShare}>
            <i className="bi bi-share-fill"></i>
            Compartilhar
          </button>
        </div>
      </div>

      
      
          <div className="bazar-hero">
            <div className="bazar-image">
              <img src={imageSrc} alt={bazar.nome} loading="lazy" decoding="async" />
            </div>
            <div className="bazar-info">
              <div className="bazar-title">
                <h1>{bazar.nome}</h1>
                <span className="categoria-badge" style={{ backgroundColor: categoriaInfo.cor }}>
                  {categoriaInfo.nome}
                </span>
              </div>
              <div className="bazar-meta">
                <span className="rating-badge">
                  <i className="bi bi-star-fill"></i>
                  {bazar.avaliacao || getAverageRating() || '5.0'}
                  <span className="rating-count">{bazar.totalAvaliacoes ? `(${bazar.totalAvaliacoes})` : ''}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="bazar-overview">
        <p className="bazar-description">{bazar.descricao}</p>
        
        <div className="quick-actions">
          {user && user.tipoUsuario !== 'guest' ? (
            <>
              <Link 
                to={`/chat-bazar/${bazar.id}`} 
                className="btn btn-primary"
              >
                <i className="bi bi-chat-dots-fill"></i>
                Enviar Mensagem
              </Link>
              <button 
                className="btn btn-secondary" 
                onClick={handleDirections}
              >
                <i className="bi bi-geo-alt-fill"></i>
                Como Chegar
              </button>
            </>
          ) : (
            <div className="info-note" style={{marginTop:'8px', color:'#5f81a5'}}>
              Faça login para usar o chat, ver avaliações e o mapa.
            </div>
          )}
        </div>
      </div>

      <div className="details-tabs">
        <button 
          className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          <i className="bi bi-info-circle"></i> Informações
        </button>
        {user && user.tipoUsuario !== 'guest' && (
          <>
            <button 
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              <i className="bi bi-star"></i> Avaliações
            </button>
            <button 
              className={`tab-btn ${activeTab === 'map' ? 'active' : ''}`}
              onClick={() => setActiveTab('map')}
            >
              <i className="bi bi-geo-alt"></i> Localização
            </button>
          </>
        )}
      </div>

      <div className="details-content">
        {activeTab === 'info' && (
          <>
            <div className="info-section">
              <h3>
                <i className="bi bi-geo-alt-fill"></i>
                Localização
              </h3>
              <div className="location-info">
                <p><strong>Endereço:</strong></p>
                <p>{bazar.endereco.rua}, {bazar.endereco.numero}</p>
                <p>{bazar.endereco.bairro} - {bazar.endereco.cidade}</p>
                <p><strong>CEP:</strong> {bazar.endereco.cep}</p>
              </div>
            </div>

            <div className="info-section">
              <h3>
                <i className="bi bi-telephone-fill"></i>
                Contato
              </h3>
              <div className="contact-info">
                <p><strong>Telefone:</strong></p>
                {bazar.telefone ? (
                  <a href={`tel:${bazar.telefone}`} className="contact-link">
                    {bazar.telefone}
                  </a>
                ) : (
                  <p>Não informado</p>
                )}
              </div>
            </div>

            <div className="info-section">
              <h3>
                <i className="bi bi-clock-fill"></i>
                Horário de Funcionamento
              </h3>
              <div className="schedule-info">
                <p>{bazar.horario}</p>
              </div>
            </div>

            {bazar.isDefault && (
              <div className="info-section">
                <h3>
                  <i className="bi bi-info-circle-fill"></i>
                  Informações Adicionais
                </h3>
                <div className="additional-info">
                  <p>Este é um bazar parceiro da plataforma FashionSpace.</p>
                  <p>Entre em contato para mais informações sobre produtos e disponibilidade.</p>
                </div>
              </div>
            )}
          </>
        )}
        
        {activeTab === 'reviews' && user && (
          <ReviewSystem bazarId={bazar.id} user={user} />
        )}
        
        {activeTab === 'map' && (
          (() => {
            const userBazares = JSON.parse(localStorage.getItem('fashionspace_bazares') || '[]');
            const allBazares = [...defaultBazares, ...userBazares];
            return (
              <MapView 
                bazares={allBazares} 
                onBazarSelect={() => {}} 
              />
            );
          })()
        )}
      </div>

      <div className="action-buttons">
        {user && user.tipoUsuario !== 'guest' ? (
          <>
            <Link 
              to={`/chat-bazar/${bazar.id}`} 
              className="btn btn-primary btn-large"
            >
              <i className="bi bi-chat-dots-fill"></i>
              Iniciar Conversa
            </Link>
            <button 
              className="btn btn-secondary btn-large" 
              onClick={handleDirections}
            >
              <i className="bi bi-map-fill"></i>
              Ver no Mapa
            </button>
          </>
        ) : null}
      </div>

      {showRatingModal && (
        <div className="modal-overlay" onClick={() => setShowRatingModal(false)}>
          <div className="rating-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Avaliar {bazar.nome}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowRatingModal(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            
            <div className="modal-content">
              <div className="rating-input">
                <label>Sua avaliação:</label>
                <div className="stars-input">
                  {renderStars(userRating, true, setUserRating)}
                </div>
              </div>
              
              <div className="comment-input">
                <label>Comentário (opcional):</label>
                <textarea
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  placeholder="Conte sobre sua experiência..."
                  rows="4"
                />
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowRatingModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleRatingSubmit}
              >
                Enviar Avaliação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BazarDetails;