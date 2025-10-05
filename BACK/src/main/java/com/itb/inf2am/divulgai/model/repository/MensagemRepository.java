package com.itb.inf2am.divulgai.model.repository;

import com.itb.inf2am.divulgai.model.entity.Mensagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MensagemRepository extends JpaRepository<Mensagem, Long> {

    @Query("SELECT m FROM Mensagem m WHERE " +
           "((m.remetenteId = :userId AND m.bazarId = :bazarId) OR " +
           "(m.destinatarioId = :userId AND m.bazarId = :bazarId)) " +
           "AND m.ativa = true ORDER BY m.dataEnvio ASC")
    List<Mensagem> findConversaBetweenUserAndBazar(@Param("userId") Long userId, @Param("bazarId") String bazarId);

    @Query("SELECT m FROM Mensagem m WHERE m.bazarId = :bazarId AND m.ativa = true ORDER BY m.dataEnvio ASC")
    List<Mensagem> findAllMessagesByBazar(@Param("bazarId") String bazarId);

    List<Mensagem> findByDestinatarioIdAndAtivaTrue(Long destinatarioId);
    
    List<Mensagem> findByRemetenteIdAndAtivaTrue(Long remetenteId);
    
    List<Mensagem> findByBazarIdAndAtivaTrue(String bazarId);

    Long countByDestinatarioIdAndLidaFalseAndAtivaTrue(Long destinatarioId);

    @Modifying
    @Transactional
    @Query("UPDATE Mensagem m SET m.lida = true WHERE m.id = :mensagemId")
    void marcarComoLida(@Param("mensagemId") Long mensagemId);

    @Modifying
    @Transactional
    @Query("UPDATE Mensagem m SET m.lida = true WHERE " +
           "m.destinatarioId = :userId AND m.bazarId = :bazarId AND m.ativa = true")
    void marcarConversaComoLida(@Param("userId") Long userId, @Param("bazarId") String bazarId);

    @Modifying
    @Transactional
    void deleteByDataEnvioBeforeAndAtivaTrue(LocalDateTime dataLimite);

    @Query("SELECT m FROM Mensagem m WHERE " +
           "(m.remetenteId = :userId OR m.destinatarioId = :userId) " +
           "AND m.ativa = true " +
           "AND m.dataEnvio = (" +
           "  SELECT MAX(m2.dataEnvio) FROM Mensagem m2 " +
           "  WHERE m2.bazarId = m.bazarId " +
           "  AND (m2.remetenteId = :userId OR m2.destinatarioId = :userId) " +
           "  AND m2.ativa = true" +
           ") ORDER BY m.dataEnvio DESC")
    List<Mensagem> findLatestMessagesByUser(@Param("userId") Long userId);
}