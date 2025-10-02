package com.fashionspace.repository;

import com.fashionspace.model.Bazar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository para Bazar
 * Interface que faz a comunicação com o banco de dados
 * O Spring cria automaticamente os métodos básicos (save, findAll, findById, delete, etc)
 */
@Repository
public interface BazarRepository extends JpaRepository<Bazar, Long> {

    /**
     * Buscar bazares por categoria
     */
    List<Bazar> findByCategoria(String categoria);

    /**
     * Buscar bazares por nome (contém o texto)
     */
    List<Bazar> findByNomeContainingIgnoreCase(String nome);

    /**
     * Buscar bazares por categoria e nome
     */
    @Query("SELECT b FROM Bazar b WHERE b.categoria = :categoria AND " +
           "(LOWER(b.nome) LIKE LOWER(CONCAT('%', :busca, '%')) OR " +
           "LOWER(b.descricao) LIKE LOWER(CONCAT('%', :busca, '%')))")
    List<Bazar> findByCategoriaAndBusca(
        @Param("categoria") String categoria, 
        @Param("busca") String busca
    );

    /**
     * Buscar bazares por nome ou descrição
     */
    @Query("SELECT b FROM Bazar b WHERE " +
           "LOWER(b.nome) LIKE LOWER(CONCAT('%', :busca, '%')) OR " +
           "LOWER(b.descricao) LIKE LOWER(CONCAT('%', :busca, '%'))")
    List<Bazar> findByBusca(@Param("busca") String busca);

    /**
     * Buscar bazares por cidade
     */
    List<Bazar> findByCidadeContainingIgnoreCase(String cidade);

    /**
     * Contar bazares por categoria
     */
    Long countByCategoria(String categoria);
}
