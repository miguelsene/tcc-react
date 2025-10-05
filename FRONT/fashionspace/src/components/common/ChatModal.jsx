import React, { useState, useEffect, useRef } from 'react';
import './ChatModal.css';

const ChatModal = ({ isOpen, onClose, bazar, user }) => {
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Verificações de segurança
  if (!isOpen) return null;
  if (!bazar || !user) {
    return (
      <div className="chat-modal-overlay" onClick={onClose}>
        <div className="chat-modal" onClick={e => e.stopPropagation()}>
          <div className="chat-header">
            <h3>Erro</h3>
            <button className="chat-close-btn" onClick={onClose}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          <div className="chat-messages">
            <p>Dados insuficientes para abrir o chat.</p>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (isOpen && bazar && user) {
      carregarConversa();
    }
  }, [isOpen, bazar, user]);

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const carregarConversa = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Verificar se o backend está disponível
      const response = await fetch(`http://localhost:8080/api/mensagens/conversa/${user.id}/${bazar.id}`);
      if (response.ok) {
        const data = await response.json();
        setMensagens(data || []);
        // Marcar conversa como lida
        try {
          await fetch(`http://localhost:8080/api/mensagens/marcar-conversa-lida/${user.id}/${bazar.id}`, {
            method: 'PUT'
          });
        } catch (markError) {
          console.warn('Erro ao marcar como lida:', markError);
        }
      } else if (response.status === 404) {
        // Endpoint não encontrado, usar dados locais
        console.warn('API de mensagens não disponível, usando modo offline');
        const localMessages = JSON.parse(localStorage.getItem(`chat_${bazar.id}_${user.id}`) || '[]');
        setMensagens(localMessages);
      } else {
        setError('Erro ao carregar mensagens');
        setMensagens([]);
      }
    } catch (error) {
      console.error('Erro ao carregar conversa:', error);
      // Fallback para modo offline
      console.warn('Backend indisponível, usando modo offline');
      const localMessages = JSON.parse(localStorage.getItem(`chat_${bazar.id}_${user.id}`) || '[]');
      setMensagens(localMessages);
    } finally {
      setLoading(false);
    }
  };

  const enviarMensagem = async (e) => {
    e.preventDefault();
    if (!novaMensagem.trim()) return;

    setLoading(true);
    try {
      const mensagem = {
        remetenteId: user.id,
        destinatarioId: bazar.usuarioId || bazar.criadoPor,
        bazarId: bazar.id,
        conteudo: novaMensagem.trim()
      };

      try {
        const response = await fetch('http://localhost:8080/api/mensagens', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mensagem)
        });

        if (response.ok) {
          const novaMensagemSalva = await response.json();
          setMensagens(prev => [...prev, novaMensagemSalva]);
          setNovaMensagem('');
        } else {
          throw new Error('Backend error');
        }
      } catch (apiError) {
        // Fallback para modo offline
        console.warn('API indisponível, salvando localmente');
        const novaMensagemLocal = {
          id: Date.now(),
          ...mensagem,
          dataEnvio: new Date().toISOString(),
          lida: false
        };
        
        setMensagens(prev => {
          const updated = [...prev, novaMensagemLocal];
          localStorage.setItem(`chat_${bazar.id}_${user.id}`, JSON.stringify(updated));
          return updated;
        });
        setNovaMensagem('');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      alert('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(hoje.getDate() - 1);

    if (data.toDateString() === hoje.toDateString()) {
      return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else if (data.toDateString() === ontem.toDateString()) {
      return 'Ontem ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else {
      return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <div className="chat-modal-overlay" onClick={onClose}>
      <div className="chat-modal" onClick={e => e.stopPropagation()}>
        <div className="chat-header">
          <div className="chat-bazar-info">
            <img src={bazar.imagem} alt={bazar.nome} className="chat-bazar-image" />
            <div>
              <h3>{bazar.nome}</h3>
              <p>{bazar.endereco?.cidade || bazar.endereco || 'Localização não informada'}</p>
            </div>
          </div>
          <button className="chat-close-btn" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="chat-messages">
          {loading && (
            <div className="loading-message">
              <p>Carregando mensagens...</p>
            </div>
          )}
          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={carregarConversa}>Tentar novamente</button>
            </div>
          )}
          {!loading && !error && mensagens.length === 0 && (
            <div className="empty-message">
              <p>Nenhuma mensagem ainda. Seja o primeiro a enviar!</p>
            </div>
          )}
          {mensagens.map((mensagem) => (
            <div 
              key={mensagem.id} 
              className={`message ${mensagem.remetenteId === user.id ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                <p>{mensagem.conteudo}</p>
                <span className="message-time">{formatarData(mensagem.dataEnvio)}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-form" onSubmit={enviarMensagem}>
          <input
            type="text"
            value={novaMensagem}
            onChange={(e) => setNovaMensagem(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="chat-input"
            disabled={loading}
          />
          <button type="submit" className="chat-send-btn" disabled={loading || !novaMensagem.trim()}>
            <i className="bi bi-send-fill"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatModal;