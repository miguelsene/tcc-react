import React, { useState, useEffect } from 'react';
import './BazarMessages.css';

const BazarMessages = ({ bazar, user }) => {
  const [mensagens, setMensagens] = useState([]);
  const [conversas, setConversas] = useState([]);
  const [conversaSelecionada, setConversaSelecionada] = useState(null);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bazar && user) {
      carregarMensagens();
    }
  }, [bazar, user]);

  const carregarMensagens = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/mensagens/bazar/${bazar.id}`);
      if (response.ok) {
        const data = await response.json();
        setMensagens(data);
        
        // Agrupar mensagens por remetente para criar conversas
        const conversasMap = new Map();
        for (const mensagem of data) {
          const usuarioId = mensagem.remetenteId === user.id ? mensagem.destinatarioId : mensagem.remetenteId;
          if (!conversasMap.has(usuarioId)) {
            conversasMap.set(usuarioId, {
              usuarioId,
              mensagens: [],
              ultimaMensagem: null,
              naoLidas: 0
            });
          }
          
          const conversa = conversasMap.get(usuarioId);
          conversa.mensagens.push(mensagem);
          
          if (!conversa.ultimaMensagem || new Date(mensagem.dataEnvio) > new Date(conversa.ultimaMensagem.dataEnvio)) {
            conversa.ultimaMensagem = mensagem;
          }
          
          if (!mensagem.lida && mensagem.destinatarioId === user.id) {
            conversa.naoLidas++;
          }
        }
        
        // Buscar dados dos usuários
        const conversasComUsuario = await Promise.all(
          Array.from(conversasMap.values()).map(async (conversa) => {
            try {
              const usuarioResponse = await fetch(`http://localhost:8080/api/usuario/${conversa.usuarioId}`);
              if (usuarioResponse.ok) {
                const usuario = await usuarioResponse.json();
                return { ...conversa, usuario };
              }
            } catch (error) {
              console.error('Erro ao buscar usuário:', error);
            }
            return conversa;
          })
        );
        
        setConversas(conversasComUsuario.filter(c => c.usuario).sort((a, b) => 
          new Date(b.ultimaMensagem.dataEnvio) - new Date(a.ultimaMensagem.dataEnvio)
        ));
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  const selecionarConversa = async (conversa) => {
    setConversaSelecionada(conversa);
    
    // Marcar mensagens como lidas
    if (conversa.naoLidas > 0) {
      try {
        await fetch(`http://localhost:8080/api/mensagens/marcar-conversa-lida/${user.id}/${bazar.id}`, {
          method: 'PUT'
        });
        
        // Atualizar estado local
        setConversas(prev => prev.map(c => 
          c.usuarioId === conversa.usuarioId ? { ...c, naoLidas: 0 } : c
        ));
      } catch (error) {
        console.error('Erro ao marcar como lida:', error);
      }
    }
  };

  const enviarResposta = async (e) => {
    e.preventDefault();
    if (!novaMensagem.trim() || !conversaSelecionada) return;

    setLoading(true);
    try {
      const mensagem = {
        remetenteId: user.id,
        destinatarioId: conversaSelecionada.usuarioId,
        bazarId: bazar.id,
        conteudo: novaMensagem.trim()
      };

      const response = await fetch('http://localhost:8080/api/mensagens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mensagem)
      });

      if (response.ok) {
        const novaMensagemSalva = await response.json();
        
        // Atualizar conversa selecionada
        setConversaSelecionada(prev => ({
          ...prev,
          mensagens: [...prev.mensagens, novaMensagemSalva],
          ultimaMensagem: novaMensagemSalva
        }));
        
        // Atualizar lista de conversas
        setConversas(prev => prev.map(c => 
          c.usuarioId === conversaSelecionada.usuarioId 
            ? { ...c, mensagens: [...c.mensagens, novaMensagemSalva], ultimaMensagem: novaMensagemSalva }
            : c
        ));
        
        setNovaMensagem('');
      }
    } catch (error) {
      console.error('Erro ao enviar resposta:', error);
      alert('Erro ao enviar resposta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    const hoje = new Date();
    
    if (data.toDateString() === hoje.toDateString()) {
      return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else {
      return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }
  };

  return (
    <div className="bazar-messages">
      <div className="messages-header">
        <h3>
          <i className="bi bi-chat-dots"></i>
          Mensagens do Bazar
        </h3>
        <span className="messages-count">
          {conversas.reduce((total, c) => total + c.naoLidas, 0)} não lidas
        </span>
      </div>

      <div className="messages-content">
        <div className="conversations-list">
          {conversas.length > 0 ? (
            conversas.map((conversa) => (
              <div 
                key={conversa.usuarioId}
                className={`conversation-item ${conversaSelecionada?.usuarioId === conversa.usuarioId ? 'active' : ''} ${conversa.naoLidas > 0 ? 'unread' : ''}`}
                onClick={() => selecionarConversa(conversa)}
              >
                <img 
                  src={conversa.usuario.fotoPerfil || `https://ui-avatars.com/api/?name=${conversa.usuario.nome}&background=5f81a5&color=fff&size=40`}
                  alt={conversa.usuario.nome}
                  className="user-avatar-small"
                />
                <div className="conversation-details">
                  <div className="conversation-header">
                    <span className="user-name">{conversa.usuario.nome}</span>
                    <span className="message-time">{formatarData(conversa.ultimaMensagem.dataEnvio)}</span>
                  </div>
                  <p className="last-message">
                    {conversa.ultimaMensagem.remetenteId === user.id ? 'Você: ' : ''}
                    {conversa.ultimaMensagem.conteudo.length > 40 
                      ? conversa.ultimaMensagem.conteudo.substring(0, 40) + '...'
                      : conversa.ultimaMensagem.conteudo}
                  </p>
                </div>
                {conversa.naoLidas > 0 && (
                  <span className="unread-count">{conversa.naoLidas}</span>
                )}
              </div>
            ))
          ) : (
            <div className="no-messages">
              <i className="bi bi-chat-dots"></i>
              <p>Nenhuma mensagem ainda</p>
            </div>
          )}
        </div>

        {conversaSelecionada && (
          <div className="conversation-detail">
            <div className="conversation-detail-header">
              <img 
                src={conversaSelecionada.usuario.fotoPerfil || `https://ui-avatars.com/api/?name=${conversaSelecionada.usuario.nome}&background=5f81a5&color=fff&size=32`}
                alt={conversaSelecionada.usuario.nome}
                className="user-avatar-small"
              />
              <div>
                <h4>{conversaSelecionada.usuario.nome}</h4>
                <p>{conversaSelecionada.usuario.email}</p>
              </div>
            </div>

            <div className="messages-history">
              {conversaSelecionada.mensagens
                .sort((a, b) => new Date(a.dataEnvio) - new Date(b.dataEnvio))
                .map((mensagem) => (
                <div 
                  key={mensagem.id}
                  className={`message-bubble ${mensagem.remetenteId === user.id ? 'sent' : 'received'}`}
                >
                  <p>{mensagem.conteudo}</p>
                  <span className="message-timestamp">{formatarData(mensagem.dataEnvio)}</span>
                </div>
              ))}
            </div>

            <form className="reply-form" onSubmit={enviarResposta}>
              <input
                type="text"
                value={novaMensagem}
                onChange={(e) => setNovaMensagem(e.target.value)}
                placeholder="Digite sua resposta..."
                className="reply-input"
                disabled={loading}
              />
              <button type="submit" className="reply-btn" disabled={loading || !novaMensagem.trim()}>
                <i className="bi bi-send-fill"></i>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BazarMessages;