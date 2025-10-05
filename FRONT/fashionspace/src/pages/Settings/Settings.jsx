import { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/i18n';
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
      distance: 'km'
    }
  });
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { t, setLanguage } = useI18n();

  useEffect(() => {
    const checkDarkMode = () => {
      const appElement = document.querySelector('.app');
      setIsDark(appElement && appElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    const appElement = document.querySelector('.app');
    if (appElement) {
      observer.observe(appElement, { attributes: true, attributeFilter: ['class'] });
    }
    
    return () => observer.disconnect();
  }, []);

  const getTextColor = (defaultColor) => {
    const appElement = document.querySelector('.app');
    const isDarkMode = appElement && appElement.classList.contains('dark');
    return isDarkMode ? 'rgba(15, 44, 71, 0.25)' : defaultColor;
  };

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

      // Aplicar idioma global imediatamente
      if (settings.preferences.language) {
        setLanguage(settings.preferences.language);
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
          distance: 'km'
        }
      };
      
      setSettings(defaultSettings);
      localStorage.setItem('fashionspace_settings', JSON.stringify(defaultSettings));
      alert('✓ Configurações restauradas para o padrão!');
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('ATENÇÃO: Esta ação é irreversível! Deseja realmente excluir sua conta?')) {
      if (confirm('Digite "EXCLUIR" para confirmar:') === 'EXCLUIR') {
        localStorage.clear();
        window.location.reload();
      }
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
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
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}><i className="bi bi-gear-fill"></i></div>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', margin: 0, color: getTextColor('white') }}>{t('settings.title')}</h1>
        <p style={{ fontSize: '1.3rem', opacity: 0.9, margin: 0, color: getTextColor('white') }}>{t('settings.subtitle')}</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        <div style={{
          background: 'white',
          borderRadius: '1.5rem',
          padding: '2rem',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
          border: '1px solid #e9ecef'
        }}>
          <h2 style={{
            color: getTextColor('#0f2c47'),
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <i className="bi bi-shield-fill" style={{ fontSize: '1.5rem', color: getTextColor('#5f81a5') }}></i>
            {t('settings.privacy')}
          </h2>
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

        <div style={{
          background: 'white',
          borderRadius: '1.5rem',
          padding: '2rem',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
          border: '1px solid #e9ecef'
        }}>
          <h2 style={{
            color: getTextColor('#0f2c47'),
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <i className="bi bi-palette-fill" style={{ fontSize: '1.5rem', color: getTextColor('#5f81a5') }}></i>
            {t('settings.preferences')}
          </h2>
          <div className="setting-item">
            <div className="setting-info">
              <h4>{t('settings.language')}</h4>
              <p>{t('settings.language')}</p>
            </div>
            <select 
              className="form-control" 
              style={{width: 'auto'}}
              value={settings.preferences.language}
              onChange={(e) => { handleSelect('preferences', 'language', e.target.value); setLanguage(e.target.value); }}
            >
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">English (US)</option>
              <option value="es-ES">Español</option>
            </select>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h4>{t('settings.theme')}</h4>
              <p>{t('settings.theme')}</p>
            </div>
            <select 
              className="form-control" 
              style={{width: 'auto'}}
              value={settings.preferences.theme}
              onChange={(e) => handleSelect('preferences', 'theme', e.target.value)}
            >
              <option value="auto">{t('settings.automatic')}</option>
              <option value="light">{t('settings.light')}</option>
              <option value="dark">{t('settings.dark')}</option>
            </select>
          </div>
                  </div>

        <div style={{
          background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
          borderRadius: '1.5rem',
          padding: '2rem',
          border: '2px solid #ef4444'
        }}>
          <h2 style={{
            color: '#dc2626',
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '1.5rem', color: '#dc2626' }}></i>
            Zona de Perigo
          </h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              onClick={handleReset}
              style={{
                background: '#f59e0b',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
            >
              <i className="bi bi-arrow-clockwise"></i> Restaurar Padrões
            </button>
            <button 
              onClick={handleDeleteAccount}
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
            >
              <i className="bi bi-trash-fill"></i> Excluir Conta
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <button 
            onClick={handleSave}
            disabled={loading}
            style={{
              background: loading ? '#ccc' : 'linear-gradient(135deg, #5f81a5 0%, #0f2c47 100%)',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '0.75rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              boxShadow: '0 4px 15px rgba(95, 129, 165, 0.3)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <i className={`bi ${loading ? 'bi-arrow-repeat' : 'bi-check-circle-fill'}`} style={{
              animation: loading ? 'spin 1s linear infinite' : 'none'
            }}></i> 
            {loading ? t('settings.saving') : t('settings.save')}
          </button>
          <button style={{
            background: '#f8f9fa',
            color: '#0f2c47',
            border: '2px solid #e9ecef',
            padding: '1rem 2rem',
            borderRadius: '0.75rem',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'all 0.3s ease'
          }}>
            <i className="bi bi-x-circle-fill"></i> {t('settings.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;