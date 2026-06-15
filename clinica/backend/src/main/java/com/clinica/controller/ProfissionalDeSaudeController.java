package com.agenda.controller;

import com.agenda.model.profissionaldeSaude;
import com.agenda.repository.profissionaldeSaudeRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/profissionaldeSaudes")
@CrossOrigin(origins = "*")
public class ProfissionalDeSaudeController {

    private final ProfissonalDeSaudeRepository repository;

    public ProfissionalDeSaudeController(profissionaldeSaudeRepository repository) {
        this.repository = repository;
    }

    // CREATE - Criar novo profissionaldeSaude
    @PostMapping
    public ResponseEntity<profissionaldeSaude> criar(@Valid @RequestBody ProfissionaldeSaude ProfissionaldeSaude) {
        profissionaldeSaude salvo = repository.save(profissionaldeSaude);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    // READ - Listar todos os profissionaldeSaudes
    @GetMapping
    public ResponseEntity<List<profissionaldeSaude>> listar() {
        List<profissionaldeSaude> profissionaldeSaudes = repository.findAllByOrderByDataAscHoraAsc();
        return ResponseEntity.ok(profissionaldeSaudes);
    }

    // READ - Buscar profissionaldeSaude por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(null));
    }

    // UPDATE - Atualizar profissionaldeSaude
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id,
                                       @Valid @RequestBody profissionaldeSaude dados) {
        return repository.findById(id)
                .map(comp -> {
                    comp.setTitulo(dados.getTitulo());
                    comp.setData(dados.getData());
                    comp.setHora(dados.getHora());
                    comp.setDescricao(dados.getDescricao());
                    comp.setContato(dados.getContato());
                    return ResponseEntity.ok(repository.save(comp));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE - Remover profissionaldeSaude
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        return repository.findById(id)
                .map(comp -> {
                    repository.delete(comp);
                    return ResponseEntity.ok(Map.of("mensagem", "profissionaldeSaude removido com sucesso"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
