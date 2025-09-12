import { useState, useEffect } from 'react';
import './MapView.css';

const MapView = ({ bazares, onBazarSelect }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedDistance, setSelectedDistance] = useState(10);
  const [filteredBazares, setFilteredBazares] = useState(bazares);

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      filterByDistance();
    }
  }, [userLocation, selectedDistance, bazares]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          // Localização padrão (São Paulo)
          setUserLocation({ lat: -23.5505, lng: -46.6333 });
        }
      );
    }
  };

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const filterByDistance = () => {
    if (!userLocation) return;
    
    const filtered = bazares.filter(bazar => {
      const bazarCoords = getBazarCoordinates(bazar);
      const distance = calculateDistance(
        userLocation.lat, userLocation.lng,
        bazarCoords.lat, bazarCoords.lng
      );
      return distance <= selectedDistance;
    }).map(bazar => ({
      ...bazar,
      distance: calculateDistance(
        userLocation.lat, userLocation.lng,
        ...Object.values(getBazarCoordinates(bazar))
      )
    })).sort((a, b) => a.distance - b.distance);

    setFilteredBazares(filtered);
  };

  const getBazarCoordinates = (bazar) => {
    // Coordenadas simuladas baseadas na cidade
    const cityCoords = {
      'São Paulo': { lat: -23.5505, lng: -46.6333 },
      'Rio de Janeiro': { lat: -22.9068, lng: -43.1729 },
      'Salvador': { lat: -12.9714, lng: -38.5014 },
      'Belo Horizonte': { lat: -19.9167, lng: -43.9345 },
      'Curitiba': { lat: -25.4284, lng: -49.2733 }
    };
    
    const city = bazar.endereco.cidade.split(',')[0];
    return cityCoords[city] || { lat: -23.5505, lng: -46.6333 };
  };

  const openRoute = (bazar) => {
    const coords = getBazarCoordinates(bazar);
    const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${coords.lat},${coords.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="map-view">
      <div className="map-controls">
        <div className="distance-filter">
          <label>Distância máxima:</label>
          <select 
            value={selectedDistance} 
            onChange={(e) => setSelectedDistance(Number(e.target.value))}
          >
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
            <option value={25}>25 km</option>
            <option value={50}>50 km</option>
            <option value={100}>100 km</option>
          </select>
        </div>
        <button className="btn btn-secondary" onClick={getUserLocation}>
          <i className="bi bi-geo-alt"></i> Atualizar Localização
        </button>
      </div>

      <div className="map-container">
        <div className="map-placeholder">
          <i className="bi bi-map"></i>
          <p>Mapa Interativo</p>
          <small>Integração com Google Maps em desenvolvimento</small>
        </div>
      </div>

      <div className="nearby-bazares">
        <h3>
          <i className="bi bi-geo-alt-fill"></i>
          Bazares Próximos ({filteredBazares.length})
        </h3>
        
        <div className="bazares-list">
          {filteredBazares.map(bazar => (
            <div key={bazar.id} className="bazar-item">
              <img src={bazar.imagem} alt={bazar.nome} />
              <div className="bazar-info">
                <h4>{bazar.nome}</h4>
                <p className="address">{bazar.endereco.cidade}</p>
                {bazar.distance && (
                  <p className="distance">
                    <i className="bi bi-geo-alt"></i>
                    {bazar.distance.toFixed(1)} km
                  </p>
                )}
                <div className="rating">
                  <i className="bi bi-star-fill"></i>
                  {bazar.avaliacao}
                </div>
              </div>
              <div className="bazar-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => onBazarSelect(bazar)}
                >
                  Ver Detalhes
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => openRoute(bazar)}
                >
                  <i className="bi bi-navigation"></i>
                  Rota
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapView;