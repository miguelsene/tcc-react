package com.itb.inf2am.divulgai.dto;

import com.itb.inf2am.divulgai.model.entity.Bazar;
import java.time.LocalDateTime;

public class BazarResponseDTO {

    private Long id;
    private String nome;
    private String descricao;
    private String imagem;
    private String categoria;
    private String cep;
    private String rua;
    private String numero;
    private String bairro;
    private String cidade;
    private String telefone;
    private String horario;
    private Double avaliacao;
    private Integer totalAvaliacoes;
    private Long usuarioId;
    private LocalDateTime dataCadastro;

    public BazarResponseDTO(Bazar bazar) {
        this.id = bazar.getId();
        this.nome = bazar.getNome();
        this.descricao = bazar.getDescricao();
        this.imagem = bazar.getImagem();
        this.categoria = bazar.getCategoria();
        this.cep = bazar.getCep();
        this.rua = bazar.getRua();
        this.numero = bazar.getNumero();
        this.bairro = bazar.getBairro();
        this.cidade = bazar.getCidade();
        this.telefone = bazar.getTelefone();
        this.horario = bazar.getHorario();
        this.avaliacao = bazar.getAvaliacao();
        this.totalAvaliacoes = bazar.getTotalAvaliacoes();
        this.usuarioId = bazar.getUsuarioId();
        this.dataCadastro = bazar.getDataCadastro();
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getDescricao() { return descricao; }
    public String getImagem() { return imagem; }
    public String getCategoria() { return categoria; }
    public String getCep() { return cep; }
    public String getRua() { return rua; }
    public String getNumero() { return numero; }
    public String getBairro() { return bairro; }
    public String getCidade() { return cidade; }
    public String getTelefone() { return telefone; }
    public String getHorario() { return horario; }
    public Double getAvaliacao() { return avaliacao; }
    public Integer getTotalAvaliacoes() { return totalAvaliacoes; }
    public Long getUsuarioId() { return usuarioId; }
    public LocalDateTime getDataCadastro() { return dataCadastro; }
}
