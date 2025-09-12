import { Link, useLocation } from 'react-router-dom';
import logoImage from '../../assets/Image.png';
import './Sidebar.css';

const Sidebar = ({ user, visible }) => {
  const location = useLocation();
  
  console.log('Sidebar - Usuário:', user);
  console.log('Sidebar - Tipo:', user?.tipoUsuario);

  const allMenuItems = [
    { path: '/', icon: 'bi-house-fill', label: 'Início', forAll: true },
    { path: '/feed', icon: 'bi-newspaper', label: 'Feed', forAll: true },
    { path: '/notificacoes', icon: 'bi-bell-fill', label: 'Notificações', forAll: true },
    { path: '/adicionar-bazar', icon: 'bi-plus-circle-fill', label: 'Adicionar Bazar', onlyDono: true },
    { path: '/favoritos', icon: 'bi-heart-fill', label: 'Favoritos', forAll: true },
    { path: '/perfil', icon: 'bi-person-fill', label: 'Perfil', forAll: true },
    { path: '/assinatura', icon: 'bi-star-fill', label: 'Assinaturas', onlyDono: true },
    { path: '/ia-assistente', icon: 'bi-robot', label: 'IA Assistente', onlyDono: true },
    { path: '/suporte', icon: 'bi-headset', label: 'Suporte', forAll: true },
    { path: '/configuracoes', icon: 'bi-gear-fill', label: 'Configurações', forAll: true }
  ];

  const menuItems = allMenuItems.filter(item => {
    if (item.forAll) return true;
    if (item.onlyDono && user?.tipoUsuario === 'dono') return true;
    return false;
  });

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
            <p className="user-type">{user?.tipoUsuario === 'dono' ? 'Dono de Bazar' : 'Usuário'}</p>
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
            onClick={() => console.log(`Navegando para: ${item.path}`)}
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