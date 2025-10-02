# 💻 Exemplos Práticos de Uso da API

Este documento contém exemplos práticos de como usar a API FashionSpace.

## 📋 Índice

1. [Testando no Navegador](#testando-no-navegador)
2. [Usando JavaScript/React](#usando-javascriptreact)
3. [Usando curl (Terminal)](#usando-curl-terminal)
4. [Usando Postman](#usando-postman)
5. [Exemplos Completos](#exemplos-completos)

---

## 🌐 Testando no Navegador

### 1. Verificar Status da API

Abra no navegador:
```
http://localhost:8080/api/status
```

**Resposta esperada:**
```json
{
  "status": "online",
  "mensagem": "API FashionSpace funcionando!",
  "versao": "1.0.0",
  "timestamp": "2024-01-15T10:30:00"
}
```

### 2. Listar Todos os Bazares

```
http://localhost:8080/api/bazares
```

### 3. Buscar Bazar por ID

```
http://localhost:8080/api/bazares/1
```

### 4. Filtrar por Categoria

```
http://localhost:8080/api/bazares?categoria=Vintage
```

### 5. Buscar por Nome

```
http://localhost:8080/api/bazares?busca=moda
```

### 6. Filtrar por Categoria e Busca

```
http://localhost:8080/api/bazares?categoria=Vintage&busca=moda
```

### 7. Ver Estatísticas

```
http://localhost:8080/api/bazares/estatisticas
```

---

## ⚛️ Usando JavaScript/React

### Configuração Inicial

Crie ou use o arquivo `src/services/apiJava.js`:

```javascript
const API_URL = 'http://localhost:8080/api';

async function fazerRequisicao(endpoint, opcoes = {}) {
  const resposta = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...opcoes.headers,
    },
    ...opcoes,
  });

  if (!resposta.ok) {
    const erro = await resposta.json();
    throw new Error(erro.erro || 'Erro na requisição');
  }

  return resposta.json();
}
```

### Exemplo 1: Listar Bazares

```javascript
import { listarBazares } from './services/apiJava';

function MeuComponente() {
  const [bazares, setBazares] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await listarBazares();
        setBazares(dados);
      } catch (erro) {
        console.error('Erro ao carregar:', erro);
        alert('Erro ao carregar bazares');
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  if (carregando) return <p>Carregando...</p>;

  return (
    <div>
      {bazares.map(bazar => (
        <div key={bazar.id}>
          <h3>{bazar.nome}</h3>
          <p>{bazar.descricao}</p>
        </div>
      ))}
    </div>
  );
}
```

### Exemplo 2: Criar Bazar

```javascript
import { criarBazar } from './services/apiJava';

function FormularioBazar() {
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('Vintage');

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const novoBazar = await criarBazar({
        nome: nome,
        categoria: categoria,
        descricao: 'Descrição do bazar',
        endereco: {
          cep: '01310-100',
          rua: 'Rua Augusta',
          numero: '1234',
          bairro: 'Consolação',
          cidade: 'São Paulo, SP'
        },
        telefone: '(11) 99999-9999',
        horario: 'Seg-Sex: 9h-18h'
      });

      alert('Bazar criado com sucesso!');
      console.log('Novo bazar:', novoBazar);
    } catch (erro) {
      console.error('Erro:', erro);
      alert('Erro ao criar bazar: ' + erro.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome do bazar"
        required
      />
      <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
        <option value="Vintage">Vintage</option>
        <option value="Outlet">Outlet</option>
        <option value="Artesanal">Artesanal</option>
      </select>
      <button type="submit">Criar Bazar</button>
    </form>
  );
}
```

### Exemplo 3: Atualizar Bazar

```javascript
import { atualizarBazar } from './services/apiJava';

async function atualizarNome(id, novoNome) {
  try {
    const bazarAtualizado = await atualizarBazar(id, {
      nome: novoNome,
      categoria: 'Vintage', // Categoria é obrigatória
      // ... outros campos
    });

    alert('Bazar atualizado com sucesso!');
    return bazarAtualizado;
  } catch (erro) {
    console.error('Erro:', erro);
    alert('Erro ao atualizar: ' + erro.message);
  }
}

// Uso
atualizarNome(1, 'Novo Nome do Bazar');
```

### Exemplo 4: Deletar Bazar

```javascript
import { deletarBazar } from './services/apiJava';

async function removerBazar(id) {
  if (!confirm('Tem certeza que deseja deletar este bazar?')) {
    return;
  }

  try {
    await deletarBazar(id);
    alert('Bazar deletado com sucesso!');
    // Recarregar lista de bazares
  } catch (erro) {
    console.error('Erro:', erro);
    alert('Erro ao deletar: ' + erro.message);
  }
}

// Uso
removerBazar(1);
```

### Exemplo 5: Buscar com Filtros

```javascript
import { listarBazares } from './services/apiJava';

function BuscarBazares() {
  const [categoria, setCategoria] = useState('Todos');
  const [busca, setBusca] = useState('');
  const [bazares, setBazares] = useState([]);

  async function buscar() {
    try {
      const filtros = {};
      
      if (categoria !== 'Todos') {
        filtros.categoria = categoria;
      }
      
      if (busca) {
        filtros.busca = busca;
      }

      const dados = await listarBazares(filtros);
      setBazares(dados);
    } catch (erro) {
      console.error('Erro:', erro);
    }
  }

  return (
    <div>
      <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
        <option value="Todos">Todos</option>
        <option value="Vintage">Vintage</option>
        <option value="Outlet">Outlet</option>
      </select>

      <input
        type="text"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar..."
      />

      <button onClick={buscar}>Buscar</button>

      <div>
        {bazares.map(bazar => (
          <div key={bazar.id}>{bazar.nome}</div>
        ))}
      </div>
    </div>
  );
}
```

---

## 🖥️ Usando curl (Terminal)

### 1. Listar Bazares

```bash
curl http://localhost:8080/api/bazares
```

### 2. Buscar por ID

```bash
curl http://localhost:8080/api/bazares/1
```

### 3. Criar Bazar

```bash
curl -X POST http://localhost:8080/api/bazares \
  -H "Content-Type: application/json" \
  -d "{
    \"nome\": \"Meu Bazar\",
    \"categoria\": \"Vintage\",
    \"descricao\": \"Um bazar incrível\",
    \"endereco\": {
      \"cep\": \"01310-100\",
      \"rua\": \"Rua Augusta\",
      \"numero\": \"1234\",
      \"bairro\": \"Consolação\",
      \"cidade\": \"São Paulo, SP\"
    },
    \"telefone\": \"(11) 99999-9999\",
    \"horario\": \"Seg-Sex: 9h-18h\"
  }"
```

### 4. Atualizar Bazar

```bash
curl -X PUT http://localhost:8080/api/bazares/1 \
  -H "Content-Type: application/json" \
  -d "{
    \"nome\": \"Bazar Atualizado\",
    \"categoria\": \"Vintage\",
    \"descricao\": \"Nova descrição\"
  }"
```

### 5. Deletar Bazar

```bash
curl -X DELETE http://localhost:8080/api/bazares/1
```

### 6. Filtrar por Categoria

```bash
curl "http://localhost:8080/api/bazares?categoria=Vintage"
```

### 7. Buscar por Nome

```bash
curl "http://localhost:8080/api/bazares?busca=moda"
```

---

## 📮 Usando Postman

### Configuração

1. Abra o Postman
2. Crie uma nova Collection chamada "FashionSpace API"
3. Configure a URL base: `http://localhost:8080/api`

### Request 1: Listar Bazares

- **Método:** GET
- **URL:** `http://localhost:8080/api/bazares`
- **Headers:** Nenhum necessário
- Clique em "Send"

### Request 2: Criar Bazar

- **Método:** POST
- **URL:** `http://localhost:8080/api/bazares`
- **Headers:**
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "nome": "Bazar Teste",
  "categoria": "Vintage",
  "descricao": "Descrição do bazar",
  "endereco": {
    "cep": "01310-100",
    "rua": "Rua Augusta",
    "numero": "1234",
    "bairro": "Consolação",
    "cidade": "São Paulo, SP"
  },
  "telefone": "(11) 99999-9999",
  "horario": "Seg-Sex: 9h-18h"
}
```
- Clique em "Send"

### Request 3: Atualizar Bazar

- **Método:** PUT
- **URL:** `http://localhost:8080/api/bazares/1`
- **Headers:**
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "nome": "Bazar Atualizado",
  "categoria": "Vintage",
  "descricao": "Nova descrição"
}
```

### Request 4: Deletar Bazar

- **Método:** DELETE
- **URL:** `http://localhost:8080/api/bazares/1`
- **Headers:** Nenhum necessário

---

## 🎯 Exemplos Completos

### Exemplo Completo: Sistema de Gerenciamento

```javascript
// services/bazarService.js
import * as api from './apiJava';

class BazarService {
  // Listar todos
  async listarTodos() {
    try {
      return await api.listarBazares();
    } catch (erro) {
      console.error('Erro ao listar:', erro);
      throw erro;
    }
  }

  // Buscar por ID
  async buscarPorId(id) {
    try {
      return await api.buscarBazar(id);
    } catch (erro) {
      console.error('Erro ao buscar:', erro);
      throw erro;
    }
  }

  // Criar
  async criar(dados) {
    try {
      // Validar dados
      if (!dados.nome || !dados.categoria) {
        throw new Error('Nome e categoria são obrigatórios');
      }

      return await api.criarBazar(dados);
    } catch (erro) {
      console.error('Erro ao criar:', erro);
      throw erro;
    }
  }

  // Atualizar
  async atualizar(id, dados) {
    try {
      return await api.atualizarBazar(id, dados);
    } catch (erro) {
      console.error('Erro ao atualizar:', erro);
      throw erro;
    }
  }

  // Deletar
  async deletar(id) {
    try {
      return await api.deletarBazar(id);
    } catch (erro) {
      console.error('Erro ao deletar:', erro);
      throw erro;
    }
  }

  // Buscar com filtros
  async buscarComFiltros(categoria, busca) {
    try {
      const filtros = {};
      if (categoria && categoria !== 'Todos') {
        filtros.categoria = categoria;
      }
      if (busca) {
        filtros.busca = busca;
      }
      return await api.listarBazares(filtros);
    } catch (erro) {
      console.error('Erro ao buscar:', erro);
      throw erro;
    }
  }
}

export default new BazarService();
```

### Exemplo Completo: Componente React

```javascript
// components/GerenciarBazares.jsx
import React, { useState, useEffect } from 'react';
import bazarService from '../services/bazarService';

function GerenciarBazares() {
  const [bazares, setBazares] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Carregar bazares
  useEffect(() => {
    carregarBazares();
  }, []);

  async function carregarBazares() {
    try {
      setCarregando(true);
      const dados = await bazarService.listarTodos();
      setBazares(dados);
      setErro(null);
    } catch (erro) {
      setErro('Erro ao carregar bazares');
      console.error(erro);
    } finally {
      setCarregando(false);
    }
  }

  async function handleDeletar(id) {
    if (!confirm('Tem certeza?')) return;

    try {
      await bazarService.deletar(id);
      alert('Bazar deletado!');
      carregarBazares(); // Recarregar lista
    } catch (erro) {
      alert('Erro ao deletar');
    }
  }

  if (carregando) return <div>Carregando...</div>;
  if (erro) return <div>Erro: {erro}</div>;

  return (
    <div>
      <h1>Gerenciar Bazares</h1>
      
      <button onClick={carregarBazares}>
        Atualizar Lista
      </button>

      <div>
        {bazares.map(bazar => (
          <div key={bazar.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
            <h3>{bazar.nome}</h3>
            <p>{bazar.categoria}</p>
            <p>{bazar.descricao}</p>
            <button onClick={() => handleDeletar(bazar.id)}>
              Deletar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GerenciarBazares;
```

---

## 🎓 Dicas Importantes

1. **Sempre trate erros** - Use try/catch
2. **Valide dados** - Antes de enviar para a API
3. **Dê feedback ao usuário** - Loading, sucesso, erro
4. **Teste cada operação** - Antes de integrar
5. **Use console.log** - Para debugar

---

**Agora você tem todos os exemplos para usar a API! 🚀**
