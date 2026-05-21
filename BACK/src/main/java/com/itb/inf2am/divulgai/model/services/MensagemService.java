package com.itb.inf2am.divulgai.model.services;

import com.itb.inf2am.divulgai.model.entity.Mensagem;
import com.itb.inf2am.divulgai.model.repository.MensagemRepository;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class MensagemService {

    private static final Logger LOGGER = LoggerFactory.getLogger(MensagemService.class);

    private final MensagemRepository mensagemRepository;

    public MensagemService(MensagemRepository mensagemRepository) {
        this.mensagemRepository = mensagemRepository;
    }

    public Mensagem enviarMensagem(Mensagem mensagem) {
        mensagem.setDataEnvio(LocalDateTime.now());
        mensagem.setLida(false);
        mensagem.setAtiva(true);

        Mensagem saved = mensagemRepository.save(mensagem);
        LOGGER.info("[FashionSpace] Mensagem salva com id {}", saved.getId());
        return saved;
    }

    public List<Mensagem> buscarConversa(Long userId, String bazarId) {
        return mensagemRepository.findConversaBetweenUserAndBazar(userId, bazarId);
    }

    public List<Mensagem> buscarMensagensRecebidas(Long userId) {
        return mensagemRepository.findByDestinatarioIdAndAtivaTrue(userId);
    }

    public List<Mensagem> buscarMensagensEnviadas(Long userId) {
        return mensagemRepository.findByRemetenteIdAndAtivaTrue(userId);
    }

    public Map<String, Long> contarMensagensNaoLidas(Long userId) {
        Long count = mensagemRepository.countByDestinatarioIdAndLidaFalseAndAtivaTrue(userId);
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return response;
    }

    public void marcarComoLida(Long mensagemId) {
        mensagemRepository.marcarComoLida(mensagemId);
    }

    public void marcarConversaComoLida(Long userId, String bazarId) {
        mensagemRepository.marcarConversaComoLida(userId, bazarId);
    }

    public List<Mensagem> buscarMensagensDoBazar(String bazarId, Long userId) {
        return mensagemRepository.findConversaBetweenUserAndBazar(userId, bazarId);
    }

    public void limparMensagensAntigas() {
        mensagemRepository.deleteByDataEnvioBeforeAndAtivaTrue(LocalDateTime.now().minusDays(7));
    }

    public List<Mensagem> buscarTodasConversas(Long userId) {
        return mensagemRepository.findLatestMessagesByUser(userId);
    }

    public List<Mensagem> buscarConversasDono(Long userId) {
        return mensagemRepository.findLatestMessagesByUser(userId);
    }
}
