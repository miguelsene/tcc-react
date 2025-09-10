import { useState } from 'react';
import './Settings.css';

const Settings = () => {
  return (
    <div className="settings scroll-animate">
      <div className="settings-header">
        <h1>
          <i className="bi bi-gear-fill"></i>
          Configurações
        </h1>
        <p>Personalize sua experiência no FashionSpace</p>
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <h2>
            <i className="bi bi-bell-fill"></i>
            Notificações
          </h2>
          <div className="setting-item">
            <div className="setting-info">
              <h4>Notificações Push</h4>
              <p>Receba notificações sobre novos bazares e mensagens</p>
            </div>
            <label className="toggle">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h2>
            <i className="bi bi-palette-fill"></i>
            Aparência
          </h2>
          <div className="setting-item">
            <div className="setting-info">
              <h4>Idioma</h4>
              <p>Escolha o idioma da interface</p>
            </div>
            <select className="form-control" style={{width: 'auto'}}>
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">English (US)</option>
            </select>
          </div>
        </div>

        <div className="settings-actions">
          <button className="btn btn-primary">
            <i className="bi bi-check-circle-fill"></i>
            Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;