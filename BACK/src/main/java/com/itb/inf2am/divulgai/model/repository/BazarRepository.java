package com.itb.inf2am.divulgai.model.repository;

import com.itb.inf2am.divulgai.model.entity.Bazar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BazarRepository extends JpaRepository<Bazar, Long> {
    
    // Buscar bazares ativos
    List<Bazar> findByAtivoTrue();
    
    // Buscar por categoria
    List<Bazar> findByCategoriaAndAtivoTrue(String categoria);
    
    // Buscar por cidade
    List<Bazar> findByCidadeContainingIgnoreCaseAndAtivoTrue(String cidade);
    
    // Buscar por nome
    List<Bazar> findByNomeContainingIgnoreCaseAndAtivoTrue(String nome);
    
    // Buscar bazares de um usuário específico
    List<Bazar> findByUsuarioIdAndAtivoTrue(Long usuarioId);
    
    // Buscar bazares com avaliação mínima
    @Query("SELECT b FROM Bazar b WHERE b.avaliacao >= :avaliacao AND b.ativo = true ORDER BY b.avaliacao DESC")
    List<Bazar> findByAvaliacaoMinima(@Param("avaliacao") Double avaliacao);
    
    // Buscar bazares mais bem avaliados
    @Query("SELECT b FROM Bazar b WHERE b.ativo = true ORDER BY b.avaliacao DESC, b.totalAvaliacoes DESC")
    List<Bazar> findTopRated();
}