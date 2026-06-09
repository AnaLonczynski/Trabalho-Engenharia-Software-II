package com.agenda.controller;

import com.agenda.model.Atendimento;
import com.agenda.repository.AtendimentoRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/atendimentos")
@CrossOrigin(origins = "*")
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
        List<Atendimento> atendimentos = repository.findAllByOrderByDataAscHoraAsc();
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
    public ResponseEntity<List<Atendimento>> buscarPorReceita(@PathVariable String receita) {
        List<Atendimento> atendimentos = repository.findByReceitaSaudeContainingIgnoreCase(receita);
        return ResponseEntity.ok(atendimentos);
    }

    // UPDATE - Atualizar Atendimento
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id,
                                       @Valid @RequestBody Atendimento dados) {
        return repository.findById(id)
                .map(comp -> {
                    comp.setData(dados.getData());
                    comp.setHorario(dados.getHorario());
                    comp.setProblema_Texto(dados.getProblema_Texto());
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
