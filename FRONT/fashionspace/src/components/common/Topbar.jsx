import { useState } from 'react';
import './Topbar.css';
import { useI18n } from '../../i18n/i18n';
import { Link } from 'react-router-dom';
import ChatNotifications from '../chat/ChatNotifications';

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
        
        <Link to="/" className="topbar-logo">
          <img src="https://i.pinimg.com/736x/b8/22/5a/b8225adb14d7b1536e1ec62706928216.jpg" alt="FashionSpace" className="site-logo medium" />
          <span className="logo-text">FashionSpace</span>
        </Link>
        
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
        {user && user.tipoUsuario !== 'guest' && (
          <ChatNotifications user={user} />
        )}
                
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          title={darkMode ? t('topbar.lightMode') : t('topbar.darkMode')}
        >
          <i className={darkMode ? 'bi bi-sun-fill' : 'bi bi-moon-fill'}></i>
        </button>

        {user?.tipoUsuario !== 'guest' && (
          <Link to="/perfil" className="profile-link" title={t('topbar.myProfile')}>
            <img 
              src={user.fotoPerfil || `https://ui-avatars.com/api/?name=${user.nome}&background=5f81a5&color=fff&size=32`}
              alt="Perfil"
              className="topbar-avatar"
            />
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