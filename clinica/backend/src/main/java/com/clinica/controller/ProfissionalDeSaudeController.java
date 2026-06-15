package com.clinica.controller;

import com.clinica.model.ProfissionalDeSaude;
import com.clinica.repository.ProfissionalDeSaudeRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/profissional_de_saude")
@CrossOrigin(origins = "http://localhost:5173")
public class ProfissionalDeSaudeController {

    private final ProfissionalDeSaudeRepository repository;

    public ProfissionalDeSaudeController(ProfissionalDeSaudeRepository repository) {
        this.repository = repository;
    }

    // Inserir - Criar novo ProfissionalDeSaude
    @PostMapping
    public ResponseEntity<ProfissionalDeSaude> criar(@Valid @RequestBody ProfissionalDeSaude profissionalDeSaude) {
        ProfissionalDeSaude salvo = repository.save(profissionalDeSaude);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    // Listar todos os ProfissionaisDeSaude
    @GetMapping
    public ResponseEntity<List<ProfissionalDeSaude>> listar() {
        List<ProfissionalDeSaude> profissionais = repository.findAllByOrderByNomeAsc();
        return ResponseEntity.ok(profissionais);
    }

    // Consultar por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    // Consultar por Nome
    @GetMapping("/buscar")
    public ResponseEntity<List<ProfissionalDeSaude>> buscarPorNome(@RequestParam String nome) {
        List<ProfissionalDeSaude> profissionais = repository.findByNomeContainingIgnoreCase(nome);
        return ResponseEntity.ok(profissionais);
    }

    // Consultar por Categoria
    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<ProfissionalDeSaude>> buscarPorCategoria(
            @PathVariable ProfissionalDeSaude.Categoria categoria) {
        List<ProfissionalDeSaude> profissionais = repository.findByCategoria(categoria);
        return ResponseEntity.ok(profissionais);
    }

    // Alterar - Atualizar ProfissionalDeSaude por ID
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id,
                                       @Valid @RequestBody ProfissionalDeSaude dados) {
        return repository.findById(id)
                .map(profissional -> {
                    profissional.setNome(dados.getNome());
                    profissional.setTelefone(dados.getTelefone());
                    profissional.setEndereco(dados.getEndereco());
                    profissional.setCategoria(dados.getCategoria());
                    return ResponseEntity.ok(repository.save(profissional));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Excluir - Remover ProfissionalDeSaude por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        return repository.findById(id)
                .map(profissional -> {
                    repository.delete(profissional);
                    return ResponseEntity.ok(Map.of("mensagem", "ProfissionalDeSaude removido com sucesso"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}