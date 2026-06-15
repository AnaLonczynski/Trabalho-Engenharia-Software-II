package com.clinica.controller;

<<<<<<< HEAD:clinica/backend/src/main/java/com/clinica/controller/ProfissionalDeSaudeController.java
import com.agenda.model.profissionaldeSaude;
import com.agenda.repository.profissionaldeSaudeRepository;
=======
import com.clinica.model.Atendimento;
import com.clinica.repository.AtendimentoRepository;
>>>>>>> atendimentos:clinica/backend/src/main/java/com/clinica/controller/AtendimentoController.java
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
<<<<<<< HEAD:clinica/backend/src/main/java/com/clinica/controller/ProfissionalDeSaudeController.java
@RequestMapping("/api/profissionaldeSaudes")
@CrossOrigin(origins = "*")
public class ProfissionalDeSaudeController {
=======
@RequestMapping("/api/atendimentos")
@CrossOrigin(origins = "http://localhost:5173")
public class AtendimentoController {
>>>>>>> atendimentos:clinica/backend/src/main/java/com/clinica/controller/AtendimentoController.java

    private final ProfissonalDeSaudeRepository repository;

    public ProfissionalDeSaudeController(profissionaldeSaudeRepository repository) {
        this.repository = repository;
    }

    // CREATE - Criar novo profissionaldeSaude
    @PostMapping
<<<<<<< HEAD:clinica/backend/src/main/java/com/clinica/controller/ProfissionalDeSaudeController.java
    public ResponseEntity<profissionaldeSaude> criar(@Valid @RequestBody ProfissionaldeSaude ProfissionaldeSaude) {
        profissionaldeSaude salvo = repository.save(profissionaldeSaude);
=======
    public ResponseEntity<Atendimento> inserir(@Valid @RequestBody Atendimento atendimento) {
        Atendimento salvo = repository.save(atendimento);
>>>>>>> atendimentos:clinica/backend/src/main/java/com/clinica/controller/AtendimentoController.java
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    // READ - Listar todos os profissionaldeSaudes
    @GetMapping
<<<<<<< HEAD:clinica/backend/src/main/java/com/clinica/controller/ProfissionalDeSaudeController.java
    public ResponseEntity<List<profissionaldeSaude>> listar() {
        List<profissionaldeSaude> profissionaldeSaudes = repository.findAllByOrderByDataAscHoraAsc();
        return ResponseEntity.ok(profissionaldeSaudes);
=======
    public ResponseEntity<List<Atendimento>> listar() {
        List<Atendimento> atendimentos = repository.findAllByOrderByDataAscHorarioAsc();
        return ResponseEntity.ok(atendimentos);
>>>>>>> atendimentos:clinica/backend/src/main/java/com/clinica/controller/AtendimentoController.java
    }

    // READ - Buscar profissionaldeSaude por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(null));
    }

<<<<<<< HEAD:clinica/backend/src/main/java/com/clinica/controller/ProfissionalDeSaudeController.java
    // UPDATE - Atualizar profissionaldeSaude
=======
    // READ - Buscar Atendimento por receita_saude
    @GetMapping("/receita/{receita}")
    public ResponseEntity<List<Atendimento>> buscarPorReceita(
        @PathVariable Atendimento.ReceitaSaude receita) {
            return ResponseEntity.ok(
                    repository.findByReceitaSaude(receita)
        );
    }

    // UPDATE - Atualizar Atendimento
>>>>>>> atendimentos:clinica/backend/src/main/java/com/clinica/controller/AtendimentoController.java
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id,
                                       @Valid @RequestBody profissionaldeSaude dados) {
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
