import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';
import { useScrollAnimationMultiple } from './hooks/useScrollAnimation';
import PageTransition from './components/common/PageTransition';
import Sidebar from './components/common/Sidebar';
import Topbar from './components/common/Topbar';
import './components/common/Button.css';
import Login from './pages/Login/Login';
import ProtectedRoute from './components/common/ProtectedRoute';
import './App.css';
import './global-palette.css';
import './theme-fix.css';
import './transparent-cards.css';

// Lazy-loaded pages (code-splitting)
const Home = lazy(() => import('./pages/Home/Home'));
const AddBazar = lazy(() => import('./pages/AddBazar/AddBazar'));
const BazarDetails = lazy(() => import('./pages/BazarDetails/BazarDetails'));
const EditBazar = lazy(() => import('./pages/EditBazar/EditBazar'));
const Favorites = lazy(() => import('./pages/Favorites/Favorites'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const Chat = lazy(() => import('./pages/Chat/Chat'));
const Support = lazy(() => import('./pages/Support/Support'));
const Settings = lazy(() => import('./pages/Settings/Settings'));
const AIAssistant = lazy(() => import('./pages/AIAssistant/AIAssistant'));
const SocialFeedPage = lazy(() => import('./pages/SocialFeed/SocialFeedPage'));

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
    
    if (savedUser) {
      const user = JSON.parse(savedUser);
      // Migração: adicionar tipoUsuario se não existir
      if (!user.tipoUsuario) {
        user.tipoUsuario = 'casual';
        localStorage.setItem('fashionspace_user', JSON.stringify(user));
        
        // Atualizar também na lista de usuários
        const users = JSON.parse(localStorage.getItem('fashionspace_users') || '[]');
        const updatedUsers = users.map(u => u.id === user.id ? user : u);
        localStorage.setItem('fashionspace_users', JSON.stringify(updatedUsers));
      }
      console.log('Usuário carregado:', user);
      console.log('Tipo de usuário:', user.tipoUsuario);
      setUser(user);
    }
    if (savedTheme) setDarkMode(savedTheme === 'dark');
    if (savedSidebar !== null) setSidebarVisible(JSON.parse(savedSidebar));
  }, []);

  // Habilita lazy-loading para todas as imagens por padrão
  useEffect(() => {
    const setLazy = (img) => {
      try {
        if (!img.getAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
        }
        if (!img.getAttribute('decoding')) {
          img.setAttribute('decoding', 'async');
        }
      } catch {}
    };

    // Inicial
    document.querySelectorAll('img').forEach(setLazy);

    // Observa mudanças no DOM para aplicar em imagens adicionadas dinamicamente
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'childList') {
          m.addedNodes.forEach(node => {
            if (node.nodeType === 1) {
              if (node.tagName === 'IMG') setLazy(node);
              node.querySelectorAll && node.querySelectorAll('img').forEach(setLazy);
            }
          });
        } else if (m.type === 'attributes' && m.target.tagName === 'IMG') {
          setLazy(m.target);
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src']
    });

    return () => observer.disconnect();
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

  
  return (
          <div className={`app ${darkMode ? 'dark' : 'light'} ${sidebarVisible ? 'sidebar-visible' : 'sidebar-hidden'} ${user?.tipoUsuario === 'dono' ? 'is-dono' : ''}`}>
        <Router>
        {user ? (
        <>
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
            <PageTransition>
              <Suspense fallback={<div className="loading">Carregando...</div>}>
              <Routes>
                <Route path="/" element={<Home searchTerm={globalSearchTerm} user={user} />} />
                <Route path="/adicionar-bazar" element={
                  <ProtectedRoute user={user} requireDono={true}>
                    <AddBazar />
                  </ProtectedRoute>
                } />
                <Route path="/bazar-detalhes/:id" element={<BazarDetails />} />
                <Route path="/editar-bazar/:id" element={
                  <ProtectedRoute user={user} requireDono={true}>
                    <EditBazar />
                  </ProtectedRoute>
                } />
                <Route path="/favoritos" element={
                  user?.tipoUsuario === 'dono'
                    ? <Navigate to="/" />
                    : (
                      <ProtectedRoute user={user} blockGuest={true}>
                        <Favorites />
                      </ProtectedRoute>
                    )
                } />
                <Route path="/perfil" element={
                  <ProtectedRoute user={user} blockGuest={true}>
                    <Profile user={user} setUser={setUser} />
                  </ProtectedRoute>
                } />
                <Route path="/chat-bazar/:id" element={
                  <ProtectedRoute user={user} blockGuest={true}>
                    <Chat />
                  </ProtectedRoute>
                } />
                <Route path="/suporte" element={
                  <ProtectedRoute user={user} blockGuest={true}>
                    <Support />
                  </ProtectedRoute>
                } />
                <Route path="/configuracoes" element={
                  <ProtectedRoute user={user} blockGuest={true}>
                    <Settings />
                  </ProtectedRoute>
                } />
                                <Route path="/ia-assistente" element={
                  <ProtectedRoute user={user} requireDono={true}>
                    <AIAssistant />
                  </ProtectedRoute>
                } />
                <Route path="/feed" element={
                  <ProtectedRoute user={user} blockGuest={true}>
                    <SocialFeedPage user={user} />
                  </ProtectedRoute>
                } />
                                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Suspense>
            </PageTransition>
          </div>
        </div>
        </>
        ) : (
          <div className="main-content">
            <div className="content">
              <PageTransition>
                <Suspense fallback={<div className="loading">Carregando...</div>}>
                  <Routes>
                    <Route path="/login" element={<Login setUser={setUser} />} />
                    <Route path="/bazar-detalhes/:id" element={<BazarDetails />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                  </Routes>
                </Suspense>
              </PageTransition>
            </div>
          </div>
        )}
        </Router>
      </div>
      );
}

export default App;