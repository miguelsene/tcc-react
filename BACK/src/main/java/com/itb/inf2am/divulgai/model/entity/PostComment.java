package com.itb.inf2am.divulgai.model.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "post_comments")
public class PostComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String conteudo;

    private LocalDateTime dataCriacao = LocalDateTime.now();

    public PostComment() {}

    public PostComment(Post post, Usuario usuario, String conteudo) {
        this.post = post;
        this.usuario = usuario;
        this.conteudo = conteudo;
    }

    public Long getId() { return id; }
    public Post getPost() { return post; }
    public Usuario getUsuario() { return usuario; }
    public String getConteudo() { return conteudo; }
    public LocalDateTime getDataCriacao() { return dataCriacao; }
}
