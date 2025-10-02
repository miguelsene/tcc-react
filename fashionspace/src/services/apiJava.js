// Serviço de API para comunicação com o backend Java
// Todas as funções para fazer requisições HTTP

const API_URL = 'http://localhost:8080/api';

// Função auxiliar para fazer requisições
async function fazerRequisicao(endpoint, opcoes = {}) {
  try {
    const resposta = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...opcoes.headers,
      },
      ...opcoes,
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(dados.erro || 'Erro na requisição');
    }

    return dados;
  } catch (erro) {
    console.error('Erro na API:', erro);
    throw erro;
  }
}

// ==================== FUNÇÕES DO CRUD ====================

// 1. Listar todos os bazares
export async function listarBazares(filtros = {}) {
  let endpoint = '/bazares';
  const params = new URLSearchParams();

  if (filtros.categoria && filtros.categoria !== 'Todos') {
    params.append('categoria', filtros.categoria);
  }

  if (filtros.busca) {
    params.append('busca', filtros.busca);
  }

  if (params.toString()) {
    endpoint += `?${params.toString()}`;
  }

  return fazerRequisicao(endpoint);
}

// 2. Buscar um bazar específico por ID
export async function buscarBazar(id) {
  return fazerRequisicao(`/bazares/${id}`);
}

// 3. Criar um novo bazar
export async function criarBazar(dadosBazar) {
  const resposta = await fazerRequisicao('/bazares', {
    method: 'POST',
    body: JSON.stringify(dadosBazar),
  });
  
  // A API Java retorna { mensagem, id, bazar }
  return resposta.bazar || resposta;
}

// 4. Atualizar um bazar existente
export async function atualizarBazar(id, dadosBazar) {
  const resposta = await fazerRequisicao(`/bazares/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dadosBazar),
  });
  
  // A API Java retorna { mensagem, bazar }
  return resposta.bazar || resposta;
}

// 5. Deletar um bazar
export async function deletarBazar(id) {
  return fazerRequisicao(`/bazares/${id}`, {
    method: 'DELETE',
  });
}

// 6. Buscar bazares por cidade
export async function buscarPorCidade(cidade) {
  return fazerRequisicao(`/bazares/cidade/${cidade}`);
}

// 7. Obter estatísticas
export async function obterEstatisticas() {
  return fazerRequisicao('/bazares/estatisticas');
}

// 8. Verificar status da API
export async function verificarStatus() {
  return fazerRequisicao('/status');
}

// 9. Obter informações da API
export async function obterInfo() {
  return fazerRequisicao('/info');
}

// Exportar URL base para uso em outros lugares
export { API_URL };
