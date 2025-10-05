import React, { useState, useEffect } from 'react';
import './ChatNotifications.css';

const ChatNotifications = ({ user }) => {
  const [mensagensNaoLidas, setMensagensNaoLidas] = useState(0);
  const [conversas, setConversas] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (user) {
      carregarNotificacoes();
      const interval = setInterval(carregarNotificacoes, 30000); // Atualizar a cada 30s
      return () => clearInterval(interval);
    }
  }, [user]);

  const carregarNotificacoes = async () => {
    try {
      // Contar mensagens não lidas
      const countResponse = await fetch(`http://localhost:8080/api/mensagens/nao-lidas/${user.id}`);
      if (countResponse.ok) {
        const countData = await countResponse.json();
        setMensagensNaoLidas(countData.count);
      }

      // Carregar conversas recentes
      const conversasResponse = await fetch(`http://localhost:8080/api/mensagens/recebidas/${user.id}`);
      if (conversasResponse.ok) {
        const mensagens = await conversasResponse.json();
        
        // Agrupar por bazar e pegar a mensagem mais recente de cada
        const conversasMap = new Map();
        for (const mensagem of mensagens) {
          if (!conversasMap.has(mensagem.bazarId) || 
              new Date(mensagem.dataEnvio) > new Date(conversasMap.get(mensagem.bazarId).dataEnvio)) {
            conversasMap.set(mensagem.bazarId, mensagem);
          }
        }
        
        // Buscar dados dos bazares
        const conversasComBazar = await Promise.all(
          Array.from(conversasMap.values()).slice(0, 5).map(async (mensagem) => {
            try {
              const bazarResponse = await fetch(`http://localhost:8080/api/bazar/${mensagem.bazarId}`);
              if (bazarResponse.ok) {
                const bazar = await bazarResponse.json();
                return { ...mensagem, bazar };
              }
            } catch (error) {
              console.error('Erro ao buscar bazar:', error);
            }
            return mensagem;
          })
        );
        
        setConversas(conversasComBazar.filter(c => c.bazar));
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  };

  const formatarTempo = (dataString) => {
    const agora = new Date();
    const data = new Date(dataString);
    const diffMs = agora - data;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHoras = Math.floor(diffMs / 3600000);
    const diffDias = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHoras < 24) return `${diffHoras}h`;
    return `${diffDias}d`;
  };

  const abrirConversa = (conversa) => {
    // Implementar abertura da conversa
    setShowDropdown(false);
    // Aqui você pode abrir o ChatModal ou navegar para uma página de chat
  };

  return (
    <div className="chat-notifications">
      <button 
        className="chat-notifications-btn"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <i className="bi bi-chat-dots"></i>
        {mensagensNaoLidas > 0 && (
          <span className="notification-badge">{mensagensNaoLidas > 99 ? '99+' : mensagensNaoLidas}</span>
        )}
      </button>

      {showDropdown && (
        <div className="chat-dropdown">
          <div className="chat-dropdown-header">
            <h4>Mensagens</h4>
            <span className="chat-count">{mensagensNaoLidas} não lidas</span>
          </div>
          
          <div className="chat-conversations">
            {conversas.length > 0 ? (
              conversas.map((conversa) => (
                <div 
                  key={conversa.id} 
                  className={`chat-conversation-item ${!conversa.lida ? 'unread' : ''}`}
                  onClick={() => abrirConversa(conversa)}
                >
                  <img 
                    src={conversa.bazar.imagem} 
                    alt={conversa.bazar.nome}
                    className="conversation-bazar-image"
                  />
                  <div className="conversation-info">
                    <div className="conversation-header">
                      <span className="bazar-name">{conversa.bazar.nome}</span>
                      <span className="conversation-time">{formatarTempo(conversa.dataEnvio)}</span>
                    </div>
                    <p className="conversation-preview">
                      {conversa.conteudo.length > 50 
                        ? conversa.conteudo.substring(0, 50) + '...' 
                        : conversa.conteudo}
                    </p>
                  </div>
                  {!conversa.lida && <div className="unread-indicator"></div>}
                </div>
              ))
            ) : (
              <div className="no-conversations">
                <i className="bi bi-chat-dots"></i>
                <p>Nenhuma conversa ainda</p>
              </div>
            )}
          </div>
          
          <div className="chat-dropdown-footer">
            <button className="view-all-btn">Ver todas as conversas</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatNotifications;