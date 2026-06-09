package com.agenda.controller;

import com.agenda.model.ExameLab;
import com.agenda.repository.ExameLabRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exame_lab")
@CrossOrigin(origins = "*")
public class ExameLabController {

    private final ExameLabRepository repository;

    public ExameLabController(ExameLabRepository repository) {
        this.repository = repository;
    }

    // CREATE - Criar novo exameLab
    @PostMapping
    public ResponseEntity<ExameLab> criar(@Valid @RequestBody ExameLab exameLab) {
        ExameLab salvo = repository.save(exameLab);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    // READ - Listar todos os exameLabs
    @GetMapping
    public ResponseEntity<List<ExameLab>> listar() {
        List<ExameLab> exameLabs = repository.findAllByOrderByNomeAsc();
        return ResponseEntity.ok(exameLabs);
    }

    // READ - Buscar exameLab por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(null));
    }

    // UPDATE - Atualizar exameLab
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id,
                                       @Valid @RequestBody ExameLab dados) {
        return repository.findById(id)
                .map(exameLab -> {
                    exameLab.setNome(dados.getNome());
                    exameLab.setTelefone(dados.getTelefone());
                    exameLab.setEmail(dados.getEmail());
                    exameLab.setEndereco(dados.getEndereco());
                    return ResponseEntity.ok(repository.save(exameLab));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE - Remover exameLab
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        return repository.findById(id)
                .map(exameLab -> {
                    repository.delete(exameLab);
                    return ResponseEntity.ok(Map.of("mensagem", "ExameLab removido com sucesso"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
