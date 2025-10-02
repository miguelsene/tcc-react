package com.fashionspace.controller;

import com.fashionspace.dto.BazarDTO;
import com.fashionspace.service.BazarService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller REST para Bazar
 * Define todas as rotas da API
 */
@RestController
@RequestMapping("/api/bazares")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class BazarController {

    @Autowired
    private BazarService bazarService;

    /**
     * GET /api/bazares
     * Listar todos os bazares (com filtros opcionais)
     */
    @GetMapping
    public ResponseEntity<List<BazarDTO>> listarBazares(
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String busca) {
        
        try {
            List<BazarDTO> bazares = bazarService.buscarComFiltros(categoria, busca);
            return ResponseEntity.ok(bazares);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/bazares/{id}
     * Buscar um bazar específico por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarBazar(@PathVariable Long id) {
        try {
            BazarDTO bazar = bazarService.buscarPorId(id);
            return ResponseEntity.ok(bazar);
        } catch (RuntimeException e) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erro);
        }
    }

    /**
     * POST /api/bazares
     * Criar um novo bazar
     */
    @PostMapping
    public ResponseEntity<?> criarBazar(@Valid @RequestBody BazarDTO bazarDTO) {
        try {
            BazarDTO bazarCriado = bazarService.criar(bazarDTO);
            
            Map<String, Object> resposta = new HashMap<>();
            resposta.put("mensagem", "Bazar criado com sucesso!");
            resposta.put("id", bazarCriado.getId());
            resposta.put("bazar", bazarCriado);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
        } catch (RuntimeException e) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
        }
    }

    /**
     * PUT /api/bazares/{id}
     * Atualizar um bazar existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarBazar(
            @PathVariable Long id,
            @Valid @RequestBody BazarDTO bazarDTO) {
        
        try {
            BazarDTO bazarAtualizado = bazarService.atualizar(id, bazarDTO);
            
            Map<String, Object> resposta = new HashMap<>();
            resposta.put("mensagem", "Bazar atualizado com sucesso!");
            resposta.put("bazar", bazarAtualizado);
            
            return ResponseEntity.ok(resposta);
        } catch (RuntimeException e) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", e.getMessage());
            
            if (e.getMessage().contains("não encontrado")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erro);
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
        }
    }

    /**
     * DELETE /api/bazares/{id}
     * Deletar um bazar
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarBazar(@PathVariable Long id) {
        try {
            bazarService.deletar(id);
            
            Map<String, String> resposta = new HashMap<>();
            resposta.put("mensagem", "Bazar deletado com sucesso!");
            
            return ResponseEntity.ok(resposta);
        } catch (RuntimeException e) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erro);
        }
    }

    /**
     * GET /api/bazares/cidade/{cidade}
     * Buscar bazares por cidade
     */
    @GetMapping("/cidade/{cidade}")
    public ResponseEntity<List<BazarDTO>> buscarPorCidade(@PathVariable String cidade) {
        try {
            List<BazarDTO> bazares = bazarService.buscarPorCidade(cidade);
            return ResponseEntity.ok(bazares);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/bazares/estatisticas
     * Obter estatísticas dos bazares
     */
    @GetMapping("/estatisticas")
    public ResponseEntity<Map<String, Object>> obterEstatisticas() {
        try {
            Map<String, Object> estatisticas = new HashMap<>();
            estatisticas.put("total", bazarService.contarTotal());
            
            // Contar por categoria
            String[] categorias = {
                "Bazar de Luxo", "Sebo", "Vintage", "Outlet", 
                "Artesanal", "Infantil", "Fitness"
            };
            
            Map<String, Long> porCategoria = new HashMap<>();
            for (String categoria : categorias) {
                porCategoria.put(categoria, bazarService.contarPorCategoria(categoria));
            }
            estatisticas.put("porCategoria", porCategoria);
            
            return ResponseEntity.ok(estatisticas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
