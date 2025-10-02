# 📖 Guia de Instalação - FashionSpace API Java

Este guia vai te ajudar a instalar e executar a API Java do zero.

## 📋 Pré-requisitos

Antes de começar, você precisa instalar:

### 1. Java Development Kit (JDK) 17 ou superior

**Windows:**
1. Acesse: https://www.oracle.com/java/technologies/downloads/
2. Baixe o **JDK 17** para Windows
3. Execute o instalador
4. Siga as instruções na tela

**Verificar instalação:**
```bash
java -version
```

Deve mostrar algo como: `java version "17.0.x"`

### 2. Apache Maven

**Windows:**
1. Acesse: https://maven.apache.org/download.cgi
2. Baixe o arquivo `apache-maven-x.x.x-bin.zip`
3. Extraia para `C:\Program Files\Apache\maven`
4. Adicione ao PATH do Windows:
   - Pesquise "Variáveis de Ambiente" no Windows
   - Clique em "Variáveis de Ambiente"
   - Em "Variáveis do Sistema", encontre "Path"
   - Clique em "Editar" e adicione: `C:\Program Files\Apache\maven\bin`
   - Clique em "OK" em todas as janelas

**Verificar instalação:**
```bash
mvn -version
```

Deve mostrar a versão do Maven instalada.

## 🚀 Instalação do Projeto

### Passo 1: Abrir o terminal na pasta do projeto

1. Abra o Explorador de Arquivos
2. Navegue até: `C:\Users\rm95370\tcc-react\fashionspace\java-crud`
3. Digite `cmd` na barra de endereço e pressione Enter

### Passo 2: Compilar o projeto

No terminal, execute:

```bash
mvn clean install
```

Este comando vai:
- Baixar todas as dependências necessárias
- Compilar o código Java
- Criar o arquivo executável (.jar)

**Primeira vez pode demorar alguns minutos!**

### Passo 3: Executar a aplicação

Depois de compilar, execute:

```bash
mvn spring-boot:run
```

Ou use o script pronto:

```bash
executar.bat
```

### Passo 4: Verificar se está funcionando

Abra o navegador e acesse:

```
http://localhost:8080/api/status
```

Se aparecer algo como:
```json
{
  "status": "online",
  "mensagem": "API FashionSpace funcionando!",
  "versao": "1.0.0"
}
```

**Parabéns! A API está funcionando! 🎉**

## 🧪 Testando a API

### Teste 1: Listar bazares

Abra no navegador:
```
http://localhost:8080/api/bazares
```

Deve mostrar uma lista de bazares em formato JSON.

### Teste 2: Buscar um bazar específico

```
http://localhost:8080/api/bazares/1
```

### Teste 3: Ver estatísticas

```
http://localhost:8080/api/bazares/estatisticas
```

### Teste 4: Acessar o console do banco de dados

```
http://localhost:8080/h2-console
```

**Credenciais:**
- JDBC URL: `jdbc:h2:file:./data/fashionspace`
- Username: `admin`
- Password: `admin`

## 🔗 Conectar com o Frontend React

### Opção 1: Usar o serviço pronto

O arquivo `src/services/apiJava.js` já está configurado. Basta importar:

```javascript
import { listarBazares, criarBazar, atualizarBazar, deletarBazar } from './services/apiJava';

// Exemplo de uso
async function carregarBazares() {
  try {
    const bazares = await listarBazares();
    console.log(bazares);
  } catch (erro) {
    console.error('Erro:', erro);
  }
}
```

### Opção 2: Fazer requisições manualmente

```javascript
// Listar bazares
fetch('http://localhost:8080/api/bazares')
  .then(response => response.json())
  .then(data => console.log(data));

// Criar bazar
fetch('http://localhost:8080/api/bazares', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nome: 'Meu Bazar',
    categoria: 'Vintage',
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
  })
})
  .then(response => response.json())
  .then(data => console.log(data));
```

## 📱 Executando Frontend e Backend Juntos

### Terminal 1 - Backend (API Java):
```bash
cd C:\Users\rm95370\tcc-react\fashionspace\java-crud
mvn spring-boot:run
```

### Terminal 2 - Frontend (React):
```bash
cd C:\Users\rm95370\tcc-react\fashionspace
npm run dev
```

Agora você tem:
- **Backend:** http://localhost:8080
- **Frontend:** http://localhost:5173

## 🐛 Solucionando Problemas

### Problema: "mvn não é reconhecido"

**Solução:** Maven não está no PATH.
1. Verifique se o Maven está instalado
2. Adicione o Maven ao PATH (veja seção de instalação)
3. Reinicie o terminal

### Problema: "java não é reconhecido"

**Solução:** Java não está instalado ou não está no PATH.
1. Instale o JDK 17
2. Verifique com `java -version`

### Problema: "Port 8080 already in use"

**Solução:** A porta 8080 já está sendo usada.

**Opção 1:** Pare o programa que está usando a porta 8080

**Opção 2:** Mude a porta no arquivo `application.properties`:
```properties
server.port=8081
```

Depois use: `http://localhost:8081`

### Problema: Erro ao compilar

**Solução:** Limpe e recompile:
```bash
mvn clean install -U
```

### Problema: Banco de dados não inicia

**Solução:** Delete a pasta `data` e reinicie a aplicação:
```bash
rmdir /s data
mvn spring-boot:run
```

## 📚 Estrutura de Dados

### Formato do Bazar (JSON)

```json
{
  "id": 1,
  "nome": "Bazar da Moda Vintage",
  "descricao": "Peças únicas e autênticas",
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

### Categorias Disponíveis

- Bazar de Luxo
- Sebo
- Vintage
- Outlet
- Artesanal
- Infantil
- Fitness

## 🎯 Próximos Passos

1. ✅ Instalar Java e Maven
2. ✅ Compilar o projeto
3. ✅ Executar a API
4. ✅ Testar as rotas
5. ✅ Conectar com o frontend
6. 📝 Adicionar mais funcionalidades
7. 🎨 Personalizar conforme necessário

## 💡 Dicas

- Mantenha a API rodando enquanto desenvolve o frontend
- Use o console H2 para visualizar os dados
- Teste cada rota antes de integrar com o frontend
- Leia os logs no terminal para entender o que está acontecendo
- Consulte o README.md para mais detalhes

## 📞 Precisa de Ajuda?

- Consulte o README.md principal
- Veja a documentação do Spring Boot: https://spring.io/guides
- Pesquise no Stack Overflow: https://stackoverflow.com

---

**Boa sorte com seu TCC! 🚀**
