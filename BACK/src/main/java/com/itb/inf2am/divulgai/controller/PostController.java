package com.itb.inf2am.divulgai.controller;

import com.itb.inf2am.divulgai.model.entity.Post;
import com.itb.inf2am.divulgai.model.services.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {
    
    @Autowired
    private PostService postService;
    
    // Listar todos os posts (Feed)
    @GetMapping
    public ResponseEntity<List<Post>> findAll() {
        return ResponseEntity.ok(postService.findAll());
    }
    
    // Buscar post por ID
    @GetMapping("/{id}")
    public ResponseEntity<Object> findById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(postService.findById(Long.parseLong(id)));
        } catch (NumberFormatException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", 400);
            errorResponse.put("error", "Bad Request");
            errorResponse.put("message", "O id informado não é válido: " + id);
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", 404);
            errorResponse.put("error", "Not Found");
            errorResponse.put("message", "Post não encontrado com o id " + id);
            return ResponseEntity.status(404).body(errorResponse);
        }
    }
    
    // Criar novo post
    @PostMapping
    public ResponseEntity<Post> create(@RequestBody Post post) {
        return ResponseEntity.ok(postService.save(post));
    }
    
    // Atualizar post
    @PutMapping("/{id}")
    public ResponseEntity<Object> update(@PathVariable String id, @RequestBody Post post) {
        try {
            Long postId = Long.parseLong(id);
            Post postExistente = postService.findById(postId);
            
            postExistente.setTitulo(post.getTitulo());
            postExistente.setConteudo(post.getConteudo());
            postExistente.setImagem(post.getImagem());
            
            Post postAtualizado = postService.save(postExistente);
            return ResponseEntity.ok(postAtualizado);
            
        } catch (NumberFormatException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", 400);
            errorResponse.put("error", "Bad Request");
            errorResponse.put("message", "O id informado não é válido: " + id);
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", 404);
            errorResponse.put("error", "Not Found");
            errorResponse.put("message", "Post não encontrado com o id " + id);
            return ResponseEntity.status(404).body(errorResponse);
        }
    }
    
    // Deletar post
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable String id) {
        try {
            Long postId = Long.parseLong(id);
            postService.delete(postId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Post deletado com sucesso");
            return ResponseEntity.ok(response);
        } catch (NumberFormatException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", 400);
            errorResponse.put("error", "Bad Request");
            errorResponse.put("message", "O id informado não é válido: " + id);
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", 404);
            errorResponse.put("error", "Not Found");
            errorResponse.put("message", "Post não encontrado com o id " + id);
            return ResponseEntity.status(404).body(errorResponse);
        }
    }
    
    // Buscar posts de um usuário
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Post>> findByUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(postService.findByUsuario(usuarioId));
    }
    
    // Buscar posts por título
    @GetMapping("/buscar")
    public ResponseEntity<List<Post>> findByTitulo(@RequestParam String titulo) {
        return ResponseEntity.ok(postService.findByTitulo(titulo));
    }
    
    // Posts mais curtidos
    @GetMapping("/top-curtidos")
    public ResponseEntity<List<Post>> findTopCurtidos() {
        return ResponseEntity.ok(postService.findTopCurtidos());
    }
    
    // Curtir post
    @PostMapping("/{id}/curtir")
    public ResponseEntity<Post> curtirPost(@PathVariable Long id) {
        try {
            Post post = postService.curtirPost(id);
            return ResponseEntity.ok(post);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}