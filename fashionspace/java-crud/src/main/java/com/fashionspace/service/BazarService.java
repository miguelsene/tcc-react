package com.fashionspace.service;

import com.fashionspace.dto.BazarDTO;
import com.fashionspace.model.Bazar;
import com.fashionspace.repository.BazarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service para Bazar
 * Contém a lógica de negócio da aplicação
 */
@Service
public class BazarService {

    @Autowired
    private BazarRepository bazarRepository;

    /**
     * Listar todos os bazares
     */
    public List<BazarDTO> listarTodos() {
        return bazarRepository.findAll()
                .stream()
                .map(BazarDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Buscar bazar por ID
     */
    public BazarDTO buscarPorId(Long id) {
        Bazar bazar = bazarRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bazar não encontrado com ID: " + id));
        return BazarDTO.fromEntity(bazar);
    }

    /**
     * Criar novo bazar
     */
    public BazarDTO criar(BazarDTO bazarDTO) {
        // Validações
        if (bazarDTO.getNome() == null || bazarDTO.getNome().trim().isEmpty()) {
            throw new RuntimeException("Nome é obrigatório");
        }
        if (bazarDTO.getCategoria() == null || bazarDTO.getCategoria().trim().isEmpty()) {
            throw new RuntimeException("Categoria é obrigatória");
        }

        Bazar bazar = bazarDTO.toEntity();
        Bazar bazarSalvo = bazarRepository.save(bazar);
        return BazarDTO.fromEntity(bazarSalvo);
    }

    /**
     * Atualizar bazar existente
     */
    public BazarDTO atualizar(Long id, BazarDTO bazarDTO) {
        // Verificar se o bazar existe
        Bazar bazarExistente = bazarRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bazar não encontrado com ID: " + id));

        // Validações
        if (bazarDTO.getNome() == null || bazarDTO.getNome().trim().isEmpty()) {
            throw new RuntimeException("Nome é obrigatório");
        }
        if (bazarDTO.getCategoria() == null || bazarDTO.getCategoria().trim().isEmpty()) {
            throw new RuntimeException("Categoria é obrigatória");
        }

        // Atualizar dados
        bazarExistente.setNome(bazarDTO.getNome());
        bazarExistente.setDescricao(bazarDTO.getDescricao());
        bazarExistente.setImagem(bazarDTO.getImagem());
        bazarExistente.setCategoria(bazarDTO.getCategoria());
        bazarExistente.setTelefone(bazarDTO.getTelefone());
        bazarExistente.setHorario(bazarDTO.getHorario());

        // Atualizar endereço
        if (bazarDTO.getEndereco() != null) {
            bazarExistente.setCep(bazarDTO.getEndereco().getCep());
            bazarExistente.setRua(bazarDTO.getEndereco().getRua());
            bazarExistente.setNumero(bazarDTO.getEndereco().getNumero());
            bazarExistente.setBairro(bazarDTO.getEndereco().getBairro());
            bazarExistente.setCidade(bazarDTO.getEndereco().getCidade());
        }

        Bazar bazarAtualizado = bazarRepository.save(bazarExistente);
        return BazarDTO.fromEntity(bazarAtualizado);
    }

    /**
     * Deletar bazar
     */
    public void deletar(Long id) {
        Bazar bazar = bazarRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bazar não encontrado com ID: " + id));
        bazarRepository.delete(bazar);
    }

    /**
     * Buscar bazares com filtros
     */
    public List<BazarDTO> buscarComFiltros(String categoria, String busca) {
        List<Bazar> bazares;

        if (categoria != null && !categoria.equals("Todos") && busca != null && !busca.isEmpty()) {
            // Filtrar por categoria e busca
            bazares = bazarRepository.findByCategoriaAndBusca(categoria, busca);
        } else if (categoria != null && !categoria.equals("Todos")) {
            // Filtrar apenas por categoria
            bazares = bazarRepository.findByCategoria(categoria);
        } else if (busca != null && !busca.isEmpty()) {
            // Filtrar apenas por busca
            bazares = bazarRepository.findByBusca(busca);
        } else {
            // Sem filtros, retornar todos
            bazares = bazarRepository.findAll();
        }

        return bazares.stream()
                .map(BazarDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Buscar bazares por cidade
     */
    public List<BazarDTO> buscarPorCidade(String cidade) {
        return bazarRepository.findByCidadeContainingIgnoreCase(cidade)
                .stream()
                .map(BazarDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Contar total de bazares
     */
    public Long contarTotal() {
        return bazarRepository.count();
    }

    /**
     * Contar bazares por categoria
     */
    public Long contarPorCategoria(String categoria) {
        return bazarRepository.countByCategoria(categoria);
    }
}
