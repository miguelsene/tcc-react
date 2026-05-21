import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatService } from '../../services/chatService';
import './ChatSystem.css';

const ChatSystem = ({ bazarId, user, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [bazar, setBazar] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (bazarId && user) {
      loadBazar();
      loadMessages();
      const interval = setInterval(loadMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [bazarId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadBazar = async () => {
    try {
      const { defaultBazares } = await import('../../data/bazares');
      const userBazares = JSON.parse(localStorage.getItem('fashionspace_bazares') || '[]');
      const allBazares = [...defaultBazares, ...userBazares];
      
      let foundBazar = allBazares.find(b => 
        b.id === bazarId || 
        String(b.id) === String(bazarId) ||
        b.id === `default-${bazarId}`
      );

      if (!foundBazar) {
        const response = await fetch(`http://localhost:8080/api/bazar/${bazarId}`);
        if (response.ok) {
          const data = await response.json();
          foundBazar = { ...data, id: String(data.id) };
        }
      }

      setBazar(foundBazar || null);
    } catch (error) {
      console.error('Erro ao carregar bazar:', error);
      setBazar(null);
    }
  };

  const loadMessages = async () => {
    try {
      const data = await chatService.getConversation(user.id, bazarId);
      const formattedMessages = data.map(msg => ({
        id: msg.id,
        content: msg.conteudo,
        senderId: msg.remetenteId,
        timestamp: msg.dataEnvio,
        isOwn: msg.remetenteId === user.id
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || loading) return;

    setLoading(true);
    try {
      let destinatarioId;

      if (user.tipoUsuario === 'dono') {
        const clientMessage = messages.find(m => !m.isOwn);
        destinatarioId = clientMessage ? clientMessage.senderId : null;
      } else {
        destinatarioId = bazar.usuarioId || 1;
      }

      if (!destinatarioId) {
        alert('Não foi possível identificar o destinatário.');
        return;
      }

      const messageData = {
        remetenteId: user.id,
        destinatarioId: destinatarioId,
        bazarId: String(bazarId),
        conteudo: newMessage.trim()
      };

      await chatService.sendMessage(messageData);
      setNewMessage('');
      setTimeout(() => loadMessages(), 500);
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao enviar mensagem. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!bazar) {
    return (
      <div className="chat-loading">
        <i className="bi bi-exclamation-triangle" style={{ fontSize: '48px', color: '#ff6b6b' }}></i>
        <p>Bazar não encontrado</p>
        <button onClick={onClose || (() => navigate(-1))} className="send-btn" style={{ borderRadius: '8px', width: 'auto', padding: '8px 16px' }}>Voltar</button>
      </div>
    );
  }

  return (
    <div className="chat-system">
      <div className="chat-header">
        <button className="back-btn" onClick={onClose || (() => navigate(-1))}>
          <i className="bi bi-arrow-left"></i>
        </button>
        <div className="chat-info">
          <img 
            src={bazar.imagem} 
            alt={bazar.nome}
            className="bazar-avatar"
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/40x40/00a884/white?text=${bazar.nome.charAt(0)}`;
            }}
          />
          <div>
            <h3>{bazar.nome}</h3>
            <span className="status">Online</span>
          </div>
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <i className="bi bi-chat-dots"></i>
            <p>Inicie uma conversa</p>
          </div>
        ) : (
          messages.map(message => (
            <div 
              key={message.id}
              className={`message ${message.isOwn ? 'own' : 'other'}`}
            >
              <div className="message-content">
                <p>{message.content}</p>
                <span className="message-time">{formatTime(message.timestamp)}</span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <div className="input-container">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Digite sua mensagem..."
            disabled={loading}
          />
          <button 
            onClick={sendMessage}
            disabled={!newMessage.trim() || loading}
            className="send-btn"
          >
            <i className="bi bi-send-fill"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSystem;