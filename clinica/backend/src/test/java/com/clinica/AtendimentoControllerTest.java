package com.clinica;

import com.clinica.controller.AtendimentoController;
import com.clinica.model.Atendimento;
import com.clinica.repository.AtendimentoRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * TESTES UNITÁRIOS - Atendimentos
 */
@WebMvcTest(AtendimentoController.class)
class AtendimentoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AtendimentoRepository repository;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setup() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Test
    void deveCriarAtendimentoComSucesso() throws Exception {
        Atendimento atend = new Atendimento();
        atend.setId(1L);
        atend.setProblemaTexto("Paciente com dores abdominais");
        atend.setData(LocalDate.of(2026, 6, 18));
        atend.setHorario(LocalTime.of(15, 0));

        when(repository.save(any(Atendimento.class))).thenReturn(atend);

        mockMvc.perform(post("/api/atendimentos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(atend)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.problemaTexto").value("Paciente com dores abdominais"));
    }

    @Test
    void deveListarAtendimentos() throws Exception {
        Atendimento atend1 = new Atendimento();
        atend1.setId(1L);
        atend1.setProblemaTexto("Retorno de exames");
        atend1.setData(LocalDate.of(2026, 6, 18));

        Atendimento atend2 = new Atendimento();
        atend2.setId(2L);
        atend2.setProblemaTexto("Sessão de fisioterapia");
        atend2.setData(LocalDate.of(2026, 6, 19));

        when(repository.findAll()).thenReturn(Arrays.asList(atend1, atend2));

        mockMvc.perform(get("/api/atendimentos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].problemaTexto").value("Retorno de exames"))
                .andExpect(jsonPath("$[1].problemaTexto").value("Sessão de fisioterapia"));
    }

    @Test
    void deveRetornar404ParaAtendimentoInexistente() throws Exception {
        when(repository.findById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/atendimentos/999"))
                .andExpect(status().isNotFound());
    }
}