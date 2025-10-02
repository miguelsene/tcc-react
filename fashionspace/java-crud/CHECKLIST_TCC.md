# ✅ Checklist para Apresentação do TCC

Use este checklist para garantir que tudo está funcionando antes da apresentação.

## 📋 Antes da Apresentação

### Instalação e Configuração

- [ ] Java 17 ou superior instalado
- [ ] Maven instalado e configurado
- [ ] Projeto compilado sem erros (`mvn clean install`)
- [ ] API iniciando corretamente (`mvn spring-boot:run`)
- [ ] Frontend React funcionando (`npm run dev`)

### Testes da API

- [ ] Status da API funcionando (`/api/status`)
- [ ] Listar bazares funcionando (`/api/bazares`)
- [ ] Buscar bazar por ID funcionando (`/api/bazares/1`)
- [ ] Criar bazar funcionando (POST `/api/bazares`)
- [ ] Atualizar bazar funcionando (PUT `/api/bazares/1`)
- [ ] Deletar bazar funcionando (DELETE `/api/bazares/1`)
- [ ] Filtros funcionando (categoria e busca)
- [ ] Console H2 acessível (`/h2-console`)

### Integração Frontend-Backend

- [ ] Frontend consegue listar bazares da API
- [ ] Frontend consegue criar novos bazares
- [ ] Frontend consegue atualizar bazares
- [ ] Frontend consegue deletar bazares
- [ ] Filtros funcionando no frontend
- [ ] Mensagens de erro sendo exibidas
- [ ] Loading states funcionando

### Documentação

- [ ] README.md completo e atualizado
- [ ] GUIA_INSTALACAO.md revisado
- [ ] ENTENDENDO_CRUD.md revisado
- [ ] EXEMPLOS_USO.md com exemplos funcionais
- [ ] Código comentado em português
- [ ] Diagramas preparados (se necessário)

## 🎯 Durante a Apresentação

### Demonstração Prática

#### 1. Mostrar a Estrutura do Projeto
```
- Explicar a organização das pastas
- Mostrar as camadas (Controller, Service, Repository, Model)
- Explicar o papel de cada camada
```

#### 2. Iniciar a API
```bash
cd java-crud
mvn spring-boot:run
```
- [ ] Mostrar os logs de inicialização
- [ ] Explicar o que está acontecendo

#### 3. Testar no Navegador
```
http://localhost:8080/api/status
http://localhost:8080/api/bazares
```
- [ ] Mostrar o JSON retornado
- [ ] Explicar a estrutura dos dados

#### 4. Demonstrar o CRUD

**CREATE (Criar):**
- [ ] Usar Postman ou curl para criar um bazar
- [ ] Mostrar a resposta da API
- [ ] Verificar no banco de dados (H2 Console)

**READ (Ler):**
- [ ] Listar todos os bazares
- [ ] Buscar um bazar específico
- [ ] Usar filtros (categoria, busca)

**UPDATE (Atualizar):**
- [ ] Atualizar um bazar existente
- [ ] Mostrar os dados antes e depois

**DELETE (Deletar):**
- [ ] Deletar um bazar
- [ ] Verificar que foi removido

#### 5. Mostrar o Banco de Dados
```
http://localhost:8080/h2-console
```
- [ ] Fazer login no console
- [ ] Mostrar a tabela de bazares
- [ ] Executar uma query SQL simples

#### 6. Integração com Frontend
- [ ] Iniciar o frontend React
- [ ] Mostrar a lista de bazares
- [ ] Criar um novo bazar pelo frontend
- [ ] Editar um bazar
- [ ] Deletar um bazar

## 📝 Pontos para Explicar

### 1. O que é CRUD?
```
- Create (Criar)
- Read (Ler)
- Update (Atualizar)
- Delete (Deletar)
```

### 2. O que é uma API REST?
```
- Arquitetura de comunicação
- Usa HTTP (GET, POST, PUT, DELETE)
- Retorna dados em JSON
- Stateless (sem estado)
```

### 3. Tecnologias Utilizadas
```
- Java 17
- Spring Boot
- Spring Data JPA
- H2 Database
- Maven
```

### 4. Arquitetura em Camadas
```
Controller → Service → Repository → Database
```

### 5. Por que usar Spring Boot?
```
- Facilita o desenvolvimento
- Configuração automática
- Muito usado no mercado
- Grande comunidade
```

## 🎤 Roteiro de Apresentação

### Introdução (2-3 minutos)
- [ ] Apresentar o projeto FashionSpace
- [ ] Explicar o objetivo do CRUD
- [ ] Mostrar as tecnologias usadas

### Demonstração Técnica (5-7 minutos)
- [ ] Mostrar a estrutura do código
- [ ] Explicar as camadas da aplicação
- [ ] Demonstrar o funcionamento da API
- [ ] Mostrar o banco de dados

### Demonstração Prática (5-7 minutos)
- [ ] Criar um bazar
- [ ] Listar bazares
- [ ] Atualizar um bazar
- [ ] Deletar um bazar
- [ ] Mostrar filtros funcionando

### Integração (3-5 minutos)
- [ ] Mostrar frontend e backend juntos
- [ ] Demonstrar a comunicação entre eles
- [ ] Explicar como funciona a integração

### Conclusão (2-3 minutos)
- [ ] Resumir o que foi feito
- [ ] Destacar os aprendizados
- [ ] Mencionar possíveis melhorias futuras

## 🔧 Comandos Importantes

### Compilar o Projeto
```bash
mvn clean install
```

### Executar a API
```bash
mvn spring-boot:run
```

### Executar o Frontend
```bash
npm run dev
```

### Parar a API
```
Ctrl + C no terminal
```

### Limpar o Banco de Dados
```bash
rmdir /s data
```

## 📊 Dados para Demonstração

### Bazar de Exemplo para Criar
```json
{
  "nome": "Bazar Demonstração TCC",
  "categoria": "Vintage",
  "descricao": "Bazar criado durante a apresentação do TCC",
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

## 🐛 Plano B (Se algo der errado)

### Se a API não iniciar:
1. Verificar se a porta 8080 está livre
2. Mudar para porta 8081 no `application.properties`
3. Recompilar: `mvn clean install`

### Se o banco não funcionar:
1. Deletar pasta `data`
2. Reiniciar a aplicação

### Se o frontend não conectar:
1. Verificar se a API está rodando
2. Verificar CORS no backend
3. Verificar URL no frontend (`http://localhost:8080`)

### Se tudo falhar:
- Ter prints/screenshots prontos
- Ter vídeo de demonstração como backup
- Explicar o código mesmo sem executar

## 📸 Materiais de Apoio

### Preparar Antes:
- [ ] Slides com diagramas
- [ ] Prints da aplicação funcionando
- [ ] Vídeo de demonstração (backup)
- [ ] Código impresso (opcional)
- [ ] Documentação impressa

### Diagramas Úteis:
- [ ] Diagrama de arquitetura (camadas)
- [ ] Fluxo de uma requisição HTTP
- [ ] Estrutura do banco de dados
- [ ] Diagrama de casos de uso

## 💡 Dicas para a Apresentação

1. **Teste tudo antes** - No dia anterior e 1 hora antes
2. **Tenha um backup** - Vídeo ou prints
3. **Pratique** - Ensaie a apresentação
4. **Seja claro** - Explique de forma simples
5. **Mostre confiança** - Você sabe o que fez
6. **Prepare-se para perguntas** - Sobre CRUD, API, Spring Boot
7. **Tenha água** - Para não ficar com a boca seca
8. **Respire** - Mantenha a calma

## ❓ Possíveis Perguntas

### Técnicas:
- O que é CRUD?
- Por que usar Spring Boot?
- O que é uma API REST?
- Como funciona o banco de dados?
- O que é JPA/Hibernate?

### Sobre o Projeto:
- Por que escolheu Java?
- Quais foram as dificuldades?
- O que você aprendeu?
- Como poderia melhorar?
- Quanto tempo levou?

### Prepare Respostas para:
- [ ] "Explique o que é CRUD"
- [ ] "Como funciona a comunicação entre frontend e backend?"
- [ ] "Por que usar Spring Boot?"
- [ ] "Quais as vantagens de uma API REST?"
- [ ] "Como você testou a aplicação?"

## 🎯 Critérios de Avaliação (Possíveis)

- [ ] Funcionamento correto do CRUD
- [ ] Qualidade do código
- [ ] Organização do projeto
- [ ] Documentação
- [ ] Apresentação oral
- [ ] Conhecimento técnico demonstrado
- [ ] Capacidade de explicar o projeto

## ✨ Diferenciais do Seu Projeto

- ✅ Código bem organizado em camadas
- ✅ Documentação completa em português
- ✅ Exemplos práticos de uso
- ✅ Integração frontend-backend funcionando
- ✅ Banco de dados com dados de exemplo
- ✅ Scripts de execução prontos
- ✅ Tratamento de erros
- ✅ Validações implementadas

## 🏆 Checklist Final

### 1 Dia Antes:
- [ ] Testar tudo do zero
- [ ] Revisar documentação
- [ ] Preparar slides
- [ ] Ensaiar apresentação
- [ ] Carregar notebook

### No Dia:
- [ ] Chegar cedo
- [ ] Testar equipamentos
- [ ] Iniciar API e Frontend
- [ ] Testar conexão com internet (se necessário)
- [ ] Respirar fundo e confiar no seu trabalho

## 🎉 Você está pronto!

Lembre-se:
- Você construiu um projeto completo e funcional
- Você aprendeu muito no processo
- Você é capaz de explicar o que fez
- Você vai se sair bem!

**Boa sorte na apresentação! 🚀**

---

**Última revisão:** Antes da apresentação  
**Status:** ✅ Pronto para apresentar
