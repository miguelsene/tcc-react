import React from 'react';
import './ThemeTest.css';

const ThemeTest = () => {
  return (
    <div className="theme-test">
      <div className="test-card">
        <h3>Teste do Sistema de Temas</h3>
        <p>Este componente testa se as variáveis CSS estão funcionando corretamente.</p>
        
        <div className="test-elements">
          <button className="btn-primary">Botão Primário</button>
          <button className="btn-secondary">Botão Secundário</button>
          
          <input 
            type="text" 
            placeholder="Campo de texto" 
            className="form-control"
          />
          
          <div className="test-colors">
            <div className="color-box bg-primary">BG Primary</div>
            <div className="color-box bg-secondary">BG Secondary</div>
            <div className="color-box accent-bg">Accent</div>
          </div>
          
          <div className="test-texts">
            <p className="text-primary">Texto Primário</p>
            <p className="text-secondary">Texto Secundário</p>
            <p className="text-muted">Texto Muted</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeTest;