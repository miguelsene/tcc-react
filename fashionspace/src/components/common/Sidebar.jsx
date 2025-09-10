import { Link, useLocation } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import './Sidebar.css';

const Sidebar = ({ user }) => {
  const location = useLocation();
  const [sidebarRef, isVisible] = useScrollAnimation();

  const menuItems = [
    { path: '/', icon: '🏠', label: 'Início', gradient: 'from-blue-500 to-purple-600' },
    { path: '/adicionar-bazar', icon: '➕', label: 'Adicionar Bazar', gradient: 'from-green-500 to-teal-600' },
    { path: '/favoritos', icon: '❤️', label: 'Favoritos', gradient: 'from-pink-500 to-red-600' },
    { path: '/perfil', icon: '👤', label: 'Perfil', gradient: 'from-indigo-500 to-blue-600' }
  ];

  return (
    <div 
      ref={sidebarRef}
      className={`sidebar ${isVisible ? 'visible' : ''}`}
    >
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">👗</div>
          <h2>FashionSpace</h2>
        </div>
        <div className="user-welcome">
          <div className="user-avatar">
            <img 
              src={`https://ui-avatars.com/api/?name=${user?.nome}&background=3b82f6&color=fff&size=40`}
              alt="Avatar"
            />
          </div>
          <div className="user-info">
            <p className="user-greeting">Olá,</p>
            <p className="user-name">{user?.nome}!</p>
          </div>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="nav-icon-wrapper">
              <span className="nav-icon">{item.icon}</span>
            </div>
            <span className="nav-label">{item.label}</span>
            <div className="nav-indicator"></div>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="footer-decoration">
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;