import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './components/common/Sidebar';
import Topbar from './components/common/Topbar';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import AddBazar from './pages/AddBazar/AddBazar';
import BazarDetails from './pages/BazarDetails/BazarDetails';
import EditBazar from './pages/EditBazar/EditBazar';
import Favorites from './pages/Favorites/Favorites';
import Profile from './pages/Profile/Profile';
import Chat from './pages/Chat/Chat';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('fashionspace_user');
    const savedTheme = localStorage.getItem('fashionspace_theme');
    
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedTheme) setDarkMode(savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem('fashionspace_theme', newTheme ? 'dark' : 'light');
  };

  if (!user) {
    return <Login setUser={setUser} />;
  }

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <Router>
        <Sidebar user={user} />
        <div className="main-content">
          <Topbar user={user} setUser={setUser} darkMode={darkMode} toggleTheme={toggleTheme} />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/adicionar-bazar" element={<AddBazar />} />
              <Route path="/bazar-detalhes/:id" element={<BazarDetails />} />
              <Route path="/editar-bazar/:id" element={<EditBazar />} />
              <Route path="/favoritos" element={<Favorites />} />
              <Route path="/perfil" element={<Profile user={user} setUser={setUser} />} />
              <Route path="/chat-bazar/:id" element={<Chat />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;