package com.itb.inf2am.divulgai.dto;

import com.itb.inf2am.divulgai.model.entity.Mensagem;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class MensagemCreateDTO {

    @NotNull(message = "Remetente e obrigatorio")
    private Long remetenteId;

    @NotNull(message = "Destinatario e obrigatorio")
    private Long destinatarioId;

    @NotBlank(message = "Bazar e obrigatorio")
    private String bazarId;

    @NotBlank(message = "Mensagem nao pode ficar vazia")
    private String conteudo;

    public Mensagem toEntity() {
        Mensagem mensagem = new Mensagem();
        mensagem.setRemetenteId(remetenteId);
        mensagem.setDestinatarioId(destinatarioId);
        mensagem.setBazarId(bazarId);
        mensagem.setConteudo(conteudo);
        return mensagem;
    }

    public Long getRemetenteId() { return remetenteId; }
    public void setRemetenteId(Long remetenteId) { this.remetenteId = remetenteId; }
    public Long getDestinatarioId() { return destinatarioId; }
    public void setDestinatarioId(Long destinatarioId) { this.destinatarioId = destinatarioId; }
    public String getBazarId() { return bazarId; }
    public void setBazarId(String bazarId) { this.bazarId = bazarId; }
    public String getConteudo() { return conteudo; }
    public void setConteudo(String conteudo) { this.conteudo = conteudo; }
}
