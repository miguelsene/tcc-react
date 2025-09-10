import './Subscription.css';

const Subscription = () => {
  return (
    <div className="subscription scroll-animate">
      <div className="subscription-header">
        <h1>
          <i className="bi bi-star-fill"></i>
          Planos de Assinatura
        </h1>
        <p>Impulsione seu bazar com recursos premium</p>
      </div>

      <div className="plans-grid">
        <div className="plan-card">
          <div className="plan-header" style={{ backgroundColor: '#5f81a5' }}>
            <h3>Básico</h3>
            <div className="plan-price">Gratuito</div>
          </div>
          <div className="plan-features">
            <div className="feature-item">
              <i className="bi bi-check-circle-fill"></i>
              <span>Criar até 1 bazar</span>
            </div>
            <div className="feature-item">
              <i className="bi bi-check-circle-fill"></i>
              <span>Fotos básicas</span>
            </div>
          </div>
          <button className="plan-btn" style={{ backgroundColor: '#5f81a5' }}>
            Plano Atual
          </button>
        </div>

        <div className="plan-card popular">
          <div className="popular-badge">
            <i className="bi bi-star-fill"></i>
            Mais Popular
          </div>
          <div className="plan-header" style={{ backgroundColor: '#0f2c47' }}>
            <h3>Premium</h3>
            <div className="plan-price">R$ 29,90/mês</div>
          </div>
          <div className="plan-features">
            <div className="feature-item">
              <i className="bi bi-check-circle-fill"></i>
              <span>Bazares ilimitados</span>
            </div>
            <div className="feature-item">
              <i className="bi bi-check-circle-fill"></i>
              <span>Destaque na busca</span>
            </div>
          </div>
          <button className="plan-btn" style={{ backgroundColor: '#0f2c47' }}>
            Assinar Agora
          </button>
        </div>
      </div>
    </div>
  );
};

export default Subscription;