package com.fashionspace.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Modelo/Entidade Bazar
 * Representa um bazar no banco de dados
 */
@Entity
@Table(name = "bazares")
@Data
@NoArgsConstructor
@AllArgsConstructor
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
}
