import { useState } from 'react';
import './Login.css';

const Login = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });
  const [errors, setErrors] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (isLogin) {
      const users = JSON.parse(localStorage.getItem('fashionspace_users') || '[]');
      const user = users.find(u => u.email === formData.email && u.senha === formData.senha);
      
      if (user) {
        localStorage.setItem('fashionspace_user', JSON.stringify(user));
        setUser(user);
      } else {
        setErrors({ email: 'Email ou senha incorretos' });
      }
    } else {
      const users = JSON.parse(localStorage.getItem('fashionspace_users') || '[]');
      
      if (users.find(u => u.email === formData.email)) {
        setErrors({ email: 'Email já cadastrado' });
        return;
      }

      const newUser = {
        id: Date.now().toString(),
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        dataCadastro: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('fashionspace_users', JSON.stringify(users));
      localStorage.setItem('fashionspace_user', JSON.stringify(newUser));
      setUser(newUser);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>FashionSpace</h1>
          <p>Conecte-se aos melhores bazares de moda</p>
        </div>

        <div className="login-tabs">
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

        <form onSubmit={handleSubmit} className="login-form">
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
          )}

          <button type="submit" className="btn btn-primary login-btn">
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;