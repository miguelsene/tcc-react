import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categorias } from '../../data/bazares';
import { bazarService, formatarBazarParaBackend } from '../../services/api';
import './AddBazar.css';

const AddBazar = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    imagem: '',
    categoria: '',
    cep: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    telefone: '',
    horario: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, imagem: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCepChange = async (e) => {
    const cep = e.target.value.replace(/\D/g, '');
    setFormData({ ...formData, cep: e.target.value });
    
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            rua: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: `${data.localidade}, ${data.uf}` || ''
          }));
        }
      } catch (error) {
        console.log('Erro ao buscar CEP:', error);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.descricao.trim()) newErrors.descricao = 'Descrição é obrigatória';
    if (!formData.categoria) newErrors.categoria = 'Categoria é obrigatória';
    if (!formData.cep.trim()) newErrors.cep = 'CEP é obrigatório';
    if (!formData.rua.trim()) newErrors.rua = 'Rua é obrigatória';
    if (!formData.numero.trim()) newErrors.numero = 'Número é obrigatório';
    if (!formData.bairro.trim()) newErrors.bairro = 'Bairro é obrigatório';
    if (!formData.cidade.trim()) newErrors.cidade = 'Cidade é obrigatória';
    if (!formData.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório';
    if (!formData.horario.trim()) newErrors.horario = 'Horário é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem('fashionspace_user'));
      
      // Evitar enviar base64 para o backend (pode estourar coluna no banco)
      const isBase64 = typeof formData.imagem === 'string' && formData.imagem.startsWith('data:');
      const imagemParaSalvar = isBase64 ? '' : (formData.imagem || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500');

      const bazarData = {
        nome: formData.nome,
        descricao: formData.descricao,
        imagem: imagemParaSalvar,
        categoria: formData.categoria,
        endereco: {
          cep: formData.cep,
          rua: formData.rua,
          numero: formData.numero,
          bairro: formData.bairro,
          cidade: formData.cidade
        },
        telefone: formData.telefone,
        horario: formData.horario
      };

      // Converter para formato do backend
      const bazarParaBackend = formatarBazarParaBackend(bazarData, user.id);
      console.log('Dados para enviar:', bazarParaBackend);
      
      // Enviar para a API
      const novoBazar = await bazarService.criar(bazarParaBackend);
      console.log('Bazar criado:', novoBazar);
      
      alert('Bazar criado com sucesso!');
      // Notificar outras telas para recarregar a lista
      window.dispatchEvent(new Event('bazaresUpdated'));
      
      // Ir direto ao perfil para ver o novo bazar
      navigate('/perfil');

    } catch (error) {
      console.error('Erro ao criar bazar:', error);
      alert(error.message || 'Erro ao criar bazar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-bazar">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i>
          Voltar
        </button>
        <h1>Criar Novo Bazar</h1>
        <p>Compartilhe seu bazar com a comunidade</p>
      </div>

      <form onSubmit={handleSubmit} className="bazar-form">
        <div className="form-section">
          <h3>
            <i className="bi bi-info-circle-fill"></i>
            Informações Básicas
          </h3>
          
          <div className="form-group">
            <label>Nome do Bazar *</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className={`form-control ${errors.nome ? 'error' : ''}`}
              placeholder="Ex: Bazar da Moda Vintage"
            />
            {errors.nome && <span className="error-text">{errors.nome}</span>}
          </div>

          <div className="form-group">
            <label>Descrição *</label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              className={`form-control ${errors.descricao ? 'error' : ''}`}
              placeholder="Descreva seu bazar, produtos e diferenciais..."
              rows="4"
            />
            {errors.descricao && <span className="error-text">{errors.descricao}</span>}
          </div>

          <div className="form-group">
            <label>Categoria *</label>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className={`form-control ${errors.categoria ? 'error' : ''}`}
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.nome}>{cat.nome}</option>
              ))}
            </select>
            {errors.categoria && <span className="error-text">{errors.categoria}</span>}
          </div>

          <div className="form-group">
            <label>
              <i className="bi bi-image-fill"></i>
              Imagem do Bazar
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="form-control"
            />
            {formData.imagem && (
              <div className="image-preview">
                <img src={formData.imagem} alt="Preview" />
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3>
            <i className="bi bi-geo-alt-fill"></i>
            Endereço
          </h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>CEP *</label>
              <input
                type="text"
                name="cep"
                value={formData.cep}
                onChange={handleCepChange}
                className={`form-control ${errors.cep ? 'error' : ''}`}
                placeholder="00000-000"
                maxLength="9"
              />
              {errors.cep && <span className="error-text">{errors.cep}</span>}
            </div>

            <div className="form-group">
              <label>Número *</label>
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                className={`form-control ${errors.numero ? 'error' : ''}`}
                placeholder="123"
              />
              {errors.numero && <span className="error-text">{errors.numero}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Rua *</label>
            <input
              type="text"
              name="rua"
              value={formData.rua}
              onChange={handleChange}
              className={`form-control ${errors.rua ? 'error' : ''}`}
              placeholder="Rua das Flores"
            />
            {errors.rua && <span className="error-text">{errors.rua}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Bairro *</label>
              <input
                type="text"
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
                className={`form-control ${errors.bairro ? 'error' : ''}`}
                placeholder="Centro"
              />
              {errors.bairro && <span className="error-text">{errors.bairro}</span>}
            </div>

            <div className="form-group">
              <label>Cidade *</label>
              <input
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                className={`form-control ${errors.cidade ? 'error' : ''}`}
                placeholder="São Paulo, SP"
              />
              {errors.cidade && <span className="error-text">{errors.cidade}</span>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>
            <i className="bi bi-telephone-fill"></i>
            Contato e Funcionamento
          </h3>
          
          <div className="form-group">
            <label>Telefone *</label>
            <input
              type="tel"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className={`form-control ${errors.telefone ? 'error' : ''}`}
              placeholder="(11) 99999-9999"
            />
            {errors.telefone && <span className="error-text">{errors.telefone}</span>}
          </div>

          <div className="form-group">
            <label>Horário de Funcionamento *</label>
            <input
              type="text"
              name="horario"
              value={formData.horario}
              onChange={handleChange}
              className={`form-control ${errors.horario ? 'error' : ''}`}
              placeholder="Seg-Sex: 9h-18h, Sáb: 9h-15h"
            />
            {errors.horario && <span className="error-text">{errors.horario}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
            <i className="bi bi-x-circle"></i>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <i className="bi bi-shield-check"></i>
            {loading ? 'Criando...' : 'Criar Bazar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBazar;