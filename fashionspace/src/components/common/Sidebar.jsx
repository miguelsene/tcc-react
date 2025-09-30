import { Link, useLocation } from 'react-router-dom';
import logoImage from '../../assets/Image.png';
import './Sidebar.css';
import { useI18n } from '../../i18n/i18n';

const Sidebar = ({ user, visible }) => {
  const location = useLocation();
  const { t } = useI18n();
  
  console.log('Sidebar - Usuário:', user);
  console.log('Sidebar - Tipo:', user?.tipoUsuario);

  const allMenuItems = [
    { path: '/', icon: 'bi-house-fill', label: t('nav.home'), forAll: true },
    { path: '/feed', icon: 'bi-newspaper', label: t('nav.feed'), forAll: true, hideForGuest: true },
    { path: '/notificacoes', icon: 'bi-bell-fill', label: t('nav.notifications'), forAll: true, hideForGuest: true },
    { path: '/adicionar-bazar', icon: 'bi-plus-circle-fill', label: t('nav.addBazar'), onlyDono: true },
    { path: '/favoritos', icon: 'bi-heart-fill', label: t('nav.favorites'), forAll: true, hideForGuest: true },
    { path: '/perfil', icon: 'bi-person-fill', label: t('nav.profile'), forAll: true, hideForGuest: true },
    { path: '/ia-assistente', icon: 'bi-robot', label: t('nav.aiAssistant'), onlyDono: true },
    { path: '/suporte', icon: 'bi-headset', label: t('nav.support'), forAll: true, hideForGuest: true },
    { path: '/configuracoes', icon: 'bi-gear-fill', label: t('nav.settings'), forAll: true, hideForGuest: true }
  ];

  const menuItems = allMenuItems.filter(item => {
    if (user?.tipoUsuario === 'guest' && item.hideForGuest) return false;
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
              src={user?.fotoPerfilUsuario || `https://ui-avatars.com/api/?name=${user?.nome}&background=5f81a5&color=fff&size=40`}
              alt="Avatar"
            />
          </div>
          <div className="user-info">
            <p className="user-greeting">{t('sidebar.hello')}</p>
            <p className="user-name">{user?.nome}!</p>
            <p className="user-type">{user?.tipoUsuario === 'dono' ? t('sidebar.owner') : t('sidebar.user')}</p>
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


    </div>
  );
};

export default Sidebar;