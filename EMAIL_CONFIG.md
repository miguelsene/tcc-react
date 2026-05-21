# Configuração de Email - FashionSpace

## Problema: Email de reset de senha não chega

O sistema de email do FashionSpace usa o serviço **Resend** para envio de emails. Se os emails não estão chegando, siga estas etapas:

### 1. Verificar se o RESEND_API_KEY está configurado

O backend está configurado para usar o Resend como servidor SMTP. Você precisa:

1. Criar uma conta em [Resend](https://resend.com)
2. Obter sua API_KEY no dashboard
3. Configurar a variável de ambiente:

```bash
# No arquivo .env do backend ou nas variáveis de ambiente do sistema
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 2. Verificar configuração no application.properties

O arquivo `BACK/src/main/resources/application.properties` já está configurado:

```properties
# Email Configuration (Resend API)
resend.api.key=${RESEND_API_KEY:}
spring.mail.host=smtp.resend.com
spring.mail.port=587
spring.mail.username=resend
spring.mail.password=${RESEND_API_KEY:}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

### 3. Verificar logs do backend

Quando um email de reset é solicitado, o backend imprime logs detalhados. Execute o backend e observe:

```
[FashionSpace] ===== INICIO ENVIO EMAIL RESET =====
[FashionSpace] Destino: usuario@email.com
[FashionSpace] MailSender configurado: true
[FashionSpace] Remetente configurado: true
...
```

Se aparecer `MailSender configurado: false` ou `Remetente configurado: false`, a configuração não está correta.

### 4. Alternativa: Usar Gmail como SMTP

Se preferir usar o Gmail, altere o `application.properties`:

```properties
# Gmail SMTP Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=seuemail@gmail.com
spring.mail.password=sua-senha-de-app
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

**Importante:** Para usar o Gmail, você precisa:
1. Ativar verificação em duas etapas na conta Google
2. Criar uma "Senha de App" em: https://myaccount.google.com/apppasswords
3. Usar essa senha de app no lugar da senha normal

### 5. URL do Frontend

O link de reset no email usa a variável `app.frontend.url`. Configure conforme seu ambiente:

```properties
# Para desenvolvimento local
app.frontend.url=http://localhost:3000

# Para produção (exemplo)
app.frontend.url=https://fashionspace.com.br
```

### 6. Testar o envio de email

Após configurar, teste:

1. Inicie o backend
2. Acesse a página de "Esqueci a senha" no frontend
3. Digite um email válido
4. Verifique os logs do backend
5. Verifique a caixa de entrada (e spam)

### 7. Domínios autorizados no Resend

No dashboard do Resend:
1. Vá em "Domains"
2. Adicione e verifique seu domínio
3. Ou use o domínio padrão `resend.dev` para testes

### 8. Mobile App

O app mobile usa a mesma API. Certifique-se de que o tunnel/URL da API está correto no arquivo `MOBILE/FashionSpace/config.ts`:

```typescript
export const TUNNEL_URL = 'https://seu-tunnel.trycloudflare.com';
export const API_URL = `${TUNNEL_URL}/api`;
```

## Funcionalidade de Reset de Senha no Web

Agora o web também suporta reset de senha:

- **Página de solicitar reset:** `http://localhost:3000/esqueci-senha`
- **Página de redefinir senha:** `http://localhost:3000/reset-password?token=SEU_TOKEN`

O link no email automaticamente direciona para a página correta com o token.

## Debug

Se ainda tiver problemas, verifique:

1. **Logs do backend** - mostram exatamente onde está falhando
2. **Console do navegador** - para erros na requisição da API
3. **Pasta de Spam** - emails podem cair lá
4. **Email existe no banco** - o sistema não revela se o email existe por segurança