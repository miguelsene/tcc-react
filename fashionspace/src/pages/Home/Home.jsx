import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { defaultBazares, categorias } from '../../data/bazares';
import BazarCarousel from '../../components/BazarCarousel/BazarCarousel';
import './Home.css';

const Home = ({ searchTerm: globalSearchTerm, user }) => {
  const [bazares, setBazares] = useState([]);
  const [filteredBazares, setFilteredBazares] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const userBazares = JSON.parse(localStorage.getItem('fashionspace_bazares') || '[]');
    const savedFavoritos = JSON.parse(localStorage.getItem('fashionspace_favoritos') || '[]');
    
    const allBazares = [...defaultBazares, ...userBazares];
    setBazares(allBazares);
    setFilteredBazares(allBazares);
    setFavoritos(savedFavoritos);
  }, []);

  useEffect(() => {
    let filtered = [...bazares];

    if (selectedCategory) {
      filtered = filtered.filter(bazar => 
        bazar.categoria.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    const currentSearchTerm = globalSearchTerm || searchTerm;
    if (currentSearchTerm && currentSearchTerm.trim()) {
      const searchLower = currentSearchTerm.toLowerCase().trim();
      filtered = filtered.filter(bazar =>
        bazar.nome.toLowerCase().includes(searchLower) ||
        bazar.descricao.toLowerCase().includes(searchLower) ||
        bazar.endereco.cidade.toLowerCase().includes(searchLower)
      );
    }

    setFilteredBazares(filtered);
  }, [bazares, selectedCategory, searchTerm, globalSearchTerm]);

  const toggleFavorito = (bazarId) => {
    const newFavoritos = favoritos.includes(bazarId)
      ? favoritos.filter(id => id !== bazarId)
      : [...favoritos, bazarId];
    
    setFavoritos(newFavoritos);
    localStorage.setItem('fashionspace_favoritos', JSON.stringify(newFavoritos));
    // Notifica outras telas para atualizar a lista de favoritos
    window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: newFavoritos }));
  };

  const getCategoriaInfo = (categoria) => {
    return categorias.find(cat => cat.nome.toLowerCase() === categoria.toLowerCase()) || 
           { cor: '#5f81a5', nome: categoria, icon: 'bi-shop' };
  };

  // Agrupar bazares filtrados por categoria na ordem definida em categorias
  const groups = (() => {
    const order = categorias.map(c => c.nome);
    const known = new Set(order);
    const orderedGroups = order
      .map(name => ({ name, items: filteredBazares.filter(b => b.categoria === name) }))
      .filter(g => g.items.length > 0);

    const unknownNames = Array.from(new Set(
      filteredBazares.filter(b => !known.has(b.categoria)).map(b => b.categoria)
    ));
    const unknownGroups = unknownNames.map(name => ({
      name,
      items: filteredBazares.filter(b => b.categoria === name)
    }));

    return [...orderedGroups, ...unknownGroups];
  })();

  return (
    <div className="home">
      <section className="hero">
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
            <button className="btn btn-secondary" onClick={() => document.getElementById('bazares')?.scrollIntoView()}>
              <i className="bi bi-search"></i>
              Explorar Agora
            </button>
          </div>
        </div>
      </section>

      <div className="category-filter">
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
            >
              <i className={categoria.icon}></i>
              <span>{categoria.nome}</span>
            </button>
          ))}
        </div>
      </div>

      <section id="bazares" className="bazares-section">
        <div className="section-header">
          <h2>Explore Todos os Bazares</h2>
          <p>Encontre o bazar perfeito para você</p>
        </div>

        <div className="search-and-filter">
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
          <div className="empty-state">
            <i className="bi bi-shop empty-icon"></i>
            <h3>Nenhum bazar encontrado</h3>
            <p>Tente ajustar os filtros ou buscar por outros termos.</p>
          </div>
        ) : (
          <>
            {groups.map(group => (
              <div key={group.name} className="category-carousel-section">
                <div className="section-header">
                  <h3>{group.name}</h3>
                </div>
                <BazarCarousel 
                  bazares={group.items} 
                  favoritos={favoritos} 
                  onToggleFavorito={toggleFavorito}
                />
              </div>
            ))}
          </>
        )}
      </section>
    </div>
  );
};

export default Home;