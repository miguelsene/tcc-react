import { useState, useEffect, useRef } from 'react';
import './MapView.css';

const MapView = ({ bazares, onBazarSelect }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedDistance, setSelectedDistance] = useState(10);
  const [filteredBazares, setFilteredBazares] = useState(bazares || []);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || localStorage.getItem('google_maps_api_key');

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      filterByDistance();
    }
  }, [userLocation, selectedDistance, bazares]);

  useEffect(() => {
    if (!apiKey) return; // Sem chave, mantemos o placeholder
    if (!userLocation) return;

    loadGoogleMaps().then(() => {
      initOrUpdateMap();
    }).catch(() => {
      // falha no carregamento do script -> mantém placeholder
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, userLocation, filteredBazares]);

  const loadGoogleMaps = () => {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve();
        return;
      }
      if (!apiKey) {
        reject(new Error('Missing API key'));
        return;
      }
      const scriptId = 'google-maps-js';
      if (document.getElementById(scriptId)) {
        // já está carregando
        const onLoaded = () => resolve();
        if (window.google && window.google.maps) return resolve();
        setTimeout(onLoaded, 500);
        return;
      }
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Maps JS'));
      document.head.appendChild(script);
    });
  };

  const initOrUpdateMap = () => {
    if (!mapContainerRef.current || !window.google?.maps) return;

    // Inicializa mapa se necessário
    if (!mapRef.current) {
      mapRef.current = new window.google.maps.Map(mapContainerRef.current, {
        center: userLocation,
        zoom: 12,
        styles: [],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });
    }

    // Limpa marcadores antigos
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    const bounds = new window.google.maps.LatLngBounds();

    // Marcador do usuário
    const userMarker = new window.google.maps.Marker({
      position: userLocation,
      map: mapRef.current,
      title: 'Você',
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#3367D6',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
      }
    });
    markersRef.current.push(userMarker);
    bounds.extend(userLocation);

    // Marcadores dos bazares próximos
    filteredBazares.forEach(bazar => {
      const coords = getBazarCoordinates(bazar);
      const marker = new window.google.maps.Marker({
        position: coords,
        map: mapRef.current,
        title: bazar.nome,
      });
      const info = new window.google.maps.InfoWindow({
        content: `
          <div style="max-width:220px">
            <strong>${bazar.nome}</strong><br/>
            <span style="color:#666">${bazar.endereco?.cidade || ''}</span><br/>
            ${bazar.distance ? `<small>${bazar.distance.toFixed(1)} km</small>` : ''}
          </div>
        `,
      });
      marker.addListener('click', () => {
        info.open({ anchor: marker, map: mapRef.current });
      });
      markersRef.current.push(marker);
      bounds.extend(coords);
    });

    // Ajusta enquadramento
    if (filteredBazares.length > 0) {
      mapRef.current.fitBounds(bounds, 50);
    } else {
      mapRef.current.setCenter(userLocation);
      mapRef.current.setZoom(12);
    }
  };

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
    } else {
      setUserLocation({ lat: -23.5505, lng: -46.6333 });
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

  const getBazarCoordinates = (bazar) => {
    // Coordenadas simuladas baseadas na cidade
    const cityCoords = {
      'São Paulo': { lat: -23.5505, lng: -46.6333 },
      'Rio de Janeiro': { lat: -22.9068, lng: -43.1729 },
      'Salvador': { lat: -12.9714, lng: -38.5014 },
      'Belo Horizonte': { lat: -19.9167, lng: -43.9345 },
      'Curitiba': { lat: -25.4284, lng: -49.2733 }
    };
    const city = (bazar?.endereco?.cidade || '').split(',')[0];
    return cityCoords[city] || { lat: -23.5505, lng: -46.6333 };
  };

  const filterByDistance = () => {
    if (!userLocation) return;
    const filtered = (bazares || []).filter(bazar => {
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
        {apiKey ? (
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
        ) : (
          <div className="map-placeholder">
            <i className="bi bi-map"></i>
            <p>Mapa do Google Maps</p>
            <small>Para exibir o mapa interativo, configure a chave em VITE_GOOGLE_MAPS_API_KEY ou salve em localStorage com a chave "google_maps_api_key".</small>
          </div>
        )}
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
                <p className="address">{bazar.endereco?.cidade}</p>
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
                  onClick={() => onBazarSelect && onBazarSelect(bazar)}
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
