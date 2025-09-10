import { useState } from 'react';
import './Topbar.css';

const Topbar = ({ user, setUser, darkMode, toggleTheme, toggleSidebar, sidebarVisible, onSearch }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications] = useState([
    { id: 1, text: 'Novo bazar adicionado na sua região', time: '5 min', unread: true },
    { id: 2, text: 'Seu bazar recebeu uma nova avaliação', time: '1 hora', unread: true },
    { id: 3, text: 'Promoção especial em bazares vintage', time: '2 horas', unread: false }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

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
          title={sidebarVisible ? 'Ocultar Menu' : 'Mostrar Menu'}
        >
          <i className={`bi ${sidebarVisible ? 'bi-list' : 'bi-list'}`}></i>
        </button>
        
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-container">
            <i className="bi bi-search search-icon"></i>
            <input
              type="text"
              placeholder="Buscar bazares..."
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
              <h4>Notificações</h4>
              <span className="notifications-count">{unreadCount} não lidas</span>
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
          title={darkMode ? 'Modo Claro' : 'Modo Escuro'}
        >
          <i className={darkMode ? 'bi bi-sun-fill' : 'bi bi-moon-fill'}></i>
        </button>
        
        <div className="user-menu">
          <button 
            className="user-profile-btn"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <img 
              src={`https://ui-avatars.com/api/?name=${user?.nome}&background=5f81a5&color=fff&size=40`}
              alt="Avatar"
              className="user-avatar"
            />
            <div className="user-details">
              <span className="user-name">{user?.nome}</span>
              <span className="user-status">
                <i className="bi bi-circle-fill"></i>
                Online
              </span>
            </div>
            <div className={`dropdown-arrow ${isProfileOpen ? 'open' : ''}`}>
              <i className="bi bi-chevron-down"></i>
            </div>
          </button>
          
          {isProfileOpen && (
            <div className="user-dropdown">
              <div className="dropdown-header">
                <img 
                  src={`https://ui-avatars.com/api/?name=${user?.nome}&background=5f81a5&color=fff&size=50`}
                  alt="Avatar"
                  className="dropdown-avatar"
                />
                <div className="dropdown-user-info">
                  <h4>{user?.nome}</h4>
                  <p>{user?.email}</p>
                </div>
              </div>
              
              <div className="dropdown-divider"></div>
              
              <div className="dropdown-menu">
                <button className="dropdown-item">
                  <i className="item-icon bi bi-person-fill"></i>
                  Meu Perfil
                </button>
                <button className="dropdown-item">
                  <i className="item-icon bi bi-gear-fill"></i>
                  Configurações
                </button>
                <button className="dropdown-item">
                  <i className="item-icon bi bi-question-circle-fill"></i>
                  Ajuda
                </button>
              </div>
              
              <div className="dropdown-divider"></div>
              
              <button className="dropdown-item logout-item" onClick={handleLogout}>
                <i className="item-icon bi bi-box-arrow-right"></i>
                Sair da Conta
              </button>
            </div>
          )}
        </div>
      </div>
      
      {(isProfileOpen || showNotifications) && (
        <div 
          className="dropdown-overlay" 
          onClick={() => {
            setIsProfileOpen(false);
            setShowNotifications(false);
          }}
        ></div>
      )}
    </div>
  );
};

export default Topbar;