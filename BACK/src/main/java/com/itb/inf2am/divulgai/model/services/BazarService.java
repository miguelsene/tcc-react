package com.itb.inf2am.divulgai.model.services;

import com.itb.inf2am.divulgai.model.entity.Bazar;
import com.itb.inf2am.divulgai.model.repository.BazarRepository;
import com.itb.inf2am.divulgai.model.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BazarService {
    
    private final BazarRepository bazarRepository;
    private final UsuarioRepository usuarioRepository;

    public BazarService(BazarRepository bazarRepository, UsuarioRepository usuarioRepository) {
        this.bazarRepository = bazarRepository;
        this.usuarioRepository = usuarioRepository;
    }
    
    // Listar todos os bazares ativos
    public List<Bazar> findAll() {
        return bazarRepository.findByAtivoTrue();
    }
    
    // Buscar bazar por ID
    public Bazar findById(Long id) {
        Optional<Bazar> bazar = bazarRepository.findById(id);
        if (bazar.isPresent() && bazar.get().getAtivo()) {
            return bazar.get();
        }
        throw new RuntimeException("Bazar não encontrado com o id: " + id);
    }
    
    // Salvar bazar (criar ou atualizar)
    public Bazar save(Bazar bazar) {
        return bazarRepository.save(bazar);
    }
    
    // Buscar por categoria
    public List<Bazar> findByCategoria(String categoria) {
        return bazarRepository.findByCategoriaAndAtivoTrue(categoria);
    }
    
    // Buscar por cidade
    public List<Bazar> findByCidade(String cidade) {
        return bazarRepository.findByCidadeContainingIgnoreCaseAndAtivoTrue(cidade);
    }
    
    // Buscar por nome
    public List<Bazar> findByNome(String nome) {
        return bazarRepository.findByNomeContainingIgnoreCaseAndAtivoTrue(nome);
    }
    
    // Buscar bazares de um usuário
    public List<Bazar> findByUsuario(Long usuarioId) {
        return bazarRepository.findByUsuarioIdAndAtivoTrue(usuarioId);
    }
    
    // Buscar bazares mais bem avaliados
    public List<Bazar> findTopRated() {
        return bazarRepository.findTopRated();
    }
    
    // Buscar bazares com avaliação mínima
    public List<Bazar> findByAvaliacaoMinima(Double avaliacao) {
        return bazarRepository.findByAvaliacaoMinima(avaliacao);
    }

    // Adicionar avaliação (simples - média incremental)
    public Bazar addRating(Long bazarId, Long usuarioId, int nota) {
        Bazar bazar = findById(bazarId);
        if (!usuarioRepository.existsById(usuarioId)) throw new RuntimeException("Usuário não encontrado");
        double total = bazar.getAvaliacao() * bazar.getTotalAvaliacoes();
        total += nota;
        bazar.setTotalAvaliacoes(bazar.getTotalAvaliacoes() + 1);
        bazar.setAvaliacao(total / bazar.getTotalAvaliacoes());
        return bazarRepository.save(bazar);
    }
    
    // Deletar bazar (soft delete - marca como inativo)
    public void delete(Long id) {
        Bazar bazar = findById(id);
        bazar.setAtivo(false);
        bazarRepository.save(bazar);
    }
    
    // Verificar se bazar existe
    public boolean exists(Long id) {
        return bazarRepository.existsById(id);
    }
}
