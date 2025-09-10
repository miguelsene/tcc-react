import './Topbar.css';

const Topbar = ({ user, setUser, darkMode, toggleTheme }) => {
  const handleLogout = () => {
    localStorage.removeItem('fashionspace_user');
    setUser(null);
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <h1>FashionSpace</h1>
      </div>
      
      <div className="topbar-right">
        <button className="theme-toggle" onClick={toggleTheme}>
          {darkMode ? '☀️' : '🌙'}
        </button>
        
        <div className="user-menu">
          <img 
            src={`https://ui-avatars.com/api/?name=${user?.nome}&background=007bff&color=fff`}
            alt="Avatar"
            className="user-avatar"
          />
          <span className="user-name">{user?.nome}</span>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Sair
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;