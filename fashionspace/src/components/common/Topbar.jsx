import { useState } from 'react';
import './Topbar.css';
import { useI18n } from '../../i18n/i18n';
import { Link } from 'react-router-dom';

const Topbar = ({ user, setUser, darkMode, toggleTheme, toggleSidebar, sidebarVisible, onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const { t } = useI18n();

  
  const handleLogout = () => {
    localStorage.removeItem('fashionspace_user');
    setUser(null);
    window.location.href = '/login';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <button 
          className="sidebar-toggle"
          onClick={toggleSidebar}
          title={sidebarVisible ? t('topbar.hideMenu') : t('topbar.showMenu')}
        >
          <i className={`bi ${sidebarVisible ? 'bi-list' : 'bi-list'}`}></i>
        </button>
        
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-container">
            <i className="bi bi-search search-icon"></i>
            <input
              type="text"
              placeholder={t('topbar.searchPlaceholder')}
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        </form>
      </div>
      
      <div className="topbar-right">
                
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          title={darkMode ? t('topbar.lightMode') : t('topbar.darkMode')}
        >
          <i className={darkMode ? 'bi bi-sun-fill' : 'bi bi-moon-fill'}></i>
        </button>

        {user?.tipoUsuario !== 'guest' && (
          <Link to="/perfil" className="icon-btn" title={t('topbar.myProfile')}>
            <i className="bi bi-person-fill"></i>
          </Link>
        )}
        <button className="icon-btn" title={t('topbar.logout')} onClick={handleLogout}>
          <i className="bi bi-box-arrow-right"></i>
        </button>
      </div>
      
          </div>
  );
};

export default Topbar;