package com.itb.inf2am.divulgai.model.repository;

import com.itb.inf2am.divulgai.model.entity.CodigoVerificacao;
import com.itb.inf2am.divulgai.model.entity.Usuario;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CodigoVerificacaoRepository extends JpaRepository<CodigoVerificacao, Long> {
    Optional<CodigoVerificacao> findTopByUsuarioAndTipoAndUsadoFalseOrderByCriadoEmDesc(Usuario usuario, String tipo);
    List<CodigoVerificacao> findByUsuarioAndTipoAndUsadoFalse(Usuario usuario, String tipo);
}
