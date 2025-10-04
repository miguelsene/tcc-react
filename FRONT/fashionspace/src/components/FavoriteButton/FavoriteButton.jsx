import { useFavoritos } from '../../hooks/useFavoritos';
import './FavoriteButton.css';

const FavoriteButton = ({ bazarId, className = '', size = 'medium' }) => {
  const { isFavorito, toggleFavorito, loading } = useFavoritos();

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorito(bazarId);
  };

  return (
    <button
      className={`favorite-button ${className} ${size} ${isFavorito(bazarId) ? 'favorited' : ''} ${loading ? 'loading' : ''}`}
      onClick={handleClick}
      disabled={loading}
      title={isFavorito(bazarId) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <i className={`bi ${isFavorito(bazarId) ? 'bi-heart-fill' : 'bi-heart'}`}></i>
      {loading && <div className="loading-spinner"></div>}
    </button>
  );
};

export default FavoriteButton;