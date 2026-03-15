import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { mensagemService, bazarService, getUsuarioLogado } from '../../services/api';
import './Chat.css';

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef(null);
  const [bazar, setBazar] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = getUsuarioLogado();

  const isGeneralMessages = location.pathname === '/mensagens';

  const loadChat = async () => {
    if (!user || !id) return;
    try {
      const [bazarData, msgs] = await Promise.all([
        bazarService.buscarPorId(id),
        mensagemService.buscarConversa(user.id, id),
      ]);
      setBazar(bazarData);
      setMessages(msgs);
    } catch (err) {
      setError('Erro ao carregar chat');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isGeneralMessages) {
      loadChat();
      const interval = setInterval(loadChat, 5000);
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !bazar) return;
    try {
      await mensagemService.enviar({
        remetenteId: Number(user.id),
        destinatarioId: Number(bazar.usuarioId),
        bazarId: Number(id),
        conteudo: newMessage.trim(),
      });
      setNewMessage('');
      await loadChat();
    } catch (err) {
      alert('Erro ao enviar mensagem');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  if (isGeneralMessages) {
    return (
      <div className="chat-loading">
        <i className="bi bi-chat-dots"></i>
        <p>Acesse um bazar para iniciar uma conversa</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Explorar Bazares
        </button>
      </div>
    );
  }

  if (loading) return (
    <div className="chat-loading">
      <i className="bi bi-arrow-clockwise loading-spinner"></i>
      <p>Carregando chat...</p>
    </div>
  );

  if (error || !bazar) return (
    <div className="chat-loading">
      <i className="bi bi-exclamation-triangle"></i>
      <p>{error || 'Bazar não encontrado'}</p>
      <button onClick={() => navigate(-1)} className="btn btn-primary">Voltar</button>
    </div>
  );

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i>
        </button>
        <div className="chat-info">
          <img src={bazar.imagem} alt={bazar.nome} className="bazar-avatar" />
          <div className="bazar-details">
            <h3>{bazar.nome}</h3>
            <span className="online-status"><i className="bi bi-circle-fill"></i> Online</span>
          </div>
        </div>
        <button className="info-btn" onClick={() => navigate(`/bazar-detalhes/${id}`)}>
          <i className="bi bi-info-circle-fill"></i>
        </button>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: 20, color: '#5f81a5' }}>
            Nenhuma mensagem ainda. Inicie a conversa!
          </div>
        )}
        {messages.map(msg => (
          <div key={msg.id} className={`message ${Number(msg.remetenteId) === Number(user.id) ? 'user-message' : 'bazar-message'}`}>
            <div className="message-content">
              <p>{msg.conteudo}</p>
              <span className="message-time">{formatTime(msg.dataEnvio)}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <div className="input-container">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Mensagem"
            rows="1"
            className="message-input"
          />
          <button onClick={sendMessage} disabled={!newMessage.trim()} className="send-btn">
            <i className="bi bi-send-fill"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
