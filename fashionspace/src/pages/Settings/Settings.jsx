import { useState, useEffect } from 'react';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      push: true,
      email: true,
      sms: false,
      newBazares: true,
      messages: true,
      promotions: true
    },
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
        notifications: {
          push: true,
          email: true,
          sms: false,
          newBazares: true,
          messages: true,
          promotions: true
        },
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
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', margin: 0 }}>Configurações</h1>
        <p style={{ fontSize: '1.3rem', opacity: 0.9, margin: 0 }}>Personalize sua experiência no FashionSpace</p>
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
            color: '#0f2c47',
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <i className="bi bi-bell-fill" style={{ fontSize: '1.5rem', color: '#5f81a5' }}></i>
            Notificações
          </h2>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 0',
            borderBottom: '1px solid #f1f3f4'
          }}>
            <div>
              <h4 style={{ color: '#0f2c47', fontWeight: '600', margin: '0 0 0.25rem 0' }}>Notificações Push</h4>
              <p style={{ color: '#5f81a5', fontSize: '0.875rem', margin: 0 }}>Receba notificações no navegador</p>
            </div>
            <label style={{
              position: 'relative',
              display: 'inline-block',
              width: '60px',
              height: '34px'
            }}>
              <input 
                type="checkbox" 
                checked={settings.notifications.push}
                onChange={() => handleToggle('notifications', 'push')}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: settings.notifications.push ? '#5f81a5' : '#ccc',
                transition: '0.4s',
                borderRadius: '34px'
              }}>
                <span style={{
                  position: 'absolute',
                  content: '',
                  height: '26px',
                  width: '26px',
                  left: settings.notifications.push ? '30px' : '4px',
                  bottom: '4px',
                  backgroundColor: 'white',
                  transition: '0.4s',
                  borderRadius: '50%'
                }}></span>
              </span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h4>Notificações por Email</h4>
              <p>Receba atualizações por email</p>
            </div>
            <label style={{
              position: 'relative',
              display: 'inline-block',
              width: '60px',
              height: '34px'
            }}>
              <input 
                type="checkbox" 
                checked={settings.notifications.email}
                onChange={() => handleToggle('notifications', 'email')}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: settings.notifications.email ? '#5f81a5' : '#ccc',
                transition: '0.4s',
                borderRadius: '34px'
              }}>
                <span style={{
                  position: 'absolute',
                  content: '',
                  height: '26px',
                  width: '26px',
                  left: settings.notifications.email ? '30px' : '4px',
                  bottom: '4px',
                  backgroundColor: 'white',
                  transition: '0.4s',
                  borderRadius: '50%'
                }}></span>
              </span>
            </label>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 0',
            borderBottom: '1px solid #f1f3f4'
          }}>
            <div>
              <h4 style={{ color: '#0f2c47', fontWeight: '600', margin: '0 0 0.25rem 0' }}>Novos Bazares</h4>
              <p style={{ color: '#5f81a5', fontSize: '0.875rem', margin: 0 }}>Seja notificado sobre novos bazares na sua região</p>
            </div>
            <label style={{
              position: 'relative',
              display: 'inline-block',
              width: '60px',
              height: '34px'
            }}>
              <input 
                type="checkbox" 
                checked={settings.notifications.newBazares}
                onChange={() => handleToggle('notifications', 'newBazares')}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: settings.notifications.newBazares ? '#5f81a5' : '#ccc',
                transition: '0.4s',
                borderRadius: '34px'
              }}>
                <span style={{
                  position: 'absolute',
                  content: '',
                  height: '26px',
                  width: '26px',
                  left: settings.notifications.newBazares ? '30px' : '4px',
                  bottom: '4px',
                  backgroundColor: 'white',
                  transition: '0.4s',
                  borderRadius: '50%'
                }}></span>
              </span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h4>Mensagens</h4>
              <p>Notificações de novas mensagens no chat</p>
            </div>
            <label className="toggle">
              <input 
                type="checkbox" 
                checked={settings.notifications.messages}
                onChange={() => handleToggle('notifications', 'messages')}
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
            color: '#0f2c47',
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <i className="bi bi-shield-fill" style={{ fontSize: '1.5rem', color: '#5f81a5' }}></i>
            Privacidade
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
            color: '#0f2c47',
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <i className="bi bi-palette-fill" style={{ fontSize: '1.5rem', color: '#5f81a5' }}></i>
            Preferências
          </h2>
          <div className="setting-item">
            <div className="setting-info">
              <h4>Idioma</h4>
              <p>Escolha o idioma da interface</p>
            </div>
            <select 
              className="form-control" 
              style={{width: 'auto'}}
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
              className="form-control" 
              style={{width: 'auto'}}
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
              <h4>Moeda</h4>
              <p>Moeda padrão para exibição de preços</p>
            </div>
            <select 
              className="form-control" 
              style={{width: 'auto'}}
              value={settings.preferences.currency}
              onChange={(e) => handleSelect('preferences', 'currency', e.target.value)}
            >
              <option value="BRL">Real (R$)</option>
              <option value="USD">Dólar ($)</option>
              <option value="EUR">Euro (€)</option>
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
            {loading ? 'Salvando...' : 'Salvar Configurações'}
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
            <i className="bi bi-x-circle-fill"></i> Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;