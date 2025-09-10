const AIAssistant = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #5f81a5 0%, #0f2c47 100%)',
        color: 'white',
        padding: '3rem 2rem',
        borderRadius: '1.5rem',
        marginBottom: '3rem',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(15, 44, 71, 0.3)'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}><i className="bi bi-robot"></i></div>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', margin: 0 }}>IA Assistente</h1>
        <p style={{ fontSize: '1.3rem', opacity: 0.9, margin: 0 }}>Seu consultor inteligente para impulsionar vendas</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          <i className="bi bi-circle-fill" style={{ color: '#10b981', fontSize: '0.5rem' }}></i>
          <span style={{ fontSize: '0.9rem' }}>Online e pronta para ajudar</span>
        </div>
      </div>
      
      {/* Recursos */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ color: '#0f2c47', fontSize: '2.2rem', fontWeight: '700', marginBottom: '2rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <i className="bi bi-stars"></i> Recursos Disponíveis
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div style={{
            background: 'white',
            padding: '2.5rem',
            borderRadius: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            border: '1px solid #e9ecef',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem', color: '#5f81a5' }}><i className="bi bi-graph-up"></i></div>
            <h3 style={{ color: '#0f2c47', fontSize: '1.4rem', fontWeight: '600', marginBottom: '1rem' }}>Análise de Vendas</h3>
            <p style={{ color: '#5f81a5', lineHeight: '1.6', margin: 0 }}>Insights sobre performance e tendências do seu bazar</p>
          </div>
          <div style={{
            background: 'white',
            padding: '2.5rem',
            borderRadius: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            border: '1px solid #e9ecef',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem', color: '#5f81a5' }}><i className="bi bi-bullseye"></i></div>
            <h3 style={{ color: '#0f2c47', fontSize: '1.4rem', fontWeight: '600', marginBottom: '1rem' }}>Segmentação</h3>
            <p style={{ color: '#5f81a5', lineHeight: '1.6', margin: 0 }}>Identifica perfil ideal dos seus clientes</p>
          </div>
          <div style={{
            background: 'white',
            padding: '2.5rem',
            borderRadius: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            border: '1px solid #e9ecef',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem', color: '#5f81a5' }}><i className="bi bi-lightbulb"></i></div>
            <h3 style={{ color: '#0f2c47', fontSize: '1.4rem', fontWeight: '600', marginBottom: '1rem' }}>Recomendações</h3>
            <p style={{ color: '#5f81a5', lineHeight: '1.6', margin: 0 }}>Sugestões personalizadas para melhorar vendas</p>
          </div>
        </div>
      </div>
      
      {/* Disclaimer */}
      <div style={{
        background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
        padding: '2rem',
        borderRadius: '1.5rem',
        border: '2px solid #f59e0b',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <div style={{ fontSize: '2.5rem', color: '#f59e0b' }}><i className="bi bi-exclamation-triangle-fill"></i></div>
        <div>
          <h4 style={{ color: '#92400e', fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem', margin: '0 0 0.5rem 0' }}>Funcionalidade em Desenvolvimento</h4>
          <p style={{ color: '#92400e', lineHeight: '1.6', margin: 0 }}>A IA Assistente está sendo aprimorada constantemente. Em breve, teremos análises ainda mais precisas e recursos avançados.</p>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;