package com.itb.inf2am.divulgai.dto;

import com.itb.inf2am.divulgai.model.entity.Bazar;
import javax.validation.constraints.NotBlank;

public class BazarCreateDTO {

    @NotBlank(message = "Nome do bazar e obrigatorio")
    private String nome;

    private String descricao;
    private String imagem;

    @NotBlank(message = "Categoria e obrigatoria")
    private String categoria;

    private String cep;
    private String rua;
    private String numero;
    private String bairro;
    private String cidade;
    private String telefone;
    private String horario;
    private Long usuarioId;

    public Bazar toEntity() {
        Bazar bazar = new Bazar();
        bazar.setNome(nome);
        bazar.setDescricao(descricao);
        bazar.setImagem(imagem);
        bazar.setCategoria(categoria);
        bazar.setCep(cep);
        bazar.setRua(rua);
        bazar.setNumero(numero);
        bazar.setBairro(bairro);
        bazar.setCidade(cidade);
        bazar.setTelefone(telefone);
        bazar.setHorario(horario);
        bazar.setUsuarioId(usuarioId);
        return bazar;
    }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public String getImagem() { return imagem; }
    public void setImagem(String imagem) { this.imagem = imagem; }
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    public String getCep() { return cep; }
    public void setCep(String cep) { this.cep = cep; }
    public String getRua() { return rua; }
    public void setRua(String rua) { this.rua = rua; }
    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
    public String getBairro() { return bairro; }
    public void setBairro(String bairro) { this.bairro = bairro; }
    public String getCidade() { return cidade; }
    public void setCidade(String cidade) { this.cidade = cidade; }
    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    public String getHorario() { return horario; }
    public void setHorario(String horario) { this.horario = horario; }
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
}
