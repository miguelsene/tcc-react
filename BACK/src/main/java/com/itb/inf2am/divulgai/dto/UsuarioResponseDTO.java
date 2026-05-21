package com.itb.inf2am.divulgai.dto;

import com.itb.inf2am.divulgai.model.entity.Usuario;
import java.time.LocalDateTime;

public class UsuarioResponseDTO {

    private Long id;
    private String nome;
    private String email;
    private String tipoUsuario;
    private String fotoPerfil;
    private LocalDateTime dataCadastro;
    private Boolean perfilPublico;
    private Boolean receberMensagens;
    private Boolean permitirNotificacoes;
    private Boolean compartilharAtividade;
    private Boolean notificacoesEmail;
    private Boolean notificacoesPush;

    public UsuarioResponseDTO(Usuario usuario) {
        this.id = usuario.getId();
        this.nome = usuario.getNome();
        this.email = usuario.getEmail();
        this.tipoUsuario = usuario.getTipoUsuario();
        this.fotoPerfil = usuario.getFotoPerfil();
        this.dataCadastro = usuario.getDataCadastro();
        this.perfilPublico = usuario.getPerfilPublico();
        this.receberMensagens = usuario.getReceberMensagens();
        this.permitirNotificacoes = usuario.getPermitirNotificacoes();
        this.compartilharAtividade = usuario.getCompartilharAtividade();
        this.notificacoesEmail = usuario.getNotificacoesEmail();
        this.notificacoesPush = usuario.getNotificacoesPush();
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getEmail() {
        return email;
    }

    public String getTipoUsuario() {
        return tipoUsuario;
    }

    public String getFotoPerfil() {
        return fotoPerfil;
    }

    public LocalDateTime getDataCadastro() {
        return dataCadastro;
    }

    public Boolean getPerfilPublico() {
        return perfilPublico;
    }

    public Boolean getReceberMensagens() {
        return receberMensagens;
    }

    public Boolean getPermitirNotificacoes() {
        return permitirNotificacoes;
    }

    public Boolean getCompartilharAtividade() {
        return compartilharAtividade;
    }

    public Boolean getNotificacoesEmail() {
        return notificacoesEmail;
    }

    public Boolean getNotificacoesPush() {
        return notificacoesPush;
    }
}
