package com.itb.inf2am.divulgai.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class PostUpdateDTO {

    @NotBlank(message = "Titulo e obrigatorio")
    private String titulo;

    @NotBlank(message = "Conteudo e obrigatorio")
    @Size(max = 1000, message = "Conteudo deve ter no maximo 1000 caracteres")
    private String conteudo;

    private String imagem;

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getConteudo() { return conteudo; }
    public void setConteudo(String conteudo) { this.conteudo = conteudo; }
    public String getImagem() { return imagem; }
    public void setImagem(String imagem) { this.imagem = imagem; }
}
