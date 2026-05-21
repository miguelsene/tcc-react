import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usuarioService } from '../../services/api';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email é obrigatório');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email inválido');
      return;
    }

    setLoading(true);
    try {
      await usuarioService.esqueciSenha(email);
      setSent(true);
    } catch (err) {
      console.error('Erro ao solicitar reset:', err);
      setError(err.message || 'Erro ao enviar email de recuperação');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setSent(false);
    handleSubmit({ preventDefault: () => {} });
  };

  if (sent) {
    return (
      <div className="forgot-password-page">
        <img 
          src="https://i.pinimg.com/736x/b8/22/5a/b8225adb14d7b1536e1ec62706928216.jpg" 
          alt="FashionSpace Logo" 
          className="forgot-password-logo"
        />
        
        <div className="forgot-password-container">
          <div className="forgot-password-card scroll-animate">
            <div className="success-content">
              <div className="success-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              
              <h2 className="success-title">Verifique seu email</h2>
              <p className="success-description">
                Enviamos instruções para redefinir sua senha para:
                <br />
                <strong className="email-highlight">{email}</strong>
              </p>

              <div className="spam-notice">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <span>Se não encontrar o email na caixa de entrada, verifique a pasta de spam ou lixo eletrônico.</span>
              </div>

              <button 
                className="btn btn-secondary"
                onClick={handleResend}
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Reenviar email'}
              </button>

              <div className="back-to-login">
                <Link to="/login" className="back-link">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Voltar para o login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-page">
      <img 
        src="https://i.pinimg.com/736x/b8/22/5a/b8225adb14d7b1536e1ec62706928216.jpg" 
        alt="FashionSpace Logo" 
        className="forgot-password-logo"
      />
      
      <div className="forgot-password-container">
        <div className="forgot-password-card scroll-animate">
          <div className="forgot-password-header">
            <h1>Esqueceu a senha?</h1>
            <p>Não se preocupe! Digite seu email abaixo e enviaremos instruções para redefinir sua senha.</p>
          </div>

          <form onSubmit={handleSubmit} className="forgot-password-form">
            {error && (
              <div className="error-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="input-icon">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu email"
                  disabled={loading}
                  className={error ? 'error' : ''}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Enviando...
                </>
              ) : (
                'Enviar instruções'
              )}
            </button>
          </form>

          <div className="back-to-login">
            <Link to="/login" className="back-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;