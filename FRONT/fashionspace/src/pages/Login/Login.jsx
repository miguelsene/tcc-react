import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useScrollAnimationMultiple } from '../../hooks/useScrollAnimation';
import { usuarioService } from '../../services/api';
import './Login.css';

const Login = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    tipoUsuario: 'casual'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [formMessage, setFormMessage] = useState('');

  useScrollAnimationMultiple();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormMessage('');
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';

    if (!formData.senha) newErrors.senha = 'Senha é obrigatória';
    else if (formData.senha.length < 8) newErrors.senha = 'Senha deve ter pelo menos 8 caracteres';

    if (!isLogin) {
      if (!formData.nome) newErrors.nome = 'Nome é obrigatório';
      else if (formData.nome.trim().length < 3) newErrors.nome = 'Nome deve ter pelo menos 3 caracteres';

      if (!formData.confirmarSenha) newErrors.confirmarSenha = 'Confirmação de senha é obrigatória';
      else if (formData.senha !== formData.confirmarSenha) newErrors.confirmarSenha = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const salvarUsuario = (user) => {
    localStorage.setItem('fashionspace_user', JSON.stringify(user));
    setUser(user);
    window.dispatchEvent(new CustomEvent('userUpdated'));
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const decoded = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      salvarUsuario({
        id: decoded.sub,
        nome: decoded.name,
        email: decoded.email,
        fotoPerfil: decoded.picture,
        googleId: decoded.sub,
        tipoUsuario: 'casual'
      });
    } catch (error) {
      console.error('Erro no login com Google:', error);
      setErrors({ email: 'Erro ao fazer login com Google' });
      setFormMessage('Não foi possível entrar com Google agora.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setErrors({ email: 'Falha no login com Google' });
    setFormMessage('Falha no login com Google.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowErrors(true);
    setFormMessage('');

    if (!validateForm()) {
      setFormMessage('Revise os campos destacados antes de continuar.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const user = await usuarioService.login(formData.email, formData.senha);
        salvarUsuario(user);
      } else {
        const newUser = await usuarioService.criar({
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
          tipoUsuario: formData.tipoUsuario
        });
        salvarUsuario(newUser);
      }
    } catch (error) {
      console.error('Erro:', error);
      const message = error.message || 'Erro de conexão com o servidor.';
      setErrors({ email: message });
      setFormMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <img
        src="https://i.pinimg.com/736x/b8/22/5a/b8225adb14d7b1536e1ec62706928216.jpg"
        alt="FashionSpace Logo"
        className="login-logo"
      />

      <div className="login-container">
        <div className="login-card scroll-animate">
          <div className="login-header scroll-animate-fade">
            <h1>FashionSpace</h1>
            <p>Conecte-se aos melhores bazares de moda</p>
          </div>

          <div className="login-tabs scroll-animate-left">
            <button className={isLogin ? 'active' : ''} onClick={() => setIsLogin(true)}>
              Entrar
            </button>
            <button className={!isLogin ? 'active' : ''} onClick={() => setIsLogin(false)}>
              Cadastrar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="login-form scroll-animate-right">
            {!isLogin && (
              <div className="form-group">
                <label>Nome Completo</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className={`form-control ${showErrors && errors.nome ? 'error' : ''}`}
                  placeholder="Digite seu nome completo"
                />
                {showErrors && errors.nome && <span className="error-text">{errors.nome}</span>}
              </div>
            )}

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-control ${showErrors && errors.email ? 'error' : ''}`}
                placeholder="Digite seu email"
              />
              {showErrors && errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Senha</label>
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                className={`form-control ${showErrors && errors.senha ? 'error' : ''}`}
                placeholder="Digite sua senha"
              />
              {showErrors && errors.senha && <span className="error-text">{errors.senha}</span>}
            </div>

            {isLogin && (
              <div className="forgot-password-link-container">
                <Link to="/esqueci-senha" className="forgot-password-link">
                  Esqueceu a senha?
                </Link>
              </div>
            )}

            {!isLogin && (
              <>
                <div className="form-group">
                  <label>Tipo de Usuário</label>
                  <div className="user-type-selection">
                    <label className={`user-type-option ${formData.tipoUsuario === 'casual' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="tipoUsuario"
                        value="casual"
                        checked={formData.tipoUsuario === 'casual'}
                        onChange={handleChange}
                      />
                      <div className="option-content">
                        <i className="bi bi-person-fill"></i>
                        <span className="option-title">Usuário Casual</span>
                        <span className="option-desc">Explorar e comprar em bazares</span>
                      </div>
                    </label>
                    <label className={`user-type-option ${formData.tipoUsuario === 'dono' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="tipoUsuario"
                        value="dono"
                        checked={formData.tipoUsuario === 'dono'}
                        onChange={handleChange}
                      />
                      <div className="option-content">
                        <i className="bi bi-shop-window"></i>
                        <span className="option-title">Dono de Bazar</span>
                        <span className="option-desc">Criar e gerenciar bazares</span>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label>Confirmar Senha</label>
                  <input
                    type="password"
                    name="confirmarSenha"
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    className={`form-control ${showErrors && errors.confirmarSenha ? 'error' : ''}`}
                    placeholder="Confirme sua senha"
                  />
                  {showErrors && errors.confirmarSenha && <span className="error-text">{errors.confirmarSenha}</span>}
                </div>
              </>
            )}

            {formMessage && (
              <div className="error-text" role="alert">
                {formMessage}
              </div>
            )}

            <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
              {loading ? (isLogin ? 'Entrando...' : 'Cadastrando...') : (isLogin ? 'Entrar' : 'Cadastrar')}
            </button>

            <div className="divider">
              <span>ou</span>
            </div>

            <div className="google-login-container">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text={isLogin ? 'signin_with' : 'signup_with'}
                width="100%"
                locale="pt-BR"
              />
            </div>

            <button
              type="button"
              className="btn btn-secondary login-btn"
              onClick={() => {
                salvarUsuario({
                  id: 'guest',
                  nome: 'Convidado',
                  email: null,
                  tipoUsuario: 'guest'
                });
              }}
              style={{ marginTop: '10px' }}
            >
              Entrar sem conta
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
