import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatService } from '../../services/chatService';
import './ChatNotifications.css';

const ChatNotifications = ({ user }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [conversations, setConversations] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      console.log('=== CARREGANDO NOTIFICAÇÕES ===');
      console.log('User ID:', user.id, 'Tipo:', user.tipoUsuario);
      
      // Contar mensagens não lidas
      const { count } = await chatService.getUnreadCount(user.id);
      setUnreadCount(count || 0);
      console.log('Mensagens não lidas:', count);

      // Carregar conversas recentes (otimizado - já retorna apenas a mais recente de cada)
      const conversasRecentes = await chatService.getAllConversations(user.id, user.tipoUsuario);
      console.log('Conversas encontradas:', conversasRecentes.length);

        // Buscar dados dos bazares
        const { defaultBazares } = await import('../../data/bazares');
        const userBazares = JSON.parse(localStorage.getItem('fashionspace_bazares') || '[]');
        const allBazares = [...defaultBazares, ...userBazares];

        const conversasComBazar = conversasRecentes.slice(0, 5).map(msg => {
          const bazar = allBazares.find(b => 
            String(b.id) === String(msg.bazarId) || 
            b.id === `default-${msg.bazarId}`
          );
          return {
            ...msg,
            bazar: bazar || { nome: 'Bazar não encontrado', imagem: '' }
          };
        });

      setConversations(conversasComBazar);
    } catch (error) {
      console.error('Backend indisponível:', error);
      setUnreadCount(0);
      setConversations([]);
    }
  };

  const openChat = (bazarId) => {
    setShowDropdown(false);
    navigate(`/chat/${bazarId}`);
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}d`;
  };

  return (
    <div className="chat-notifications">
      <button 
        className="notifications-btn"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <i className="bi bi-chat-dots"></i>
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="notifications-dropdown">
          <div className="dropdown-header">
            <h4>Mensagens</h4>
            <span>{unreadCount} não lidas</span>
          </div>
          
          <div className="conversations-list">
            {conversations.length > 0 ? (
              conversations.map(conv => (
                <div 
                  key={`${conv.bazarId}-${conv.remetenteId}`}
                  className={`conversation-item ${!conv.lida ? 'unread' : ''}`}
                  onClick={() => openChat(conv.bazarId)}
                >
                  <img 
                    src={conv.bazar.imagem}
                    alt={conv.bazar.nome}
                    className="conversation-avatar"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/40x40/00a884/white?text=${conv.bazar.nome.charAt(0)}`;
                    }}
                  />
                  <div className="conversation-info">
                    <div className="conversation-header">
                      <span className="bazar-name">{conv.bazar.nome}</span>
                      <span className="message-time">{formatTime(conv.dataEnvio)}</span>
                    </div>
                    <p className="message-preview">
                      {conv.conteudo.length > 50 
                        ? conv.conteudo.substring(0, 50) + '...' 
                        : conv.conteudo}
                    </p>
                  </div>
                  {!conv.lida && <div className="unread-dot"></div>}
                </div>
              ))
            ) : (
              <div className="no-conversations">
                <i className="bi bi-chat-dots"></i>
                <p>Nenhuma conversa</p>
              </div>
            )}
          </div>
          
          <div className="dropdown-footer">
            <button 
              className="view-all-btn"
              onClick={() => {
                setShowDropdown(false);
                navigate('/mensagens');
              }}
            >
              Ver todas
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatNotifications;