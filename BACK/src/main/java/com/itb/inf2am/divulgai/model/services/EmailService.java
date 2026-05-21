package com.itb.inf2am.divulgai.model.services;

import javax.mail.internet.MimeMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger LOGGER = LoggerFactory.getLogger(EmailService.class);
    private static final String RESET_PATH = "/reset-password?token=";

    private final JavaMailSender mailSender;
    private final String remetente;
    private final String frontendUrl;

    public EmailService(
            ObjectProvider<JavaMailSender> mailSenderProvider,
            @Value("${spring.mail.username:}") String remetente,
            @Value("${app.frontend.url:http://localhost:3000}") String frontendUrl) {
        this.mailSender = mailSenderProvider.getIfAvailable();
        this.remetente = remetente;
        this.frontendUrl = frontendUrl;
    }

    public void enviarCodigo(String destino, String assunto, String codigo) {
        LOGGER.info("[FashionSpace] Codigo para {}: {}", destino, codigo);

        if (emailDesabilitado()) {
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(remetente);
            message.setTo(destino);
            message.setSubject(assunto);
            message.setText("Seu codigo FashionSpace e: " + codigo + "\n\nEle expira em 15 minutos.");
            mailSender.send(message);
        } catch (Exception e) {
            LOGGER.warn("[FashionSpace] Falha ao enviar email: {}", e.getMessage());
        }
    }

    public void enviarEmailConfirmacaoSenha(String destino, String nome, String token) {
        LOGGER.info("[FashionSpace] Email de confirmacao de senha para {}", destino);

        if (emailDesabilitado()) {
            LOGGER.info("[FashionSpace] Email desabilitado. Token omitido dos logs por seguranca.");
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(remetente);
            message.setTo(destino);
            message.setSubject("Confirme a mudanca de sua senha - FashionSpace");

            String conteudo = String.format(
                "Ola %s,\n\n" +
                "Voce solicitou a mudanca de senha.\n\n" +
                "Codigo de confirmacao: %s\n\n" +
                "Este codigo expira em 1 hora.\n\n" +
                "Se nao foi voce, ignore este email.\n\n" +
                "Atenciosamente,\nEquipe FashionSpace",
                nome, token
            );
            message.setText(conteudo);
            mailSender.send(message);
        } catch (Exception e) {
            LOGGER.warn("[FashionSpace] Falha ao enviar email de confirmacao: {}", e.getMessage());
        }
    }

    public void enviarEmailResetSenha(String destino, String nome, String token) {
        LOGGER.info("[FashionSpace] ===== INICIO ENVIO EMAIL RESET =====");
        LOGGER.info("[FashionSpace] Destino: {}", destino);
        LOGGER.info("[FashionSpace] Nome: {}", nome);
        LOGGER.info("[FashionSpace] Frontend URL: {}", frontendUrl);
        LOGGER.info("[FashionSpace] MailSender configurado: {}", mailSender != null);
        LOGGER.info("[FashionSpace] Remetente configurado: {}", remetenteConfigurado());

        if (mailSender == null) {
            LOGGER.error("[FashionSpace] ERRO: JavaMailSender nao esta configurado. Verifique as propriedades spring.mail.*");
            logResetFallback(token);
            return;
        }

        if (!remetenteConfigurado()) {
            LOGGER.error("[FashionSpace] ERRO: Email remetente nao esta configurado (spring.mail.username)");
            logResetFallback(token);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(remetente);
            helper.setTo(destino);
            helper.setSubject("Redefina sua senha - FashionSpace");

            String resetLink = frontendUrl + RESET_PATH + token;
            String htmlContent = criarHtmlResetSenha(nome, resetLink, token);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            LOGGER.info("[FashionSpace] Email de reset enviado COM SUCESSO para {}", destino);
            LOGGER.info("[FashionSpace] ===== FIM ENVIO EMAIL RESET =====");
        } catch (Exception e) {
            LOGGER.error("[FashionSpace] ERRO ao enviar email de reset: {}", e.getClass().getName());
            LOGGER.error("[FashionSpace] Mensagem de erro: {}", e.getMessage(), e);
            logResetFallback(token);
        }
    }

    private boolean emailDesabilitado() {
        return mailSender == null || !remetenteConfigurado();
    }

    private boolean remetenteConfigurado() {
        return remetente != null && !remetente.trim().isEmpty();
    }

    private void logResetFallback(String token) {
        LOGGER.info("[FashionSpace] Token de reset gerado, mas omitido dos logs por seguranca.");
        LOGGER.info("[FashionSpace] ===== FIM ENVIO EMAIL RESET (FALHOU) =====");
    }

    private String criarHtmlResetSenha(String nome, String webLink, String token) {
        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html>");
        html.append("<html lang='pt-BR'>");
        html.append("<head>");
        html.append("<meta charset='UTF-8'>");
        html.append("<meta name='viewport' content='width=device-width, initial-scale=1.0'>");
        html.append("<title>Redefinir Senha - FashionSpace</title>");
        html.append("<style>");
        html.append("* { margin: 0; padding: 0; box-sizing: border-box; }");
        html.append("body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #111827; background-color: #F9FAFB; }");
        html.append(".container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }");
        html.append(".email-wrapper { background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }");
        html.append(".header { background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); padding: 32px 24px; text-align: center; }");
        html.append(".header h1 { color: #ffffff; font-size: 24px; font-weight: 700; }");
        html.append(".content { padding: 32px 24px; }");
        html.append(".greeting { font-size: 20px; font-weight: 600; margin-bottom: 16px; color: #111827; }");
        html.append(".message { font-size: 16px; color: #6B7280; margin-bottom: 24px; }");
        html.append(".button { display: inline-block; background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-size: 16px; font-weight: 600; }");
        html.append(".button-container { text-align: center; margin: 32px 0; }");
        html.append(".token-display { background: #EEF2FF; border: 2px dashed #6366F1; border-radius: 12px; padding: 16px; text-align: center; margin: 24px 0; }");
        html.append(".token-code { font-size: 24px; font-weight: 700; color: #6366F1; font-family: monospace; letter-spacing: 4px; }");
        html.append(".expiry-notice { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 16px; border-radius: 8px; margin: 24px 0; }");
        html.append(".expiry-notice p { font-size: 14px; color: #92400E; }");
        html.append(".security-notice { background: #F3F4F6; border-radius: 8px; padding: 16px; margin: 24px 0; }");
        html.append(".security-notice p { font-size: 14px; color: #6B7280; }");
        html.append(".footer { background: #F9FAFB; padding: 24px; text-align: center; border-top: 1px solid #E5E7EB; }");
        html.append(".footer p { font-size: 14px; color: #9CA3AF; }");
        html.append("</style>");
        html.append("</head>");
        html.append("<body>");
        html.append("<div class='container'>");
        html.append("<div class='email-wrapper'>");
        html.append("<div class='header'><h1>FashionSpace</h1><p>Redefinicao de Senha</p></div>");
        html.append("<div class='content'>");
        html.append("<div class='greeting'>Ola, ").append(nome).append("!</div>");
        html.append("<div class='message'>Recebemos uma solicitacao para redefinir a senha da sua conta FashionSpace. Clique no botao abaixo para criar uma nova senha.</div>");
        html.append("<div class='button-container'><a href='").append(webLink).append("' class='button'>Redefinir Senha</a></div>");
        html.append("<div class='token-display'><div class='token-code'>").append(token).append("</div></div>");
        html.append("<div class='expiry-notice'><p><strong>Este link/codigo expira em 30 minutos.</strong></p></div>");
        html.append("<div class='security-notice'><p><strong>Nao solicitou esta mudanca?</strong><br>Se voce nao fez esta solicitacao, pode ignorar este email com seguranca.</p></div>");
        html.append("</div>");
        html.append("<div class='footer'><p><strong>FashionSpace</strong></p><p>Conectando voce ao mundo da moda</p></div>");
        html.append("</div></div></body></html>");
        return html.toString();
    }
}
