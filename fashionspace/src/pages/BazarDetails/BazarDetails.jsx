import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { defaultBazares, categorias } from '../../data/bazares';
import './BazarDetails.css';

const BazarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bazar, setBazar] = useState(null);
  const [isFavorito, setIsFavorito] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userBazares = JSON.parse(localStorage.getItem('fashionspace_bazares') || '[]');
    const allBazares = [...defaultBazares, ...userBazares];
    const foundBazar = allBazares.find(b => b.id === id);
    
    if (foundBazar) {
      setBazar(foundBazar);
      
      const favoritos = JSON.parse(localStorage.getItem('fashionspace_favoritos') || '[]');
      setIsFavorito(favoritos.includes(id));
    }
    
    setLoading(false);
  }, [id]);

  const toggleFavorito = () => {
    const favoritos = JSON.parse(localStorage.getItem('fashionspace_favoritos') || '[]');
    const newFavoritos = isFavorito
      ? favoritos.filter(fId => fId !== id)
      : [...favoritos, id];
    
    localStorage.setItem('fashionspace_favoritos', JSON.stringify(newFavoritos));
    setIsFavorito(!isFavorito);
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
      // Fallback para clipboard
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
           { cor: '#6c757d', nome: categoria };
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Carregando...</div>
      </div>
    );
  }

  if (!bazar) {
    return (
      <div className="error-container">
        <h2>Bazar não encontrado</h2>
        <p>O bazar que você está procurando não existe ou foi removido.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Voltar ao Início
        </button>
      </div>
    );
  }

  const categoriaInfo = getCategoriaInfo(bazar.categoria);

  return (
    <div className="bazar-details">
      <div className="details-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Voltar
        </button>
        
        <div className="header-actions">
          <button 
            className={`favorite-btn ${isFavorito ? 'active' : ''}`}
            onClick={toggleFavorito}
          >
            {isFavorito ? '❤️ Favoritado' : '🤍 Favoritar'}
          </button>
          <button className="share-btn" onClick={handleShare}>
            📤 Compartilhar
          </button>
        </div>
      </div>

      <div className="bazar-hero">
        <div className="bazar-image">
          <img src={bazar.imagem} alt={bazar.nome} />
        </div>
        
        <div className="bazar-info">
          <div className="bazar-title">
            <h1>{bazar.nome}</h1>
            <span 
              className="categoria-badge"
              style={{ backgroundColor: categoriaInfo.cor }}
            >
              {categoriaInfo.nome}
            </span>
          </div>
          
          <p className="bazar-description">{bazar.descricao}</p>
          
          <div className="quick-actions">
            <Link 
              to={`/chat-bazar/${bazar.id}`} 
              className="btn btn-primary"
            >
              💬 Enviar Mensagem
            </Link>
            <button 
              className="btn btn-secondary" 
              onClick={handleDirections}
            >
              📍 Como Chegar
            </button>
          </div>
        </div>
      </div>

      <div className="details-content">
        <div className="info-section">
          <h3>📍 Localização</h3>
          <div className="location-info">
            <p><strong>Endereço:</strong></p>
            <p>{bazar.endereco.rua}, {bazar.endereco.numero}</p>
            <p>{bazar.endereco.bairro} - {bazar.endereco.cidade}</p>
            <p><strong>CEP:</strong> {bazar.endereco.cep}</p>
          </div>
        </div>

        <div className="info-section">
          <h3>📞 Contato</h3>
          <div className="contact-info">
            <p><strong>Telefone:</strong></p>
            <a href={`tel:${bazar.telefone}`} className="contact-link">
              {bazar.telefone}
            </a>
          </div>
        </div>

        <div className="info-section">
          <h3>🕒 Horário de Funcionamento</h3>
          <div className="schedule-info">
            <p>{bazar.horario}</p>
          </div>
        </div>

        {bazar.isDefault && (
          <div className="info-section">
            <h3>ℹ️ Informações Adicionais</h3>
            <div className="additional-info">
              <p>Este é um bazar parceiro da plataforma FashionSpace.</p>
              <p>Entre em contato para mais informações sobre produtos e disponibilidade.</p>
            </div>
          </div>
        )}
      </div>

      <div className="action-buttons">
        <Link 
          to={`/chat-bazar/${bazar.id}`} 
          className="btn btn-primary btn-large"
        >
          💬 Iniciar Conversa
        </Link>
        <button 
          className="btn btn-secondary btn-large" 
          onClick={handleDirections}
        >
          🗺️ Ver no Mapa
        </button>
      </div>
    </div>
  );
};

export default BazarDetails;