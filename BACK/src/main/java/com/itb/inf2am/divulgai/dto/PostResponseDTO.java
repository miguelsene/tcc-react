package com.itb.inf2am.divulgai.dto;

import com.itb.inf2am.divulgai.model.entity.Post;
import java.time.LocalDateTime;

public class PostResponseDTO {

    private Long id;
    private String titulo;
    private String conteudo;
    private String imagem;
    private Long usuarioId;
    private String nomeUsuario;
    private LocalDateTime dataCriacao;
    private Integer curtidas;

    public PostResponseDTO(Post post) {
        this.id = post.getId();
        this.titulo = post.getTitulo();
        this.conteudo = post.getConteudo();
        this.imagem = post.getImagem();
        this.usuarioId = post.getUsuarioId();
        this.nomeUsuario = post.getNomeUsuario();
        this.dataCriacao = post.getDataCriacao();
        this.curtidas = post.getCurtidas();
    }

    public Long getId() { return id; }
    public String getTitulo() { return titulo; }
    public String getConteudo() { return conteudo; }
    public String getImagem() { return imagem; }
    public Long getUsuarioId() { return usuarioId; }
    public String getNomeUsuario() { return nomeUsuario; }
    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public Integer getCurtidas() { return curtidas; }
}
