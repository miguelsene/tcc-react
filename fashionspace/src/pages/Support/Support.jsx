import { useState } from 'react';

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
    },
    {
      question: 'O que são os planos de assinatura?',
      answer: 'Os planos de assinatura oferecem recursos premium como destaque do seu bazar e maior visibilidade.'
    }
  ];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    setContactForm({ nome: '', email: '', assunto: '', mensagem: '' });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem',
        background: 'linear-gradient(135deg, #5f81a5 0%, #0f2c47 100%)',
        color: 'white',
        padding: '3rem 2rem',
        borderRadius: '1.5rem',
        boxShadow: '0 10px 30px rgba(15, 44, 71, 0.3)'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}><i className="bi bi-headset"></i></div>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', margin: 0 }}>Central de Suporte</h1>
        <p style={{ fontSize: '1.3rem', opacity: 0.9, margin: 0 }}>Estamos aqui para ajudar você com qualquer dúvida ou problema</p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '3rem',
        justifyContent: 'center',
        background: '#f8f9fa',
        padding: '0.5rem',
        borderRadius: '1rem',
        maxWidth: '400px',
        margin: '0 auto 3rem auto'
      }}>
        <button 
          style={{
            padding: '1rem 2rem',
            border: 'none',
            borderRadius: '0.75rem',
            background: activeTab === 'faq' ? '#5f81a5' : 'transparent',
            color: activeTab === 'faq' ? 'white' : '#0f2c47',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: activeTab === 'faq' ? '0 4px 12px rgba(95, 129, 165, 0.3)' : 'none'
          }}
          onClick={() => setActiveTab('faq')}
        >
          <i className="bi bi-question-circle-fill"></i> FAQ
        </button>
        <button 
          style={{
            padding: '1rem 2rem',
            border: 'none',
            borderRadius: '0.75rem',
            background: activeTab === 'contact' ? '#5f81a5' : 'transparent',
            color: activeTab === 'contact' ? 'white' : '#0f2c47',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: activeTab === 'contact' ? '0 4px 12px rgba(95, 129, 165, 0.3)' : 'none'
          }}
          onClick={() => setActiveTab('contact')}
        >
          <i className="bi bi-envelope-fill"></i> Contato
        </button>
        <button 
          style={{
            padding: '1rem 2rem',
            border: 'none',
            borderRadius: '0.75rem',
            background: activeTab === 'guides' ? '#5f81a5' : 'transparent',
            color: activeTab === 'guides' ? 'white' : '#0f2c47',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: activeTab === 'guides' ? '0 4px 12px rgba(95, 129, 165, 0.3)' : 'none'
          }}
          onClick={() => setActiveTab('guides')}
        >
          <i className="bi bi-book-fill"></i> Guias
        </button>
      </div>

      <div>
        {activeTab === 'faq' && (
          <div>
            <h2 style={{ color: '#0f2c47', fontSize: '2rem', fontWeight: '700', marginBottom: '2rem', textAlign: 'center' }}>Perguntas Frequentes</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {faqs.map((faq, index) => (
                <div key={index} style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '1rem',
                  border: '1px solid #e9ecef',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                  transition: 'transform 0.3s ease'
                }}>
                  <div style={{
                    fontWeight: '600',
                    color: '#0f2c47',
                    marginBottom: '1rem',
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <i className="bi bi-question-circle" style={{ color: '#5f81a5' }}></i>
                    {faq.question}
                  </div>
                  <div style={{ color: '#5f81a5', lineHeight: '1.6' }}>
                    {faq.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div>
            <h2 style={{ color: '#0f2c47', fontSize: '2rem', fontWeight: '700', marginBottom: '2rem', textAlign: 'center' }}>Entre em Contato</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
              {/* Info de Contato */}
              <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '1rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                border: '1px solid #e9ecef'
              }}>
                <h3 style={{ color: '#0f2c47', marginBottom: '1.5rem', fontSize: '1.3rem' }}>Informações de Contato</h3>
                <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', color: '#5f81a5' }}><i className="bi bi-envelope-fill"></i></div>
                  <div>
                    <h4 style={{ color: '#0f2c47', margin: '0 0 0.25rem 0', fontWeight: '600' }}>Email</h4>
                    <p style={{ color: '#5f81a5', margin: 0 }}>suporte@fashionspace.com</p>
                  </div>
                </div>
                <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', color: '#5f81a5' }}><i className="bi bi-telephone-fill"></i></div>
                  <div>
                    <h4 style={{ color: '#0f2c47', margin: '0 0 0.25rem 0', fontWeight: '600' }}>Telefone</h4>
                    <p style={{ color: '#5f81a5', margin: 0 }}>(11) 9999-9999</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', color: '#5f81a5' }}><i className="bi bi-clock-fill"></i></div>
                  <div>
                    <h4 style={{ color: '#0f2c47', margin: '0 0 0.25rem 0', fontWeight: '600' }}>Horário</h4>
                    <p style={{ color: '#5f81a5', margin: 0 }}>Seg-Sex: 9h-18h</p>
                  </div>
                </div>
              </div>
              
              {/* Formulário */}
              <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '1rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                border: '1px solid #e9ecef'
              }}>
                <h3 style={{ color: '#0f2c47', marginBottom: '1.5rem', fontSize: '1.3rem' }}>Envie sua Mensagem</h3>
                <form onSubmit={handleContactSubmit}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#0f2c47', fontWeight: '600' }}>Nome</label>
                    <input
                      type="text"
                      value={contactForm.nome}
                      onChange={(e) => setContactForm({...contactForm, nome: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        border: '2px solid #e9ecef',
                        borderRadius: '0.75rem',
                        fontSize: '1rem',
                        transition: 'border-color 0.3s ease'
                      }}
                      required
                    />
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#0f2c47', fontWeight: '600' }}>Email</label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        border: '2px solid #e9ecef',
                        borderRadius: '0.75rem',
                        fontSize: '1rem',
                        transition: 'border-color 0.3s ease'
                      }}
                      required
                    />
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#0f2c47', fontWeight: '600' }}>Assunto</label>
                    <select
                      value={contactForm.assunto}
                      onChange={(e) => setContactForm({...contactForm, assunto: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        border: '2px solid #e9ecef',
                        borderRadius: '0.75rem',
                        fontSize: '1rem',
                        transition: 'border-color 0.3s ease'
                      }}
                      required
                    >
                      <option value="">Selecione um assunto</option>
                      <option value="duvida">Dúvida Geral</option>
                      <option value="problema">Problema Técnico</option>
                      <option value="sugestao">Sugestão</option>
                      <option value="reclamacao">Reclamação</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#0f2c47', fontWeight: '600' }}>Mensagem</label>
                    <textarea
                      value={contactForm.mensagem}
                      onChange={(e) => setContactForm({...contactForm, mensagem: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        border: '2px solid #e9ecef',
                        borderRadius: '0.75rem',
                        minHeight: '120px',
                        fontSize: '1rem',
                        resize: 'vertical',
                        transition: 'border-color 0.3s ease'
                      }}
                      rows="5"
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    style={{
                      background: 'linear-gradient(135deg, #5f81a5 0%, #0f2c47 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '1rem 2rem',
                      borderRadius: '0.75rem',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600',
                      width: '100%',
                      boxShadow: '0 4px 15px rgba(95, 129, 165, 0.3)',
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    <i className="bi bi-send-fill"></i> Enviar Mensagem
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'guides' && (
          <div>
            <h2 style={{ color: '#0f2c47', fontSize: '2rem', fontWeight: '700', marginBottom: '2rem', textAlign: 'center' }}>Guias e Tutoriais</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '1rem',
                textAlign: 'center',
                border: '1px solid #e9ecef',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s ease'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#5f81a5' }}><i className="bi bi-plus-circle-fill"></i></div>
                <h3 style={{ color: '#0f2c47', fontSize: '1.3rem', fontWeight: '600', marginBottom: '1rem' }}>Como Criar um Bazar</h3>
                <p style={{ color: '#5f81a5', lineHeight: '1.6', marginBottom: '1.5rem' }}>Aprenda passo a passo como criar e configurar seu bazar</p>
                <button style={{
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  color: '#0f2c47',
                  border: '2px solid #5f81a5',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}>Ver Guia</button>
              </div>
              <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '1rem',
                textAlign: 'center',
                border: '1px solid #e9ecef',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s ease'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#5f81a5' }}><i className="bi bi-camera-fill"></i></div>
                <h3 style={{ color: '#0f2c47', fontSize: '1.3rem', fontWeight: '600', marginBottom: '1rem' }}>Fotografias de Produtos</h3>
                <p style={{ color: '#5f81a5', lineHeight: '1.6', marginBottom: '1.5rem' }}>Dicas para tirar fotos atrativas dos seus produtos</p>
                <button style={{
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  color: '#0f2c47',
                  border: '2px solid #5f81a5',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}>Ver Guia</button>
              </div>
              <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '1rem',
                textAlign: 'center',
                border: '1px solid #e9ecef',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s ease'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#5f81a5' }}><i className="bi bi-graph-up-arrow"></i></div>
                <h3 style={{ color: '#0f2c47', fontSize: '1.3rem', fontWeight: '600', marginBottom: '1rem' }}>Aumentar Vendas</h3>
                <p style={{ color: '#5f81a5', lineHeight: '1.6', marginBottom: '1.5rem' }}>Estratégias para impulsionar seu bazar</p>
                <button style={{
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  color: '#0f2c47',
                  border: '2px solid #5f81a5',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}>Ver Guia</button>
              </div>
              <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '1rem',
                textAlign: 'center',
                border: '1px solid #e9ecef',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s ease'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#5f81a5' }}><i className="bi bi-shield-check"></i></div>
                <h3 style={{ color: '#0f2c47', fontSize: '1.3rem', fontWeight: '600', marginBottom: '1rem' }}>Segurança</h3>
                <p style={{ color: '#5f81a5', lineHeight: '1.6', marginBottom: '1.5rem' }}>Como manter sua conta e dados seguros</p>
                <button style={{
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  color: '#0f2c47',
                  border: '2px solid #5f81a5',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}>Ver Guia</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;