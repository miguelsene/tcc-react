package com.itb.inf2am.divulgai.dto;

import com.itb.inf2am.divulgai.model.entity.Mensagem;
import java.time.LocalDateTime;

public class MensagemResponseDTO {

    private Long id;
    private Long remetenteId;
    private Long destinatarioId;
    private String bazarId;
    private String conteudo;
    private LocalDateTime dataEnvio;
    private Boolean lida;

    public MensagemResponseDTO(Mensagem mensagem) {
        this.id = mensagem.getId();
        this.remetenteId = mensagem.getRemetenteId();
        this.destinatarioId = mensagem.getDestinatarioId();
        this.bazarId = mensagem.getBazarId();
        this.conteudo = mensagem.getConteudo();
        this.dataEnvio = mensagem.getDataEnvio();
        this.lida = mensagem.getLida();
    }

    public Long getId() { return id; }
    public Long getRemetenteId() { return remetenteId; }
    public Long getDestinatarioId() { return destinatarioId; }
    public String getBazarId() { return bazarId; }
    public String getConteudo() { return conteudo; }
    public LocalDateTime getDataEnvio() { return dataEnvio; }
    public Boolean getLida() { return lida; }
}
