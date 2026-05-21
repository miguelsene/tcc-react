package com.itb.inf2am.divulgai.model.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome e obrigatorio")
    @Size(min = 3, max = 100, message = "Nome deve ter entre 3 e 100 caracteres")
    @Column(length = 100, nullable = false)
    private String nome;

    @NotBlank(message = "Email e obrigatorio")
    @Email(message = "Email invalido")
    @Size(max = 100, message = "Email deve ter no maximo 100 caracteres")
    @Column(length = 100, nullable = false, unique = true)
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NotBlank(message = "Senha e obrigatoria")
    @Size(min = 8, max = 255, message = "Senha deve ter no minimo 8 caracteres")
    @Column(length = 255, nullable = false)
    private String senha;

    @Column(name = "tipo_usuario", length = 20, nullable = false)
    private String tipoUsuario = "casual";

    @Column(name = "data_cadastro", nullable = false)
    private LocalDateTime dataCadastro;

    @Column(name = "foto_perfil", columnDefinition = "NVARCHAR(MAX)")
    private String fotoPerfil;

    // Configurações de privacidade
    @Column(name = "perfil_publico")
    private Boolean perfilPublico = true;

    @Column(name = "receber_mensagens")
    private Boolean receberMensagens = true;

    @Column(name = "permitir_notificacoes")
    private Boolean permitirNotificacoes = true;

    @Column(name = "compartilhar_atividade")
    private Boolean compartilharAtividade = false;

    @Column(name = "notificacoes_email")
    private Boolean notificacoesEmail = true;

    @Column(name = "notificacoes_push")
    private Boolean notificacoesPush = true;

    @PrePersist
    protected void onCreate() {
        this.dataCadastro = LocalDateTime.now();
        // Define valores padrão se forem null
        if (this.perfilPublico == null) this.perfilPublico = true;
        if (this.receberMensagens == null) this.receberMensagens = true;
        if (this.permitirNotificacoes == null) this.permitirNotificacoes = true;
        if (this.compartilharAtividade == null) this.compartilharAtividade = false;
        if (this.notificacoesEmail == null) this.notificacoesEmail = true;
        if (this.notificacoesPush == null) this.notificacoesPush = true;
    }

    // Getters e Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getTipoUsuario() {
        return tipoUsuario;
    }

    public void setTipoUsuario(String tipoUsuario) {
        this.tipoUsuario = tipoUsuario;
    }

    public LocalDateTime getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(LocalDateTime dataCadastro) {
        this.dataCadastro = dataCadastro;
    }

    public String getFotoPerfil() {
        return fotoPerfil;
    }

    public void setFotoPerfil(String fotoPerfil) {
        this.fotoPerfil = fotoPerfil;
    }

    public Boolean getPerfilPublico() {
        return perfilPublico;
    }

    public void setPerfilPublico(Boolean perfilPublico) {
        this.perfilPublico = perfilPublico;
    }

    public Boolean getReceberMensagens() {
        return receberMensagens;
    }

    public void setReceberMensagens(Boolean receberMensagens) {
        this.receberMensagens = receberMensagens;
    }

    public Boolean getPermitirNotificacoes() {
        return permitirNotificacoes;
    }

    public void setPermitirNotificacoes(Boolean permitirNotificacoes) {
        this.permitirNotificacoes = permitirNotificacoes;
    }

    public Boolean getCompartilharAtividade() {
        return compartilharAtividade;
    }

    public void setCompartilharAtividade(Boolean compartilharAtividade) {
        this.compartilharAtividade = compartilharAtividade;
    }

    public Boolean getNotificacoesEmail() {
        return notificacoesEmail;
    }

    public void setNotificacoesEmail(Boolean notificacoesEmail) {
        this.notificacoesEmail = notificacoesEmail;
    }

    public Boolean getNotificacoesPush() {
        return notificacoesPush;
    }

    public void setNotificacoesPush(Boolean notificacoesPush) {
        this.notificacoesPush = notificacoesPush;
    }

}
