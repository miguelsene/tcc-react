# 🚀 FashionSpace API - CRUD em Java

API REST desenvolvida em Java com Spring Boot para gerenciar bazares do projeto FashionSpace.

## 📋 O que é este projeto?

Este é um **CRUD completo** (Create, Read, Update, Delete) que permite:
- ✅ Criar novos bazares
- ✅ Listar todos os bazares
- ✅ Buscar um bazar específico
- ✅ Atualizar informações de um bazar
- ✅ Deletar um bazar
- ✅ Filtrar bazares por categoria e busca
- ✅ Buscar bazares por cidade
- ✅ Ver estatísticas dos bazares

## 🛠️ Tecnologias Utilizadas

- **Java 17** - Linguagem de programação
- **Spring Boot 3.2.0** - Framework para criar a API
- **Spring Data JPA** - Para trabalhar com banco de dados
- **H2 Database** - Banco de dados em memória (fácil para estudar)
- **Maven** - Gerenciador de dependências
- **Lombok** - Para reduzir código repetitivo

## 📁 Estrutura do Projeto

```
java-crud/
├── src/
│   └── main/
│       ├── java/com/fashionspace/
│       │   ├── FashionSpaceApplication.java  # Classe principal
│       │   ├── config/
│       │   │   ├── CorsConfig.java           # Configuração CORS
│       │   │   └── DataInitializer.java      # Dados iniciais
│       │   ├── controller/
│       │   │   ├── BazarController.java      # Rotas da API
│       │   │   └── StatusController.java     # Status da API
│       │   ├── dto/
│       │   │   └── BazarDTO.java             # Objeto de transferência
│       │   ├── model/
│       │   │   └── Bazar.java                # Modelo/Entidade
│       │   ├── repository/
│       │   │   └── BazarRepository.java      # Acesso ao banco
│       │   └── service/
│       │       └── BazarService.java         # Lógica de negócio
│       └── resources/
│           └── application.properties        # Configurações
├── pom.xml                                   # Dependências Maven
└── README.md                                 # Este arquivo
```

## 🎯 Como Funciona?

### Camadas da Aplicação

1. **Controller** - Recebe as requisições HTTP (GET, POST, PUT, DELETE)
2. **Service** - Contém a lógica de negócio
3. **Repository** - Faz a comunicação com o banco de dados
4. **Model** - Representa a estrutura dos dados (tabela do banco)
5. **DTO** - Objeto usado para transferir dados entre frontend e backend

## 🚀 Como Executar

### Pré-requisitos

- Java 17 ou superior instalado
- Maven instalado (ou usar o Maven Wrapper incluído)

### Passo 1: Navegar até a pasta do projeto

```bash
cd c:\Users\rm95370\tcc-react\fashionspace\java-crud
```

### Passo 2: Compilar o projeto

```bash
mvn clean install
```

### Passo 3: Executar a aplicação

```bash
mvn spring-boot:run
```

Ou, se preferir usar o JAR compilado:

```bash
java -jar target/fashionspace-api-1.0.0.jar
```

### Passo 4: Acessar a API

A API estará disponível em: **http://localhost:8080**

## 📡 Rotas da API

### Status

- **GET** `/api/status` - Verificar se a API está funcionando
- **GET** `/api/info` - Informações sobre a API

### Bazares (CRUD)

#### 1. Listar todos os bazares
```
GET /api/bazares
```

**Filtros opcionais:**
- `?categoria=Vintage` - Filtrar por categoria
- `?busca=moda` - Buscar por nome ou descrição

**Exemplo:**
```
GET /api/bazares?categoria=Vintage&busca=moda
```

#### 2. Buscar um bazar específico
```
GET /api/bazares/{id}
```

**Exemplo:**
```
GET /api/bazares/1
```

#### 3. Criar um novo bazar
```
POST /api/bazares
Content-Type: application/json

{
  "nome": "Meu Bazar",
  "descricao": "Descrição do bazar",
  "imagem": "https://exemplo.com/imagem.jpg",
  "categoria": "Vintage",
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

#### 4. Atualizar um bazar
```
PUT /api/bazares/{id}
Content-Type: application/json

{
  "nome": "Bazar Atualizado",
  "descricao": "Nova descrição",
  ...
}
```

#### 5. Deletar um bazar
```
DELETE /api/bazares/{id}
```

### Outras Rotas

#### Buscar por cidade
```
GET /api/bazares/cidade/{cidade}
```

**Exemplo:**
```
GET /api/bazares/cidade/São Paulo
```

#### Estatísticas
```
GET /api/bazares/estatisticas
```

Retorna o total de bazares e quantidade por categoria.

## 🗄️ Banco de Dados

O projeto usa **H2 Database** (banco em memória), que é perfeito para desenvolvimento e estudos.

### Acessar o Console do H2

1. Com a aplicação rodando, acesse: **http://localhost:8080/h2-console**
2. Use as seguintes credenciais:
   - **JDBC URL:** `jdbc:h2:file:./data/fashionspace`
   - **Username:** `admin`
   - **Password:** `admin`

### Estrutura da Tabela

```sql
CREATE TABLE bazares (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  descricao VARCHAR(1000),
  imagem VARCHAR(500),
  categoria VARCHAR(100) NOT NULL,
  cep VARCHAR(20),
  rua VARCHAR(255),
  numero VARCHAR(20),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  telefone VARCHAR(20),
  horario VARCHAR(255),
  avaliacao DOUBLE DEFAULT 0.0,
  total_avaliacoes INTEGER DEFAULT 0,
  criado_em TIMESTAMP,
  atualizado_em TIMESTAMP
);
```

## 🧪 Testando a API

### Usando o navegador

Para testar rotas GET, basta acessar no navegador:
```
http://localhost:8080/api/status
http://localhost:8080/api/bazares
http://localhost:8080/api/bazares/1
```

### Usando curl (terminal)

**Listar bazares:**
```bash
curl http://localhost:8080/api/bazares
```

**Criar bazar:**
```bash
curl -X POST http://localhost:8080/api/bazares \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"Novo Bazar\",\"categoria\":\"Vintage\"}"
```

**Atualizar bazar:**
```bash
curl -X PUT http://localhost:8080/api/bazares/1 \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"Bazar Atualizado\",\"categoria\":\"Vintage\"}"
```

**Deletar bazar:**
```bash
curl -X DELETE http://localhost:8080/api/bazares/1
```

### Usando Postman ou Insomnia

1. Importe as rotas acima
2. Configure o método HTTP (GET, POST, PUT, DELETE)
3. Para POST e PUT, adicione o JSON no body
4. Envie a requisição

## 🔗 Integração com o Frontend React

Para conectar o frontend React com esta API, atualize o arquivo de serviço:

```javascript
// src/services/api.js
const API_URL = 'http://localhost:8080/api';

export async function listarBazares(filtros = {}) {
  let endpoint = '/bazares';
  const params = new URLSearchParams();

  if (filtros.categoria) {
    params.append('categoria', filtros.categoria);
  }

  if (filtros.busca) {
    params.append('busca', filtros.busca);
  }

  if (params.toString()) {
    endpoint += `?${params.toString()}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`);
  return response.json();
}

export async function criarBazar(dados) {
  const response = await fetch(`${API_URL}/bazares`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });
  return response.json();
}

// ... outras funções
```

## 📚 Conceitos Importantes

### O que é REST?

REST (Representational State Transfer) é um estilo de arquitetura para APIs que usa:
- **GET** - Para buscar dados
- **POST** - Para criar dados
- **PUT** - Para atualizar dados
- **DELETE** - Para deletar dados

### O que é CRUD?

CRUD são as 4 operações básicas de um sistema:
- **C**reate (Criar) - POST
- **R**ead (Ler) - GET
- **U**pdate (Atualizar) - PUT
- **D**elete (Deletar) - DELETE

### O que é Spring Boot?

Spring Boot é um framework Java que facilita a criação de aplicações. Ele:
- Configura tudo automaticamente
- Tem servidor web embutido
- Facilita trabalhar com banco de dados
- É muito usado no mercado de trabalho

## 🎓 Para Estudar Mais

1. **Java Básico** - Entenda classes, objetos, métodos
2. **Spring Boot** - Framework principal do projeto
3. **JPA/Hibernate** - Para trabalhar com banco de dados
4. **REST API** - Conceitos de APIs RESTful
5. **Maven** - Gerenciador de dependências

## 🐛 Problemas Comuns

### Erro: "Port 8080 already in use"

A porta 8080 já está sendo usada. Solução:
1. Pare outros programas usando a porta 8080
2. Ou mude a porta no `application.properties`:
   ```properties
   server.port=8081
   ```

### Erro: "Java version"

Certifique-se de ter Java 17 ou superior:
```bash
java -version
```

### Erro ao compilar

Limpe e recompile:
```bash
mvn clean install -U
```

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais (TCC).

## 👨‍💻 Autor

Desenvolvido por um estudante do 2º ano do Ensino Médio para o TCC.

---

**Dúvidas?** Consulte a documentação do Spring Boot: https://spring.io/projects/spring-boot
