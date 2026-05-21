package com.itb.inf2am.divulgai.model.services;


import com.itb.inf2am.divulgai.model.entity.Usuario;
import com.itb.inf2am.divulgai.model.entity.PasswordResetToken;
import com.itb.inf2am.divulgai.model.repository.BazarFavoritoRepository;
import com.itb.inf2am.divulgai.model.repository.BazarRepository;
import com.itb.inf2am.divulgai.model.repository.MensagemRepository;
import com.itb.inf2am.divulgai.model.repository.PostRepository;
import com.itb.inf2am.divulgai.model.repository.UsuarioRepository;
import com.itb.inf2am.divulgai.model.repository.PasswordResetTokenRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final BazarFavoritoRepository bazarFavoritoRepository;
    private final MensagemRepository mensagemRepository;
    private final BazarRepository bazarRepository;
    private final PostRepository postRepository;
    private final EmailService emailService;
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            PasswordResetTokenRepository passwordResetTokenRepository,
            BazarFavoritoRepository bazarFavoritoRepository,
            MensagemRepository mensagemRepository,
            BazarRepository bazarRepository,
            PostRepository postRepository,
            EmailService emailService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.bazarFavoritoRepository = bazarFavoritoRepository;
        this.mensagemRepository = mensagemRepository;
        this.bazarRepository = bazarRepository;
        this.postRepository = postRepository;
        this.emailService = emailService;
    }

    // Método responsável em listar todos os Usuarios cadastrados no banco de dados

    public List<Usuario> findAll() {
        return usuarioRepository.findAll();

    }

    // Método responsável em Criar o Usuario no banco de dados
    public Usuario save(Usuario usuario) {
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        return usuarioRepository.save(usuario);
    }
    
    // Login
    public Usuario login(String email, String senha) {
        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario != null && passwordEncoder.matches(senha, usuario.getSenha())) {
            return usuario;
        }
        return null;
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
        if (usuario.getSenha() != null && !usuario.getSenha().isEmpty()) {
            usuarioExistente.setSenha(passwordEncoder.encode(usuario.getSenha()));
        }
        usuarioExistente.setTipoUsuario(usuario.getTipoUsuario());
        return usuarioRepository.save(usuarioExistente);
    }
    
    // Método para atualizar sem validação (usado quando os campos já foram validados)
    public Usuario updateWithoutValidation(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public Usuario saveProfileUpdate(Usuario usuario, boolean senhaAlterada) {
        if (senhaAlterada) {
            usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        }
        return usuarioRepository.save(usuario);
    }

    // Método responsável em excluir a usuario ( exclusão física )
    @Transactional
    public void delete(Long id) {
        Usuario usuarioExistente = findById(id);
        bazarFavoritoRepository.deleteByUsuarioId(id);
        mensagemRepository.deleteByRemetenteIdOrDestinatarioId(id, id);
        bazarRepository.deleteByUsuarioId(id);
        postRepository.deleteByUsuarioId(id);
        passwordResetTokenRepository.deleteByUsuario(usuarioExistente);
        usuarioRepository.delete(usuarioExistente);
    }

    // Reset de Senha
    public String solicitarResetSenha(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) {
            return null; // Não revelar se email existe ou não
        }

        // Invalidar tokens anteriores não expirados do usuário
        List<PasswordResetToken> tokensAnteriores = passwordResetTokenRepository.findByUsuario(usuario);
        for (PasswordResetToken token : tokensAnteriores) {
            if (!token.isExpired() && !token.isUsed()) {
                token.setUsed(true);
                passwordResetTokenRepository.save(token);
            }
        }

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(token, usuario, 30); // 30 minutos
        passwordResetTokenRepository.save(resetToken);

        emailService.enviarEmailResetSenha(usuario.getEmail(), usuario.getNome(), token);
        return token;
    }

    public boolean confirmarResetSenha(String token, String novaSenha) {
        try {
            Optional<PasswordResetToken> optionalToken = passwordResetTokenRepository.findByToken(token);
            
            if (!optionalToken.isPresent()) {
                return false;
            }
            
            PasswordResetToken resetToken = optionalToken.get();
            
            if (resetToken.isExpired() || resetToken.isUsed()) {
                return false;
            }

            Usuario usuario = resetToken.getUsuario();
            usuario.setSenha(passwordEncoder.encode(novaSenha));
            usuarioRepository.save(usuario);

            // Marcar token como usado
            resetToken.setUsed(true);
            passwordResetTokenRepository.save(resetToken);
            
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
