package com.clinica.repository;

import com.clinica.model.ProfissionalDeSaude;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProfissionalDeSaudeRepository extends JpaRepository<ProfissionalDeSaude, Long> {

    // Consultar por Nome (busca parcial, case-insensitive)
    List<ProfissionalDeSaude> findByNomeContainingIgnoreCase(String nome);

    // Consultar por Categoria
    List<ProfissionalDeSaude> findByCategoria(ProfissionalDeSaude.Categoria categoria);

    // Listar todos ordenados por nome
    List<ProfissionalDeSaude> findAllByOrderByNomeAsc();
}