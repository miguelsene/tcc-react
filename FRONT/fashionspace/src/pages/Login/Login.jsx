import { useState } from 'react';
import { useScrollAnimationMultiple } from '../../hooks/useScrollAnimation';
import { usuarioService } from '../../services/api';
import './Login.css';

const Login = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  
  useScrollAnimationMultiple();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    tipoUsuario: 'casual'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';

    if (!formData.senha) newErrors.senha = 'Senha é obrigatória';
    else if (formData.senha.length < 6) newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';

    if (!isLogin) {
      if (!formData.nome) newErrors.nome = 'Nome é obrigatório';
      if (!formData.confirmarSenha) newErrors.confirmarSenha = 'Confirmação de senha é obrigatória';
      else if (formData.senha !== formData.confirmarSenha) newErrors.confirmarSenha = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isLogin) {
        const user = await usuarioService.login(formData.email, formData.senha);
        localStorage.setItem('fashionspace_user', JSON.stringify(user));
        setUser(user);
        window.dispatchEvent(new CustomEvent('userUpdated'));
      } else {
        const newUser = await usuarioService.criar({
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
          tipoUsuario: formData.tipoUsuario
        });
        localStorage.setItem('fashionspace_user', JSON.stringify(newUser));
        setUser(newUser);
        window.dispatchEvent(new CustomEvent('userUpdated'));
      }
    } catch (error) {
      console.error('Erro:', error);
      setErrors({ email: error.message || 'Erro de conexão com o servidor.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      <div className="login-card scroll-animate">
        <div className="login-header scroll-animate-fade">
          <h1>FashionSpace</h1>
          <p>Conecte-se aos melhores bazares de moda</p>
        </div>

        <div className="login-tabs scroll-animate-left">
          <button 
            className={isLogin ? 'active' : ''} 
            onClick={() => setIsLogin(true)}
          >
            Entrar
          </button>
          <button 
            className={!isLogin ? 'active' : ''} 
            onClick={() => setIsLogin(false)}
          >
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
                className={`form-control ${errors.nome ? 'error' : ''}`}
                placeholder="Digite seu nome completo"
              />
              {errors.nome && <span className="error-text">{errors.nome}</span>}
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-control ${errors.email ? 'error' : ''}`}
              placeholder="Digite seu email"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              className={`form-control ${errors.senha ? 'error' : ''}`}
              placeholder="Digite sua senha"
            />
            {errors.senha && <span className="error-text">{errors.senha}</span>}
          </div>

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
                  className={`form-control ${errors.confirmarSenha ? 'error' : ''}`}
                  placeholder="Confirme sua senha"
                />
                {errors.confirmarSenha && <span className="error-text">{errors.confirmarSenha}</span>}
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? 'Aguarde...' : (isLogin ? 'Entrar' : 'Cadastrar')}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary login-btn"
            onClick={() => {
              const guest = {
                id: 'guest',
                nome: 'Convidado',
                email: null,
                tipoUsuario: 'guest'
              };
              localStorage.setItem('fashionspace_user', JSON.stringify(guest));
              setUser(guest);
              window.dispatchEvent(new CustomEvent('userUpdated'));
            }}
            style={{ marginTop: '10px' }}
          >
            Entrar sem conta
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;