package com.itb.inf2am.divulgai.model.services;


import com.itb.inf2am.divulgai.model.entity.Usuario;
import com.itb.inf2am.divulgai.model.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    @Autowired       // Injeção de dependência
    private UsuarioRepository usuarioRepository;

    // Método responsável em listar todos os Usuarios cadastrados no banco de dados

    public List<Usuario> findAll() {
        return usuarioRepository.findAll();

    }

    // Método responsável em Criar o Usuario no banco de dados
    public Usuario save(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }
    
    // Login
    public Usuario login(String email, String senha) {
        return usuarioRepository.findByEmailAndSenha(email, senha);
    }
    
    // Verificar se email existe
    public boolean emailExiste(String email) {
        return usuarioRepository.existsByEmail(email);
    }


    // Método responsável em listar o usuario por ID
    public Usuario findById (Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado com o id " + id));
    }

    // Método responsável em atualizar usuario
    public Usuario update(Long id, Usuario usuario) {
        Usuario usuarioExistente = findById(id);
        usuarioExistente.setNome(usuario.getNome());
        usuarioExistente.setEmail(usuario.getEmail());
        usuarioExistente.setSenha(usuario.getSenha());
        usuarioExistente.setTipoUsuario(usuario.getTipoUsuario());
        return usuarioRepository.save(usuarioExistente);
    }

    // Método responsável em excluir a usuario ( exclusão física )
    public void delete(Long id) {


        Usuario usuarioExistente = findById(id);
        usuarioRepository.delete(usuarioExistente);
    }
}
