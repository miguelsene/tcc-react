package com.itb.inf2am.divulgai.model.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mensagens")
public class Mensagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "remetente_id", nullable = false)
    private Long remetenteId;

    @Column(name = "destinatario_id", nullable = false)
    private Long destinatarioId;

    @Column(name = "bazar_id", nullable = false, length = 50)
    private String bazarId;

    @Column(name = "conteudo", nullable = false, columnDefinition = "TEXT")
    private String conteudo;

    @Column(name = "data_envio", nullable = false)
    private LocalDateTime dataEnvio;

    @Column(name = "lida", nullable = false)
    private Boolean lida = false;

    @Column(name = "ativa", nullable = false)
    private Boolean ativa = true;

    public Mensagem() {}

    public Mensagem(Long remetenteId, Long destinatarioId, String bazarId, String conteudo) {
        this.remetenteId = remetenteId;
        this.destinatarioId = destinatarioId;
        this.bazarId = bazarId;
        this.conteudo = conteudo;
        this.dataEnvio = LocalDateTime.now();
        this.lida = false;
        this.ativa = true;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRemetenteId() {
        return remetenteId;
    }

    public void setRemetenteId(Long remetenteId) {
        this.remetenteId = remetenteId;
    }

    public Long getDestinatarioId() {
        return destinatarioId;
    }

    public void setDestinatarioId(Long destinatarioId) {
        this.destinatarioId = destinatarioId;
    }

    public String getBazarId() {
        return bazarId;
    }

    public void setBazarId(String bazarId) {
        this.bazarId = bazarId;
    }

    public String getConteudo() {
        return conteudo;
    }

    public void setConteudo(String conteudo) {
        this.conteudo = conteudo;
    }

    public LocalDateTime getDataEnvio() {
        return dataEnvio;
    }

    public void setDataEnvio(LocalDateTime dataEnvio) {
        this.dataEnvio = dataEnvio;
    }

    public Boolean getLida() {
        return lida;
    }

    public void setLida(Boolean lida) {
        this.lida = lida;
    }

    public Boolean getAtiva() {
        return ativa;
    }

    public void setAtiva(Boolean ativa) {
        this.ativa = ativa;
    }
}