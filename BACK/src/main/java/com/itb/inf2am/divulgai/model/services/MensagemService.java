package com.itb.inf2am.divulgai.model.services;

import com.itb.inf2am.divulgai.model.entity.Mensagem;
import com.itb.inf2am.divulgai.model.repository.MensagemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MensagemService {

    @Autowired
    private MensagemRepository mensagemRepository;

    public Mensagem enviarMensagem(Mensagem mensagem) {
        System.out.println("=== ENVIANDO MENSAGEM ===");
        System.out.println("Remetente ID: " + mensagem.getRemetenteId());
        System.out.println("Destinatário ID: " + mensagem.getDestinatarioId());
        System.out.println("Bazar ID: " + mensagem.getBazarId());
        System.out.println("Conteúdo: " + mensagem.getConteudo());
        
        mensagem.setDataEnvio(LocalDateTime.now());
        mensagem.setLida(false);
        mensagem.setAtiva(true);
        
        Mensagem saved = mensagemRepository.save(mensagem);
        System.out.println("Mensagem salva com ID: " + saved.getId());
        System.out.println("Data de envio: " + saved.getDataEnvio());
        System.out.println("Ativa: " + saved.getAtiva());
        
        // Verificar se a mensagem foi realmente salva
        List<Mensagem> todasMensagens = mensagemRepository.findAllMessagesByBazar(mensagem.getBazarId());
        System.out.println("Total de mensagens no bazar após salvar: " + todasMensagens.size());
        
        return saved;
    }

    public List<Mensagem> buscarConversa(Long userId, String bazarId) {
        System.out.println("=== BUSCANDO CONVERSA ===");
        System.out.println("User ID: " + userId);
        System.out.println("Bazar ID: " + bazarId);
        
        // Sempre buscar todas as mensagens do bazar para simplificar
        List<Mensagem> mensagens = mensagemRepository.findAllMessagesByBazar(bazarId);
        
        System.out.println("Mensagens encontradas na conversa: " + mensagens.size());
        for (Mensagem msg : mensagens) {
            System.out.println("Mensagem - ID: " + msg.getId() + ", Remetente: " + msg.getRemetenteId() + ", Destinatário: " + msg.getDestinatarioId() + ", Conteúdo: " + msg.getConteudo());
        }
        return mensagens;
    }

    public List<Mensagem> buscarMensagensRecebidas(Long userId) {
        List<Mensagem> mensagens = mensagemRepository.findByDestinatarioIdAndAtivaTrue(userId);
        System.out.println("=== BUSCANDO MENSAGENS RECEBIDAS ===");
        System.out.println("User ID: " + userId);
        System.out.println("Mensagens encontradas: " + mensagens.size());
        return mensagens;
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

    public List<Mensagem> buscarMensagensDoBazar(String bazarId) {
        return mensagemRepository.findByBazarIdAndAtivaTrue(bazarId);
    }

    public void limparMensagensAntigas() {
        mensagemRepository.deleteByDataEnvioBeforeAndAtivaTrue(LocalDateTime.now().minusDays(7));
    }

    public List<Mensagem> buscarTodasConversas(Long userId) {
        System.out.println("=== BUSCANDO TODAS CONVERSAS ===");
        System.out.println("User ID: " + userId);
        List<Mensagem> conversas = mensagemRepository.findLatestMessagesByUser(userId);
        System.out.println("Conversas encontradas: " + conversas.size());
        for (Mensagem msg : conversas) {
            System.out.println("Conversa - Bazar: " + msg.getBazarId() + ", Remetente: " + msg.getRemetenteId() + ", Destinatário: " + msg.getDestinatarioId());
        }
        return conversas;
    }

    public List<Mensagem> buscarConversasDono(Long userId) {
        // Para donos, buscar mensagens onde ele é destinatário OU mensagens para admin (ID 1) se ele for dono
        List<Mensagem> conversas = mensagemRepository.findLatestMessagesByUser(userId);
        
        // Adicionar mensagens de bazares padrão (destinatário ID 1) se não existir usuário com ID 1
        List<Mensagem> mensagensAdmin = mensagemRepository.findLatestMessagesByUser(1L);
        
        // Combinar e remover duplicatas
        conversas.addAll(mensagensAdmin);
        
        return conversas.stream()
                .distinct()
                .sorted((m1, m2) -> m2.getDataEnvio().compareTo(m1.getDataEnvio()))
                .collect(Collectors.toList());
    }
}