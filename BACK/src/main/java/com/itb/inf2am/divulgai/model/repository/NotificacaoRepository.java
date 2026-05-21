package com.itb.inf2am.divulgai.model.repository;

import com.itb.inf2am.divulgai.model.entity.Notificacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificacaoRepository extends JpaRepository<Notificacao, Long> {
    
    List<Notificacao> findByUsuarioIdOrderByDataCriacaoDesc(Long usuarioId);
    
    List<Notificacao> findByUsuarioIdAndLidaFalseOrderByDataCriacaoDesc(Long usuarioId);
    
    long countByUsuarioIdAndLidaFalse(Long usuarioId);
    
    @Modifying
    @Query("UPDATE Notificacao n SET n.lida = true WHERE n.usuarioId = :usuarioId")
    void marcarTodasComoLidas(@Param("usuarioId") Long usuarioId);
    
    @Modifying
    @Query("UPDATE Notificacao n SET n.lida = true WHERE n.id = :id AND n.usuarioId = :usuarioId")
    void marcarComoLida(@Param("id") Long id, @Param("usuarioId") Long usuarioId);
    
    void deleteByUsuarioId(Long usuarioId);
    
    List<Notificacao> findByUsuarioIdAndTipoOrderByDataCriacaoDesc(Long usuarioId, String tipo);
}