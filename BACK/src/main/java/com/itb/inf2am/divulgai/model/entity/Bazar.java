package com.itb.inf2am.divulgai.model.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bazares")
public class Bazar {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nome;
    
    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String descricao;
    
    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String imagem;
    
    @Column(nullable = false, length = 50)
    private String categoria;
    
    @Column(length = 20)
    private String cep;
    
    private String rua;
    
    @Column(length = 10)
    private String numero;
    
    @Column(length = 100)
    private String bairro;
    
    @Column(length = 100)
    private String cidade;
    
    @Column(length = 20)
    private String telefone;
    
    private String horario;
    
    @Column
    private Double avaliacao = 0.0;
    
    @Column(name = "total_avaliacoes")
    private Integer totalAvaliacoes = 0;
    
    @Column(name = "usuario_id")
    private Long usuarioId;
    
    @Column(name = "data_cadastro")
    private LocalDateTime dataCadastro;
    
    private Boolean ativo = true;
    
    // Construtores
    public Bazar() {
        this.dataCadastro = LocalDateTime.now();
    }
    
    public Bazar(String nome, String descricao, String categoria) {
        this();
        this.nome = nome;
        this.descricao = descricao;
        this.categoria = categoria;
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
    
    public String getDescricao() {
        return descricao;
    }
    
    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
    
    public String getImagem() {
        return imagem;
    }
    
    public void setImagem(String imagem) {
        this.imagem = imagem;
    }
    
    public String getCategoria() {
        return categoria;
    }
    
    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }
    
    public String getCep() {
        return cep;
    }
    
    public void setCep(String cep) {
        this.cep = cep;
    }
    
    public String getRua() {
        return rua;
    }
    
    public void setRua(String rua) {
        this.rua = rua;
    }
    
    public String getNumero() {
        return numero;
    }
    
    public void setNumero(String numero) {
        this.numero = numero;
    }
    
    public String getBairro() {
        return bairro;
    }
    
    public void setBairro(String bairro) {
        this.bairro = bairro;
    }
    
    public String getCidade() {
        return cidade;
    }
    
    public void setCidade(String cidade) {
        this.cidade = cidade;
    }
    
    public String getTelefone() {
        return telefone;
    }
    
    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }
    
    public String getHorario() {
        return horario;
    }
    
    public void setHorario(String horario) {
        this.horario = horario;
    }
    
    public Double getAvaliacao() {
        return avaliacao;
    }
    
    public void setAvaliacao(Double avaliacao) {
        this.avaliacao = avaliacao;
    }
    
    public Integer getTotalAvaliacoes() {
        return totalAvaliacoes;
    }
    
    public void setTotalAvaliacoes(Integer totalAvaliacoes) {
        this.totalAvaliacoes = totalAvaliacoes;
    }
    
    public Long getUsuarioId() {
        return usuarioId;
    }
    
    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }
    
    public LocalDateTime getDataCadastro() {
        return dataCadastro;
    }
    
    public void setDataCadastro(LocalDateTime dataCadastro) {
        this.dataCadastro = dataCadastro;
    }
    
    public Boolean getAtivo() {
        return ativo;
    }
    
    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }
}