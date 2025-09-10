import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useScrollAnimationMultiple } from './hooks/useScrollAnimation';
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
import Support from './pages/Support/Support';
import Settings from './pages/Settings/Settings';
import Subscription from './pages/Subscription/Subscription';
import AIAssistant from './pages/AIAssistant/AIAssistant';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');

  useScrollAnimationMultiple();

  useEffect(() => {
    const savedUser = localStorage.getItem('fashionspace_user');
    const savedTheme = localStorage.getItem('fashionspace_theme');
    const savedSidebar = localStorage.getItem('fashionspace_sidebar');
    
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedTheme) setDarkMode(savedTheme === 'dark');
    if (savedSidebar !== null) setSidebarVisible(JSON.parse(savedSidebar));
  }, []);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem('fashionspace_theme', newTheme ? 'dark' : 'light');
  };

  const toggleSidebar = () => {
    const newSidebarState = !sidebarVisible;
    setSidebarVisible(newSidebarState);
    localStorage.setItem('fashionspace_sidebar', JSON.stringify(newSidebarState));
  };

  if (!user) {
    return <Login setUser={setUser} />;
  }

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'} ${sidebarVisible ? 'sidebar-visible' : 'sidebar-hidden'}`}>
      <Router>
        <Sidebar user={user} visible={sidebarVisible} />
        <div className="main-content">
          <Topbar 
            user={user} 
            setUser={setUser} 
            darkMode={darkMode} 
            toggleTheme={toggleTheme}
            toggleSidebar={toggleSidebar}
            sidebarVisible={sidebarVisible}
            onSearch={setGlobalSearchTerm}
          />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home searchTerm={globalSearchTerm} />} />
              <Route path="/adicionar-bazar" element={<AddBazar />} />
              <Route path="/bazar-detalhes/:id" element={<BazarDetails />} />
              <Route path="/editar-bazar/:id" element={<EditBazar />} />
              <Route path="/favoritos" element={<Favorites />} />
              <Route path="/perfil" element={<Profile user={user} setUser={setUser} />} />
              <Route path="/chat-bazar/:id" element={<Chat />} />
              <Route path="/suporte" element={<Support />} />
              <Route path="/configuracoes" element={<Settings />} />
              <Route path="/assinatura" element={<Subscription />} />
              <Route path="/ia-assistente" element={<AIAssistant />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;