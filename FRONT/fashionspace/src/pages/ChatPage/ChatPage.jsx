import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ChatSystem from '../../components/chat/ChatSystem';

const ChatPage = () => {
  const { bazarId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('fashionspace_user') || 'null');
    setUser(savedUser);
    
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <i className="bi bi-exclamation-triangle" style={{ fontSize: '48px', color: '#ff6b6b' }}></i>
        <p>Você precisa estar logado para usar o chat</p>
      </div>
    );
  }

  return <ChatSystem bazarId={bazarId} user={user} />;
};

export default ChatPage;