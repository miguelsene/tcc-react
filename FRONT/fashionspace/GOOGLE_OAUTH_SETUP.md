# Configuração do Google OAuth

## Passos para configurar o login com Google:

### 1. Criar projeto no Google Cloud Console
1. Acesse: https://console.cloud.google.com/
2. Crie um novo projeto ou selecione um existente
3. Ative a API "Google+ API" ou "Google Identity Services"

### 2. Criar credenciais OAuth 2.0
1. Vá em "APIs & Services" > "Credentials"
2. Clique em "Create Credentials" > "OAuth client ID"
3. Escolha "Web application"
4. Configure:
   - **Authorized JavaScript origins**: 
     - `http://localhost:5173` (desenvolvimento)
     - `http://localhost:3000` (desenvolvimento alternativo)
     - Seu domínio de produção
   - **Authorized redirect URIs**:
     - `http://localhost:5173`
     - `http://localhost:3000`
     - Seu domínio de produção

### 3. Copiar o Client ID
1. Após criar, copie o "Client ID"
2. Abra o arquivo `src/App.jsx`
3. Substitua `YOUR_GOOGLE_CLIENT_ID` pelo seu Client ID real:
   ```jsx
   <GoogleOAuthProvider clientId="SEU_CLIENT_ID_AQUI">
   ```

### 4. Instalar dependências
Execute no terminal:
```bash
cd FRONT/fashionspace
npm install @react-oauth/google
```

### 5. Testar
1. Inicie o servidor de desenvolvimento: `npm run dev`
2. Acesse a página de login
3. Clique no botão "Continuar com Google"

## Observações importantes:
- O Client ID é público e pode ser exposto no código frontend
- Nunca exponha o Client Secret no frontend
- Para produção, adicione seu domínio nas origens autorizadas
- O login com Google funciona apenas em HTTPS em produção (exceto localhost)

## Estrutura de dados do usuário Google:
```javascript
{
  id: "google_user_id",
  nome: "Nome do Usuário",
  email: "email@gmail.com",
  fotoPerfil: "url_da_foto",
  googleId: "google_user_id",
  tipoUsuario: "casual"
}
```
