package com.itb.inf2am.divulgai.dto;

import com.itb.inf2am.divulgai.model.entity.Post;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class PostCreateDTO {

    @NotBlank(message = "Titulo e obrigatorio")
    private String titulo;

    @NotBlank(message = "Conteudo e obrigatorio")
    @Size(max = 1000, message = "Conteudo deve ter no maximo 1000 caracteres")
    private String conteudo;

    private String imagem;

    @NotNull(message = "Usuario e obrigatorio")
    private Long usuarioId;

    @NotBlank(message = "Nome do usuario e obrigatorio")
    private String nomeUsuario;

    public Post toEntity() {
        Post post = new Post();
        post.setTitulo(titulo);
        post.setConteudo(conteudo);
        post.setImagem(imagem);
        post.setUsuarioId(usuarioId);
        post.setNomeUsuario(nomeUsuario);
        return post;
    }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getConteudo() { return conteudo; }
    public void setConteudo(String conteudo) { this.conteudo = conteudo; }
    public String getImagem() { return imagem; }
    public void setImagem(String imagem) { this.imagem = imagem; }
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public String getNomeUsuario() { return nomeUsuario; }
    public void setNomeUsuario(String nomeUsuario) { this.nomeUsuario = nomeUsuario; }
}
