# 📚 Entendendo o CRUD - Guia para Estudantes

Este documento explica de forma simples o que é CRUD e como funciona neste projeto.

## 🤔 O que é CRUD?

CRUD é uma sigla que representa as 4 operações básicas que fazemos com dados:

- **C**reate (Criar) - Adicionar novos dados
- **R**ead (Ler) - Buscar/visualizar dados
- **U**pdate (Atualizar) - Modificar dados existentes
- **D**elete (Deletar) - Remover dados

### Exemplo do Dia a Dia

Pense em uma agenda de contatos no celular:

- **Create:** Adicionar um novo contato
- **Read:** Ver a lista de contatos ou abrir um contato específico
- **Update:** Editar o telefone de um contato
- **Delete:** Apagar um contato

## 🏗️ Como Funciona no Projeto?

### 1. CREATE (Criar Bazar)

**O que faz:** Adiciona um novo bazar no banco de dados.

**Rota da API:**
```
POST /api/bazares
```

**Exemplo de dados enviados:**
```json
{
  "nome": "Bazar Novo",
  "categoria": "Vintage",
  "descricao": "Um bazar incrível",
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

**O que acontece:**
1. O Controller recebe os dados
2. O Service valida se está tudo correto
3. O Repository salva no banco de dados
4. Retorna o bazar criado com um ID

**Código Java (Service):**
```java
public BazarDTO criar(BazarDTO bazarDTO) {
    // Validar dados
    if (bazarDTO.getNome() == null) {
        throw new RuntimeException("Nome é obrigatório");
    }
    
    // Converter DTO para entidade
    Bazar bazar = bazarDTO.toEntity();
    
    // Salvar no banco
    Bazar bazarSalvo = bazarRepository.save(bazar);
    
    // Retornar DTO
    return BazarDTO.fromEntity(bazarSalvo);
}
```

---

### 2. READ (Ler/Buscar Bazares)

**O que faz:** Busca bazares no banco de dados.

#### 2.1. Listar Todos

**Rota da API:**
```
GET /api/bazares
```

**O que acontece:**
1. O Controller recebe a requisição
2. O Service busca todos os bazares
3. O Repository consulta o banco de dados
4. Retorna a lista de bazares

**Código Java (Service):**
```java
public List<BazarDTO> listarTodos() {
    return bazarRepository.findAll()
            .stream()
            .map(BazarDTO::fromEntity)
            .collect(Collectors.toList());
}
```

#### 2.2. Buscar por ID

**Rota da API:**
```
GET /api/bazares/1
```

**O que acontece:**
1. Busca o bazar com ID = 1
2. Se encontrar, retorna o bazar
3. Se não encontrar, retorna erro 404

**Código Java (Service):**
```java
public BazarDTO buscarPorId(Long id) {
    Bazar bazar = bazarRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Bazar não encontrado"));
    return BazarDTO.fromEntity(bazar);
}
```

#### 2.3. Buscar com Filtros

**Rota da API:**
```
GET /api/bazares?categoria=Vintage&busca=moda
```

**O que acontece:**
1. Recebe os filtros (categoria e busca)
2. Monta a consulta no banco de dados
3. Retorna apenas os bazares que atendem aos filtros

---

### 3. UPDATE (Atualizar Bazar)

**O que faz:** Modifica um bazar existente.

**Rota da API:**
```
PUT /api/bazares/1
```

**Exemplo de dados enviados:**
```json
{
  "nome": "Bazar Atualizado",
  "categoria": "Vintage",
  "descricao": "Nova descrição",
  ...
}
```

**O que acontece:**
1. Busca o bazar com ID = 1
2. Se não existir, retorna erro 404
3. Se existir, atualiza os dados
4. Salva as alterações no banco
5. Retorna o bazar atualizado

**Código Java (Service):**
```java
public BazarDTO atualizar(Long id, BazarDTO bazarDTO) {
    // Buscar bazar existente
    Bazar bazarExistente = bazarRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Bazar não encontrado"));
    
    // Atualizar dados
    bazarExistente.setNome(bazarDTO.getNome());
    bazarExistente.setDescricao(bazarDTO.getDescricao());
    // ... outros campos
    
    // Salvar alterações
    Bazar bazarAtualizado = bazarRepository.save(bazarExistente);
    
    return BazarDTO.fromEntity(bazarAtualizado);
}
```

---

### 4. DELETE (Deletar Bazar)

**O que faz:** Remove um bazar do banco de dados.

**Rota da API:**
```
DELETE /api/bazares/1
```

**O que acontece:**
1. Busca o bazar com ID = 1
2. Se não existir, retorna erro 404
3. Se existir, deleta do banco de dados
4. Retorna mensagem de sucesso

**Código Java (Service):**
```java
public void deletar(Long id) {
    // Buscar bazar
    Bazar bazar = bazarRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Bazar não encontrado"));
    
    // Deletar
    bazarRepository.delete(bazar);
}
```

---

## 🎯 Fluxo Completo de uma Requisição

Vamos ver o que acontece quando você faz uma requisição:

```
Frontend (React)
    ↓
    | fetch('http://localhost:8080/api/bazares')
    ↓
Controller (BazarController.java)
    ↓
    | @GetMapping - Recebe a requisiç��o
    ↓
Service (BazarService.java)
    ↓
    | Lógica de negócio e validações
    ↓
Repository (BazarRepository.java)
    ↓
    | Consulta o banco de dados
    ↓
Banco de Dados (H2)
    ↓
    | Retorna os dados
    ↓
Repository → Service → Controller → Frontend
```

## 📊 Camadas da Aplicação

### 1. Controller (Controlador)
- **Responsabilidade:** Receber requisições HTTP
- **Arquivo:** `BazarController.java`
- **Exemplo:**
```java
@GetMapping("/api/bazares")
public ResponseEntity<List<BazarDTO>> listarBazares() {
    List<BazarDTO> bazares = bazarService.listarTodos();
    return ResponseEntity.ok(bazares);
}
```

### 2. Service (Serviço)
- **Responsabilidade:** Lógica de negócio e validações
- **Arquivo:** `BazarService.java`
- **Exemplo:**
```java
public BazarDTO criar(BazarDTO bazarDTO) {
    // Validar
    if (bazarDTO.getNome() == null) {
        throw new RuntimeException("Nome obrigatório");
    }
    // Salvar
    return bazarRepository.save(bazar);
}
```

### 3. Repository (Repositório)
- **Responsabilidade:** Comunicação com o banco de dados
- **Arquivo:** `BazarRepository.java`
- **Exemplo:**
```java
public interface BazarRepository extends JpaRepository<Bazar, Long> {
    List<Bazar> findByCategoria(String categoria);
}
```

### 4. Model (Modelo)
- **Responsabilidade:** Representar a estrutura dos dados
- **Arquivo:** `Bazar.java`
- **Exemplo:**
```java
@Entity
public class Bazar {
    @Id
    private Long id;
    private String nome;
    private String categoria;
    // ... outros campos
}
```

### 5. DTO (Data Transfer Object)
- **Responsabilidade:** Transferir dados entre camadas
- **Arquivo:** `BazarDTO.java`
- **Por que usar?** Para não expor a entidade diretamente

## 🔄 Métodos HTTP

| Método | Ação | Exemplo |
|--------|------|---------|
| GET | Buscar dados | `GET /api/bazares` |
| POST | Criar dados | `POST /api/bazares` |
| PUT | Atualizar dados | `PUT /api/bazares/1` |
| DELETE | Deletar dados | `DELETE /api/bazares/1` |

## 💾 Banco de Dados

### Tabela: bazares

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | BIGINT | Identificador único (chave primária) |
| nome | VARCHAR | Nome do bazar |
| descricao | VARCHAR | Descrição do bazar |
| categoria | VARCHAR | Categoria (Vintage, Outlet, etc) |
| cep | VARCHAR | CEP do endereço |
| rua | VARCHAR | Nome da rua |
| numero | VARCHAR | Número do endereço |
| bairro | VARCHAR | Bairro |
| cidade | VARCHAR | Cidade e estado |
| telefone | VARCHAR | Telefone de contato |
| horario | VARCHAR | Horário de funcionamento |
| avaliacao | DOUBLE | Nota média (0-5) |
| total_avaliacoes | INTEGER | Quantidade de avaliações |
| criado_em | TIMESTAMP | Data de criação |
| atualizado_em | TIMESTAMP | Data da última atualização |

## 🧪 Testando o CRUD

### 1. Criar um Bazar (CREATE)

**Usando curl:**
```bash
curl -X POST http://localhost:8080/api/bazares \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"Teste\",\"categoria\":\"Vintage\"}"
```

**Usando JavaScript:**
```javascript
fetch('http://localhost:8080/api/bazares', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nome: 'Teste',
    categoria: 'Vintage'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### 2. Listar Bazares (READ)

**No navegador:**
```
http://localhost:8080/api/bazares
```

**Usando JavaScript:**
```javascript
fetch('http://localhost:8080/api/bazares')
  .then(res => res.json())
  .then(data => console.log(data));
```

### 3. Atualizar Bazar (UPDATE)

**Usando curl:**
```bash
curl -X PUT http://localhost:8080/api/bazares/1 \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"Atualizado\",\"categoria\":\"Vintage\"}"
```

### 4. Deletar Bazar (DELETE)

**Usando curl:**
```bash
curl -X DELETE http://localhost:8080/api/bazares/1
```

## 📝 Resumo

1. **CRUD** = Create, Read, Update, Delete
2. **Controller** recebe as requisições HTTP
3. **Service** contém a lógica de negócio
4. **Repository** acessa o banco de dados
5. **Model** representa a estrutura dos dados
6. **DTO** transfere dados entre camadas

## 🎓 Para Aprender Mais

1. **HTTP Methods:** GET, POST, PUT, DELETE
2. **REST API:** Padrão de arquitetura para APIs
3. **JSON:** Formato de dados usado na comunicação
4. **JPA/Hibernate:** Framework para trabalhar com banco de dados
5. **Spring Boot:** Framework Java para criar aplicações

## 💡 Dicas

- Sempre valide os dados antes de salvar
- Use mensagens de erro claras
- Teste cada operação separadamente
- Mantenha o código organizado em camadas
- Documente seu código com comentários

---

**Agora você entende como funciona um CRUD! 🎉**
