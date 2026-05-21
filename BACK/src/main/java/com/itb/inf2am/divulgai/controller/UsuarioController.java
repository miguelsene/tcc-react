package com.itb.inf2am.divulgai.controller;

import com.itb.inf2am.divulgai.dto.EsqueciSenhaDTO;
import com.itb.inf2am.divulgai.dto.ResetSenhaDTO;
import com.itb.inf2am.divulgai.dto.UsuarioCreateDTO;
import com.itb.inf2am.divulgai.dto.UsuarioLoginDTO;
import com.itb.inf2am.divulgai.dto.UsuarioResponseDTO;
import com.itb.inf2am.divulgai.dto.UsuarioUpdateDTO;
import com.itb.inf2am.divulgai.model.entity.Usuario;
import com.itb.inf2am.divulgai.model.services.UsuarioService;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuario")
public class UsuarioController {

    private static final String STATUS = "status";
    private static final String ERROR = "error";
    private static final String MESSAGE = "message";
    private static final String PERFIL_PUBLICO = "perfilPublico";
    private static final String RECEBER_MENSAGENS = "receberMensagens";
    private static final String PERMITIR_NOTIFICACOES = "permitirNotificacoes";
    private static final String COMPARTILHAR_ATIVIDADE = "compartilharAtividade";
    private static final String NOTIFICACOES_EMAIL = "notificacoesEmail";
    private static final String NOTIFICACOES_PUSH = "notificacoesPush";

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("API funcionando! Servidor ativo em: " + LocalDateTime.now());
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Conexao OK - CORS funcionando!");
    }

    @GetMapping("/health")
    public ResponseEntity<Object> health() {
        Map<String, Object> response = new HashMap<>();
        response.put(STATUS, "UP");
        response.put("timestamp", LocalDateTime.now());
        response.put("service", "FashionSpace API");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/findAll")
    public ResponseEntity<List<UsuarioResponseDTO>> findAll() {
        return ResponseEntity.ok(usuarioService.findAll().stream()
                .map(UsuarioResponseDTO::new)
                .collect(Collectors.toList()));
    }

    @PostMapping
    public ResponseEntity<Object> create(@Valid @RequestBody UsuarioCreateDTO dados) {
        if (usuarioService.emailExiste(dados.getEmail())) {
            return ResponseEntity.badRequest().body(message("Email ja cadastrado"));
        }

        Usuario usuario = dados.toEntity();
        if (isBlank(usuario.getTipoUsuario())) {
            usuario.setTipoUsuario("casual");
        }

        return ResponseEntity.ok(new UsuarioResponseDTO(usuarioService.save(usuario)));
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@Valid @RequestBody UsuarioLoginDTO dados) {
        Usuario usuario = usuarioService.login(dados.getEmail(), dados.getSenha());
        if (usuario != null) {
            return ResponseEntity.ok(new UsuarioResponseDTO(usuario));
        }
        return ResponseEntity.status(401).body(message("Email ou senha incorretos"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> listarUsuarioPorId(@PathVariable String id) {
        try {
            return ResponseEntity.ok(new UsuarioResponseDTO(usuarioService.findById(Long.parseLong(id))));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(error(400, "Bad Request", "O id informado nao e valido: " + id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(error(404, "Not Found", "Usuario nao encontrado com o id " + id));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> atualizarUsuario(@PathVariable String id, @Valid @RequestBody UsuarioUpdateDTO dados) {
        try {
            Usuario usuarioExistente = usuarioService.findById(Long.parseLong(id));
            boolean senhaAlterada = aplicarAtualizacaoUsuario(usuarioExistente, dados);
            Usuario usuarioAtualizado = usuarioService.saveProfileUpdate(usuarioExistente, senhaAlterada);
            return ResponseEntity.ok(new UsuarioResponseDTO(usuarioAtualizado));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(statusMessage(400, "O id informado nao e valido: " + id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(statusMessage(404, "Usuario nao encontrado"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(statusMessage(500, "Erro ao atualizar usuario"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> excluirUsuario(@PathVariable String id) {
        try {
            usuarioService.delete(Long.parseLong(id));
            return ResponseEntity.ok(message("Usuario deletado com sucesso"));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(error(400, "Bad Request", "O id informado nao e valido: " + id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(error(404, "Not Found", "Usuario nao encontrado com o id " + id));
        }
    }

    @PostMapping("/esqueci-senha")
    public ResponseEntity<Object> esqueceuSenha(@Valid @RequestBody EsqueciSenhaDTO dados) {
        usuarioService.solicitarResetSenha(dados.getEmail());
        return ResponseEntity.ok(message("Se o email existe, um link de reset foi enviado"));
    }

    @PostMapping("/confirmar-reset-senha")
    public ResponseEntity<Object> confirmarResetSenha(@Valid @RequestBody ResetSenhaDTO dados) {
        if (usuarioService.confirmarResetSenha(dados.getToken(), dados.getNovaSenha())) {
            return ResponseEntity.ok(message("Senha resetada com sucesso"));
        }

        return ResponseEntity.status(401).body(message("Token invalido ou expirado"));
    }

    @PutMapping("/{id}/privacidade")
    public ResponseEntity<Object> atualizarPrivacidade(@PathVariable String id, @RequestBody Map<String, Boolean> settings) {
        try {
            Usuario usuario = usuarioService.findById(Long.parseLong(id));
            aplicarPrivacidade(usuario, settings);
            return ResponseEntity.ok(new UsuarioResponseDTO(usuarioService.saveProfileUpdate(usuario, false)));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(message("ID invalido"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(message("Usuario nao encontrado"));
        }
    }

    @GetMapping("/{id}/privacidade")
    public ResponseEntity<Object> getPrivacidade(@PathVariable String id) {
        try {
            Usuario usuario = usuarioService.findById(Long.parseLong(id));
            Map<String, Object> settings = new HashMap<>();
            settings.put(PERFIL_PUBLICO, usuario.getPerfilPublico());
            settings.put(RECEBER_MENSAGENS, usuario.getReceberMensagens());
            settings.put(PERMITIR_NOTIFICACOES, usuario.getPermitirNotificacoes());
            settings.put(COMPARTILHAR_ATIVIDADE, usuario.getCompartilharAtividade());
            settings.put(NOTIFICACOES_EMAIL, usuario.getNotificacoesEmail());
            settings.put(NOTIFICACOES_PUSH, usuario.getNotificacoesPush());
            return ResponseEntity.ok(settings);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(message("ID invalido"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(message("Usuario nao encontrado"));
        }
    }

    private boolean aplicarAtualizacaoUsuario(Usuario usuario, UsuarioUpdateDTO dados) {
        if (!isBlank(dados.getNome())) {
            usuario.setNome(dados.getNome().trim());
        }
        if (!isBlank(dados.getEmail())) {
            usuario.setEmail(dados.getEmail().trim());
        }
        if (!isBlank(dados.getTipoUsuario())) {
            usuario.setTipoUsuario(dados.getTipoUsuario().trim());
        }
        if (dados.getFotoPerfil() != null) {
            usuario.setFotoPerfil(dados.getFotoPerfil());
        }
        if (!isBlank(dados.getSenha())) {
            usuario.setSenha(dados.getSenha());
            return true;
        }
        return false;
    }

    private void aplicarPrivacidade(Usuario usuario, Map<String, Boolean> settings) {
        setBooleanIfPresent(settings, PERFIL_PUBLICO, usuario::setPerfilPublico);
        setBooleanIfPresent(settings, RECEBER_MENSAGENS, usuario::setReceberMensagens);
        setBooleanIfPresent(settings, PERMITIR_NOTIFICACOES, usuario::setPermitirNotificacoes);
        setBooleanIfPresent(settings, COMPARTILHAR_ATIVIDADE, usuario::setCompartilharAtividade);
        setBooleanIfPresent(settings, NOTIFICACOES_EMAIL, usuario::setNotificacoesEmail);
        setBooleanIfPresent(settings, NOTIFICACOES_PUSH, usuario::setNotificacoesPush);
    }

    private void setBooleanIfPresent(Map<String, ?> values, String key, BooleanSetter setter) {
        Object value = values.get(key);
        if (value instanceof Boolean) {
            setter.set((Boolean) value);
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private Map<String, String> message(String message) {
        Map<String, String> response = new HashMap<>();
        response.put(MESSAGE, message);
        return response;
    }

    private Map<String, Object> statusMessage(int status, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put(STATUS, status);
        response.put(MESSAGE, message);
        return response;
    }

    private Map<String, Object> error(int status, String error, String message) {
        Map<String, Object> response = statusMessage(status, message);
        response.put(ERROR, error);
        return response;
    }

    private interface BooleanSetter {
        void set(Boolean value);
    }
}
