import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { defaultBazares } from '../../data/bazares';
import './Chat.css';

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [bazar, setBazar] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const autoResponses = [
    "Olá! Bem-vindo ao nosso bazar! Como posso ajudá-lo hoje?",
    "Temos peças vintage únicas dos anos 70, 80 e 90. Está procurando algo específico?",
    "Qual é o seu estilo preferido? Temos desde peças clássicas até looks mais modernos!",
    "Nossos preços são bem acessíveis! A maioria das peças fica entre R$ 20 e R$ 150.",
    "Posso enviar fotos de algumas peças que chegaram hoje. Que tipo de roupa você procura?",
    "Estamos localizados no centro da cidade, bem fácil de chegar! Quer as direções?",
    "Funcionamos de segunda a sexta das 9h às 18h, e sábados das 9h às 15h.",
    "Que ótimo! Quando você pretende nos visitar? Posso separar algumas peças para você ver!",
    "Muito obrigado pelo interesse! Esperamos sua visita em breve!",
    "Tem mais alguma dúvida? Estou aqui para ajudar!"
  ];

  useEffect(() => {
    const userBazares = JSON.parse(localStorage.getItem('fashionspace_bazares') || '[]');
    const allBazares = [...defaultBazares, ...userBazares];
    const foundBazar = allBazares.find(b => b.id === id);
    
    if (foundBazar) {
      setBazar(foundBazar);
      
      const savedMessages = JSON.parse(localStorage.getItem(`chat_${id}`) || '[]');
      if (savedMessages.length === 0) {
        const welcomeMessage = {
          id: Date.now(),
          text: autoResponses[0],
          sender: 'bazar',
          timestamp: new Date().toISOString()
        };
        setMessages([welcomeMessage]);
        localStorage.setItem(`chat_${id}`, JSON.stringify([welcomeMessage]));
      } else {
        setMessages(savedMessages);
      }
    }
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setNewMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const randomResponse = autoResponses[Math.floor(Math.random() * autoResponses.length)];
      const bazarMessage = {
        id: Date.now() + 1,
        text: randomResponse,
        sender: 'bazar',
        timestamp: new Date().toISOString()
      };

      const finalMessages = [...updatedMessages, bazarMessage];
      setMessages(finalMessages);
      setIsTyping(false);
      
      localStorage.setItem(`chat_${id}`, JSON.stringify(finalMessages));
    }, 1500);

    localStorage.setItem(`chat_${id}`, JSON.stringify(updatedMessages));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
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
        <i className="bi bi-arrow-clockwise loading-spinner"></i>
        <p>Carregando chat...</p>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i>
        </button>
        
        <div className="chat-info">
          <img 
            src={bazar.imagem} 
            alt={bazar.nome}
            className="bazar-avatar"
          />
          <div className="bazar-details">
            <h3>{bazar.nome}</h3>
            <span className="online-status">
              <i className="bi bi-circle-fill"></i>
              Online
            </span>
          </div>
        </div>
        
        <button 
          className="info-btn"
          onClick={() => navigate(`/bazar-detalhes/${id}`)}
        >
          <i className="bi bi-info-circle-fill"></i>
        </button>
      </div>

      <div className="chat-messages">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`message ${message.sender === 'user' ? 'user-message' : 'bazar-message'}`}
          >
            <div className="message-content">
              <p>{message.text}</p>
              <span className="message-time">{formatTime(message.timestamp)}</span>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message bazar-message">
            <div className="message-content typing">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <div className="input-container">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            rows="1"
            className="message-input"
          />
          <button 
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="send-btn"
          >
            <i className="bi bi-send-fill"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;