package com.itb.inf2am.divulgai.model.services;

import com.itb.inf2am.divulgai.model.entity.Post;
import com.itb.inf2am.divulgai.model.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {
    
    @Autowired
    private PostRepository postRepository;
    
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
    
    // Curtir post
    public Post curtirPost(Long id) {
        Post post = findById(id);
        post.setCurtidas(post.getCurtidas() + 1);
        return postRepository.save(post);
    }
    
    // Deletar post (soft delete)
    public void delete(Long id) {
        Post post = findById(id);
        post.setAtivo(false);
        postRepository.save(post);
    }
}