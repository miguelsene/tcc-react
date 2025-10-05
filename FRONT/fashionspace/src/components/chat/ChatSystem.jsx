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
      
      setBazar(foundBazar);
    } catch (error) {
      console.error('Erro ao carregar bazar:', error);
    }
  };

  const loadMessages = async () => {
    try {
      console.log('=== CARREGANDO MENSAGENS DO CHAT ===');
      console.log('User ID:', user.id, 'Bazar ID:', bazarId);
      const data = await chatService.getConversation(user.id, bazarId);
      console.log('Mensagens recebidas do backend:', data.length);
      data.forEach(msg => {
        console.log('Mensagem:', msg.id, 'Remetente:', msg.remetenteId, 'Destinatário:', msg.destinatarioId, 'Conteúdo:', msg.conteudo);
      });
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
      let destinatarioId = 1; // Default para bazares padrão
      
      console.log('Enviando mensagem - User:', user);
      console.log('Bazar:', bazar);
      console.log('BazarId:', bazarId);
      
      // Identificar destinatário baseado no tipo de usuário e bazar
      if (user.tipoUsuario === 'dono') {
        // Dono respondendo - buscar cliente na conversa
        const clientMessage = messages.find(m => !m.isOwn);
        if (clientMessage) {
          destinatarioId = clientMessage.senderId;
          console.log('Dono respondendo para cliente ID:', destinatarioId);
        }
      } else {
        // Cliente enviando - sempre para o dono do bazar
        if (bazarId.startsWith('default-')) {
          // Bazar padrão - sempre para admin (ID 1)
          destinatarioId = 1;
          console.log('Enviando para bazar padrão - Admin ID: 1');
        } else {
          // Bazar de usuário - buscar o criador
          const userBazares = JSON.parse(localStorage.getItem('fashionspace_bazares') || '[]');
          const bazarData = userBazares.find(b => String(b.id) === String(bazarId));
          
          if (bazarData?.criadoPor) {
            destinatarioId = bazarData.criadoPor;
            console.log('Enviando para dono do bazar ID:', destinatarioId);
          } else {
            console.log('Bazar não encontrado, usando admin como fallback');
            destinatarioId = 1;
          }
        }
      }

      console.log('Destinatário ID:', destinatarioId);

      const messageData = {
        remetenteId: user.id,
        destinatarioId: destinatarioId,
        bazarId: String(bazarId),
        conteudo: newMessage.trim()
      };

      console.log('Dados da mensagem:', messageData);

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
        <div className="loading-spinner"></div>
        <p>Carregando chat...</p>
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