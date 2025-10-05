package com.itb.inf2am.divulgai.controller;

import com.itb.inf2am.divulgai.model.entity.Mensagem;
import com.itb.inf2am.divulgai.model.services.MensagemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mensagens")
@CrossOrigin(origins = "*")
public class MensagemController {

    @Autowired
    private MensagemService mensagemService;

    @PostMapping
    public ResponseEntity<Mensagem> enviarMensagem(@RequestBody Mensagem mensagem) {
        Mensagem novaMensagem = mensagemService.enviarMensagem(mensagem);
        return ResponseEntity.ok(novaMensagem);
    }

    @GetMapping("/conversa/{userId}/{bazarId}")
    public ResponseEntity<List<Mensagem>> buscarConversa(@PathVariable Long userId, @PathVariable String bazarId) {
        List<Mensagem> mensagens = mensagemService.buscarConversa(userId, bazarId);
        return ResponseEntity.ok(mensagens);
    }

    @GetMapping("/recebidas/{userId}")
    public ResponseEntity<List<Mensagem>> buscarMensagensRecebidas(@PathVariable Long userId) {
        List<Mensagem> mensagens = mensagemService.buscarMensagensRecebidas(userId);
        return ResponseEntity.ok(mensagens);
    }

    @GetMapping("/enviadas/{userId}")
    public ResponseEntity<List<Mensagem>> buscarMensagensEnviadas(@PathVariable Long userId) {
        List<Mensagem> mensagens = mensagemService.buscarMensagensEnviadas(userId);
        return ResponseEntity.ok(mensagens);
    }

    @GetMapping("/nao-lidas/{userId}")
    public ResponseEntity<Map<String, Long>> contarMensagensNaoLidas(@PathVariable Long userId) {
        Map<String, Long> response = mensagemService.contarMensagensNaoLidas(userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/marcar-lida/{mensagemId}")
    public ResponseEntity<Void> marcarComoLida(@PathVariable Long mensagemId) {
        mensagemService.marcarComoLida(mensagemId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/marcar-conversa-lida/{userId}/{bazarId}")
    public ResponseEntity<Void> marcarConversaComoLida(@PathVariable Long userId, @PathVariable String bazarId) {
        mensagemService.marcarConversaComoLida(userId, bazarId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/bazar/{bazarId}")
    public ResponseEntity<List<Mensagem>> buscarMensagensDoBazar(@PathVariable String bazarId) {
        List<Mensagem> mensagens = mensagemService.buscarMensagensDoBazar(bazarId);
        return ResponseEntity.ok(mensagens);
    }

    @GetMapping("/conversas/{userId}")
    public ResponseEntity<List<Mensagem>> buscarTodasConversas(@PathVariable Long userId) {
        List<Mensagem> conversas = mensagemService.buscarTodasConversas(userId);
        return ResponseEntity.ok(conversas);
    }

    @GetMapping("/conversas-dono/{userId}")
    public ResponseEntity<List<Mensagem>> buscarConversasDono(@PathVariable Long userId) {
        List<Mensagem> conversas = mensagemService.buscarConversasDono(userId);
        return ResponseEntity.ok(conversas);
    }
}