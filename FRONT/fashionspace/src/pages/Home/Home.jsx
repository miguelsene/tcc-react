import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { defaultBazares, categorias } from '../../data/bazares';
import { bazarService, formatarBazarParaFrontend } from '../../services/api';
import BazarCarousel from '../../components/BazarCarousel/BazarCarousel';
import Hero from '../../components/common/Hero/Hero';
import './Home.css';
import { useI18n } from '../../i18n/i18n';

const Home = ({ searchTerm: globalSearchTerm, user }) => {
  const [bazares, setBazares] = useState([]);
  const [filteredBazares, setFilteredBazares] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const frequentSearches = ['vestido floral', 'jaqueta jeans', 'camisa social', 'calça wide leg', 'tênis branco', 'saia midi', 'blazer oversized', 'moletom', 'bota de couro', 'acessórios vintage'];

  useEffect(() => {
    const fetchBazares = async () => {
      try {
        console.log('Buscando bazares da API...');
        const bazaresFromAPI = await bazarService.listarTodos();
        console.log('Bazares recebidos da API:', bazaresFromAPI);
        const formattedBazares = bazaresFromAPI.map(formatarBazarParaFrontend);
        console.log('Bazares formatados:', formattedBazares);
        setBazares(formattedBazares);
        setFilteredBazares(formattedBazares);
      } catch (error) {
        console.error('Erro ao buscar bazares:', error);
        // Fallback para dados estáticos se houver erro
        setBazares(defaultBazares);
        setFilteredBazares(defaultBazares);
      }
    };


    fetchBazares();
    
    // Listener para recarregar quando novos bazares forem criados
    const handleBazaresUpdated = () => {
      fetchBazares();
    };
    
    window.addEventListener('bazaresUpdated', handleBazaresUpdated);
    
    return () => {
      window.removeEventListener('bazaresUpdated', handleBazaresUpdated);
    };
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

  const eyebrowTicker = (
    <>
      <style>{`
        .eyebrow-ticker{display:inline-flex;align-items:center;gap:8px;}
        .eyebrow-ticker .ticker-viewport{position:relative;width:min(60vw,520px);overflow:hidden;height:1.4em;}
        .eyebrow-ticker .ticker-track{display:inline-block;white-space:nowrap;animation:ticker-scroll 16s linear infinite;}
        .eyebrow-ticker .ticker-item{display:inline-flex;align-items:center;margin-right:24px;opacity:.95}
        @keyframes ticker-scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @media(max-width:768px){.eyebrow-ticker .ticker-viewport{width:min(70vw,320px)}}
        @media (prefers-reduced-motion: reduce){.eyebrow-ticker .ticker-track{animation:none}}
      `}</style>
      <div className="eyebrow-ticker">
        <i className="bi bi-search" aria-hidden="true"></i>
        <div className="ticker-viewport" aria-label="Pesquisas frequentes">
          <div className="ticker-track">
            {frequentSearches.map((q, idx) => (<span className="ticker-item" key={'t1-'+idx}>{q}</span>))}
            {frequentSearches.map((q, idx) => (<span className="ticker-item" key={'t2-'+idx}>{q}</span>))}
          </div>
        </div>
      </div>
    </>
  );

  const { t } = useI18n();
  return (
    <div className="home">
      <Hero
        eyebrow={eyebrowTicker}
        title={<span style={{textShadow:'0 2px 10px rgba(0,0,0,0.35), 0 8px 24px rgba(0,0,0,0.25)', WebkitTextStroke:'0.5px rgba(255,255,255,0.35)', letterSpacing:'0.3px'}}>{'para todos mas não qualquer um '}</span>}
        subtitle={t('home.heroSubtitle')}
        backgroundImage={new URL('../../assets/HomeSlide1.webp', import.meta.url).toString()}
        actions={(
          <>
            {user?.tipoUsuario === 'dono' && (
              <Link to="/adicionar-bazar" className="btn btn-primary">
                <i className="bi bi-plus-circle-fill"></i>
                {t('home.createBazar')}
              </Link>
            )}
            <button className="btn btn-secondary" onClick={() => document.getElementById('bazares')?.scrollIntoView()}>
              <i className="bi bi-search"></i>
              {t('home.exploreNow')}
            </button>
          </>
        )}
      />

      <div className="category-filter">
        <h3>
          <i className="bi bi-funnel-fill"></i>
          {t('home.filterByCategory')}
        </h3>
        <div className="categories-grid">
          <button
            className={`category-btn ${selectedCategory === '' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('')}
          >
            <i className="bi bi-grid-fill"></i>
            <span>{t('home.all')}</span>
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
          <h2>{t('home.allBazaresTitle')}</h2>
          <p>{t('home.allBazaresSubtitle')}</p>
        </div>

        <div className="search-and-filter">
          <div className="search-container">
            <i className="bi bi-search search-icon"></i>
            <input
              type="text"
              placeholder={t('home.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {filteredBazares.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-shop empty-icon"></i>
            <h3>{t('home.emptyTitle')}</h3>
            <p>{t('home.emptyDescription')}</p>
          </div>
        ) : (
          <>
            {groups.map(group => (
              <div key={group.name} className="category-carousel-section">
                <div className="section-header">
                  <h3>{group.name}</h3>
                </div>
                <BazarCarousel bazares={group.items} />
              </div>
            ))}
          </>
        )}
      </section>
    </div>
  );
};

export default Home;
