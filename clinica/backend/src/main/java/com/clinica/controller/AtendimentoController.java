package com.clinica.controller;

import com.clinica.model.Atendimento;
import com.clinica.repository.AtendimentoRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/atendimentos")
@CrossOrigin(origins = "http://localhost:5173")
public class AtendimentoController {

    private final AtendimentoRepository repository;

    public AtendimentoController(AtendimentoRepository repository) {
        this.repository = repository;
    }

    // CREATE - Criar novo Atendimento
    @PostMapping
    public ResponseEntity<Atendimento> inserir(@Valid @RequestBody Atendimento atendimento) {
        Atendimento salvo = repository.save(atendimento);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    // READ - Listar todos os Atendimentos
    @GetMapping
    public ResponseEntity<List<Atendimento>> listar() {
        List<Atendimento> atendimentos = repository.findAllByOrderByDataAscHorarioAsc();
        return ResponseEntity.ok(atendimentos);
    }

    // READ - Buscar Atendimento por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(null));
    }

    // READ - Buscar Atendimento por receita_saude
    @GetMapping("/receita/{receita}")
    public ResponseEntity<List<Atendimento>> buscarPorReceita(
        @PathVariable Atendimento.ReceitaSaude receita) {
            return ResponseEntity.ok(
                    repository.findByReceitaSaude(receita)
        );
    }

    // UPDATE - Atualizar Atendimento
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id,
                                       @Valid @RequestBody Atendimento dados) {
        return repository.findById(id)
                .map(comp -> {
                    comp.setData(dados.getData());
                    comp.setHorario(dados.getHorario());
                    comp.setProblemaTexto(dados.getProblemaTexto());
                    comp.setReceitaSaude(dados.getReceitaSaude());
                    return ResponseEntity.ok(repository.save(comp));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE - Remover Atendimento
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        return repository.findById(id)
                .map(comp -> {
                    repository.delete(comp);
                    return ResponseEntity.ok(Map.of("mensagem", "Atendimento removido com sucesso"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}