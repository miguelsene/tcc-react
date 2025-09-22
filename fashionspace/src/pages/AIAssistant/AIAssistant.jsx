import React, { useEffect, useMemo, useRef, useState } from 'react';

// Página de IA Assistente convertida da pasta "chatia" para React
// Inclui: interface de chat, presets, histórico em localStorage, envio, resposta simulada, tema claro/escuro e download do log

const STORAGE_KEY = 'cb_history';

const PRESETS = [
  { id: 'default', avatar: 'AI', name: 'Assistente', sub: 'Conversa padrão' },
  { id: 'study', avatar: '📚', name: 'Estudo', sub: 'Resumos, exercícios' },
  { id: 'dev', avatar: '💻', name: 'Desenvolvedor', sub: 'Ajuda com código' },
];

function downloadFile(filename, text) {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

function escapeHtml(unsafe) {
  return unsafe
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export default function AIAssistant() {
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
  });
  const [currentPreset, setCurrentPreset] = useState('default');
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [toast, setToast] = useState('');
  const [dark, setDark] = useState(true);
  const messagesRef = useRef(null);
  const toastTimer = useRef(null);

  const presetInfo = useMemo(() => PRESETS.find(p => p.id === currentPreset) || PRESETS[0], [currentPreset]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    // mensagem inicial
    if (!history.length) {
      setHistory([{
        text: 'Olá! Eu sou um assistente local. Experimente perguntar algo — por exemplo: "Me explique vetores" ou "Conte uma piada".',
        sender: 'bot', time: Date.now()
      }]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // manter scroll no final ao atualizar
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [history, typing]);

  function showToast(text, ms = 2000) {
    setToast(text);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), ms);
  }

  function appendMessage(text, sender = 'bot') {
    setHistory(prev => [...prev, { text, sender, time: Date.now() }]);
  }

  async function botReply(userText) {
    setTyping(true);
    const delay = Math.min(1400 + userText.length * 20, 2500);
    await new Promise(r => setTimeout(r, delay));
    setTyping(false);

    const txt = userText.toLowerCase();
    let reply = '';
    if (/^(oi|olá|ola|eai|ei)\b/.test(txt)) reply = 'Olá! Como posso ajudar você hoje?';
    else if (txt.includes('ajuda')) reply = 'Posso ajudar com resumos, exercícios, ideias e exemplos de código ou apenas conversar.';
    else if (txt.includes('horário') || txt.includes('hora')) reply = `Agora são ${new Date().toLocaleTimeString()}.`;
    else if (txt.includes('avançado') || txt.includes('profundo')) reply = 'Se quiser, posso explicar tópicos complexos passo a passo.';
    else if (txt.includes('piada')) reply = 'Por que o programador confunde Halloween com o Natal? Porque OCT 31 = DEC 25.';
    else if (txt.length < 6) reply = 'Conte-me mais — seja específico para eu poder ajudar melhor.';
    else reply = `Você disse: "${userText}" — (exemplo de resposta local). Substitua esta função por uma chamada de API se quiser respostas mais poderosas.`;

    appendMessage(reply, 'bot');
  }

  async function send() {
    const txt = input.trim();
    if (!txt) return;
    setInput('');
    appendMessage(txt, 'user');
    try { await botReply(txt); }
    catch (e) { setTyping(false); appendMessage('Erro interno no bot (local). Veja o console.', 'bot'); console.error(e); }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }

  function onSelectPreset(id) {
    const p = PRESETS.find(x => x.id === id); if (!p) return;
    setCurrentPreset(id);
    showToast('Preset: ' + id, 1000);
  }

  function clearHistory() {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Limpar todo o histórico deste navegador?')) return;
    setHistory([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    showToast('Histórico limpo');
  }

  const wrapperClass = 'cb' + (dark ? '' : ' cb-light');

  return (
    <main className={wrapperClass} role="application" aria-label="Chatbot interativo">
      <style>{`
.cb{width:100%;max-width:1100px;margin:0 auto;padding:24px;min-height:calc(100vh - 160px);display:flex;align-items:center;justify-content:center}
.cb{--bg:#0f1724;--card:linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01));--glass:rgba(255,255,255,0.04);--accent-1:#7c5cff;--accent-2:#00d4ff;--muted:rgba(255,255,255,0.65);--radius:16px;--shadow:0 6px 22px rgba(2,6,23,0.6);--glass-border:1px solid rgba(255,255,255,0.04);color:#e6eef8;background:radial-gradient(1200px 600px at 10% 10%, rgba(124, 92, 255, 0.12), transparent),radial-gradient(800px 500px at 90% 90%, rgba(0, 212, 255, 0.06), transparent),var(--bg)}
.cb.cb-light{--bg:#f7fafc;--muted:rgba(0,0,0,0.55);--card:linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.01));color:#061126}
.cb .chat-wrap{width:100%;max-width:1050px;height:88vh;display:grid;grid-template-columns:320px 1fr;gap:20px}
.cb .sidebar{background:var(--card);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow);display:flex;flex-direction:column;gap:12px;min-width:240px;max-height:88vh;overflow:hidden}
.cb .brand{display:flex;align-items:center;gap:12px}
.cb .logo{width:46px;height:46px;border-radius:12px;background:linear-gradient(135deg,var(--accent-1),var(--accent-2));display:grid;place-items:center;font-weight:700;color:white;box-shadow:0 6px 18px rgba(0,0,0,0.35)}
.cb .brand h1{font-size:16px;margin:0}
.cb .brand p{margin:0;font-size:12px;color:var(--muted)}
.cb .search{display:flex;align-items:center;padding:8px 10px;border-radius:12px;background:var(--glass);border:var(--glass-border)}
.cb .search input{background:transparent;border:0;color:inherit;width:100%;outline:none}
.cb .preset-list{overflow:auto;padding-right:6px}
.cb .preset{display:flex;align-items:center;gap:10px;padding:10px;border-radius:10px;cursor:pointer}
.cb .preset:hover{background:rgba(255,255,255,0.02)}
.cb .avatar{width:42px;height:42px;border-radius:10px;background:linear-gradient(135deg,#4f46e5,#06b6d4);display:grid;place-items:center;font-weight:700}
.cb .preset .meta{display:flex;flex-direction:column}
.cb .name{font-weight:600}
.cb .sub{font-size:12px;color:var(--muted)}
.cb .chat-panel{background:linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01));border-radius:var(--radius);box-shadow:var(--shadow);display:flex;flex-direction:column;overflow:hidden}
.cb .chat-header{display:flex;align-items:center;gap:12px;padding:16px;border-bottom:1px solid rgba(255,255,255,0.03)}
.cb .chat-header h2{margin:0;font-size:16px}
.cb .chat-header p{margin:0;font-size:12px;color:var(--muted)}
.cb .messages{padding:18px;display:flex;flex-direction:column;gap:12px;overflow:auto;flex:1;scroll-behavior:smooth;background:linear-gradient(180deg,transparent,rgba(0,0,0,0.02))}
.cb .msg{max-width:78%;padding:12px 14px;border-radius:14px;line-height:1.35;box-shadow:0 6px 20px rgba(2,6,23,0.35)}
.cb .user{align-self:flex-end;background:linear-gradient(180deg,var(--accent-1),#5f72ff);border-bottom-right-radius:6px}
.cb .bot{align-self:flex-start;background:rgba(255,255,255,0.03);border-bottom-left-radius:6px;color:var(--muted)}
.cb .composer{display:flex;gap:10px;padding:12px;border-top:1px solid rgba(255,255,255,0.03);align-items:center}
.cb .composer textarea{resize:none;height:48px;border-radius:12px;padding:12px;background:transparent;border:var(--glass-border);color:inherit;outline:none;flex:1}
.cb .btn{background:linear-gradient(90deg,var(--accent-1),var(--accent-2));border:0;color:white;padding:10px 14px;border-radius:12px;cursor:pointer}
.cb .icon-btn{background:transparent;border:0;color:var(--muted);padding:8px;border-radius:10px;cursor:pointer}
@media (max-width:880px){.cb .chat-wrap{grid-template-columns:1fr;max-width:680px;padding-bottom:20px}.cb .sidebar{display:none}.cb .chat-panel{height:94vh}}
@media (max-width:420px){.cb .composer textarea{height:44px;padding:10px}.cb .logo{width:40px;height:40px}}
.cb .toast{position:fixed;left:50%;transform:translateX(-50%);bottom:40px;background:rgba(0,0,0,0.6);padding:10px 14px;border-radius:999px;color:white;font-size:13px}
.cb button:focus,.cb .preset:focus,.cb .search input:focus{outline:2px solid rgba(124,92,255,0.28);outline-offset:2px}
/* typing dots */
.cb .typing{display:inline-block;height:10px}
.cb .dots{display:inline-flex;gap:5px;align-items:center}
.cb .dot{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,0.35);opacity:0;transform:translateY(6px)}
.cb .anim1{animation:cb-pop 900ms infinite 0ms}
.cb .anim2{animation:cb-pop 900ms infinite 120ms}
.cb .anim3{animation:cb-pop 900ms infinite 240ms}
@keyframes cb-pop{0%{opacity:0;transform:translateY(6px)}50%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-3px)}}
      `}</style>

      <div className="chat-wrap" role="region">
        <aside className="sidebar" aria-label="Lista de conversas">
          <div className="brand">
            <div className="logo">CB</div>
            <div>
              <h1 style={{fontSize:16, margin:0}}>ChatBot</h1>
              <p style={{margin:0, fontSize:12, color:'var(--muted)'}}>Assistente local — offline</p>
            </div>
          </div>

          <div className="search" role="search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5"></circle></svg>
            <input placeholder="Procurar respostas..." aria-label="Pesquisar conversas" />
          </div>

          <div className="preset-list" tabIndex={0}>
            {PRESETS.map(p => (
              <div key={p.id} className="preset" onClick={() => onSelectPreset(p.id)} role="button" tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') onSelectPreset(p.id); }}>
                <div className="avatar">{p.avatar}</div>
                <div className="meta">
                  <div className="name">{p.name}</div>
                  <div className="sub">{p.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{marginTop:'auto',display:'flex',gap:8,alignItems:'center',justifyContent:'space-between'}}>
            <small style={{color:'var(--muted)'}}>Tema</small>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <button onClick={() => setDark(d => !d)} className="icon-btn" title="Alternar tema" aria-label="Alternar tema">🌓</button>
              <button onClick={clearHistory} className="icon-btn" title="Limpar chat" aria-label="Limpar chat">🗑️</button>
            </div>
          </div>
        </aside>

        <section className="chat-panel" aria-label="Área de chat">
          <header className="chat-header">
            <div style={{display:'flex',flexDirection:'column',flex:1}}>
              <h2 style={{margin:0}}>{presetInfo.name}</h2>
              <p style={{margin:0}}>{presetInfo.sub}</p>
            </div>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <button onClick={() => downloadFile('chat_history.json', JSON.stringify(history, null, 2))} className="icon-btn" title="Baixar histórico" aria-label="Baixar histórico">⬇️</button>
            </div>
          </header>

          <div className="messages" ref={messagesRef} role="log" aria-live="polite" tabIndex={0}>
            {history.map((m, idx) => (
              <div key={idx} className={`msg ${m.sender === 'user' ? 'user' : 'bot'}`} dangerouslySetInnerHTML={{ __html: `<div>${escapeHtml(m.text)}</div>` }} />
            ))}
            {typing && (
              <div className="msg bot" aria-label="Digitando">
                <div className="dots" aria-hidden="true"><span className="dot anim1"></span><span className="dot anim2"></span><span className="dot anim3"></span></div>
              </div>
            )}
          </div>

          <div className="composer" role="form" aria-label="Enviar mensagem">
            <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKeyDown} placeholder="Escreva sua mensagem..." aria-label="Mensagem" maxLength={2000} />
            <button className="btn" onClick={send} aria-label="Enviar">Enviar</button>
          </div>
        </section>
      </div>

      {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}
    </main>
  );
}
