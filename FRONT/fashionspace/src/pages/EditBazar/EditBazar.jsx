import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categorias } from '../../data/bazares';
import { bazarService } from '../../services/api';
import './EditBazar.css';

const EditBazar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    imagem: '',
    fotoPerfil: '',
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
  const [bazarFound, setBazarFound] = useState(false);

  useEffect(() => {
    const loadBazar = async () => {
      try {
        // Tentar buscar da API primeiro
        const response = await fetch(`http://localhost:8080/api/bazar/${id}`);
        if (response.ok) {
          const bazar = await response.json();
          setFormData({
            nome: bazar.nome,
            descricao: bazar.descricao,
            imagem: bazar.imagem,
            fotoPerfil: bazar.fotoPerfil || '',
            categoria: bazar.categoria,
            cep: bazar.endereco?.cep || '',
            rua: bazar.endereco?.rua || '',
            numero: bazar.endereco?.numero || '',
            bairro: bazar.endereco?.bairro || '',
            cidade: bazar.endereco?.cidade || '',
            telefone: bazar.telefone,
            horario: bazar.horario
          });
          setBazarFound(true);
          return;
        }
      } catch (error) {
        console.log('API não disponível, buscando no localStorage');
      }
      
      // Fallback para localStorage
      const bazares = JSON.parse(localStorage.getItem('fashionspace_bazares') || '[]');
      const bazar = bazares.find(b => String(b.id) === String(id));
      
      if (bazar) {
        setFormData({
          nome: bazar.nome,
          descricao: bazar.descricao,
          imagem: bazar.imagem,
          fotoPerfil: bazar.fotoPerfil || '',
          categoria: bazar.categoria,
          cep: bazar.endereco?.cep || '',
          rua: bazar.endereco?.rua || '',
          numero: bazar.endereco?.numero || '',
          bairro: bazar.endereco?.bairro || '',
          cidade: bazar.endereco?.cidade || '',
          telefone: bazar.telefone,
          horario: bazar.horario
        });
        setBazarFound(true);
      } else {
        setBazarFound(false);
      }
    };
    
    loadBazar();
  }, [id]);

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

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, fotoPerfil: e.target.result });
      };
      reader.readAsDataURL(file);
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
      const updatedBazar = {
        nome: formData.nome,
        descricao: formData.descricao,
        imagem: formData.imagem,
        fotoPerfil: formData.fotoPerfil,
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

      // Tentar atualizar na API primeiro
      try {
        const response = await fetch(`http://localhost:8080/api/bazar/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedBazar)
        });
        
        if (response.ok) {
          alert('Bazar atualizado com sucesso!');
          window.dispatchEvent(new Event('bazaresUpdated'));
          navigate(`/bazar-detalhes/${id}`);
          return;
        }
      } catch (apiError) {
        console.log('API não disponível, salvando no localStorage');
      }
      
      // Fallback para localStorage
      const bazares = JSON.parse(localStorage.getItem('fashionspace_bazares') || '[]');
      const bazarIndex = bazares.findIndex(b => String(b.id) === String(id));

      if (bazarIndex !== -1) {
        bazares[bazarIndex] = {
          ...bazares[bazarIndex],
          ...updatedBazar,
          dataAtualizacao: new Date().toISOString()
        };

        localStorage.setItem('fashionspace_bazares', JSON.stringify(bazares));
        window.dispatchEvent(new Event('bazaresUpdated'));
        alert('Bazar atualizado com sucesso!');
        navigate(`/bazar-detalhes/${id}`);
      }

    } catch (error) {
      console.error('Erro ao atualizar bazar:', error);
      alert('Erro ao atualizar bazar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!bazarFound) {
    return (
      <div className="edit-bazar">
        <div className="error-container">
          <i className="bi bi-exclamation-triangle error-icon"></i>
          <h2>Bazar não encontrado</h2>
          <p>O bazar que você está tentando editar não existe ou foi removido.</p>
          <button className="btn btn-primary" onClick={() => navigate('/perfil')}>
            <i className="bi bi-person-fill"></i>
            Voltar ao Perfil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-bazar">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i>
          Voltar
        </button>
        <h1>Editar Bazar</h1>
        <p>Atualize as informações do seu bazar</p>
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

          <div className="form-group">
            <label>
              <i className="bi bi-person-badge-fill"></i>
              Foto de Perfil do Bazar (avatar)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileImageUpload}
              className="form-control"
            />
            {formData.fotoPerfil && (
              <div className="image-preview" style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden' }}>
                <img src={formData.fotoPerfil} alt="Avatar do Bazar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                onChange={handleChange}
                className={`form-control ${errors.cep ? 'error' : ''}`}
                placeholder="00000-000"
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
            <i className="bi bi-check-circle-fill"></i>
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBazar;