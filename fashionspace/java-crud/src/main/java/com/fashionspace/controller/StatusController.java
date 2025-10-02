package com.fashionspace.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Controller para verificar status da API
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class StatusController {

    /**
     * GET /api/status
     * Verificar se a API está funcionando
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> verificarStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "online");
        status.put("mensagem", "API FashionSpace funcionando!");
        status.put("versao", "1.0.0");
        status.put("timestamp", LocalDateTime.now());
        
        return ResponseEntity.ok(status);
    }

    /**
     * GET /api/info
     * Informações sobre a API
     */
    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> obterInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("nome", "FashionSpace API");
        info.put("descricao", "API REST para gerenciar bazares");
        info.put("versao", "1.0.0");
        info.put("autor", "Estudante TCC");
        
        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("GET /api/status", "Verificar status da API");
        endpoints.put("GET /api/bazares", "Listar todos os bazares");
        endpoints.put("GET /api/bazares/{id}", "Buscar um bazar");
        endpoints.put("POST /api/bazares", "Criar novo bazar");
        endpoints.put("PUT /api/bazares/{id}", "Atualizar bazar");
        endpoints.put("DELETE /api/bazares/{id}", "Deletar bazar");
        endpoints.put("GET /api/bazares/cidade/{cidade}", "Buscar por cidade");
        endpoints.put("GET /api/bazares/estatisticas", "Estatísticas");
        
        info.put("endpoints", endpoints);
        
        return ResponseEntity.ok(info);
    }
}
