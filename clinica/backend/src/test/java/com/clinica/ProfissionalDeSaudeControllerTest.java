package com.clinica;

import com.clinica.controller.ProfissionalDeSaudeController;
import com.clinica.model.ProfissionalDeSaude;
import com.clinica.repository.ProfissionalDeSaudeRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * TESTES UNITÁRIOS - Profissionais de Saúde
 */
@WebMvcTest(ProfissionalDeSaudeController.class)
class ProfissionalDeSaudeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProfissionalDeSaudeRepository repository;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setup() {
        objectMapper = new ObjectMapper();
    }

    @Test
    void deveCriarProfissionalComSucesso() throws Exception {
        ProfissionalDeSaude prof = new ProfissionalDeSaude();
        prof.setId(1L);
        prof.setNome("Carlos Machado");
        prof.setCategoria("MEDICO");
        prof.setTelefone("31998547564");

        when(repository.save(any(ProfissionalDeSaude.class))).thenReturn(prof);

        mockMvc.perform(post("/api/profissional_de_saude")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(prof)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome").value("Carlos Machado"))
                .andExpect(jsonPath("$.categoria").value("MEDICO"));
    }

    @Test
    void deveListarProfissionais() throws Exception {
        ProfissionalDeSaude prof1 = new ProfissionalDeSaude();
        prof1.setId(1L);
        prof1.setNome("Carlos Machado");

        ProfissionalDeSaude prof2 = new ProfissionalDeSaude();
        prof2.setId(2L);
        prof2.setNome("Maria Rodrigues");

        when(repository.findAll()).thenReturn(Arrays.asList(prof1, prof2));

        mockMvc.perform(get("/api/profissional_de_saude"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nome").value("Carlos Machado"))
                .andExpect(jsonPath("$[1].nome").value("Maria Rodrigues"));
    }

    @Test
    void deveRetornar404ParaProfissionalInexistente() throws Exception {
        when(repository.findById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/profissional_de_saude/999"))
                .andExpect(status().isNotFound());
    }
}