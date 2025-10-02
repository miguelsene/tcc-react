package com.fashionspace.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

/**
 * Modelo/Entidade Bazar (Versão sem Lombok)
 * Representa um bazar no banco de dados
 * 
 * Esta versão não usa Lombok, então todos os getters, setters e construtores
 * estão escritos manualmente. Use esta versão se tiver problemas com Lombok.
 */
@Entity
@Table(name = "bazares")
public class Bazar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome é obrigatório")
    @Column(nullable = false)
    private String nome;

    @Column(length = 1000)
    private String descricao;

    private String imagem;

    @NotBlank(message = "Categoria é obrigatória")
    @Column(nullable = false)
    private String categoria;

    // Endereço
    private String cep;
    private String rua;
    private String numero;
    private String bairro;
    private String cidade;

    private String telefone;
    private String horario;

    @Column(columnDefinition = "DOUBLE DEFAULT 0.0")
    private Double avaliacao = 0.0;

    @Column(columnDefinition = "INTEGER DEFAULT 0")
    private Integer totalAvaliacoes = 0;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm;

    // ==================== CONSTRUTORES ====================

    /**
     * Construtor vazio (necessário para JPA)
     */
    public Bazar() {
    }

    /**
     * Construtor com todos os campos
     */
    public Bazar(Long id, String nome, String descricao, String imagem, String categoria,
                 String cep, String rua, String numero, String bairro, String cidade,
                 String telefone, String horario, Double avaliacao, Integer totalAvaliacoes,
                 LocalDateTime criadoEm, LocalDateTime atualizadoEm) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.imagem = imagem;
        this.categoria = categoria;
        this.cep = cep;
        this.rua = rua;
        this.numero = numero;
        this.bairro = bairro;
        this.cidade = cidade;
        this.telefone = telefone;
        this.horario = horario;
        this.avaliacao = avaliacao;
        this.totalAvaliacoes = totalAvaliacoes;
        this.criadoEm = criadoEm;
        this.atualizadoEm = atualizadoEm;
    }

    // ==================== GETTERS ====================

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public String getImagem() {
        return imagem;
    }

    public String getCategoria() {
        return categoria;
    }

    public String getCep() {
        return cep;
    }

    public String getRua() {
        return rua;
    }

    public String getNumero() {
        return numero;
    }

    public String getBairro() {
        return bairro;
    }

    public String getCidade() {
        return cidade;
    }

    public String getTelefone() {
        return telefone;
    }

    public String getHorario() {
        return horario;
    }

    public Double getAvaliacao() {
        return avaliacao;
    }

    public Integer getTotalAvaliacoes() {
        return totalAvaliacoes;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public LocalDateTime getAtualizadoEm() {
        return atualizadoEm;
    }

    // ==================== SETTERS ====================

    public void setId(Long id) {
        this.id = id;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public void setImagem(String imagem) {
        this.imagem = imagem;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public void setCep(String cep) {
        this.cep = cep;
    }

    public void setRua(String rua) {
        this.rua = rua;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public void setBairro(String bairro) {
        this.bairro = bairro;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public void setHorario(String horario) {
        this.horario = horario;
    }

    public void setAvaliacao(Double avaliacao) {
        this.avaliacao = avaliacao;
    }

    public void setTotalAvaliacoes(Integer totalAvaliacoes) {
        this.totalAvaliacoes = totalAvaliacoes;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }

    public void setAtualizadoEm(LocalDateTime atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }

    // ==================== MÉTODOS DO CICLO DE VIDA ====================

    /**
     * Método executado antes de salvar no banco
     */
    @PrePersist
    protected void onCreate() {
        criadoEm = LocalDateTime.now();
        atualizadoEm = LocalDateTime.now();
        
        // Definir imagem padrão se não fornecida
        if (imagem == null || imagem.isEmpty()) {
            imagem = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500";
        }
    }

    /**
     * Método executado antes de atualizar no banco
     */
    @PreUpdate
    protected void onUpdate() {
        atualizadoEm = LocalDateTime.now();
    }

    // ==================== MÉTODOS AUXILIARES ====================

    @Override
    public String toString() {
        return "Bazar{" +
                "id=" + id +
                ", nome='" + nome + '\'' +
                ", categoria='" + categoria + '\'' +
                ", cidade='" + cidade + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Bazar bazar = (Bazar) o;
        return id != null && id.equals(bazar.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
