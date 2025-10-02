# 🔧 Solução de Erros - VS Code

## ❌ Problema: Erros de Importação no VS Code

Você está vendo erros como:
- "The import jakarta cannot be resolved"
- "The import lombok cannot be resolved"
- "Entity cannot be resolved to a type"

## ✅ Solução

Esses erros aparecem porque as **dependências ainda não foram baixadas**. O VS Code está tentando compilar o código, mas as bibliotecas necessárias ainda não estão disponíveis.

### Passo 1: Instalar o Maven

**Verificar se o Maven está instalado:**
```bash
mvn -version
```

Se aparecer "mvn não é reconhecido", você precisa instalar o Maven:

1. Baixe o Maven: https://maven.apache.org/download.cgi
2. Extraia para `C:\Program Files\Apache\maven`
3. Adicione ao PATH do Windows:
   - Pesquise "Variáveis de Ambiente" no Windows
   - Clique em "Variáveis de Ambiente"
   - Em "Variáveis do Sistema", encontre "Path"
   - Clique em "Editar" e adicione: `C:\Program Files\Apache\maven\bin`
   - Clique em "OK" em todas as janelas
4. **Reinicie o VS Code** (importante!)

### Passo 2: Baixar as Dependências

Abra um terminal no VS Code (Ctrl + `) e execute:

```bash
cd c:\Users\rm95370\tcc-react\fashionspace\java-crud
mvn clean install -DskipTests
```

Este comando vai:
- Baixar todas as dependências (Spring Boot, JPA, Lombok, etc)
- Compilar o projeto
- Criar o arquivo .jar

**Primeira vez pode demorar 5-10 minutos!**

### Passo 3: Recarregar o VS Code

Depois que o Maven terminar:
1. Pressione `Ctrl + Shift + P`
2. Digite "Java: Clean Java Language Server Workspace"
3. Clique em "Restart and delete"
4. Aguarde o VS Code recarregar

Os erros devem desaparecer! ✅

## 🔄 Alternativa: Usar Versão Sem Lombok

Se você continuar tendo problemas com o Lombok, criei uma versão alternativa sem ele.

Veja o arquivo: `Bazar_SemLombok.java`

## 🛠️ Extensões Necessárias no VS Code

Certifique-se de ter estas extensões instaladas:

1. **Extension Pack for Java** (Microsoft)
2. **Spring Boot Extension Pack** (VMware)
3. **Lombok Annotations Support** (GabrielBB)

Para instalar:
1. Pressione `Ctrl + Shift + X`
2. Pesquise cada extensão
3. Clique em "Install"

## 🐛 Outros Problemas Comuns

### Problema: "Java version"

**Solução:** Instale o JDK 17 ou superior
- Download: https://www.oracle.com/java/technologies/downloads/

### Problema: "JAVA_HOME not set"

**Solução:** Configure a variável JAVA_HOME
1. Pesquise "Variáveis de Ambiente"
2. Clique em "Nova" em "Variáveis do Sistema"
3. Nome: `JAVA_HOME`
4. Valor: `C:\Program Files\Java\jdk-17` (ajuste o caminho)

### Problema: Erros persistem após instalar tudo

**Solução:**
1. Feche o VS Code completamente
2. Delete a pasta `.vscode` no projeto
3. Delete a pasta `target` no projeto
4. Abra o VS Code novamente
5. Execute `mvn clean install` novamente

## 📝 Checklist de Verificação

- [ ] Java 17+ instalado (`java -version`)
- [ ] Maven instalado (`mvn -version`)
- [ ] Extensões Java instaladas no VS Code
- [ ] Dependências baixadas (`mvn clean install`)
- [ ] VS Code recarregado
- [ ] Pasta `target` foi criada

## 🎯 Teste Final

Se tudo estiver correto:
1. Os erros vermelhos devem desaparecer
2. A pasta `target` deve existir
3. O comando `mvn spring-boot:run` deve funcionar

## 💡 Dica

Se você não conseguir instalar o Maven agora, pode usar a versão sem Lombok que criei. Ela funciona sem precisar de dependências externas para compilar no VS Code.

---

**Precisa de mais ajuda?** Consulte o GUIA_INSTALACAO.md
