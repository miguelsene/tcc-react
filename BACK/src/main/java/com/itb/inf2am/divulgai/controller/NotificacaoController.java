package com.itb.inf2am.divulgai.controller;

import com.itb.inf2am.divulgai.model.entity.Notificacao;
import com.itb.inf2am.divulgai.model.repository.NotificacaoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notificacoes")
public class NotificacaoController {

    private final NotificacaoRepository notificacaoRepository;

    public NotificacaoController(NotificacaoRepository notificacaoRepository) {
        this.notificacaoRepository = notificacaoRepository;
    }

    // Listar todas as notificações de um usuário
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Notificacao>> findByUsuario(@PathVariable Long usuarioId) {
        List<Notificacao> notificacoes = notificacaoRepository.findByUsuarioIdOrderByDataCriacaoDesc(usuarioId);
        return ResponseEntity.ok(notificacoes);
    }

    // Listar notificações não lidas
    @GetMapping("/usuario/{usuarioId}/nao-lidas")
    public ResponseEntity<List<Notificacao>> findNaoLidas(@PathVariable Long usuarioId) {
        List<Notificacao> notificacoes = notificacaoRepository.findByUsuarioIdAndLidaFalseOrderByDataCriacaoDesc(usuarioId);
        return ResponseEntity.ok(notificacoes);
    }

    // Contar notificações não lidas
    @GetMapping("/usuario/{usuarioId}/contador")
    public ResponseEntity<Map<String, Object>> contarNaoLidas(@PathVariable Long usuarioId) {
        long count = notificacaoRepository.countByUsuarioIdAndLidaFalse(usuarioId);
        Map<String, Object> response = new HashMap<>();
        response.put("naoLidas", count);
        return ResponseEntity.ok(response);
    }

    // Marcar notificação como lida
    @PutMapping("/{id}/ler")
    public ResponseEntity<Map<String, String>> marcarComoLida(
            @PathVariable Long id,
            @RequestParam Long usuarioId) {
        notificacaoRepository.marcarComoLida(id, usuarioId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Notificação marcada como lida");
        return ResponseEntity.ok(response);
    }

    // Marcar todas como lidas
    @PutMapping("/usuario/{usuarioId}/ler-todas")
    public ResponseEntity<Map<String, String>> marcarTodasComoLidas(@PathVariable Long usuarioId) {
        notificacaoRepository.marcarTodasComoLidas(usuarioId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Todas as notificações marcadas como lidas");
        return ResponseEntity.ok(response);
    }

    // Criar nova notificação
    @PostMapping
    public ResponseEntity<Notificacao> criarNotificacao(@RequestBody Notificacao notificacao) {
        Notificacao saved = notificacaoRepository.save(notificacao);
        return ResponseEntity.ok(saved);
    }

    // Deletar notificação
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deletarNotificacao(
            @PathVariable Long id,
            @RequestParam Long usuarioId) {
        Notificacao notificacao = notificacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notificação não encontrada"));
        
        if (!notificacao.getUsuarioId().equals(usuarioId)) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Não autorizado a deletar esta notificação");
            return ResponseEntity.status(403).body(error);
        }
        
        notificacaoRepository.delete(notificacao);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Notificação deletada com sucesso");
        return ResponseEntity.ok(response);
    }

    // Limpar todas as notificações de um usuário
    @DeleteMapping("/usuario/{usuarioId}/todas")
    public ResponseEntity<Map<String, String>> limparTodas(@PathVariable Long usuarioId) {
        notificacaoRepository.deleteByUsuarioId(usuarioId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Todas as notificações foram removidas");
        return ResponseEntity.ok(response);
    }
}
