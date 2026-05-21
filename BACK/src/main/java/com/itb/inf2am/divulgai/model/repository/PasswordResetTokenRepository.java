package com.itb.inf2am.divulgai.model.repository;

import com.itb.inf2am.divulgai.model.entity.PasswordResetToken;
import com.itb.inf2am.divulgai.model.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(String token);

    List<PasswordResetToken> findByUsuario(Usuario usuario);

    void deleteByUsuario(Usuario usuario);

    // Find all expired tokens
    List<PasswordResetToken> findByExpiresAtBeforeAndUsedFalse(java.time.LocalDateTime date);
}