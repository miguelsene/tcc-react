# ⚠️ IMPORTANTE - Leia Antes de Começar

## 🔴 Você está vendo erros vermelhos no VS Code?

**Isso é NORMAL!** Os erros aparecem porque as dependências ainda não foram baixadas.

## ✅ Solução Rápida (3 passos)

### 1️⃣ Instalar o Maven

O Maven é necessário para baixar as bibliotecas do projeto.

**Verificar se já está instalado:**
```bash
mvn -version
```

**Se não estiver instalado:**
1. Baixe: https://maven.apache.org/download.cgi
2. Extraia para: `C:\Program Files\Apache\maven`
3. Adicione ao PATH do Windows
4. **Reinicie o VS Code**

### 2️⃣ Baixar as Dependências

Abra o terminal no VS Code (Ctrl + `) e execute:

```bash
cd c:\Users\rm95370\tcc-react\fashionspace\java-crud
mvn clean install
```

**Aguarde 5-10 minutos** (primeira vez demora mais)

### 3️⃣ Recarregar o VS Code

Depois que terminar:
1. Pressione `Ctrl + Shift + P`
2. Digite: "Java: Clean Java Language Server Workspace"
3. Clique em "Restart and delete"

**Pronto! Os erros devem desaparecer.** ✅

## 📚 Documentação Completa

Para instruções detalhadas, consulte:

1. **SOLUCAO_ERROS.md** - Solução completa de erros
2. **GUIA_INSTALACAO.md** - Guia de instalação passo a passo
3. **LEIA_PRIMEIRO.md** - Visão geral do projeto

## 🚀 Depois de Resolver os Erros

Execute a API:
```bash
mvn spring-boot:run
```

Ou use o script:
```bash
executar.bat
```

Teste no navegador:
```
http://localhost:8080/api/status
```

## 💡 Dica

Se você não conseguir instalar o Maven agora, não se preocupe! O código está correto. Os erros são apenas do VS Code tentando compilar sem as bibliotecas.

Você pode continuar lendo a documentação e voltar para instalar depois.

---

**Precisa de ajuda?** Leia o arquivo **SOLUCAO_ERROS.md**
