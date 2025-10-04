import { useState, useRef, useEffect } from 'react';
import './AIAssistant.css';

const AIAssistant = () => {
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickSuggestions = [
    'Como criar um bazar de sucesso?',
    'Quais são as melhores categorias de produtos?',
    'Como atrair mais clientes para meu bazar?',
    'Dicas de precificação para bazares',
    'Como organizar um evento de bazar?',
    'Estratégias de marketing para bazares'
  ];

  const getBazarResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Respostas específicas sobre bazares
    if (message.includes('criar') && (message.includes('bazar') || message.includes('negócio'))) {
      return 'Para criar um bazar de sucesso, siga estas dicas: 1) Escolha um nicho específico (roupas vintage, artesanato, etc.), 2) Encontre um local com boa visibilidade, 3) Cuide da apresentação dos produtos, 4) Defina preços competitivos, 5) Invista em divulgação nas redes sociais. O FashionSpace pode ajudar você a divulgar seu bazar!';
    }
    
    if (message.includes('categoria') || message.includes('produto')) {
      return 'As categorias mais populares em bazares são: Roupas femininas (vestidos, blusas, calças), Acessórios (bolsas, bijuterias, óculos), Calçados, Roupas infantis, Artesanato, Decoração, e Produtos vintage. Recomendo focar em 2-3 categorias inicialmente para não dispersar muito.';
    }
    
    if (message.includes('cliente') || message.includes('atrair') || message.includes('venda')) {
      return 'Para atrair mais clientes: 1) Use o FashionSpace para divulgar seu bazar, 2) Poste fotos atrativas dos produtos, 3) Ofereça promoções especiais, 4) Crie um ambiente acolhedor, 5) Mantenha horários regulares, 6) Peça indicações aos clientes satisfeitos, 7) Use redes sociais para mostrar novidades.';
    }
    
    if (message.includes('preço') || message.includes('precificar')) {
      return 'Dicas de precificação: 1) Pesquise preços similares na região, 2) Considere o estado de conservação, 3) Para roupas usadas, pratique 30-50% do valor original, 4) Produtos artesanais podem ter margem maior, 5) Ofereça descontos para compras múltiplas, 6) Seja flexível para negociar.';
    }
    
    if (message.includes('evento') || message.includes('organizar')) {
      return 'Para organizar um evento de bazar: 1) Defina data e local adequados, 2) Divulgue com antecedência no FashionSpace, 3) Convide outros vendedores para criar variedade, 4) Prepare estrutura (mesas, cabides, espelhos), 5) Ofereça facilidades (estacionamento, banheiros), 6) Crie ambiente musical agradável.';
    }
    
    if (message.includes('marketing') || message.includes('divulgar') || message.includes('promover')) {
      return 'Estratégias de marketing para bazares: 1) Use o FashionSpace como sua vitrine principal, 2) Crie perfis no Instagram e Facebook, 3) Faça parcerias com influencers locais, 4) Participe de grupos de bazar na sua cidade, 5) Ofereça brindes ou sorteios, 6) Mantenha relacionamento pós-venda.';
    }
    
    if (message.includes('localização') || message.includes('local') || message.includes('onde')) {
      return 'Escolha de localização para bazares: 1) Centros comerciais ou galerias, 2) Praças e parques (com autorização), 3) Escolas e universidades, 4) Condomínios residenciais, 5) Eventos corporativos, 6) Feiras já estabelecidas. Sempre verifique as autorizações necessárias!';
    }
    
    if (message.includes('estoque') || message.includes('produto')) {
      return 'Gestão de estoque para bazares: 1) Mantenha variedade sem exagerar, 2) Renove produtos regularmente, 3) Organize por categorias e tamanhos, 4) Etiquete tudo claramente, 5) Controle entrada e saída, 6) Tenha produtos para diferentes faixas de preço.';
    }
    
    if (message.includes('lucro') || message.includes('ganhar') || message.includes('dinheiro')) {
      return 'Para aumentar o lucro do seu bazar: 1) Calcule todos os custos (local, transporte, tempo), 2) Mantenha margem mínima de 100% sobre o custo, 3) Invista em produtos de giro rápido, 4) Ofereça combos e promoções, 5) Fidelizar clientes custa menos que conquistar novos.';
    }
    
    if (message.includes('online') || message.includes('internet') || message.includes('digital')) {
      return 'Venda online para bazares: 1) Use o FashionSpace para criar sua loja virtual, 2) Tire fotos profissionais dos produtos, 3) Descreva detalhadamente cada item, 4) Ofereça múltiplas formas de pagamento, 5) Organize logística de entrega, 6) Mantenha atendimento rápido via WhatsApp.';
    }
    
    // Saudações
    if (message.includes('oi') || message.includes('olá') || message.includes('ola')) {
      return 'Olá! Que bom ter você aqui! Sou especialista em bazares e estou aqui para ajudar com todas as suas dúvidas sobre como criar, gerenciar e fazer seu bazar prosperar. O que você gostaria de saber?';
    }
    
    if (message.includes('obrigad') || message.includes('valeu')) {
      return 'Por nada! Fico feliz em ajudar com seu bazar. Lembre-se: o FashionSpace está aqui para impulsionar seu negócio. Se tiver mais dúvidas, estarei sempre disponível!';
    }
    
    // Resposta padrão
    return 'Interessante pergunta! Como especialista em bazares, posso ajudar você com: criação de bazares, estratégias de venda, precificação, marketing, escolha de produtos, organização de eventos e muito mais. Pode reformular sua pergunta focando em algum aspecto específico dos bazares?';
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simula tempo de resposta da IA
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: getBazarResponse(inputValue),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="ai-assistant">
      <div className="ai-header">
        <div className="ai-header-content">
          <div className="ai-info">
            <h1>Assistente FashionSpace</h1>
            <p>Especialista em Bazares de Moda</p>
            <div className="ai-description">
              <p>Nossa IA foi treinada especificamente para ajudar donos de bazares com estratégias de venda, marketing, precificação e gestão. Obtenha conselhos personalizados para fazer seu bazar prosperar.</p>
            </div>
          </div>
        </div>
      </div>

      {!chatStarted ? (
        <div className="ai-intro">
          <div className="intro-content">
            <div className="start-chat-container">
              <button 
                className="start-chat-btn"
                onClick={() => {
                  setChatStarted(true);
                  setMessages([{
                    id: 1,
                    type: 'ai',
                    content: 'Olá! Sou a IA do FashionSpace, especializada em bazares de moda. Como posso ajudar você hoje?',
                    timestamp: new Date()
                  }]);
                }}
              >
                Iniciar Chat
              </button>
            </div>
            <h2>Como posso ajudar seu bazar</h2>
            <div className="features-grid">
              <div className="feature-card">
                <h3>Criação de Bazares</h3>
                <p>Dicas para começar seu bazar do zero, desde a escolha do nicho até a primeira venda</p>
              </div>
              <div className="feature-card">
                <h3>Estratégias de Venda</h3>
                <p>Técnicas comprovadas para aumentar suas vendas e fidelizar clientes</p>
              </div>
              <div className="feature-card">
                <h3>Marketing Digital</h3>
                <p>Como usar redes sociais e o FashionSpace para divulgar seu bazar</p>
              </div>
              <div className="feature-card">
                <h3>Visual Merchandising</h3>
                <p>Organize e apresente seus produtos de forma atrativa para os clientes</p>
              </div>
            </div>
          </div>
        </div>
      ) : (

      <div className="chat-container">
        <div className="chat-header">
          <h2>Chat com a IA</h2>
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-avatar">
                {message.type === 'ai' ? 'IA' : 'U'}
              </div>
              <div className="message-content">
                <p>{message.content}</p>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message ai">
              <div className="message-avatar">IA</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="quick-suggestions">
          <h3>Sugestões rápidas</h3>
          <div className="suggestions-grid">
            {quickSuggestions.map((suggestion, index) => (
              <button
                key={index}
                className="suggestion-btn"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <div className="chat-input">
          <div className="input-container">
            <textarea
              className="message-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua pergunta sobre bazares..."
              rows="1"
            />
            <button
              className="send-btn"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
            >
              <i className="bi bi-send-fill"></i>
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default AIAssistant;