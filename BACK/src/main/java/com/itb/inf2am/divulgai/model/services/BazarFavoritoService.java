package com.itb.inf2am.divulgai.model.services;

import com.itb.inf2am.divulgai.model.entity.Bazar;
import com.itb.inf2am.divulgai.model.entity.BazarFavorito;
import com.itb.inf2am.divulgai.model.repository.BazarFavoritoRepository;
import com.itb.inf2am.divulgai.model.repository.BazarRepository;
import com.itb.inf2am.divulgai.model.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BazarFavoritoService {
    
    @Autowired
    private BazarFavoritoRepository bazarFavoritoRepository;
    
    @Autowired
    private BazarRepository bazarRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    public List<Bazar> getBazaresFavoritos(Long usuarioId) {
        List<BazarFavorito> favoritos = bazarFavoritoRepository.findByUsuarioIdWithBazar(usuarioId);
        return favoritos.stream().map(BazarFavorito::getBazar).toList();
    }
    
    @Transactional
    public BazarFavorito adicionarFavorito(Long usuarioId, Long bazarId) {
        if (!usuarioRepository.existsById(usuarioId)) {
            throw new RuntimeException("Usuário não encontrado");
        }
        
        if (!bazarRepository.existsById(bazarId)) {
            throw new RuntimeException("Bazar não encontrado");
        }
        
        if (bazarFavoritoRepository.existsByUsuarioIdAndBazarId(usuarioId, bazarId)) {
            throw new RuntimeException("Bazar já está nos favoritos");
        }
        
        BazarFavorito favorito = new BazarFavorito(usuarioId, bazarId);
        return bazarFavoritoRepository.save(favorito);
    }
    
    @Transactional
    public void removerFavorito(Long usuarioId, Long bazarId) {
        if (!bazarFavoritoRepository.existsByUsuarioIdAndBazarId(usuarioId, bazarId)) {
            throw new RuntimeException("Favorito não encontrado");
        }
        
        bazarFavoritoRepository.deleteByUsuarioIdAndBazarId(usuarioId, bazarId);
    }
    
    public boolean isFavorito(Long usuarioId, Long bazarId) {
        return bazarFavoritoRepository.existsByUsuarioIdAndBazarId(usuarioId, bazarId);
    }
}