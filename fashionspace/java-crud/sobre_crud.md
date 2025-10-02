# 🎓 CRUD FashionSpace - Projeto TCC

## 📌 Sobre o Projeto

Este é um **CRUD completo em Java** desenvolvido para o projeto FashionSpace como parte do TCC (Trabalho de Conclusão de Curso) de um estudante do 2º ano do Ensino Médio.

O projeto consiste em uma **API REST** que permite gerenciar bazares de moda, com todas as operações básicas de um sistema: criar, listar, atualizar e deletar.

## 🎯 Objetivos

- ✅ Criar uma API REST funcional em Java
- ✅ Implementar todas as operações CRUD
- ✅ Usar boas práticas de programação
- ✅ Facilitar a integração com o frontend React
- ✅ Ser simples e didático para estudantes

## 🛠️ Tecnologias

- **Java 17** - Linguagem de programação
- **Spring Boot 3.2.0** - Framework para criar APIs
- **Spring Data JPA** - Para trabalhar com banco de dados
- **H2 Database** - Banco de dados em memória
- **Maven** - Gerenciador de dependências
- **Lombok** - Para reduzir código repetitivo

## 📂 Estrutura do Projeto

```
java-crud/
├── src/main/java/com/fashionspace/
│   ├── FashionSpaceApplication.java    # Classe principal
│   ├── config/                         # Configurações
│   │   ├── CorsConfig.java            # CORS para frontend
│   │   └── DataInitializer.java       # Dados iniciais
│   ├── controller/                     # Rotas da API
│   │   ├── BazarController.java       # CRUD de bazares
│   │   └── StatusController.java      # Status da API
│   ├── dto/                           # Objetos de transferência
│   │   └── BazarDTO.java              # DTO do bazar
│   ├── model/                         # Modelos/Entidades
│   │   └── Bazar.java                 # Entidade Bazar
│   ├── repository/                    # Acesso ao banco
│   │   └── BazarRepository.java       # Repository do bazar
│   └── service/                       # Lógica de negócio
│       └── BazarService.java          # Service do bazar
├── src/main/resources/
│   └── application.properties         # Configurações da aplicação
├── pom.xml                            # Dependências Maven
├── README.md                          # Documentação principal
├── GUIA_INSTALACAO.md                 # Guia de instalação
├── ENTENDENDO_CRUD.md                 # Explicação didática
├─�� executar.bat                       # Script para executar
└── compilar.bat                       # Script para compilar
```

## 🚀 Como Usar

### 1. Instalação Rápida

```bash
# Navegar até a pasta
cd C:\Users\rm95370\tcc-react\fashionspace\java-crud

# Compilar
mvn clean install

# Executar
mvn spring-boot:run
```

Ou simplesmente execute o arquivo `executar.bat`

### 2. Acessar a API

A API estará disponível em: **http://localhost:8080**

### 3. Testar

Abra no navegador:
```
http://localhost:8080/api/status
```

## 📡 Rotas Disponíveis

### Operações CRUD

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/bazares` | Listar todos os bazares |
| GET | `/api/bazares/{id}` | Buscar um bazar específico |
| POST | `/api/bazares` | Criar novo bazar |
| PUT | `/api/bazares/{id}` | Atualizar bazar |
| DELETE | `/api/bazares/{id}` | Deletar bazar |

### Rotas Extras

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/status` | Status da API |
| GET | `/api/info` | Informações da API |
| GET | `/api/bazares/cidade/{cidade}` | Buscar por cidade |
| GET | `/api/bazares/estatisticas` | Estatísticas |

## 💡 Funcionalidades

### ✅ CREATE (Criar)
- Adicionar novos bazares
- Validação de dados obrigatórios
- Geração autom��tica de ID

### ✅ READ (Ler)
- Listar todos os bazares
- Buscar por ID
- Filtrar por categoria
- Buscar por nome/descrição
- Buscar por cidade
- Ver estatísticas

### ✅ UPDATE (Atualizar)
- Modificar dados de um bazar
- Validação de existência
- Atualização de timestamp

### ✅ DELETE (Deletar)
- Remover bazares
- Validação de existência
- Confirmação de exclusão

## 🔗 Integração com Frontend

### Arquivo de Serviço

Use o arquivo `src/services/apiJava.js` no frontend:

```javascript
import { listarBazares, criarBazar, atualizarBazar, deletarBazar } from './services/apiJava';

// Listar
const bazares = await listarBazares();

// Criar
const novoBazar = await criarBazar({
  nome: 'Meu Bazar',
  categoria: 'Vintage',
  // ... outros dados
});

// Atualizar
await atualizarBazar(1, { nome: 'Novo Nome' });

// Deletar
await deletarBazar(1);
```

## 📚 Documentação

- **README.md** - Documentação completa da API
- **GUIA_INSTALACAO.md** - Passo a passo para instalar
- **ENTENDENDO_CRUD.md** - Explicação didática do CRUD

## 🎓 Conceitos Aprendidos

1. **API REST** - Arquitetura de APIs modernas
2. **CRUD** - Operações básicas de sistemas
3. **Spring Boot** - Framework Java mais usado
4. **JPA/Hibernate** - ORM para banco de dados
5. **Arquitetura em Camadas** - Organização do código
6. **HTTP Methods** - GET, POST, PUT, DELETE
7. **JSON** - Formato de dados
8. **CORS** - Comunicação entre frontend e backend

## 🎯 Diferenciais do Projeto

- ✅ Código limpo e bem organizado
- ✅ Comentários explicativos em português
- ✅ Documentação completa
- ✅ Scripts de execução prontos
- ✅ Dados de exemplo incluídos
- ✅ Fácil de entender e modificar
- ✅ Pronto para apresentação de TCC

## 🔧 Requisitos

- Java 17 ou superior
- Maven 3.6 ou superior
- Navegador web (para testar)
- Editor de código (opcional)

## 📊 Banco de Dados

- **Tipo:** H2 Database (em memória)
- **Console:** http://localhost:8080/h2-console
- **Credenciais:**
  - URL: `jdbc:h2:file:./data/fashionspace`
  - User: `admin`
  - Password: `admin`

## 🎨 Exemplo de Dados

```json
{
  "nome": "Bazar da Moda Vintage",
  "descricao": "Peças únicas dos anos 70, 80 e 90",
  "imagem": "https://exemplo.com/imagem.jpg",
  "categoria": "Vintage",
  "endereco": {
    "cep": "01310-100",
    "rua": "Rua Augusta",
    "numero": "1234",
    "bairro": "Consolação",
    "cidade": "São Paulo, SP"
  },
  "telefone": "(11) 99999-1234",
  "horario": "Seg-Sex: 9h-18h",
  "avaliacao": 4.8,
  "totalAvaliacoes": 127
}
```

## 🐛 Solução de Problemas

### Porta 8080 em uso
Mude a porta no `application.properties`:
```properties
server.port=8081
```

### Erro ao compilar
```bash
mvn clean install -U
```

### Banco de dados corrompido
```bash
rmdir /s data
mvn spring-boot:run
```

## 📞 Suporte

- Consulte o README.md para detalhes
- Veja o GUIA_INSTALACAO.md para instalação
- Leia o ENTENDENDO_CRUD.md para entender o código

## 🏆 Resultado Esperado

Ao final, você terá:
- ✅ Uma API REST funcional
- ✅ Todas as operações CRUD implementadas
- ✅ Integração com frontend React
- ✅ Conhecimento sobre desenvolvimento backend
- ✅ Projeto pronto para apresentar no TCC

## 📝 Licença

Projeto desenvolvido para fins educacionais (TCC).

## 👨‍💻 Autor

Desenvolvido por um estudante do 2º ano do Ensino Médio.

---

**Versão:** 1.0.0  
**Data:** 2024  
**Status:** ✅ Completo e Funcional

---

## 🎉 Pronto para Usar!

Siga o GUIA_INSTALACAO.md e comece a usar sua API agora mesmo!
