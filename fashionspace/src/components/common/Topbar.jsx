import { useState } from 'react';
import './Topbar.css';
import { useI18n } from '../../i18n/i18n';
import { Link } from 'react-router-dom';

const Topbar = ({ user, setUser, darkMode, toggleTheme, toggleSidebar, sidebarVisible, onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
  const [notifications] = useState([
    { id: 1, text: 'Novo bazar adicionado na sua região', time: '5 min', unread: true },
    { id: 2, text: 'Seu bazar recebeu uma nova avaliação', time: '1 hora', unread: true },
    { id: 3, text: 'Promoção especial em bazares vintage', time: '2 horas', unread: false }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { t } = useI18n();

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleLogout = () => {
    localStorage.removeItem('fashionspace_user');
    setUser(null);
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
          className="notification-btn" 
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <i className="bi bi-bell-fill"></i>
          {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        </button>

        {showNotifications && (
          <div className="notifications-dropdown">
            <div className="notifications-header">
              <h4>{t('topbar.notificationsTitle')}</h4>
              <span className="notifications-count">{t('topbar.unreadCount', { count: unreadCount })}</span>
            </div>
            <div className="notifications-list">
              {notifications.map(notification => (
                <div key={notification.id} className={`notification-item ${notification.unread ? 'unread' : ''}`}>
                  <div className="notification-content">
                    <p>{notification.text}</p>
                    <span className="notification-time">{notification.time}</span>
                  </div>
                  {notification.unread && <div className="unread-dot"></div>}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          title={darkMode ? t('topbar.lightMode') : t('topbar.darkMode')}
        >
          <i className={darkMode ? 'bi bi-sun-fill' : 'bi bi-moon-fill'}></i>
        </button>

        <Link to="/perfil" className="icon-btn" title={t('topbar.myProfile')}>
          <i className="bi bi-person-fill"></i>
        </Link>
        <button className="icon-btn" title={t('topbar.logout')} onClick={handleLogout}>
          <i className="bi bi-box-arrow-right"></i>
        </button>
      </div>
      
      {showNotifications && (
        <div 
          className="dropdown-overlay" 
          onClick={() => {
            setShowNotifications(false);
          }}
        ></div>
      )}
    </div>
  );
};

export default Topbar;