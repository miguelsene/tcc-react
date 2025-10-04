// Configuração da API
const API_BASE_URL = 'http://localhost:8080/api/v1';

// Serviço para Bazares
export const bazarService = {
  // Listar todos os bazares
  listarTodos: async () => {
    const response = await fetch(`${API_BASE_URL}/bazar`);
    if (!response.ok) throw new Error('Erro ao buscar bazares');
    return response.json();
  },

  // Buscar bazar por ID
  buscarPorId: async (id) => {
    const response = await fetch(`${API_BASE_URL}/bazar/${id}`);
    if (!response.ok) throw new Error('Bazar não encontrado');
    return response.json();
  },

  // Criar novo bazar
  criar: async (bazar) => {
    const response = await fetch(`${API_BASE_URL}/bazar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bazar)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao criar bazar');
    }
    return response.json();
  },

  // Buscar por categoria
  buscarPorCategoria: async (categoria) => {
    const response = await fetch(`${API_BASE_URL}/bazar/categoria/${categoria}`);
    if (!response.ok) throw new Error('Erro ao buscar bazares por categoria');
    return response.json();
  },

  // Buscar bazares por usuário
  buscarPorUsuario: async (usuarioId) => {
    const response = await fetch(`${API_BASE_URL}/bazar/usuario/${usuarioId}`);
    if (!response.ok) throw new Error('Erro ao buscar bazares do usuário');
    return response.json();
  },

  // Deletar bazar
  deletar: async (id) => {
    const response = await fetch(`${API_BASE_URL}/bazar/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao deletar bazar');
    }
    return response.json();
  }
};

// Função para converter bazar do backend para frontend
export const formatarBazarParaFrontend = (bazar) => ({
  id: bazar.id.toString(),
  nome: bazar.nome,
  descricao: bazar.descricao,
  imagem: bazar.imagem,
  categoria: bazar.categoria,
  endereco: {
    cep: bazar.cep,
    rua: bazar.rua,
    numero: bazar.numero,
    bairro: bazar.bairro,
    cidade: bazar.cidade
  },
  telefone: bazar.telefone,
  horario: bazar.horario,
  avaliacao: bazar.avaliacao,
  totalAvaliacoes: bazar.totalAvaliacoes
});

// Função para converter bazar do frontend para backend
export const formatarBazarParaBackend = (bazar, usuarioId) => ({
  nome: bazar.nome,
  descricao: bazar.descricao,
  imagem: bazar.imagem,
  categoria: bazar.categoria,
  cep: bazar.endereco?.cep,
  rua: bazar.endereco?.rua,
  numero: bazar.endereco?.numero,
  bairro: bazar.endereco?.bairro,
  cidade: bazar.endereco?.cidade,
  telefone: bazar.telefone,
  horario: bazar.horario,
  usuarioId: usuarioId
});