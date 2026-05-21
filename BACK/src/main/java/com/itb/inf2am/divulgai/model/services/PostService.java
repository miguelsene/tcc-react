package com.itb.inf2am.divulgai.model.services;

import com.itb.inf2am.divulgai.model.entity.Post;
import com.itb.inf2am.divulgai.model.repository.PostRepository;
import com.itb.inf2am.divulgai.model.repository.PostLikeRepository;
import com.itb.inf2am.divulgai.model.repository.UsuarioRepository;
import com.itb.inf2am.divulgai.model.entity.PostLike;
import com.itb.inf2am.divulgai.model.entity.Usuario;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {
    
    private final PostRepository postRepository;
    private final PostLikeRepository postLikeRepository;
    private final UsuarioRepository usuarioRepository;

    public PostService(PostRepository postRepository, PostLikeRepository postLikeRepository, UsuarioRepository usuarioRepository) {
        this.postRepository = postRepository;
        this.postLikeRepository = postLikeRepository;
        this.usuarioRepository = usuarioRepository;
    }
    
    // Listar todos os posts ativos
    public List<Post> findAll() {
        return postRepository.findByAtivoTrueOrderByDataCriacaoDesc();
    }
    
    // Buscar post por ID
    public Post findById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post não encontrado com o id: " + id));
    }
    
    // Salvar post
    public Post save(Post post) {
        return postRepository.save(post);
    }
    
    // Buscar posts de um usuário
    public List<Post> findByUsuario(Long usuarioId) {
        return postRepository.findByUsuarioIdAndAtivoTrueOrderByDataCriacaoDesc(usuarioId);
    }
    
    // Buscar posts por título
    public List<Post> findByTitulo(String titulo) {
        return postRepository.findByTituloContainingIgnoreCaseAndAtivoTrueOrderByDataCriacaoDesc(titulo);
    }
    
    // Buscar posts mais curtidos
    public List<Post> findTopCurtidos() {
        return postRepository.findTopCurtidos();
    }
    
    // Alternar curtida por usuário (toggle)
    public Post toggleLike(Long postId, Long usuarioId) {
        Post post = findById(postId);
        if (!usuarioRepository.existsById(usuarioId)) {
            throw new RuntimeException("Usuário não encontrado");
        }
        boolean alreadyLiked = postLikeRepository.existsByPostIdAndUsuarioId(postId, usuarioId);
        if (alreadyLiked) {
            postLikeRepository.deleteByPostIdAndUsuarioId(postId, usuarioId);
            post.setCurtidas(Math.max(0, post.getCurtidas() - 1));
        } else {
            Usuario usuario = usuarioRepository.findById(usuarioId).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            PostLike like = new PostLike(post, usuario);
            postLikeRepository.save(like);
            post.setCurtidas(post.getCurtidas() + 1);
        }
        return postRepository.save(post);
    }
    
    // Deletar post (soft delete)
    public void delete(Long id) {
        Post post = findById(id);
        post.setAtivo(false);
        postRepository.save(post);
    }
}
