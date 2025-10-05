import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { defaultBazares } from '../../data/bazares';
import BazarMessages from '../../components/common/BazarMessages';
import './Chat.css';

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef(null);
  const [bazar, setBazar] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  
  console.log('Chat component loaded with id:', id);
  console.log('Location pathname:', location.pathname);
  
  // Se estiver na rota /mensagens, mostrar o componente BazarMessages
  const isGeneralMessages = location.pathname === '/mensagens';
  
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('fashionspace_user') || 'null');
    setUser(savedUser);
  }, []);

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
    try {
      console.log('Loading chat for bazar ID:', id, typeof id);
      setLoading(true);
      setError(null);
      
      const userBazares = JSON.parse(localStorage.getItem('fashionspace_bazares') || '[]');
      const allBazares = [...defaultBazares, ...userBazares];
      console.log('Available bazares:', allBazares.length);
      console.log('All bazar IDs:', allBazares.map(b => ({ id: b.id, nome: b.nome })));
      
      // Múltiplas estratégias de busca
      let foundBazar = null;
      
      // 1. Busca exata
      foundBazar = allBazares.find(b => b.id === id);
      
      // 2. Busca convertendo para string
      if (!foundBazar) {
        foundBazar = allBazares.find(b => String(b.id) === String(id));
      }
      
      // 3. Busca por número se o ID for numérico
      if (!foundBazar && !isNaN(id)) {
        foundBazar = allBazares.find(b => b.id === parseInt(id) || String(b.id) === id);
      }
      
      // 4. Busca case-insensitive se for string
      if (!foundBazar && typeof id === 'string') {
        foundBazar = allBazares.find(b => String(b.id).toLowerCase() === id.toLowerCase());
      }
      
      console.log('Found bazar:', foundBazar);
      
      if (foundBazar) {
        setBazar(foundBazar);
        
        const savedMessages = JSON.parse(localStorage.getItem(`chat_${foundBazar.id}`) || '[]');
        if (savedMessages.length === 0) {
          const welcomeMessage = {
            id: Date.now(),
            text: autoResponses[0],
            sender: 'bazar',
            timestamp: new Date().toISOString()
          };
          setMessages([welcomeMessage]);
          localStorage.setItem(`chat_${foundBazar.id}`, JSON.stringify([welcomeMessage]));
        } else {
          setMessages(savedMessages);
        }
      } else {
        console.error('Bazar not found with ID:', id);
        console.error('Available IDs:', allBazares.map(b => ({ id: b.id, type: typeof b.id })));
        setError(`Bazar não encontrado (ID: ${id})`);
      }
    } catch (err) {
      console.error('Error loading chat:', err);
      setError('Erro ao carregar chat');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Se for a rota geral de mensagens, mostrar o componente BazarMessages
  if (isGeneralMessages) {
    if (!user) {
      return (
        <div className="chat-loading">
          <i className="bi bi-exclamation-triangle"></i>
          <p>Usuário não encontrado</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Voltar ao Início
          </button>
        </div>
      );
    }
    
    // Para donos de bazar, mostrar mensagens do primeiro bazar
    if (user.tipoUsuario === 'dono') {
      const userBazares = JSON.parse(localStorage.getItem('fashionspace_bazares') || '[]');
      const userCreatedBazares = userBazares.filter(bazar => bazar.criadoPor === user.id);
      
      if (userCreatedBazares.length > 0) {
        return (
          <div className="messages-page">
            <div className="messages-header">
              <button className="back-btn" onClick={() => navigate(-1)}>
                <i className="bi bi-arrow-left"></i>
                Voltar
              </button>
              <h1>Mensagens dos Bazares</h1>
            </div>
            <BazarMessages bazar={userCreatedBazares[0]} user={user} />
          </div>
        );
      } else {
        return (
          <div className="chat-loading">
            <i className="bi bi-shop"></i>
            <p>Você precisa ter um bazar para ver mensagens</p>
            <button onClick={() => navigate('/adicionar-bazar')} className="btn btn-primary">
              Criar Bazar
            </button>
          </div>
        );
      }
    } else {
      // Para usuários casuais, mostrar lista de conversas
      return (
        <div className="chat-loading">
          <i className="bi bi-chat-dots"></i>
          <p>Use o chat nos bazares para iniciar conversas</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Explorar Bazares
          </button>
        </div>
      );
    }
  }

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

    // Simular delay de resposta mais realista
    const responseDelay = Math.random() * 2000 + 1000; // 1-3 segundos
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
    }, responseDelay);

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

  if (loading) {
    return (
      <div className="chat-loading">
        <i className="bi bi-arrow-clockwise loading-spinner"></i>
        <p>Carregando chat...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="chat-loading">
        <i className="bi bi-exclamation-triangle"></i>
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="btn btn-primary">
          Voltar
        </button>
      </div>
    );
  }
  
  if (!bazar) {
    return (
      <div className="chat-loading">
        <i className="bi bi-exclamation-triangle"></i>
        <p>Bazar não encontrado</p>
        <button onClick={() => navigate(-1)} className="btn btn-primary">
          Voltar
        </button>
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
            onChange={(e) => {
              setNewMessage(e.target.value);
              // Auto-resize textarea
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
            }}
            onKeyPress={handleKeyPress}
            placeholder="Mensagem"
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