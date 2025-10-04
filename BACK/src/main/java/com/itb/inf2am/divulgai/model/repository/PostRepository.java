package com.itb.inf2am.divulgai.model.repository;

import com.itb.inf2am.divulgai.model.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    
    // Buscar posts ativos ordenados por data (mais recentes primeiro)
    List<Post> findByAtivoTrueOrderByDataCriacaoDesc();
    
    // Buscar posts de um usuário específico
    List<Post> findByUsuarioIdAndAtivoTrueOrderByDataCriacaoDesc(Long usuarioId);
    
    // Buscar posts por título
    List<Post> findByTituloContainingIgnoreCaseAndAtivoTrueOrderByDataCriacaoDesc(String titulo);
    
    // Buscar posts mais curtidos
    @Query("SELECT p FROM Post p WHERE p.ativo = true ORDER BY p.curtidas DESC")
    List<Post> findTopCurtidos();
}