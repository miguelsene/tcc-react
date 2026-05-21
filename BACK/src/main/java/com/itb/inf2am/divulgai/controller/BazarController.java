package com.itb.inf2am.divulgai.controller;

import com.itb.inf2am.divulgai.dto.BazarCreateDTO;
import com.itb.inf2am.divulgai.dto.BazarResponseDTO;
import com.itb.inf2am.divulgai.dto.BazarUpdateDTO;
import com.itb.inf2am.divulgai.model.entity.Bazar;
import com.itb.inf2am.divulgai.model.services.BazarService;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bazar")
public class BazarController {

    private final BazarService bazarService;

    public BazarController(BazarService bazarService) {
        this.bazarService = bazarService;
    }

    @GetMapping
    public ResponseEntity<List<BazarResponseDTO>> findAll() {
        return ResponseEntity.ok(toResponseList(bazarService.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> findById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(new BazarResponseDTO(bazarService.findById(Long.parseLong(id))));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(error(400, "Bad Request", "O id informado nao e valido: " + id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(error(404, "Not Found", "Bazar nao encontrado com o id " + id));
        }
    }

    @PostMapping
    public ResponseEntity<BazarResponseDTO> create(@Valid @RequestBody BazarCreateDTO dados) {
        return ResponseEntity.ok(new BazarResponseDTO(bazarService.save(dados.toEntity())));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> update(@PathVariable String id, @Valid @RequestBody BazarUpdateDTO dados) {
        try {
            Bazar bazarExistente = bazarService.findById(Long.parseLong(id));
            aplicarAtualizacao(bazarExistente, dados);
            return ResponseEntity.ok(new BazarResponseDTO(bazarService.save(bazarExistente)));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(error(400, "Bad Request", "O id informado nao e valido: " + id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(error(404, "Not Found", "Bazar nao encontrado com o id " + id));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable String id) {
        try {
            bazarService.delete(Long.parseLong(id));
            return ResponseEntity.ok(message("Bazar deletado com sucesso"));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(error(400, "Bad Request", "O id informado nao e valido: " + id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(error(404, "Not Found", "Bazar nao encontrado com o id " + id));
        }
    }

    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<BazarResponseDTO>> findByCategoria(@PathVariable String categoria) {
        return ResponseEntity.ok(toResponseList(bazarService.findByCategoria(categoria)));
    }

    @GetMapping("/cidade/{cidade}")
    public ResponseEntity<List<BazarResponseDTO>> findByCidade(@PathVariable String cidade) {
        return ResponseEntity.ok(toResponseList(bazarService.findByCidade(cidade)));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<BazarResponseDTO>> findByNome(@RequestParam String nome) {
        return ResponseEntity.ok(toResponseList(bazarService.findByNome(nome)));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<BazarResponseDTO>> findByUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(toResponseList(bazarService.findByUsuario(usuarioId)));
    }

    @GetMapping("/top-rated")
    public ResponseEntity<List<BazarResponseDTO>> findTopRated() {
        return ResponseEntity.ok(toResponseList(bazarService.findTopRated()));
    }

    @PostMapping("/{id}/avaliar")
    public ResponseEntity<BazarResponseDTO> avaliarBazar(
            @PathVariable Long id,
            @RequestParam Long usuarioId,
            @RequestBody Map<String, Integer> body) {
        try {
            Integer nota = body.get("nota");
            if (nota == null || nota < 1 || nota > 5) {
                return ResponseEntity.badRequest().build();
            }
            return ResponseEntity.ok(new BazarResponseDTO(bazarService.addRating(id, usuarioId, nota)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    private void aplicarAtualizacao(Bazar bazar, BazarUpdateDTO dados) {
        bazar.setNome(dados.getNome());
        bazar.setDescricao(dados.getDescricao());
        bazar.setImagem(dados.getImagem());
        bazar.setCategoria(dados.getCategoria());
        bazar.setCep(dados.getCep());
        bazar.setRua(dados.getRua());
        bazar.setNumero(dados.getNumero());
        bazar.setBairro(dados.getBairro());
        bazar.setCidade(dados.getCidade());
        bazar.setTelefone(dados.getTelefone());
        bazar.setHorario(dados.getHorario());
    }

    private List<BazarResponseDTO> toResponseList(List<Bazar> bazares) {
        return bazares.stream().map(BazarResponseDTO::new).collect(Collectors.toList());
    }

    private Map<String, String> message(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return response;
    }

    private Map<String, Object> error(int status, String error, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", status);
        response.put("error", error);
        response.put("message", message);
        return response;
    }
}
