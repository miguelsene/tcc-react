package com.itb.inf2am.divulgai.model.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "posts")
public class Post {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String titulo;
    
    @Column(nullable = false, length = 1000)
    private String conteudo;
    
    private String imagem; // URL da imagem
    
    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;
    
    @Column(name = "nome_usuario", nullable = false)
    private String nomeUsuario;
    
    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao;
    
    private Integer curtidas = 0;
    
    private Boolean ativo = true;
    
    // Construtores
    public Post() {
        this.dataCriacao = LocalDateTime.now();
    }
    
    public Post(String titulo, String conteudo, Long usuarioId, String nomeUsuario) {
        this();
        this.titulo = titulo;
        this.conteudo = conteudo;
        this.usuarioId = usuarioId;
        this.nomeUsuario = nomeUsuario;
    }
    
    // Getters e Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitulo() {
        return titulo;
    }
    
    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }
    
    public String getConteudo() {
        return conteudo;
    }
    
    public void setConteudo(String conteudo) {
        this.conteudo = conteudo;
    }
    
    public String getImagem() {
        return imagem;
    }
    
    public void setImagem(String imagem) {
        this.imagem = imagem;
    }
    
    public Long getUsuarioId() {
        return usuarioId;
    }
    
    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }
    
    public String getNomeUsuario() {
        return nomeUsuario;
    }
    
    public void setNomeUsuario(String nomeUsuario) {
        this.nomeUsuario = nomeUsuario;
    }
    
    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }
    
    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }
    
    public Integer getCurtidas() {
        return curtidas;
    }
    
    public void setCurtidas(Integer curtidas) {
        this.curtidas = curtidas;
    }
    
    public Boolean getAtivo() {
        return ativo;
    }
    
    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }
}