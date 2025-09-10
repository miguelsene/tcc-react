import './AIAssistant.css';

const AIAssistant = () => {
  return (
    <div className="ai-assistant scroll-animate">
      <div className="ai-header">
        <div className="ai-avatar">
          <i className="bi bi-robot"></i>
        </div>
        <div className="ai-info">
          <h1>IA Assistente</h1>
          <p>Seu consultor inteligente para impulsionar vendas</p>
          <div className="ai-status">
            <i className="bi bi-circle-fill online"></i>
            <span>Online e pronta para ajudar</span>
          </div>
        </div>
      </div>

      <div className="ai-features">
        <h2>
          <i className="bi bi-stars"></i>
          Recursos Disponíveis
        </h2>
        <div className="features-grid">
          <div className="feature-card">
            <i className="bi bi-graph-up feature-icon"></i>
            <h3>Análise de Vendas</h3>
            <p>Insights sobre performance e tendências</p>
          </div>
          <div className="feature-card">
            <i className="bi bi-target feature-icon"></i>
            <h3>Segmentação</h3>
            <p>Identifica perfil ideal dos clientes</p>
          </div>
        </div>
      </div>

      <div className="ai-disclaimer">
        <div className="disclaimer-card">
          <i className="bi bi-info-circle-fill"></i>
          <div>
            <h4>Funcionalidade em Desenvolvimento</h4>
            <p>A IA Assistente está sendo aprimorada constantemente. Em breve, teremos análises ainda mais precisas.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;