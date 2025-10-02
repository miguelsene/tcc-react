package com.fashionspace.dto;

import com.fashionspace.model.Bazar;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO (Data Transfer Object) para Bazar
 * Usado para transferir dados entre frontend e backend
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BazarDTO {

    private Long id;
    private String nome;
    private String descricao;
    private String imagem;
    private String categoria;
    private EnderecoDTO endereco;
    private String telefone;
    private String horario;
    private Double avaliacao;
    private Integer totalAvaliacoes;

    /**
     * Classe interna para representar o endereço
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EnderecoDTO {
        private String cep;
        private String rua;
        private String numero;
        private String bairro;
        private String cidade;
    }

    /**
     * Converte um Bazar (entidade) para BazarDTO
     */
    public static BazarDTO fromEntity(Bazar bazar) {
        BazarDTO dto = new BazarDTO();
        dto.setId(bazar.getId());
        dto.setNome(bazar.getNome());
        dto.setDescricao(bazar.getDescricao());
        dto.setImagem(bazar.getImagem());
        dto.setCategoria(bazar.getCategoria());
        dto.setTelefone(bazar.getTelefone());
        dto.setHorario(bazar.getHorario());
        dto.setAvaliacao(bazar.getAvaliacao());
        dto.setTotalAvaliacoes(bazar.getTotalAvaliacoes());

        // Criar objeto de endereço
        EnderecoDTO endereco = new EnderecoDTO();
        endereco.setCep(bazar.getCep());
        endereco.setRua(bazar.getRua());
        endereco.setNumero(bazar.getNumero());
        endereco.setBairro(bazar.getBairro());
        endereco.setCidade(bazar.getCidade());
        dto.setEndereco(endereco);

        return dto;
    }

    /**
     * Converte um BazarDTO para Bazar (entidade)
     */
    public Bazar toEntity() {
        Bazar bazar = new Bazar();
        bazar.setId(this.id);
        bazar.setNome(this.nome);
        bazar.setDescricao(this.descricao);
        bazar.setImagem(this.imagem);
        bazar.setCategoria(this.categoria);
        bazar.setTelefone(this.telefone);
        bazar.setHorario(this.horario);
        bazar.setAvaliacao(this.avaliacao != null ? this.avaliacao : 0.0);
        bazar.setTotalAvaliacoes(this.totalAvaliacoes != null ? this.totalAvaliacoes : 0);

        // Extrair dados do endereço
        if (this.endereco != null) {
            bazar.setCep(this.endereco.getCep());
            bazar.setRua(this.endereco.getRua());
            bazar.setNumero(this.endereco.getNumero());
            bazar.setBairro(this.endereco.getBairro());
            bazar.setCidade(this.endereco.getCidade());
        }

        return bazar;
    }
}
