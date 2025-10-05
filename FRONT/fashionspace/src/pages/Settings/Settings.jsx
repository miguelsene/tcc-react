import { useState, useEffect } from 'react';
import './Settings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    privacy: {
      profileVisible: true,
      showEmail: false,
      showPhone: false,
      allowMessages: true
    },
    preferences: {
      language: 'pt-BR',
      theme: 'auto',
      currency: 'BRL',
      notifications: true
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('fashionspace_settings') || '{}');
    if (Object.keys(savedSettings).length > 0) {
      setSettings(prev => ({ ...prev, ...savedSettings }));
    }
  }, []);

  const handleToggle = (section, key) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: !prev[section][key]
      }
    }));
  };

  const handleSelect = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    
    try {
      localStorage.setItem('fashionspace_settings', JSON.stringify(settings));
      
      // Simular salvamento no servidor
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Aplicar tema se mudou
      if (settings.preferences.theme !== 'auto') {
        document.documentElement.setAttribute('data-theme', settings.preferences.theme);
      }
      
      alert('✓ Configurações salvas com sucesso!');
    } catch (error) {
      alert('⚠️ Erro ao salvar configurações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (confirm('Tem certeza que deseja restaurar as configurações padrão?')) {
      const defaultSettings = {
        privacy: {
          profileVisible: true,
          showEmail: false,
          showPhone: false,
          allowMessages: true
        },
        preferences: {
          language: 'pt-BR',
          theme: 'auto',
          currency: 'BRL',
          notifications: true
        }
      };
      
      setSettings(defaultSettings);
      localStorage.setItem('fashionspace_settings', JSON.stringify(defaultSettings));
      alert('✓ Configurações restauradas para o padrão!');
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('ATENÇÃO: Esta ação é irreversível! Deseja realmente excluir sua conta?')) {
      if (prompt('Digite "EXCLUIR" para confirmar:') === 'EXCLUIR') {
        localStorage.clear();
        window.location.reload();
      }
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div className="header-icon">
          <i className="bi bi-gear-fill"></i>
        </div>
        <h1>Configurações</h1>
        <p>Personalize sua experiência no FashionSpace</p>
      </div>

      <div className="settings-content">
        {/* Privacidade */}
        <div className="settings-section">
          <div className="section-header">
            <i className="bi bi-shield-fill"></i>
            <h2>Privacidade</h2>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <h4>Perfil Público</h4>
              <p>Permitir que outros usuários vejam seu perfil</p>
            </div>
            <label className="toggle">
              <input 
                type="checkbox" 
                checked={settings.privacy.profileVisible}
                onChange={() => handleToggle('privacy', 'profileVisible')}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h4>Mostrar Email</h4>
              <p>Exibir seu email no perfil público</p>
            </div>
            <label className="toggle">
              <input 
                type="checkbox" 
                checked={settings.privacy.showEmail}
                onChange={() => handleToggle('privacy', 'showEmail')}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h4>Permitir Mensagens</h4>
              <p>Outros usuários podem enviar mensagens</p>
            </div>
            <label className="toggle">
              <input 
                type="checkbox" 
                checked={settings.privacy.allowMessages}
                onChange={() => handleToggle('privacy', 'allowMessages')}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        {/* Preferências */}
        <div className="settings-section">
          <div className="section-header">
            <i className="bi bi-palette-fill"></i>
            <h2>Preferências</h2>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h4>Idioma</h4>
              <p>Escolha o idioma da interface</p>
            </div>
            <select 
              className="form-select"
              value={settings.preferences.language}
              onChange={(e) => handleSelect('preferences', 'language', e.target.value)}
            >
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">English (US)</option>
              <option value="es-ES">Español</option>
            </select>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h4>Tema</h4>
              <p>Escolha a aparência da interface</p>
            </div>
            <select 
              className="form-select"
              value={settings.preferences.theme}
              onChange={(e) => handleSelect('preferences', 'theme', e.target.value)}
            >
              <option value="auto">Automático</option>
              <option value="light">Claro</option>
              <option value="dark">Escuro</option>
            </select>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h4>Notificações</h4>
              <p>Receber notificações sobre atividades</p>
            </div>
            <label className="toggle">
              <input 
                type="checkbox" 
                checked={settings.preferences.notifications}
                onChange={() => handleToggle('preferences', 'notifications')}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        {/* Zona de Perigo */}
        <div className="danger-section">
          <div className="section-header">
            <i className="bi bi-exclamation-triangle-fill"></i>
            <h2>Zona de Perigo</h2>
          </div>
          
          <div className="danger-actions">
            <button className="danger-btn reset-btn" onClick={handleReset}>
              <i className="bi bi-arrow-clockwise"></i>
              Restaurar Padrões
            </button>
            <button className="danger-btn delete-btn" onClick={handleDeleteAccount}>
              <i className="bi bi-trash-fill"></i>
              Excluir Conta
            </button>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="settings-actions">
          <button 
            className="save-btn"
            onClick={handleSave}
            disabled={loading}
          >
            <i className={`bi ${loading ? 'bi-arrow-repeat' : 'bi-check-circle-fill'}`}></i>
            {loading ? 'Salvando...' : 'Salvar Configurações'}
          </button>
          <button className="cancel-btn">
            <i className="bi bi-x-circle-fill"></i>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;