import { useState } from 'react';
import './Support.css';

const Support = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [contactForm, setContactForm] = useState({
    nome: '',
    email: '',
    assunto: '',
    mensagem: ''
  });

  const faqs = [
    {
      question: 'Como criar um bazar?',
      answer: 'Para criar um bazar, clique no botão "Criar Bazar" na página inicial e preencha todas as informações necessárias.'
    },
    {
      question: 'Como funciona o sistema de avaliações?',
      answer: 'Após visitar um bazar, você pode avaliá-lo de 1 a 5 estrelas e deixar um comentário sobre sua experiência.'
    },
    {
      question: 'Posso editar meu bazar depois de criado?',
      answer: 'Sim! Acesse seu perfil e clique em "Editar" no bazar que deseja modificar.'
    },
    {
      question: 'Como funciona o chat com os bazares?',
      answer: 'Clique no botão "Chat" em qualquer bazar para iniciar uma conversa direta com o proprietário.'
    }
  ];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    setContactForm({ nome: '', email: '', assunto: '', mensagem: '' });
  };

  return (
    <div className="support-page">
      <div className="support-header">
        <div className="header-icon">
          <i className="bi bi-headset"></i>
        </div>
        <h1>Central de Suporte</h1>
        <p>Estamos aqui para ajudar você com qualquer dúvida ou problema</p>
      </div>

      <div className="support-tabs">
        <button 
          className={`tab-btn ${activeTab === 'faq' ? 'active' : ''}`}
          onClick={() => setActiveTab('faq')}
        >
          <i className="bi bi-question-circle-fill"></i>
          FAQ
        </button>
        <button 
          className={`tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          <i className="bi bi-envelope-fill"></i>
          Contato
        </button>
        <button 
          className={`tab-btn ${activeTab === 'guides' ? 'active' : ''}`}
          onClick={() => setActiveTab('guides')}
        >
          <i className="bi bi-book-fill"></i>
          Guias
        </button>
      </div>

      <div className="support-content">
        {activeTab === 'faq' && (
          <div className="faq-section">
            <h2>Perguntas Frequentes</h2>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div key={index} className="faq-item">
                  <div className="faq-question">
                    <i className="bi bi-question-circle"></i>
                    {faq.question}
                  </div>
                  <div className="faq-answer">
                    {faq.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="contact-section">
            <h2>Entre em Contato</h2>
            <div className="contact-grid">
              <div className="contact-info">
                <h3>Informações de Contato</h3>
                <div className="contact-item">
                  <i className="bi bi-envelope-fill"></i>
                  <div>
                    <h4>Email</h4>
                    <p>suporte@fashionspace.com</p>
                  </div>
                </div>
                <div className="contact-item">
                  <i className="bi bi-telephone-fill"></i>
                  <div>
                    <h4>Telefone</h4>
                    <p>(11) 9999-9999</p>
                  </div>
                </div>
                <div className="contact-item">
                  <i className="bi bi-clock-fill"></i>
                  <div>
                    <h4>Horário</h4>
                    <p>Seg-Sex: 9h-18h</p>
                  </div>
                </div>
              </div>
              
              <div className="contact-form">
                <h3>Envie sua Mensagem</h3>
                <form onSubmit={handleContactSubmit}>
                  <div className="form-group">
                    <label>Nome</label>
                    <input
                      type="text"
                      value={contactForm.nome}
                      onChange={(e) => setContactForm({...contactForm, nome: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Assunto</label>
                    <select
                      value={contactForm.assunto}
                      onChange={(e) => setContactForm({...contactForm, assunto: e.target.value})}
                      required
                    >
                      <option value="">Selecione um assunto</option>
                      <option value="duvida">Dúvida Geral</option>
                      <option value="problema">Problema Técnico</option>
                      <option value="sugestao">Sugestão</option>
                      <option value="reclamacao">Reclamação</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Mensagem</label>
                    <textarea
                      value={contactForm.mensagem}
                      onChange={(e) => setContactForm({...contactForm, mensagem: e.target.value})}
                      rows="5"
                      required
                    />
                  </div>
                  <button type="submit" className="submit-btn">
                    <i className="bi bi-send-fill"></i>
                    Enviar Mensagem
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'guides' && (
          <div className="guides-section">
            <h2>Guias e Tutoriais</h2>
            <div className="guides-grid">
              <div className="guide-card">
                <div className="guide-icon">
                  <i className="bi bi-plus-circle-fill"></i>
                </div>
                <h3>Como Criar um Bazar</h3>
                <p>Aprenda passo a passo como criar e configurar seu bazar</p>
                <button className="guide-btn">Ver Guia</button>
              </div>
              <div className="guide-card">
                <div className="guide-icon">
                  <i className="bi bi-camera-fill"></i>
                </div>
                <h3>Fotografias de Produtos</h3>
                <p>Dicas para tirar fotos atrativas dos seus produtos</p>
                <button className="guide-btn">Ver Guia</button>
              </div>
              <div className="guide-card">
                <div className="guide-icon">
                  <i className="bi bi-graph-up-arrow"></i>
                </div>
                <h3>Aumentar Vendas</h3>
                <p>Estratégias para impulsionar seu bazar</p>
                <button className="guide-btn">Ver Guia</button>
              </div>
              <div className="guide-card">
                <div className="guide-icon">
                  <i className="bi bi-shield-check"></i>
                </div>
                <h3>Segurança</h3>
                <p>Como manter sua conta e dados seguros</p>
                <button className="guide-btn">Ver Guia</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;