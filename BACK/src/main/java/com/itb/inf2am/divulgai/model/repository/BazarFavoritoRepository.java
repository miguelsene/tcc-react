package com.itb.inf2am.divulgai.model.repository;

import com.itb.inf2am.divulgai.model.entity.BazarFavorito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BazarFavoritoRepository extends JpaRepository<BazarFavorito, Long> {
    
    List<BazarFavorito> findByUsuarioId(Long usuarioId);
    
    Optional<BazarFavorito> findByUsuarioIdAndBazarId(Long usuarioId, Long bazarId);
    
    boolean existsByUsuarioIdAndBazarId(Long usuarioId, Long bazarId);
    
    void deleteByUsuarioIdAndBazarId(Long usuarioId, Long bazarId);
    
    @Query("SELECT bf FROM BazarFavorito bf JOIN FETCH bf.bazar WHERE bf.usuarioId = :usuarioId")
    List<BazarFavorito> findByUsuarioIdWithBazar(@Param("usuarioId") Long usuarioId);
}