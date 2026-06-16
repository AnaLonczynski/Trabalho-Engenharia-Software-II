package com.clinica;

import com.clinica.controller.ExameLabController;
import com.clinica.model.ExameLab;
import com.clinica.repository.ExameLabRepository;
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
 * TESTES UNITÁRIOS - Exames Laboratoriais
 */
@WebMvcTest(ExameLabController.class)
class ExameLabControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ExameLabRepository repository;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setup() {
        objectMapper = new ObjectMapper();
    }

    @Test
    void deveCriarExameComSucesso() throws Exception {
        ExameLab exame = new ExameLab();
        exame.setId(1L);
        exame.setDescricao("Hemograma Completo");

        when(repository.save(any(ExameLab.class))).thenReturn(exame);

        mockMvc.perform(post("/api/exame_lab")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(exame)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.descricao").value("Hemograma Completo"));
    }

    @Test
    void deveListarExames() throws Exception {
        ExameLab exame1 = new ExameLab();
        exame1.setId(1L);
        exame1.setDescricao("Glicemia");

        ExameLab exame2 = new ExameLab();
        exame2.setId(2L);
        exame2.setDescricao("Colesterol Total");

        when(repository.findAll()).thenReturn(Arrays.asList(exame1, exame2));

        mockMvc.perform(get("/api/exame_lab"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].descricao").value("Glicemia"))
                .andExpect(jsonPath("$[1].descricao").value("Colesterol Total"));
    }

    @Test
    void deveRetornar404ParaExameInexistente() throws Exception {
        when(repository.findById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/exame_lab/999"))
                .andExpect(status().isNotFound());
    }
}