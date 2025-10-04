package com.itb.inf2am.divulgai.controller;

import com.itb.inf2am.divulgai.model.entity.Bazar;
import com.itb.inf2am.divulgai.model.entity.BazarFavorito;
import com.itb.inf2am.divulgai.model.services.BazarFavoritoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favoritos")
@CrossOrigin(origins = "*")
public class BazarFavoritoController {
    
    @Autowired
    private BazarFavoritoService bazarFavoritoService;
    
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Bazar>> getBazaresFavoritos(@PathVariable Long usuarioId) {
        try {
            List<Bazar> favoritos = bazarFavoritoService.getBazaresFavoritos(usuarioId);
            return ResponseEntity.ok(favoritos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/usuario/{usuarioId}/bazar/{bazarId}")
    public ResponseEntity<BazarFavorito> adicionarFavorito(@PathVariable Long usuarioId, @PathVariable Long bazarId) {
        try {
            BazarFavorito favorito = bazarFavoritoService.adicionarFavorito(usuarioId, bazarId);
            return ResponseEntity.ok(favorito);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/usuario/{usuarioId}/bazar/{bazarId}")
    public ResponseEntity<Void> removerFavorito(@PathVariable Long usuarioId, @PathVariable Long bazarId) {
        try {
            bazarFavoritoService.removerFavorito(usuarioId, bazarId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/usuario/{usuarioId}/bazar/{bazarId}/check")
    public ResponseEntity<Boolean> isFavorito(@PathVariable Long usuarioId, @PathVariable Long bazarId) {
        boolean isFavorito = bazarFavoritoService.isFavorito(usuarioId, bazarId);
        return ResponseEntity.ok(isFavorito);
    }
}