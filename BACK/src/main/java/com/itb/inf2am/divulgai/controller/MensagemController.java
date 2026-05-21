package com.itb.inf2am.divulgai.controller;

import com.itb.inf2am.divulgai.dto.MensagemCreateDTO;
import com.itb.inf2am.divulgai.dto.MensagemResponseDTO;
import com.itb.inf2am.divulgai.model.entity.Mensagem;
import com.itb.inf2am.divulgai.model.services.MensagemService;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/mensagens")
public class MensagemController {

    private final MensagemService mensagemService;

    public MensagemController(MensagemService mensagemService) {
        this.mensagemService = mensagemService;
    }

    @PostMapping
    public ResponseEntity<MensagemResponseDTO> enviarMensagem(@Valid @RequestBody MensagemCreateDTO dados) {
        Mensagem novaMensagem = mensagemService.enviarMensagem(dados.toEntity());
        return ResponseEntity.ok(new MensagemResponseDTO(novaMensagem));
    }

    @GetMapping("/conversa/{userId}/{bazarId}")
    public ResponseEntity<List<MensagemResponseDTO>> buscarConversa(@PathVariable Long userId, @PathVariable String bazarId) {
        return ResponseEntity.ok(toResponseList(mensagemService.buscarConversa(userId, bazarId)));
    }

    @GetMapping("/recebidas/{userId}")
    public ResponseEntity<List<MensagemResponseDTO>> buscarMensagensRecebidas(@PathVariable Long userId) {
        return ResponseEntity.ok(toResponseList(mensagemService.buscarMensagensRecebidas(userId)));
    }

    @GetMapping("/enviadas/{userId}")
    public ResponseEntity<List<MensagemResponseDTO>> buscarMensagensEnviadas(@PathVariable Long userId) {
        return ResponseEntity.ok(toResponseList(mensagemService.buscarMensagensEnviadas(userId)));
    }

    @GetMapping("/nao-lidas/{userId}")
    public ResponseEntity<Map<String, Long>> contarMensagensNaoLidas(@PathVariable Long userId) {
        return ResponseEntity.ok(mensagemService.contarMensagensNaoLidas(userId));
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
    public ResponseEntity<List<MensagemResponseDTO>> buscarMensagensDoBazar(@PathVariable String bazarId, @RequestParam Long userId) {
        return ResponseEntity.ok(toResponseList(mensagemService.buscarMensagensDoBazar(bazarId, userId)));
    }

    @GetMapping("/conversas/{userId}")
    public ResponseEntity<List<MensagemResponseDTO>> buscarTodasConversas(@PathVariable Long userId) {
        return ResponseEntity.ok(toResponseList(mensagemService.buscarTodasConversas(userId)));
    }

    @GetMapping("/conversas-dono/{userId}")
    public ResponseEntity<List<MensagemResponseDTO>> buscarConversasDono(@PathVariable Long userId) {
        return ResponseEntity.ok(toResponseList(mensagemService.buscarConversasDono(userId)));
    }

    private List<MensagemResponseDTO> toResponseList(List<Mensagem> mensagens) {
        return mensagens.stream().map(MensagemResponseDTO::new).collect(Collectors.toList());
    }
}
