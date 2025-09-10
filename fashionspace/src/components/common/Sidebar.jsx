import { Link, useLocation } from 'react-router-dom';
import logoImage from '../../assets/Image.png';
import './Sidebar.css';

const Sidebar = ({ user, visible }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: 'bi-house-fill', label: 'Início' },
    { path: '/adicionar-bazar', icon: 'bi-plus-circle-fill', label: 'Adicionar Bazar' },
    { path: '/favoritos', icon: 'bi-heart-fill', label: 'Favoritos' },
    { path: '/perfil', icon: 'bi-person-fill', label: 'Perfil' },
    { path: '/assinatura', icon: 'bi-star-fill', label: 'Planos Premium' },
    { path: '/ia-assistente', icon: 'bi-robot', label: 'IA Assistente' },
    { path: '/suporte', icon: 'bi-headset', label: 'Suporte' },
    { path: '/configuracoes', icon: 'bi-gear-fill', label: 'Configurações' }
  ];

  return (
    <div className={`sidebar ${visible ? 'visible' : 'hidden'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            <img src={logoImage} alt="FashionSpace" />
          </div>
          <h2>FashionSpace</h2>
        </div>
        <div className="user-welcome">
          <div className="user-avatar">
            <img 
              src={`https://ui-avatars.com/api/?name=${user?.nome}&background=5f81a5&color=fff&size=40`}
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
              <i className={`nav-icon ${item.icon}`}></i>
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