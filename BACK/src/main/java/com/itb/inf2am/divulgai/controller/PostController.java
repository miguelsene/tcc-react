package com.itb.inf2am.divulgai.controller;

import com.itb.inf2am.divulgai.dto.PostCreateDTO;
import com.itb.inf2am.divulgai.dto.PostResponseDTO;
import com.itb.inf2am.divulgai.dto.PostUpdateDTO;
import com.itb.inf2am.divulgai.model.entity.Post;
import com.itb.inf2am.divulgai.model.entity.PostComment;
import com.itb.inf2am.divulgai.model.entity.Usuario;
import com.itb.inf2am.divulgai.model.repository.PostCommentRepository;
import com.itb.inf2am.divulgai.model.repository.UsuarioRepository;
import com.itb.inf2am.divulgai.model.services.PostService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;
    private final PostCommentRepository postCommentRepository;
    private final UsuarioRepository usuarioRepository;

    public PostController(
            PostService postService,
            PostCommentRepository postCommentRepository,
            UsuarioRepository usuarioRepository) {
        this.postService = postService;
        this.postCommentRepository = postCommentRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public ResponseEntity<List<PostResponseDTO>> findAll() {
        return ResponseEntity.ok(toResponseList(postService.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> findById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(new PostResponseDTO(postService.findById(Long.parseLong(id))));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(error(400, "Bad Request", "O id informado nao e valido: " + id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(error(404, "Not Found", "Post nao encontrado com o id " + id));
        }
    }

    @PostMapping
    public ResponseEntity<PostResponseDTO> create(@Valid @RequestBody PostCreateDTO dados) {
        return ResponseEntity.ok(new PostResponseDTO(postService.save(dados.toEntity())));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> update(@PathVariable String id, @Valid @RequestBody PostUpdateDTO dados) {
        try {
            Post postExistente = postService.findById(Long.parseLong(id));
            postExistente.setTitulo(dados.getTitulo());
            postExistente.setConteudo(dados.getConteudo());
            postExistente.setImagem(dados.getImagem());
            return ResponseEntity.ok(new PostResponseDTO(postService.save(postExistente)));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(error(400, "Bad Request", "O id informado nao e valido: " + id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(error(404, "Not Found", "Post nao encontrado com o id " + id));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable String id) {
        try {
            postService.delete(Long.parseLong(id));
            return ResponseEntity.ok(message("Post deletado com sucesso"));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(error(400, "Bad Request", "O id informado nao e valido: " + id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(error(404, "Not Found", "Post nao encontrado com o id " + id));
        }
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<PostResponseDTO>> findByUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(toResponseList(postService.findByUsuario(usuarioId)));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<PostResponseDTO>> findByTitulo(@RequestParam String titulo) {
        return ResponseEntity.ok(toResponseList(postService.findByTitulo(titulo)));
    }

    @GetMapping("/top-curtidos")
    public ResponseEntity<List<PostResponseDTO>> findTopCurtidos() {
        return ResponseEntity.ok(toResponseList(postService.findTopCurtidos()));
    }

    @PostMapping("/{id}/curtir")
    public ResponseEntity<PostResponseDTO> curtirPost(@PathVariable Long id, @RequestParam(required = true) Long usuarioId) {
        try {
            return ResponseEntity.ok(new PostResponseDTO(postService.toggleLike(id, usuarioId)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}/comentarios")
    public ResponseEntity<List<PostComment>> getComentarios(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(postCommentRepository.findByPostIdOrderByDataCriacaoDesc(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/comentarios")
    public ResponseEntity<PostComment> addComentario(
            @PathVariable Long id,
            @RequestParam Long usuarioId,
            @RequestBody Map<String, String> body) {
        try {
            String conteudo = body.get("conteudo");
            if (conteudo == null || conteudo.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            Post post = postService.findById(id);
            Usuario usuario = usuarioRepository.findById(usuarioId)
                    .orElseThrow(() -> new RuntimeException("Usuario nao encontrado"));
            return ResponseEntity.ok(postCommentRepository.save(new PostComment(post, usuario, conteudo)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    private List<PostResponseDTO> toResponseList(List<Post> posts) {
        return posts.stream().map(PostResponseDTO::new).collect(Collectors.toList());
    }

    private Map<String, String> message(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return response;
    }

    private Map<String, Object> error(int status, String error, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", status);
        response.put("error", error);
        response.put("message", message);
        return response;
    }
}
