

const messagesEl = document.getElementById('messages');
const sendBtn = document.getElementById('sendBtn');
const input = document.getElementById('input');
const clearBtn = document.getElementById('clearBtn');
const presetList = document.getElementById('presetList');
const chatTitle = document.getElementById('chatTitle');
const chatSubtitle = document.getElementById('chatSubtitle');
const downloadLog = document.getElementById('downloadLog');
const toast = document.getElementById('toast');

let history = JSON.parse(localStorage.getItem('cb_history') || '[]');
let currentPreset = 'default';

function renderHistory() {
    messagesEl.innerHTML = '';
    history.forEach(m => appendMessage(m.text, m.sender, false));
    scrollToBottom();
}

function showToast(text, ms = 2000) {
    toast.textContent = text; toast.style.display = 'block';
    setTimeout(() => toast.style.display = 'none', ms);
}

function scrollToBottom() {
    requestAnimationFrame(() => { messagesEl.scrollTop = messagesEl.scrollHeight; });
}

function appendMessage(text, sender = 'bot', save = true) {
    const el = document.createElement('div');
    el.className = 'msg ' + (sender === 'user' ? 'user' : 'bot');
    el.innerHTML = `<div>${escapeHtml(text)}</div>`;
    messagesEl.appendChild(el);
    if (save) { history.push({ text, sender, time: Date.now() }); localStorage.setItem('cb_history', JSON.stringify(history)); }
    scrollToBottom();
}

function escapeHtml(unsafe) {
    return unsafe
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", "&#039;");
}


function showTyping() {
    const el = document.createElement('div');
    el.className = 'msg bot';
    el.id = 'typingIndicator';
    el.innerHTML = `<div class="dots"><span class="dot anim1"></span><span class="dot anim2"></span><span class="dot anim3"></span></div>`;
    messagesEl.appendChild(el);
    scrollToBottom();
}
function removeTyping() { const t = document.getElementById('typingIndicator'); if (t) t.remove(); }

async function botReply(userText) {
    showTyping();
    const delay = Math.min(1400 + userText.length * 20, 2500);
    await new Promise(r => setTimeout(r, delay));
    removeTyping();

    
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
    const txt = input.value.trim();
    if (!txt) return; input.value = ''; appendMessage(txt, 'user');
    try { await botReply(txt); }
    catch (e) { removeTyping(); appendMessage('Erro interno no bot (local). Veja o console.', 'bot'); console.error(e); }
}

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
});
sendBtn.addEventListener('click', send);

presetList.addEventListener('click', e => {
    const p = e.target.closest('.preset'); if (!p) return;
    currentPreset = p.dataset.id;
    chatTitle.textContent = p.querySelector('.name').textContent;
    chatSubtitle.textContent = p.querySelector('.sub').textContent;
    showToast('Preset: ' + currentPreset, 1000);
    input.focus();
});

clearBtn.addEventListener('click', () => {
    if (!confirm('Limpar todo o histórico deste navegador?')) return;
    history = []; localStorage.removeItem('cb_history'); renderHistory(); showToast('Histórico limpo');
});

const themeToggle = document.getElementById('themeToggle');
let dark = true;
themeToggle.addEventListener('click', () => {
    dark = !dark;
    if (!dark) { document.documentElement.style.setProperty('--bg', '#f7fafc'); document.documentElement.style.setProperty('--muted', 'rgba(0,0,0,0.55)'); document.documentElement.style.setProperty('--card', 'linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.01))'); document.body.style.color = '#061126'; }
    else { document.documentElement.style.removeProperty('--bg'); document.documentElement.style.setProperty('--muted', 'rgba(255,255,255,0.65)'); document.body.style.color = ''; document.documentElement.style.setProperty('--card', 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))'); }
});

downloadLog.addEventListener('click', () => {
    const data = JSON.stringify(history, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'chat_history.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
});

if (history.length === 0) { appendMessage('Olá! Eu sou um assistente local. Experimente perguntar algo — por exemplo: "Me explique vetores" ou "Conte uma piada".', 'bot'); }
else renderHistory();

messagesEl.addEventListener('focus', () => { messagesEl.scrollTop = messagesEl.scrollHeight; });



