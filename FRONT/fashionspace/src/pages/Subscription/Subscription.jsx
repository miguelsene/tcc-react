import { useState } from 'react';

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardForm, setCardForm] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [showPayment, setShowPayment] = useState(false);

  const plans = [
    {
      id: 'basic',
      name: 'Básico',
      price: 0,
      priceText: 'Gratuito',
      color: '#5f81a5',
      features: [
        'Criar até 1 bazar',
        'Fotos básicas',
        'Suporte por email',
        'Perfil simples'
      ],
      current: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 29.90,
      priceText: 'R$ 29,90/mês',
      color: '#0f2c47',
      popular: true,
      features: [
        'Bazares ilimitados',
        'Destaque na busca',
        'Fotos em alta qualidade',
        'Analytics avançado',
        'Suporte prioritário',
        'Badge premium'
      ]
    },
    {
      id: 'pro',
      name: 'Profissional',
      price: 59.90,
      priceText: 'R$ 59,90/mês',
      color: '#d4af37',
      features: [
        'Tudo do Premium',
        'Impulsionamento automático',
        'Relatórios detalhados',
        'API personalizada',
        'Gerente de conta dedicado',
        'Integração com redes sociais'
      ]
    }
  ];

  const handlePlanSelect = (plan) => {
    if (plan.id === 'basic') return;
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handlePayment = (e) => {
    e.preventDefault();
    alert(`Pagamento processado com sucesso! Bem-vindo ao plano ${selectedPlan.name}!`);
    setShowPayment(false);
    setSelectedPlan(null);
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
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
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}><i className="bi bi-star-fill"></i></div>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', margin: 0 }}>Planos de Assinatura</h1>
        <p style={{ fontSize: '1.3rem', opacity: 0.9, margin: 0 }}>Impulsione seu bazar com recursos premium</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        {plans.map((plan) => (
          <div 
            key={plan.id}
            style={{
              background: 'white',
              borderRadius: '1.5rem',
              overflow: 'hidden',
              boxShadow: selectedPlan?.id === plan.id ? '0 15px 40px rgba(95, 129, 165, 0.4)' : '0 8px 25px rgba(0,0,0,0.1)',
              border: plan.popular ? '3px solid #f59e0b' : '1px solid #e9ecef',
              cursor: plan.id === 'basic' ? 'default' : 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              transform: selectedPlan?.id === plan.id ? 'scale(1.02)' : 'scale(1)'
            }}
            onClick={() => handlePlanSelect(plan)}
          >
            {plan.popular && (
              <div style={{
                position: 'absolute',
                top: '-1px',
                right: '2rem',
                background: '#f59e0b',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0 0 0.5rem 0.5rem',
                fontSize: '0.75rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                zIndex: 10
              }}>
                <i className="bi bi-star-fill"></i>
                Mais Popular
              </div>
            )}
            <div style={{
              background: `linear-gradient(135deg, ${plan.color} 0%, ${plan.color}dd 100%)`,
              color: 'white',
              padding: '2.5rem 2rem',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '0.5rem', margin: '0 0 0.5rem 0' }}>{plan.name}</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>{plan.priceText}</div>
            </div>
            <div style={{ padding: '2rem' }}>
              {plan.features.map((feature, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem',
                  color: '#5f81a5'
                }}>
                  <i className="bi bi-check-circle-fill" style={{ color: '#10b981', fontSize: '1.125rem' }}></i>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: '0 2rem 2rem 2rem' }}>
              <button 
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: 'none',
                  borderRadius: '0.75rem',
                  background: plan.current ? '#6c757d' : `linear-gradient(135deg, ${plan.color} 0%, ${plan.color}dd 100%)`,
                  color: 'white',
                  fontWeight: '600',
                  cursor: plan.current ? 'not-allowed' : 'pointer',
                  opacity: plan.current ? 0.7 : 1,
                  transition: 'all 0.3s ease',
                  fontSize: '1rem'
                }}
                disabled={plan.current}
              >
                {plan.current ? 'Plano Atual' : 'Assinar Agora'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showPayment && selectedPlan && (
        <div style={{
          background: 'white',
          borderRadius: '1.5rem',
          padding: '2rem',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
          border: '1px solid #e9ecef',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            color: '#0f2c47',
            fontSize: '1.8rem',
            fontWeight: '700',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textAlign: 'center',
            justifyContent: 'center'
          }}>
            <i className="bi bi-credit-card-fill" style={{ color: '#5f81a5' }}></i>
            Finalizar Assinatura - {selectedPlan.name}
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.5rem',
                background: paymentMethod === 'credit' ? '#e8f0f7' : '#f8f9fa',
                border: `2px solid ${paymentMethod === 'credit' ? '#5f81a5' : '#e9ecef'}`,
                borderRadius: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => setPaymentMethod('credit')}
            >
              <i className="bi bi-credit-card-fill" style={{ fontSize: '1.5rem', color: '#5f81a5' }}></i>
              <div>
                <h4 style={{ color: '#0f2c47', fontWeight: '600', margin: '0 0 0.25rem 0' }}>Cartão de Crédito</h4>
                <p style={{ color: '#5f81a5', fontSize: '0.875rem', margin: 0 }}>Visa, Mastercard, Elo</p>
              </div>
            </div>
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.5rem',
                background: paymentMethod === 'pix' ? '#e8f0f7' : '#f8f9fa',
                border: `2px solid ${paymentMethod === 'pix' ? '#5f81a5' : '#e9ecef'}`,
                borderRadius: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => setPaymentMethod('pix')}
            >
              <i className="bi bi-qr-code" style={{ fontSize: '1.5rem', color: '#5f81a5' }}></i>
              <div>
                <h4 style={{ color: '#0f2c47', fontWeight: '600', margin: '0 0 0.25rem 0' }}>PIX</h4>
                <p style={{ color: '#5f81a5', fontSize: '0.875rem', margin: 0 }}>Pagamento instantâneo</p>
              </div>
            </div>
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.5rem',
                background: paymentMethod === 'boleto' ? '#e8f0f7' : '#f8f9fa',
                border: `2px solid ${paymentMethod === 'boleto' ? '#5f81a5' : '#e9ecef'}`,
                borderRadius: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => setPaymentMethod('boleto')}
            >
              <i className="bi bi-file-earmark-text-fill" style={{ fontSize: '1.5rem', color: '#5f81a5' }}></i>
              <div>
                <h4 style={{ color: '#0f2c47', fontWeight: '600', margin: '0 0 0.25rem 0' }}>Boleto</h4>
                <p style={{ color: '#5f81a5', fontSize: '0.875rem', margin: 0 }}>Vencimento em 3 dias</p>
              </div>
            </div>
          </div>

          {paymentMethod === 'credit' && (
            <form className="credit-card-form" onSubmit={handlePayment}>
              <div className="form-row">
                <div className="form-group">
                  <label>Número do Cartão</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="1234 5678 9012 3456"
                    value={cardForm.number}
                    onChange={(e) => setCardForm({...cardForm, number: formatCardNumber(e.target.value)})}
                    maxLength="19"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Nome no Cartão</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="João Silva"
                    value={cardForm.name}
                    onChange={(e) => setCardForm({...cardForm, name: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Validade</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="MM/AA"
                    value={cardForm.expiry}
                    onChange={(e) => setCardForm({...cardForm, expiry: formatExpiry(e.target.value)})}
                    maxLength="5"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="123"
                    value={cardForm.cvv}
                    onChange={(e) => setCardForm({...cardForm, cvv: e.target.value.replace(/\D/g, '')})}
                    maxLength="4"
                    required
                  />
                </div>
              </div>
              <div className="subscription-actions">
                <button type="submit" className="btn btn-primary btn-large">
                  <i className="bi bi-shield-check"></i>
                  Confirmar Pagamento - {selectedPlan.priceText}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowPayment(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {paymentMethod === 'pix' && (
            <div className="pix-payment">
              <div className="qr-code-placeholder">
                <i className="bi bi-qr-code" style={{fontSize: '4rem'}}></i>
                <p>Escaneie o QR Code com seu app do banco</p>
              </div>
              <div className="pix-code">
                <p><strong>Código PIX:</strong></p>
                <code>00020126580014BR.GOV.BCB.PIX013636...</code>
                <button className="btn btn-secondary btn-sm">
                  <i className="bi bi-clipboard"></i>
                  Copiar Código
                </button>
              </div>
            </div>
          )}

          {paymentMethod === 'boleto' && (
            <div className="boleto-payment">
              <div className="boleto-info">
                <i className="bi bi-file-earmark-text" style={{fontSize: '3rem'}}></i>
                <h3>Boleto Bancário</h3>
                <p>Valor: {selectedPlan.priceText}</p>
                <p>Vencimento: {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
              </div>
              <button className="btn btn-primary btn-large">
                <i className="bi bi-download"></i>
                Gerar Boleto
              </button>
            </div>
          )}

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: '1rem',
            color: '#5f81a5',
            fontSize: '0.875rem'
          }}>
            <i className="bi bi-shield-check" style={{ color: '#10b981' }}></i>
            <span>Pagamento 100% seguro e criptografado</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscription;