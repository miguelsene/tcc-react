package com.itb.inf2am.divulgai.controller;

import com.itb.inf2am.divulgai.model.entity.Bazar;
import com.itb.inf2am.divulgai.model.services.BazarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bazar")
@CrossOrigin(origins = "*")
public class BazarController {
    
    @Autowired
    private BazarService bazarService;
    
    // Listar todos os bazares
    @GetMapping
    public ResponseEntity<List<Bazar>> findAll() {
        return ResponseEntity.ok(bazarService.findAll());
    }
    
    // Buscar bazar por ID
    @GetMapping("/{id}")
    public ResponseEntity<Object> findById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(bazarService.findById(Long.parseLong(id)));
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
            errorResponse.put("message", "Bazar não encontrado com o id " + id);
            return ResponseEntity.status(404).body(errorResponse);
        }
    }
    
    // Criar novo bazar
    @PostMapping
    public ResponseEntity<Bazar> create(@RequestBody Bazar bazar) {
        return ResponseEntity.ok(bazarService.save(bazar));
    }
    
    // Atualizar bazar
    @PutMapping("/{id}")
    public ResponseEntity<Object> update(@PathVariable String id, @RequestBody Bazar bazar) {
        try {
            Long bazarId = Long.parseLong(id);
            Bazar bazarExistente = bazarService.findById(bazarId);
            
            // Atualizar campos
            bazarExistente.setNome(bazar.getNome());
            bazarExistente.setDescricao(bazar.getDescricao());
            bazarExistente.setImagem(bazar.getImagem());
            bazarExistente.setCategoria(bazar.getCategoria());
            bazarExistente.setCep(bazar.getCep());
            bazarExistente.setRua(bazar.getRua());
            bazarExistente.setNumero(bazar.getNumero());
            bazarExistente.setBairro(bazar.getBairro());
            bazarExistente.setCidade(bazar.getCidade());
            bazarExistente.setTelefone(bazar.getTelefone());
            bazarExistente.setHorario(bazar.getHorario());
            
            Bazar bazarAtualizado = bazarService.save(bazarExistente);
            return ResponseEntity.ok(bazarAtualizado);
            
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
            errorResponse.put("message", "Bazar não encontrado com o id " + id);
            return ResponseEntity.status(404).body(errorResponse);
        }
    }
    
    // Deletar bazar
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable String id) {
        try {
            Long bazarId = Long.parseLong(id);
            bazarService.delete(bazarId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Bazar deletado com sucesso");
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
            errorResponse.put("message", "Bazar não encontrado com o id " + id);
            return ResponseEntity.status(404).body(errorResponse);
        }
    }
    
    // Buscar por categoria
    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<Bazar>> findByCategoria(@PathVariable String categoria) {
        return ResponseEntity.ok(bazarService.findByCategoria(categoria));
    }
    
    // Buscar por cidade
    @GetMapping("/cidade/{cidade}")
    public ResponseEntity<List<Bazar>> findByCidade(@PathVariable String cidade) {
        return ResponseEntity.ok(bazarService.findByCidade(cidade));
    }
    
    // Buscar por nome
    @GetMapping("/buscar")
    public ResponseEntity<List<Bazar>> findByNome(@RequestParam String nome) {
        return ResponseEntity.ok(bazarService.findByNome(nome));
    }
    
    // Buscar bazares de um usuário
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Bazar>> findByUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(bazarService.findByUsuario(usuarioId));
    }
    
    // Buscar bazares mais bem avaliados
    @GetMapping("/top-rated")
    public ResponseEntity<List<Bazar>> findTopRated() {
        return ResponseEntity.ok(bazarService.findTopRated());
    }
    
    // Endpoint de debug para testar atualização
    @PostMapping("/debug/{id}")
    public ResponseEntity<Object> debugUpdate(@PathVariable Long id, @RequestBody Bazar bazar) {
        try {
            Bazar bazarExistente = bazarService.findById(id);
            Map<String, Object> debug = new HashMap<>();
            debug.put("bazarOriginal", bazarExistente);
            debug.put("dadosRecebidos", bazar);
            return ResponseEntity.ok(debug);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("erro", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}